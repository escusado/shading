import { createStore, setProp, withProps } from "@ngneat/elf";

interface Player {
  id: string;
}

interface GameState {
  currentTurn: number;
  players: Player[];
}

export const gameStateStore = createStore(
  { name: "GameState" },
  withProps<GameState>({
    currentTurn: 0,
    players: [],
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
