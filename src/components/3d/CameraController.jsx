import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import {
  DEFAULT_DESKTOP_DISTANCE,
  EXPLORE_DESKTOP_DISTANCE,
  FOCUS_DESKTOP_DISTANCE,
  clampZoomDistance,
  getResponsiveDistance,
} from '@/utils/cameraZoom';

function getDestination(target, action, aspect) {
  if (action?.type === 'explore') {
    return new Vector3(0, 0, getResponsiveDistance(EXPLORE_DESKTOP_DISTANCE, aspect));
  }
  if (action?.type === 'focus' && target) {
    return new Vector3(...target)
      .normalize()
      .multiplyScalar(getResponsiveDistance(FOCUS_DESKTOP_DISTANCE, aspect));
  }
  if (action?.type === 'reset' || !target) {
    return new Vector3(0, 0, getResponsiveDistance(DEFAULT_DESKTOP_DISTANCE, aspect));
  }
  return new Vector3(...target)
    .normalize()
    .multiplyScalar(getResponsiveDistance(FOCUS_DESKTOP_DISTANCE, aspect));
}

export default function CameraController({
  target,
  controlsRef,
  action,
  zoomRequest,
  onZoomChange,
}) {
  const { camera, size } = useThree();
  const animationRef = useRef(null);
  const zoomAnimRef = useRef(null);
  const initializedRef = useRef(false);
  const lastReportedRef = useRef(camera.position.length());
  const aspect = size.width / Math.max(1, size.height);

  useEffect(() => {
    const controls = controlsRef.current;
    const destination = getDestination(target, action, aspect);
    zoomAnimRef.current = null;

    if (!initializedRef.current && !target && !action) {
      initializedRef.current = true;
      camera.position.copy(destination);
      const dist = clampZoomDistance(camera.position.length());
      lastReportedRef.current = dist;
      onZoomChange?.(dist);
      controls?.target.set(0, 0, 0);
      controls?.update();
      return undefined;
    }
    initializedRef.current = true;

    const animation = {
      elapsed: 0,
      start: camera.position.clone(),
      destination,
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

  useEffect(() => {
    if (!zoomRequest || !Number.isFinite(zoomRequest.distance)) return;
    const controls = controlsRef.current;
    animationRef.current = null;
    if (controls) controls.enabled = true;

    const targetDistance = clampZoomDistance(zoomRequest.distance);
    if (!zoomRequest.smooth) {
      zoomAnimRef.current = null;
      const dir = camera.position.lengthSq() > 1e-6
        ? camera.position.clone().normalize()
        : new Vector3(0, 0, 1);
      camera.position.copy(dir.multiplyScalar(targetDistance));
      controls?.target.set(0, 0, 0);
      controls?.update();
      lastReportedRef.current = targetDistance;
      onZoomChange?.(targetDistance);
      return;
    }

    zoomAnimRef.current = {
      elapsed: 0,
      startDist: clampZoomDistance(camera.position.length()),
      endDist: targetDistance,
    };
  }, [zoomRequest, camera, controlsRef, onZoomChange]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const animation = animationRef.current;
    if (animation) {
      animation.elapsed = Math.min(animation.elapsed + delta / 0.7, 1);
      const eased = animation.elapsed * animation.elapsed * (3 - 2 * animation.elapsed);
      camera.position.lerpVectors(animation.start, animation.destination, eased);
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
    } else if (zoomAnimRef.current) {
      const zAnim = zoomAnimRef.current;
      zAnim.elapsed = Math.min(zAnim.elapsed + delta / 0.18, 1);
      const eased = 1 - (1 - zAnim.elapsed) * (1 - zAnim.elapsed);
      const nextDist = zAnim.startDist + (zAnim.endDist - zAnim.startDist) * eased;
      const dir = camera.position.lengthSq() > 1e-6
        ? camera.position.clone().normalize()
        : new Vector3(0, 0, 1);
      camera.position.copy(dir.multiplyScalar(nextDist));
      controls?.update();
      if (zAnim.elapsed >= 1) zoomAnimRef.current = null;
    }

    const currentDist = clampZoomDistance(camera.position.length());
    if (Math.abs(currentDist - lastReportedRef.current) > 0.015) {
      lastReportedRef.current = currentDist;
      onZoomChange?.(currentDist);
    }
  });

  return null;
}
