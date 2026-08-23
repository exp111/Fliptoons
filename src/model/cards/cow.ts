import { Card, GameData } from '../card';

export class CowCard extends Card {
  override getFame(data: GameData) {
    let adjacent = this.getAdjacentCards(data);
    return Math.max(...adjacent.map(c => c.getFame(data)), this.fame);
  }
}
