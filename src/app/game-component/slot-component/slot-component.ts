import { Component, input, output } from '@angular/core';
import { Card, GameData } from '../../../model/card';
import { Slot } from '../../../model/slot';

export interface DismissEvent {
  slot: Slot;
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
  slot = input.required<Slot>();
  dismissable = input.required<boolean>();
  fame = input.required<number>();
  gameData = input.required<GameData>();

  dismiss = output<DismissEvent>();

  canGetDismissed(card: Card) {
    // cant dismiss currently
    if (!this.dismissable()) {
      return false;
    }
    // not enough fame
    let cost = card.getDismissCost();
    if (this.fame() < cost) {
      return false;
    }
    // card not dismissable
    if (!card.canGetDismissed()) {
      return false;
    }
    return true;
  }

  dismissCard(card: Card) {
    if (!this.canGetDismissed(card)) {
      return;
    }
    this.dismiss.emit({
      slot: this.slot(),
      card: card,
      cost: card.getDismissCost(),
    });
  }
}
