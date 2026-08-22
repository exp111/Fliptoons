import { Card, GameData } from '../card';

export class RabbitCard extends Card {
  override async onCardPlayed(data: GameData, card: Card): Promise<void> {
    // only activate on self
    if (card != this) {
      return;
    }
    let selfSlot = card.getSlot(data);
    if (!selfSlot) {
      return;
    }
    // stack on first rabbit/facedown
    for (let slot of data.grid) {
      for (let card of slot.cards()) {
        if (!card.facedown && card.card.name !== this.name) {
          continue;
        }
        // if self is first card, don't stack
        if (card.card === this) {
          return;
        }
        selfSlot.removeCard(this);
        slot.addCard(this);
        return;
      }
    }
    console.warn("No rabbit/facedown cards in grid? This shouldn't happen.");
  }
}
