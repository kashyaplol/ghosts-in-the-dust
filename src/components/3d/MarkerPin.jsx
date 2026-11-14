import { useFrame } from '@react-three/fiber';
import { memo, useRef, useState } from 'react';

function MarkerPin({ mission, selected, onSelect }) {
  const markerRef = useRef();
  const [hovered, setHovered] = useState(false);
  const position = mission.position;
  const color = selected ? '#67c5d9' : mission.body === 'Mars' ? '#df8862' : '#d49a45';

  useFrame(({ clock }) => {
    if (!markerRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.08;
    const scale = (selected ? 1.25 : hovered ? 1.15 : 0.95) * pulse;
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
      <sphereGeometry args={[0.036, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 1.8 : hovered ? 1.4 : 0.9}
        toneMapped={false}
      />
    </mesh>
  );
}

export default memo(MarkerPin);
