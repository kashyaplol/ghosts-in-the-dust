import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

const DEFAULT_POSITION = new Vector3(0, 0, 5);
const EXPLORE_POSITION = new Vector3(0, 0, 5.8);

function getDestination(target, action) {
  if (action?.type === 'explore') return EXPLORE_POSITION;
  if (action?.type === 'focus' && target) {
    return new Vector3(...target).normalize().multiplyScalar(5.2);
  }
  if (action?.type === 'reset' || !target) return DEFAULT_POSITION;
  return new Vector3(...target).normalize().multiplyScalar(5.2);
}

export default function CameraController({ target, controlsRef, action }) {
  const { camera } = useThree();
  const animationRef = useRef(null);

  useEffect(() => {
    const controls = controlsRef.current;
    const animation = {
      elapsed: 0,
      start: camera.position.clone(),
      destination: getDestination(target, action),
    };

    animationRef.current = animation;
    if (controls) {
      controls.enabled = false;
      controls.target.set(0, 0, 0);
      controls.update();
    }

    return () => {
      if (animationRef.current !== animation) return;
      animationRef.current = null;
      if (controls) {
        controls.enabled = true;
        controls.target.set(0, 0, 0);
        controls.update();
      }
    };
  }, [target, action, camera, controlsRef]);

  useFrame((_, delta) => {
    const animation = animationRef.current;
    if (!animation) return;

    animation.elapsed = Math.min(animation.elapsed + delta / 0.7, 1);
    const eased = animation.elapsed * animation.elapsed
      * (3 - 2 * animation.elapsed);
    camera.position.lerpVectors(animation.start, animation.destination, eased);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }

    if (animation.elapsed >= 1) {
      animationRef.current = null;
      if (controls) {
        controls.enabled = true;
        controls.target.set(0, 0, 0);
        controls.update();
      }
    }
  });

  return null;
}
