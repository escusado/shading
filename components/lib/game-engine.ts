import { setProp, setProps } from "@ngneat/elf";
import { generateUUID } from "three/src/math/MathUtils";
import { Card, CardType, emptyCard, gameStateDefaults, gameStateStore, Player } from "../stores/game-state";

interface NewGameProps {
  playerIds: string[];
}

const randomSort = (_: any, __: any) => 0.5 - Math.random();
const getNewDeck = () => {
  console.log("🍕>>> Rolling deck");
  const deck: Card[] = [];
  for (let cardType of [CardType.Spades, CardType.Hearts, CardType.Clubs, CardType.Diamonds]) {
    for (let i = 1; i <= 13; i++) {
      deck.push({
        id: generateUUID(),
        type: cardType,
        value: i,
        highlight: false,
      });
    }
  }
  return deck.sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort).sort(randomSort);
};

export class GameEngine {
  constructor() {
    console.log("🍕Game");
    // gameStateStore.subscribe(this.handleGameUpdate.bind(this));
    // gameStateStore
    //   .pipe(select(({ players }: GameState) => players))
    //   .subscribe(this.handlePlayers.bind(this));
  }

  //   handleGameUpdate(gameState: GameState) {
  //     console.log("🍓>>> players", JSON.stringify(gameState.players, null, 2));
  //   }

  // handlePlayers(players: { [key: string]: Player }) {
  //   console.log("🍕>>> players", JSON.stringify(players, null, 1));
  // }

  setupNewGame({ playerIds }: NewGameProps) {
    gameStateStore.update(setProps(JSON.parse(JSON.stringify(gameStateDefaults))));
    console.log("🍕>>> Setting new game");

    //roll deck
    gameStateStore.update(setProp("deck", getNewDeck()));

    //roll turns
    playerIds.sort(randomSort);

    //setup players and turns
    playerIds.unshift("dealer");
    for (var playerId of playerIds) {
      this.addPlayer({ id: playerId, hand: [], knocked: false });
    }
  }

  addPlayer(player: Player) {
    //add player to turns
    gameStateStore.update(setProp("turns", [...gameStateStore.getValue().turns, player.id]));
    //add empty player
    gameStateStore.update(
      setProp("players", {
        ...gameStateStore.getValue().players,
        ...{ [player.id]: player },
      })
    );

    //deal cards
    const currentDeck = gameStateStore.getValue().deck;
    const hand: Card[] = [];
    //deal 5 cards from the deck
    for (let i = 0; i <= 4; i++) {
      hand.push(currentDeck.pop() || emptyCard);
    }
    //deal hand
    gameStateStore.update(
      setProp("players", {
        ...gameStateStore.getValue().players,
        ...{ [player.id]: { ...player, hand } },
      })
    );
    //update deck
    gameStateStore.update(setProp("deck", currentDeck));
  }

  toggleHighlightCard({
    isDealer,
    cardHandIndex,
    value,
  }: {
    isDealer: boolean;
    cardHandIndex: number;
    value: boolean;
  }) {
    const playerId = isDealer ? "dealer" : gameStateStore.getValue().turns[gameStateStore.getValue().currentTurn];
    const hand = gameStateStore.getValue().players[playerId].hand;
    hand[cardHandIndex].highlight = value;

    gameStateStore.update(
      setProp("players", {
        ...gameStateStore.getValue().players,
        ...{
          [playerId]: { ...gameStateStore.getValue().players[playerId], hand },
        },
      })
    );
  }

  clearHighlightedCards({ isDealer }: { isDealer: boolean }) {
    const playerId = isDealer ? "dealer" : gameStateStore.getValue().turns[gameStateStore.getValue().currentTurn];

    const hand = gameStateStore.getValue().players[playerId].hand;
    for (let card of hand) {
      card.highlight = false;
    }

    gameStateStore.update(
      setProp("players", {
        ...gameStateStore.getValue().players,
        ...{
          [playerId]: { ...gameStateStore.getValue().players[playerId], hand },
        },
      })
    );
  }

  trySwapCards() {
    const playerId = gameStateStore.getValue().turns[gameStateStore.getValue().currentTurn];
    const playerCard = gameStateStore.getValue().players[playerId].hand.find((card) => card.highlight);
    const dealerCard = gameStateStore.getValue().players.dealer.hand.find((card) => card.highlight);

    if (playerCard && dealerCard) {
      playerCard.highlight = false;
      dealerCard.highlight = false;
      const playerCardIndex = gameStateStore.getValue().players[playerId].hand.indexOf(playerCard);
      const dealerCardIndex = gameStateStore.getValue().players.dealer.hand.indexOf(dealerCard);

      const playerHand = gameStateStore.getValue().players[playerId].hand;
      const dealerHand = gameStateStore.getValue().players.dealer.hand;

      playerHand[playerCardIndex] = dealerCard;
      dealerHand[dealerCardIndex] = playerCard;
      let newTurn = gameStateStore.getValue().currentTurn + 1;
      if (newTurn >= gameStateStore.getValue().turns.length) {
        newTurn = 1;
      }
      gameStateStore.update(
        setProps({
          currentTurn: newTurn,
          players: {
            ...gameStateStore.getValue().players,
            ...{
              [playerId]: { ...gameStateStore.getValue().players[playerId], hand: playerHand },
              dealer: { ...gameStateStore.getValue().players.dealer, hand: dealerHand },
            },
          },
        })
      );
    }
  }
}

//singleton
const gameEngine = new GameEngine();

export default gameEngine;
