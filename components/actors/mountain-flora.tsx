import { select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { useGLTF } from "@react-three/drei";
import { FC, useEffect, useState } from "react";
import { MathUtils, MeshPhongMaterial } from "three";

import { appStateStore } from "../app";
import { randomColorScale } from "../colors";
import ToyMeshLoader from "../toy-mesh-loader";

const MOUNTAIN_FLORA_HEIGHT_STARTS = 0.8;
const MOUNTAIN_FLORA_HEIGHT_ENDS = 1;
const MOUNTAIN_FLORA_LENGTH =
  MOUNTAIN_FLORA_HEIGHT_ENDS - MOUNTAIN_FLORA_HEIGHT_STARTS;
// height matters 0=bottom-most
export const MOUNTAIN_FLORA_CATALOG = [
  "round.glb",
  "pine.glb",
  // "treePineSnow.glb",
  // "treePineSmallSnow.glb",
  // "tree.glb",
  // "treeCrooked.glb",
  // "treeHigh.glb",
  // "treeHighCrooked.glb",
  // "treeHighRound.glb",
  // "treeSnow.glb",
];
const MOUNTAIN_FLORA_BIOME_STEP =
  MOUNTAIN_FLORA_LENGTH / MOUNTAIN_FLORA_CATALOG.length;

const TILE_CENTER = 0.25;

const MountainFlora: FC = () => {
  const [terrainNoise2D] = useObservable(
    appStateStore.pipe(select((state) => state.terrainNoise2D))
  );
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
  );
  const [terrainHeightLimits] = useObservable(
    appStateStore.pipe(select((state) => state.terrainHeightLimits))
  );

  const [pines, setPines] = useState<JSX.Element[]>([]);
  const { nodes: treeBottomGltfNodes } = useGLTF(MOUNTAIN_FLORA_CATALOG[0]);
  const { nodes: treeTopGltfNodes } = useGLTF(MOUNTAIN_FLORA_CATALOG[1]);

  useEffect(() => {
    const trees = [];
    const colorMaterials: { [key: string]: MeshPhongMaterial } = {};

    for (let x = 0; x < terrainSize.x * 2; x++) {
      for (let y = 0; y < terrainSize.y * 2; y++) {
        const v = terrainNoise2D(x, y);
        const height = v * 3;

        // valley trees 99% rare
        // mountain trees 50% rare
        if (
          Math.random() > (height < MOUNTAIN_FLORA_HEIGHT_STARTS ? 0.99 : 0.5)
        ) {
          const isLow =
            height - MOUNTAIN_FLORA_HEIGHT_STARTS < MOUNTAIN_FLORA_LENGTH / 2;

          let color = randomColorScale(
            height < MOUNTAIN_FLORA_HEIGHT_STARTS
              ? Math.random() // if valley tree use true random
              : MathUtils.lerp(
                  // if moutain tree, use correct height value
                  terrainHeightLimits.min,
                  terrainHeightLimits.max,
                  v
                )
          );

          if (isLow) {
            color = color.brighten();
          } else {
            color = color.darken();
          }

          const colorString = color.hex();
          const darkenColorString = color.darken().hex();
          if (colorMaterials[colorString] === undefined) {
            colorMaterials[colorString] = new MeshPhongMaterial({
              color: colorString,
            });
          }

          if (colorMaterials[darkenColorString] === undefined) {
            colorMaterials[darkenColorString] = new MeshPhongMaterial({
              color: darkenColorString,
            });
          }

          trees.push(
            <ToyMeshLoader
              key={`tree-${x}-${y}`}
              nodes={isLow ? treeBottomGltfNodes : treeTopGltfNodes}
              position={[
                -terrainSize.x / 2 + 0.5 * x + TILE_CENTER,
                terrainSize.y / 2 + 0.5 * -y - TILE_CENTER,
                height,
              ]}
              rotation={[-0.4, 0, 0.5]}
              primaryMaterial={colorMaterials[colorString]}
              secondaryMaterial={colorMaterials[darkenColorString]}
            />
          );
        }
      }
    }
    setPines(trees);
  }, []);

  return <object3D>{pines}</object3D>;
};

export default MountainFlora;
