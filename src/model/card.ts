import { Phase } from './phase';
import { Slot } from './slot';

export enum SpecialAbility {
  NoDismiss,
  IgnoreFlip
}

export interface GameData {
  market: Card[];
  grid: Slot[];
  dismissed: Card[];
}

export class Card {
  GRID_ROW_SIZE = 3;
  DISMISS_COST = 5;
  // left, right, above, below
  ADJACENT_OFFSETS = [-1, 1, -this.GRID_ROW_SIZE, this.GRID_ROW_SIZE];

  name: string;
  // 1-25
  rank: number;
  fame: number;
  count: number;
  specialAbilities?: SpecialAbility[];

  constructor(
    name: string,
    rank: number,
    fame: number,
    count: number,
    specialAbilities?: SpecialAbility[],
  ) {
    this.name = name;
    this.rank = rank;
    this.fame = fame;
    this.count = count;
    this.specialAbilities = specialAbilities;
  }

  //TODO: there must be a better way...
  clone(card: Card) {
    // @ts-ignore
    return new this.constructor(card.name, card.rank, card.fame, card.count, card.specialAbilities);
  }

  getIndex(data: GameData) {
    let index = data.grid.findIndex((c) => c.cards.some(c => c.card === this));
    if (index < 0) {
      console.error(`Could not find card ${this.name} in grid.`);
    }
    return index;
  }

  getAdjacentCards(data: GameData) {
    let index = this.getIndex(data);
    if (index >= 0) {
      let cards = [];
      // check each adjacent cards
      for (let offset of this.ADJACENT_OFFSETS) {
        let i = index + offset;
        // out of range
        if (i < 0 || i >= data.grid.length) {
          continue;
        }
        let slot = data.grid[i];
        // all cards in slot are adjacent
        cards.push(...slot.cards.map(s => s.card));
      }
      return cards;
    }
    console.error(`Could not find self (${this.name}) in grid.`);
    return [];
  }

  getImg() {
    return `${this.name.toLowerCase()}.png`;
  }

  getFame(data: GameData) {
    return this.fame;
  }

  getDismissCost() {
    return this.DISMISS_COST;
  }

  canGetDismissed() {
    return !this.specialAbilities?.includes(SpecialAbility.NoDismiss);
  }

  // Events
  onHire() {
    //TODO: trigger
  }

  onPhaseChange(data: GameData, previous: Phase, next: Phase) {
    //TODO: trigger
  }
}
