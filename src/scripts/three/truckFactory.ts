import { buildTruck, loadTruck, type Truck } from './truck';
import { cssVar } from './stage';

export interface TruckConfig {
  model?: string;
  modelScale?: number;
  modelRotationY?: number;
  bodyColor?: string;
  cabColor?: string;
  livery?: { text?: string; subtext?: string; stripe?: boolean };
}

export function readTruckConfig(el: HTMLElement): TruckConfig {
  try {
    return JSON.parse(el.dataset.truck || '{}');
  } catch {
    return {};
  }
}

/** Procedural vehicle unless the client provided a GLB (with fallback). */
export async function createTruck(cfg: TruckConfig, detail: 'low' | 'full', lightsOn = false): Promise<Truck> {
  const opts = {
    cabColor: cfg.cabColor || cssVar('--c-ink') || '#16181b',
    bodyColor: cfg.bodyColor || '#ededea',
    accent: cssVar('--c-accent') || '#e9561b',
    ink: cssVar('--c-ink') || '#141618',
    liveryText: cfg.livery?.text,
    liverySub: cfg.livery?.subtext,
    stripe: cfg.livery?.stripe ?? true,
    detail,
    lightsOn,
  };
  if (cfg.model) {
    try {
      return await loadTruck(cfg.model, { ...opts, scale: cfg.modelScale, rotationY: cfg.modelRotationY });
    } catch (e) {
      console.warn('[truck] GLB failed to load, using procedural vehicle', e);
    }
  }
  return buildTruck(opts);
}
