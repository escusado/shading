import { Object3DProps } from "@react-three/fiber";
import { FC } from "react";
import { Event, MeshPhongMaterial, Object3D } from "three";

const ToyMeshLoader: FC<
  {
    primaryMaterial?: MeshPhongMaterial;
    secondaryMaterial?: MeshPhongMaterial;
    nodes: {
      [name: string]: Object3D<Event>;
    };
  } & Object3DProps
> = ({ primaryMaterial, secondaryMaterial, scale, nodes, ...props }) => {
  // const { nodes, materials } = useGLTF(modelPath);

  return (
    <object3D {...props} scale={scale}>
      <mesh>
        <mesh
          // @ts-ignore
          geometry={nodes.primary.geometry}
          material={primaryMaterial}
          castShadow
          // rotation={[1.5708, 0, 0]}
        />
        <mesh
          // @ts-ignore
          geometry={nodes.secondary.geometry}
          material={secondaryMaterial}
          castShadow
        />
      </mesh>
    </object3D>
  );
};

export default ToyMeshLoader;
