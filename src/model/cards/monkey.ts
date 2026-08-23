import { Card, GameData } from '../card';

export class MonkeyCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    if (card != this) {
      return;
    }
    if (!this.isInUpperRow(data)) {
      return;
    }
    let index = card.getSlotIndex(data);
    let curSlot = card.getSlot(data);
    let newSlot = data.extraRow[index];
    curSlot.removeCard(card);
    newSlot.addCard(card);
    //TODO: adjacency checks
  }
}
