import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { getTexturePath } from '@/utils/texture';

function TexturedSurface({
  activeBody,
  previousBody,
  onLoaded,
}) {
  const activeMaterial = useRef();
  const previousMaterial = useRef();
  const elapsed = useRef(0);
  const paths = previousBody
    ? [getTexturePath(previousBody), getTexturePath(activeBody)]
    : [getTexturePath(activeBody)];
  const textures = useTexture(paths);

  useEffect(() => {
    elapsed.current = 0;
    onLoaded?.();
  }, [activeBody, onLoaded]);

  useFrame((_, delta) => {
    elapsed.current = Math.min(1, elapsed.current + delta * 1.5);
    if (activeMaterial.current) activeMaterial.current.opacity = elapsed.current;
    if (previousMaterial.current) previousMaterial.current.opacity = 1 - elapsed.current;
  });

  const activeTexture = previousBody ? textures[1] : textures[0];
  return (
    <>
      {previousBody && (
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            ref={previousMaterial}
            map={textures[0]}
            color="#ffffff"
            transparent
            opacity={1}
            depthWrite={false}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      )}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          ref={activeMaterial}
          map={activeTexture}
          color="#ffffff"
          transparent
          opacity={previousBody ? 0 : 1}
          depthWrite={false}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </>
  );
}

export default function PlanetSurface({
  activeBody,
  previousBody,
  onLoaded,
}) {
  return (
    <TexturedSurface
      activeBody={activeBody}
      previousBody={previousBody}
      onLoaded={onLoaded}
    />
  );
}
