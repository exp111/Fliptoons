import { Card, GameData } from '../card';

export class PeacockCard extends Card {
  override onHire(data: GameData) {
    data.addMarketAction();
    data.addFame(2);
  }
}
