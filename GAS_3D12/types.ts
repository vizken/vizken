
export type ShapeType = 'cube' | 'sphere' | 'cone' | 'torus' | 'cylinder';

export interface AIShape {
  shape: ShapeType;
  color: string;
  scale: [number, number, number];
}
