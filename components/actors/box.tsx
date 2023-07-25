import { MeshProps, useFrame } from "@react-three/fiber";
import { FC, useRef, useState } from "react";
import { BufferGeometry, Material, Mesh } from "three";
import { randFloat } from "three/src/math/MathUtils";

type BoxProps = {
  className?: string;
};

const Box: FC<BoxProps | MeshProps> = (props) => {
  const [xRate] = useState(randFloat(0.001, 0.02));
  const [yRate] = useState(randFloat(0.001, 0.02));
  const [scale] = useState(randFloat(0.1, 1));
  const meshRef = useRef<
    Mesh<BufferGeometry, Material | Material[]> | undefined
  >();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += xRate;
      meshRef.current.rotation.y += yRate;
    }
  });
  return (
    <mesh
      {...props}
      // @ts-ignore
      ref={meshRef}
      scale={scale}
      castShadow={true}
      receiveShadow={true}
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={"orange"} />

      {/* <shaderMaterial
        fragmentShader={GradientFragmentShader}
        vertexShader={VertexShader}
      /> */}
    </mesh>
  );
};

export default Box;
