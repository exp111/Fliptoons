import { Card, GameData } from '../card';

export class SnakeCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    if (card != this) {
      return;
    }
    // dismiss top card
    let topCard = data.drawDeck(1);
    if (topCard.length) {
      data.dismissCard(topCard[0]);
    }
    let topMarket = data.drawMarketDeck(1);
    // lost
    if (!topMarket) {
      return;
    }
    let slot = card.getSlot(data);
    if (!slot) {
      return;
    }
    slot.addCard(topMarket[0]);
  }
}
