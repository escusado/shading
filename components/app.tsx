// Uap demo by Toy 2022
// Camera & Stage by https://twitter.com/bruno_simon/status/1557355710089920513

import { Object3D, Texture, Vector2, Vector3 } from "three";

import { createStore, select, setProp, withProps } from "@ngneat/elf";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { NoiseFunction2D } from "simplex-noise";

import { useObservable } from "@ngneat/use-observable";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import Stage from "./actors/stage";
import CameraController from "./camera-controller";
import TerrainHeightmapCanvas from "./terrain-heightmap-canvas";
import getTerrainNoiseGenerator from "./terrain-noise-generator";
import TerrainTextureCanvas from "./terrain-texture-canvas";
import RetroUi from "./ui/retro-ui";

//make z up same as in blender
Object3D.DefaultUp.set(0, 0, 1);

interface AppState {
  isGameOpen: boolean;
  isGameCameraInFinalPosition: boolean;

  levelSize: Vector2;

  // Framework
  isAppInFocus: boolean;
  floorPointerPosition: Vector3;
  terrainPosition: [x: number, y: number, z: number]; // we use an array because useSpring cannot handle Vector3

  // App
  terrainNoise2D: NoiseFunction2D;
  terrainHeightmapTexture: Texture;
  terrainTexture: Texture;
  terrainSize: Vector2;
  terrainHeightLimits: { max: number; min: number };
  terrainHeightMap: number[][];
}

const TERRAIN_WIDTH = 30;
const terrainSize = new Vector2(TERRAIN_WIDTH, TERRAIN_WIDTH);
const terrainNoise2D = getTerrainNoiseGenerator(terrainSize);

export const appStateStore = createStore(
  { name: "appState" },
  withProps<AppState>({
    isGameOpen: false,
    isGameCameraInFinalPosition: false,

    terrainPosition: [0, 0, 0],
    levelSize: new Vector2(TERRAIN_WIDTH, 30),

    isAppInFocus: true,
    floorPointerPosition: new Vector3(0, 0, 0),

    terrainNoise2D: terrainNoise2D.generator,
    terrainSize,
    terrainHeightmapTexture: new Texture(),
    terrainTexture: new Texture(),
    terrainHeightLimits: terrainNoise2D.limits,
    terrainHeightMap: [[]],
  })
);

export type TerrainCanvasProps = {
  noiseGenerator: NoiseFunction2D;
};

export const startCameraPosition = new Vector3(0, -1, 58); // start high and at the correct rotation
export const endCameraPosition = new Vector3(2, -30, 40);

const App = () => {
  const [isGameCameraInFinalPosition] = useObservable(
    appStateStore.pipe(select((state) => state.isGameCameraInFinalPosition))
  );
  return (
    <>
      {/* Retro Ui desktop */}
      <RetroUi />

      <TerrainHeightmapCanvas />
      <TerrainTextureCanvas />
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onMouseLeave={() =>
          appStateStore.update(setProp("isAppInFocus", false))
        }
        onMouseEnter={() => appStateStore.update(setProp("isAppInFocus", true))}
        shadows
        camera={{
          position: startCameraPosition,
          near: 30,
          far: 55,
          fov: 12,
        }}
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
      >
        {/* Lighting, environment and colors */}
        <color attach="background" args={["#008080"]} />

        {/* show stats when local */}
        {/* {window.location.href.indexOf("localhost") > -1 && <Stats />} */}
        {isGameCameraInFinalPosition === false && <CameraController />}

        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, -5, 10]}
          shadow-mapSize={[256, 256]}
          shadow-bias={-0.0001}
          intensity={1}
          castShadow
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, -10, 10]}
          />
        </directionalLight>

        {/* <Environment resolution={32}>
          <Lightformer position={[10, 10, 10]} scale={10} intensity={4} />
          <Lightformer
            position={[10, -10, 0]}
            scale={10}
            color="red"
            intensity={6}
          />
          <Lightformer position={[-10, -10, -10]} scale={10} intensity={4} />
        </Environment> */}
        {/* Moon physics */}
        <Physics gravity={[0, 0, 0]}>
          <Stage />
          <RigidBody position={[0, 0, 0]} type="fixed">
            <CuboidCollider restitution={0.1} args={[1000, 1000, 1]} />
          </RigidBody>
        </Physics>
        {/* Soft shadows, they stop rendering after 1500 frames */}
        {/* <AccumulativeShadows
          temporal
          frames={Infinity}
          alphaTest={1}
          blend={200}
          limit={1500}
          scale={25}
          position={[0, 0, 0]}
        >
          <RandomizedLight
            amount={1}
            mapSize={512}
            radius={5}
            ambient={0.5}
            position={[-10, 5, 10]}
            size={10}
            bias={0.001}
          />
        </AccumulativeShadows> */}
        {/* Effects */}

        <EffectComposer>
          <DepthOfField
            target={[0, -5, 0]}
            /* @ts-ignore */
            focusRange={0.2}
            bokehScale={8}
          />
        </EffectComposer>

        {/* Controls */}
        {/* <OrbitControls autoRotate autoRotateSpeed={0.1} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 4} /> */}
      </Canvas>
    </>
  );
};

export default App;
