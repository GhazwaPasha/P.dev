import { useEffect, useRef, useState } from 'react';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getGLTFLoader } from './loaders';

export type AvatarLoadStatus = 'loading' | 'loaded' | 'fallback';

const MODEL_URL = '/models/avatar.glb';
const WATCHDOG_MS = 45000;

/**
 * Ports the prototype's load state machine: loading -> loaded, or loading ->
 * fallback on error / a 45s watchdog timeout. The watchdog is cancelled on the
 * first download-progress event so a slow-but-working download isn't mistaken
 * for a stall.
 */
export function useAvatarLoader() {
  const [status, setStatus] = useState<AvatarLoadStatus>('loading');
  const gltfRef = useRef<GLTF | null>(null);

  useEffect(() => {
    let cancelled = false;
    let watchdogId: number | undefined = window.setTimeout(() => {
      if (!cancelled) setStatus('fallback');
    }, WATCHDOG_MS);

    const loader = getGLTFLoader();
    console.log('Avatar hero: starting avatar.glb load');

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        console.log('Avatar hero: avatar.glb loaded');
        gltfRef.current = gltf;
        setStatus('loaded');
      },
      (xhr) => {
        console.log('Avatar hero: loading progress', xhr.loaded, '/', xhr.total);
        if (watchdogId !== undefined) {
          window.clearTimeout(watchdogId);
          watchdogId = undefined;
        }
      },
      (err) => {
        console.error('Avatar hero: failed to load avatar.glb', err);
        if (!cancelled) setStatus('fallback');
      }
    );

    return () => {
      cancelled = true;
      if (watchdogId !== undefined) window.clearTimeout(watchdogId);
    };
  }, []);

  return { status, gltf: gltfRef.current };
}
