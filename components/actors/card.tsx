import { animated } from "@react-spring/three";
import { Object3DProps, useLoader } from "@react-three/fiber";
import { FC, useRef, useState } from "react";
import { BufferGeometry, Material, Mesh, TextureLoader } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { Card as TypeCard } from "../stores/game-state";

type CardProps = {
  className?: string;
};

const Card: FC<CardProps & TypeCard & Object3DProps> = (props) => {
  const meshRef = useRef<
    Mesh<BufferGeometry, Material | Material[]> | undefined
  >();
  const [yRate] = useState(randFloat(0.001, 0.02));
  const cardBackMap = useLoader(TextureLoader, "cards/card_back.png"); //27px x 34px original size
  const cardValueMap = useLoader(
    TextureLoader,
    `cards/card_${props.type.toLowerCase()}_${props.value
      .toString()
      .padStart(2, "0")}.png`
  ); //42px x 60px original size

  //   useFrame(() => {
  //     if (meshRef.current) {
  //       meshRef.current.rotation.y += yRate;
  //     }
  //   });

  return (
    <animated.object3D {...props}>
      <mesh
        castShadow={true}
        receiveShadow={true}
        // @ts-ignore
        ref={meshRef}
      >
        <boxGeometry args={[2.1, 3, 0.1]} />
        {[0, 1, 2, 3, 5].map((value) => (
          <meshStandardMaterial
            attach={`material-${value}`}
            color="rgb(64,64,64)"
          />
        ))}
        <meshStandardMaterial attach="material-4" map={cardValueMap} />
        <meshStandardMaterial attach="material-5" map={cardBackMap} />
      </mesh>
    </animated.object3D>
  );
};

export default Card;
