import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRef } from "react";

export default function Windmill() {
  const bladesRef = useRef();

  // Animate blades
  useFrame(() => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z -= 0.03; // slower, more natural speed
    }
  });

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        position={[20, 30, 10]}
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Sky */}
      <Sky sunPosition={[100, 40, 100]} />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#3d9140" roughness={0.8} />
      </mesh>

      {/* Tower */}
      <mesh position={[0, -2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.8, 8, 64]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Hub */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Rotating blades */}
      <group ref={bladesRef} position={[0, 2, 0]}>
        {[0, 120, 240].map((angle, i) => (
          <group key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <mesh position={[2.5, 0, 0]} castShadow>
              {/* More realistic tapered blades */}
              <boxGeometry args={[5, 0.1, 0.2]} />
              <meshStandardMaterial
                color="#e0e0e0"
                metalness={0.1}
                roughness={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
