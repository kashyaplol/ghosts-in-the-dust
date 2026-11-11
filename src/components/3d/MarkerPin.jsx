import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

export default function MarkerPin({ mission, selected, onSelect }) {
  const markerRef = useRef();
  const [hovered, setHovered] = useState(false);
  const position = mission.position;

  useFrame(({ clock }) => {
    if (!markerRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.12;
    const scale = (selected ? 1.35 : hovered ? 1.2 : 1) * pulse;
    markerRef.current.scale.setScalar(scale);
  });

  return (
    <mesh
      ref={markerRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta > 4) return;
        onSelect(mission.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color={selected ? '#00f3ff' : '#ffb703'}
        emissive={selected ? '#00f3ff' : '#ffb703'}
        emissiveIntensity={selected ? 3 : hovered ? 2 : 1.2}
        toneMapped={false}
      />
    </mesh>
  );
}
