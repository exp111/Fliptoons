import { Card, GameData } from '../card';

export class GoatCard extends Card {
  isInUpperRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index >= 0 && index < this.GRID_ROW_SIZE;
  }

  override getFame(data: GameData): number {
    return this.isInUpperRow(data) ? this.fame + 3 : this.fame;
  }
}
