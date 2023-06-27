import {
  Vector3,
  Line3,
  BufferAttribute,
  Plane,
  Mesh,
  Material,
  Vector2,
  PlaneGeometry,
} from "three";

function drawIntersectionLine(obj: Mesh, plane: Mesh) {
  let a = new Vector3();
  let b = new Vector3();
  let c = new Vector3();

  const isIndexed = obj.geometry.index != null;
  const pos = obj.geometry.attributes.position;
  const idx = obj.geometry.index;
  const faceCount = (isIndexed && idx ? idx.count : pos.count) / 3;

  const clippingPlane = createPlaneFromPlanarGeometry(plane);
  (obj.material as Material).clippingPlanes = [clippingPlane];

  let positions: number[] = [];

  for (let i = 0; i < faceCount; i++) {
    let baseIdx = i * 3;
    let idxA = baseIdx + 0;
    a.fromBufferAttribute(pos, isIndexed && idx ? idx.getX(idxA) : idxA);
    let idxB = baseIdx + 1;
    b.fromBufferAttribute(pos, isIndexed && idx ? idx.getX(idxB) : idxB);
    let idxC = baseIdx + 2;
    c.fromBufferAttribute(pos, isIndexed && idx ? idx.getX(idxC) : idxC);

    obj.localToWorld(a);
    obj.localToWorld(b);
    obj.localToWorld(c);

    const lineAB = new Line3(a, b);
    const lineBC = new Line3(b, c);
    const lineCA = new Line3(c, a);

    setPointOfIntersection(lineAB, clippingPlane, positions);
    setPointOfIntersection(lineBC, clippingPlane, positions);
    setPointOfIntersection(lineCA, clippingPlane, positions);
  }

  return new BufferAttribute(new Float32Array(positions), 3);
  //   lines.geometry.setAttribute(
  //     "position",
  //     new BufferAttribute(new Float32Array(positions), 3)
  //   );
}

function setPointOfIntersection(line: Line3, planarSrf: Plane, pos: number[]) {
  const intersect = planarSrf.intersectLine(line, new Vector3());
  if (intersect !== null) {
    let vec = intersect.clone();
    pos.push(vec.x);
    pos.push(vec.y);
    pos.push(vec.z);
  }
}

function createPlaneFromPlanarGeometry(planarGeometry: Mesh) {
  let localPlane = new Plane();
  let normal = new Vector3();
  let point = new Vector3();

  normal.set(0, -1, 0).applyQuaternion(planarGeometry.quaternion);
  point.copy(planarGeometry.position);
  localPlane.setFromNormalAndCoplanarPoint(normal, point).normalize();

  return localPlane;
}

export default drawIntersectionLine;
