import { useEffect, useLayoutEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/butterfly.glb';

/**
 * World-unit size the butterfly is normalized to fit within, so the cursor's
 * orthographic camera zoom can assume a fixed scale regardless of the source
 * model's own units.
 */
const TARGET_SIZE = 1.4;

/** Loads the animated butterfly GLB, centers/normalizes it, and plays its "Flying" clip on loop. */
export default function ButterflyModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const hasSetupRef = useRef(false);

  // One-time centering/scaling, guarded the same way AvatarModel guards its
  // setup: React 18 StrictMode double-invokes effects in dev with no unmount
  // in between when there's no cleanup, and this math is additive.
  useLayoutEffect(() => {
    if (hasSetupRef.current || !group.current) return;
    hasSetupRef.current = true;

    scene.traverse((node) => {
      node.frustumCulled = false;
    });

    // Source rest pose lies the butterfly flat (head toward +Z, wings
    // spanning X) — the cursor camera looks in from the front along -Z,
    // which without this shows the body edge-on as a thin sliver. Tip it
    // so the camera looks down on the dorsal (top) side of the spread
    // wings, head up, like a butterfly seen from above mid-flight — the
    // other tip direction shows the ventral (under) side instead.
    scene.rotation.x = -Math.PI / 2;
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const largest = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / largest;

    group.current.scale.setScalar(scale);
    group.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  useEffect(() => {
    const flying = actions['Flying'];
    flying?.reset().play();
    return () => {
      flying?.fadeOut(0.1);
    };
  }, [actions]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
