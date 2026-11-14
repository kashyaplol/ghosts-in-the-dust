import { BackSide, AdditiveBlending } from 'three';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 atmosphereColor;
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 3.2);
    float limb = smoothstep(0.18, 0.72, fresnel);
    gl_FragColor = vec4(atmosphereColor, limb * 0.14);
  }
`;

export default function PlanetAtmosphere({ body }) {
  if (body === 'Moon') return null;
  return (
    <mesh scale={1.025} renderOrder={1} raycast={() => null}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ atmosphereColor: { value: [0.72, 0.25, 0.08] } }}
        transparent
        depthTest
        depthWrite={false}
        side={BackSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
