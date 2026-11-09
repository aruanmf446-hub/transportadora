/**
 * Shared WebGL stage: renderer, environment lighting, resize, visibility
 * pausing and full disposal. Every 3D experience is built on top of this.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Quality = 'low' | 'full';

export function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Decide whether/how to render 3D for this device. */
export function decideQuality(mobilePref: 'off' | 'low' | 'full' = 'low'): Quality | null {
  if (!detectWebGL()) return null;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return null;
  const small = window.matchMedia('(max-width: 820px)').matches;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  if (small) {
    if (mobilePref === 'off') return null;
    return mobilePref === 'full' ? 'full' : 'low';
  }
  return weak ? 'low' : 'full';
}

export function cssVar(name: string, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}
export function cssColor(name: string, el?: Element): THREE.Color {
  const v = cssVar(name, el);
  return new THREE.Color(v || '#888888');
}

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  quality: Quality;
  onFrame: (cb: (dt: number, t: number) => void) => void;
  start: () => void;
  stop: () => void;
  renderOnce: () => void;
  dispose: () => void;
  size: { w: number; h: number };
  envMap: THREE.Texture;
}

interface StageOptions {
  quality: Quality;
  fov?: number;
  shadows?: boolean;
  alpha?: boolean;
  exposure?: number;
  envIntensity?: number;
}

export function createStage(container: HTMLElement, opts: StageOptions): Stage {
  const { quality, fov = 30, shadows = true, alpha = true, exposure = 1 } = opts;
  const renderer = new THREE.WebGLRenderer({
    antialias: quality === 'full',
    alpha,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: new URLSearchParams(location.search).has('capture'),
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'full' ? 2 : 1.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = shadows && quality === 'full';
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'stage-canvas';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 600);
  const size = { w: 1, h: 1 };

  const resize = () => {
    const r = container.getBoundingClientRect();
    size.w = Math.max(1, r.width);
    size.h = Math.max(1, r.height);
    renderer.setSize(size.w, size.h, false);
    camera.aspect = size.w / size.h;
    camera.updateProjectionMatrix();
    if (!running) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const callbacks: ((dt: number, t: number) => void)[] = [];
  let last = 0;
  let elapsed = 0;
  let running = false;
  let raf = 0;
  let disposed = false;

  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    const t = elapsed;
    for (const cb of callbacks) cb(dt, t);
    renderer.render(scene, camera);
  };

  const stage: Stage = {
    renderer,
    scene,
    camera,
    canvas,
    quality,
    size,
    envMap,
    onFrame: (cb) => callbacks.push(cb),
    start: () => {
      if (running || disposed) return;
      running = true;
      last = performance.now();
      loop();
    },
    stop: () => {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderOnce: () => renderer.render(scene, camera),
    dispose: () => {
      if (disposed) return;
      disposed = true;
      stage.stop();
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => {
          Object.values(mat).forEach((v) => (v as THREE.Texture)?.isTexture && (v as THREE.Texture).dispose());
          mat.dispose();
        });
      });
      envMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
  resize();
  window.addEventListener('pagehide', (e) => {
    if (!(e as PageTransitionEvent).persisted) stage.dispose();
  });
  return stage;
}

/** Pause rendering while the element is off-screen or the tab is hidden. */
export function autoPause(stage: Stage, el: Element) {
  let visible = false;
  const apply = () => (visible && !document.hidden ? stage.start() : stage.stop());
  const io = new IntersectionObserver((en) => {
    visible = en.some((e) => e.isIntersecting);
    apply();
  }, { rootMargin: '80px' });
  io.observe(el);
  document.addEventListener('visibilitychange', apply);
}

/** Soft radial contact shadow (cheap ambient occlusion under objects). */
export function contactShadow(width: number, depth: number, opacity = 0.55): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, `rgba(0,0,0,${opacity})`);
  grd.addColorStop(0.55, `rgba(0,0,0,${opacity * 0.45})`);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.005;
  mesh.renderOrder = 1;
  return mesh;
}

export const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.damp(a, b, lambda, dt);
