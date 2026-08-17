import { Card, GameData } from '../card';

export class PeacockCard extends Card {
  override async onHire(data: GameData) {
    data.addMarketAction();
    data.addFame(2);
  }
}
