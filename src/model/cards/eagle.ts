import { Card, GameData } from '../card';

export class EagleCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    // if this card was played before
    if (data.playedCards[data.playedCards.length - 2] !== this) {
      return;
    }
    let cardSlot = card.getSlot(data);
    if (!cardSlot) {
      return;
    }
    cardSlot.flipCard(card);
  }
}
