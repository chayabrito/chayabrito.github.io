/* ============================================================
   ছায়াবৃত (Chayabrito) — Search with Fuse.js
   ============================================================ */

(function () {
  'use strict';

  var searchIndex = null;
  var fuse = null;
  var searchLoaded = false;

  // Elements
  var searchToggle = document.getElementById('search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchClose = document.getElementById('search-close');
  var searchPageInput = document.getElementById('search-page-input');
  var searchPageResults = document.getElementById('search-page-results');

  // Load search index
  function loadSearchIndex(callback) {
    if (searchLoaded) { callback(); return; }

    var baseURL = (window.PATANGA && window.PATANGA.baseURL) || '/';
    var indexURL = baseURL + 'search-index.json';

    fetch(indexURL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchIndex = data;
        fuse = new Fuse(searchIndex, {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'excerpt', weight: 0.3 },
            { name: 'content', weight: 0.2 },
            { name: 'categories', weight: 0.05 },
            { name: 'tags', weight: 0.05 }
          ],
          threshold: 0.35,
          distance: 200,
          includeMatches: true,
          minMatchCharLength: 2
        });
        searchLoaded = true;
        callback();
      })
      .catch(function (err) {
        console.error('Search index load failed:', err);
      });
  }

  // Render results
  function renderResults(results, container) {
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<p class="search-no-results">কোনো ফলাফল পাওয়া যায়নি।</p>';
      return;
    }

    var html = '';
    results.slice(0, 12).forEach(function (result) {
      var item = result.item;
      var excerpt = item.excerpt || (item.content ? item.content.substring(0, 150) + '...' : '');

      // Highlight matches
      if (result.matches) {
        result.matches.forEach(function (match) {
          if (match.key === 'title') {
            // We'll skip highlighting in title to keep it clean
          }
        });
      }

      html += '<a href="' + item.url + '" class="search-result-item">';
      html += '<div class="search-result-item__title">' + escapeHtml(item.title) + '</div>';
      html += '<div class="search-result-item__excerpt">' + escapeHtml(excerpt) + '</div>';
      html += '</a>';
    });

    container.innerHTML = html;
  }

  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Search handler
  function doSearch(query, container) {
    if (!fuse || !query || query.length < 2) {
      if (container) container.innerHTML = '';
      return;
    }
    var results = fuse.search(query);
    renderResults(results, container);
  }

  // Header search overlay
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        searchOverlay.classList.remove('is-open');
        searchOverlay.setAttribute('hidden', '');
        this.setAttribute('aria-expanded', 'false');
      } else {
        searchOverlay.removeAttribute('hidden');
        // Small delay for CSS transition
        requestAnimationFrame(function () {
          searchOverlay.classList.add('is-open');
        });
        this.setAttribute('aria-expanded', 'true');
        loadSearchIndex(function () {
          if (searchInput) searchInput.focus();
        });
      }
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', function () {
      searchOverlay.classList.remove('is-open');
      searchOverlay.setAttribute('hidden', '');
      searchToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Close on overlay background click
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('is-open');
        searchOverlay.setAttribute('hidden', '');
        searchToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header search input
  if (searchInput) {
    var headerSearchTimeout;
    searchInput.addEventListener('input', function () {
      var query = this.value.trim();
      clearTimeout(headerSearchTimeout);
      headerSearchTimeout = setTimeout(function () {
        doSearch(query, searchResults);
      }, 200);
    });
  }

  // Dedicated search page
  if (searchPageInput) {
    loadSearchIndex(function () {
      // Check URL params for query
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        searchPageInput.value = q;
        doSearch(q, searchPageResults);
      }
    });

    var pageSearchTimeout;
    searchPageInput.addEventListener('input', function () {
      var query = this.value.trim();
      clearTimeout(pageSearchTimeout);
      pageSearchTimeout = setTimeout(function () {
        doSearch(query, searchPageResults);
        // Update URL
        var url = new URL(window.location);
        if (query) {
          url.searchParams.set('q', query);
        } else {
          url.searchParams.delete('q');
        }
        history.replaceState(null, '', url);
      }, 250);
    });
  }

})();
