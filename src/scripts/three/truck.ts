/**
 * Original procedural tractor-trailer (generic cab-over design, not a
 * representation of any real manufacturer/model). Units are meters,
 * the vehicle points to +X, Y is up.
 *
 * Replace with a client GLB through `scene3d.truck.model` in the config —
 * see loadTruck() at the bottom of this file.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface TruckOptions {
  cabColor: string;
  bodyColor: string;
  accent: string;
  ink: string;
  liveryText?: string;
  liverySub?: string;
  stripe?: boolean;
  detail?: 'low' | 'full';
  lightsOn?: boolean;
}

export interface Truck {
  group: THREE.Group;
  tractor: THREE.Group;
  trailer: THREE.Group;
  wheels: THREE.Object3D[];
  /** Named anchor points for hotspots / camera targets */
  anchors: Record<string, THREE.Vector3>;
  setCabColor: (hex: string) => void;
  setBodyColor: (hex: string) => void;
  setLights: (on: boolean) => void;
  roll: (distance: number) => void;
  length: number;
  height: number;
}

const WHEEL_R = 0.52;

/* ── Materials ─────────────────────────────────────────────────────────── */
function makeMaterials(o: TruckOptions) {
  return {
    cab: new THREE.MeshPhysicalMaterial({ color: o.cabColor, metalness: 0.25, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }),
    body: new THREE.MeshPhysicalMaterial({ color: o.bodyColor, metalness: 0.1, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1b1d20', metalness: 0.2, roughness: 0.62 }),
    darker: new THREE.MeshStandardMaterial({ color: '#0e0f11', metalness: 0.1, roughness: 0.8 }),
    metal: new THREE.MeshStandardMaterial({ color: '#c9cdd2', metalness: 1, roughness: 0.22 }),
    steel: new THREE.MeshStandardMaterial({ color: '#5f656c', metalness: 0.85, roughness: 0.4 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#0a0d11', metalness: 0.2, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 1.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#111214', metalness: 0, roughness: 0.92 }),
    light: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: new THREE.Color('#fff6e8'), emissiveIntensity: o.lightsOn ? 3 : 0.35, roughness: 0.2 }),
    drl: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: new THREE.Color('#ffffff'), emissiveIntensity: 1.6, roughness: 0.3 }),
    tail: new THREE.MeshStandardMaterial({ color: '#5a0c08', emissive: new THREE.Color('#ff2a12'), emissiveIntensity: o.lightsOn ? 2.4 : 0.5, roughness: 0.3 }),
    amber: new THREE.MeshStandardMaterial({ color: '#7a4200', emissive: new THREE.Color('#ff9a1f'), emissiveIntensity: 0.8, roughness: 0.3 }),
    accent: new THREE.MeshPhysicalMaterial({ color: o.accent, metalness: 0.2, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

function box(w: number, h: number, d: number, mat: THREE.Material, r = 0, seg = 2) {
  const geo = r > 0 ? new RoundedBoxGeometry(w, h, d, seg, r) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/* ── Livery texture (trailer sides) ────────────────────────────────────── */
function liveryTexture(o: TruckOptions, mirrored: boolean): THREE.CanvasTexture {
  const W = 2048;
  const H = 416;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = o.bodyColor;
  g.fillRect(0, 0, W, H);
  // panel seams
  g.fillStyle = 'rgba(0,0,0,0.07)';
  for (let x = 0; x < W; x += W / 26) g.fillRect(Math.round(x), 0, 2, H);
  g.fillStyle = 'rgba(255,255,255,0.18)';
  for (let x = 3; x < W; x += W / 26) g.fillRect(Math.round(x), 0, 1, H);
  // bottom & top rails shading
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,0,0,0.06)');
  grad.addColorStop(0.08, 'rgba(0,0,0,0)');
  grad.addColorStop(0.92, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.12)');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);

  // When viewing a face, u=0 is at the left. For the +Z face left = rear,
  // for the −Z face left = front. Keep graphics anchored to the front.
  const frontX = (x: number) => (mirrored ? x : W - x);
  if (o.stripe) {
    g.fillStyle = o.accent;
    const sw = 520;
    const x0 = mirrored ? 0 : W - sw;
    g.beginPath();
    if (mirrored) {
      g.moveTo(x0, H * 0.78);
      g.lineTo(x0 + sw, H * 0.78);
      g.lineTo(x0 + sw - 90, H);
      g.lineTo(x0, H);
    } else {
      g.moveTo(x0, H * 0.78);
      g.lineTo(W, H * 0.78);
      g.lineTo(W, H);
      g.lineTo(x0 + 90, H);
    }
    g.fill();
    g.fillStyle = o.ink;
    g.fillRect(0, H * 0.78 - 6, W, 3);
  }
  if (o.liveryText) {
    g.fillStyle = o.ink;
    g.textBaseline = 'alphabetic';
    const fam = getComputedStyle(document.documentElement).getPropertyValue('--font-display') || 'sans-serif';
    g.font = `600 190px ${fam}`;
    (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '-8px';
    const tw = g.measureText(o.liveryText).width;
    const cx = frontX(150 + tw / 2 + 120);
    g.textAlign = 'center';
    g.fillText(o.liveryText, cx, H * 0.6);
    if (o.liverySub) {
      g.font = `500 30px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono') || 'monospace'}`;
      (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px';
      g.fillStyle = o.ink;
      g.globalAlpha = 0.6;
      g.fillText(o.liverySub, cx, H * 0.6 + 56);
      g.globalAlpha = 1;
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function rearDoorTexture(o: TruckOptions): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 560;
  const g = c.getContext('2d')!;
  g.fillStyle = o.bodyColor;
  g.fillRect(0, 0, 512, 560);
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 6;
  g.strokeRect(14, 14, 484, 532);
  g.beginPath();
  g.moveTo(256, 14);
  g.lineTo(256, 546);
  g.stroke();
  g.fillStyle = '#9aa0a6';
  for (const x of [120, 200, 312, 392]) g.fillRect(x, 20, 8, 520);
  g.fillStyle = o.accent;
  g.fillRect(14, 500, 484, 18);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ── Wheel ─────────────────────────────────────────────────────────────── */
function wheel(m: Mats, dual: boolean, detail: 'low' | 'full'): THREE.Group {
  const g = new THREE.Group();
  const seg = detail === 'full' ? 48 : 24;
  const w = 0.3;
  // tire profile (lathe around Y then rotated so the axle is Z)
  const r = WHEEL_R;
  const pts = [
    new THREE.Vector2(0.3, -w / 2),
    new THREE.Vector2(r - 0.05, -w / 2),
    new THREE.Vector2(r - 0.01, -w / 2 + 0.03),
    new THREE.Vector2(r, -w / 2 + 0.08),
    new THREE.Vector2(r, w / 2 - 0.08),
    new THREE.Vector2(r - 0.01, w / 2 - 0.03),
    new THREE.Vector2(r - 0.05, w / 2),
    new THREE.Vector2(0.3, w / 2),
  ];
  const tireGeo = new THREE.LatheGeometry(pts, seg);
  const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, w * 0.86, seg);
  const hubGeo = new THREE.CylinderGeometry(0.11, 0.13, w * 0.9 + 0.04, 16);
  const count = dual ? 2 : 1;
  for (let i = 0; i < count; i++) {
    const zOff = dual ? (i === 0 ? -w / 2 - 0.01 : w / 2 + 0.01) : 0;
    const tire = new THREE.Mesh(tireGeo, m.rubber);
    tire.rotation.x = Math.PI / 2;
    tire.position.z = zOff;
    tire.castShadow = true;
    const rim = new THREE.Mesh(rimGeo, i === 0 || !dual ? m.metal : m.steel);
    rim.rotation.x = Math.PI / 2;
    rim.position.z = zOff;
    g.add(tire, rim);
  }
  const hub = new THREE.Mesh(hubGeo, m.steel);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  if (detail === 'full') {
    // lug nuts – make rotation visible
    const nutGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.05, 6);
    const outer = dual ? w + 0.02 : w / 2;
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2;
      const nut = new THREE.Mesh(nutGeo, m.metal);
      nut.rotation.x = Math.PI / 2;
      nut.position.set(Math.cos(a) * 0.19, Math.sin(a) * 0.19, outer * 0.5 + 0.02);
      g.add(nut);
      const nut2 = nut.clone();
      nut2.position.z *= -1;
      g.add(nut2);
    }
  }
  return g;
}

function fender(m: Mats, width: number) {
  const geo = new THREE.CylinderGeometry(WHEEL_R + 0.09, WHEEL_R + 0.09, width, 32, 1, true, -Math.PI / 2 - 0.15, Math.PI + 0.3);
  const mesh = new THREE.Mesh(geo, m.dark);
  mesh.rotation.x = Math.PI / 2;
  mesh.rotation.y = Math.PI;
  (mesh.material as THREE.Material).side = THREE.DoubleSide;
  mesh.castShadow = true;
  return mesh;
}

/* ── Builder ───────────────────────────────────────────────────────────── */
export function buildTruck(o: TruckOptions): Truck {
  const detail = o.detail ?? 'full';
  const m = makeMaterials(o);
  const group = new THREE.Group();
  const tractor = new THREE.Group();
  const trailer = new THREE.Group();
  const wheels: THREE.Object3D[] = [];
  group.add(tractor, trailer);

  const W = 2.5;
  /* Chassis */
  const rails = box(6.6, 0.3, 0.95, m.darker);
  rails.position.set(-0.05, 0.9, 0);
  tractor.add(rails);

  /* Cab — rounded box with a raked windshield */
  const cabD = 2.3;
  const cabH = 2.85;
  const cabGeo = new RoundedBoxGeometry(cabD, cabH, W, 4, 0.16);
  const pos = cabGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    if (x > 0) {
      const k = (y + cabH / 2) / cabH; // 0 bottom → 1 top
      pos.setX(i, x - Math.pow(k, 1.6) * 0.32);
    }
    // slight taper of the roof width
    if (y > cabH / 2 - 0.3) pos.setZ(i, pos.getZ(i) * 0.985);
  }
  cabGeo.computeVertexNormals();
  const cab = new THREE.Mesh(cabGeo, m.cab);
  cab.castShadow = true;
  cab.position.set(2.15, 1.1 + cabH / 2, 0);
  tractor.add(cab);
  const cabFront = 2.15 + cabD / 2; // x of lower front face

  // windshield (follows the rake)
  const rake = Math.atan(0.32 / cabH) * 1.35;
  const ws = box(0.04, 1.02, W - 0.22, m.glass, 0.02);
  ws.position.set(cabFront - 0.25, 3.12, 0);
  ws.rotation.z = rake;
  tractor.add(ws);
  // sun visor
  const visor = box(0.36, 0.06, W - 0.1, m.cab, 0.02);
  visor.position.set(cabFront - 0.17, 3.72, 0);
  visor.rotation.z = -0.08;
  tractor.add(visor);
  // side windows
  for (const s of [1, -1]) {
    const sw = box(0.95, 0.78, 0.03, m.glass, 0.012);
    sw.position.set(cabFront - 0.72, 3.05, s * (W / 2 + 0.003));
    tractor.add(sw);
    // door seam
    const seam = box(0.01, 1.7, 0.01, m.darker);
    seam.position.set(cabFront - 1.3, 2.25, s * (W / 2 + 0.004));
    tractor.add(seam);
    // mirror arm + housing
    const arm = box(0.05, 0.05, 0.42, m.darker);
    arm.position.set(cabFront - 0.05, 3.15, s * (W / 2 + 0.18));
    const mirror = box(0.12, 0.62, 0.2, m.cab, 0.04);
    mirror.position.set(cabFront - 0.02, 2.95, s * (W / 2 + 0.4));
    const mirrorGlass = box(0.012, 0.56, 0.16, m.glass);
    mirrorGlass.position.set(cabFront - 0.085, 2.95, s * (W / 2 + 0.4));
    tractor.add(arm, mirror, mirrorGlass);
    // steps
    for (let k = 0; k < 2; k++) {
      const step = box(0.5, 0.04, 0.22, m.steel);
      step.position.set(cabFront - 0.9, 0.62 + k * 0.38, s * (W / 2 - 0.1));
      tractor.add(step);
    }
  }
  // grille block with slats
  const grille = box(0.06, 1.0, 1.7, m.darker, 0.02);
  grille.position.set(cabFront + 0.005, 1.95, 0);
  tractor.add(grille);
  for (let k = 0; k < 6; k++) {
    const slat = box(0.035, 0.035, 1.6, k === 0 ? m.accent : m.steel);
    slat.position.set(cabFront + 0.04, 1.55 + k * 0.155, 0);
    tractor.add(slat);
  }
  // logo plate band
  const band = box(0.03, 0.06, 1.2, m.metal);
  band.position.set(cabFront + 0.035, 2.52, 0);
  tractor.add(band);
  // headlights + DRL strips
  for (const s of [1, -1]) {
    const hl = box(0.06, 0.2, 0.46, m.glass, 0.03);
    hl.position.set(cabFront + 0.01, 1.42, s * 0.92);
    const lamp = box(0.02, 0.1, 0.36, m.light, 0.01);
    lamp.position.set(cabFront + 0.04, 1.42, s * 0.92);
    const drl = box(0.02, 0.025, 0.44, m.drl);
    drl.position.set(cabFront + 0.045, 1.55, s * 0.92);
    const ind = box(0.02, 0.05, 0.1, m.amber);
    ind.position.set(cabFront + 0.04, 1.42, s * 1.18);
    tractor.add(hl, lamp, drl, ind);
  }
  // roof marker lights
  for (let k = -2; k <= 2; k++) {
    const ml = box(0.05, 0.04, 0.12, m.amber);
    ml.position.set(cabFront - 0.32, 3.95, k * 0.3);
    tractor.add(ml);
  }
  // bumper
  const bumper = box(0.34, 0.36, W - 0.04, m.dark, 0.05);
  bumper.position.set(cabFront - 0.1, 1.05, 0);
  tractor.add(bumper);
  const bumperLip = box(0.12, 0.05, W - 0.3, m.accent);
  bumperLip.position.set(cabFront + 0.06, 0.88, 0);
  tractor.add(bumperLip);

  // side fairings between front & rear axles, fuel tank, battery box
  for (const s of [1, -1]) {
    const skirt = box(1.4, 0.5, 0.06, m.cab, 0.03);
    skirt.position.set(0.55, 0.78, s * (W / 2 - 0.05));
    tractor.add(skirt);
  }
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, detail === 'full' ? 32 : 16), m.metal);
  tank.rotation.z = Math.PI / 2;
  tank.position.set(0.55, 0.72, 0.85);
  tank.castShadow = true;
  // cab back wall / chassis cover
  const backWall = box(0.4, 1.4, W - 0.4, m.darker);
  backWall.position.set(0.85, 1.75, 0);
  tractor.add(backWall);
  // fifth wheel
  const fifth = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32), m.steel);
  fifth.position.set(-1.15, 1.1, 0);
  tractor.add(fifth);
  // tractor rear light bar
  const rl = box(0.06, 0.08, 1.9, m.tail);
  rl.position.set(-3.38, 0.98, 0);
  tractor.add(rl);

  /* Tractor axles: front single, rear 6x2 dual */
  const tractorAxles: [number, boolean][] = [
    [2.2, false],
    [-0.5, true],
    [-1.85, true],
  ];
  for (const [x, dual] of tractorAxles) {
    for (const s of [1, -1]) {
      const wh = wheel(m, dual, detail);
      wh.position.set(x, WHEEL_R, s * (W / 2 - (dual ? 0.34 : 0.2)));
      if (s < 0) wh.rotation.y = Math.PI;
      tractor.add(wh);
      wheels.push(wh);
      const f = fender(m, dual ? 0.7 : 0.4);
      f.position.set(x, WHEEL_R, s * (W / 2 - (dual ? 0.34 : 0.2)));
      tractor.add(f);
    }
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, W - 0.6, 12), m.darker);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(x, WHEEL_R, 0);
    tractor.add(axle);
  }

  /* Trailer */
  const TL = 13.6;
  const TW = 2.55;
  const TH = 2.75;
  const tFront = 0.25;
  const tCenter = tFront - TL / 2;
  const floorY = 1.28;
  const sideA = new THREE.MeshPhysicalMaterial({ map: liveryTexture(o, false), metalness: 0.05, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.25 });
  const sideB = new THREE.MeshPhysicalMaterial({ map: liveryTexture(o, true), metalness: 0.05, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.25 });
  const rear = new THREE.MeshStandardMaterial({ map: rearDoorTexture(o), metalness: 0.1, roughness: 0.5 });
  const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(TL, TH, TW), [m.body, rear, m.body, m.dark, sideA, sideB]);
  boxMesh.position.set(tCenter, floorY + TH / 2, 0);
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  trailer.add(boxMesh);
  // aluminium edge rails
  for (const y of [floorY + 0.03, floorY + TH - 0.02]) {
    for (const s of [1, -1]) {
      const rail = box(TL + 0.02, 0.07, 0.04, m.metal);
      rail.position.set(tCenter, y, s * (TW / 2 + 0.01));
      trailer.add(rail);
    }
  }
  for (const x of [tFront, tFront - TL]) {
    for (const s of [1, -1]) {
      const post = box(0.06, TH, 0.06, m.metal);
      post.position.set(x, floorY + TH / 2, s * (TW / 2));
      trailer.add(post);
    }
  }
  // underframe + skirts
  const under = box(TL - 0.4, 0.28, 1.1, m.darker);
  under.position.set(tCenter, floorY - 0.14, 0);
  trailer.add(under);
  for (const s of [1, -1]) {
    const skirt = box(5.6, 0.62, 0.04, m.dark, 0.02);
    skirt.position.set(tFront - 6.6, floorY - 0.42, s * (TW / 2 - 0.08));
    trailer.add(skirt);
    // side marker lights
    for (let k = 0; k < 5; k++) {
      const ml = box(0.08, 0.04, 0.02, m.amber);
      ml.position.set(tFront - 1.5 - k * 2.6, floorY + 0.12, s * (TW / 2 + 0.02));
      trailer.add(ml);
    }
  }
  // landing gear
  for (const s of [1, -1]) {
    const leg = box(0.12, 0.85, 0.12, m.steel);
    leg.position.set(tFront - 2.6, floorY - 0.55, s * 0.8);
    const foot = box(0.3, 0.05, 0.3, m.steel);
    foot.position.set(tFront - 2.6, 0.2, s * 0.8);
    trailer.add(leg, foot);
  }
  // trailer axles (3 × dual)
  for (const x of [tFront - 10.2, tFront - 11.55, tFront - 12.9]) {
    for (const s of [1, -1]) {
      const wh = wheel(m, true, detail);
      wh.position.set(x, WHEEL_R, s * (TW / 2 - 0.36));
      if (s < 0) wh.rotation.y = Math.PI;
      trailer.add(wh);
      wheels.push(wh);
    }
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, TW - 0.6, 12), m.darker);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(x, WHEEL_R, 0);
    trailer.add(axle);
  }
  // mudguards over trailer wheels (flat)
  for (const s of [1, -1]) {
    const mg = box(4.2, 0.04, 0.72, m.darker);
    mg.position.set(tFront - 11.55, WHEEL_R * 2 + 0.12, s * (TW / 2 - 0.36));
    trailer.add(mg);
  }
  // rear underride bar + tail lights
  const ub = box(0.12, 0.14, TW - 0.2, m.steel);
  ub.position.set(tFront - TL + 0.1, 0.55, 0);
  trailer.add(ub);
  for (const s of [1, -1]) {
    const tl = box(0.05, 0.14, 0.5, m.tail, 0.02);
    tl.position.set(tFront - TL - 0.02, floorY - 0.12, s * 0.9);
    trailer.add(tl);
  }
  tractor.add(tank);

  const anchors: Record<string, THREE.Vector3> = {
    cab: new THREE.Vector3(cabFront, 3.0, 0),
    lights: new THREE.Vector3(cabFront + 0.05, 1.45, 0.92),
    mirrors: new THREE.Vector3(cabFront, 3.0, W / 2 + 0.4),
    wheels: new THREE.Vector3(-1.2, WHEEL_R, W / 2),
    tank: new THREE.Vector3(0.55, 0.72, 1.15),
    trailer: new THREE.Vector3(tCenter, floorY + TH / 2, TW / 2),
    skirts: new THREE.Vector3(tFront - 6.6, floorY - 0.4, TW / 2),
    rear: new THREE.Vector3(tFront - TL, floorY + 1.2, 0),
    fifth: new THREE.Vector3(-1.15, 1.2, 0),
    center: new THREE.Vector3(-5.1, 2, 0),
  };

  const setLights = (on: boolean) => {
    m.light.emissiveIntensity = on ? 3.2 : 0.35;
    m.tail.emissiveIntensity = on ? 2.6 : 0.5;
  };

  return {
    group,
    tractor,
    trailer,
    wheels,
    anchors,
    setCabColor: (hex) => m.cab.color.set(hex),
    setBodyColor: (hex) => m.body.color.set(hex),
    setLights,
    roll: (d) => wheels.forEach((w) => (w.rotation.z -= (d / WHEEL_R) * (w.rotation.y ? -1 : 1))),
    length: 3.45 + TL - tFront,
    height: 4.05,
  };
}

/**
 * Loads a client GLB/GLTF and adapts it to the same interface.
 * Conventions for client models (documented in docs/GUIA-PERSONALIZACAO.md):
 *  - vehicle facing +X (use modelRotationY to correct), Y up
 *  - materials named "*paint*" / "*cab*" are recolored by the configurator
 *  - meshes named "*wheel*" spin with the motion
 */
export async function loadTruck(url: string, o: TruckOptions & { scale?: number; rotationY?: number }): Promise<Truck> {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url);
  const model = gltf.scene;
  model.rotation.y = o.rotationY ?? 0;
  model.scale.setScalar(o.scale ?? 1);
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const k = (o.scale ?? 1) === 1 ? 16.5 / Math.max(size.x, size.z) : 1;
  model.scale.multiplyScalar(k);
  // front bumper at x = 3.4 (same as the procedural vehicle), wheels on y = 0
  model.position.set(3.4 - bounds.max.x * k, -bounds.min.y * k, -center.z * k);
  const group = new THREE.Group();
  group.add(model);
  const wheels: THREE.Object3D[] = [];
  const paint: THREE.MeshStandardMaterial[] = [];
  model.traverse((ob) => {
    const mesh = ob as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && /paint|cab/i.test(mat.name)) paint.push(mat);
    }
    if (/wheel/i.test(ob.name)) wheels.push(ob);
  });
  const len = size.x * k;
  return {
    group,
    tractor: group,
    trailer: new THREE.Group(),
    wheels,
    anchors: {
      cab: new THREE.Vector3(3, 3, 0),
      wheels: new THREE.Vector3(-1, 0.5, 1.25),
      trailer: new THREE.Vector3(-5, 2.5, 1.3),
      rear: new THREE.Vector3(3.4 - len, 2, 0),
      lights: new THREE.Vector3(3.4, 1.4, 0.9),
      mirrors: new THREE.Vector3(3.2, 3, 1.6),
      center: new THREE.Vector3(3.4 - len / 2, 2, 0),
    },
    setCabColor: (hex) => paint.forEach((p) => p.color.set(hex)),
    setBodyColor: () => undefined,
    setLights: () => undefined,
    roll: (d) => wheels.forEach((w) => (w.rotation.z -= d / WHEEL_R)),
    length: len,
    height: size.y * k,
  };
}
