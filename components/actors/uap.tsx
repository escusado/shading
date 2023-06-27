// The UAP model, follows the mouse floor interaction pointer

import { select } from "@ngneat/elf";
import { useObservable } from "@ngneat/use-observable";
import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Matrix4, Mesh, Object3D, Quaternion, Vector3 } from "three";

import { appStateStore } from "../app";
// Object3D.DefaultUp.set(0, 0, 1);
const uapHeight = 4;
const tiltMaxDistance = 6;
const maxTargetHeightTilt = 1;
const lookatUp = new Vector3(0, 0, -1);

const Uap = function () {
  const uapRef = useRef<Mesh>(null);
  const targetRef = useRef<Mesh>(null);
  const uapParentRef = useRef<Object3D>(null);
  const [uapPosition] = useState([0, 0, uapHeight]);

  const { nodes, materials } = useGLTF("/uap.glb");
  const [floorPointerPosition] = useObservable(
    appStateStore.pipe(select((state) => state.floorPointerPosition))
  );
  // const [terrainNoise2D] = useObservable(
  //   appStateStore.pipe(select((state) => state.terrainNoise2D))
  // );

  // debug code
  // const debugLineRef = useRef<TubeGeometry>(null);
  // const [debugLineCurve, setDebugLineCurve] = useState(
  //   new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0, 0, 0)])
  // );

  // tween follow animation
  const { position } = useSpring({
    from: {
      position: uapPosition,
    },
    to: {
      position: [
        floorPointerPosition.x,
        floorPointerPosition.y || 100, // initial position
        uapHeight,
      ],
    },
    config: { tension: 10, friction: 10 },
  });

  useFrame(() => {
    if (uapRef.current && uapParentRef.current && targetRef.current) {
      // rotate uap white windows
      uapRef.current.rotation.y += 0.01;

      // tilt uap towards target, level when close to it
      let distanceToTarget = uapParentRef.current.position.distanceTo(
        targetRef.current.position
      );
      distanceToTarget =
        distanceToTarget > tiltMaxDistance ? tiltMaxDistance : distanceToTarget;
      distanceToTarget -= uapHeight;
      distanceToTarget *= maxTargetHeightTilt;

      // rotate towards target + combines w/titl
      const rotationMatrix = new Matrix4();
      const targetQuaternion = new Quaternion();
      rotationMatrix.lookAt(
        // @ts-ignore for some reason sending the Vector3 does not animate it
        {
          // offset look target so it does not looks up when settles up
          x: targetRef.current.position.x,
          y: targetRef.current.position.y - 1,
          // lower lookAt target to achieve tilt effect
          z: uapHeight - distanceToTarget,
        },
        uapParentRef.current.position,
        lookatUp
      );
      targetQuaternion.setFromRotationMatrix(rotationMatrix);
      uapParentRef.current.quaternion.rotateTowards(targetQuaternion, 0.5);

      // debug code
      // setDebugLineCurve(
      //   new CatmullRomCurve3([
      //     new Vector3(...position.get()),
      //     floorPointerPosition || new Vector3(...position.get()),
      //   ])
      // );
    }
  });

  return (
    <>
      <animated.object3D
        ref={uapParentRef}
        position={position as unknown as number}
      >
        <animated.mesh ref={uapRef} castShadow>
          <mesh
            castShadow
            // @ts-ignore
            geometry={nodes.ufo.geometry}
            material={materials.primary}
          />
          <mesh
            castShadow
            // @ts-ignore
            geometry={nodes.windows.geometry}
            material={materials.secondary}
          />
        </animated.mesh>

        {targetRef.current && (
          // @ts-ignore weird typescript error on deep typing, seems ok to ignore
          <animated.spotLight
            castShadow
            color={"#ffe107"}
            position={new Vector3(0, -0.1, 0)}
            intensity={5}
            angle={Math.PI / 10}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            target={targetRef.current}
          />
        )}

        {/* {debug code} */}
        {/* <mesh>
          <tubeGeometry
            args={[
              new CatmullRomCurve3([
                new Vector3(0, 0, 0),
                new Vector3(1, 0, 0),
              ]),
              70,
              0.02,
              50,
              false,
            ]}
          />
          <meshStandardMaterial color={"#00f"} />
        </mesh> */}
      </animated.object3D>

      {/* {debug code} */}
      {/* <animated.mesh>
        <tubeGeometry
          ref={debugLineRef}
          args={[debugLineCurve, 70, 0.02, 50, false]}
        />
        <meshStandardMaterial color={"#0f0"} />
      </animated.mesh> */}

      {/* Spotlight + meshless-Target */}
      <animated.mesh
        position={floorPointerPosition}
        ref={targetRef}
      ></animated.mesh>
    </>
  );
};

export default Uap;
