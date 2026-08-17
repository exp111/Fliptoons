import { Card, GameData } from '../card';
import { Phase } from '../phase';

export class DonkeyCard extends Card {
  isInLowerRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index >= this.GRID_ROW_SIZE && index < data.grid.length;
  }

  override getFame(data: GameData): number {
    return this.isInLowerRow(data) ? this.fame + 5 : this.fame;
  }

  override async onPhaseChange(data: GameData, previous: Phase, next: Phase) {
    if (previous != Phase.MARKET) {
      return;
    }
    if (!this.isInLowerRow(data)) {
      return;
    }
    // dismiss self
    let slot = this.getSlot(data);
    if (!slot) {
      return;
    }
    slot.removeCard(this);
    data.dismissed.push(this);
  }
}
