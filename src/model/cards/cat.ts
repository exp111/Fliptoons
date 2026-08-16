import { Card, GameData } from '../card';

export class CatCard extends Card {
  override getFame(data: GameData) {
    return this.fame + data.dismissed.filter((c) => c.rank === 0).length;
  }
}
