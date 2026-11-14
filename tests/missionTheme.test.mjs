import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCoordinates,
  getBodyTheme,
  getOperationalLifespan,
  getStatusMeta,
} from '../src/utils/missionTheme.js';

test('returns lunar silver and mars copper themes without neon fallback', () => {
  assert.equal(getBodyTheme('Moon').accent, '#c8d0dc');
  assert.equal(getBodyTheme('Mars').accent, '#c96a42');
});

test('provides non-hue-only status glyphs and headings', () => {
  const lost = getStatusMeta('Lost Contact');
  const active = getStatusMeta('Operational');
  assert.equal(lost.glyph, '▲');
  assert.equal(lost.heading, 'Cause of Signal Loss');
  assert.equal(active.glyph, '●');
});

test('formats coordinates and operational lifespan cleanly', () => {
  assert.equal(formatCoordinates(-1.9482, 354.4742), '1.95°S, 354.47°E');
  assert.equal(formatCoordinates(26.1322, 3.6339), '26.13°N, 3.63°E');
  assert.equal(getOperationalLifespan('2004-01-25', '2018-06-10'), '14y 137d');
  assert.equal(getOperationalLifespan('1969-07-20', '1969-07-21'), '1d');
});
