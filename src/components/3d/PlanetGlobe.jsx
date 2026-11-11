import { useMemo } from 'react';
import equipment from '@/data/equipment.json';
import MarkerPin from '@/components/3d/MarkerPin';
import PlanetSurface from '@/components/3d/PlanetSurface';
import TextureFallbackBoundary from '@/components/3d/TextureFallbackBoundary';
import { latLongToVector3 } from '@/utils/coordinates';

const planetColors = {
  Moon: '#888888',
  Mars: '#cc4422',
};

export default function PlanetGlobe({
  activeBody,
  selectedEquipmentId,
  onSelectEquipment,
}) {
  const missions = useMemo(() => (
    equipment
      .filter((item) => item.body === activeBody)
      .map((item) => ({
        ...item,
        position: latLongToVector3(item.latitude, item.longitude, 2.05),
      }))
  ), [activeBody]);

  return (
    <>
      <TextureFallbackBoundary
        fallback={(
          <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial
              color={planetColors[activeBody]}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
        )}
      >
        <PlanetSurface body={activeBody} color={planetColors[activeBody]} />
      </TextureFallbackBoundary>
      {missions.map((mission) => (
        <MarkerPin
          key={mission.id}
          mission={mission}
          selected={mission.id === selectedEquipmentId}
          onSelect={onSelectEquipment}
        />
      ))}
    </>
  );
}
