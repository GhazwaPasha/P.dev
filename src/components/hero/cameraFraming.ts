import * as THREE from 'three';

export interface CameraFramingResult {
  targetY: number;
  dist: number;
  near: number;
  far: number;
  headHeight: number;
}

/**
 * Ported from the design prototype (Home.dc.html): frames the camera to crop
 * from the hairline (~top 2% of the model bbox) to just above the belly
 * (~62% down the bbox). Distance is derived from height only (never averaged
 * with a width-based distance) so the vertical crop stays fixed regardless of
 * viewport aspect.
 *
 * FRAME_MARGIN backs the camera off past the exact geometric fit so the idle
 * animation in AvatarModel's useFrame — a vertical bob of size.y * 0.008, a
 * breathe scale of ±1.2% on x/z, and a small rotational sway — never carries
 * the model past the frustum edges (which previously clipped the head/arms on
 * every pulse). Re-tune this if those animation amplitudes change.
 */
const FRAME_MARGIN = 1.08;

export function computeCameraFraming(size: THREE.Vector3, fovDeg: number): CameraFramingResult {
  const headHeight = size.y * 0.88;
  const regionTop = size.y * 0.98;
  const regionBottom = size.y * 0.62;
  const framedHeight = regionTop - regionBottom;
  const targetY = regionBottom + framedHeight * 0.5;

  const vFov = THREE.MathUtils.degToRad(fovDeg);
  const distForHeight = (framedHeight * 0.5) / Math.tan(vFov / 2);
  const dist = distForHeight * FRAME_MARGIN;

  return {
    targetY,
    dist,
    near: Math.max(dist / 100, 0.0001),
    far: dist * 100,
    headHeight,
  };
}
