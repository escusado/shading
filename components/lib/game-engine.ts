import { createStore, select, setProp, withProps } from "@ngneat/elf";

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

interface NewGameProps {
  playerIds: string[];
}

class GameEngine {
  constructor() {
    console.log("🍕Game");
    // gameStateStore
    //   .pipe(select((state) => state.players))
    //   .subscribe(this.handlePlayers.bind(this));
  }

  handlePlayers(players: Player) {
    console.log("🍕>>> PLayers", players);
  }

  setupNewGame({ playerIds }: NewGameProps) {
    //roll turns
    playerIds.sort((a, b) => 0.5 - Math.random());

    //setup players
    for (var playerId of playerIds) {
      this.addPlayer({ id: playerId, hand: [], knocked: false });
    }
  }

  addPlayer(player: Player) {
    gameStateStore.update(
      setProp("players", [...gameStateStore.getValue().players, player])
    );

    gameStateStore
      .pipe(select((state) => state.players[0]))
      .subscribe(this.handlePlayers.bind(this));
  }
}

export default GameEngine;
