import { select, setProp } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useState } from "react";
import { appStateStore, endCameraPosition } from "../app";

type CameraControllerProps = {
  className?: string;
};

const CameraController: FC<CameraControllerProps> = ({ className }) => {
  const [started, setStarted] = useState(false);

  const [hasGameStarted] = useObservable(
    appStateStore.pipe(select((state) => state.hasGameStarted))
  );

  useFrame((state) => {
    if (started) {
      state.camera.lookAt(0, 0, 0);
      state.camera.position.lerp(endCameraPosition, 0.005);
      if (state.camera.position.y > endCameraPosition.y - 0.2) {
        setStarted(false);
        appStateStore.update(setProp("isGameCameraInFinalPosition", true));
      }
    }
    return null;
  });

  useEffect(() => {
    setStarted(hasGameStarted);
  }, [hasGameStarted]);

  return null;
};

export default CameraController;
