export interface Serial<T> {
  serialize(): T;
  deserialize(data: T): void;
}
