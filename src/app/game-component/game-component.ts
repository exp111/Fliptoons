import { Component, computed, input, signal, WritableSignal } from '@angular/core';
import { HireEvent, MarketComponent } from './market-component/market-component';
import { DismissEvent, SlotComponent } from './slot-component/slot-component';
import { Card, GameData } from '../../model/card';
import { cardsSeason1, cardsSeason1Starter, soloBlacklist } from '../../model/data';
import { shuffleArray } from '../utils';
import { Phase } from '../../model/phase';
import { Slot } from '../../model/slot';
import { CheatMenuComponent } from './cheat-menu-component/cheat-menu-component';

@Component({
  selector: 'app-game-component',
  imports: [MarketComponent, SlotComponent, CheatMenuComponent],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  AMOUNT_SLOTS = 6;
  MARKET_SIZE = 5;
  CARD_DRAW_TIME = 500;
  MARKET_ACTIONS = 2;

  allowCheats = input(false, { transform: (v) => v !== undefined });

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

  gameData = computed<GameData>(() => ({
    market: this.market(),
    grid: this.grid(),
    dismissed: this.dismissed(),
    playedCards: this.playedCards(),
    // methods
    addMarketAction: () => this.marketActionsLeft.update(a => a + 1),
    addFame: (fame: number) => this.currentFame.update(f => f + fame)
  }));

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

  onHire(e: HireEvent) {
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
    e.card.onHire(this.gameData());
  }

  onDismiss(e: DismissEvent) {
    if (!confirm(`Do you want to dismiss '${e.card.name}' for '${e.cost}' fame.`)) {
      return;
    }
    // remove card from grid
    e.slot.removeCard(e.card);
    // add to dismiss pile
    this.dismissed.update((d) => [...d, e.card]);
    // take money
    this.currentFame.update((f) => f - e.cost);
    // use action
    this.marketActionsLeft.update((f) => f - 1);
  }

  refillMarket() {
    let missingCards = this.MARKET_SIZE - this.market().length;
    if (missingCards == 0) {
      return true;
    }
    // refill
    let cards = this.drawCards(this.marketDeck, missingCards);
    // if market deck is empty, game is lost
    if (cards.length < missingCards) {
      this.currentPhase.set(Phase.LOST);
      return false;
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

  playCard(slot: Slot, card: Card) {
    slot.addCard(card);
    // add card to history
    this.playedCards.update((c) => [...c, card]);
    // trigger card played event
    this.grid().forEach((s) => s.onCardPlayed(this.gameData(), card));
  }

  // state machine
  async nextPhase() {
    this.isWorking.set(true);
    switch (this.currentPhase()) {
      case Phase.FLIP:
        await this.flipCards();
        break;
      case Phase.CHECK_FAME:
        await this.checkFame();
        break;
      case Phase.MARKET:
        await this.marketPhase();
        break;
      case Phase.CLEANUP:
        await this.cleanup();
        break;
      default:
        console.error(`Unknown phase: ${this.currentPhase()}. Resetting.`);
        this.currentPhase.set(Phase.FLIP);
        break;
    }
    this.isWorking.set(false);
  }

  getNextEmptySlot() {
    return this.grid().find((s) => s.cards().length == 0);
  }

  async flipCards() {
    // shuffle cards back into deck
    this.deck.update((d) => shuffleArray(d));
    // fill slots until no slots are left or the deck is empty
    while (this.deck().length > 0) {
      let nextSlot = this.getNextEmptySlot();
      // no slots left
      if (!nextSlot) {
        break;
      }
      let card = this.drawCard(this.deck);
      this.playCard(nextSlot, card);
      this.calculateFame();
      // wait
      await new Promise((resolve) => setTimeout(resolve, this.CARD_DRAW_TIME));
    }
    this.currentPhase.set(Phase.CHECK_FAME);
  }

  async checkFame() {
    if (this.currentFame() >= 30) {
      this.currentPhase.set(Phase.WON);
      return;
    }
    this.currentPhase.set(Phase.MARKET);
    // set market actions
    this.marketActionsLeft.set(this.MARKET_ACTIONS);
  }

  async marketPhase() {
    if (this.marketActionsLeft() > 0) {
      if (!confirm('You still have market actions left. Do you want to continue to cleanup?')) {
        return;
      }
    }
    if (!this.refillMarket()) {
      return;
    }
    this.marketActionsLeft.set(0);
    this.currentPhase.set(Phase.CLEANUP);
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
    this.marketDiscard.update((d) => [...d, left, right]);
    if (!this.refillMarket()) {
      return;
    }
    this.currentPhase.set(Phase.FLIP);
  }

  protected readonly Phase = Phase;
}
