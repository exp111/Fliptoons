import { Card, GameData } from './card';
import { signal } from '@angular/core';
import { Phase } from './phase';

export class Slot {
  cards = signal<CardSlot[]>([]);

  cleanup() {
    let arr = this.cards().map((c) => c.card);
    this.cards.set([]);
    return arr;
  }

  addCard(card: Card) {
    this.cards.update((s) => [...s, { card: card, facedown: false }]);
  }

  removeCard(card: Card) {
    this.cards.update((s) => s.filter((c) => c.card !== card));
  }

  getFame(data: GameData) {
    return this.cards()
      .filter((c) => !c.facedown)
      .map((s) => s.card.getFame(data))
      .reduce((a, b) => a + b, 0);
  }

  // Events
  onCardPlayed(data: GameData, card: Card) {
    this.cards().forEach((c) => {
      // facedown cards probably don't need to get events
      if (c.facedown) {
        return;
      }
      c.card.onCardPlayed(data, card);
    });
  }

  onPhaseChange(data: GameData, previous: Phase, next: Phase) {
    this.cards().forEach(c => c.card.onPhaseChange(data, previous, next));
  }
}

export interface CardSlot {
  card: Card;
  facedown: boolean;
}
