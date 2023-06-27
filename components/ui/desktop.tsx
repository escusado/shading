import { setProp } from "@ngneat/elf";
import { FC } from "react";
import { appStateStore } from "../app";

type DesktopProps = {
  className?: string;
};

const Desktop: FC<DesktopProps> = ({ className }) => {
  return (
    <div className="h-full w-full bg-[#008080]">
      <div className="window absolute -bottom-1 flex h-10 w-full flex-row ">
        <button
          className="font-size-2 h-8 font-bold"
          onClick={() => appStateStore.update(setProp("isGameOpen", true))}
        >
          🛸 Believe
        </button>
        <div className="mx-1 h-5/6 self-center border-x border-r-white border-l-[#808080]"></div>
      </div>
    </div>
  );
};

export default Desktop;
