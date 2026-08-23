import { Card, GameData } from '../card';

export class GoatCard extends Card {
  override getFame(data: GameData): number {
    return this.isInUpperRow(data) ? this.fame + 3 : this.fame;
  }
}
