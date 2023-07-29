import { FC } from "react";

type GameUiProps = {
  className?: string;
};

const GameUi: FC<GameUiProps> = () => {
  return (
    <div className="h-30 absolute bottom-40 z-10 flex w-full justify-center bg-[rgba(0,0,0,0.5)] p-2">
      <div
        className="inline-block cursor-pointer rounded bg-red-300 p-2 px-4 text-white"
        onClick={() => {
          window.gameEngine.setupNewGame({
            playerIds: ["naruto", "goku", "serena", "candy"],
          });
          console.log("🍕>>> start");
        }}
      >
        Start
      </div>
    </div>
  );
};

export default GameUi;
