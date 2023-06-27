import { createNoise2D } from "simplex-noise";
import { MathUtils, Vector2 } from "three";

const terrainNoise2D = createNoise2D();

const DEADZONE_LIMIT = 0.3;
const MAX_POSSIBLE_DISTANCE = 1;
const ACTIVE_CONTROL_PERIMETER_ZONE = MAX_POSSIBLE_DISTANCE - DEADZONE_LIMIT;
const MAX_CAMERA_SPEED = 0.1;

// const getBorder = (x: number, y: number) => {
//   //   const current = new Vector2(x, y);
//   //   // compute horizontal speed vector
//   //   const horizontalDistanceFromCenter = current.distanceTo(
//   //     new Vector2(currentTerainSize.x / 2, current.y) // canvas horizonal center
//   //   );
//   //   let horizontalLimit = 0;
//   //   if (horizontalDistanceFromCenter > DEADZONE_LIMIT) {
//   //     horizontalLimit =
//   //       ((horizontalDistanceFromCenter - DEADZONE_LIMIT) /
//   //         ACTIVE_CONTROL_PERIMETER_ZONE) *
//   //       MAX_CAMERA_SPEED;
//   //   }
//   //   horizontalLimit =
//   //     current.x < currentTerainSize.x / 2
//   //       ? horizontalLimit * -1
//   //       : horizontalLimit;

//   //   // compute vertical speed vector
//   //   const verticalDistanceFromCenter = current.distanceTo(
//   //     new Vector2(current.x, currentTerainSize.y / 2) // canvas horizonal center
//   //   );
//   //   let verticalLimit = 0;
//   //   if (verticalDistanceFromCenter > DEADZONE_LIMIT) {
//   //     verticalLimit =
//   //       ((verticalDistanceFromCenter - DEADZONE_LIMIT) /
//   //         ACTIVE_CONTROL_PERIMETER_ZONE) *
//   //       MAX_CAMERA_SPEED;
//   //   }
//   //   verticalLimit =
//   //     current.y < currentTerainSize.y / 2 ? verticalLimit * -1 : verticalLimit;
//   //   return { x: (1 - horizontalLimit) / 10, y: (1 - verticalLimit) / 10 };
//   return { x: 1, y: 1 };
// };

const terrainNoiseGenerator = (x: number, y: number, zoom: number) => {
  // const border = getBorder(x, y);
  // const combinedBorder = border.x + border.y;
  let height = terrainNoise2D(x / zoom, y / zoom);
  if (height < 0) {
    height = MathUtils.randFloat(0, 0.025);
  } else {
    // height = MathUtils.randFloat(height - 0.05, height + 0.05);
  }
  height *= 0.8;
  return height;
};

// function InOutQuadratic(p: number) {
//   var m = p - 1,
//     t = p * 2;
//   if (t < 1) return p * t;
//   return 1 - m * m * 2;
// }

const getTerrainNoiseGenerator = (terrainSize: Vector2) => {
  // terrain scaled 2x looks better, and makes unit calc simpler
  let terrain = Array.from(Array(terrainSize.x * 2 + 1), (_) =>
    Array(terrainSize.y * 2 + 1).fill(0)
  );

  let min = 0;
  let max = 0;
  for (let i = 0; i < terrainSize.x * 2 + 1; i++) {
    for (let j = 0; j < terrainSize.y * 2 + 1; j++) {
      terrain[i][j] = terrainNoiseGenerator(i, j, 30);
      if (terrain[i][j] < min) min = terrain[i][j];
      if (terrain[i][j] > max) max = terrain[i][j];
      // min = min < terrain[i][j] ? min : terrain[i][j];
      // max = max > terrain[i][j] ? max : terrain[i][j];
    }
  }
  return {
    limits: {
      min,
      max,
    },
    generator: (x: number, y: number) => {
      // console.log(">>>", x, y, terrain);

      return terrain[x][y];
    },
  };
};

export default getTerrainNoiseGenerator;
