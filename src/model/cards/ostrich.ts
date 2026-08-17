import { Card, GameData } from '../card';

export class OstrichCard extends Card {
  override async onCardPlayed(data: GameData, card: Card) {
    // if this card was played before
    if (data.playedCards[data.playedCards.length - 2] !== this) {
      return;
    }
    let ownSlot = this.getSlot(data);
    let cardSlot = card.getSlot(data);
    if (!ownSlot || !cardSlot) {
      return;
    }
    // move card from new slot to our slot
    cardSlot.removeCard(card);
    ownSlot.addCard(card);
  }
}
