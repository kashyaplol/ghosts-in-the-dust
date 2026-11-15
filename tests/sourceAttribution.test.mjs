import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const EXPECTED_SOURCES = {
  'apollo-11-lm': {
    publisher: 'NASA NSSDCA',
    title: 'Apollo 11',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html',
  },
  'apollo-15-lrv': {
    publisher: 'NASA',
    title: 'Apollo Missions',
    url: 'https://www.nasa.gov/specials/apollo50th/missions.html',
  },
  'viking-1-lander': {
    publisher: 'NASA Science',
    title: 'Viking 1',
    url: 'https://science.nasa.gov/mission/viking-1/',
  },
  'opportunity-mer-b': {
    publisher: 'NASA Science',
    title: 'Opportunity',
    url: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  'curiosity-msl': {
    publisher: 'NASA JPL',
    title: 'Mars Science Laboratory: Curiosity Rover',
    url: 'https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl/',
  },
  'ingenuity-helicopter': {
    publisher: 'NASA Science',
    title: 'Ingenuity Mars Helicopter',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
  },
};

test('associates all six missions with the official NASA source references', async () => {
  const equipment = JSON.parse(
    await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'),
  );
  assert.equal(equipment.length, 6);

  for (const mission of equipment) {
    const expected = EXPECTED_SOURCES[mission.id];
    assert.ok(expected, `Missing expected source for ${mission.id}`);
    assert.ok(Array.isArray(mission.sources) && mission.sources.length === 1);
    assert.deepEqual(mission.sources[0], expected);
  }
});

test('renders safe external links in TelemetryHUD source references', async () => {
  const hud = await readFile(
    new URL('../src/components/ui/TelemetryHUD.jsx', import.meta.url),
    'utf8',
  );
  assert.match(hud, /Source References/);
  assert.match(hud, /target="_blank"/);
  assert.match(hud, /rel="noopener noreferrer"/);
});

test('labels Final Hours as Mission Narrative with browser-generated audio disclosure', async () => {
  const audio = await readFile(
    new URL('../src/components/ui/AudioPlayer.jsx', import.meta.url),
    'utf8',
  );
  assert.match(audio, /Final Hours · Mission Narrative/);
  assert.doesNotMatch(audio, /Archive Transcript/i);
  assert.match(audio, /Browser-generated narration\. Not original mission audio\./);
});
