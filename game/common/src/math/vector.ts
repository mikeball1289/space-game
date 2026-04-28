export class Vec2 {
  static fromArray([x, y]: [number, number]) {
    return new Vec2(x, y);
  }

  static fromPoint({ x, y }: { x: number; y: number }) {
    return new Vec2(x, y);
  }

  static interpolate(from: Vec2, to: Vec2, amount: number) {
    if (amount === 0) return Vec2.fromPoint(from);
    if (amount === 1) return Vec2.fromPoint(to);
    const dpos = to.add(from.multiplyScalar(-1)).multiplyScalar(amount);
    return new Vec2(from.x + dpos.x, from.y + dpos.y);
  }

  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  asArray() {
    return [this.x, this.y];
  }

  add(other: Vec2, target = new Vec2()) {
    target.x = this.x + other.x;
    target.y = this.y + other.y;
    return target;
  }

  multiplyScalar(amount: number, target = new Vec2()) {
    target.x = this.x * amount;
    target.y = this.y * amount;
    return target;
  }

  get abs2() {
    return this.x * this.x + this.y * this.y;
  }
}
