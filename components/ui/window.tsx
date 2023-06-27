import { useSpring } from "@react-spring/three";
import { FC, useEffect, useState } from "react";

type RetroWindowProps = {
  iconSrc?: string;
  children: JSX.Element;
  title: string;
  windowWidth: number;
  initialPosition: { x: number; y: number };
  onClose: () => void;
};

const Window: FC<RetroWindowProps> = ({
  iconSrc,
  title,
  children,
  windowWidth,
  initialPosition,
  onClose,
}) => {
  //   const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  //   const mouse = useMouse(null);

  const [x, setX] = useState(initialPosition.x);
  const [y, setY] = useState(initialPosition.y);

  const { position } = useSpring({
    from: {
      position: initialPosition,
    },
    to: {
      position: { x, y },
    },
    config: { tension: 0, friction: 1 },
  });

  useEffect(() => {
    const update = (e: { x: number; y: number }) => {
      console.log(e);

      // @ts-ignore
      const h = e.x || e.touches[0].clientX;
      // @ts-ignore
      const v = e.y || e.touches[0].clientY;
      console.log(h, v);

      if (isDragging) {
        setX(h - windowWidth / 2);
        setY(v - 5);
      }
    };
    const mouseup = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", update);
    // @ts-ignore
    window.addEventListener("touchmove", update);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("touchup", mouseup);
    return () => {
      window.removeEventListener("mousemove", update);
      // @ts-ignore
      window.removeEventListener("touchmove", update);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("touchup", mouseup);
    };
  }, [setX, setY, isDragging]);

  return (
    <div
      // @ts-ignore
      style={{ width: 300, left: position.get().x, top: position.get().y }}
      className="window absolute"
      onMouseDown={() => setIsDragging(true)}
      onTouchEnd={() => {
        setIsDragging(false);
      }}
      onMouseUp={() => setIsDragging(false)}
      onTouchStart={() => {
        setIsDragging(true);
      }}
    >
      <div className="title-bar">
        <div className="flex-1 cursor-pointer">
          {iconSrc && (
            <img
              src={iconSrc}
              alt="window-icon"
              className="scale-5 title-bar-icon -mt-[3px] inline"
              width={16}
            />
          )}

          <div className="title-bar-text inline flex-1 pl-1">{title}</div>
        </div>
        <div className="title-bar-controls">
          <button
            aria-label="Close"
            onMouseDown={(ev) => ev.stopPropagation()}
            onClick={onClose}
          />
        </div>
      </div>

      <div className="window-body">{children}</div>
    </div>
  );
};

export default Window;
