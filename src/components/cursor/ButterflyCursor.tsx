import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ButterflyModel from './ButterflyModel';
import styles from './ButterflyCursor.module.css';

/** Animated 3D butterfly cursor that follows the pointer 1:1, wings flapping via its GLB clip. */
export default function ButterflyCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      // The cursor overlay itself is pointer-events:none, so e.target already
      // reports whatever real element sits underneath it (the nav icons).
      // Hide the butterfly there so it doesn't sit on top of the navbar.
      const overNav = !!(e.target as HTMLElement | null)?.closest('nav');
      ref.current.style.opacity = overNav ? '0' : '1';
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div ref={ref} className={styles.cursor}>
      <div className={styles.canvasFrame}>
        <Canvas
          orthographic
          camera={{ zoom: 20, position: [0, 0, 5] }}
          gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <directionalLight position={[-3, -2, -4]} intensity={0.5} color="#a9c8ff" />
          <Suspense fallback={null}>
            <ButterflyModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
