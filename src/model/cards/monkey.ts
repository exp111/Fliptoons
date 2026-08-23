import { Card, GameData } from '../card';
import {GRID_ROW_SIZE} from '../data';

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
    let newSlot = data.grid[index - GRID_ROW_SIZE];
    curSlot.removeCard(card);
    newSlot.addCard(card);
  }
}
