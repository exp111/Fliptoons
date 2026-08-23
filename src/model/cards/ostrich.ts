import { Card, GameData } from '../card';

export class OstrichCard extends Card {
  // stack next card on self
  override async onNextCardPlayed(data: GameData, card: Card) {
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
