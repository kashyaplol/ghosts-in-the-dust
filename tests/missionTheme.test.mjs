import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  formatCoordinates,
  getBodyTheme,
  getLastSignalDisplay,
  getOperationalLifespan,
  getStatusMeta,
  isOperationalMission,
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

test('formats coordinates and operational lifespan cleanly for ended missions', () => {
  assert.equal(formatCoordinates(-1.9482, 354.4742), '1.95°S, 354.47°E');
  assert.equal(formatCoordinates(26.1322, 3.6339), '26.13°N, 3.63°E');
  assert.equal(getOperationalLifespan('2004-01-25', '2018-06-10', 'Lost Contact'), '14y 137d');
  assert.equal(getOperationalLifespan('1969-07-20', '1969-07-21', 'Decommissioned'), '1d');
  assert.equal(getOperationalLifespan('1976-07-20', '1982-11-11', 'Lost Contact'), '6y 114d');
});

test('displays ACTIVE / OPERATIONAL and Ongoing lifespan for operational missions', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  const curiosity = equipment.find((item) => item.id === 'curiosity-msl');

  assert.equal(curiosity.status, 'Operational');
  assert.equal(curiosity.landedDate, '2012-08-06');
  assert.equal(curiosity.lastSignalDate, null);
  assert.equal(curiosity.archiveSnapshotDate, '2026-11-11');
  assert.equal(isOperationalMission(curiosity), true);
  assert.equal(getLastSignalDisplay(curiosity), 'ACTIVE / OPERATIONAL');
  assert.equal(getOperationalLifespan(curiosity.landedDate, curiosity.lastSignalDate, curiosity.status), 'Ongoing');

  // Guard even if an operational record were ever supplied with a fallback date
  assert.equal(
    getLastSignalDisplay({ status: 'Operational', landedDate: '2012-08-06', lastSignalDate: '2026-11-11' }),
    'ACTIVE / OPERATIONAL',
  );
  assert.equal(getOperationalLifespan('2012-08-06', '2026-11-11', 'Operational'), 'Ongoing');
});

test('preserves historical lastSignalDate and guards missing dates for ended missions', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  const ended = equipment.filter((item) => item.status !== 'Operational');
  assert.equal(ended.length, 5);

  for (const mission of ended) {
    assert.equal(isOperationalMission(mission), false);
    assert.equal(getLastSignalDisplay(mission), mission.lastSignalDate);
    assert.notEqual(getOperationalLifespan(mission.landedDate, mission.lastSignalDate, mission.status), 'Ongoing');
  }

  assert.equal(getLastSignalDisplay({ status: 'Lost Contact', lastSignalDate: null }), 'UNAVAILABLE');
  assert.equal(getOperationalLifespan('2004-01-25', null, 'Lost Contact'), 'Unavailable');

  const hud = await readFile(new URL('../src/components/ui/TelemetryHUD.jsx', import.meta.url), 'utf8');
  assert.match(hud, /getLastSignalDisplay\(selectedEquipment\)/);
  assert.match(hud, /selectedEquipment\.status/);
});
