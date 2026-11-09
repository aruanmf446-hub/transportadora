/** HTML labels anchored to 3D points + technical dimension lines. */
import * as THREE from 'three';

export class Labels {
  private items: { el: HTMLElement; pos: THREE.Vector3; obj?: THREE.Object3D }[] = [];
  private v = new THREE.Vector3();
  constructor(private camera: THREE.Camera, private container: HTMLElement) {}

  add(el: HTMLElement, pos: THREE.Vector3, obj?: THREE.Object3D) {
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.willChange = 'transform';
    this.container.appendChild(el);
    this.items.push({ el, pos, obj });
    return el;
  }

  update(w: number, h: number) {
    for (const it of this.items) {
      this.v.copy(it.pos);
      if (it.obj) it.obj.localToWorld(this.v);
      this.v.project(this.camera);
      const behind = this.v.z > 1;
      const x = (this.v.x * 0.5 + 0.5) * w;
      const y = (-this.v.y * 0.5 + 0.5) * h;
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      it.el.style.visibility = behind ? 'hidden' : '';
    }
  }
}

/** Dimension line: main segment + end ticks. Returns a group whose
 *  scale.x can be animated 0→1 to "draw" it. */
export function dimensionLine(length: number, color: THREE.ColorRepresentation, tick = 0.35, opacity = 0.7) {
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const g = new THREE.Group();
  const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0)];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  for (const x of [0, length]) {
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -tick / 2, 0), new THREE.Vector3(x, tick / 2, 0)]), mat));
  }
  return { group: g, material: mat };
}

/** Infinite-looking floor grid made of thin lines (fades with fog). */
export function floorGrid(size: number, step: number, color: THREE.ColorRepresentation, opacity = 0.22) {
  const pts: number[] = [];
  const half = size / 2;
  for (let i = -half; i <= half; i += step) {
    pts.push(-half, 0, i, half, 0, i);
    pts.push(i, 0, -half, i, 0, half);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const lines = new THREE.LineSegments(geo, mat);
  lines.position.y = 0.002;
  return lines;
}

/** Dashed lane markings that can scroll along X (offset in meters). */
export function laneMarkings(length: number, dash: number, gap: number, width: number, color: THREE.ColorRepresentation, opacity = 1) {
  const count = Math.ceil(length / (dash + gap));
  const geo = new THREE.PlaneGeometry(dash, width);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: false });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const period = dash + gap;
  const dummy = new THREE.Object3D();
  const setOffset = (off: number) => {
    const o = ((off % period) + period) % period;
    for (let i = 0; i < count; i++) {
      dummy.position.set(-length / 2 + i * period + o, 0.004, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  setOffset(0);
  return { mesh, setOffset };
}
