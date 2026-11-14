import { memo, useMemo } from 'react';
import { AdditiveBlending, Color, DoubleSide } from 'three';

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
  uniform float opacity;
  varying vec3 vColor;
  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float softness = smoothstep(0.5, 0.05, distanceToCenter);
    gl_FragColor = vec4(vColor, softness * opacity);
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
    sizes[index] = 0.18 + random() * 0.3;
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
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 cloudColor;
          uniform float cloudOpacity;
          varying vec2 vUv;
          void main() {
            vec2 centered = vUv - 0.5;
            float edge = 1.0 - smoothstep(0.12, 0.5, length(centered));
            float streak = 0.72 + 0.28 * sin(vUv.x * 18.0 + vUv.y * 7.0);
            gl_FragColor = vec4(cloudColor, edge * streak * cloudOpacity);
          }
        `}
        uniforms={{
          cloudColor: { value: new Color(color) },
          cloudOpacity: { value: opacity },
        }}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

function DeepSpaceBackground() {
  return (
    <group>
      <StarLayer count={760} radius={30} seed={17} opacity={0.95} />
      <StarLayer count={300} radius={22} seed={91} opacity={0.78} />
      <StarLayer count={90} radius={12} seed={173} opacity={1} />
      <NebulaCloud position={[-6, 2, -16]} scale={[14, 5, 1]} color="#25204d" opacity={0.3} />
      <NebulaCloud position={[7, -3, -20]} scale={[12, 4, 1]} color="#3a2544" opacity={0.24} />
      <NebulaCloud position={[0, 6, -24]} scale={[18, 3.5, 1]} color="#182c50" opacity={0.2} />
    </group>
  );
}

export default memo(DeepSpaceBackground);
