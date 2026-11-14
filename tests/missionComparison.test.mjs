import assert from 'node:assert/strict';
import test from 'node:test';
import { getComparisonRows, getComparisonValue } from '../src/utils/missionComparison.js';

const moon = {
  id: 'moon',
  body: 'Moon',
  landedDate: '1969-07-20',
  primaryMission: 'Lunar landing',
  technicalSpecs: { mass: '10 kg', powerSource: 'Battery', totalDistance: '1 km' },
};
const mars = {
  id: 'mars',
  body: 'Mars',
  landedDate: '2004-01-25',
  primaryMission: 'Martian survey',
  technicalSpecs: { mass: '20 kg', powerSource: 'Solar', totalDistance: '2 km' },
};

test('comparison rows expose dataset values and meaningful differences', () => {
  const rows = getComparisonRows(moon, mars);
  assert.equal(rows.find((row) => row.key === 'body').differs, true);
  assert.equal(rows.find((row) => row.key === 'mass').leftValue, '10 kg');
  assert.equal(rows.find((row) => row.key === 'mass').rightValue, '20 kg');
});

test('comparison explicitly labels missing mission information', () => {
  assert.equal(getComparisonValue({ technicalSpecs: {} }, 'landedDate'), 'NOT AVAILABLE');
  assert.equal(getComparisonValue({ technicalSpecs: {} }, 'missionType'), 'NOT DOCUMENTED');
  assert.equal(getComparisonValue(null, 'mass'), 'NOT AVAILABLE');
});
