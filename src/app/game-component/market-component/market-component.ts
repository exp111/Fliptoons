import { Component, input, model, signal } from '@angular/core';
import { Card } from '../../../model/card';

@Component({
  selector: 'app-market-component',
  imports: [],
  templateUrl: './market-component.html',
  styleUrl: './market-component.scss',
})
export class MarketComponent {
  slots = model<Card[]>();
}
