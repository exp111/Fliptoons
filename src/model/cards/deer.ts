import { Card, GameData } from '../card';

export class DeerCard extends Card {
  override getFame(data: GameData) {
    let faceUpCards = data.grid.flatMap(s => s.cards()
      .filter(cs => !cs.facedown)
      .map(cs => cs.card));
    let unique: Record<string, boolean> = {};
    return this.fame + (faceUpCards.every(c => {
      if (unique[c.name]) {
        return false;
      }
      unique[c.name] = true;
      return true;
    }) ? 5 : 0)
  }
}
