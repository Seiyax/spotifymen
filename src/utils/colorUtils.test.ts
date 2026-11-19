import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb, contrastColor, mixHex, luma, rgb2hsl, hsl2hex } from './colorUtils';

test('hexToRgb parses 6-digit and 3-digit hex correctly', () => {
  assert.deepEqual(hexToRgb('#FFFFFF'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('#000000'), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
});

test('luma & contrastColor determine readable text color', () => {
  assert.equal(contrastColor('#FFFFFF'), '#000000');
  assert.equal(contrastColor('#000000'), '#FFFFFF');
  assert.ok(luma('#FFFFFF') > 250);
  assert.ok(luma('#000000') < 5);
});

test('mixHex blends two hex colors proportionally', () => {
  const mixed = mixHex('#000000', '#FFFFFF', 0.5);
  const rgb = hexToRgb(mixed);
  assert.ok(Math.abs(rgb.r - 128) <= 1);
  assert.ok(Math.abs(rgb.g - 128) <= 1);
  assert.ok(Math.abs(rgb.b - 128) <= 1);
});

test('rgb2hsl and hsl2hex round trip', () => {
  const [h, s, l] = rgb2hsl(255, 0, 0);
  assert.ok(Math.abs(h - 0) < 1e-3);
  assert.ok(Math.abs(s - 1) < 1e-3);
  assert.ok(Math.abs(l - 0.5) < 1e-3);
  const hex = hsl2hex(h, s, l);
  assert.equal(hex, '#FF0000');
});
