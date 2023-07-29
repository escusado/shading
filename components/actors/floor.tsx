// Base plane interaction, textured green for testing purposes
// returns an interaction target for the app to detect mouse, finger taps

import { setProp } from "@ngneat/elf";
import { NearestFilter, RepeatWrapping, Vector3 } from "three";

import { useTexture } from "@react-three/drei";
import { appStateStore } from "../app";

const floorSize = { w: 100, h: 100 };

const Floor = () => {
  const graphyTexture = useTexture("/graphy-light-2x.png");
  graphyTexture.wrapS = RepeatWrapping;
  graphyTexture.wrapT = RepeatWrapping;
  graphyTexture.offset.set(0, 0);
  graphyTexture.repeat.set(floorSize.w / 2, floorSize.w / 2);
  graphyTexture.minFilter = NearestFilter;
  graphyTexture.magFilter = NearestFilter;

  return (
    <>
      <mesh
        position={new Vector3(0, 0, -1)}
        onPointerMove={(ev) => appStateStore.update(setProp("floorPointerPosition", ev.intersections[0].point))}
        receiveShadow={true}
      >
        <planeGeometry args={[floorSize.w, floorSize.h, 1, 1]} />
        <meshLambertMaterial map={graphyTexture} />
      </mesh>
    </>
  );
};
export default Floor;
