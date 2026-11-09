/**
 * Interactive Truck Experience: orbit, zoom, color, lights, camera views
 * and component hotspots. Wheel-zoom is disabled so the page scroll is never
 * hijacked; zoom is available through buttons (and pinch on touch devices).
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createStage, autoPause, contactShadow, cssColor, type Quality } from '../stage';
import { createTruck, readTruckConfig } from '../truckFactory';
import { Labels } from '../overlay';

export interface Hotspot { key: string; title: string; text?: string }

export const VIEWS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  three: { pos: [16, 6.5, 19], target: [-4.5, 1.8, 0] },
  side: { pos: [-5, 3, 30], target: [-5, 1.9, 0] },
  front: { pos: [19, 3, 0.01], target: [0, 2.1, 0] },
  rear: { pos: [-28, 4.5, 9], target: [-6, 1.9, 0] },
  top: { pos: [-4.9, 48, 0.01], target: [-5, 0, 0] },
};

const FOCUS: Record<string, { pos: [number, number, number] }> = {
  cab: { pos: [11, 4.2, 7.5] },
  lights: { pos: [8.5, 1.8, 4.5] },
  mirrors: { pos: [7, 3.6, 6.5] },
  wheels: { pos: [1.5, 1.4, 7.5] },
  tank: { pos: [3, 1.4, 6] },
  skirts: { pos: [-3, 1.6, 9] },
  trailer: { pos: [-3, 4.5, 16] },
  rear: { pos: [-17, 2.6, 4.5] },
  fifth: { pos: [1.5, 5.5, 5] },
};

export async function mountConfigurator(el: HTMLElement, quality: Quality, hotspots: Hotspot[], onSelect: (key: string | null) => void) {
  const stage = createStage(el, { quality, fov: 28, exposure: 1.05 });
  const { scene, camera, canvas } = stage;
  const ink = cssColor('--fg', el);
  const accent = cssColor('--c-accent');

  scene.add(new THREE.HemisphereLight('#ffffff', '#8a8f96', 0.7));
  const key = new THREE.DirectionalLight('#ffffff', 2.2);
  key.position.set(10, 16, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12 });
  key.shadow.radius = 5;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#ffffff', 1.4);
  rim.position.set(-14, 8, -10);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  // turntable rings
  const ringMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.16 });
  for (const r of [10, 11.5, 15]) {
    const pts = new THREE.EllipseCurve(0, 0, r, r).getPoints(160).map((p) => new THREE.Vector3(p.x, 0.003, p.y));
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
    ring.position.x = -5;
    scene.add(ring);
  }
  const tickMat = new THREE.LineBasicMaterial({ color: accent });
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const l = i % 6 === 0 ? 0.9 : 0.35;
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5 + Math.cos(a) * 11.5, 0.004, Math.sin(a) * 11.5),
      new THREE.Vector3(-5 + Math.cos(a) * (11.5 + l), 0.004, Math.sin(a) * (11.5 + l)),
    ]);
    scene.add(new THREE.Line(g, i % 6 === 0 ? tickMat : ringMat));
  }

  const truck = await createTruck(readTruckConfig(el), quality === 'full' ? 'full' : 'low');
  scene.add(truck.group);
  const cs = contactShadow(truck.length + 3, 4.6, 0.55);
  cs.position.x = 3.4 - truck.length / 2;
  scene.add(cs);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 9;
  controls.maxDistance = 42;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.rotateSpeed = 0.6;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) {
    controls.enableRotate = false; // keep page scroll on touch; rotate via buttons
    canvas.style.touchAction = 'pan-y';
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.35;
  camera.position.set(...VIEWS.three.pos);
  controls.target.set(...VIEWS.three.target);
  controls.update();
  let idle: number | undefined;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(idle);
  });
  controls.addEventListener('end', () => {
    idle = window.setTimeout(() => (controls.autoRotate = !reduce), 6000);
  });

  // hotspots
  const overlay = document.createElement('div');
  overlay.className = 'stage-labels';
  el.appendChild(overlay);
  const labels = new Labels(camera, overlay);
  const buttons = new Map<string, HTMLButtonElement>();
  hotspots.forEach((h, i) => {
    const anchor = truck.anchors[h.key];
    if (!anchor) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hotspot';
    b.innerHTML = `<span class="hotspot__dot" aria-hidden="true"></span><span class="hotspot__n">${String(i + 1).padStart(2, '0')}</span><span class="hotspot__t">${h.title}</span>`;
    b.setAttribute('aria-label', `Destacar ${h.title}`);
    b.addEventListener('click', () => api.focus(h.key));
    labels.add(b, anchor.clone(), truck.group);
    buttons.set(h.key, b);
  });

  let tween: { kill: () => void } | null = null;
  const moveTo = async (pos: THREE.Vector3, target: THREE.Vector3) => {
    const { gsap } = await import('gsap');
    tween?.kill();
    controls.autoRotate = false;
    const from = { px: camera.position.x, py: camera.position.y, pz: camera.position.z, tx: controls.target.x, ty: controls.target.y, tz: controls.target.z };
    tween = gsap.to(from, {
      px: pos.x, py: pos.y, pz: pos.z, tx: target.x, ty: target.y, tz: target.z,
      duration: reduce ? 0.01 : 1.6,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.position.set(from.px, from.py, from.pz);
        controls.target.set(from.tx, from.ty, from.tz);
      },
    });
  };

  stage.onFrame(() => {
    controls.update();
    labels.update(stage.size.w, stage.size.h);
  });
  autoPause(stage, el);
  el.classList.add('is-ready');

  const api = {
    view: (name: keyof typeof VIEWS) => {
      const v = VIEWS[name];
      buttons.forEach((b) => b.classList.remove('is-active'));
      onSelect(null);
      moveTo(new THREE.Vector3(...v.pos), new THREE.Vector3(...v.target));
    },
    focus: (key: string) => {
      const a = truck.anchors[key];
      const f = FOCUS[key];
      if (!a || !f) return;
      buttons.forEach((b, k) => b.classList.toggle('is-active', k === key));
      onSelect(key);
      moveTo(new THREE.Vector3(...f.pos), a.clone());
    },
    color: async (hex: string, part: 'cab' | 'body' = 'cab') => (part === 'cab' ? truck.setCabColor(hex) : truck.setBodyColor(hex)),
    lights: (on: boolean) => truck.setLights(on),
    zoom: (factor: number) => {
      const dir = camera.position.clone().sub(controls.target);
      const len = THREE.MathUtils.clamp(dir.length() * factor, controls.minDistance, controls.maxDistance);
      moveTo(controls.target.clone().add(dir.setLength(len)), controls.target.clone());
    },
    rotate: (angle: number) => {
      const dir = camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      moveTo(controls.target.clone().add(dir), controls.target.clone());
    },
    stage,
  };
  (el as HTMLElement & { __scene?: unknown }).__scene = api;
  return api;
}
