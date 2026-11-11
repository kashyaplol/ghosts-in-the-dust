export function latLongToVector3(lat, lon, radius = 2) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);

  return [x, y, z];
}

