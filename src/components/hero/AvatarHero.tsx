import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import AvatarModel, { type PointerPosition } from './AvatarModel';
import { useAvatarLoader } from './useAvatarLoader';
import styles from './AvatarHero.module.css';

/**
 * Both the canvas frame and the fallback frame are positioned directly against
 * the viewport (explicit top/bottom offsets against the 100vh <section>
 * ancestor from Home.tsx), not through a percentage-height wrapper — so
 * swapping between them on load-state change doesn't hit the "collapses to
 * min-height" bug the design spec warns about.
 */
export default function AvatarHero() {
  const { status, gltf } = useAvatarLoader();
  const pointerRef = useRef<PointerPosition | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (status === 'fallback') {
    return (
      <div className={styles.fallbackFrame}>
        <img src="/fallback/hero-fallback.png" alt="Pivak E Safa" className={styles.fallbackImage} />
      </div>
    );
  }

  if (status !== 'loaded' || !gltf) {
    return <div className={styles.heroFrame} />;
  }

  return (
    // data-dynamic: when this sits inside a LiquidGlassRoot, the shader
    // needs to re-sample this canvas every frame (it's animating on its
    // own via AvatarModel's useFrame loop) instead of a one-time snapshot.
    // Harmless outside that context — an unrecognized data attribute.
    <div className={styles.heroFrame} data-dynamic>
      <Canvas
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ fov: 35 }}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} />
        <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#8fb8ff" />
        <AvatarModel gltf={gltf} pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
