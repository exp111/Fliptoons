import { Card, GameData } from '../card';

export class BearCard extends Card {
  override getFame(data: GameData) {
    let cards = data.grid.flatMap(s => s.cards()
      .filter(cs => !cs.facedown)
      .map(cs => cs.card));
    return this.fame + cards.length;
  }
}
