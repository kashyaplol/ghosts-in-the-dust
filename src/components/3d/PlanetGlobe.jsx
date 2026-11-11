import { OrbitControls } from '@react-three/drei';
import equipment from '@/data/equipment.json';
import { latLongToVector3 } from '@/utils/coordinates';

function MissionMarker({ mission, selected, onSelect }) {
  const position = latLongToVector3(
    mission.latitude,
    mission.longitude,
    2.05,
  );

  return (
    <mesh
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(mission.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color={selected ? '#00f3ff' : '#ffb703'}
        emissive={selected ? '#00f3ff' : '#ffb703'}
        emissiveIntensity={selected ? 2.5 : 1.2}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function PlanetGlobe({
  activeBody,
  selectedEquipmentId,
  onSelectEquipment,
}) {
  const planetColor = activeBody === 'Moon' ? '#888888' : '#cc4422';
  const visibleEquipment = equipment.filter(
    (item) => item.body === activeBody,
  );

  return (
    <>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color={planetColor} roughness={0.9} />
      </mesh>

      {visibleEquipment.map((mission) => (
        <MissionMarker
          key={mission.id}
          mission={mission}
          selected={mission.id === selectedEquipmentId}
          onSelect={onSelectEquipment}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={!selectedEquipmentId}
        autoRotateSpeed={0.5}
        enableDamping
      />
    </>
  );
}

