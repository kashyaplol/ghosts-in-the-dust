export default function PlanetAtmosphere({ color }) {
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        side={2}
        depthWrite={false}
        blending={2}
      />
    </mesh>
  );
}

