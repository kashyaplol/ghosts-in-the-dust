export const ASSET_STATES = Object.freeze({
  NOT_REQUESTED: 'not-requested',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
  FALLBACK: 'fallback',
});

export function getTextureStatusLabel(status) {
  if (status === ASSET_STATES.LOADED) return 'NASA surface texture active';
  if (status === ASSET_STATES.FAILED || status === ASSET_STATES.FALLBACK) {
    return 'procedural surface fallback active';
  }
  if (status === ASSET_STATES.LOADING) return 'surface texture loading';
  return 'surface texture not requested';
}
