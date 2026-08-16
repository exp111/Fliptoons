import { Component, input } from '@angular/core';
import { GameComponent } from '../game-component';
import { cardsSeason1, cardsSeason1Starter } from '../../../model/data';

@Component({
  selector: 'app-cheat-menu-component',
  imports: [],
  templateUrl: './cheat-menu-component.html',
  styleUrl: './cheat-menu-component.scss',
})
export class CheatMenuComponent {
  game = input.required<GameComponent>();

  cards = [...cardsSeason1, ...cardsSeason1Starter];

  addCard(dialog: HTMLDialogElement, name: string) {
    if (!name) {
      return;
    }
    let card = this.cards.find((c) => c.name === name);
    if (!card) {
      console.error(`Could not find card ${name}`);
      return;
    }
    // add card to deck
    this.game().deck.update(d => [...d, card.clone()]);
    // close dialog
    dialog.close();
  }

  addCardToMarket(dialog: HTMLDialogElement, slot: string, name: string) {
    if (!slot) {
      return;
    }
    let slotIndex = Number(slot) - 1;
    if (slotIndex < 0 || slotIndex >= this.game().AMOUNT_SLOTS - 1 || !name) {
      return;
    }
    let card = this.cards.find((c) => c.name === name);
    if (!card) {
      console.error(`Could not find card ${name}`);
      return;
    }
    // add card to market
    this.game().market.update(m => [...m.slice(0, slotIndex), card.clone(), ...m.slice(slotIndex + 1)]);
    // close dialog
    dialog.close();
  }

  addFame() {
    let input = prompt('Amount of fame to add:');
    if (!input) {
      return;
    }
    let fame = Number(input);
    if (!fame) {
      return;
    }
    this.game().currentFame.update((f) => f + fame);
  }

  //TODO: deck order editor?

  protected readonly cardsSeason1 = cardsSeason1;
  protected readonly cardsSeason1Starter = cardsSeason1Starter;
}
