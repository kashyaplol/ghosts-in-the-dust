import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Box3, Vector3 } from 'three';
import { getModelPath } from '@/utils/models';

export default function HardwareModel({
  equipment,
  wireframe,
  autoRotate,
  onLoaded,
}) {
  const { scene } = useGLTF(getModelPath(equipment.id));
  const groupRef = useRef();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material = Array.isArray(node.material)
          ? node.material.map((material) => material.clone())
          : node.material.clone();
      }
    });
    return clone;
  }, [scene]);
  const { center, scale } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const modelCenter = bounds.getCenter(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z, 0.001);
    return {
      center: modelCenter,
      scale: 1.8 / largestDimension,
    };
  }, [model]);

  useEffect(() => {
    model.traverse((node) => {
      if (node.isMesh && node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          material.wireframe = wireframe;
        });
      }
    });
  }, [model, wireframe]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={[-center.x * scale, -center.y * scale, -center.z * scale]}>
      <primitive object={model} />
    </group>
  );
}
