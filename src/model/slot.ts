import { Card, GameData } from './card';
import { signal } from '@angular/core';

export class Slot {
  cards = signal<CardSlot[]>([]);

  cleanup() {
    let arr = this.cards().map(c => c.card);
    this.cards.set([]);
    return arr;
  }

  addCard(card: Card) {
    this.cards.update(s => [...s, {card: card, facedown: false}]);
  }

  removeCard(card: Card) {
    this.cards.update(s => s.filter(c => c.card !== card));
  }

  getFame(data: GameData) {
    return this.cards()
      .filter(c => !c.facedown)
      .map(s => s.card.getFame(data))
      .reduce((a, b) => a + b, 0);
  }
}

export interface CardSlot {
  card: Card;
  facedown: boolean;
}
