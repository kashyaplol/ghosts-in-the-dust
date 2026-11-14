import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterTimelineMissions,
  getTimelineDate,
  getTimelineMissions,
} from '../src/utils/missionTimeline.js';

const missions = [
  { id: 'late', body: 'Mars', landedDate: '2004-01-25' },
  { id: 'early', body: 'Moon', landedDate: '1969-07-20' },
  { id: 'missing', body: 'Mars' },
];

test('orders timeline records chronologically and leaves missing dates last', () => {
  assert.deepEqual(getTimelineMissions(missions).map((mission) => mission.id), ['early', 'late', 'missing']);
  assert.equal(getTimelineDate(missions[2]), 'DATE UNAVAILABLE');
});

test('filters timeline records by actual planetary body', () => {
  const ordered = getTimelineMissions(missions);
  assert.deepEqual(filterTimelineMissions(ordered, 'Moon').map((mission) => mission.id), ['early']);
  assert.deepEqual(filterTimelineMissions(ordered, 'Mars').map((mission) => mission.id), ['late', 'missing']);
  assert.equal(filterTimelineMissions(ordered).length, 3);
});
