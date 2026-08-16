import { Card, GameData } from '../card';

export class DragonflyCard extends Card {
  // number of adjacent unique face-up cards
  override getFame(data: GameData) {
    let adjacent = this.getAdjacentCards(data);
    return new Set(adjacent.map(c => c.name)).size;
  }
}
