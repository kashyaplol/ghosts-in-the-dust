import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import equipment from '@/data/equipment.json';

const SpaceContext = createContext(null);

export function SpaceProvider({ children }) {
  const [activeBody, setActiveBody] = useState('Moon');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [isInspectorOpen, setInspectorOpen] = useState(false);
  const [isPlayingAudio, setPlayingAudio] = useState(false);

  const selectedEquipment = useMemo(
    () => equipment.find((item) => item.id === selectedEquipmentId) || null,
    [selectedEquipmentId],
  );

  const switchBody = useCallback((body) => {
    setActiveBody(body);
    setSelectedEquipmentId(null);
    setInspectorOpen(false);
    setPlayingAudio(false);
  }, []);
  const selectEquipment = useCallback((id) => {
    const mission = equipment.find((item) => item.id === id);
    if (mission && mission.body === activeBody) {
      setSelectedEquipmentId(id);
      setInspectorOpen(false);
      setPlayingAudio(false);
    }
  }, [activeBody]);
  const clearSelection = useCallback(() => setSelectedEquipmentId(null), []);
  const openInspector = useCallback(() => setInspectorOpen(true), []);
  const closeInspector = useCallback(() => setInspectorOpen(false), []);
  const startAudio = useCallback(() => setPlayingAudio(true), []);
  const stopAudio = useCallback(() => setPlayingAudio(false), []);

  const value = useMemo(() => ({
    activeBody,
    selectedEquipment,
    selectedEquipmentId,
    isInspectorOpen,
    isPlayingAudio,
    switchBody,
    selectEquipment,
    clearSelection,
    openInspector,
    closeInspector,
    startAudio,
    stopAudio,
  }), [
    activeBody,
    isInspectorOpen,
    isPlayingAudio,
    selectedEquipment,
    selectedEquipmentId,
    switchBody,
    selectEquipment,
    clearSelection,
    openInspector,
    closeInspector,
    startAudio,
    stopAudio,
  ]);

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
}

export function useSpaceContext() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpaceContext must be used inside SpaceProvider.');
  }
  return context;
}
