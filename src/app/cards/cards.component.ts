import { Component } from '@angular/core';
import { cardsSeason1, cardsSeason1Starter } from '../../model/data';

@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {
  protected readonly cardsSeason1 = cardsSeason1;
  protected readonly cardsSeason1Starter = cardsSeason1Starter;
}
