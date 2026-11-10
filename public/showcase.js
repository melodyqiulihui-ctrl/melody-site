(() => {
  const showcase = document.querySelector('.showcase');
  const buttons = [...showcase.querySelectorAll('[data-slide]')];
  const panels = [...showcase.querySelectorAll('[data-panel]')];
  const menuButton = document.querySelector('.showcase-menu-button');
  const menu = document.querySelector('#showcase-menu');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let manuallySelected = false;

  function show(index) {
    current = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
      panel.querySelectorAll('a').forEach(link => link.tabIndex = active ? 0 : -1);
    });
  }
  function stop() {
    clearInterval(timer);
    timer = undefined;
  }
  function start() {
    stop();
    if (!reducedMotion.matches && !manuallySelected && !document.hidden && !menuButton.matches('[aria-expanded="true"]')) {
      timer = setInterval(() => show((current + 1) % panels.length), 6500);
    }
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    manuallySelected = true;
    stop();
    show(index);
  }));
  menuButton.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'CLOSE' : 'MENU';
    if (open) stop(); else start();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = 'MENU';
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = 'MENU';
      menuButton.focus();
      start();
    }
  });
  showcase.querySelectorAll('[data-showcase-mode]').forEach(link => {
    link.addEventListener('click', () => document.querySelector('[data-mode="' + link.dataset.showcaseMode + '"]').click());
  });
  showcase.addEventListener('pointerenter', stop);
  showcase.addEventListener('pointerleave', start);
  showcase.addEventListener('focusin', stop);
  showcase.addEventListener('focusout', event => {
    if (!showcase.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  show(0);
  start();
})();
