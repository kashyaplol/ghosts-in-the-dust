import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedSources = {
  'apollo-11-lm': {
    title: 'NASA NSSDCA — Apollo 11',
    publisher: 'NASA NSSDCA',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html',
  },
  'apollo-15-lrv': {
    title: 'NASA — Apollo Missions',
    publisher: 'NASA',
    url: 'https://www.nasa.gov/specials/apollo50th/missions.html',
  },
  'viking-1-lander': {
    title: 'NASA Science — Viking 1',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/viking-1/',
  },
  'opportunity-mer-b': {
    title: 'NASA Science — Opportunity',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  'curiosity-msl': {
    title: 'NASA JPL — Mars Science Laboratory: Curiosity Rover',
    publisher: 'NASA JPL',
    url: 'https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl/',
  },
  'ingenuity-helicopter': {
    title: 'NASA Science — Ingenuity Mars Helicopter',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
  },
};

test('associates all six missions with the exact supplied NASA reference links', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  assert.equal(equipment.length, 6);

  equipment.forEach((mission) => {
    const expected = expectedSources[mission.id];
    assert.ok(expected, `Expected reference for ${mission.id}`);
    assert.equal(Array.isArray(mission.sources), true);
    assert.deepEqual(mission.sources, [expected]);
  });
});

test('exposes mission sources UI safely and uses accurate mission narrative disclosure', async () => {
  const telemetry = await readFile(new URL('../src/components/ui/TelemetryHUD.jsx', import.meta.url), 'utf8');
  const audio = await readFile(new URL('../src/components/ui/AudioPlayer.jsx', import.meta.url), 'utf8');

  assert.match(telemetry, /Mission Sources/);
  assert.match(telemetry, /target="_blank"/);
  assert.match(telemetry, /rel="noopener noreferrer"/);

  assert.doesNotMatch(audio, /Archive Transcript/);
  assert.match(audio, /Final Hours · Mission Narrative/);
  assert.match(audio, /Browser-generated narration\. Not original mission audio\./);
});
