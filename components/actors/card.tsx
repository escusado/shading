import { animated } from "@react-spring/three";
import { Object3DProps, useFrame, useLoader } from "@react-three/fiber";
import { FC, useEffect, useRef, useState } from "react";
import { Color, NearestFilter, Object3D, TextureLoader, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { Card as TypeCard } from "../stores/game-state";

type CardProps = {
  onClick: () => void;
};

const Card: FC<CardProps & TypeCard & Object3DProps> = (props) => {
  const meshRef = useRef<Object3D>();
  const [yRate] = useState(randFloat(0.001, 0.02));
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState<Vector3 | undefined>(
    props.position as Vector3
  );
  const cardBackMap = useLoader(TextureLoader, "cards/card_back.png"); //27px x 34px original size
  const cardValueMap = useLoader(
    TextureLoader,
    `cards/card_${props.type.toLowerCase()}_${props.value
      .toString()
      .padStart(2, "0")}.png`
  ); //42px x 60px original size
  cardBackMap.minFilter = NearestFilter;
  cardValueMap.minFilter = NearestFilter;
  const highLightPosition = new Vector3(
    (props.position as Vector3).x,
    (props.position as Vector3).y + 1,
    (props.position as Vector3).z - 0.2
  );

  //   useEffect(() => {
  //     console.log("🍕>>> hight", props);
  //     setPosition(
  //       new Vector3(
  //         position.x,
  //         props.highlight ? position.y + 5 : (props.position as Vector3).y,
  //         position.z
  //       )
  //     );
  //   }, [props.highlight]);

  useFrame(
    () =>
      meshRef &&
      setPosition(
        props.highlight
          ? meshRef.current &&
              meshRef.current.position.lerp(highLightPosition, 0.1)
          : meshRef.current &&
              meshRef.current.position.lerp(props.position as Vector3, 0.1)
      )
    //     meshRef.current.position.z = props.highlight
    //   ? lerp(meshRef.current.position.z, 0, 0.025)
    //   : lerp(meshRef.current.position.z, -3, 0.025)
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <animated.object3D
      //@ts-ignore
      ref={meshRef}
      position={position}
    >
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={props.onClick}
        castShadow={true}
        receiveShadow={true}
      >
        <boxGeometry args={[2.1, 3, 0.1]} />
        {[0, 1, 2, 3].map((value) => (
          <meshStandardMaterial
            key={`${Math.random()}-$${props.type.toLowerCase()}_${props.value}`}
            attach={`material-${value}`}
            color="rgb(64,64,64)"
          />
        ))}
        <meshStandardMaterial
          attach="material-4"
          map={cardValueMap}
          color={props.highlight ? new Color(0x00ff00) : undefined}
        />
        <meshStandardMaterial attach="material-5" map={cardBackMap} />
      </mesh>
    </animated.object3D>
  );
};

export default Card;
