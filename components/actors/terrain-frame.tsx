import { select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { useTexture } from "@react-three/drei";
import { FC, useRef } from "react";
import { Mesh, NearestFilter, RepeatWrapping, Vector3 } from "three";
import { appStateStore } from "../app";

const BORDER_HEIGHT = 4;

const TerrainFrame: FC = () => {
  const mesh = useRef<Mesh>(null);
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
  );

  const sideTexture = useTexture("/frame-side.png");
  const sideBumpMap = useTexture("/frame-side-bump.png");
  const topTexture = useTexture("/frame-top.png");

  [sideTexture, sideBumpMap, topTexture].map((texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.offset.set(0, 0);
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
  });

  const borderPositions = [
    new Vector3(0, BORDER_HEIGHT / 2, -terrainSize.y / 2),
    new Vector3(0, BORDER_HEIGHT / 2 + 0.01, terrainSize.y / 2),
    new Vector3(-terrainSize.x / 2 - 0.1, BORDER_HEIGHT / 2, 0),
    new Vector3(terrainSize.x / 2, BORDER_HEIGHT / 2, 0),
  ];

  return (
    <object3D>
      {[0, 1, 2, 3].map((index) => {
        // fix repeats
        const repeatX = index > 1 ? terrainSize.y + 1 : terrainSize.x;
        topTexture.repeat.set(repeatX, 1);
        sideTexture.repeat.set(repeatX, 1);
        sideBumpMap.repeat.set(repeatX, 1);
        return (
          <mesh
            key={`border-${index}`}
            ref={mesh}
            position={borderPositions[index]}
            rotation={[0, index > 1 ? -1.5708 : 0, 0]}
            castShadow
          >
            <boxGeometry
              args={[
                index <= 1 ? terrainSize.y + 1 : terrainSize.x,
                BORDER_HEIGHT,
                1,
              ]}
            />

            <meshStandardMaterial
              map={topTexture.clone()}
              attach="material-2"
            />

            <meshStandardMaterial map={sideTexture} attach="material-0" />
            <meshStandardMaterial map={sideTexture} attach="material-1" />
            <meshStandardMaterial map={sideTexture} attach="material-3" />
            <meshStandardMaterial map={sideTexture} attach="material-4" />
            <meshStandardMaterial map={sideTexture} attach="material-5" />

            {/* <meshStandardMaterial map={sideTexture} attach="material" />
            <meshStandardMaterial map={sideTexture} attach="material" />
            <meshStandardMaterial map={sideTexture} attach="material" />
            <meshStandardMaterial map={sideTexture} attach="material" /> */}
            {/* <meshStandardMaterial color={randomColorScale[99]} /> */}
          </mesh>
        );
      })}
    </object3D>
  );
};

export default TerrainFrame;
