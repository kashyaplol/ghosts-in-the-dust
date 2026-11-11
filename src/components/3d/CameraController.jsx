import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

export default function CameraController({ target, controlsRef }) {
  const { camera } = useThree();
  const destination = useRef(new Vector3(0, 0, 5));
  const lookTarget = useRef(new Vector3());

  useEffect(() => {
    if (!target) {
      destination.current.set(0, 0, 5);
      lookTarget.current.set(0, 0, 0);
      return;
    }

    const direction = new Vector3(...target).normalize();
    destination.current.copy(direction.multiplyScalar(4.2));
    lookTarget.current.copy(direction.multiplyScalar(2));
  }, [target]);

  useFrame(() => {
    camera.position.lerp(destination.current, 0.06);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookTarget.current, 0.06);
      controlsRef.current.update();
    }
  });

  return null;
}

