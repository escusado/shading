import { animated } from "@react-spring/three";
import { FC } from "react";
import { Vector3 } from "three";
import gameEngine from "../lib/game-engine";
import { Card as TypeCard, Player } from "../stores/game-state";
import Box from "./box";
import Card from "./card";

interface PlayerProps {
  position: Vector3;
}

const Player: FC<PlayerProps & Player> = ({ id, hand, position }) => {
  return (
    <animated.object3D position={position}>
      <animated.object3D position={new Vector3(-4, 0, 0)}>
        {hand.map((cardData: TypeCard, index: number) => {
          return (
            <Card
              {...cardData}
              key={`${cardData.type}-${cardData.value}-${Math.random()}`}
              position={new Vector3(index * 3, -4, 0.5)}
              onClick={() => {
                console.log("🍕>>> cardData.highlight", cardData.highlight);
                gameEngine.toggleHighlightCard({
                  playerId: id,
                  cardHandIndex: index,
                  value: !cardData.highlight,
                });
              }}
            />
          );
        })}
      </animated.object3D>
      <Box color="rgb(255, 0, 0)" />
    </animated.object3D>
  );
};

export default Player;
