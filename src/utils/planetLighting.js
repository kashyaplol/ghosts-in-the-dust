import { latLongToVector3 } from './coordinates.js';

export const APOLLO_11_NORMAL = latLongToVector3(0.67408, 23.47297, 1);
export const SUN_DIRECTION = [0.88, 0.12, 0.48];

export function dotProduct(first, second) {
  return first.reduce((sum, value, index) => sum + value * second[index], 0);
}
