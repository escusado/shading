import { Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import Box from "./box";
import Floor from "./floor";

const Stage = function () {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <Box
          key={Math.random() + "box"}
          position={new Vector3(randFloat(-30, 30), randFloat(-10, 30), 0)}
        />
      ))}
      <Floor />
    </>
  );
};

export default Stage;
