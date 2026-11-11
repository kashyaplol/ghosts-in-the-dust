export const modelPaths = {
  'apollo-11-lm': '/models/apollo-lunar-module.glb',
  'opportunity-mer-b': '/models/opportunity-mer-b.glb',
  'viking-1-lander': '/models/viking-lander.glb',
  'ingenuity-helicopter': '/models/ingenuity-mars-helicopter.glb',
};

export function getModelPath(id) {
  return modelPaths[id] || null;
}

export function hasHardwareModel(id) {
  return Boolean(getModelPath(id));
}

