import { setProp } from "@ngneat/elf";
import { animated } from "@react-spring/three";
import { Object3DProps, useFrame, useLoader } from "@react-three/fiber";
import { FC, useRef, useState } from "react";
import { Color, NearestFilter, Object3D, TextureLoader, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { appStateStore } from "../app";
import { Card as TypeCard } from "../stores/game-state";

type CardProps = {
  onClick: () => void;
  cardData: TypeCard;
};

const Card: FC<CardProps & Object3DProps> = (props) => {
  const meshRef = useRef<Object3D>();
  const [yRate] = useState(randFloat(0.001, 0.02));
  const [hovered, setHovered] = useState(false);
  const [position] = useState<Vector3 | undefined>(props.position as Vector3);
  const cardBackMap = useLoader(TextureLoader, "cards/card_back.png"); //27px x 34px original size
  const cardValueMap = useLoader(
    TextureLoader,
    `cards/card_${props.cardData.type.toLowerCase()}_${props.cardData.value.toString().padStart(2, "0")}.png`
  ); //42px x 60px original size
  cardBackMap.minFilter = NearestFilter;
  cardValueMap.minFilter = NearestFilter;
  const highLightPosition = new Vector3(
    (props.position as Vector3).x,
    (props.position as Vector3).y + 1,
    (props.position as Vector3).z - 0.2
  );

  useFrame(
    () =>
      meshRef &&
      meshRef.current &&
      meshRef.current.position.lerp(props.cardData.highlight ? highLightPosition : (props.position as Vector3), 0.1)
  );

  return (
    <animated.object3D
      //@ts-ignore
      ref={meshRef}
      position={position}
    >
      <mesh
        onPointerOver={() => appStateStore.update(setProp("isMousePointer", true))}
        onPointerOut={() => appStateStore.update(setProp("isMousePointer", false))}
        onClick={props.onClick}
        castShadow={true}
        receiveShadow={true}
      >
        <boxGeometry args={[2.1, 3, 0.1]} />
        {[0, 1, 2, 3].map((materialIndex) => (
          <meshStandardMaterial
            key={`card-material-${props.cardData.type.toLowerCase()}_${props.cardData.value}-${materialIndex}`}
            attach={`material-${materialIndex}`}
            color="rgb(64,64,64)"
          />
        ))}
        <meshStandardMaterial
          attach="material-4"
          map={cardValueMap}
          color={props.cardData.highlight ? new Color(0x00ff00) : new Color(0xffffff)}
        />
        <meshStandardMaterial attach="material-5" map={cardBackMap} />
      </mesh>
    </animated.object3D>
  );
};

export default Card;
