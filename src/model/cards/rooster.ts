import { Card, GameData } from '../card';

export class RoosterCard extends Card {
  override getFame(data: GameData): number {
    return this.fame + data.grid
      .flatMap(s => s.cards.map(cs => cs.card))
      .filter(c => c.rank <= 13).length;
  }
}
