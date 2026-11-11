import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';

function TexturedSurface({ texturePath, color }) {
  const materialRef = useRef();
  const texture = useTexture(texturePath);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.opacity = Math.min(1, materialRef.current.opacity + delta * 2);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        color={color}
        transparent
        opacity={0}
        roughness={0.9}
      />
    </mesh>
  );
}

export default function PlanetSurface({ body, color }) {
  const texturePath = body === 'Moon'
    ? '/textures/moon_surface.jpg'
    : '/textures/mars_surface.jpg';

  return <TexturedSurface texturePath={texturePath} color={color} />;
}

