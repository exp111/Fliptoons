import { Card, GameData } from '../card';

export class DogCard extends Card {
  override getFame(data: GameData): number {
    let foundOtherDog = data.market.some(c => c.name === this.name);
    return foundOtherDog ? this.fame + 5 : this.fame;
  }
}
