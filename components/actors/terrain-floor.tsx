import { select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { animated } from "@react-spring/three";
import { FC, useEffect, useRef } from "react";
import { MathUtils, PlaneGeometry } from "three";
import { appStateStore } from "../app";

type TerrainFloorProps = {
  className?: string;
};

const TerrainFloor: FC<TerrainFloorProps> = ({ className }) => {
  const [terrainHeightmapTexture] = useObservable(
    appStateStore.pipe(select((state) => state.terrainHeightmapTexture))
  );
  const [terrainTexture] = useObservable(
    appStateStore.pipe(select((state) => state.terrainTexture))
  );
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
  );
  const [terrainNoise2D] = useObservable(
    appStateStore.pipe(select((state) => state.terrainNoise2D))
  );

  const geometryRef = useRef<PlaneGeometry>(null);

  useEffect(() => {
    if (geometryRef.current) {
      const geometry = geometryRef.current;
      // let terrainVertices = Array.from(Array(terrainSize.x * 2 + 1), (_) =>
      //   Array(terrainSize.y * 2 + 1).fill(0)
      // ) as Vector3[][];
      let x = 0;
      let y = 0;

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const height = terrainNoise2D(x, y) * 3;
        geometry.attributes.position.setZ(i, height);
        geometry.attributes.position.setX(
          i,
          MathUtils.randFloat(
            geometry.attributes.position.getX(i) - 0.05,
            geometry.attributes.position.getX(i) + 0.05
          )
        );
        geometry.attributes.position.setY(
          i,
          MathUtils.randFloat(
            geometry.attributes.position.getY(i) - 0.05,
            geometry.attributes.position.getY(i) + 0.05
          )
        );

        // terrainVertices[x][y] = new Vector3(
        //   geometry.attributes.position.getX(i),
        //   geometry.attributes.position.getY(i),
        //   geometry.attributes.position.getZ(i)
        // );

        x++;
        if (x > terrainSize.x * 2) {
          y++;
          x = 0;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    }
  }, [terrainHeightmapTexture, terrainTexture, terrainSize]);

  return (
    <animated.mesh receiveShadow>
      <planeGeometry
        args={[
          terrainSize.x,
          terrainSize.y,
          terrainSize.x * 2,
          terrainSize.y * 2,
        ]}
        onUpdate={(self) => self.computeVertexNormals()}
        ref={geometryRef}
      />
      <meshPhongMaterial flatShading={true} map={terrainTexture} />
    </animated.mesh>
  );
};

export default TerrainFloor;
