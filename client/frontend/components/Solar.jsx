import { useLoader } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

export default function SolarPlant() {
  // Load desert ground texture
  const groundTexture = useLoader(
    THREE.TextureLoader,
    "https://threejsfundamentals.org/threejs/resources/images/wall.jpg" // sandy/dry texture
  );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(30, 30);

  // Material for panels
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: "#3859AC",       // deep solar panel blue
    metalness: 0.8,         // reflective like glass
    roughness: 0.2,         // smooth surface
    emissive: "#3859AC",    // slight glow
    emissiveIntensity: 0.2,
  });

  return (
    <group>
      {/* Sky */}
      <Sky sunPosition={[100, 40, 100]} />

      {/* Sun light */}
      <directionalLight
        position={[50, 40, 0]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.3} />

      {/* Ground (desert) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial
          map={groundTexture}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Solar panels (fixed tilt, no rotation) */}
      {[...Array(4)].map((_, row) =>
        [...Array(6)].map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[col * 4 - 10, 0, row * 4 - 6]}
            rotation={[-Math.PI / 6, 0, 0]} // Tilted ~30° realistically
            castShadow
          >
            <boxGeometry args={[3.5, 0.2, 2]} />
            <primitive object={panelMaterial.clone()} />
          </mesh>
        ))
      )}

      {/* Panel stands */}
      {[...Array(4)].map((_, row) =>
        [...Array(6)].map((_, col) => (
          <mesh
            key={`stand-${row}-${col}`}
            position={[col * 4 - 10, -1, row * 4 - 6]}
            castShadow
          >
            <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
            <meshStandardMaterial color="#0a2f6b" />
          </mesh>
        ))
      )}
    </group>
  );
}
