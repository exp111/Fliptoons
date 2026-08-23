import {
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { HireEvent, MarketComponent } from './market-component/market-component';
import { DismissEvent, SlotComponent } from './slot-component/slot-component';
import { Card, GameData } from '../../model/card';
import { cardsSeason1, cardsSeason1Starter, prices, soloBlacklist } from '../../model/data';
import { shuffleArray } from '../utils';
import { Phase } from '../../model/phase';
import { Slot } from '../../model/slot';
import { CheatMenuComponent } from './cheat-menu-component/cheat-menu-component';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { PromptOptions } from '../../model/prompt';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-component',
  imports: [MarketComponent, SlotComponent, CheatMenuComponent, FormsModule],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  AMOUNT_SLOTS = 6;
  MARKET_SIZE = 5;
  CARD_DRAW_TIME = 500;
  MARKET_ACTIONS = 2;

  flagParser = (v: unknown) => v !== undefined;
  allowCheats = input(false, { transform: this.flagParser });
  manual = input(false, { transform: this.flagParser });

  currentPhase = signal<Phase>(Phase.FLIP);
  marketDeck = signal<Card[]>(this.buildMarketDeck());
  marketDiscard = signal<Card[]>([]);
  market = signal<Card[]>(this.sortByRank(this.drawCards(this.marketDeck, this.MARKET_SIZE)));

  deck = signal<Card[]>(this.buildPlayerDeck());
  dismissed = signal<Card[]>([]);
  playedCards = signal<Card[]>([]);
  grid = signal<Slot[]>(this.buildGrid());

  currentFame = signal(0);
  marketActionsLeft = signal(0);
  canHireOrDismiss = computed(() => this.marketActionsLeft() > 0);
  isWorking = signal(false);

  promptDialog = viewChild.required<ElementRef<HTMLDialogElement>>('promptDialog');
  multiPromptDialog = viewChild.required<ElementRef<HTMLDialogElement>>('multiPromptDialog');
  promptOptions = signal<PromptOptions>({ options: [], text: '' });
  multiPromptSelection: boolean[] = [];
  promptHold = new Subject<Card | null>();
  multiPromptHold = new Subject<Card[]>();

  nextText = computed(() => {
    switch (this.currentPhase()) {
      case Phase.FLIP:
        return 'Flip';
      case Phase.MARKET:
        return 'End Market';
      default:
        return 'Next';
    }
  });

  gameData = computed<GameData>(() => ({
    market: this.market(),
    grid: this.grid(),
    dismissed: this.dismissed(),
    playedCards: this.playedCards(),
    deck: this.deck(),
    marketDeck: this.marketDeck(),
    // methods
    addMarketAction: () => this.marketActionsLeft.update((a) => a + 1),
    addFame: (fame: number) => this.currentFame.update((f) => f + fame),
    // opens dialog and returns promise to wait for result
    prompt: (options: PromptOptions) => {
      this.promptOptions.set(options);
      this.promptDialog().nativeElement.showModal();
      return firstValueFrom(this.promptHold);
    },
    multiPrompt: (options: PromptOptions) => {
      this.promptOptions.set(options);
      this.multiPromptSelection = new Array(options.options.length).fill(false);
      this.multiPromptDialog().nativeElement.showModal();
      return firstValueFrom(this.multiPromptHold);
    },
    dismissCard: (card: Card, slot?: Slot) => this.dismissCard(card, slot),
    dismissCardMarket: (card: Card) => this.dismissCardMarket(card),
    refillMarket: (totalAmount = this.MARKET_SIZE) => this.refillMarket(totalAmount),
    drawDeck: (amount) => this.drawCards(this.deck, amount),
    drawMarketDeck: (amount) => this.drawMarketCards(amount)
  }));

  // closes dialog and emits the result to the promise
  chooseOption(option: Card | null) {
    this.promptDialog().nativeElement.close();
    this.promptHold.next(option);
  }

  chooseOptions() {
    let options = this.promptOptions().options.filter(
      (o, i) => o && this.multiPromptSelection[i],
    ) as Card[];
    this.multiPromptDialog().nativeElement.close();
    this.multiPromptHold.next(options);
  }

  private sortByRank(array: Card[]) {
    return array.sort((a, b) => a.rank - b.rank);
  }

  private buildGrid() {
    let arr = [];
    for (let i = 0; i < this.AMOUNT_SLOTS; i++) {
      arr.push(new Slot());
    }
    return arr;
  }

  private buildDeck(array: Card[]) {
    // clone cards count times
    let deck: Card[] = [];
    for (let card of array) {
      for (let i = 0; i < card.count; i++) {
        deck.push(card.clone());
      }
    }
    // then shuffle + filter out
    return shuffleArray(
      [...deck]
        // filter out cards removed in solo
        .filter((c) => !soloBlacklist.includes(c.name)),
    );
  }

  buildPlayerDeck() {
    return this.buildDeck(cardsSeason1Starter);
  }

  buildMarketDeck() {
    //TODO: remove N cards for solo
    return this.buildDeck(cardsSeason1);
  }

  drawCards(deck: WritableSignal<Card[]>, amount: number) {
    let out = deck().slice(0, amount);
    deck.update((d) => d.slice(amount));
    return out;
  }

  drawCard(deck: WritableSignal<Card[]>) {
    return this.drawCards(deck, 1)[0];
  }

  async onHire(e: HireEvent) {
    if (!confirm(`Do you want to hire '${e.card.name}' for '${e.price}' fame.`)) {
      return;
    }
    // remove card from market
    this.market.update((m) => m.filter((c) => c !== e.card));
    // add to deck
    this.deck.update((d) => [...d, e.card]);
    // take money
    this.currentFame.update((f) => f - e.price);
    // use action
    this.marketActionsLeft.update((a) => a - 1);
    // trigger event
    await e.card.onHire(this.gameData());
  }

  onDismiss(e: DismissEvent) {
    if (!confirm(`Do you want to dismiss '${e.card.name}' for '${e.cost}' fame.`)) {
      return;
    }
    this.dismissCard(e.card, e.slot);
    // take money
    this.currentFame.update((f) => f - e.cost);
    // use action
    this.marketActionsLeft.update((f) => f - 1);
  }

  dismissCard(card: Card, slot?: Slot) {
    if (slot) {
      // remove card from grid
      slot.removeCard(card);
    }
    // add to dismiss pile
    this.dismissed.update((d) => [...d, card]);
  }

  dismissCardMarket(card: Card) {
    this.market.update((m) => m.filter((c) => c !== card));
    this.marketDiscard.update((d) => [...d, card]);
  }

  // returns null if not enough cards could be drawn
  drawMarketCards(amount: number) {
    let cards = this.drawCards(this.marketDeck, amount);
    // if market deck is empty, game is lost
    if (cards.length < amount) {
      this.changePhase(Phase.LOST);
      return null;
    }
    return cards;
  }

  refillMarket(totalAmount = this.MARKET_SIZE) {
    let missingCards = totalAmount - this.market().length;
    if (missingCards == 0) {
      return true;
    }
    // refill
    let cards = this.drawMarketCards(missingCards);
    if (!cards) {
      return;
    }
    // add to market + sort
    this.market.update((m) => this.sortByRank([...this.market(), ...cards]));
    return true;
  }

  calculateFame() {
    this.currentFame.set(
      this.grid()
        .map((c) => c.getFame(this.gameData()))
        .reduce((a, b) => a + b, 0),
    );
  }

  async playCard(slot: Slot, card: Card) {
    slot.addCard(card);
    // add card to history
    this.playedCards.update((c) => [...c, card]);
    // trigger card played event
    for (const s of this.grid()) {
      await s.onCardPlayed(this.gameData(), card);
    }
  }

  changePhase(phase: Phase) {
    let previous = this.currentPhase();
    this.currentPhase.set(phase);
    this.grid().forEach(async (s) => await s.onPhaseChange(this.gameData(), previous, phase));
  }

  // state machine
  async nextPhase() {
    this.isWorking.set(true);
    switch (this.currentPhase()) {
      case Phase.FLIP:
        await this.flipCards();
        if (!this.manual()) {
          await this.nextPhase();
        }
        break;
      case Phase.CHECK_FAME:
        await this.checkFame();
        break;
      case Phase.MARKET:
        let res = await this.marketPhase();
        if (res && !this.manual()) {
          await this.nextPhase();
        }
        break;
      case Phase.CLEANUP:
        await this.cleanup();
        break;
      case Phase.WON:
        alert('You won!');
        break;
      case Phase.LOST:
        alert('You lost!');
        break;
      default:
        console.error(`Unknown phase: ${this.currentPhase()}. Resetting.`);
        this.changePhase(Phase.FLIP);
        break;
    }
    this.isWorking.set(false);
  }

  getNextEmptySlot() {
    return this.grid().find((s) => s.cards().length == 0);
  }

  shuffle() {
    this.deck.update((d) => shuffleArray(d));
  }

  async flipCards() {
    // fill slots until no slots are left or the deck is empty
    while (this.deck().length > 0) {
      let nextSlot = this.getNextEmptySlot();
      // no slots left
      if (!nextSlot) {
        break;
      }
      let card = this.drawCard(this.deck);
      await this.playCard(nextSlot, card);
      this.calculateFame();
      // wait
      await new Promise((resolve) => setTimeout(resolve, this.CARD_DRAW_TIME));
    }
    this.changePhase(Phase.CHECK_FAME);
  }

  async checkFame() {
    if (this.currentFame() >= 30) {
      this.changePhase(Phase.WON);
      return;
    }
    this.changePhase(Phase.MARKET);
    // set market actions
    this.marketActionsLeft.set(this.MARKET_ACTIONS);
  }

  canDoAnythingInMarket() {
    // if no actions left, cant do anything
    if (this.marketActionsLeft() == 0) {
      return false;
    }
    // can still buy anything from market?
    if (this.market().length > 0 && this.currentFame() >= prices[0]) {
      return true;
    }
    // can still dismiss cards from grid?
    if (
      this.grid().some((s) => s.cards().some((d) => this.currentFame() >= d.card.getDismissCost()))
    ) {
      return true;
    }
    return false;
  }

  async marketPhase() {
    if (this.canDoAnythingInMarket()) {
      if (!confirm('You still have market actions left. Do you want to continue to cleanup?')) {
        return false;
      }
    }
    if (!this.refillMarket()) {
      return false;
    }
    this.marketActionsLeft.set(0);
    this.changePhase(Phase.CLEANUP);
    return true;
  }

  async cleanup() {
    // collect cards back into deck
    for (let slot of this.grid()) {
      let cards = slot.cleanup();
      this.deck.update((d) => [...d, ...cards]);
    }
    // clean history
    this.playedCards.set([]);
    // discard left most and right most market cards
    let left = this.market()[0];
    let right = this.market()[this.market().length - 1];
    this.dismissCardMarket(left);
    this.dismissCardMarket(right);
    if (!this.refillMarket()) {
      return;
    }
    this.changePhase(Phase.FLIP);
    this.shuffle();
  }

  protected readonly Phase = Phase;
}
