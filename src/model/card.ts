import { Phase } from './phase';
import { Slot } from './slot';
import { PromptOptions } from './prompt';
import { EXTRA_SLOTS, GRID_ROW_SIZE } from './data';

export enum SpecialAbility {
  NoDismiss,
  IgnoreFlip,
}

export interface GameData {
  playedCards: Card[];
  market: Card[];
  grid: Slot[];
  dismissed: Card[];
  deck: Card[];
  marketDeck: Card[];
  // methods
  addMarketAction: () => void;
  addFame: (fame: number) => void;
  prompt: (options: PromptOptions) => Promise<Card | null>;
  multiPrompt: (options: PromptOptions) => Promise<Card[]>;
  dismissCard: (card: Card, slot?: Slot) => void;
  dismissCardMarket: (card: Card) => void;
  refillMarket: (totalAmount: number) => void;
  drawDeck: (amount: number) => Card[];
  drawMarketDeck: (amount: number) => Card[] | null;
}

export enum Direction {
  Left = 0,
  Right = 1,
  Above = 2,
  Below = 3,
}

export class Card {
  DISMISS_COST = 5;
  // left, right, above, below
  ADJACENT_OFFSETS = [-1, 1, -GRID_ROW_SIZE, GRID_ROW_SIZE];

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

  // Helper
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

  isInLowerRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index >= EXTRA_SLOTS + GRID_ROW_SIZE && index < data.grid.length;
  }

  isInUpperRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index >= EXTRA_SLOTS && index < EXTRA_SLOTS + GRID_ROW_SIZE;
  }

  isInMiddleRow(data: GameData) {
    let index = this.getSlotIndex(data);
    return index == 1 || index == GRID_ROW_SIZE + 1;
  }

  getAdjacentCards(data: GameData, directions = this.ADJACENT_OFFSETS) {
    let index = this.getSlotIndex(data);
    if (index < 0) {
      console.error(`Could not find self (${this.name}) in grid.`);
      return [];
    }
    const column = index % GRID_ROW_SIZE;
    const cards = [];
    // check each adjacent cards
    for (let offset of directions) {
      // skip row edges
      if (
        (column == 0 && offset == this.ADJACENT_OFFSETS[Direction.Left]) ||
        (column == GRID_ROW_SIZE - 1 && offset == this.ADJACENT_OFFSETS[Direction.Right])
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

  // Events
  async onHire(data: GameData) {}

  async onPhaseChange(data: GameData, previous: Phase, next: Phase) {}

  async onCardPlayed(data: GameData, card: Card) {}
  //TODO: onSelfPlayed, onNextCardPlayed
}
