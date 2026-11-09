/**
 * Hero scene — the vehicle arrives in a clean "infinity studio", technical
 * dimension lines draw in, and the camera follows the page scroll.
 */
import * as THREE from 'three';
import { createStage, autoPause, contactShadow, cssColor, damp, type Quality } from '../stage';
import { createTruck, readTruckConfig } from '../truckFactory';
import { dimensionLine, floorGrid, laneMarkings, Labels } from '../overlay';

export interface HeroController {
  intro: (onDone?: () => void) => void;
  setScroll: (p: number) => void;
  setPose: (name: 'hero' | 'side' | 'front' | 'rear' | 'top' | 'detail') => void;
  render: () => void;
}

export async function mountHero(el: HTMLElement, quality: Quality, opts: { animate: boolean }): Promise<HeroController> {
  const stage = createStage(el, { quality, fov: 24, exposure: 1.05 });
  const { scene, camera } = stage;
  const ink = cssColor('--c-ink');
  const accent = cssColor('--c-accent');
  const bg = cssColor('--c-bg');
  scene.fog = new THREE.Fog(bg, 38, 95);

  // lights
  const key = new THREE.DirectionalLight('#ffffff', 2.4);
  key.position.set(8, 18, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 6;
  scene.add(key, new THREE.HemisphereLight('#ffffff', '#b9bcc0', 0.6));
  const rim = new THREE.DirectionalLight('#ffffff', 1.2);
  rim.position.set(-12, 6, -10);
  scene.add(rim);

  // floor
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.16 }));
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.receiveShadow = true;
  scene.add(shadowFloor);
  const grid = floorGrid(140, 2.5, ink, 0.07);
  scene.add(grid);
  const lane = laneMarkings(140, 3, 6, 0.12, ink, 0.35);
  lane.mesh.position.z = 3.4;
  scene.add(lane.mesh);
  const lane2 = laneMarkings(140, 140, 0, 0.05, accent, 0.9);
  lane2.mesh.position.z = -3.2;
  scene.add(lane2.mesh);

  const truck = await createTruck(readTruckConfig(el), quality === 'full' ? 'full' : 'low');
  const rig = new THREE.Group();
  rig.add(truck.group);
  const cs = contactShadow(truck.length + 3, 4.6, 0.5);
  cs.position.x = 3.4 - truck.length / 2;
  rig.add(cs);
  scene.add(rig);

  // dimension lines
  const len = truck.length;
  const dimL = dimensionLine(len, ink, 0.4, 0.55);
  dimL.group.rotation.x = -Math.PI / 2;
  dimL.group.position.set(3.4 - len, 0.01, 2.35);
  const dimH = dimensionLine(truck.height, ink, 0.4, 0.55);
  dimH.group.rotation.z = Math.PI / 2;
  dimH.group.position.set(4.2, 0, 1.25);
  rig.add(dimL.group, dimH.group);

  // HTML labels
  const overlay = document.createElement('div');
  overlay.className = 'stage-labels';
  el.appendChild(overlay);
  const labels = new Labels(camera, overlay);
  const fmt = (n: number) => n.toLocaleString(document.documentElement.lang || 'pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const mk = (txt: string, cls = '') => {
    const d = document.createElement('span');
    d.className = `stage-label ${cls}`;
    d.textContent = txt;
    return d;
  };
  const lblL = labels.add(mk(`${fmt(len)} m`), new THREE.Vector3(3.4 - len / 2, 0.02, 2.35), rig);
  const lblH = labels.add(mk(`${fmt(truck.height)} m`), new THREE.Vector3(4.2, truck.height / 2, 1.25), rig);
  const lblC = labels.add(mk('REF. 01 — CONJUNTO 6x2', 'stage-label--tag'), new THREE.Vector3(truck.anchors.cab.x - 0.4, 4.4, 0), rig);
  const labelEls = [lblL, lblH, lblC];

  /* Camera rig */
  const target = new THREE.Vector3();
  const camPos = new THREE.Vector3();
  const poses = {
    hero: { pos: new THREE.Vector3(23.5, 6, 30), target: new THREE.Vector3(-4.6, 1.7, 0) },
    side: { pos: new THREE.Vector3(-5, 2.4, 30), target: new THREE.Vector3(-5, 2.0, 0) },
    front: { pos: new THREE.Vector3(18, 2.4, 5.5), target: new THREE.Vector3(0, 2.0, 0) },
    rear: { pos: new THREE.Vector3(-26, 3.4, -12), target: new THREE.Vector3(-6, 2.0, 0) },
    top: { pos: new THREE.Vector3(6, 26, 14), target: new THREE.Vector3(-5, 0, 0) },
    detail: { pos: new THREE.Vector3(8.5, 2.6, 6.5), target: new THREE.Vector3(2.4, 2.3, 0) },
  };
  const mobile = () => stage.size.w < 760;
  let pose = poses.hero;
  let framing = true;
  let scroll = 0;
  let introP = opts.animate ? 0 : 1; // 0 → truck far right, 1 → parked
  let driveX = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let laneOffset = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  const apply = (dt: number) => {
    pointer.x = damp(pointer.x, pointer.tx, 3, dt);
    pointer.y = damp(pointer.y, pointer.ty, 3, dt);
    const s = scroll;
    const m = mobile();
    // scroll: orbit from 3/4 front toward a lower, wider side view and drive off
    const base = pose.pos.clone();
    if (m) base.sub(pose.target).multiplyScalar(2.1).add(pose.target);
    const orbit = s * 0.85;
    const r = Math.hypot(base.x - pose.target.x, base.z - pose.target.z);
    const a0 = Math.atan2(base.z - pose.target.z, base.x - pose.target.x);
    camPos.set(pose.target.x + Math.cos(a0 + orbit) * r * (1 + s * 0.25), base.y + s * 3.5 - pointer.y * 0.4, pose.target.z + Math.sin(a0 + orbit) * r * (1 + s * 0.25));
    camPos.x += pointer.x * 0.9;
    target.copy(pose.target);

    camera.position.copy(camPos);
    camera.lookAt(target);
    // editorial framing: push the vehicle to the right (desktop) / top (mobile)
    const { w, h } = stage.size;
    if (framing) camera.setViewOffset(w, h, m ? 0 : -w * 0.13, m ? h * 0.02 : h * 0.06, w, h);
    else camera.clearViewOffset();

    // truck position = intro arrival + scroll drive-off
    const arrive = (1 - introP) * 46;
    const x = arrive + s * 16;
    const dx = x - driveX;
    driveX = x;
    rig.position.x = x;
    truck.roll(dx);
    // lane markings: always a hint of motion
    laneOffset -= dt * (0.8 + (1 - introP) * 22) - dx * 0;
    lane.setOffset(laneOffset);
  };

  stage.onFrame((dt) => {
    apply(dt);
    labels.update(stage.size.w, stage.size.h);
  });

  const setDims = (p: number) => {
    dimL.group.scale.x = Math.max(0.0001, p);
    dimH.group.scale.x = Math.max(0.0001, p);
    labelEls.forEach((l) => (l.style.opacity = String(Math.max(0, (p - 0.6) / 0.4))));
  };
  setDims(opts.animate ? 0 : 1);
  apply(0);
  labels.update(stage.size.w, stage.size.h);
  autoPause(stage, el);
  el.classList.add('is-ready');

  const ctrl: HeroController = {
    intro: (onDone) => {
      import('gsap').then(({ gsap }) => {
        const o = { p: 0, d: 0 };
        gsap.timeline({ onComplete: onDone })
          .to(o, { p: 1, duration: 3.2, ease: 'expo.out', onUpdate: () => (introP = o.p) }, 0.2)
          .to(o, { d: 1, duration: 1.6, ease: 'power3.inOut', onUpdate: () => setDims(o.d) }, 1.8);
      });
    },
    setScroll: (p) => {
      scroll = p;
      setDims(Math.max(0, 1 - p * 3));
    },
    setPose: (name) => {
      pose = poses[name];
      framing = name === 'hero';
      apply(0);
      labels.update(stage.size.w, stage.size.h);
      stage.renderOnce();
    },
    render: () => stage.renderOnce(),
  };
  (el as HTMLElement & { __scene?: unknown }).__scene = { ...ctrl, stage, truck, setDims, setLabelsVisible: (v: boolean) => (overlay.style.display = v ? '' : 'none') };
  return ctrl;
}
