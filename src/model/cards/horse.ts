import { Card, GameData } from '../card';

export class HorseCard extends Card {
  override async onHire(data: GameData) {
    let res = await data.multiPrompt({
      text: 'Choose any cards from the market to dismiss & refill:',
      options: data.market,
    });
    if (!res.length) {
      return;
    }
    let amount = data.market.length;
    // remove from market
    for (let card of res) {
      data.dismissCardMarket(card);
    }
    data.refillMarket(amount);
  }
}
