import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getGuidedMissions } from '../src/utils/guidedMissions.js';

test('derives guided exploration chronology from landing dates', async () => {
  const missions = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url)));
  assert.deepEqual(
    getGuidedMissions(missions).map((mission) => mission.id),
    ['apollo-11-lm', 'apollo-15-lrv', 'viking-1-lander', 'opportunity-mer-b', 'curiosity-msl', 'ingenuity-helicopter'],
  );
  assert.notEqual(getGuidedMissions(missions), missions);
});

test('exposes guided exploration controls and factual story labels', async () => {
  const source = [
    await readFile(new URL('../src/components/ui/GuidedExploration.jsx', import.meta.url), 'utf8'),
    await readFile(new URL('../src/components/ui/GuidedIntroduction.jsx', import.meta.url), 'utf8'),
  ].join('\n');
  for (const label of ['START JOURNEY', 'VIEW MISSION LIST', 'PREVIOUS', 'NEXT', 'PAUSE', 'RESUME', 'SKIP MISSION', 'Exit journey']) {
    assert.match(source, new RegExp(label));
  }
  assert.match(source, /Documented status/);
  assert.match(source, /First-person archive narrative/);
  assert.match(source, /selectEquipment/);
  assert.match(source, /onCameraAction\('focus'\)/);
});
