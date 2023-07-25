// Uap demo by Toy 2022
// Camera & Stage by https://twitter.com/bruno_simon/status/1557355710089920513

import { Object3D, Vector3 } from "three";

import { createStore, setProp, withProps } from "@ngneat/elf";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { useEffect } from "react";
import CameraController from "./actors/camera-controller";
import Stage from "./actors/stage";
import Game from "./lib/game";

//make z up same as in blender
Object3D.DefaultUp.set(0, 0, 1);

interface AppState {
  isAppInFocus: boolean;
  hasGameStarted: boolean;
  isGameCameraInFinalPosition: boolean;
  floorPointerPosition: Vector3;
}

export const appStateStore = createStore(
  { name: "appState" },
  withProps<AppState>({
    isGameCameraInFinalPosition: false,
    hasGameStarted: true,
    isAppInFocus: true,
    floorPointerPosition: new Vector3(0, 0, 0),
  })
);

export const startCameraPosition = new Vector3(-0.5, -10, 100); // start high and at the correct rotation
export const endCameraPosition = new Vector3(0.1, -5, 15);

const App = () => {
  useEffect(() => {
    //@ts-ignore
    window.gameEngine = new Game();
  }, []);

  return (
    <>
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onMouseLeave={() =>
          appStateStore.update(setProp("isAppInFocus", false))
        }
        onMouseEnter={() => appStateStore.update(setProp("isAppInFocus", true))}
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
        camera={{
          position: startCameraPosition,
          near: 10,
          far: 90,
          // fov: 12,
        }}
      >
        <color attach="background" args={["#EE8080"]} />

        <ambientLight intensity={0.5} />
        <CameraController />
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

        <Physics gravity={[0, 0, 0]}>
          <Stage />
          <RigidBody position={[0, 0, 0]} type="fixed">
            <CuboidCollider restitution={0.1} args={[1000, 1000, 1]} />
          </RigidBody>
        </Physics>

        <EffectComposer>
          <DepthOfField
            target={[0, -5, 0]}
            /* @ts-ignore */
            focusRange={0.2}
            bokehScale={8}
          />
        </EffectComposer>

        {/* Controls */}
        {/* <OrbitControls
          autoRotate
          autoRotateSpeed={0.1}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 4}
        /> */}
      </Canvas>
    </>
  );
};

export default App;
