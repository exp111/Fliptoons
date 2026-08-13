import { Component, computed, signal, WritableSignal } from '@angular/core';
import { MarketComponent } from './market-component/market-component';
import { SlotComponent } from './slot-component/slot-component';
import { Card } from '../../model/card';
import { cardsSeason1, cardsSeason1Starter, soloBlacklist } from '../../model/data';
import { shuffleArray } from '../utils';

@Component({
  selector: 'app-game-component',
  imports: [MarketComponent, SlotComponent],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  marketDeck = signal<Card[]>(this.buildMarketDeck());
  market = signal<Card[]>(this.sortByRank(this.drawCards(this.marketDeck, 5)));

  deck = signal<Card[]>(this.buildPlayerDeck());
  AMOUNT_SLOTS = 6;
  fake_slots = Array(6);
  slots = signal<Card[]>([]);
  currentFame = computed(() => this.slots().map(c => c.fame).reduce((a, b) => a + b, 0));

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

  startDraw() {
    // put cards back into deck, clear slots
    this.deck.update(d => [...d, ...this.slots()]);
    this.slots.set([]);
    // repeat until slots full or deck empty
    while (this.slots().length <= this.AMOUNT_SLOTS && this.deck().length > 0) {
      let card = this.drawCards(this.deck, 1)[0];
      this.slots.update(s => [...s, card]);
      //TODO: wait
    }
  }
}
