import { Card, GameData } from '../card';
import { Phase } from '../phase';

export class DonkeyCard extends Card {
  isInLowerRow(data: GameData) {
    let index = this.getIndex(data);
    return index >= this.GRID_ROW_SIZE && index < data.grid.length;
  }

  override getFame(data: GameData): number {
    return this.isInLowerRow(data) ? this.fame + 5 : this.fame;
  }

  override onPhaseChange(data: GameData, previous: Phase, next: Phase) {
    if (previous == Phase.MARKET) {
      if (this.isInLowerRow(data)) {
        //TODO: dismiss self
      }
    }
  }
}
