const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('site-theme');
  } catch (error) {
    console.error('Unable to read the saved theme preference.', error);
  }
  const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

  document.documentElement.dataset.theme = initialTheme;
  themeToggle.setAttribute('aria-pressed', String(initialTheme === 'light'));
  themeToggle.textContent = initialTheme === 'light' ? 'Use dark theme' : 'Use light theme';

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
    themeToggle.textContent = nextTheme === 'light' ? 'Use dark theme' : 'Use light theme';
    try {
      localStorage.setItem('site-theme', nextTheme);
    } catch (error) {
      console.error('Unable to save the theme preference.', error);
    }
  });
}

if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (navLinks.classList.contains('open') && event.target instanceof Node
      && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });
}

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll('.hero-copy, .profile-frame, .section-heading, .highlight-card, .page-intro, .about-grid, .activity-section, .project-card');
  revealItems.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
  });
  document.documentElement.classList.add('has-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((element) => revealObserver.observe(element));
}
