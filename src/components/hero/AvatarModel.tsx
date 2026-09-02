import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { computeCameraFraming } from './cameraFraming';

export interface PointerPosition {
  x: number;
  y: number;
}

interface AvatarModelProps {
  gltf: GLTF;
  pointerRef: MutableRefObject<PointerPosition | null>;
}

interface BlinkTarget {
  mesh: THREE.Mesh;
  index: number;
}

export default function AvatarModel({ gltf, pointerRef }: AvatarModelProps) {
  const { camera, gl } = useThree();
  const model = gltf.scene;

  // Gates adding the model to the scene until the one-time setup below has
  // positioned the camera and posed the skeleton — otherwise r3f's render
  // loop (driven by its own rAF, not React's paint cycle) can draw one or
  // more frames of the model still in its default T-pose/camera before the
  // layout effect finishes, which briefly shows a wrongly-framed shot.
  const [ready, setReady] = useState(false);
  const hasSetupRef = useRef(false);

  const headNodeRef = useRef<THREE.Object3D | null>(null);
  const eyeNodesRef = useRef<THREE.Object3D[]>([]);
  const headBaseQuatRef = useRef<THREE.Quaternion | null>(null);
  const eyeBaseQuatsRef = useRef<THREE.Quaternion[]>([]);
  const blinkTargetsRef = useRef<BlinkTarget[]>([]);
  const baseYRef = useRef(0);
  const sizeRef = useRef(new THREE.Vector3(1, 1, 1));
  const headHeightRef = useRef(0);
  const headYawRef = useRef(0);
  const headPitchRef = useRef(0);
  const nextBlinkRef = useRef(2 + Math.random() * 3);
  const blinkTRef = useRef(0);
  const smileLeftTargetsRef = useRef<BlinkTarget[]>([]);
  const smileRightTargetsRef = useRef<BlinkTarget[]>([]);
  const smileMaxDistRef = useRef(1);
  const smileFactorRef = useRef(0);
  const smileSideRef = useRef(0);
  const frownLeftTargetsRef = useRef<BlinkTarget[]>([]);
  const frownRightTargetsRef = useRef<BlinkTarget[]>([]);
  const frownFactorRef = useRef(0);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.3));
  const raycasterRef = useRef(new THREE.Raycaster());
  const ndcRef = useRef(new THREE.Vector2());
  const targetPointRef = useRef(new THREE.Vector3());
  const hitPointRef = useRef(new THREE.Vector3());

  // One-time setup, before the render loop starts: lens materials, arm repose,
  // centering, camera framing, and gathering head/eye/blink references.
  useLayoutEffect(() => {
    // React 18 StrictMode double-invokes effects in dev with no unmount in
    // between when there's no cleanup — guard so bone rotations/centering
    // (both additive) only ever apply once per loaded model.
    if (hasSetupRef.current) return;
    hasSetupRef.current = true;

    model.traverse((node) => {
      node.frustumCulled = false;
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.Material & { opacity: number; depthWrite: boolean };
          mat.side = THREE.DoubleSide;
          if (/lens|glass/i.test(mat.name || '') && !/frame/i.test(mat.name || '')) {
            mat.transparent = true;
            mat.opacity = 0.25;
            mat.depthWrite = false;
          }
        });
      }
    });

    model.traverse((node) => {
      if (!(node as THREE.Bone).isBone) return;
      const n = node.name;
      const isLeft = /left/i.test(n);
      const isRight = /right/i.test(n);
      if (/^(left|right)arm$/i.test(n)) {
        node.rotation.z += isLeft ? -0.12 : isRight ? 0.12 : 0;
        node.rotation.x += 0.3;
      } else if (/forearm/i.test(n)) {
        node.rotation.x += 0.85;
      }
    });
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    model.updateMatrixWorld(true);

    sizeRef.current = size;
    baseYRef.current = model.position.y;
    planeRef.current.constant = -Math.max(size.z, 0.3);

    const headHolder: { exact: THREE.Object3D | null; loose: THREE.Object3D | null } = {
      exact: null,
      loose: null,
    };
    const eyeNodes: THREE.Object3D[] = [];
    const blinkTargets: BlinkTarget[] = [];
    const smileLeftTargets: BlinkTarget[] = [];
    const smileRightTargets: BlinkTarget[] = [];
    const frownLeftTargets: BlinkTarget[] = [];
    const frownRightTargets: BlinkTarget[] = [];
    model.traverse((node) => {
      if (!headHolder.exact && /^head$/i.test(node.name)) headHolder.exact = node;
      if (!headHolder.loose && /head/i.test(node.name)) headHolder.loose = node;
      if (/eye/i.test(node.name) && !/brow|lash/i.test(node.name)) {
        eyeNodes.push(node);
      }
      const mesh = node as THREE.Mesh;
      const dict = mesh.morphTargetDictionary;
      if (dict) {
        Object.keys(dict).forEach((key) => {
          if (/blink|eyeclose|eyesclosed/i.test(key)) {
            blinkTargets.push({ mesh, index: dict[key] });
          } else if (/mouthsmileleft/i.test(key)) {
            smileLeftTargets.push({ mesh, index: dict[key] });
          } else if (/mouthsmileright/i.test(key)) {
            smileRightTargets.push({ mesh, index: dict[key] });
          } else if (/mouthfrownleft/i.test(key)) {
            frownLeftTargets.push({ mesh, index: dict[key] });
          } else if (/mouthfrownright/i.test(key)) {
            frownRightTargets.push({ mesh, index: dict[key] });
          }
        });
      }
    });
    const resolvedHead = headHolder.exact ?? headHolder.loose;

    headNodeRef.current = resolvedHead;
    eyeNodesRef.current = eyeNodes;
    headBaseQuatRef.current = resolvedHead ? resolvedHead.quaternion.clone() : null;
    eyeBaseQuatsRef.current = eyeNodes.map((n) => n.quaternion.clone());
    blinkTargetsRef.current = blinkTargets;
    smileLeftTargetsRef.current = smileLeftTargets;
    smileRightTargetsRef.current = smileRightTargets;
    frownLeftTargetsRef.current = frownLeftTargets;
    frownRightTargetsRef.current = frownRightTargets;

    const persp = camera as THREE.PerspectiveCamera;
    const framing = computeCameraFraming(size, persp.fov);
    camera.position.set(0, framing.targetY, framing.dist);
    persp.near = framing.near;
    persp.far = framing.far;
    persp.updateProjectionMatrix();
    camera.lookAt(0, framing.targetY, 0);
    headHeightRef.current = framing.headHeight;
    targetPointRef.current.set(0, framing.headHeight, 1);
    // "Close" for the smile reaction means the cursor's raycast hit is near
    // the head on the tracking plane; this scales that radius to the model's
    // own proportions instead of a fixed world-unit constant.
    smileMaxDistRef.current = framing.headHeight * 0.2;

    setReady(true);
  }, [model, camera]);

  useFrame((state, delta) => {
    if (!hasSetupRef.current) return;
    const t = state.clock.getElapsedTime();
    const size = sizeRef.current;

    // Idle loop: breathing pulse, gentle sway, vertical bob — always running.
    model.position.y = baseYRef.current + Math.sin(t * 1.4) * size.y * 0.002;
    model.rotation.z = Math.sin(t * 0.55) * 0.02;
    const breathe = 1 + Math.sin(t * 1.4) * 0.003;
    model.scale.set(breathe, 1, breathe);

    // Blink: independent timer, randomized jitter, triangular envelope.
    const blinkTargets = blinkTargetsRef.current;
    if (blinkTargets.length) {
      nextBlinkRef.current -= delta;
      if (nextBlinkRef.current <= 0) {
        blinkTRef.current += delta;
        const cycle = 0.22;
        const p = blinkTRef.current / cycle;
        const influence = p < 1 ? Math.sin(Math.min(p, 1) * Math.PI) : 0;
        blinkTargets.forEach((b) => {
          if (b.mesh.morphTargetInfluences) b.mesh.morphTargetInfluences[b.index] = influence;
        });
        if (p >= 1) {
          blinkTRef.current = 0;
          nextBlinkRef.current = 2.5 + Math.random() * 3.5;
        }
      }
    }

    // Head tracking: raycast pointer against a plane in front of the model,
    // clamp/lerp yaw+pitch toward it. Idle (no pointer yet) leaves the head
    // slowly settle back toward whatever the last target was.
    const pointer = pointerRef.current;
    if (pointer) {
      const rect = gl.domElement.getBoundingClientRect();
      ndcRef.current.x = ((pointer.x - rect.left) / rect.width) * 2 - 1;
      ndcRef.current.y = -((pointer.y - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(ndcRef.current, camera);
      if (raycasterRef.current.ray.intersectPlane(planeRef.current, hitPointRef.current)) {
        targetPointRef.current.copy(hitPointRef.current);
      }
    }

    const desiredYaw = THREE.MathUtils.clamp(Math.atan2(targetPointRef.current.x, 2.2), -0.85, 0.85);
    const desiredPitch = THREE.MathUtils.clamp(
      -Math.atan2(targetPointRef.current.y - headHeightRef.current, 2.2) * 0.75,
      -0.5,
      0.5
    );
    headYawRef.current = THREE.MathUtils.lerp(headYawRef.current, desiredYaw, 0.1);
    headPitchRef.current = THREE.MathUtils.lerp(headPitchRef.current, desiredPitch, 0.1);

    // Mood reaction: smile ramps up as the cursor's tracking-plane hit nears
    // the head and fades out as it moves away; past a further "abandoned"
    // radius a frown ramps in instead. A dead zone between the two ranges
    // (smileMaxDist..frownStartDist) keeps the face neutral in between
    // rather than flickering from one expression straight to the other. No
    // pointer yet at all reads the same as "far" for the smile but is kept
    // neutral (not sad) for the frown, so the face doesn't load in frowning.
    let desiredSmile = 0;
    let desiredSmileSide = 0;
    let desiredFrown = 0;
    if (pointer) {
      const dx = targetPointRef.current.x;
      const dy = targetPointRef.current.y - headHeightRef.current;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const closeDist = smileMaxDistRef.current;
      desiredSmile = THREE.MathUtils.clamp(1 - dist / closeDist, 0, 1);
      desiredSmileSide = THREE.MathUtils.clamp(dx / closeDist, -1, 1);

      const frownStartDist = closeDist * 2.2;
      const frownFullDist = closeDist * 4.5;
      desiredFrown = THREE.MathUtils.clamp(
        (dist - frownStartDist) / (frownFullDist - frownStartDist),
        0,
        1
      );
    }
    smileFactorRef.current = THREE.MathUtils.lerp(smileFactorRef.current, desiredSmile, 0.12);
    smileSideRef.current = THREE.MathUtils.lerp(smileSideRef.current, desiredSmileSide, 0.12);
    frownFactorRef.current = THREE.MathUtils.lerp(frownFactorRef.current, desiredFrown, 0.12);

    const smileRightAmt =
      smileFactorRef.current * THREE.MathUtils.clamp(0.5 + smileSideRef.current * 0.5, 0, 1);
    const smileLeftAmt =
      smileFactorRef.current * THREE.MathUtils.clamp(0.5 - smileSideRef.current * 0.5, 0, 1);
    smileLeftTargetsRef.current.forEach((t) => {
      if (t.mesh.morphTargetInfluences) t.mesh.morphTargetInfluences[t.index] = smileLeftAmt;
    });
    smileRightTargetsRef.current.forEach((t) => {
      if (t.mesh.morphTargetInfluences) t.mesh.morphTargetInfluences[t.index] = smileRightAmt;
    });
    frownLeftTargetsRef.current.forEach((t) => {
      if (t.mesh.morphTargetInfluences) t.mesh.morphTargetInfluences[t.index] = frownFactorRef.current;
    });
    frownRightTargetsRef.current.forEach((t) => {
      if (t.mesh.morphTargetInfluences) t.mesh.morphTargetInfluences[t.index] = frownFactorRef.current;
    });

    const headNode = headNodeRef.current;
    if (headNode && headBaseQuatRef.current) {
      const lookQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(headPitchRef.current, headYawRef.current, 0)
      );
      headNode.quaternion.copy(headBaseQuatRef.current).multiply(lookQuat);
    } else {
      model.rotation.y = headYawRef.current * 0.6;
    }

    const eyeNodes = eyeNodesRef.current;
    if (eyeNodes.length) {
      const jitterX = Math.sin(t * 0.9) * 0.01 + Math.sin(t * 2.3) * 0.004;
      const jitterY = Math.cos(t * 0.7) * 0.01;
      // Clamped separately from the head's own range: the head now swings
      // much further to track the cursor, but eyeballs still shouldn't rotate
      // past a plausible socket limit once the head is already turned far.
      const eyeYaw = THREE.MathUtils.clamp(headYawRef.current * 1.6 + jitterY, -0.5, 0.5);
      const eyePitch = THREE.MathUtils.clamp(headPitchRef.current * 1.6 + jitterX, -0.4, 0.4);
      const eyeQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(eyePitch, eyeYaw, 0));
      eyeNodes.forEach((n, i) => {
        const base = eyeBaseQuatsRef.current[i];
        if (base) n.quaternion.copy(base).multiply(eyeQuat);
      });
    }
  });

  return ready ? <primitive object={model} /> : null;
}
