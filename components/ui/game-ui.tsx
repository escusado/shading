import { FC } from "react";

type GameUiProps = {
  className?: string;
};

const GameUi: FC<GameUiProps> = () => {
  return (
    <div className="absolute z-10 flex h-full w-full">
      <div className="h-30 absolute bottom-40 flex w-full justify-center bg-[rgba(0,0,0,0.5)] p-2">
        <div
          className="inline-block cursor-pointer rounded bg-red-300 p-2 px-4 text-white"
          onClick={() =>
            window.gameEngine.setupNewGame({
              playerIds: ["uno", "dos", "tres"],
            })
          }
        >
          Start
        </div>
      </div>
    </div>
  );
};

export default GameUi;
