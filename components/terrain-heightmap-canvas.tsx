import { useRef, useEffect, FC } from "react";
import { MathUtils, Texture, TextureLoader, Vector3 } from "three";

import { setProp, select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";

import { appStateStore, TerrainCanvasProps } from "./app";

const TerrainHeightmapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrainNoise2D] = useObservable(
    appStateStore.pipe(select((state) => state.terrainNoise2D))
  );
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
  );
  const [terrainHeightLimits] = useObservable(
    appStateStore.pipe(select((state) => state.terrainHeightLimits))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = terrainSize.x * 2;
      canvas.height = terrainSize.y * 2;
      canvas.style.width = `${terrainSize.x}px`;
      canvas.style.height = `${terrainSize.y}px`;

      const context = canvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000";
        context.fill();

        let terrainHeightMap = Array.from(Array(terrainSize.x * 2 + 1), (_) =>
          Array(terrainSize.y * 2 + 1).fill(0)
        ) as number[][];

        // const height = terrainNoise2D(x, y) * 3;
        // geometry.attributes.position.setZ(i, height);
        // geometry.attributes.position.setX(
        //   i,
        //   MathUtils.randFloat(
        //     geometry.attributes.position.getX(i) - 0.05,
        //     geometry.attributes.position.getX(i) + 0.05
        //   )
        // );
        // geometry.attributes.position.setY(
        //   i,
        //   MathUtils.randFloat(
        //     geometry.attributes.position.getY(i) - 0.05,
        //     geometry.attributes.position.getY(i) + 0.05
        //   )
        // );

        for (var x = 0; x < canvas.width; x++) {
          for (var y = 0; y < canvas.height; y++) {
            var v = terrainNoise2D(x, y);
            v = MathUtils.lerp(
              terrainHeightLimits.min,
              terrainHeightLimits.max,
              v
            );

            // if (x === 0 && y === 0) {
            //   v = 1;
            // }

            var color = "rgba(256,256,256," + v + ")";
            context.fillStyle = color;
            context.fillRect(x, y, 1, 1);

            // heoight data
            terrainHeightMap[x][y] = v * 3;
          }
        }
        appStateStore.update(setProp("terrainHeightMap", terrainHeightMap));
        // const textureLoader = new TextureLoader();
        // textureLoader.load(canvas.toDataURL(), (t: Texture) =>
        //   appStateStore.update(setProp("terrainHeightmapTexture", t))
        // );
      }
    }
  }, [terrainSize]);

  return <canvas className="terrain-heightmap-canvas" ref={canvasRef} />;
};

export default TerrainHeightmapCanvas;
