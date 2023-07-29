import { animated } from "@react-spring/three";
import { FC } from "react";
import { Vector3 } from "three";
import gameEngine from "../lib/game-engine";
import { Card as TypeCard, Player } from "../stores/game-state";
import Box from "./box";
import Card from "./card";

interface PlayerProps {
  position: Vector3;
  isPlayerTurn: boolean;
}

const Player: FC<PlayerProps & Player> = ({ id, hand, position, isPlayerTurn }) => {
  return (
    <animated.object3D position={position}>
      <animated.object3D position={new Vector3(-4, 0, 0)}>
        {hand.map((cardData: TypeCard, index: number) => {
          return (
            <Card
              enabled={isPlayerTurn || id === "dealer"}
              cardData={cardData}
              key={`card-${id}-${cardData.id}-${cardData.type}-${cardData.value}}`}
              position={new Vector3(index * 3, -4, 0.5)}
              onClick={() => {

                gameEngine.clearHighlightedCards({ isDealer: id === "dealer" });
                gameEngine.toggleHighlightCard({
                  isDealer: id === "dealer",
                  cardHandIndex: index,
                  value: true,
                });
                setTimeout(() => {
                  gameEngine.trySwapCards();
                }, 500);
              }}
            />
          );
        })}
      </animated.object3D>
      <Box color={id === "dealer" ? "rgb(64,64,255)" : isPlayerTurn ? "rgb(128, 255, 128)" : "rgb(200, 200, 200)"} />
    </animated.object3D>
  );
};

export default Player;
