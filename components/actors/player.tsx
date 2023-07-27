import { useObservable } from "@ngneat/use-observable";
import { FC } from "react";
import { Vector3 } from "three";
import { Player, turns$ } from "../stores/game-state";
import Box from "./box";

interface PlayerProps {
  className?: string;
}

const Player: FC<PlayerProps & Player> = (props) => {
  const [turns] = useObservable(turns$);
  return (
    <Box
      color="rgb(255, 0, 0)"
      position={new Vector3(10 * turns.indexOf(props.id), 10, 0)}
    />
  );
};

export default Player;
