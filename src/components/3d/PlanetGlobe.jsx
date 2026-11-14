import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import equipment from '@/data/equipment.json';
import MarkerPin from '@/components/3d/MarkerPin';
import PlanetSurface from '@/components/3d/PlanetSurface';
import TextureFallbackBoundary from '@/components/3d/TextureFallbackBoundary';
import { getTextureBoundaryKey } from '@/utils/texture';
import { latLongToVector3 } from '@/utils/coordinates';

const planetColors = {
  Moon: '#888888',
  Mars: '#cc4422',
};

export default function PlanetGlobe({
  activeBody,
  selectedEquipmentId,
  onSelectEquipment,
  onTextureStatus,
  textureStatus,
}) {
  const missions = useMemo(() => (
    equipment
      .filter((item) => item.body === activeBody)
      .map((item) => ({
        ...item,
        position: latLongToVector3(item.latitude, item.longitude, 2.05),
      }))
  ), [activeBody]);
  const lastBody = useRef(activeBody);
  const [previousBody, setPreviousBody] = useState(null);
  const reportTextureLoaded = useCallback(
    () => onTextureStatus?.(activeBody, 'loaded'),
    [activeBody, onTextureStatus],
  );
  const reportTextureFallback = useCallback(
    () => onTextureStatus?.(activeBody, 'failed'),
    [activeBody, onTextureStatus],
  );

  useEffect(() => {
    if (lastBody.current === activeBody) return undefined;
    const oldBody = lastBody.current;
    lastBody.current = activeBody;
    setPreviousBody(oldBody);
    const timeout = window.setTimeout(() => setPreviousBody(null), 800);
    return () => window.clearTimeout(timeout);
  }, [activeBody]);

  return (
    <>
      <TextureFallbackBoundary
        key={getTextureBoundaryKey(activeBody)}
        resetKey={getTextureBoundaryKey(activeBody)}
        onError={reportTextureFallback}
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
        <PlanetSurface
          activeBody={activeBody}
          previousBody={previousBody}
          onLoaded={reportTextureLoaded}
          hideSurface={textureStatus === 'loading'}
        />
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
