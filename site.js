(function () {
  var root = document.documentElement;
  var phone = document.getElementById('phone');
  var themeButton = document.querySelector('.theme');

  function theme() {
    return root.dataset.theme === 'dark' ? 'escuro' : 'claro';
  }

  // Prints do app no tema da página.
  function paint() {
    document.querySelectorAll('img[data-shot]').forEach(function (img) {
      img.src = 'img/' + img.dataset.shot + '-' + theme() + '.webp';
    });
    if (themeButton) {
      themeButton.querySelector('span').textContent = theme() === 'escuro' ? 'Claro' : 'Escuro';
      themeButton.setAttribute('aria-label', theme() === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme() === 'escuro' ? '#1a100d' : '#f5eee7');
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('niru-tema', next);
      paint();
    });
  }

  // No celular, cada passo leva o próprio print.
  if (phone) {
    document.querySelectorAll('.step').forEach(function (step) {
      var slot = step.querySelector('.shot');
      if (!slot) return;
      var copy = phone.cloneNode(true);
      copy.removeAttribute('id');
      copy.setAttribute('aria-hidden', 'true');
      if (step.dataset.shot === 'descanso') copy.classList.add('rest');
      copy.querySelectorAll('img').forEach(function (img) {
        if (img.dataset.shot === step.dataset.shot) {
          img.className = 'on';
          img.loading = 'lazy';
          img.alt = 'Tela ' + step.querySelector('h3').textContent.trim() + ' do Niru';
        } else {
          img.remove();
        }
      });
      slot.appendChild(copy);
    });
  }

  paint();

  // Os anéis da semana se desenham uma vez, ao abrir.
  var week = document.querySelector('.week');
  if (week) requestAnimationFrame(function () { requestAnimationFrame(function () { week.classList.add('on'); }); });

  // O celular acompanha o passo que está no meio da tela.
  var current = 'hoje';
  function show(name) {
    if (!phone || name === current) return;
    current = name;
    phone.classList.toggle('rest', name === 'descanso');
    phone.querySelectorAll('.screen img').forEach(function (img) {
      var on = img.dataset.shot === name;
      img.classList.remove('morph');
      if (on && name === 'descanso') {
        void img.offsetWidth; // recomeça a animação
        img.classList.add('morph');
      }
      img.classList.toggle('on', on);
    });
  }

  var steps = document.querySelectorAll('.step');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        steps.forEach(function (s) { s.classList.toggle('on', s === e.target); });
        show(e.target.dataset.shot);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }
})();
