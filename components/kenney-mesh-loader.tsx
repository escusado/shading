import { useGLTF } from "@react-three/drei";
import { Object3DProps } from "@react-three/fiber";
import { FC } from "react";
import { MeshStandardMaterial } from "three";

const KenneyMeshLoader: FC<
  {
    color?: string;
    modelPath: string;
  } & Object3DProps
> = ({ color, modelPath, scale, ...props }) => {
  const { nodes, materials } = useGLTF(modelPath);
  return (
    <object3D {...props} scale={scale}>
      <mesh>
        <mesh
          // @ts-ignore
          geometry={nodes[Object.keys(nodes)[1]].geometry}
          material={
            color
              ? new MeshStandardMaterial({ color })
              : materials[Object.keys(materials)[0]]
          }
          castShadow
        />
        <mesh
          // @ts-ignore
          geometry={nodes[Object.keys(nodes)[2]].geometry}
          material={
            color
              ? new MeshStandardMaterial({ color })
              : materials[Object.keys(materials)[1]]
          }
          castShadow
        />
      </mesh>
    </object3D>
  );
};

export default KenneyMeshLoader;
