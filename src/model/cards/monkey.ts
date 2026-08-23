import { Card, GameData } from '../card';
import {GRID_ROW_SIZE} from '../data';

export class MonkeyCard extends Card {
  // if in upper row, move to extra row above
  override async onSelfPlayed(data: GameData) {
    if (!this.isInUpperRow(data)) {
      return;
    }
    let index = this.getSlotIndex(data);
    let curSlot = this.getSlot(data);
    let newSlot = data.grid[index - GRID_ROW_SIZE];
    curSlot.removeCard(this);
    newSlot.addCard(this);
  }
}
