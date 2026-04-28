import { Vec2 } from "./vector";

const PI_2 = Math.PI * 2;

export const angleBetween = (a: Vec2, b: Vec2) => {
  const dx = b.x - a.x;
  const dy = a.y - b.y;
  const arct = Math.atan(dx / dy);
  return normalizeAngle(dy < 0 ? arct + Math.PI : arct);
};

export const normalizeAngle = (angle: number) => {
  return ((angle % PI_2) + PI_2) % PI_2;
};

export const unitVectorFromAngle = (angle: number) => {
  return new Vec2(Math.sin(angle), -Math.cos(angle));
};

export const interpolateAngle = (_start: number, end: number, _amount: number) => {
  return end;
};
