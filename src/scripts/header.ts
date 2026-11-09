import { gsap, EASE, lockScroll, motionEnabled, scrollToTarget } from './motion/core';

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const menu = document.querySelector<HTMLElement>('[data-menu]')!;
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const progress = header.querySelector<HTMLElement>('[data-progress]');
  const sindex = document.querySelector<HTMLElement>('[data-sindex]');

  /* ── Scroll state: compact, hide on scroll down, theme under header ── */
  let lastY = window.scrollY;
  let ticking = false;
  const sections = () => Array.from(document.querySelectorAll<HTMLElement>('main > section, main > .section, footer'));
  let secs = sections();
  const themeAt = (y: number) => {
    for (const s of secs) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) return s.dataset.theme ?? (s.tagName === 'FOOTER' ? 'dark' : 'light');
    }
    return 'light';
  };
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    header.classList.toggle('is-hidden', y > 480 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove('is-hidden');
    lastY = y;
    const t = themeAt(40);
    header.classList.toggle('is-dark', t === 'dark' || t === 'accent');
    if (sindex) {
      const st = themeAt(window.innerHeight / 2);
      sindex.classList.toggle('is-dark', st === 'dark' || st === 'accent');
      sindex.classList.toggle('is-hidden', y < window.innerHeight * 0.6);
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', () => { secs = sections(); update(); });
  update();

  /* ── Desktop nav hover pill ── */
  const list = header.querySelector<HTMLElement>('[data-nav-list]');
  const pill = header.querySelector<HTMLElement>('[data-nav-pill]');
  if (list && pill) {
    list.querySelectorAll<HTMLElement>('a').forEach((a) => {
      a.addEventListener('pointerenter', () => {
        pill.style.width = `${a.offsetWidth}px`;
        pill.style.transform = `translateX(${a.offsetLeft}px)`;
        pill.style.opacity = '1';
      });
    });
    list.addEventListener('pointerleave', () => (pill.style.opacity = '0'));
  }

  /* ── Menu ── */
  const bg = menu.querySelector<HTMLElement>('[data-menu-bg]')!;
  const items = menu.querySelectorAll<HTMLElement>('[data-menu-item] .menu__link');
  const fades = menu.querySelectorAll<HTMLElement>('[data-menu-fade]');
  let open = false;
  let tl: gsap.core.Timeline | null = null;

  const setOpen = (next: boolean, focusBack = true) => {
    if (open === next) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    lockScroll(open);
    tl?.kill();
    if (open) {
      menu.inert = false;
      menu.classList.add('is-open');
      if (motionEnabled()) {
        tl = gsap.timeline();
        tl.fromTo(bg, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: EASE.precise })
          .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.out, stagger: 0.05 }, 0.35)
          .fromTo(fades, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.soft, stagger: 0.06 }, 0.5);
      } else {
        gsap.set(bg, { clipPath: 'inset(0 0 0% 0)' });
      }
      setTimeout(() => items[0]?.focus({ preventScroll: true }), 50);
    } else {
      const done = () => {
        menu.classList.remove('is-open');
        menu.inert = true;
      };
      if (motionEnabled()) {
        tl = gsap.timeline({ onComplete: done });
        tl.to([...fades], { autoAlpha: 0, duration: 0.25 }).to(items, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.02 }, 0).to(bg, { clipPath: 'inset(0% 0 0 0)', duration: 0.01 }, 0.35).to(bg, { clipPath: 'inset(0% 0 100% 0)', duration: 0.7, ease: EASE.precise }, 0.36);
        // close by shrinking upwards
        tl.add(() => undefined);
      } else done();
      if (focusBack) toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      // focus trap across header toggle + menu links
      const f = [toggle, ...menu.querySelectorAll<HTMLElement>('a, button')].filter((el) => el.offsetParent !== null || el === toggle);
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  menu.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        setOpen(false, false);
        setTimeout(() => scrollToTarget(href), 450);
      } else {
        setOpen(false, false);
      }
    });
  });

  /* ── Section index active state ── */
  if (sindex) {
    const links = new Map<string, HTMLElement>();
    sindex.querySelectorAll<HTMLElement>('[data-sindex-link]').forEach((l) => links.set(l.dataset.sindexLink!, l));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => l.classList.remove('is-active'));
            links.get(en.target.id)?.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
}
