import { Component, signal, WritableSignal } from '@angular/core';
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
  slots = signal<(Card | undefined)[]>([
    ...this.drawCards(this.deck, 1), //TODO: remove
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  constructor() {}

  private sortByRank(array: Card[]) {
    return array.sort((a,b) => a.rank - b.rank);
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
}
