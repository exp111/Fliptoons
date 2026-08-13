import { Component, computed, signal, WritableSignal } from '@angular/core';
import { MarketComponent } from './market-component/market-component';
import { SlotComponent } from './slot-component/slot-component';
import { Card } from '../../model/card';
import { cardsSeason1, cardsSeason1Starter, soloBlacklist } from '../../model/data';
import { shuffleArray } from '../utils';
import {Phase} from '../../model/phase';

@Component({
  selector: 'app-game-component',
  imports: [MarketComponent, SlotComponent],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  AMOUNT_SLOTS = 6;
  CARD_DRAW_TIME = 500;
  MARKET_ACTIONS = 2;
  fake_slots = Array(6);

  currentPhase = signal<Phase>(Phase.FLIP);
  marketDeck = signal<Card[]>(this.buildMarketDeck());
  marketDiscard = signal<Card[]>([]);
  market = signal<Card[]>(this.sortByRank(this.drawCards(this.marketDeck, 5)));

  deck = signal<Card[]>(this.buildPlayerDeck());
  slots = signal<Card[]>([]);
  currentFame = computed(() =>
    this.slots()
      .map((c) => c.fame)
      .reduce((a, b) => a + b, 0),
  );
  marketActionsLeft = signal(0);
  isWorking = signal(false);

  constructor() {}

  private sortByRank(array: Card[]) {
    return array.sort((a, b) => a.rank - b.rank);
  }

  private buildDeck(array: Card[]) {
    // clone cards count times
    let deck = [];
    for (let card of array) {
      for (let i = 0; i < card.count; i++) {
        deck.push({ ...card });
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

  async flipCards() {
    // shuffle cards back into deck
    this.deck.update(d => shuffleArray(d));
    // repeat until slots full or deck empty
    while (this.slots().length <= this.AMOUNT_SLOTS && this.deck().length > 0) {
      let card = this.drawCard(this.deck);
      this.slots.update((s) => [...s, card]);
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
      if (!confirm("You still have market actions left. Do you want to continue to cleanup?")) {
        return;
      }
    }
    this.marketActionsLeft.set(0);
    this.currentPhase.set(Phase.CLEANUP);
  }

  async cleanup() {
    // collect cards back into deck
    this.deck.update((d) => [...d, ...this.slots()]);
    this.slots.set([]);
    // discard left most and right most market cards
    let left = this.market()[0];
    let right = this.market()[this.market().length - 1];
    this.marketDiscard.update(d => [...d, left, right]);
    // refill
    let cards = this.drawCards(this.marketDeck, 2);
    // if market deck is empty, game is lost
    if (cards.length < 2) {
      this.currentPhase.set(Phase.LOST);
      return;
    }
    this.marketDeck.update(m => [...m, ...cards]);
    this.currentPhase.set(Phase.FLIP);
  }

  protected readonly Phase = Phase;
}
