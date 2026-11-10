(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.manifesto, .section-top, .cards article, .deck-heading, .sticker-intro, .sticker-workspace, .arcade-copy, .game-shell, .soundtrack-heading, .soundtrack iframe, .outro');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    targets.forEach((target, i) => { target.classList.add('motion-reveal'); target.style.setProperty('--reveal-delay', `${Math.min(i % 3, 2) * 75}ms`); observer.observe(target); });
    reduce.addEventListener('change', event => { if (event.matches) { targets.forEach(target => target.classList.add('is-revealed')); observer.disconnect(); } });
  }
})();
