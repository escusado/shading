// Base plane interaction, textured green for testing purposes
// returns an interaction target for the app to detect mouse, finger taps

import React from "react";
import { NearestFilter, RepeatWrapping, Vector3 } from "three";
import { setProp } from "@ngneat/elf";

import { appStateStore } from "../app";
import { useTexture } from "@react-three/drei";

const floorSize = { w: 100, h: 100 };

const Floor = () => {
  const graphyTexture = useTexture("/graphy-dark-2x.png");
  graphyTexture.wrapS = RepeatWrapping;
  graphyTexture.wrapT = RepeatWrapping;
  graphyTexture.offset.set(0, 0);
  graphyTexture.repeat.set(floorSize.w / 2, floorSize.w / 2);
  graphyTexture.minFilter = NearestFilter;
  graphyTexture.magFilter = NearestFilter;

  const grassTexture = useTexture("/grass.png");
  grassTexture.wrapS = RepeatWrapping;
  grassTexture.wrapT = RepeatWrapping;
  grassTexture.offset.set(0, 0);
  grassTexture.repeat.set(floorSize.w, floorSize.w);

  return (
    <>
      <mesh
        visible={false}
        position={new Vector3(0, 0, 0)}
        // rotation={[-1.5708, 0, 0]}
        onPointerMove={(ev) =>
          appStateStore.update(
            setProp("floorPointerPosition", ev.intersections[0].point)
          )
        }
      >
        <planeGeometry args={[floorSize.w, floorSize.h, 1, 1]} />
      </mesh>

      {/* <mesh position={new Vector3(0, -1, 0)} rotation={[-1.5708, 0, 0]}>
        <planeGeometry
          args={[floorSize.w, floorSize.h, 1, 1]}
          onUpdate={(self) => self.computeVertexNormals()}
        />
        <meshPhongMaterial
          // color={"#fff"}
          onUpdate={(self) => (self.needsUpdate = true)}
          flatShading={true}
          alphaMap={graphyTexture}
          transparent={true}
        />
      </mesh> */}

      {/*
      <mesh
        onPointerMove={(ev) =>
          appStateStore.update(
            setProp("floorPointerPosition", ev.intersections[0].point)
          )
        }
        position={new Vector3(0, -1, 0)}
        rotation={[-1.5708, 0, 0]}
      >
        <planeGeometry
          args={[floorSize.w, floorSize.h, 1, 1]}
          onUpdate={(self) => self.computeVertexNormals()}
        />
        <meshPhongMaterial
          // onUpdate={(self) => (self.needsUpdate = true)}
          // flatShading={true}
          map={grassTexture}
        />
      </mesh> */}
    </>
  );
};
export default Floor;
