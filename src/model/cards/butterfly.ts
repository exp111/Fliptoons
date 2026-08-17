import { Card, GameData } from '../card';

export class ButterflyCard extends Card {
  override async onHire(data: GameData) {
    // user may dismiss caterpillar for free
    let res = await data.prompt({
      text: 'May dismiss one caterpillar for 0:',
      options: [...data.grid
        .flatMap((s) => s.cards().map((cs) => cs.card))
        .filter((s) => s.name === 'Caterpillar'),
        // allow user to select none
        null
      ]});
    if (!res) {
      return;
    }
    //TODO: dismiss caterpillar
  }
}
