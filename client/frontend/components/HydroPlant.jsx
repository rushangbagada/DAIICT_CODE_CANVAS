// HydroPlant.jsx
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRef } from "react";

function Turbine() {
  const turbineRef = useRef();

  // Rotate turbine
  useFrame(() => {
    if (turbineRef.current) {
      turbineRef.current.rotation.z -= 0.05;
    }
  });

  return (
    <group ref={turbineRef} position={[0, -1.5, 2]}>
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (angle * Math.PI) / 180]}
          position={[0.7, 0, 0]}
        >
          <boxGeometry args={[1.2, 0.2, 0.1]} />
          <meshStandardMaterial color="darkgray" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

export default function HydroPlant() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Dam wall */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 6, 1]} />
        <meshStandardMaterial color="#888" roughness={0.8} />
      </mesh>

      {/* Water behind dam */}
      <mesh position={[0, -1, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color="#1E90FF"
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Flowing water in front */}
      <mesh position={[0, -2.5, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 5, 32, 32]} />
        <meshStandardMaterial
          color="#00BFFF"
          transparent
          opacity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Turbine */}
      <Turbine />

      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />
    </>
  );
}

