export enum SpecialAbility {
  NoDismiss,
  IgnoreFlip
}

export interface Card {
  name: string;
  // 1-25
  rank: number;
  fame: number;
  count: number;
  ability?: string;
  specialAbility?: SpecialAbility[];
}
