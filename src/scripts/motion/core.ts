/**
 * Motion system — a single place that defines timing, easing and the
 * declarative reveal vocabulary used by every section:
 *
 *   data-reveal="lines|words|chars|fade|mask|clip-x|rule|stagger|scale"
 *   data-delay="0.2"           extra delay (s)
 *   data-parallax="0.15"       scroll-linked translation (fraction of height)
 *   data-counter               animated number (final value rendered in HTML)
 *   data-magnetic              subtle magnetic hover (fine pointers only)
 *
 * Section-level intensity comes from the config (`animation`) through
 * data-anim on the <section>; global level from <html data-motion>.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/* ── Tokens ────────────────────────────────────────────────────────────── */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power3.inOut',
  precise: 'power4.inOut',
} as const;

export const DUR = { xs: 0.35, s: 0.6, m: 0.9, l: 1.25, xl: 1.8 } as const;

type Level = 'none' | 'subtle' | 'standard' | 'cinematic';
const FACTORS: Record<Level, { dur: number; dist: number }> = {
  none: { dur: 0, dist: 0 },
  subtle: { dur: 0.75, dist: 0.5 },
  standard: { dur: 1, dist: 1 },
  cinematic: { dur: 1.2, dist: 1.25 },
};

const root = document.documentElement;
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const motionEnabled = () => root.classList.contains('motion-ok') && !prefersReducedMotion();
export const globalLevel = (): Level => (motionEnabled() ? ((root.dataset.motion as Level) ?? 'standard') : 'none');
export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function levelFor(el: Element): Level {
  const sec = el.closest<HTMLElement>('[data-anim]');
  const l = (sec?.dataset.anim as Level | undefined) ?? globalLevel();
  return globalLevel() === 'none' ? 'none' : l;
}

/* ── Smooth scroll ─────────────────────────────────────────────────────── */
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function scrollToTarget(target: string | HTMLElement | number, offset = -80) {
  if (lenis) lenis.scrollTo(target as never, { offset, duration: 1.4 });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' });
    else (el as HTMLElement | null)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export function lockScroll(lock: boolean) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}

function initLenis() {
  if (!motionEnabled() || root.dataset.smooth !== 'on') return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -80 }, autoRaf: false });
  root.classList.add('has-lenis');
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Reveals ───────────────────────────────────────────────────────────── */
const ST = (el: Element, start = 'top 86%') => ({ trigger: el, start, once: true });

function reveal(el: HTMLElement) {
  const type = el.dataset.reveal!;
  const lvl = levelFor(el);
  const delay = parseFloat(el.dataset.delay || '0');
  if (lvl === 'none') {
    gsap.set(el, { autoAlpha: 1 });
    return;
  }
  const f = FACTORS[lvl];
  const trigger = el.dataset.trigger ? document.querySelector(el.dataset.trigger) ?? el : el;
  const immediate = el.hasAttribute('data-immediate');
  const st = immediate ? undefined : ST(trigger);
  gsap.set(el, { visibility: 'visible' });

  switch (type) {
    case 'lines':
    case 'words':
    case 'chars': {
      SplitText.create(el, {
        type: type === 'lines' ? 'lines' : type === 'words' ? 'words,lines' : 'chars,words,lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: type === 'chars' ? 110 : 115,
            rotate: type === 'words' ? 4 * f.dist : 0,
            duration: (type === 'chars' ? DUR.l : DUR.l) * f.dur,
            ease: EASE.out,
            stagger: type === 'lines' ? 0.09 : type === 'words' ? 0.035 : 0.018,
            delay,
            scrollTrigger: st,
          });
        },
      });
      break;
    }
    case 'fade':
      gsap.from(el, { y: 28 * f.dist, autoAlpha: 0, duration: DUR.m * f.dur, ease: EASE.soft, delay, scrollTrigger: st });
      break;
    case 'scale':
      gsap.from(el, { scale: 0.94, autoAlpha: 0, duration: DUR.l * f.dur, ease: EASE.out, delay, scrollTrigger: st });
      break;
    case 'rule':
      gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: DUR.xl * f.dur, ease: EASE.precise, delay, scrollTrigger: st });
      break;
    case 'clip-x':
      gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: DUR.l * f.dur, ease: EASE.precise, delay, scrollTrigger: st });
      break;
    case 'mask': {
      const inner = el.querySelector('img, video, canvas, .media__inner');
      const tl = gsap.timeline({ scrollTrigger: st, delay });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.l * f.dur, ease: EASE.precise });
      if (inner) tl.from(inner, { scale: 1 + 0.25 * f.dist, duration: DUR.xl * f.dur, ease: EASE.out }, 0);
      break;
    }
    case 'stagger': {
      const kids = Array.from(el.children);
      gsap.from(kids, { y: 36 * f.dist, autoAlpha: 0, duration: DUR.m * f.dur, ease: EASE.soft, stagger: 0.07, delay, scrollTrigger: st });
      break;
    }
    default:
      gsap.set(el, { autoAlpha: 1 });
  }
}

/* ── Parallax ──────────────────────────────────────────────────────────── */
function parallax(el: HTMLElement) {
  if (levelFor(el) === 'none') return;
  const amount = parseFloat(el.dataset.parallax || '0.1');
  gsap.fromTo(
    el,
    { yPercent: -amount * 50 },
    { yPercent: amount * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}

/* ── Counters ──────────────────────────────────────────────────────────── */
export function formatNumber(v: number, decimals: number, locale = document.documentElement.lang || 'pt-BR') {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}

function counter(el: HTMLElement) {
  const value = parseFloat(el.dataset.value || '0');
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const out = el.querySelector<HTMLElement>('[data-counter-value]') ?? el;
  if (levelFor(el) === 'none') return;
  const obj = { v: 0 };
  out.textContent = formatNumber(0, decimals);
  gsap.to(obj, {
    v: value,
    duration: 2.2,
    ease: 'power2.out',
    scrollTrigger: ST(el, 'top 90%'),
    onUpdate: () => (out.textContent = formatNumber(obj.v, decimals)),
  });
}

/* ── Magnetic ──────────────────────────────────────────────────────────── */
function magnetic(el: HTMLElement) {
  if (!isFinePointer() || levelFor(el) === 'none' || root.dataset.magnetic !== 'on') return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
    yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
  });
  el.addEventListener('pointerleave', () => {
    xTo(0);
    yTo(0);
  });
}

/* ── Boot ──────────────────────────────────────────────────────────────── */
let booted = false;
export function initMotion() {
  if (booted) return;
  booted = true;
  initLenis();

  const run = () => {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(magnetic);
    if (!motionEnabled()) {
      root.classList.add('motion-ready');
      return;
    }
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal);
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(parallax);
    document.querySelectorAll<HTMLElement>('[data-counter]').forEach(counter);
    root.classList.add('motion-ready');
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  // Wait for fonts so line splitting is measured with final metrics.
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(run);

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) ScrollTrigger.refresh();
  });
}

/** Fire `cb` once when `el` approaches the viewport. */
export function whenNear(el: Element, cb: () => void, rootMargin = '300px') {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
}

/** Track visibility (to pause render loops off-screen). */
export function onVisibility(el: Element, cb: (visible: boolean) => void) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => cb(e.isIntersecting)), { rootMargin: '100px' });
  io.observe(el);
  return () => io.disconnect();
}
