import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';

const modelPaths = {
  'apollo-11-lm': '/models/apollo-lunar-module.glb',
  'opportunity-mer-b': '/models/opportunity-mer-b.glb',
  'viking-1-lander': '/models/viking-lander.glb',
  'ingenuity-helicopter': '/models/ingenuity-mars-helicopter.glb',
};

const modelScales = {
  'apollo-11-lm': 0.9,
  'opportunity-mer-b': 1.4,
  'viking-1-lander': 0.8,
  'ingenuity-helicopter': 1.2,
};

export function hasHardwareModel(id) {
  return Boolean(modelPaths[id]);
}

export default function HardwareModel({ equipment, wireframe, autoRotate }) {
  const { scene } = useGLTF(modelPaths[equipment.id]);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material.wireframe = wireframe;
      }
    });
  }, [scene, wireframe]);

  useFrame((_, delta) => {
    if (autoRotate) scene.rotation.y += delta * 0.6;
  });

  return (
    <primitive
      object={scene}
      scale={modelScales[equipment.id] || 1}
      rotation={[0, 0, 0]}
    />
  );
}

Object.values(modelPaths).forEach((path) => useGLTF.preload(path));
