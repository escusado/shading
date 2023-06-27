// Terrain renderer, gets the Terrain plain into initial position
// checks for an ACTIVE_CONTROL_PERIMETER_ZONE and scrolls the
// plane based on pointer position

import { select, setProp } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { Vector2 } from "three";

import { RigidBody } from "@react-three/rapier";
import { appStateStore } from "../app";
import MountainFlora from "./mountain-flora";
import TerrainFloor from "./terrain-floor";

const DEADZONE_LIMIT = 0.7;
const MAX_POSSIBLE_DISTANCE = 1;
const ACTIVE_CONTROL_PERIMETER_ZONE = MAX_POSSIBLE_DISTANCE - DEADZONE_LIMIT;
const MAX_CAMERA_SPEED = 0.1;

const Terrain = () => {
  const [isAppInFocus] = useObservable(
    appStateStore.pipe(select((state) => state.isAppInFocus))
  );
  const [terrainSize] = useObservable(
    appStateStore.pipe(select((state) => state.terrainSize))
  );
  const [terrainPosition] = useObservable(
    appStateStore.pipe(select((state) => state.terrainPosition))
  );

  useFrame(({ mouse }) => {
    if (isAppInFocus) {
      // compute horizontal speed vector
      const horizontalDistanceFromCenter = mouse.distanceTo(
        new Vector2(0, mouse.x) // canvas horizonal center
      );
      let horizontalCameraSpeed = 0;
      if (horizontalDistanceFromCenter > DEADZONE_LIMIT) {
        horizontalCameraSpeed =
          ((horizontalDistanceFromCenter - DEADZONE_LIMIT) /
            ACTIVE_CONTROL_PERIMETER_ZONE) *
          MAX_CAMERA_SPEED;
      }
      horizontalCameraSpeed =
        mouse.x < 0 ? horizontalCameraSpeed * -1 : horizontalCameraSpeed;

      // compute vertical speed vector
      const verticalDistanceFromCenter = mouse.distanceTo(
        new Vector2(mouse.y, 0) // canvas horizonal center
      );
      let verticalCameraSpeed = 0;
      if (verticalDistanceFromCenter > DEADZONE_LIMIT) {
        verticalCameraSpeed =
          ((verticalDistanceFromCenter - DEADZONE_LIMIT) /
            ACTIVE_CONTROL_PERIMETER_ZONE) *
          MAX_CAMERA_SPEED;
      }
      verticalCameraSpeed =
        mouse.y < 0 ? verticalCameraSpeed * -1 : verticalCameraSpeed;

      const newTerrainPosition: [x: number, y: number, z: number] = [
        terrainPosition[0] - horizontalCameraSpeed,
        terrainPosition[1] - verticalCameraSpeed,
        terrainPosition[2],
      ];

      // keep terrain in view, with limits on the sides
      if (newTerrainPosition[0] > terrainSize.x / 2.5) {
        newTerrainPosition[0] = terrainSize.x / 2.5;
      }
      if (newTerrainPosition[0] < -terrainSize.x / 2.5) {
        newTerrainPosition[0] = -terrainSize.x / 2.5;
      }
      if (newTerrainPosition[1] > terrainSize.y / 2.5) {
        newTerrainPosition[1] = terrainSize.y / 2.5;
      }
      if (newTerrainPosition[1] < -terrainSize.y / 2.5) {
        newTerrainPosition[1] = -terrainSize.y / 2.5;
      }

      // scroll terrain using reversed vectors (-)
      appStateStore.update(setProp("terrainPosition", newTerrainPosition));
    }
  });

  const { position } = useSpring<{
    position: [x: number, y: number, z: number];
  }>({
    to: {
      position: terrainPosition,
    },
    config: { tension: 5, friction: 10 },
  });

  return (
    <object3D position={position.get()}>
      <RigidBody type="fixed" colliders="trimesh">
        <MountainFlora />
        {/* <TerrainFrame /> */}
        {/* <TerrainPlane /> */}
        {/* <TerrainChunk /> */}
        <TerrainFloor />
      </RigidBody>
    </object3D>
  );
};

export default Terrain;
