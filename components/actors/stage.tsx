import { Vector3 } from "three";
import Box from "./box";
import Floor from "./floor";

const Stage = function () {
  return (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        <Box position={new Vector3(1, 0, 0)} />;
      })}
      <Floor />
    </>
  );
};

export default Stage;
