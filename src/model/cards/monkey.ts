import { Card, GameData } from '../card';

export class MonkeyCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    if (card != this) {
      return;
    }
    //TODO: monkey
  }
}
