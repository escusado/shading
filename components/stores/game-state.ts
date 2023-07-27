import { createStore, select, withProps } from "@ngneat/elf";

export enum CardType {
  Joker = "Joker",
  Spades = "Spades",
  Hearts = "Hearts",
  Clubs = "Clubs",
  Diamonds = "Diamonds",
}

export type Card = {
  type: CardType;
  value: number;
  hightlight: boolean;
};

export type Player = {
  id: string;
  hand: Card[];
  knocked: boolean;
};

export interface GameState {
  players: { [key: string]: Player };
  turns: string[];
  currentTurn: number;
  deck: Card[];
}

export const emptyCard: Card = {
  type: CardType.Joker,
  value: 0,
  hightlight: false,
};

export const gameStateDefaults = {
  players: {},
  turns: [],
  currentTurn: 0,
  deck: [],
};

export const gameStateStore = createStore(
  { name: "GameState" },
  withProps<GameState>(JSON.parse(JSON.stringify(gameStateDefaults)))
);

export const players$ = gameStateStore.pipe(
  select(({ players }: GameState) => players)
);

export const turns$ = gameStateStore.pipe(
  select(({ turns }: GameState) => turns)
);
