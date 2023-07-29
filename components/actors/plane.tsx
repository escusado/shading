import { useRef } from "react";

type PlaneProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
  subdivisions: number;
};

const Plane = function (props: PlaneProps) {
  const ref: any = useRef();

  return (
    <mesh {...props} ref={ref} onPointerOut={(event) => {}}>
      <planeGeometry
        args={[
          props.scale,
          props.scale,
          props.subdivisions,
          props.subdivisions,
        ]}
      />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default Plane;
