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
  market = signal<Card[]>(this.drawCards(this.marketDeck, 5));

  deck = signal<Card[]>(this.buildPlayerDeck());
  slots = signal<(Card | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  constructor() {}

  private buildDeck(array: Card[]) {
    return shuffleArray(
      [...array]
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
    deck.update(d => d.slice(amount));
    return out;
  }
}
