import { Component, computed, input, output } from '@angular/core';
import { Card } from '../../../model/card';
import {HireEvent} from '../market-component/market-component';

export interface DismissEvent {
  card: Card;
  cost: number;
}

@Component({
  selector: 'app-slot-component',
  imports: [],
  templateUrl: './slot-component.html',
  styleUrl: './slot-component.scss',
})
export class SlotComponent {
  card = input<Card>();
  dismissable = input.required<boolean>();
  fame = input.required<number>();

  dismiss = output<DismissEvent>();

  dismissCost = computed(() => this.card()?.getDismissCost() ?? 0);
  canGetDismissed = computed(
    // - has card
    // - can currently dismiss
    // - has enough fame
    // - card can get dismissed
    () =>
      this.card() != null &&
      this.dismissable() &&
      this.fame() >= this.dismissCost() &&
      this.card()!.canGetDismissed(),
  );

  dismissCard() {
    if (!this.canGetDismissed()) {
      return;
    }
    this.dismiss.emit({
      card: this.card()!,
      cost: this.dismissCost(),
    });
  }
}
