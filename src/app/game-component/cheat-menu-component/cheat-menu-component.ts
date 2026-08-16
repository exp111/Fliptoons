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
    let card = this.cards.find(c => c.name === name);
    if (!card) {
      console.error(`Could not find card ${name}`);
      return;
    }
    // add card to deck
    this.game().deck().push(card.clone());
    // close dialog
    dialog.close();
  }

  //TODO: order editor?

  protected readonly cardsSeason1 = cardsSeason1;
  protected readonly cardsSeason1Starter = cardsSeason1Starter;
}
