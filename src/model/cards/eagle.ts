import { Card, GameData } from '../card';

export class EagleCard extends Card {
  // flip next card
  override async onNextCardPlayed(data: GameData, card: Card) {
    let cardSlot = card.getSlot(data);
    if (!cardSlot) {
      return;
    }
    cardSlot.flipCard(card);
  }
}
