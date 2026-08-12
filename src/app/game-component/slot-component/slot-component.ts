import { Component, input } from '@angular/core';
import { Card } from '../../../model/card';

@Component({
  selector: 'app-slot-component',
  imports: [],
  templateUrl: './slot-component.html',
  styleUrl: './slot-component.scss',
})
export class SlotComponent {
  card = input<Card>();
}
