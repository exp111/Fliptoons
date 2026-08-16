import { Card, GameData } from './card';

export class Slot {
  cards: CardSlot[] = [];

  cleanup() {
    let arr = this.cards.map(c => c.card);
    this.cards = [];
    return arr;
  }

  addCard(card: Card) {
    this.cards.push({card: card, facedown: false});
  }

  removeCard(card: Card) {
    let i = this.cards.findIndex(c => c.card === card);
    this.cards.splice(i, 1);
  }

  getFame(data: GameData) {
    return this.cards
      .filter(c => !c.facedown)
      .map(s => s.card.getFame(data))
      .reduce((a, b) => a + b, 0);
  }
}

export interface CardSlot {
  card: Card;
  facedown: boolean;
}
