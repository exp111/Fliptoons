import { Card, SpecialAbility } from './card';
import { DragonflyCard } from './cards/dragonfly';
import { CaterpillarCard } from './cards/caterpillar';
import { ButterflyCard } from './cards/butterfly';
import { DonkeyCard } from './cards/donkey';
import { GoatCard } from './cards/goat';
import { SheepCard } from './cards/sheep';
import { CamelCard } from './cards/camel';
import { DogCard } from './cards/dog';
import { TigerCard } from './cards/tiger';
import { RoosterCard } from './cards/rooster';
import { LionCard } from './cards/lion';
import { OstrichCard } from './cards/ostrich';

export const prices = [3, 4, 7, 10, 15];
export const cardsSeason1: Card[] = [
  new OstrichCard("Ostrich", 1, 1, 3),
  new Card("Eagle", 2, 4, 2, [SpecialAbility.IgnoreFlip]),
  new DonkeyCard("Donkey", 3, 1, 2),
  new ButterflyCard("Butterfly", 4, 2, 3),
  new DogCard("Dog", 5, 0, 4),
  new GoatCard("Goat", 6, 1, 2),
  new SheepCard("Sheep", 7, 1, 2),
  new CamelCard("Camel", 8, 2, 5),
  new Card("Rabbit", 9, 3, 4, [SpecialAbility.IgnoreFlip]),
  new Card("Horse", 10, 4, 2),
  new Card("Snake", 11, 1, 2),
  new Card("Elephant", 12, 7, 2, [SpecialAbility.IgnoreFlip]),
  new RoosterCard("Rooster", 13, 0, 2),
  new Card("Cat", 14, 1, 2, [SpecialAbility.NoDismiss]),
  new Card("Alligator", 15, 6, 2),
  new LionCard("Lion", 16, 3, 2),
  new Card("Monkey", 17, 3, 2),
  new Card("Pig", 18, -1, 1),
  new Card("Peacock", 19, 5, 2),
  new Card("Turkey", 20, 5, 2),
  new Card("Bull", 21, 3, 1, [SpecialAbility.IgnoreFlip]),
  new TigerCard("Tiger", 22, 3, 1, [SpecialAbility.NoDismiss]),
  new Card("Deer", 23, 3, 1),
  new Card("Bear", 24, 1, 1),
  new Card("Cow", 25, 0, 1),
];

export const cardsSeason1Starter: Card[] = [
  new Card("Bee", 0, 1, 1),
  new CaterpillarCard("Caterpillar", 0, 0, 3), // 3 in solo
  new Card("Skunk", 0, 0, 1),
  new Card("Snail", 0, 2, 1),
  new DragonflyCard("Dragonfly", 0, 0, 1),
];

export const soloBlacklist = [
  "Skunk",
  "Pig"
]
