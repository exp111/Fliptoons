import { Card, GameData } from '../card';

export class SheepCard extends Card {
  override getFame(data: GameData): number {
    return this.isInMiddleRow(data) ? this.fame + 4 : this.fame;
  }
}
