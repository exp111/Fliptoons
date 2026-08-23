import { Card, GameData } from '../card';

export class ElephantCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    if (card != this) {
      return;
    }
    // needs to have a card before
    if (data.playedCards.length < 2) {
      return;
    }
    let prevCard = data.playedCards[data.playedCards.length - 2];
    let prevCardSlot = prevCard.getSlot(data);
    if (!prevCardSlot) {
      return;
    }
    prevCardSlot.flipCard(prevCard);
  }
}
