import { Card, GameData } from '../card';

export class BullCard extends Card {
  override getFame(data: GameData) {
    return this.fame + (data.grid.some(s => s.cards().some(cs => cs.facedown)) ? 7 : 0);
  }
}
