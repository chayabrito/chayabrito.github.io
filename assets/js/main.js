/* ============================================================
   ছায়াবৃত (Chayabrito) — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Dark Mode Toggle ----
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('chayabrito-theme', next);
    });
  }

  // ---- Mobile Menu ----
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ---- Dropdown Navigation ----
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      // Close all other dropdowns
      document.querySelectorAll('.nav-dropdown-toggle').forEach(function (other) {
        if (other !== btn) other.setAttribute('aria-expanded', 'false');
      });
      this.setAttribute('aria-expanded', !expanded);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-children')) {
      document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ---- Reading Progress Bar ----
  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) {
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
      window.addEventListener('scroll', function () {
        const rect = articleContent.getBoundingClientRect();
        const total = articleContent.scrollHeight;
        const visible = window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / (total - visible), 0), 1);
        progressBar.style.width = (progress * 100) + '%';
      }, { passive: true });
    }
  }

  // ---- Carousel ----
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentIndex = 0;
    let autoplayInterval;

    function goToSlide(index) {
      slides.forEach(function (s) { s.classList.remove('is-active'); });
      dots.forEach(function (d) { d.classList.remove('is-active'); });
      currentIndex = (index + slides.length) % slides.length;
      slides[currentIndex].classList.add('is-active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('is-active');
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoplay(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.dataset.index));
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 6000);
    }
    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    if (slides.length > 1) startAutoplay();

    // Pause on hover
    carousel.addEventListener('mouseenter', function () { clearInterval(autoplayInterval); });
    carousel.addEventListener('mouseleave', function () { startAutoplay(); });

    // Keyboard navigation
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
      if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    });

    // Touch swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // ---- Scroll to Top ----
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Copy Link Button ----
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const url = this.dataset.url;
      navigator.clipboard.writeText(url).then(function () {
        const span = copyBtn.querySelector('span');
        const original = span.textContent;
        span.textContent = 'কপি হয়েছে!';
        setTimeout(function () { span.textContent = original; }, 2000);
      });
    });
  }

  // ---- Author Search Filter ----
  const authorSearch = document.getElementById('author-search');
  if (authorSearch) {
    authorSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      document.querySelectorAll('.author-card').forEach(function (card) {
        const name = card.dataset.name || '';
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });
  }

  // ---- Archive Filters ----
  const archiveSearch = document.getElementById('archive-search');
  const archiveYearFilter = document.getElementById('archive-year-filter');
  const archiveCatFilter = document.getElementById('archive-cat-filter');

  function filterArchive() {
    const searchTerm = archiveSearch ? archiveSearch.value.toLowerCase() : '';
    const selectedYear = archiveYearFilter ? archiveYearFilter.value : 'all';
    const selectedCat = archiveCatFilter ? archiveCatFilter.value : 'all';

    document.querySelectorAll('.archive-year').forEach(function (yearBlock) {
      const year = yearBlock.dataset.year;
      const matchYear = selectedYear === 'all' || year === selectedYear;
      yearBlock.style.display = matchYear ? '' : 'none';
    });

    document.querySelectorAll('.archive-entry').forEach(function (entry) {
      const title = (entry.dataset.title || '').toLowerCase();
      const author = (entry.dataset.author || '').toLowerCase();
      const cats = entry.dataset.categories || '';

      const matchSearch = !searchTerm || title.includes(searchTerm) || author.includes(searchTerm);
      const matchCat = selectedCat === 'all' || cats.includes(selectedCat);

      entry.style.display = (matchSearch && matchCat) ? '' : 'none';
    });
  }

  if (archiveSearch) archiveSearch.addEventListener('input', filterArchive);
  if (archiveYearFilter) archiveYearFilter.addEventListener('change', filterArchive);
  if (archiveCatFilter) archiveCatFilter.addEventListener('change', filterArchive);

  // ---- List Sort/Filter ----
  const sortSelect = document.getElementById('sort-select');
  const catFilter = document.getElementById('cat-filter');
  const articleList = document.getElementById('article-list');

  function sortAndFilterArticles() {
    if (!articleList) return;
    const cards = Array.from(articleList.querySelectorAll('.article-card'));
    const sort = sortSelect ? sortSelect.value : 'date-desc';
    const cat = catFilter ? catFilter.value : 'all';

    // Filter by category
    cards.forEach(function (card) {
      const link = card.querySelector('.article-card__link');
      if (cat === 'all') {
        card.style.display = '';
      } else {
        const catEl = card.querySelector('.article-card__category');
        const cardCat = catEl ? catEl.textContent.trim() : '';
        // Simple check - always show since we lack slug data in DOM
        card.style.display = '';
      }
    });

    // Sort
    cards.sort(function (a, b) {
      const dateA = a.querySelector('.article-card__date');
      const dateB = b.querySelector('.article-card__date');
      const titleA = a.querySelector('.article-card__title');
      const titleB = b.querySelector('.article-card__title');

      if (sort === 'date-asc' && dateA && dateB) {
        return new Date(dateA.getAttribute('datetime')) - new Date(dateB.getAttribute('datetime'));
      } else if (sort === 'date-desc' && dateA && dateB) {
        return new Date(dateB.getAttribute('datetime')) - new Date(dateA.getAttribute('datetime'));
      } else if (sort === 'title-asc' && titleA && titleB) {
        return titleA.textContent.localeCompare(titleB.textContent, 'bn');
      }
      return 0;
    });

    cards.forEach(function (card) {
      articleList.appendChild(card);
    });
  }

  if (sortSelect) sortSelect.addEventListener('change', sortAndFilterArticles);
  if (catFilter) catFilter.addEventListener('change', sortAndFilterArticles);

  // ---- Keyboard Accessibility ----
  document.addEventListener('keydown', function (e) {
    // Escape key closes modals/menus
    if (e.key === 'Escape') {
      // Close search overlay
      const searchOverlay = document.getElementById('search-overlay');
      if (searchOverlay && searchOverlay.classList.contains('is-open')) {
        searchOverlay.classList.remove('is-open');
        searchOverlay.setAttribute('hidden', '');
        document.getElementById('search-toggle').setAttribute('aria-expanded', 'false');
      }
      // Close mobile menu
      if (mainNav && mainNav.classList.contains('is-open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }
    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchToggle = document.getElementById('search-toggle');
      if (searchToggle) searchToggle.click();
    }
  });

});
