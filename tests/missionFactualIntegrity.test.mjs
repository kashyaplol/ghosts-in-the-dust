import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getOperationalLifespan } from '../src/utils/missionTheme.js';

test('Viking 1 narrative reflects over six Earth years and preserves 1982-11-11 last transmission semantics', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  const viking1 = equipment.find((item) => item.id === 'viking-1-lander');

  assert.doesNotMatch(viking1.narrativeTranscript, /two Martian seasons/i);
  assert.match(viking1.narrativeTranscript, /more than six Earth years/i);
  assert.match(viking1.narrativeTranscript, /Chryse Planitia/);
  assert.equal(viking1.landedDate, '1976-07-20');
  assert.equal(viking1.lastSignalDate, '1982-11-11');
  assert.equal(getOperationalLifespan(viking1.landedDate, viking1.lastSignalDate, viking1.status), '6y 114d');
});

test('Opportunity identifies Eagle Crater in Meridiani Planum for landing and retains Endeavour Crater', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  const opportunity = equipment.find((item) => item.id === 'opportunity-mer-b');

  assert.equal(opportunity.latitude, -1.9482);
  assert.equal(opportunity.longitude, 354.4742);
  assert.match(opportunity.primaryMission, /Eagle Crater/);
  assert.match(opportunity.primaryMission, /Meridiani Planum/);
  assert.match(opportunity.primaryMission, /Endeavour Crater/);
  assert.match(opportunity.narrativeTranscript, /landed at Eagle Crater in Meridiani Planum/i);
  assert.match(opportunity.narrativeTranscript, /Endeavour Crater/);
});

test('coordinate conventions documentation explains datums, range, and scene projection limits', async () => {
  const doc = await readFile(new URL('../docs/coordinate-conventions.md', import.meta.url), 'utf8');
  const dateNotes = await readFile(new URL('../docs/mission-data-notes.md', import.meta.url), 'utf8');

  assert.match(doc, /0°.*360°/);
  assert.match(doc, /Planetocentric/i);
  assert.match(doc, /planetographic/i);
  assert.match(doc, /22\.27° N, 312\.05° E/);
  assert.match(doc, /\*\*does not\*\* convert between planetary coordinate datums/i);
  assert.match(dateNotes, /1982-11-11/);
  assert.match(dateNotes, /1982-11-13/);
});
