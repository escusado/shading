// type MainProps = {
//   className?: string;
// };

import "98.css";
import { select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { useEffect, useRef, useState } from "react";
import { appStateStore } from "../app";

import iconProfile from "../../public/icon-profile.png"; // Tell webpack this JS file uses this image

import Desktop from "./desktop";
import Profile from "./profile";
const RetroUi = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isDesktopActive, setIsDesktopActive] = useState(true);
  const [isGameOpen] = useObservable(
    appStateStore.pipe(select((state) => state.isGameOpen))
  );

  useEffect(() => {
    const handleDesktopFadeOutAnimationEnd = () => setIsDesktopActive(false);
    ref.current!.addEventListener(
      "animationend",
      handleDesktopFadeOutAnimationEnd
    );
    return () =>
      ref.current?.removeEventListener(
        "animationend",
        handleDesktopFadeOutAnimationEnd
      );
  }, [ref]);

  return isDesktopActive ? (
    <div
      ref={ref}
      className={`retro-ui absolute z-10 h-full w-full ${
        isGameOpen ? "item-fadeout" : ""
      }`}
    >
      <Desktop />
      <img
        src={iconProfile.src}
        alt="iconToy"
        className="absolute left-[24px] top-[24px] scale-[2] cursor-pointer"
        onClick={() => setIsProfileVisible(true)}
        style={{ imageRendering: "pixelated" }}
      />
      {isProfileVisible && (
        <Profile onClose={() => setIsProfileVisible(false)} />
      )}
    </div>
  ) : null;
};

export default RetroUi;
