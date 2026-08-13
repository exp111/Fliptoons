import { Card } from '../card';

export class CaterpillarCard extends Card {
  override getDismissCost(): number {
    return 3;
  }
}
