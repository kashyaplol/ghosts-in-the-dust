import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { latLongToVector3 } from '../src/utils/coordinates.js';
import { getTranscriptProgress } from '../src/utils/audio.js';
import { getModelPath, hasHardwareModel } from '../src/utils/models.js';
import { getTextureBoundaryKey, getTexturePath } from '../src/utils/texture.js';
import {
  APOLLO_11_NORMAL,
  SUN_DIRECTION,
  dotProduct,
} from '../src/utils/planetLighting.js';
import { getHardwareImage, hasHardwareImage } from '../src/utils/hardwareImages.js';
import {
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  readOnboardingState,
  writeOnboardingState,
} from '../src/utils/onboarding.js';
import { readFile as readSource } from 'node:fs/promises';

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

test('aims sunlight at the Apollo 11 lunar landing site', () => {
  assert.ok(Math.abs(Math.hypot(...APOLLO_11_NORMAL) - 1) < 1e-12);
  assert.ok(dotProduct(APOLLO_11_NORMAL, SUN_DIRECTION) > 0);
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

test('maps available hardware models and preserves fallbacks', async () => {
  const contents = await readFile(new URL('../src/data/equipment.json', import.meta.url));
  const equipment = JSON.parse(contents);
  const available = ['apollo-11-lm', 'opportunity-mer-b', 'viking-1-lander', 'ingenuity-helicopter'];

  for (const id of available) {
    const path = getModelPath(id);
    assert.ok(path);
    assert.equal(path.startsWith('/models/'), true);
    assert.equal(hasHardwareModel(id), true);
    const asset = new URL(`../public${path}`, import.meta.url);
    await stat(asset);
  }
  assert.equal(hasHardwareModel('apollo-15-lrv'), false);
  assert.equal(hasHardwareModel('curiosity-msl'), false);
  assert.ok(equipment.some((item) => item.id === 'apollo-15-lrv'));
  assert.ok(equipment.some((item) => item.id === 'curiosity-msl'));
});

test('maps verified static hardware images and preserves honest fallback', async () => {
  for (const id of ['apollo-15-lrv', 'curiosity-msl']) {
    const image = getHardwareImage(id);
    assert.ok(image);
    assert.equal(image.kind, 'NASA ARCHIVAL IMAGE');
    await stat(new URL(`../public${image.path}`, import.meta.url));
    assert.equal(hasHardwareImage(id), true);
  }
  assert.equal(hasHardwareImage('unknown-mission'), false);
  assert.equal(getHardwareImage('unknown-mission'), null);
});

test('isolates texture paths and resets boundary keys by body', () => {
  assert.equal(getTexturePath('Moon'), '/textures/moon_surface.jpg');
  assert.equal(getTexturePath('Mars'), '/textures/mars_surface.jpg');
  assert.notEqual(getTextureBoundaryKey('Moon'), getTextureBoundaryKey('Mars'));
});

test('clamps transcript progress and reaches completion', () => {
  assert.equal(getTranscriptProgress(0, 100), 0);
  assert.equal(getTranscriptProgress(50, 100), 0.5);
  assert.equal(getTranscriptProgress(100, 100), 1);
  assert.equal(getTranscriptProgress(200, 100), 1);
});

test('versions onboarding persistence and ignores stale state', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readOnboardingState(storage), null);
  writeOnboardingState(storage, 'completed');
  assert.deepEqual(readOnboardingState(storage), {
    version: ONBOARDING_VERSION,
    status: 'completed',
  });

  test('exposes all camera actions and keyboard bindings', async () => {
    const source = await readSource(new URL('../src/components/ui/CameraActions.jsx', import.meta.url), 'utf8');
    for (const [label, key] of [['Reset view', 'R'], ['Focus mission', 'F'], ['Explore planet', 'G']]) {
      assert.match(source, new RegExp(label));
      assert.match(source, new RegExp(`key: '${key}'`));
    }
  });
  values.set(ONBOARDING_STORAGE_KEY, JSON.stringify({ version: 'old', status: 'completed' }));
  assert.equal(readOnboardingState(storage), null);
});
