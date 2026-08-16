import { Card, GameData } from '../card';

export class CamelCard extends Card {
  override getFame(data: GameData) {
    let camelCount = data.grid
      .flatMap(s => s.cards().map(cs => cs.card))
      .filter(d => d.name === this.name).length;
    let marketCamelCount = data.market.filter(d => d.name === this.name).length;
    let hasMostCamels = camelCount > marketCamelCount;
    return hasMostCamels ? this.fame + 2 : this.fame;
  }
}
