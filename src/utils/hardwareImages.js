export const hardwareImages = {
  'apollo-15-lrv': {
    path: '/images/probes/apollo-15-lrv.webp',
    kind: 'NASA ARCHIVAL IMAGE',
    attribution: 'NASA, Apollo 15 mission imagery via Wikimedia Commons',
  },
  'curiosity-msl': {
    path: '/images/probes/curiosity-rover.webp',
    kind: 'NASA ARCHIVAL IMAGE',
    attribution: 'NASA/JPL-Caltech, Curiosity MSL imagery via Wikimedia Commons',
  },
};

export function getHardwareImage(id) {
  return hardwareImages[id] || null;
}

export function hasHardwareImage(id) {
  return Boolean(getHardwareImage(id));
}
