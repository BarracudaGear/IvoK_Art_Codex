const header = document.querySelector('.site-header');
const hamburger = document.querySelector('.hamburger');
const body = document.body;

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

const cursor = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  ringX: window.innerWidth / 2,
  ringY: window.innerHeight / 2,
  lerpFactor: 0.12,
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 60);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = body.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX;
  cursor.y = event.clientY;

  if (dot) {
    dot.style.transform = `translate(${cursor.x - 4}px, ${cursor.y - 4}px)`;
  }
});

const animateCursor = () => {
  cursor.ringX += (cursor.x - cursor.ringX) * cursor.lerpFactor;
  cursor.ringY += (cursor.y - cursor.ringY) * cursor.lerpFactor;

  if (ring) {
    ring.style.transform = `translate(${cursor.ringX - 18}px, ${cursor.ringY - 18}px)`;
  }

  requestAnimationFrame(animateCursor);
};

requestAnimationFrame(animateCursor);

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxMeta = document.getElementById('lightbox-meta');
const lightboxClose = document.querySelector('.lightbox-close');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function openLightbox(element) {
  if (!lightbox || !element) return;

  const title = element.dataset.title || 'Untitled Work';
  const year = element.dataset.year || '';
  const medium = element.dataset.medium || '';

  lightboxTitle.textContent = title;
  lightboxMeta.textContent = `${year} · ${medium}`;

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

window.openLightbox = openLightbox;
