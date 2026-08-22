import { Card, Direction, GameData } from '../card';
import { Phase } from '../phase';

export class AlligatorCard extends Card {
  override async onPhaseChange(data: GameData, previous: Phase, next: Phase): Promise<void> {
    if (previous != Phase.MARKET) {
      return;
    }
    let adjacent = this.getAdjacentCards(data, [this.ADJACENT_OFFSETS[Direction.Right]]);
    if (!adjacent.length) {
      return;
    }
    let toDismiss = adjacent[0];
    if (adjacent.length > 1) {
      toDismiss = (await data.prompt({
        text: 'Choose a card to dismiss:',
        options: adjacent
      }))!;
    }
    let slot = toDismiss.getSlot(data);
    if (!slot) {
      return;
    }
    data.dismissCard(toDismiss, slot);
  }
}
