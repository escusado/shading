import { createStore, setProp, withProps } from "@ngneat/elf";

enum CardType {
  Spades,
  Hearts,
  Clubs,
  Diamonds,
}

type Card = {
  type: CardType;
  value: number;
  hightlight: boolean;
};

type Player = {
  id: string;
  hand: Card[];
  knocked: boolean;
};

interface GameState {
  currentTurn: number;
  players: Player[];
  deck: Card[];
}

export const gameStateStore = createStore(
  { name: "GameState" },
  withProps<GameState>({
    currentTurn: 0,
    players: [],
    deck: [],
  })
);

class Game {
  constructor() {
    console.log("🍕Game");
  }

  startup() {}

  addPlayer(player: Player) {
    gameStateStore.update(
      setProp("players", [...gameStateStore.getValue().players, player])
    );
  }
}

export default Game;
