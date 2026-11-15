import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { latLongToVector3 } from '../src/utils/coordinates.js';

const expectedSources = {
  'apollo-11-lm': {
    title: 'Apollo 11',
    publisher: 'NASA NSSDCA',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html',
  },
  'apollo-15-lrv': {
    title: 'Apollo Missions',
    publisher: 'NASA',
    url: 'https://www.nasa.gov/specials/apollo50th/missions.html',
  },
  'viking-1-lander': {
    title: 'Viking 1',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/viking-1/',
  },
  'opportunity-mer-b': {
    title: 'Opportunity',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  'curiosity-msl': {
    title: 'Mars Science Laboratory: Curiosity Rover',
    publisher: 'NASA JPL',
    url: 'https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl/',
  },
  'ingenuity-helicopter': {
    title: 'Ingenuity Mars Helicopter',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
  },
};

test('associates all six missions with supplied NASA references and Apollo 11 correction citations', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  assert.equal(equipment.length, 6);

  equipment.forEach((mission) => {
    const expected = expectedSources[mission.id];
    assert.ok(expected, `Expected reference for ${mission.id}`);
    assert.equal(Array.isArray(mission.sources), true);
    assert.deepEqual(mission.sources[0], expected);
  });

  const apollo11 = equipment.find((item) => item.id === 'apollo-11-lm');
  assert.equal(apollo11.technicalSpecs.mass, '2,034 kg dry descent stage');
  assert.equal(apollo11.technicalSpecs.totalDistance, '0.25 km on the lunar surface');
  assert.deepEqual(apollo11.sources[1], {
    title: 'Apollo 11 Lunar Module / EASEP (1969-059C)',
    publisher: 'NASA NSSDCA',
    url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
  });
});

test('aligns Apollo 11 latLongToVector3 output with Three.js SphereGeometry equirectangular UV mapping', () => {
  const lat = 0.67408;
  const lon = 23.47297;
  const radius = 2.05;
  const [mx, my, mz] = latLongToVector3(lat, lon, radius);
  const phi = 2 * Math.PI * (0.5 + lon / 360);
  const theta = Math.PI * (1 - (0.5 + lat / 180));
  const sx = -radius * Math.cos(phi) * Math.sin(theta);
  const sy = radius * Math.cos(theta);
  const sz = radius * Math.sin(phi) * Math.sin(theta);

  assert.ok(Math.abs(mx - sx) < 1e-12);
  assert.ok(Math.abs(my - sy) < 1e-12);
  assert.ok(Math.abs(mz - sz) < 1e-12);
});

test('exposes mission sources UI safely and uses accurate mission narrative disclosure', async () => {
  const telemetry = await readFile(new URL('../src/components/ui/TelemetryHUD.jsx', import.meta.url), 'utf8');
  const audio = await readFile(new URL('../src/components/ui/AudioPlayer.jsx', import.meta.url), 'utf8');

  assert.match(telemetry, /Source References/);
  assert.match(telemetry, /target="_blank"/);
  assert.match(telemetry, /rel="noopener noreferrer"/);

  assert.doesNotMatch(audio, /Archive Transcript/);
  assert.match(audio, /Final Hours · Mission Narrative/);
  assert.match(audio, /Browser-generated narration\. Not original mission audio\./);
});
