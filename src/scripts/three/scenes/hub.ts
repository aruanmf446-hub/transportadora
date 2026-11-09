/**
 * Logistics Hub — architectural model of a distribution center: warehouse,
 * docks with parked trucks, container yard, pallets and ambient movement.
 * Fully procedural and illustrative.
 */
import * as THREE from 'three';
import { createStage, autoPause, cssColor, type Quality } from '../stage';
import { buildTruck } from '../truck';
import { Labels } from '../overlay';

export const AREAS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [125, 105, 165], target: [6, 0, 6] },
  docks: { pos: [42, 24, 84], target: [-6, 3, 22] },
  warehouse: { pos: [-100, 56, 66], target: [-4, 6, -2] },
  yard: { pos: [110, 44, 46], target: [50, 2, 4] },
  shipping: { pos: [-36, 30, 100], target: [-30, 1, 32] },
};

export async function mountHub(el: HTMLElement, quality: Quality, labelsData: { key: string; title: string }[]) {
  const stage = createStage(el, { quality, fov: 22, exposure: 1.05 });
  const { scene, camera } = stage;
  const ink = cssColor('--c-ink');
  const accent = cssColor('--c-accent');
  const bg = cssColor('--bg', el);
  const full = quality === 'full';
  scene.fog = new THREE.Fog(bg, 160, 320);

  scene.add(new THREE.HemisphereLight('#ffffff', '#9aa0a6', 0.85));
  const sun = new THREE.DirectionalLight('#ffffff', 2.2);
  sun.position.set(60, 90, 50);
  sun.castShadow = true;
  sun.shadow.mapSize.set(full ? 2048 : 1024, full ? 2048 : 1024);
  Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 70, bottom: -70, far: 260 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const mat = {
    ground: new THREE.MeshStandardMaterial({ color: bg.clone().lerp(new THREE.Color('#808489'), 0.08), roughness: 0.95 }),
    slab: new THREE.MeshStandardMaterial({ color: bg.clone().lerp(new THREE.Color('#5e6369'), 0.14), roughness: 0.9 }),
    wall: new THREE.MeshStandardMaterial({ color: '#eceae5', roughness: 0.7 }),
    roof: new THREE.MeshStandardMaterial({ color: '#d9dadc', roughness: 0.6, metalness: 0.2 }),
    fin: new THREE.MeshStandardMaterial({ color: '#c3c6ca', roughness: 0.5, metalness: 0.4 }),
    dark: new THREE.MeshStandardMaterial({ color: '#202327', roughness: 0.6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#1a2026', roughness: 0.05, metalness: 0.3, clearcoat: 1 }),
    accent: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.45 }),
    line: new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.35 }),
    lineAccent: new THREE.MeshBasicMaterial({ color: accent }),
    pallet: new THREE.MeshStandardMaterial({ color: '#b48a5a', roughness: 0.9 }),
    cargo: new THREE.MeshStandardMaterial({ color: '#d8cdb8', roughness: 0.85 }),
  };
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, cast = true) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  };

  // ground + slab + yard markings
  const ground = add(new THREE.PlaneGeometry(600, 600), mat.ground, 0, 0, 0, false);
  ground.rotation.x = -Math.PI / 2;
  const slab = add(new THREE.BoxGeometry(150, 0.2, 110), mat.slab, 4, 0.1, 6, false);
  slab.receiveShadow = true;
  const stripe = (w: number, d: number, x: number, z: number, m = mat.line) => {
    const s = add(new THREE.PlaneGeometry(w, d), m, x, 0.22, z, false);
    s.rotation.x = -Math.PI / 2;
  };
  for (let i = 0; i < 12; i++) stripe(0.25, 16, -34 + i * 6, 30); // dock parking bays
  stripe(84, 0.3, -1, 38.5, mat.lineAccent);
  for (let i = 0; i < 18; i++) stripe(2.4, 0.3, -40 + i * 5, 44); // lane dashes
  stripe(0.3, 50, 32, 12);

  // warehouse
  const W = 84, D = 44, H = 13;
  add(new THREE.BoxGeometry(W, H, D), mat.wall, -1, H / 2 + 0.2, 0);
  add(new THREE.BoxGeometry(W + 1, 0.6, D + 1), mat.roof, -1, H + 0.5, 0);
  // skylights
  for (let i = 0; i < 7; i++) add(new THREE.BoxGeometry(2.2, 0.3, D - 8), mat.glass, -34 + i * 11, H + 0.95, 0, false);
  // facade fins (instanced) on the long front
  const finGeo = new THREE.BoxGeometry(0.35, H, 0.9);
  const fins = new THREE.InstancedMesh(finGeo, mat.fin, 56);
  const d = new THREE.Object3D();
  for (let i = 0; i < 56; i++) {
    d.position.set(-1 - W / 2 + 0.75 + i * ((W - 1.5) / 55), H / 2 + 0.2, -D / 2 - 0.45);
    d.updateMatrix();
    fins.setMatrixAt(i, d.matrix);
  }
  fins.castShadow = true;
  scene.add(fins);
  add(new THREE.BoxGeometry(W + 0.2, 1.2, 0.3), mat.accent, -1, H - 0.8, D / 2 + 0.1);
  // office block
  add(new THREE.BoxGeometry(18, 8, 14), mat.wall, 50, 4.2, -16);
  add(new THREE.BoxGeometry(18.2, 3.4, 14.2), mat.glass, 50, 5.6, -16, false);

  // docks (front side, +Z)
  const docks = 12;
  const doorGeo = new THREE.BoxGeometry(3.2, 3.6, 0.3);
  const canopyGeo = new THREE.BoxGeometry(4.2, 0.25, 2.2);
  for (let i = 0; i < docks; i++) {
    const x = -34 + i * 6;
    add(doorGeo, mat.dark, x, 3.0, D / 2 + 0.05);
    add(canopyGeo, mat.fin, x, 5.4, D / 2 + 1.1);
    const num = add(new THREE.PlaneGeometry(1, 0.6), i % 4 === 0 ? mat.lineAccent : mat.line, x, 6.4, D / 2 + 0.16, false);
    num.rotation.y = 0;
  }
  add(new THREE.BoxGeometry(W - 6, 1.3, 3.2), mat.slab, -1, 0.85, D / 2 + 1.6);

  // trucks at docks (reverse-parked) — one built, others cloned
  const base = buildTruck({ cabColor: '#16181b', bodyColor: '#eeeeeb', accent: `#${accent.getHexString()}`, ink: `#${ink.getHexString()}`, liveryText: undefined, stripe: true, detail: 'low' });
  const parked = [0, 2, 3, 5, 8, 10];
  parked.forEach((i, k) => {
    const t = k === 0 ? base.group : base.group.clone();
    t.rotation.y = Math.PI / 2; // trailer rear (−X local) → +Z… rotate so rear faces the door
    t.rotation.y = -Math.PI / 2;
    t.position.set(-34 + i * 6, 0.2, D / 2 + 3.3 + 13.35);
    t.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    scene.add(t);
  });

  // moving truck along the yard lane
  const mover = base.group.clone();
  scene.add(mover);
  const path = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(-70, 0.2, 44), new THREE.Vector3(30, 0.2, 44), new THREE.Vector3(40, 0.2, 30), new THREE.Vector3(40, 0.2, -30), new THREE.Vector3(70, 0.2, -40), new THREE.Vector3(120, 0.2, -40)],
    false,
    'catmullrom',
    0.2,
  );

  // container yard (instanced)
  const cGeo = new THREE.BoxGeometry(6.06, 2.59, 2.44);
  const palette = [ink, accent, new THREE.Color('#8c939a'), new THREE.Color('#cfd2d6'), new THREE.Color('#3b4148')];
  const rows = 6, cols = 4;
  const total = rows * cols * 3;
  const containers = new THREE.InstancedMesh(cGeo, new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.3 }), total);
  let n = 0;
  const rnd = (s: number) => (Math.sin(s * 91.7) * 43758.5) % 1;
  for (let r = 0; r < rows; r++)
    for (let cI = 0; cI < cols; cI++) {
      const height = 1 + Math.floor(Math.abs(rnd(r * 7 + cI)) * 3);
      for (let h = 0; h < height; h++) {
        d.position.set(46 + cI * 7, 1.5 + h * 2.62, 6 + r * 3);
        d.updateMatrix();
        containers.setMatrixAt(n, d.matrix);
        containers.setColorAt(n, palette[Math.floor(Math.abs(rnd(n * 3.1)) * palette.length)]);
        n++;
      }
    }
  containers.count = n;
  containers.castShadow = true;
  containers.receiveShadow = true;
  scene.add(containers);

  // pallets in the shipping area
  const pGeo = new THREE.BoxGeometry(1.2, 1.4, 1.0);
  const pallets = new THREE.InstancedMesh(pGeo, mat.cargo, 60);
  for (let i = 0; i < 60; i++) {
    d.position.set(-40 + (i % 10) * 1.6, 0.9, 28 + Math.floor(i / 10) * 1.5 + 2);
    d.updateMatrix();
    pallets.setMatrixAt(i, d.matrix);
  }
  pallets.castShadow = true;
  scene.add(pallets);
  // moving forklift-like carriers
  const carriers: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const c = add(new THREE.BoxGeometry(1.4, 1.2, 1.1), mat.accent, 0, 0.8, 0);
    carriers.push(c);
  }

  // area labels
  const overlay = document.createElement('div');
  overlay.className = 'stage-labels';
  el.appendChild(overlay);
  const labels = new Labels(camera, overlay);
  const AREA_POS: Record<string, THREE.Vector3> = {
    docks: new THREE.Vector3(-10, 8, D / 2 + 2),
    warehouse: new THREE.Vector3(-14, H + 2, -6),
    yard: new THREE.Vector3(56, 12, 12),
    shipping: new THREE.Vector3(-32, 4, 32),
  };
  const btns = new Map<string, HTMLButtonElement>();
  labelsData.forEach((l, i) => {
    if (!AREA_POS[l.key]) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'area-pin';
    b.innerHTML = `<span class="area-pin__n">${String(i + 1).padStart(2, '0')}</span><span class="area-pin__t">${l.title}</span>`;
    b.addEventListener('click', () => api.goto(l.key));
    labels.add(b, AREA_POS[l.key]);
    btns.set(l.key, b);
  });

  // camera
  const cam = { pos: new THREE.Vector3(...AREAS.overview.pos), target: new THREE.Vector3(...AREAS.overview.target) };
  let drift = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;
  stage.onFrame((dt) => {
    t += dt;
    if (!reduce) drift += dt * 0.04;
    const p = cam.pos.clone().sub(cam.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(drift) * 0.12).add(cam.target);
    if (stage.size.w < 700) p.sub(cam.target).multiplyScalar(1.45).add(cam.target);
    camera.position.copy(p);
    camera.lookAt(cam.target);
    // mover along path (loop)
    const u = (t * 0.035) % 1;
    const pt = path.getPointAt(u);
    const tan = path.getTangentAt(u);
    mover.position.copy(pt);
    mover.rotation.y = Math.atan2(-tan.z, tan.x);
    carriers.forEach((c, i) => {
      const k = (t * 0.12 + i / 3) % 1;
      const back = k < 0.5 ? k * 2 : 2 - k * 2;
      c.position.set(-38 + i * 6, 0.8, 26 + back * -2.5 - 0.5);
      c.position.x += Math.sin(t * 0.6 + i) * 1.5;
    });
    labels.update(stage.size.w, stage.size.h);
  });
  autoPause(stage, el);
  el.classList.add('is-ready');

  const api = {
    goto: async (key: string) => {
      const a = AREAS[key];
      if (!a) return;
      btns.forEach((b, k) => b.classList.toggle('is-active', k === key));
      el.dispatchEvent(new CustomEvent('hub:area', { detail: key }));
      const { gsap } = await import('gsap');
      gsap.to(cam.pos, { x: a.pos[0], y: a.pos[1], z: a.pos[2], duration: reduce ? 0.01 : 2, ease: 'power3.inOut' });
      gsap.to(cam.target, { x: a.target[0], y: a.target[1], z: a.target[2], duration: reduce ? 0.01 : 2, ease: 'power3.inOut' });
    },
    stage,
  };
  (el as HTMLElement & { __scene?: unknown }).__scene = api;
  return api;
}
