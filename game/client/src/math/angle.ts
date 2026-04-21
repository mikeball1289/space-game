import { PI_2, Point } from "pixi.js";

export const angleBetween = (a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = a.y - b.y;
  const arct = Math.atan(dx / dy);
  return normalizeAngle(dy < 0 ? arct + Math.PI : arct);
};

export const normalizeAngle = (angle: number) => {
  return ((angle % PI_2) + PI_2) % PI_2;
};

export const unitVectorFromAngle = (angle: number) => {
  return new Point(Math.sin(angle), -Math.cos(angle));
};
