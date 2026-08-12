import { Card, SpecialAbility } from './card';

export const cardsSeason1: Card[] = [
  {
    name: 'Ostrich',
    rank: 1,
    fame: 1,
    count: 3,
  },
  {
    name: 'Eagle',
    rank: 2,
    fame: 4,
    count: 2,
    specialAbility: [SpecialAbility.IgnoreFlip],
  },
  {
    name: 'Donkey',
    rank: 3,
    fame: 1,
    count: 2,
  },
  {
    name: 'Butterfly',
    rank: 4,
    fame: 2,
    count: 3,
  },
  {
    name: 'Dog',
    rank: 5,
    fame: 0,
    count: 4,
  },
  {
    name: 'Goat',
    rank: 6,
    fame: 1,
    count: 2,
  },
  {
    name: "Sheep",
    rank: 7,
    fame: 1,
    count: 2,
  },
  {
    name: "Camel",
    rank: 8,
    fame: 2,
    count: 5,
  },
  {
    name: "Rabbit",
    rank: 9,
    fame: 3,
    count: 4,
    specialAbility: [SpecialAbility.IgnoreFlip]
  },
  {
    name: "Horse",
    rank: 10,
    fame: 4,
    count: 2,
  },
  {
    name: "Snake",
    rank: 11,
    fame: 1,
    count: 2,
  },
  {
    name: "Elephant",
    rank: 12,
    fame: 7,
    count: 2,
    specialAbility: [SpecialAbility.IgnoreFlip]
  },
  {
    name: "Rooster",
    rank: 13,
    fame: 0,
    count: 2,
  },
  {
    name: "Cat",
    rank: 14,
    fame: 1,
    count: 2,
    specialAbility: [SpecialAbility.NoDismiss]
  },
  {
    name: 'Alligator',
    rank: 15,
    fame: 6,
    count: 2
  },
  {
    name: "Lion",
    rank: 17,
    fame: 3,
    count: 2,
  },
  {
    name: "Monkey",
    rank: 17,
    fame: 3,
    count: 2,
  },
  {
    name: "Pig",
    rank: 18,
    fame: -1,
    count: 1,
  },
  {
    name: "Peacock",
    rank: 19,
    fame: 5,
    count: 2,
  },
  {
    name: "Turkey",
    rank: 20,
    fame: 5,
    count: 2,
  },
  {
    name: "Bull",
    rank: 21,
    fame: 3,
    count: 1,
    specialAbility: [SpecialAbility.IgnoreFlip]
  },
  {
    name: "Tiger",
    rank: 22,
    fame: 3,
    count: 1,
    specialAbility: [SpecialAbility.NoDismiss]
  },
  {
    name: "Deer",
    rank: 23,
    fame: 3,
    count: 1,
  },
  {
    name: 'Bear',
    rank: 24,
    fame: 1,
    count: 1,
  },
  {
    name: "Cow",
    rank: 25,
    fame: 0,
    count: 1,
  }
];

export const cardsSeason1Starter: Card[] = [
  {
    name: "Bee",
    rank: 0,
    fame: 1,
    count: 1
  },
  {
    name: "Caterpillar",
    rank: 0,
    fame: 0,
    count: 2
  },
  {
    name: "Skunk",
    rank: 0,
    fame: 0,
    count: 1
  },
  {
    name: "Snail",
    rank: 0,
    fame: 2,
    count: 1
  },
  {
    name: "Dragonfly",
    rank: 0,
    fame: 0,
    count: 1
  }
];

export const soloBlacklist = [
  "Skunk",
  "Pig"
]
