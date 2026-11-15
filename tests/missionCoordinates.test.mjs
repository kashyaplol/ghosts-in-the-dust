import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { latLongToVector3 } from '../src/utils/coordinates.js';

const EXPECTED_LANDING_SITES = {
  'apollo-11-lm': {
    body: 'Moon',
    lat: 0.67408,
    lon: 23.47297,
    latHemisphere: 'N',
    eastLonRange: [23.4, 23.6],
    sign: [1, 1, -1],
  },
  'apollo-15-lrv': {
    body: 'Moon',
    lat: 26.1322,
    lon: 3.6339,
    latHemisphere: 'N',
    eastLonRange: [3.5, 3.8],
    sign: [1, 1, -1],
  },
  'viking-1-lander': {
    body: 'Mars',
    lat: 22.27,
    lon: 312.05,
    latHemisphere: 'N',
    eastLonRange: [311.7, 312.2],
    sign: [1, 1, 1],
  },
  'opportunity-mer-b': {
    body: 'Mars',
    lat: -1.9482,
    lon: 354.4742,
    latHemisphere: 'S',
    eastLonRange: [354.3, 354.6],
    sign: [1, -1, 1],
  },
  'curiosity-msl': {
    body: 'Mars',
    lat: -4.5895,
    lon: 137.4417,
    latHemisphere: 'S',
    eastLonRange: [137.3, 137.6],
    sign: [-1, -1, -1],
  },
  'ingenuity-helicopter': {
    body: 'Mars',
    lat: 18.4447,
    lon: 77.4508,
    latHemisphere: 'N',
    eastLonRange: [77.3, 77.7],
    sign: [1, 1, -1],
  },
};

test('validates all six mission coordinates against NASA landing-site records and 0-360E convention', async () => {
  const equipment = JSON.parse(await readFile(new URL('../src/data/equipment.json', import.meta.url), 'utf8'));
  assert.equal(equipment.length, 6);

  for (const mission of equipment) {
    const expected = EXPECTED_LANDING_SITES[mission.id];
    assert.ok(expected, `Missing expected coordinates for ${mission.id}`);
    assert.equal(mission.body, expected.body);

    // Consistent 0-360 east-positive longitude convention across all missions
    assert.equal(mission.longitude >= 0 && mission.longitude < 360, true, `${mission.id} longitude must be in [0, 360)`);
    assert.ok(
      mission.longitude >= expected.eastLonRange[0] && mission.longitude <= expected.eastLonRange[1],
      `${mission.id} longitude ${mission.longitude} outside expected range ${expected.eastLonRange.join('..')}`,
    );

    // Correct latitude hemisphere and proximity to NASA reference site
    assert.equal(mission.latitude >= 0 ? 'N' : 'S', expected.latHemisphere, `${mission.id} wrong latitude hemisphere`);
    assert.ok(Math.abs(mission.latitude - expected.lat) < 0.01, `${mission.id} latitude mismatch`);
    assert.ok(Math.abs(mission.longitude - expected.lon) < 0.01, `${mission.id} longitude mismatch`);
  }
});

test('latLongToVector3 places every mission in the expected 3D octant and SphereGeometry UV direction', () => {
  for (const [id, site] of Object.entries(EXPECTED_LANDING_SITES)) {
    const [x, y, z] = latLongToVector3(site.lat, site.lon, 2.05);
    assert.ok(Math.abs(Math.hypot(x, y, z) - 2.05) < 1e-12, `${id} vector magnitude mismatch`);
    assert.equal(Math.sign(x), site.sign[0], `${id} X sign mismatch`);
    assert.equal(Math.sign(y), site.sign[1], `${id} Y sign mismatch`);
    assert.equal(Math.sign(z), site.sign[2], `${id} Z sign mismatch`);

    const phi = 2 * Math.PI * (0.5 + site.lon / 360);
    const theta = Math.PI * (1 - (0.5 + site.lat / 180));
    const ux = -Math.cos(phi) * Math.sin(theta);
    const uy = Math.cos(theta);
    const uz = Math.sin(phi) * Math.sin(theta);
    const dot = (x / 2.05) * ux + (y / 2.05) * uy + (z / 2.05) * uz;
    assert.ok(dot > 0.999999999, `${id} UV alignment mismatch: dot=${dot}`);
  }
});

test('all 3D marker and camera consumers use the shared latLongToVector3 helper', async () => {
  const globe = await readFile(new URL('../src/components/3d/PlanetGlobe.jsx', import.meta.url), 'utf8');
  const canvas = await readFile(new URL('../src/components/3d/CanvasContainer.jsx', import.meta.url), 'utf8');
  const marker = await readFile(new URL('../src/components/3d/MarkerPin.jsx', import.meta.url), 'utf8');
  const lighting = await readFile(new URL('../src/utils/planetLighting.js', import.meta.url), 'utf8');

  for (const [name, src] of [['PlanetGlobe', globe], ['CanvasContainer', canvas], ['planetLighting', lighting]]) {
    assert.match(src, /latLongToVector3/, `${name} must use latLongToVector3`);
    assert.doesNotMatch(src, /Math\.cos|Math\.sin/, `${name} must not duplicate spherical trig`);
  }
  assert.doesNotMatch(marker, /Math\.cos.*latitude|Math\.sin.*longitude/, 'MarkerPin must use mission.position');
});
