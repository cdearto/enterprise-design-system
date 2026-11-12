/* Component doc page — example panel + nav controls */
(function() {
  /* ─── Inject shared SVG sprite (used by header icons, example icons) ─── */
  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="i-plus" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></symbol>' +
    '<symbol id="i-chevron-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></symbol>' +
    '<symbol id="i-chevron-right" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></symbol>' +
    '<symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-arrow-up" viewBox="0 0 24 24"><polyline points="5 12 12 5 19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" fill="none"/></symbol>' +
    '<symbol id="i-folder" viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-dollar" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-package" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-upload" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-grip" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="15" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="18" r="1.2" fill="currentColor"/><circle cx="15" cy="18" r="1.2" fill="currentColor"/></symbol>' +
    '<symbol id="i-close" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-sparkles" viewBox="0 0 24 24"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></symbol>' +
    '<symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" fill="none"/></symbol>' +
    '<symbol id="i-expand" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="9 21 3 21 3 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="21" y1="3" x2="14" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="21" x2="10" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>' +
    '</svg>';
  if (!document.getElementById('docs-sprite')) {
    var spriteHost = document.createElement('div');
    spriteHost.id = 'docs-sprite';
    spriteHost.innerHTML = SPRITE;
    document.body.insertBefore(spriteHost, document.body.firstChild);
  }

  /* ─── Inject the product masthead at the top of every component page so
       the docs site reads as part of the same product as the marketing
       home. The home page (/design-system/) renders its own masthead
       inline; this injection guards against double-inserts by checking
       for an existing #eds-masthead. */
  if (!document.getElementById('eds-masthead') && document.querySelector('.canvas')) {
    var mastheadStyle = document.createElement('style');
    mastheadStyle.id = 'eds-masthead-styles';
    mastheadStyle.textContent =
      '.eds-masthead { position: sticky; top: 0; z-index: 60; background: color-mix(in oklch, var(--body-bg) 90%, transparent); backdrop-filter: saturate(140%) blur(12px); -webkit-backdrop-filter: saturate(140%) blur(12px); border-bottom: 1px solid oklch(24% 0.073 260 / 0.10); }' +
      '.eds-masthead-inner { display: flex; align-items: center; gap: 24px; padding: 10px 22px; }' +
      '.eds-logo { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; color: var(--text-primary); }' +
      '.eds-logo:hover { color: var(--btn-primary); text-decoration: none; }' +
      '.eds-logomark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: var(--text-primary); color: oklch(100% 0 0); font-size: 9px; font-weight: 800; letter-spacing: 0.06em; border-radius: 5px; }' +
      '.eds-logotype { font-size: 12.5px; font-weight: 700; letter-spacing: -0.005em; }' +
      '.eds-nav { display: flex; gap: 18px; }' +
      '.eds-nav a { font-size: 12px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: color 0.12s; }' +
      '.eds-nav a:hover { color: var(--btn-primary); }' +
      '.eds-nav a.active { color: var(--btn-primary); font-weight: 600; }' +
      '.eds-mast-spacer { flex: 1; }' +
      '.eds-version { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; color: var(--text-help); padding: 3px 8px; background: var(--surface-soft); border: 1px solid oklch(24% 0.073 260 / 0.10); border-radius: 999px; }' +
      '.eds-portfolio-link { font-size: 12px; font-weight: 600; color: var(--text-primary); text-decoration: none; display: inline-flex; align-items: baseline; gap: 4px; }' +
      '.eds-portfolio-link:hover { color: var(--btn-primary); }' +
      '.eds-portfolio-link .arr { font-size: 10px; color: var(--text-help); }' +
      /* Pull the .canvas down by the masthead height so the sticky
         sidebar starts below it instead of being covered. ~46px. */
      '.canvas.with-example-panel, .canvas.with-left-nav { height: calc(100vh - 46px); }' +
      '.canvas.with-example-panel > .content, .canvas.with-left-nav > .content { height: calc(100vh - 46px); }' +
      '.left-sidebar { height: calc(100vh - 46px); top: 46px; }' +
      '@media (max-width: 720px) { .eds-nav { display: none; } .eds-masthead-inner { padding: 8px 12px; gap: 10px; } .eds-logotype { display: none; } .eds-version { display: none; } .eds-portfolio-link { font-size: 11.5px; } }';
    document.head.appendChild(mastheadStyle);

    var activeId = (document.getElementById('left-sidebar') &&
      document.getElementById('left-sidebar').getAttribute('data-active')) || '';
    function navLinkClass(ids) {
      return ids.indexOf(activeId) !== -1 ? ' class="active"' : '';
    }
    var hrefBase = document.body.getAttribute('data-href-base') || '';
    var here = hrefBase || './';
    var masthead = document.createElement('header');
    masthead.className = 'eds-masthead';
    masthead.id = 'eds-masthead';
    masthead.innerHTML =
      '<div class="eds-masthead-inner">' +
        '<a class="eds-logo" href="../index.html">' +
          '<span class="eds-logomark">EDS</span>' +
          '<span class="eds-logotype">Enterprise Design System</span>' +
        '</a>' +
        '<nav class="eds-nav">' +
          '<a href="' + here + 'foundations.html"' + navLinkClass(['foundations']) + '>Foundations</a>' +
          '<a href="' + here + 'buttons.html"' + navLinkClass(['buttons','badges','cards','tables','forms','tabs','breadcrumbs','headers','dropdowns','toasts']) + '>Components</a>' +
          '<a href="' + here + 'wizard.html"' + navLinkClass(['wizard','inbox','upload']) + '>Compositions</a>' +
          '<a href="' + here + 'standards.html"' + navLinkClass(['standards']) + '>Standards</a>' +
        '</nav>' +
        '<div class="eds-mast-spacer"></div>' +
        '<span class="eds-version">v2026.05</span>' +
        '<a class="eds-portfolio-link" href="https://doselos.com" title="Back to portfolio">Portfolio <span class="arr">↗</span></a>' +
      '</div>';
    document.body.insertBefore(masthead, document.body.firstChild);
  }

  /* ─── Collapsible sidebar styles (injected so docs.css stays clean) ─── */
  if (!document.getElementById('docs-collapse-styles')) {
    var style = document.createElement('style');
    style.id = 'docs-collapse-styles';
    style.textContent =
      '.left-sidebar { transition: width 0.18s ease; }' +
      '.left-sidebar.collapsed { width: 44px; }' +
      '.left-sidebar.collapsed .sidebar-search,' +
      '.left-sidebar.collapsed .sidebar-nav,' +
      '.left-sidebar.collapsed .sidebar-footer,' +
      '.left-sidebar.collapsed .sidebar-logo-text { display: none; }' +
      '.left-sidebar.collapsed .sidebar-logo { padding: 12px 6px; justify-content: center; border-bottom: 0; }' +
      '.sidebar-logo { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }' +
      '.sidebar-logo-text { flex: 1; min-width: 0; }' +
      '.sidebar-toggle { background: transparent; border: 0; cursor: pointer; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; color: var(--text-help); border-radius: 4px; padding: 0; flex-shrink: 0; }' +
      '.sidebar-toggle:hover { background: var(--row-hover); color: var(--text-primary); }' +
      '.sidebar-toggle svg { width: 14px; height: 14px; transition: transform 0.18s ease; }' +
      '.left-sidebar.collapsed .sidebar-toggle svg { transform: rotate(180deg); }';
    document.head.appendChild(style);
  }

  /* ─── Inject shared sidebar nav ─── */
  /* Three groups, matching the masthead: the reading pages, the ten
     components, the three compositions. The finer taxonomy (Actions, Data
     display, Forms, Navigation, Feedback) lives on each page's eyebrow; as
     nine accordion groups it was more chrome than content. The order here
     is also the reading order — the Previous / Next pager at the foot of
     every page walks this list. */
  var NAV_GROUPS = [
    { label: 'Start here', items: [
      { id: 'introduction', title: 'Introduction', href: './introduction.html' },
      { id: 'foundations', title: 'Foundations', href: './foundations.html' },
      { id: 'standards', title: 'Standards', href: './standards.html' },
    ]},
    { label: 'Components', items: [
      { id: 'buttons', title: 'Button', href: './buttons.html' },
      { id: 'badges', title: 'Badge & status pill', href: './badges.html' },
      { id: 'cards', title: 'Card', href: './cards.html' },
      { id: 'tables', title: 'Table', href: './tables.html' },
      { id: 'forms', title: 'Form elements', href: './forms.html' },
      { id: 'tabs', title: 'Tabs', href: './tabs.html' },
      { id: 'breadcrumbs', title: 'Breadcrumbs', href: './breadcrumbs.html' },
      { id: 'headers', title: 'Page header', href: './headers.html' },
      { id: 'dropdowns', title: 'Dropdown', href: './dropdowns.html' },
      { id: 'toasts', title: 'Toast', href: './toasts.html' },
    ]},
    { label: 'Compositions', items: [
      { id: 'wizard', title: 'Wizard system', href: './wizard.html' },
      { id: 'inbox', title: 'Inbox', href: './inbox.html' },
      { id: 'upload', title: 'Upload wizard', href: './upload.html' },
    ]},
  ];
  /* Base href — pages outside components/ (like top-level design-system.html)
     set <body data-href-base="./components/"> so nav links resolve correctly. */
  var HREF_BASE = document.body.getAttribute('data-href-base') || '';
  function rebase(href) {
    if (!HREF_BASE) return href;
    return href.replace(/^\.\//, HREF_BASE);
  }
  /* ─── Accordion state persistence (per-group, across pages) ─── */
  var ACCORDION_KEY = 'eds.nav.accordion.v1';
  function groupSlug(label) { return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function readAccordionState() {
    try { return JSON.parse(localStorage.getItem(ACCORDION_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeAccordionState(state) {
    try { localStorage.setItem(ACCORDION_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function buildSidebar(active) {
    var stored = readAccordionState();
    /* The group containing the active page is always shown open — users
       shouldn't have to expand to see where they currently are. */
    var activeGroupSlug = null;
    NAV_GROUPS.forEach(function(g) {
      if (g.items.some(function(it) { return it.id === active; })) activeGroupSlug = groupSlug(g.label);
    });
    var html = '';
    html += '<div class="sidebar-logo">';
    html +=   '<div class="sidebar-logo-text">';
    html +=     '<div class="title"><a href="' + rebase('./introduction.html') + '" style="color:inherit;text-decoration:none">Enterprise Design System</a></div>';
    html +=     '<div class="sub">by Carlos deArtola</div>';
    html +=   '</div>';
    html +=   '<button class="sidebar-toggle" id="sidebar-collapse-toggle" aria-label="Collapse navigation" title="Collapse navigation"><svg><use href="#i-chevron-right"/></svg></button>';
    html += '</div>';
    html += '<div class="sidebar-search"><div class="sidebar-search-input">';
    html +=   '<svg><use href="#i-search"/></svg>';
    html +=   '<input id="nav-search" type="search" placeholder="Search components…" autocomplete="off" spellcheck="false">';
    html += '</div></div>';
    html += '<div class="sidebar-nav">';
    NAV_GROUPS.forEach(function(g) {
      var slug = groupSlug(g.label);
      var isCollapsed = stored[slug] === 'collapsed' && slug !== activeGroupSlug;
      var bodyCls = isCollapsed ? 'sidebar-group-body collapsed' : 'sidebar-group-body';
      var expanded = isCollapsed ? 'false' : 'true';
      html += '<button class="sidebar-group-label" data-group-slug="' + slug + '" aria-expanded="' + expanded + '" onclick="toggleSidebarGroup(this)"><span>' + g.label + '</span><svg class="nav-chevron"><use href="#i-chevron-down"/></svg></button>';
      html += '<div class="' + bodyCls + '">';
      g.items.forEach(function(it) {
        var cls = (it.id === active) ? ' class="active"' : '';
        html += '<a href="' + rebase(it.href) + '"' + cls + '>' + it.title + '</a>';
      });
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="sidebar-footer">v2026.05 · Enterprise DS</div>';
    return html;
  }
  var sidebar = document.getElementById('left-sidebar');
  if (sidebar && !sidebar.children.length) {
    var active = sidebar.getAttribute('data-active') || '';
    sidebar.innerHTML = buildSidebar(active);
  }

  /* ─── Sidebar collapse toggle (persisted) ─── */
  var COLLAPSE_KEY = 'eds.nav.collapsed.v1';
  function applySidebarCollapsed(el, collapsed) {
    if (!el) return;
    el.classList.toggle('collapsed', !!collapsed);
    var toggleBtn = el.querySelector('#sidebar-collapse-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
      toggleBtn.setAttribute('title', collapsed ? 'Expand navigation' : 'Collapse navigation');
    }
  }
  if (sidebar) {
    var startCollapsed = false;
    try {
      var stored = localStorage.getItem(COLLAPSE_KEY);
      if (stored === '1') startCollapsed = true;
      // No stored preference + narrow viewport → start collapsed so
      // phone visitors see the content, not a full-screen sidebar.
      else if (stored === null && window.matchMedia('(max-width: 768px)').matches) {
        startCollapsed = true;
      }
    } catch (e) {}
    applySidebarCollapsed(sidebar, startCollapsed);
    var toggleBtn = sidebar.querySelector('#sidebar-collapse-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        var nextCollapsed = !sidebar.classList.contains('collapsed');
        applySidebarCollapsed(sidebar, nextCollapsed);
        try { localStorage.setItem(COLLAPSE_KEY, nextCollapsed ? '1' : '0'); } catch (e) {}
      });
    }
  }

  /* ─── Sidebar accordion toggle (writes per-group state to localStorage) ─── */
  window.toggleSidebarGroup = function(btn) {
    var body = btn.nextElementSibling;
    if (!body) return;
    var collapsed = body.classList.toggle('collapsed');
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    var slug = btn.getAttribute('data-group-slug');
    if (slug) {
      var state = readAccordionState();
      if (collapsed) state[slug] = 'collapsed';
      else delete state[slug];
      writeAccordionState(state);
    }
  };

  /* ─── Related components — chip strip injected at the foot of the doc
     body, after the last section, where a reader who has finished the
     page is deciding where to go next. Map keyed by the page's
     data-active id; values are arrays of nav ids that resolve through the
     NAV_GROUPS lookup (so we get the title + href for free, and any rebase
     happens via the same helper). */
  var RELATED = {
    /* Start here */
    introduction: ['foundations', 'standards', 'buttons'],
    foundations:  ['introduction', 'standards', 'buttons'],
    standards:    ['introduction', 'foundations', 'forms'],
    /* Actions */
    buttons:      ['dropdowns', 'badges', 'forms'],
    /* Data display */
    badges:       ['tables', 'tabs', 'headers'],
    cards:        ['tables', 'badges', 'buttons'],
    tables:       ['cards', 'badges', 'tabs'],
    /* Forms */
    forms:        ['buttons', 'standards', 'headers'],
    /* Navigation */
    tabs:         ['badges', 'headers', 'breadcrumbs'],
    breadcrumbs:  ['headers', 'tabs'],
    headers:      ['breadcrumbs', 'badges', 'buttons'],
    /* Feedback */
    dropdowns:    ['buttons', 'badges', 'headers'],
    toasts:       ['buttons', 'forms'],
    /* Compositions */
    wizard:       ['forms', 'buttons', 'headers', 'upload'],
    inbox:        ['tabs', 'badges', 'dropdowns', 'cards'],
    upload:       ['wizard', 'forms', 'tables']
  };
  var NAV_INDEX = {};
  NAV_GROUPS.forEach(function(g) {
    g.items.forEach(function(it) { NAV_INDEX[it.id] = it; });
  });
  /* The doc body: some pages carry the id, all carry the class. */
  function docBody() {
    return document.getElementById('component-doc-body') || document.querySelector('.component-doc-body');
  }
  /* Give id-less sections an anchor from their heading so the on-this-page
     strip can point at them. Existing ids are left alone. */
  function ensureSectionIds(body) {
    var used = {};
    Array.prototype.slice.call(body.children).forEach(function(el) {
      if (el.tagName !== 'SECTION') return;
      if (el.id) { used[el.id] = true; return; }
      var h = el.querySelector('h2');
      if (!h) return;
      var base = h.textContent.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
      var id = base, n = 2;
      while (used[id] || document.getElementById(id)) { id = base + '-' + (n++); }
      el.id = id; used[id] = true;
    });
  }
  function injectRelated() {
    var body = docBody();
    if (!body) return;
    var canvas = document.getElementById('component-doc-canvas');
    var sidebar = document.getElementById('left-sidebar');
    var active = (sidebar && sidebar.getAttribute('data-active')) || '';
    var ids = RELATED[active];
    if (!ids || !ids.length) return;
    /* Render a chip strip after the last section. */
    var wrap = document.createElement('div');
    wrap.className = 'related-components';
    var label = document.createElement('span');
    label.className = 'related-components-label';
    label.textContent = 'Related';
    wrap.appendChild(label);
    var list = document.createElement('div');
    list.className = 'related-components-list';
    ids.forEach(function(id) {
      var it = NAV_INDEX[id];
      if (!it) return;
      var a = document.createElement('a');
      a.href = rebase(it.href);
      a.textContent = it.title;
      list.appendChild(a);
    });
    wrap.appendChild(list);
    body.appendChild(wrap);
  }
  injectRelated();

  /* ─── Previous / Next pager — the foot of every doc page. Walks the
     flattened NAV_GROUPS order so the docs read as a sequence, not a set
     of islands: Introduction → Foundations → Standards → the ten
     components → the three compositions. */
  function injectPager() {
    var body = docBody();
    if (!body) return;
    var sidebar = document.getElementById('left-sidebar');
    var active = (sidebar && sidebar.getAttribute('data-active')) || '';
    var flat = [];
    NAV_GROUPS.forEach(function(g) {
      g.items.forEach(function(it) { flat.push({ id: it.id, title: it.title, href: it.href, group: g.label }); });
    });
    var i = -1;
    flat.forEach(function(it, idx) { if (it.id === active) i = idx; });
    if (i < 0) return;
    var prev = i > 0 ? flat[i - 1] : null;
    var next = i < flat.length - 1 ? flat[i + 1] : null;
    if (!prev && !next) return;
    var nav = document.createElement('nav');
    nav.className = 'doc-pager';
    nav.setAttribute('aria-label', 'Previous and next page');
    function cell(it, dir) {
      if (!it) return '<span class="doc-pager-cell empty"></span>';
      return '<a class="doc-pager-cell ' + dir + '" href="' + rebase(it.href) + '">' +
        '<span class="doc-pager-dir">' + (dir === 'prev' ? '← Previous' : 'Next →') + '</span>' +
        '<span class="doc-pager-title">' + it.title + '</span>' +
        '<span class="doc-pager-group">' + it.group + '</span>' +
      '</a>';
    }
    nav.innerHTML = cell(prev, 'prev') + cell(next, 'next');
    body.appendChild(nav);
  }
  injectPager();

  /* ─── On this page — a one-line strip of section anchors under the page
     header, for pages with four or more sections. Built from the h2 in
     each <section id>, so it costs nothing to maintain. */
  function injectToc() {
    var body = docBody();
    var content = body && body.parentNode;
    var header = content && content.querySelector('.page-header');
    if (!body || !header) return;
    ensureSectionIds(body);
    var sections = Array.prototype.slice.call(body.children).filter(function(el) {
      return el.tagName === 'SECTION' && el.id && el.querySelector('h2');
    });
    if (sections.length < 4) return;
    var nav = document.createElement('nav');
    nav.className = 'doc-toc';
    nav.setAttribute('aria-label', 'On this page');
    var html = '<span class="doc-toc-label">On this page</span><ol>';
    sections.forEach(function(sec) {
      html += '<li><a href="#' + sec.id + '">' + sec.querySelector('h2').textContent.trim() + '</a></li>';
    });
    html += '</ol>';
    nav.innerHTML = html;
    header.parentNode.insertBefore(nav, header.nextSibling);
  }
  injectToc();

  /* ─── Sidebar quick-filter ─── */
  var search = document.getElementById('nav-search');
  if (search) {
    var allLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group-body a'));
    var allGroups = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group-body'));
    var allLabels = Array.prototype.slice.call(document.querySelectorAll('.sidebar-group-label'));
    search.addEventListener('input', function() {
      var q = search.value.trim().toLowerCase();
      if (!q) {
        allLinks.forEach(function(a) { a.hidden = false; });
        allGroups.forEach(function(g) { g.style.display = ''; });
        allLabels.forEach(function(l) { l.style.display = ''; });
        return;
      }
      allGroups.forEach(function(g, i) {
        var links = g.querySelectorAll('a');
        var anyMatch = false;
        links.forEach(function(a) {
          var m = a.textContent.toLowerCase().indexOf(q) !== -1;
          a.hidden = !m;
          if (m) anyMatch = true;
        });
        g.style.display = anyMatch ? '' : 'none';
        if (allLabels[i]) allLabels[i].style.display = anyMatch ? '' : 'none';
        if (anyMatch) g.classList.remove('collapsed');
      });
    });
  }

  /* ─── Example panel — preview swap + collapse + copy + expand ─── */
  document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('component-doc-canvas');
    var panel  = document.getElementById('example-panel');
    if (!panel) return;

    /* Build the chrome if the page only provided example-items + options data.
       Page declares: <aside class="example-panel" id="example-panel"
                              data-options='[{"id":"x","label":"X"}, ...]'>
                       <div class="example-item" data-example-id="x">...</div>
                       <template class="example-usage">...</template>
                      </aside>
       We synthesize the header (search + dropdown) and code-block sections. */
    if (!panel.querySelector('.example-panel-header') && panel.hasAttribute('data-options')) {
      var optionsData = [];
      try { optionsData = JSON.parse(panel.getAttribute('data-options')); } catch (e) { optionsData = []; }
      var preview = document.createElement('div');
      preview.className = 'example-panel-preview';
      preview.id = 'example-preview';
      // Move all .example-item nodes into the preview
      Array.prototype.slice.call(panel.querySelectorAll(':scope > .example-item')).forEach(function(el) {
        preview.appendChild(el);
      });
      var header = document.createElement('div');
      header.className = 'example-panel-header';
      var optsHtml = '';
      optionsData.forEach(function(o, i) {
        var cls = i === 0 ? ' active' : '';
        optsHtml += '<button class="example-search-option' + cls + '" data-example-value="' + o.id + '">' + o.label + '</button>';
      });
      header.innerHTML =
        '<span class="example-panel-label">Examples</span>' +
        '<button class="example-panel-expand" id="example-panel-expand" title="Expand examples"><svg><use href="#i-expand"/></svg></button>' +
        '<div class="example-search-wrap">' +
          '<input id="example-search" class="example-search-input" type="text" placeholder="Search examples…" autocomplete="off" spellcheck="false">' +
          '<div class="example-search-dropdown hide" id="example-search-dropdown">' + optsHtml + '</div>' +
        '</div>';
      var usageBlock = document.createElement('div');
      usageBlock.className = 'example-panel-code collapsed';
      usageBlock.id = 'example-usage';
      usageBlock.innerHTML =
        '<div class="example-panel-code-header">' +
          '<button class="example-panel-toggle" data-toggle-panel="example-usage" aria-expanded="false"><svg><use href="#i-chevron-down"/></svg><span class="example-panel-label">Usage</span></button>' +
          '<button class="example-panel-copy" data-copy-target="example-usage-block" title="Copy"><svg><use href="#i-copy"/></svg></button>' +
        '</div>' +
        '<div class="example-panel-code-body"><pre><code id="example-usage-block"></code></pre></div>';
      var codeBlock = document.createElement('div');
      codeBlock.className = 'example-panel-code';
      codeBlock.id = 'example-code';
      codeBlock.innerHTML =
        '<div class="example-panel-code-header">' +
          '<button class="example-panel-toggle" data-toggle-panel="example-code" aria-expanded="true"><svg><use href="#i-chevron-down"/></svg><span class="example-panel-label">Code</span></button>' +
          '<button class="example-panel-copy" data-copy-target="example-code-block" title="Copy"><svg><use href="#i-copy"/></svg></button>' +
        '</div>' +
        '<div class="example-panel-code-body"><pre><code id="example-code-block"></code></pre></div>';
      panel.insertBefore(header, panel.firstChild);
      // Insert preview after header
      header.parentNode.insertBefore(preview, header.nextSibling);
      panel.appendChild(usageBlock);
      panel.appendChild(codeBlock);
    }

    var items       = Array.prototype.slice.call(panel.querySelectorAll('.example-item'));
    var options     = Array.prototype.slice.call(panel.querySelectorAll('.example-search-option'));
    var searchInput = document.getElementById('example-search');
    var dropdown    = document.getElementById('example-search-dropdown');
    var previewArea = document.getElementById('example-preview');
    var codeBlock   = document.getElementById('example-code-block');
    var usageBlock  = document.getElementById('example-usage-block');
    var usageTpl    = panel.querySelector('template.example-usage');
    var expandBtn   = document.getElementById('example-panel-expand');

    /* Once the user manually resizes the panel, stop auto-sizing it.
       Until then, the panel grows to fit each active example's natural width. */
    var userResized = false;

    function getDefaultPanelWidth() {
      if (!canvas) return 440;
      var raw = getComputedStyle(canvas).getPropertyValue('--example-panel-width');
      var parsed = parseInt(raw, 10);
      return isFinite(parsed) ? parsed : 440;
    }

    function fitPanelToExample(activeItem) {
      if (userResized || !panel || !activeItem || !previewArea) return;
      /* Measure the example's natural (no-wrap) width.
         Force nowrap + auto width on the item to compute its real footprint. */
      var prevWrap = activeItem.style.flexWrap;
      var prevWidth = activeItem.style.maxWidth;
      activeItem.style.flexWrap = 'nowrap';
      activeItem.style.maxWidth = 'none';
      var contentW = activeItem.scrollWidth;
      activeItem.style.flexWrap = prevWrap;
      activeItem.style.maxWidth = prevWidth;

      var previewStyle = getComputedStyle(previewArea);
      var padding = parseFloat(previewStyle.paddingLeft) + parseFloat(previewStyle.paddingRight);
      var needed = contentW + padding;

      var minW   = getDefaultPanelWidth();
      var maxW   = Math.floor(window.innerWidth * 0.65);
      var target = Math.max(minW, Math.min(needed, maxW));

      panel.style.flex  = '0 0 ' + target + 'px';
      panel.style.width = target + 'px';
    }

    function setActive(exId) {
      var match = null;
      items.forEach(function(el) {
        var on = el.getAttribute('data-example-id') === exId;
        el.classList.toggle('active', on);
        if (on) match = el;
      });
      options.forEach(function(opt) {
        var on = opt.getAttribute('data-example-value') === exId;
        opt.classList.toggle('active', on);
        if (on && searchInput) searchInput.value = opt.textContent.trim();
      });
      if (match && codeBlock) codeBlock.textContent = match.innerHTML.trim();
      if (usageTpl && usageBlock) usageBlock.textContent = usageTpl.innerHTML.trim();
      if (dropdown) dropdown.classList.add('hide');
      /* Defer to next frame so layout has settled (active class swap) */
      if (match) requestAnimationFrame(function() { fitPanelToExample(match); });
    }

    options.forEach(function(opt) {
      opt.addEventListener('click', function() { setActive(opt.getAttribute('data-example-value')); });
    });

    if (searchInput && dropdown) {
      searchInput.addEventListener('focus', function() { dropdown.classList.remove('hide'); });
      searchInput.addEventListener('input', function() {
        var q = searchInput.value.toLowerCase();
        options.forEach(function(o) {
          o.classList.toggle('filtered-out', o.textContent.toLowerCase().indexOf(q) === -1);
        });
        dropdown.classList.remove('hide');
      });
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.example-search-wrap')) dropdown.classList.add('hide');
      });
    }
    if (previewArea && dropdown) {
      previewArea.addEventListener('pointerdown', function() { dropdown.classList.add('hide'); });
    }

    /* Collapsible code blocks */
    panel.querySelectorAll('.example-panel-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = document.getElementById(btn.getAttribute('data-toggle-panel'));
        if (!target) return;
        var collapsed = target.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      });
    });

    /* Copy to clipboard */
    panel.querySelectorAll('.example-panel-copy').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = document.getElementById(btn.getAttribute('data-copy-target'));
        if (!target || !navigator.clipboard) return;
        navigator.clipboard.writeText(target.textContent).then(function() {
          btn.classList.add('copied');
          setTimeout(function() { btn.classList.remove('copied'); }, 1200);
        });
      });
    });

    /* Expand panel to full width */
    if (expandBtn && canvas) {
      expandBtn.addEventListener('click', function() {
        canvas.classList.toggle('examples-expanded');
        expandBtn.classList.toggle('is-expanded');
        panel.style.flex = ''; panel.style.width = '';
      });
    }

    /* Resize handle */
    var handle = document.getElementById('example-panel-resize');
    if (handle && canvas) {
      var startX = 0, startW = 0, dragging = false;
      function apply(x) {
        var diff = startX - x;
        var w = Math.max(320, Math.min(startW + diff, window.innerWidth * 0.65));
        panel.style.flex = '0 0 ' + w + 'px'; panel.style.width = w + 'px';
        userResized = true; /* user took control — stop auto-fitting */
      }
      function end() {
        if (!dragging) return;
        dragging = false;
        handle.classList.remove('dragging');
        document.body.classList.remove('resizing-panel');
      }
      function begin(x) {
        dragging = true; startX = x; startW = panel.offsetWidth;
        handle.classList.add('dragging');
        document.body.classList.add('resizing-panel');
      }
      handle.addEventListener('mousedown', function(e) { e.preventDefault(); begin(e.clientX); });
      document.addEventListener('mousemove', function(e) { if (dragging) apply(e.clientX); });
      document.addEventListener('mouseup', end);
      handle.addEventListener('touchstart', function(e) {
        if (!e.touches || !e.touches.length) return;
        e.preventDefault(); begin(e.touches[0].clientX);
      }, { passive: false });
      document.addEventListener('touchmove', function(e) {
        if (dragging && e.touches && e.touches.length) apply(e.touches[0].clientX);
      }, { passive: true });
      document.addEventListener('touchend', end);
      window.addEventListener('blur', end);
    }

    /* Re-fit on window resize (cap might change with viewport) */
    window.addEventListener('resize', function() {
      var active = panel.querySelector('.example-item.active');
      if (active) fitPanelToExample(active);
    });

    /* Activate first example */
    if (options.length) setActive(options[0].getAttribute('data-example-value'));
  });

  /* Back-to-top button */
  var btn = document.getElementById('back-to-top');
  if (btn) {
    var contentEl = document.querySelector('.content.component-doc');
    var scroller = contentEl || window;
    function onScroll() {
      var y = contentEl ? contentEl.scrollTop : window.scrollY;
      btn.classList.toggle('visible', y > 300);
    }
    scroller.addEventListener('scroll', onScroll);
    btn.addEventListener('click', function() {
      if (contentEl) contentEl.scrollTo({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
