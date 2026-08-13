import { Component, computed, input, model, output, signal } from '@angular/core';
import { Card } from '../../../model/card';

@Component({
  selector: 'app-market-component',
  imports: [],
  templateUrl: './market-component.html',
  styleUrl: './market-component.scss',
})
export class MarketComponent {
  slots = model<Card[]>();
  hireable = input();
  //TODO: check if fame is enough etc
  canHire = computed(() => this.hireable());
  hire = output<Card>();

  hireCard(card: Card) {
    if (!this.hireable()) {
      return;
    }
    this.hire.emit(card);
  }
}
