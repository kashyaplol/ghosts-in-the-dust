import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export default function PlanetLighting() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMappingExposure = 1.05;
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.16} color="#8793ad" />
      <directionalLight
        position={[-4, 3, 5]}
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
