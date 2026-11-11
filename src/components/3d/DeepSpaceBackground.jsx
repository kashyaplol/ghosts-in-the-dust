import { useMemo } from 'react';
import { AdditiveBlending, DoubleSide } from 'three';

const starVertex = `
  attribute float size;
  attribute vec3 starColor;
  varying vec3 vColor;
  void main() {
    vColor = starColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (240.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragment = `
  varying vec3 vColor;
  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float softness = smoothstep(0.5, 0.05, distanceToCenter);
    gl_FragColor = vec4(vColor, softness);
  }
`;

function createStars(count, radius, seed) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let value = seed;
  const random = () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
  for (let index = 0; index < count; index += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const distance = radius * (0.72 + random() * 0.28);
    const offset = index * 3;
    positions[offset] = distance * Math.sin(phi) * Math.cos(theta);
    positions[offset + 1] = distance * Math.cos(phi);
    positions[offset + 2] = distance * Math.sin(phi) * Math.sin(theta);
    const temperature = random();
    colors[offset] = 0.72 + temperature * 0.28;
    colors[offset + 1] = 0.78 + (1 - temperature) * 0.2;
    colors[offset + 2] = 0.92 + temperature * 0.08;
    sizes[index] = 0.018 + random() * 0.045;
  }
  return { positions, colors, sizes };
}

function StarLayer({ count, radius, seed, opacity }) {
  const stars = useMemo(() => createStars(count, radius, seed), [count, radius, seed]);
  return (
    <points raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
        <bufferAttribute attach="attributes-starColor" args={[stars.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[stars.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertex}
        fragmentShader={starFragment}
        transparent
        depthWrite={false}
        uniforms={{ opacity: { value: opacity } }}
      />
    </points>
  );
}

function NebulaCloud({ position, scale, color, opacity }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.1, 0.2, -0.3]} raycast={() => null}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default function DeepSpaceBackground() {
  return (
    <group>
      <StarLayer count={420} radius={22} seed={17} opacity={0.75} />
      <StarLayer count={180} radius={15} seed={91} opacity={0.45} />
      <NebulaCloud position={[-8, 3, -14]} scale={[9, 3.5, 1]} color="#25204d" opacity={0.045} />
      <NebulaCloud position={[8, -4, -18]} scale={[8, 2.8, 1]} color="#3a2544" opacity={0.035} />
      <NebulaCloud position={[0, 7, -22]} scale={[12, 2, 1]} color="#182c50" opacity={0.025} />
    </group>
  );
}
