const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 70), { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
let counted = false;
const countObserver = new IntersectionObserver((entries) => {
  if (counted || !entries.some(e => e.isIntersecting)) return;
  counted = true;
  counters.forEach(el => {
    const target = Number(el.dataset.count || 0);
    const duration = 900;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.35 });
const stats = document.querySelector('.stats-card');
if (stats) countObserver.observe(stats);

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const service = data.get('service') || '';
  const message = data.get('message') || '';
  const text = `Hallo Freiraum Franken, ich möchte eine Anfrage stellen.\n\nName: ${name}\nTelefon: ${phone}\nLeistung: ${service}\nNachricht: ${message}`;
  const url = `https://wa.me/49491793974634?text=${encodeURIComponent(text)}`;
  formNote.textContent = 'WhatsApp wird geöffnet …';
  window.open(url, '_blank', 'noopener');
});
