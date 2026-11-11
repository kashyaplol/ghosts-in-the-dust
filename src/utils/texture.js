export function getTexturePath(body) {
  return body === 'Moon'
    ? '/textures/moon_surface.jpg'
    : '/textures/mars_surface.jpg';
}

export function getTextureBoundaryKey(body) {
  return body;
}

