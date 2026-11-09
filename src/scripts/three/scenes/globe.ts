/** Minimal 3D globe: dot sphere, graticule, animated arcs and markers. */
import * as THREE from 'three';
import { createStage, autoPause, cssColor, type Quality } from '../stage';
import { Labels } from '../overlay';

interface P { id: string; name: string; lat: number; lon: number }
const R = 5;
const toVec = (lat: number, lon: number, r = R) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

export async function mountGlobe(el: HTMLElement, quality: Quality, data: { points: P[]; arcs: { from: string; to: string }[]; origin?: string }) {
  const stage = createStage(el, { quality, fov: 30, shadows: false });
  const { scene, camera } = stage;
  const fg = cssColor('--fg', el);
  const accent = cssColor('--c-accent');
  const globe = new THREE.Group();
  scene.add(globe);

  // occluding core so back dots fade
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 64, 64), new THREE.MeshBasicMaterial({ color: cssColor('--bg', el), toneMapped: false })));
  // fibonacci dots
  const N = quality === 'full' ? 5200 : 2600;
  const pos = new Float32Array(N * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos.set([Math.cos(th) * rr * R, y * R, Math.sin(th) * rr * R], i * 3);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  globe.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: fg, size: 0.035, transparent: true, opacity: 0.45, sizeAttenuation: true })));
  // graticule
  const gm = new THREE.LineBasicMaterial({ color: fg, transparent: true, opacity: 0.1 });
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = Array.from({ length: 121 }, (_, i) => toVec(lat, -180 + i * 3, R * 1.002));
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm));
  }
  for (let lon = -180; lon < 180; lon += 30) {
    const pts = Array.from({ length: 61 }, (_, i) => toVec(-90 + i * 3, lon, R * 1.002));
    globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm));
  }

  const byId = new Map(data.points.map((p) => [p.id, p]));
  const overlay = document.createElement('div');
  overlay.className = 'stage-labels';
  el.appendChild(overlay);
  const labels = new Labels(camera, overlay);
  const markerGeo = new THREE.SphereGeometry(0.07, 16, 16);
  data.points.forEach((p) => {
    const isOrigin = p.id === data.origin;
    const m = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: isOrigin ? accent : fg }));
    const v = toVec(p.lat, p.lon, R * 1.01);
    m.position.copy(v);
    m.scale.setScalar(isOrigin ? 1.8 : 1);
    globe.add(m);
    const lab = document.createElement('span');
    lab.className = 'globe-label' + (isOrigin ? ' is-origin' : '');
    lab.textContent = p.name;
    labels.add(lab, v.clone().multiplyScalar(1.04), globe);
  });

  // arcs
  const arcs: { line: THREE.Line; pulse: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; offset: number }[] = [];
  data.arcs.forEach((a, i) => {
    const A = byId.get(a.from), B = byId.get(a.to);
    if (!A || !B) return;
    const va = toVec(A.lat, A.lon), vb = toVec(B.lat, B.lon);
    const mid = va.clone().add(vb).multiplyScalar(0.5);
    const lift = 1 + va.distanceTo(vb) / (R * 2.4);
    mid.setLength(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
    const pts = curve.getPoints(90);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 }));
    line.geometry.setDrawRange(0, 0);
    globe.add(line);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: accent }));
    globe.add(pulse);
    arcs.push({ line, pulse, curve, offset: i * 0.37 });
  });

  // orient so origin faces camera
  const origin = data.origin ? byId.get(data.origin) : data.points[0];
  const baseRotY = origin ? -THREE.MathUtils.degToRad(origin.lon + 90) : 0;
  globe.rotation.set(origin ? THREE.MathUtils.degToRad(origin.lat) * 0.6 : 0.3, baseRotY, 0);
  camera.position.set(0, 0, 23);

  // drag to rotate
  let drag = false, lx = 0, vel = 0.0;
  let userRot = 0;
  el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') { drag = true; lx = e.clientX; el.setPointerCapture(e.pointerId); } });
  el.addEventListener('pointermove', (e) => { if (drag) { vel = (e.clientX - lx) * 0.005; userRot += vel; lx = e.clientX; } });
  el.addEventListener('pointerup', () => (drag = false));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;
  let drawn = 0;
  stage.onFrame((dt) => {
    t += dt;
    drawn = Math.min(1, drawn + dt * 0.5);
    if (!drag) { vel *= 0.94; userRot += vel; }
    globe.rotation.y = baseRotY + userRot + (reduce ? 0 : Math.sin(t * 0.08) * 0.35);
    arcs.forEach((a) => {
      const k = THREE.MathUtils.clamp(drawn * 1.6 - a.offset * 0.3, 0, 1);
      a.line.geometry.setDrawRange(0, Math.floor(k * 91));
      const u = reduce ? 1 : (t * 0.22 + a.offset) % 1;
      a.pulse.position.copy(a.curve.getPoint(u));
      a.pulse.visible = k >= 1;
    });
    labels.update(stage.size.w, stage.size.h);
    // hide labels on the back side
    overlay.querySelectorAll<HTMLElement>('.globe-label').forEach((l, i) => {
      const p = data.points[i];
      const w = toVec(p.lat, p.lon).applyEuler(globe.rotation);
      l.style.opacity = w.z > 0.5 ? '1' : '0';
    });
  });
  autoPause(stage, el);
  el.classList.add('is-ready');
  (el as HTMLElement & { __scene?: unknown }).__scene = { stage };
}
