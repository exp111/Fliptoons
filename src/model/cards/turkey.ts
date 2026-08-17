import { Card, GameData } from '../card';

export class TurkeyCard extends Card {
  override async onCardPlayed(data: GameData, card: Card) {
    // only if this card was played
    if (card !== this) {
      return;
    }
    // needs to have a card before
    if (data.playedCards.length < 2) {
      return;
    }
    let previousCard = data.playedCards[data.playedCards.length - 2];
    let ownSlot = this.getSlot(data);
    let otherSlot = previousCard.getSlot(data);
    if (!ownSlot || !otherSlot) {
      return;
    }
    // stack on last placed slot
    ownSlot.removeCard(this);
    otherSlot.addCard(this);
  }
}
