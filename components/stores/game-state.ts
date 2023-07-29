import { createStore, select, withProps } from "@ngneat/elf";

export enum CardType {
  Joker = "Joker",
  Spades = "Spades",
  Hearts = "Hearts",
  Clubs = "Clubs",
  Diamonds = "Diamonds",
}

export type Card = {
  id: string;
  type: CardType;
  value: number;
  highlight: boolean;
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
  id: "empty-card",
  type: CardType.Joker,
  value: 0,
  highlight: false,
};

export const gameStateDefaults = {
  players: {},
  turns: [],
  currentTurn: 1,
  deck: [],
};

export const gameStateStore = createStore(
  { name: "GameState" },
  withProps<GameState>(JSON.parse(JSON.stringify(gameStateDefaults)))
);

export const players$ = gameStateStore.pipe(select(({ players }: GameState) => players));

export const turns$ = gameStateStore.pipe(select(({ turns }: GameState) => turns));
