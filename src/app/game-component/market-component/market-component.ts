import { Component, computed, input, model, output, signal } from '@angular/core';
import { Card } from '../../../model/card';
import { prices } from '../../../model/data';

export interface HireEvent {
  card: Card;
  price: number;
}

@Component({
  selector: 'app-market-component',
  imports: [],
  templateUrl: './market-component.html',
  styleUrl: './market-component.scss',
})
export class MarketComponent {
  slots = model.required<Card[]>();
  hireable = input.required<boolean>();
  fame = input.required<number>();
  hire = output<HireEvent>();

  hireCard(card: Card) {
    if (!this.hireable()) {
      return;
    }
    // get card index to fetch price
    let index = this.slots()!.findIndex((c) => c === card);
    let price = prices[index];
    if (price > this.fame()) {
      return;
    }
    this.hire.emit({ card: card, price: price });
  }

  protected readonly prices = prices;
}
