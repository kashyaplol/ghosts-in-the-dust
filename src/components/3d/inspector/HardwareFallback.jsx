import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function HardwareFallback({ wireframe, autoRotate }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1.3, 0.35, 0.8]} />
        <meshStandardMaterial color="#b4bbc8" wireframe={wireframe} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.45, 12]} />
        <meshStandardMaterial color="#ffb703" wireframe={wireframe} />
      </mesh>
      <mesh position={[-0.85, 0, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.6]} />
        <meshStandardMaterial color="#00f3ff" wireframe={wireframe} />
      </mesh>
      <mesh position={[0.85, 0, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.6]} />
        <meshStandardMaterial color="#00f3ff" wireframe={wireframe} />
      </mesh>
    </group>
  );
}

