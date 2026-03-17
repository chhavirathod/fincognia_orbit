import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const AvatarModel = ({ isSpeaking }: { isSpeaking: boolean }) => {
  const { scene } = useGLTF(
    "https://api.readyplayer.me/v1/avatars/6906484448062250a4acb11e.glb?morphTargets=ARKit"
  );

  const meshRef = useRef<THREE.Group>(null);
  const faceMeshRef = useRef<THREE.Mesh | null>(null);
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.includes("Head")) {
        faceMeshRef.current = child;
      }
    });
  }, [scene]);

  // Idle breathing animation
  const idleAnimation = () => {
    // Subtle breathing when idle
    if (meshRef.current && !isSpeaking) {
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.02;
    }

    // Fallback: Animate jaw rotation instead of morph targets
    if (isSpeaking && meshRef.current) {
      const head = meshRef.current.getObjectByName("Head") as THREE.Object3D;
      if (head) {
        head.rotation.x = Math.sin(Date.now() * 0.02) * 0.1; // mouth bob effect
      }
    } else if (meshRef.current) {
      const head = meshRef.current.getObjectByName("Head") as THREE.Object3D;
      if (head) head.rotation.x = 0; // reset
    }
  };

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={2.0}
      position={[0, -2.3, 0]} // lower the model a bit
      onBeforeRender={idleAnimation}
    />
  );
};

interface AvatarViewerProps {
  isSpeaking: boolean;
}

const AvatarViewer = ({ isSpeaking }: AvatarViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full relative"
    >
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${
          isSpeaking ? "opacity-60" : "opacity-20"
        } bg-accent/40 -z-10`}
      />

      <Canvas camera={{ position: [0, 1.9, 3.2], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 1.5, 2]} intensity={0.8} />
        <ambientLight intensity={0.6} />

        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>
    </motion.div>
  );
};

export default AvatarViewer;
