import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { withBase } from '../../lib/assetPath';

let cachedLoader: GLTFLoader | null = null;

/**
 * A GLTFLoader with DRACOLoader + MeshoptDecoder registered, matching the design
 * prototype's setup. The current avatar.glb is not actually Draco/Meshopt
 * compressed (verified by inspecting the file), so this is defensive wiring for
 * a future re-export rather than something load-bearing today.
 */
export function getGLTFLoader(): GLTFLoader {
  if (cachedLoader) return cachedLoader;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(withBase('/draco/'));
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  cachedLoader = loader;
  return loader;
}
