/**
 * Scroll-Driven Vehicle Motion — the road moves under the vehicle while the
 * camera travels through four keyframes driven by the page scroll.
 */
import * as THREE from 'three';
import { createStage, autoPause, contactShadow, cssColor, type Quality } from '../stage';
import { createTruck, readTruckConfig } from '../truckFactory';
import { laneMarkings } from '../overlay';

const KEYS = [
  { pos: new THREE.Vector3(24, 2.2, 13), target: new THREE.Vector3(-3, 2.2, 0) }, // low front 3/4
  { pos: new THREE.Vector3(-5, 3.4, 32), target: new THREE.Vector3(-5, 2.4, 0) }, // side tracking
  { pos: new THREE.Vector3(4, 44, 16), target: new THREE.Vector3(-6, 0, 0) }, // aerial
  { pos: new THREE.Vector3(-36, 5, -12), target: new THREE.Vector3(-4, 2.4, 0) }, // rear 3/4
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export async function mountRoad(el: HTMLElement, quality: Quality) {
  const stage = createStage(el, { quality, fov: 30, exposure: 0.95, alpha: true });
  const { scene, camera } = stage;
  const bg = cssColor('--bg', el);
  const fg = cssColor('--fg', el);
  const accent = cssColor('--c-accent');
  scene.fog = new THREE.Fog(bg, 40, 130);

  scene.add(new THREE.HemisphereLight('#c9d3e0', '#101214', 0.3));
  const moon = new THREE.DirectionalLight('#dfe6f2', 0.9);
  moon.position.set(-10, 20, 14);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left: -20, right: 20, top: 12, bottom: -12 });
  scene.add(moon);
  const warm = new THREE.PointLight(accent, 30, 30, 2);
  warm.position.set(-14, 3, 4);
  scene.add(warm);

  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: bg.clone().lerp(new THREE.Color('#000000'), 0.15), roughness: 0.92, metalness: 0 }),
  );
  asphalt.rotation.x = -Math.PI / 2;
  asphalt.receiveShadow = true;
  scene.add(asphalt);
  const lane = laneMarkings(260, 4, 7, 0.16, fg, 0.55);
  lane.mesh.position.z = 2.2;
  const edgeA = laneMarkings(260, 260, 0, 0.12, fg, 0.35);
  edgeA.mesh.position.z = 5.6;
  const edgeB = laneMarkings(260, 260, 0, 0.12, accent, 0.9);
  edgeB.mesh.position.z = -2.4;
  scene.add(lane.mesh, edgeA.mesh, edgeB.mesh);

  // roadside posts for motion parallax (instanced)
  const postGeo = new THREE.BoxGeometry(0.12, 2.2, 0.12);
  postGeo.translate(0, 1.1, 0);
  const posts = new THREE.InstancedMesh(postGeo, new THREE.MeshStandardMaterial({ color: fg, roughness: 0.6 }), 26);
  const reflGeo = new THREE.BoxGeometry(0.14, 0.18, 0.14);
  const refl = new THREE.InstancedMesh(reflGeo, new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.5 }), 26);
  scene.add(posts, refl);
  const POST_GAP = 10;
  const dummy = new THREE.Object3D();
  const setPosts = (off: number) => {
    for (let i = 0; i < 26; i++) {
      const x = -130 + ((i * POST_GAP + off) % 260 + 260) % 260;
      const z = i % 2 ? 15 : -11;
      dummy.position.set(x, 0, z);
      dummy.updateMatrix();
      posts.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 2.0;
      dummy.updateMatrix();
      refl.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 0;
    }
    posts.instanceMatrix.needsUpdate = true;
    refl.instanceMatrix.needsUpdate = true;
  };

  const truck = await createTruck(readTruckConfig(el), quality === 'full' ? 'full' : 'low', true);
  scene.add(truck.group);
  const cs = contactShadow(truck.length + 3, 4.4, 0.7);
  cs.position.x = 3.4 - truck.length / 2;
  scene.add(cs);
  // headlight beams on the road
  const beam = new THREE.SpotLight('#fff3dc', 60, 40, 0.45, 0.6, 1.5);
  beam.position.set(3.6, 1.4, 0);
  beam.target.position.set(20, 0, 0);
  scene.add(beam, beam.target);

  let progress = 0;
  let travel = 0;
  const cam = new THREE.Vector3();
  const tgt = new THREE.Vector3();
  const mobile = () => stage.size.w < 760;

  const applyCamera = () => {
    const seg = progress * (KEYS.length - 1);
    const i = Math.min(KEYS.length - 2, Math.floor(seg));
    const t = smooth(seg - i);
    cam.lerpVectors(KEYS[i].pos, KEYS[i + 1].pos, t);
    tgt.lerpVectors(KEYS[i].target, KEYS[i + 1].target, t);
    if (mobile()) cam.sub(tgt).multiplyScalar(1.6).add(tgt);
    camera.position.copy(cam);
    camera.lookAt(tgt);
  };

  stage.onFrame((dt) => {
    // constant cruise + extra speed from scroll
    travel += dt * 9;
    lane.setOffset(-travel);
    setPosts(-travel);
    truck.roll(dt * 9);
    applyCamera();
  });
  setPosts(0);
  applyCamera();
  autoPause(stage, el);
  el.classList.add('is-ready');
  const api = { setProgress: (p: number) => (progress = p), stage, truck };
  (el as HTMLElement & { __scene?: unknown }).__scene = api;
  return api;
}
