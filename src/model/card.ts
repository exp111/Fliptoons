export enum SpecialAbility {
  NoDismiss,
  IgnoreFlip
}

export interface GameData {
  market: Card[];
  grid: Card[];
}

export class Card {
  DISMISS_COST = 5;
  name: string;
  // 1-25
  rank: number;
  fame: number;
  count: number;
  specialAbility?: SpecialAbility[];

  constructor(name: string, rank: number, fame: number, count: number, specialAbility?: SpecialAbility[]) {
    this.name = name;
    this.rank = rank;
    this.fame = fame;
    this.count = count;
    this.specialAbility = specialAbility;
  }

  //TODO: there must be a better way...
  clone(card: Card) {
    // @ts-ignore
    return new this.constructor(card.name, card.rank, card.fame, card.count, card.fame, card.specialAbility);
  }

  getFame(data: GameData) {
    return this.fame;
  }

  getDismissCost() {
    return this.DISMISS_COST;
  }
}
