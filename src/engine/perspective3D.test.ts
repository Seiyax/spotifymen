import test from 'node:test';
import assert from 'node:assert/strict';
import { mul3, invert3, buildHomography, project } from './perspective3D';

test('3x3 matrix multiplication: identity matrix identity test', () => {
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const A = [2, 3, 4, 5, 6, 7, 8, 9, 1];
  const result = mul3(A, I);
  assert.deepEqual(result, A);
});

test('3x3 matrix inverse: inverse of identity is identity', () => {
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const inv = invert3(I);
  for (let i = 0; i < 9; i++) {
    assert.ok(Math.abs(inv[i] - I[i]) < 1e-6);
  }
});

test('homography projection center maps to screen origin', () => {
  const tilt = { rx: 0, ry: 0, rz: 0, perspective: 1200 };
  const H = buildHomography(1200, tilt);
  const pt = project(H, 0, 0);
  assert.ok(Math.abs(pt.x) < 1e-6);
  assert.ok(Math.abs(pt.y) < 1e-6);
});
