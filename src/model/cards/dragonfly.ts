import { Card, GameData } from '../card';

export class DragonflyCard extends Card {
  // left, right, above, below
  ADJACENT_OFFSETS = [-1, 1, -this.GRID_ROW_SIZE, this.GRID_ROW_SIZE];

  // number of adjacent unique face-up cards
  override getFame(data: GameData) {
    // find own position
    let index = this.getIndex(data);
    if (index >= 0) {
      let found: Record<string, boolean> = {};
      // check each adjacent cards
      for (let offset of this.ADJACENT_OFFSETS) {
        let i = index + offset;
        // out of range
        if (i < 0 || i >= data.grid.length) {
          continue;
        }
        let card = data.grid[i];
        // only count unique cards
        if (found[card.name]) {
          continue;
        }
        found[card.name] = true;
      }
      return Object.keys(found).length;
    }
    return 0;
  }
}
