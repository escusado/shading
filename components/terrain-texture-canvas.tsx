// Generates the terrain color texture

import { useRef, useEffect, FC } from "react";
import { MathUtils, NearestFilter, Texture, TextureLoader } from "three";

import { setProp, select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";

import { appStateStore, TerrainCanvasProps } from "./app";
import { randomColorScale } from "./colors";

const TerrainTextureCanvas = () => {
  const [terrainNoise2D] = useObservable(
    appStateStore.pipe(select((state) => state.terrainNoise2D))
  );
  const [terrainHeightLimits] = useObservable(
    appStateStore.pipe(select((state) => state.terrainHeightLimits))
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
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
        context.fillStyle = "#F00";
        context.fill();

        let min = 1;
        let max = 0;
        console.log(">>>>>>", terrainHeightLimits);

        for (let x = 0; x < canvas.width; x++) {
          for (let y = 0; y < canvas.height; y++) {
            let v = terrainNoise2D(x, y); // 0~1
            v = MathUtils.lerp(
              terrainHeightLimits.min,
              terrainHeightLimits.max,
              v
            );

            // add a liitle bit of noise
            // v = MathUtils.randFloat(v - 0.02, v + 0.02);
            // if (v < 0.05) {
            //   v = MathUtils.randFloat(0, 0.025);
            // }

            if (v < min) min = v;
            if (v > max) max = v;

            let color = randomColorScale(v);
            context.fillStyle = color.hex();
            context.fillRect(x, y, 1, 1);
          }
        }
        console.log(min, max);

        const textureLoader = new TextureLoader();
        textureLoader.load(canvas.toDataURL(), (t: Texture) => {
          t.minFilter = NearestFilter;
          t.magFilter = NearestFilter;
          appStateStore.update(setProp("terrainTexture", t));
        });
      }
    }
  }, [terrainSize, terrainHeightLimits]);

  return <canvas className="terrain-texture-canvas" ref={canvasRef} />;
};

export default TerrainTextureCanvas;
