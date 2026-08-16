import { Card, GameData } from '../card';

export class OstrichCard extends Card {
  override onCardPlayed(data: GameData, card: Card) {
    // if this card was played before
    if (data.playedCards[data.playedCards.length - 2] === this) {
      console.log("played before");
    }
  }
}
