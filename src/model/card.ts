import { Phase } from './phase';
import { Slot } from './slot';
import { PromptOptions } from './prompt';

export enum SpecialAbility {
  NoDismiss,
  IgnoreFlip,
}

export interface GameData {
  playedCards: Card[];
  market: Card[];
  grid: Slot[];
  dismissed: Card[];
  // methods
  addMarketAction: () => void;
  addFame: (fame: number) => void;
  prompt: (options: PromptOptions) => Promise<Card | null>;
  dismissCard: (card: Card, slot?: Slot) => void;
}

export enum Direction {
  Left = 0,
  Right = 1,
  Above = 2,
  Below = 3,
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
  clone() {
    // @ts-ignore
    return new this.constructor(this.name, this.rank, this.fame, this.count, this.specialAbilities);
  }

  getSlotIndex(data: GameData) {
    let index = data.grid.findIndex((c) => c.cards().some((c) => c.card === this));
    if (index < 0) {
      console.error(`Could not find card ${this.name} in grid.`);
    }
    return index;
  }

  getSlot(data: GameData) {
    let index = this.getSlotIndex(data);
    return data.grid[index] ?? null;
  }

  getAdjacentCards(data: GameData, directions = this.ADJACENT_OFFSETS) {
    let index = this.getSlotIndex(data);
    if (index < 0) {
      console.error(`Could not find self (${this.name}) in grid.`);
      return [];
    }
    const column = index % this.GRID_ROW_SIZE;
    const cards = [];
    // check each adjacent cards
    for (let offset of directions) {
      // skip row edges
      if (
        (column == 0 && offset == this.ADJACENT_OFFSETS[Direction.Left]) ||
        (column == this.GRID_ROW_SIZE - 1 && offset == this.ADJACENT_OFFSETS[Direction.Right])
      ) {
        continue;
      }
      let i = index + offset;
      // out of range
      if (i < 0 || i >= data.grid.length) {
        continue;
      }
      let slot = data.grid[i];
      // all cards in slot are adjacent
      cards.push(...slot.cards().map((s) => s.card));
    }
    return cards;
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
  async onHire(data: GameData) {}

  async onPhaseChange(data: GameData, previous: Phase, next: Phase) {}

  async onCardPlayed(data: GameData, card: Card) {}
}
