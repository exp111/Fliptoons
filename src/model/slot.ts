import { Card, GameData, SpecialAbility } from './card';
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
    this.cards.update((s) => [...s, new CardSlot(card)]);
  }

  removeCard(card: Card) {
    this.cards.update((s) => s.filter((c) => c.card !== card));
  }

  flipCard(card: Card) {
    // ignore flip ability
    if (card.specialAbilities?.includes(SpecialAbility.IgnoreFlip)) {
      return;
    }
    let cardSlot = this.cards().find(cs => cs.card === card);
    if (!cardSlot) {
      console.error("Card not found inside slot");
      return;
    }
    cardSlot.facedown = !cardSlot.facedown;
  }

  getFame(data: GameData) {
    return this.cards()
      .map((s) => s.getFame(data))
      .reduce((a, b) => a + b, 0);
  }

  // Events
  async onCardPlayed(data: GameData, card: Card) {
    for (const c of this.cards()) {
      // facedown cards probably don't need to get events
      if (c.facedown) {
        continue;
      }
      await c.card.onCardPlayed(data, card);
    }
  }

  async onPhaseChange(data: GameData, previous: Phase, next: Phase) {
    for (const c of this.cards()) {
      await c.card.onPhaseChange(data, previous, next);
    }
  }
}

export class CardSlot {
  card: Card;
  facedown: boolean;

  constructor(card: Card) {
    this.card = card;
    this.facedown = false;
  }

  getFame(data: GameData) {
    return this.facedown ? 0 : this.card.getFame(data);
  }

  getImg() {
    if (this.facedown) {
      return "back.png";
    }
    return this.card.getImg();
  }
}
