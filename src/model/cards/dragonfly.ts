import { Card, GameData } from '../card';

export class DragonflyCard extends Card {
  GRID_ROW_SIZE = 3;
  // left, right, above, below
  ADJACENT_OFFSETS = [-1, 1, -this.GRID_ROW_SIZE, this.GRID_ROW_SIZE];

  // number of adjacent unique face-up cards
  override getFame(data: GameData) {
    // find own position
    let index = data.grid.findIndex((c) => c === this);
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
    console.error('Could not find self inside grid.');
    return 0;
  }
}
