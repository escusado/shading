import Floor from "./floor";
import Terrain from "./terrain";
import Uap from "./uap";

const Stage = function () {
  return (
    <>
      {/* <object3D position={[-4, -5, 1]}>
        <ToyMeshLoader
          key={`tree-test-center`}
          modelPath={MOUNTAIN_FLORA_CATALOG[1]}
          position={[0, 0, 1]}
          primaryColor={"#AAA"}
          secondaryColor={"#AAA"}
        />

        <ToyMeshLoader
          key={`tree-test-xp`}
          modelPath={MOUNTAIN_FLORA_CATALOG[1]}
          position={[1, 0, 1]}
          rotation={[0, 1.5708, 0]}
          primaryColor={"#8F8"}
          secondaryColor={"#8F8"}
        />

        <ToyMeshLoader
          key={`tree-test-xm`}
          modelPath={MOUNTAIN_FLORA_CATALOG[1]}
          position={[-1, 0, 1]}
          rotation={[0, -1.5708, 0]}
          primaryColor={"#F88"}
          secondaryColor={"#F88"}
        />

        <ToyMeshLoader
          key={`tree-test-yp`}
          modelPath={MOUNTAIN_FLORA_CATALOG[1]}
          position={[0, 1, 1]}
          rotation={[-1.5708, 0, 0]}
          primaryColor={"#0F0"}
          secondaryColor={"#0F0"}
        />

        <ToyMeshLoader
          key={`tree-test-ym`}
          modelPath={MOUNTAIN_FLORA_CATALOG[1]}
          position={[0, -1, 1]}
          rotation={[1.5708, 0, 0]}
          primaryColor={"#F00"}
          secondaryColor={"#F00"}
        />
      </object3D> */}
      <Floor />
      <Terrain />
      <Uap />
    </>
  );
};

export default Stage;
