import { Card, GameData } from '../card';

export class RoosterCard extends Card {
  override getFame(data: GameData): number {
    return this.fame + data.grid.filter(c => c.rank <= 13).length;
  }
}
