import { useFrame } from "@react-three/fiber";
import { FC, useRef } from "react";
import { BufferGeometry, Material, Mesh } from "three";
import GradientFragmentShader from "../shaders/gradient-fragment-shader";
import VertexShader from "../shaders/vertex-shader";

type BoxProps = {
  className?: string;
};

const Box: FC<BoxProps> = (props) => {
  const meshRef = useRef<
    Mesh<BufferGeometry, Material | Material[]> | undefined
  >();
  useFrame(
    () =>
      meshRef.current &&
      (meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01)
  );
  return (
    // @ts-ignore
    <mesh {...props} ref={meshRef} castShadow={true} receiveShadow={true}>
      <boxGeometry args={[3, 3, 3]} />
      {/* <meshStandardMaterial color={"orange"} />
       */}
      <shaderMaterial
        fragmentShader={GradientFragmentShader}
        vertexShader={VertexShader}
      />
    </mesh>
  );
};

export default Box;
