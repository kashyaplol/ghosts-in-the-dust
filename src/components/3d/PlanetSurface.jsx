import { useTexture } from '@react-three/drei';
import { useEffect } from 'react';
import { getTexturePath } from '@/utils/texture';

function TexturedSurface({ activeBody, previousBody, onLoaded, hideSurface }) {
  const paths = previousBody
    ? [getTexturePath(previousBody), getTexturePath(activeBody)]
    : [getTexturePath(activeBody)];
  const textures = useTexture(paths);
  const activeTexture = previousBody ? textures[1] : textures[0];

  useEffect(() => {
    onLoaded?.();
  }, [activeBody, onLoaded]);

  if (hideSurface) return null;
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={activeTexture}
        color="#ffffff"
        transparent={false}
        opacity={1}
        depthWrite
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}

export default function PlanetSurface({ activeBody, previousBody, onLoaded, hideSurface }) {
  return (
    <TexturedSurface
      activeBody={activeBody}
      previousBody={previousBody}
      onLoaded={onLoaded}
      hideSurface={hideSurface}
    />
  );
}
