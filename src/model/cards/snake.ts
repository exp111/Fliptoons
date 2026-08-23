import { Card, GameData } from '../card';

export class SnakeCard extends Card {
  override async onSelfPlayed(data: GameData) {
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
    let slot = this.getSlot(data);
    if (!slot) {
      return;
    }
    slot.addCard(topMarket[0]);
  }
}
