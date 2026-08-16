import { Card, GameData } from '../card';

export class LionCard extends Card {
  override getFame(data: GameData): number {
    let adjacent = this.getAdjacentCards(data);
    if (adjacent.every(c => c.rank <= 16)) {
      return this.fame + 4;
    }
    return this.fame;
  }
}
