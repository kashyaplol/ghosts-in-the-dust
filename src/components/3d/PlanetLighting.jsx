import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { SUN_DIRECTION } from '@/utils/planetLighting';

export default function PlanetLighting() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMappingExposure = 1.05;
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.16} color="#8793ad" />
      <directionalLight
        position={SUN_DIRECTION.map((value) => value * -6)}
        intensity={3.2}
        color="#fff4df"
      />
      <hemisphereLight
        color="#65708b"
        groundColor="#05060a"
        intensity={0.18}
      />
    </>
  );
}
