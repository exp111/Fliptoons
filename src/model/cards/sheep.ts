import { Card, GameData } from '../card';

export class SheepCard extends Card {
  isInMiddleRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index == 1 || index == this.GRID_ROW_SIZE + 1;
  }

  override getFame(data: GameData): number {
    return this.isInMiddleRow(data) ? this.fame + 4 : this.fame;
  }
}
