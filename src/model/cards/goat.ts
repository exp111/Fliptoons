import { Card, GameData } from '../card';

export class GoatCard extends Card {
  isInUpperRow(data: GameData) {
    let index = this.getIndex(data);
    return index >= this.GRID_ROW_SIZE && index < data.grid.length;
  }

  override getFame(data: GameData): number {
    return this.isInUpperRow(data) ? this.fame + 3 : this.fame;
  }
}
