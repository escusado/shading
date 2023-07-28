import { useObservable } from "@ngneat/use-observable";
import { animated } from "@react-spring/three";
import { FC } from "react";
import { Vector3 } from "three";
import { Card as TypeCard, Player, turns$ } from "../stores/game-state";
import Box from "./box";
import Card from "./card";

interface PlayerProps {
  position: Vector3;
}

const Player: FC<PlayerProps & Player> = (props) => {
  const [turns] = useObservable(turns$);
  return (
    <animated.object3D position={props.position}>
      <animated.object3D position={new Vector3(-4, 0, 0)}>
        {props.hand.map((cardData: TypeCard, index: number) => (
          <Card
            key={`${cardData.type}-${cardData.value}-${Math.random()}`}
            position={new Vector3(index * 3, -4, 0.5)}
            {...cardData}
          />
        ))}
      </animated.object3D>
      <Box color="rgb(255, 0, 0)" />
    </animated.object3D>
  );
};

export default Player;
