import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { latLongToVector3 } from '../src/utils/coordinates.js';

test('converts Apollo 11 coordinates using the documented convention', () => {
  const actual = latLongToVector3(0.67408, 23.47297, 2.05);
  const latitude = (0.67408 * Math.PI) / 180;
  const longitude = (23.47297 * Math.PI) / 180;
  const expected = [
    2.05 * Math.cos(latitude) * Math.cos(longitude),
    2.05 * Math.sin(latitude),
    -2.05 * Math.cos(latitude) * Math.sin(longitude),
  ];

  actual.forEach((value, index) => {
    assert.ok(Math.abs(value - expected[index]) < 1e-12);
  });
  assert.ok(Math.abs(Math.hypot(...actual) - 2.05) < 1e-12);
});

test('loads six unique complete equipment records', async () => {
  const contents = await readFile(new URL('../src/data/equipment.json', import.meta.url));
  const equipment = JSON.parse(contents);
  assert.equal(equipment.length, 6);
  assert.equal(new Set(equipment.map((item) => item.id)).size, 6);

  equipment.forEach((item) => {
    assert.ok(item.name);
    assert.ok(['Moon', 'Mars'].includes(item.body));
    assert.ok(item.landedDate);
    assert.ok(item.lastSignalDate);
    assert.ok(item.status);
    assert.ok(item.causeOfDeath);
    assert.ok(item.primaryMission);
    assert.deepEqual(Object.keys(item.technicalSpecs).sort(), [
      'mass',
      'powerSource',
      'totalDistance',
    ]);
    assert.ok(item.narrativeTranscript);
  });
});
