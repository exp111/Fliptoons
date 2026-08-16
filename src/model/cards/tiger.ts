import { Card, GameData } from '../card';

export class TigerCard extends Card {
  override getFame(data: GameData): number {
    return this.fame + data.dismissed.length;
  }
}
