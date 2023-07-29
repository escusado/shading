import { useObservable } from "@ngneat/use-observable";
import { FC } from "react";
import { Vector3 } from "three";
import { players$ } from "../stores/game-state";
import Player from "./player";
import Stage from "./stage";

type GameProps = {
  className?: string;
};

const Game: FC<GameProps> = ({ className }) => {
  const [players] = useObservable(players$);
  return (
    <>
      {Object.keys(players).map((playerId, i) =>
        playerId === "dealer" ? (
          <Player position={new Vector3(-15, 10, 0)} key={"player-" + playerId} {...players[playerId]} />
        ) : (
          <Player position={new Vector3(15, i * 10 - 20, 0)} key={"player-" + playerId} {...players[playerId]} />
        )
      )}

      {/* {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <Box
          key={"box-" + i}
          scale={randFloat(0.1, 1)}
          position={new Vector3(randFloat(-30, 30), randFloat(-10, 30), 0)}
        />
      ))} */}
      <Stage />
    </>
  );
};

export default Game;
