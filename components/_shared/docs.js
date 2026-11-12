"use strict";
/* Component doc page: the runtime every page loads. It injects the shared
   SVG sprite, the masthead, the sidebar nav (with its search, accordion and
   collapse), the related-components chips, the Previous / Next pager, the
   "On this page" strip, the example panel chrome, and the back-to-top button.

   Source: src/docs.ts. components/_shared/docs.js, the file the pages
   load, is compiled from it by `npm run build`: edit the .ts, never the .js. */
(() => {
    const VERSION = 'v2026.05';
    const ACCORDION_KEY = 'eds.nav.accordion.v1';
    const COLLAPSE_KEY = 'eds.nav.collapsed.v1';
    /* Three groups, matching the masthead: the reading pages, the ten
       components, the three compositions. The finer taxonomy (Actions, Data
       display, Forms, Navigation, Feedback) lives on each page's eyebrow; as
       nine accordion groups it was more chrome than content. The order here
       is also the reading order: the Previous / Next pager at the foot of
       every page walks this list. */
    const NAV_GROUPS = [
        { label: 'Start here', items: [
                { id: 'introduction', title: 'Introduction', href: './introduction.html' },
                { id: 'foundations', title: 'Foundations', href: './foundations.html' },
                { id: 'standards', title: 'Standards', href: './standards.html' },
            ] },
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
            ] },
        { label: 'Compositions', items: [
                { id: 'wizard', title: 'Wizard system', href: './wizard.html' },
                { id: 'inbox', title: 'Inbox', href: './inbox.html' },
                { id: 'upload', title: 'Upload wizard', href: './upload.html' },
            ] },
    ];
    /* Related components: the chip strip at the foot of the doc body, keyed by
       the page's data-active id. Values are nav ids, resolved through
       NAV_GROUPS so the title and href come for free. */
    const RELATED = {
        /* Start here */
        introduction: ['foundations', 'standards', 'buttons'],
        foundations: ['introduction', 'standards', 'buttons'],
        standards: ['introduction', 'foundations', 'forms'],
        /* Actions */
        buttons: ['dropdowns', 'badges', 'forms'],
        /* Data display */
        badges: ['tables', 'tabs', 'headers'],
        cards: ['tables', 'badges', 'buttons'],
        tables: ['cards', 'badges', 'tabs'],
        /* Forms */
        forms: ['buttons', 'standards', 'headers'],
        /* Navigation */
        tabs: ['badges', 'headers', 'breadcrumbs'],
        breadcrumbs: ['headers', 'tabs'],
        headers: ['breadcrumbs', 'badges', 'buttons'],
        /* Feedback */
        dropdowns: ['buttons', 'badges', 'headers'],
        toasts: ['buttons', 'forms'],
        /* Compositions */
        wizard: ['forms', 'buttons', 'headers', 'upload'],
        inbox: ['tabs', 'badges', 'dropdowns', 'cards'],
        upload: ['wizard', 'forms', 'tables'],
    };
    const NAV_INDEX = {};
    NAV_GROUPS.forEach((g) => g.items.forEach((it) => { NAV_INDEX[it.id] = it; }));
    /* Pages outside components/ (the landing page) set
       <body data-href-base="./components/"> so nav links resolve. */
    const HREF_BASE = document.body.getAttribute('data-href-base') || '';
    function rebase(href) {
        return HREF_BASE ? href.replace(/^\.\//, HREF_BASE) : href;
    }
    /** The nav id of the current page, from the sidebar's data-active. */
    function activePageId() {
        const sidebar = document.getElementById('left-sidebar');
        return (sidebar && sidebar.getAttribute('data-active')) || '';
    }
    function injectStyle(id, css) {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    }
    /* ─── Shared SVG sprite (header icons, example icons) ─── */
    const SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
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
    function injectSprite() {
        if (document.getElementById('docs-sprite'))
            return;
        const host = document.createElement('div');
        host.id = 'docs-sprite';
        host.innerHTML = SPRITE;
        document.body.insertBefore(host, document.body.firstChild);
    }
    /* ─── Product masthead, at the top of every component page, so the docs
         read as part of the same product as the landing page. The landing
         page renders its own masthead inline; an existing #eds-masthead
         prevents a second one. */
    const MASTHEAD_CSS = '.eds-masthead { position: sticky; top: 0; z-index: 60; background: color-mix(in oklch, var(--body-bg) 90%, transparent); backdrop-filter: saturate(140%) blur(12px); -webkit-backdrop-filter: saturate(140%) blur(12px); border-bottom: 1px solid oklch(24% 0.073 260 / 0.10); }' +
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
    function injectMasthead() {
        if (document.getElementById('eds-masthead') || !document.querySelector('.canvas'))
            return;
        injectStyle('eds-masthead-styles', MASTHEAD_CSS);
        const activeId = activePageId();
        const navLinkClass = (ids) => (ids.indexOf(activeId) !== -1 ? ' class="active"' : '');
        const here = HREF_BASE || './';
        const masthead = document.createElement('header');
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
                '<a href="' + here + 'buttons.html"' + navLinkClass(['buttons', 'badges', 'cards', 'tables', 'forms', 'tabs', 'breadcrumbs', 'headers', 'dropdowns', 'toasts']) + '>Components</a>' +
                '<a href="' + here + 'wizard.html"' + navLinkClass(['wizard', 'inbox', 'upload']) + '>Compositions</a>' +
                '<a href="' + here + 'standards.html"' + navLinkClass(['standards']) + '>Standards</a>' +
                '</nav>' +
                '<div class="eds-mast-spacer"></div>' +
                '<span class="eds-version">' + VERSION + '</span>' +
                '<a class="eds-portfolio-link" href="https://doselos.com" title="Back to portfolio">Portfolio <span class="arr">↗</span></a>' +
                '</div>';
        document.body.insertBefore(masthead, document.body.firstChild);
    }
    /* ─── Collapsible sidebar styles (injected so docs.css stays clean) ─── */
    const COLLAPSE_CSS = '.left-sidebar { transition: width 0.18s ease; }' +
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
    function injectCollapseStyles() {
        if (!document.getElementById('docs-collapse-styles'))
            injectStyle('docs-collapse-styles', COLLAPSE_CSS);
    }
    /* ─── Sidebar nav, with per-group accordion state kept across pages ─── */
    function groupSlug(label) {
        return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function readAccordionState() {
        try {
            return JSON.parse(localStorage.getItem(ACCORDION_KEY) || '{}') || {};
        }
        catch {
            return {};
        }
    }
    function writeAccordionState(state) {
        try {
            localStorage.setItem(ACCORDION_KEY, JSON.stringify(state));
        }
        catch { /* storage unavailable */ }
    }
    function buildSidebar(active) {
        const stored = readAccordionState();
        /* The group holding the current page always shows open, so the reader
           never has to expand it to see where they are. */
        let activeGroupSlug = null;
        NAV_GROUPS.forEach((g) => {
            if (g.items.some((it) => it.id === active))
                activeGroupSlug = groupSlug(g.label);
        });
        let html = '';
        html += '<div class="sidebar-logo">';
        html += '<div class="sidebar-logo-text">';
        html += '<div class="title"><a href="' + rebase('./introduction.html') + '" style="color:inherit;text-decoration:none">Enterprise Design System</a></div>';
        html += '<div class="sub">by Carlos deArtola</div>';
        html += '</div>';
        html += '<button class="sidebar-toggle" id="sidebar-collapse-toggle" aria-label="Collapse navigation" title="Collapse navigation"><svg><use href="#i-chevron-right"/></svg></button>';
        html += '</div>';
        html += '<div class="sidebar-search"><div class="sidebar-search-input">';
        html += '<svg><use href="#i-search"/></svg>';
        html += '<input id="nav-search" type="search" placeholder="Search components…" autocomplete="off" spellcheck="false">';
        html += '</div></div>';
        html += '<div class="sidebar-nav">';
        NAV_GROUPS.forEach((g) => {
            const slug = groupSlug(g.label);
            const isCollapsed = stored[slug] === 'collapsed' && slug !== activeGroupSlug;
            const bodyCls = isCollapsed ? 'sidebar-group-body collapsed' : 'sidebar-group-body';
            const expanded = isCollapsed ? 'false' : 'true';
            html += '<button class="sidebar-group-label" data-group-slug="' + slug + '" aria-expanded="' + expanded + '" onclick="toggleSidebarGroup(this)"><span>' + g.label + '</span><svg class="nav-chevron"><use href="#i-chevron-down"/></svg></button>';
            html += '<div class="' + bodyCls + '">';
            g.items.forEach((it) => {
                const cls = it.id === active ? ' class="active"' : '';
                html += '<a href="' + rebase(it.href) + '"' + cls + '>' + it.title + '</a>';
            });
            html += '</div>';
        });
        html += '</div>';
        html += '<div class="sidebar-footer">' + VERSION + ' · Enterprise DS</div>';
        return html;
    }
    function applySidebarCollapsed(el, collapsed) {
        el.classList.toggle('collapsed', collapsed);
        const toggleBtn = el.querySelector('#sidebar-collapse-toggle');
        if (toggleBtn) {
            const label = collapsed ? 'Expand navigation' : 'Collapse navigation';
            toggleBtn.setAttribute('aria-label', label);
            toggleBtn.setAttribute('title', label);
        }
    }
    function setUpSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        if (!sidebar)
            return;
        if (!sidebar.children.length)
            sidebar.innerHTML = buildSidebar(activePageId());
        /* The collapsed choice persists. With none stored, a narrow viewport
           starts collapsed so a phone shows the content, not the nav. */
        let startCollapsed = false;
        try {
            const stored = localStorage.getItem(COLLAPSE_KEY);
            if (stored === '1')
                startCollapsed = true;
            else if (stored === null && window.matchMedia('(max-width: 768px)').matches)
                startCollapsed = true;
        }
        catch { /* storage unavailable */ }
        applySidebarCollapsed(sidebar, startCollapsed);
        const toggleBtn = sidebar.querySelector('#sidebar-collapse-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const nextCollapsed = !sidebar.classList.contains('collapsed');
                applySidebarCollapsed(sidebar, nextCollapsed);
                try {
                    localStorage.setItem(COLLAPSE_KEY, nextCollapsed ? '1' : '0');
                }
                catch { /* storage unavailable */ }
            });
        }
    }
    window.toggleSidebarGroup = (btn) => {
        const body = btn.nextElementSibling;
        if (!body)
            return;
        const collapsed = body.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        const slug = btn.getAttribute('data-group-slug');
        if (slug) {
            const state = readAccordionState();
            if (collapsed)
                state[slug] = 'collapsed';
            else
                delete state[slug];
            writeAccordionState(state);
        }
    };
    /* ─── The doc body's foot: related chips, then the pager ─── */
    /** The doc body: some pages carry the id, all carry the class. */
    function docBody() {
        return document.getElementById('component-doc-body') || document.querySelector('.component-doc-body');
    }
    function injectRelated() {
        const body = docBody();
        const ids = RELATED[activePageId()];
        if (!body || !ids || !ids.length)
            return;
        const wrap = document.createElement('div');
        wrap.className = 'related-components';
        const label = document.createElement('span');
        label.className = 'related-components-label';
        label.textContent = 'Related';
        wrap.appendChild(label);
        const list = document.createElement('div');
        list.className = 'related-components-list';
        ids.forEach((id) => {
            const it = NAV_INDEX[id];
            if (!it)
                return;
            const a = document.createElement('a');
            a.href = rebase(it.href);
            a.textContent = it.title;
            list.appendChild(a);
        });
        wrap.appendChild(list);
        body.appendChild(wrap);
    }
    /* Previous / Next walks the flattened NAV_GROUPS order, so the docs read
       as a sequence: Introduction, Foundations, Standards, the ten
       components, the three compositions. */
    function injectPager() {
        const body = docBody();
        if (!body)
            return;
        const active = activePageId();
        const flat = [];
        NAV_GROUPS.forEach((g) => g.items.forEach((it) => flat.push({ ...it, group: g.label })));
        const i = flat.findIndex((it) => it.id === active);
        if (i < 0)
            return;
        const prev = i > 0 ? flat[i - 1] : undefined;
        const next = i < flat.length - 1 ? flat[i + 1] : undefined;
        if (!prev && !next)
            return;
        const cell = (it, dir) => {
            if (!it)
                return '<span class="doc-pager-cell empty"></span>';
            return '<a class="doc-pager-cell ' + dir + '" href="' + rebase(it.href) + '">' +
                '<span class="doc-pager-dir">' + (dir === 'prev' ? '← Previous' : 'Next →') + '</span>' +
                '<span class="doc-pager-title">' + it.title + '</span>' +
                '<span class="doc-pager-group">' + it.group + '</span>' +
                '</a>';
        };
        const nav = document.createElement('nav');
        nav.className = 'doc-pager';
        nav.setAttribute('aria-label', 'Previous and next page');
        nav.innerHTML = cell(prev, 'prev') + cell(next, 'next');
        body.appendChild(nav);
    }
    /* ─── On this page: a strip of section anchors under the page header, for
       pages with four or more sections, built from each section's h2. ─── */
    /** Gives id-less sections an anchor from their heading; existing ids stay. */
    function ensureSectionIds(body) {
        const used = {};
        Array.from(body.children).forEach((el) => {
            if (el.tagName !== 'SECTION')
                return;
            if (el.id) {
                used[el.id] = true;
                return;
            }
            const h = el.querySelector('h2');
            if (!h)
                return;
            const base = (h.textContent || '').trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
            let id = base;
            let n = 2;
            while (used[id] || document.getElementById(id))
                id = base + '-' + n++;
            el.id = id;
            used[id] = true;
        });
    }
    function injectToc() {
        const body = docBody();
        const content = body && body.parentNode;
        const header = content instanceof Element ? content.querySelector('.page-header') : null;
        if (!body || !header || !header.parentNode)
            return;
        ensureSectionIds(body);
        const sections = Array.from(body.children).filter((el) => el.tagName === 'SECTION' && el.id && el.querySelector('h2'));
        if (sections.length < 4)
            return;
        const nav = document.createElement('nav');
        nav.className = 'doc-toc';
        nav.setAttribute('aria-label', 'On this page');
        let html = '<span class="doc-toc-label">On this page</span><ol>';
        sections.forEach((sec) => {
            html += '<li><a href="#' + sec.id + '">' + (sec.querySelector('h2')?.textContent || '').trim() + '</a></li>';
        });
        html += '</ol>';
        nav.innerHTML = html;
        header.parentNode.insertBefore(nav, header.nextSibling);
    }
    /* ─── Sidebar quick-filter ─── */
    function setUpNavSearch() {
        const search = document.getElementById('nav-search');
        if (!(search instanceof HTMLInputElement))
            return;
        const allLinks = Array.from(document.querySelectorAll('.sidebar-group-body a'));
        const allGroups = Array.from(document.querySelectorAll('.sidebar-group-body'));
        const allLabels = Array.from(document.querySelectorAll('.sidebar-group-label'));
        search.addEventListener('input', () => {
            const q = search.value.trim().toLowerCase();
            if (!q) {
                allLinks.forEach((a) => { a.hidden = false; });
                allGroups.forEach((g) => { g.style.display = ''; });
                allLabels.forEach((l) => { l.style.display = ''; });
                return;
            }
            allGroups.forEach((g, i) => {
                let anyMatch = false;
                g.querySelectorAll('a').forEach((a) => {
                    const m = (a.textContent || '').toLowerCase().indexOf(q) !== -1;
                    a.hidden = !m;
                    if (m)
                        anyMatch = true;
                });
                g.style.display = anyMatch ? '' : 'none';
                const label = allLabels[i];
                if (label)
                    label.style.display = anyMatch ? '' : 'none';
                if (anyMatch)
                    g.classList.remove('collapsed');
            });
        });
    }
    /* ─── Example panel: preview swap, search, collapse, copy, expand, resize ─── */
    /* A page may give only the examples and their names:
         <aside class="example-panel" id="example-panel"
                data-options='[{"id":"x","label":"X"}, ...]'>
           <div class="example-item" data-example-id="x">...</div>
           <template class="example-usage">...</template>
         </aside>
       This builds the rest: the header with its search and dropdown, the
       preview, and the Usage and Code blocks. */
    function codeBlockHtml(id, label, open) {
        return '<div class="example-panel-code-header">' +
            '<button class="example-panel-toggle" data-toggle-panel="' + id + '" aria-expanded="' + open + '"><svg><use href="#i-chevron-down"/></svg><span class="example-panel-label">' + label + '</span></button>' +
            '<button class="example-panel-copy" data-copy-target="' + id + '-block" title="Copy"><svg><use href="#i-copy"/></svg></button>' +
            '</div>' +
            '<div class="example-panel-code-body"><pre><code id="' + id + '-block"></code></pre></div>';
    }
    function buildPanelChrome(panel) {
        if (panel.querySelector('.example-panel-header') || !panel.hasAttribute('data-options'))
            return;
        let options = [];
        try {
            options = JSON.parse(panel.getAttribute('data-options') || '');
        }
        catch {
            options = [];
        }
        const preview = document.createElement('div');
        preview.className = 'example-panel-preview';
        preview.id = 'example-preview';
        Array.from(panel.querySelectorAll(':scope > .example-item')).forEach((el) => preview.appendChild(el));
        const header = document.createElement('div');
        header.className = 'example-panel-header';
        const optsHtml = options.map((o, i) => '<button class="example-search-option' + (i === 0 ? ' active' : '') + '" data-example-value="' + o.id + '">' + o.label + '</button>').join('');
        header.innerHTML =
            '<span class="example-panel-label">Examples</span>' +
                '<button class="example-panel-expand" id="example-panel-expand" title="Expand examples"><svg><use href="#i-expand"/></svg></button>' +
                '<div class="example-search-wrap">' +
                '<input id="example-search" class="example-search-input" type="text" placeholder="Search examples…" autocomplete="off" spellcheck="false">' +
                '<div class="example-search-dropdown hide" id="example-search-dropdown">' + optsHtml + '</div>' +
                '</div>';
        const usage = document.createElement('div');
        usage.className = 'example-panel-code collapsed';
        usage.id = 'example-usage';
        usage.innerHTML = codeBlockHtml('example-usage', 'Usage', false);
        const code = document.createElement('div');
        code.className = 'example-panel-code';
        code.id = 'example-code';
        code.innerHTML = codeBlockHtml('example-code', 'Code', true);
        panel.insertBefore(header, panel.firstChild);
        panel.insertBefore(preview, header.nextSibling);
        panel.appendChild(usage);
        panel.appendChild(code);
    }
    function setUpExamplePanel() {
        const canvas = document.getElementById('component-doc-canvas');
        const panel = document.getElementById('example-panel');
        if (!panel)
            return;
        buildPanelChrome(panel);
        const items = Array.from(panel.querySelectorAll('.example-item'));
        const options = Array.from(panel.querySelectorAll('.example-search-option'));
        const searchInput = document.getElementById('example-search');
        const dropdown = document.getElementById('example-search-dropdown');
        const previewArea = document.getElementById('example-preview');
        const codeBlock = document.getElementById('example-code-block');
        const usageBlock = document.getElementById('example-usage-block');
        const usageTpl = panel.querySelector('template.example-usage');
        const expandBtn = document.getElementById('example-panel-expand');
        /* The panel grows to fit each example's natural width until the reader
           resizes it by hand; from then on it stays where they put it. */
        let userResized = false;
        const defaultPanelWidth = () => {
            if (!canvas)
                return 440;
            const parsed = parseInt(getComputedStyle(canvas).getPropertyValue('--example-panel-width'), 10);
            return isFinite(parsed) ? parsed : 440;
        };
        const setPanelWidth = (w) => {
            panel.style.flex = '0 0 ' + w + 'px';
            panel.style.width = w + 'px';
        };
        const fitPanelToExample = (activeItem) => {
            if (userResized || !previewArea)
                return;
            /* Measure the example's natural (no-wrap) width. */
            const prevWrap = activeItem.style.flexWrap;
            const prevWidth = activeItem.style.maxWidth;
            activeItem.style.flexWrap = 'nowrap';
            activeItem.style.maxWidth = 'none';
            const contentW = activeItem.scrollWidth;
            activeItem.style.flexWrap = prevWrap;
            activeItem.style.maxWidth = prevWidth;
            const previewStyle = getComputedStyle(previewArea);
            const needed = contentW + parseFloat(previewStyle.paddingLeft) + parseFloat(previewStyle.paddingRight);
            const maxW = Math.floor(window.innerWidth * 0.65);
            setPanelWidth(Math.max(defaultPanelWidth(), Math.min(needed, maxW)));
        };
        const setActive = (exId) => {
            let match = null;
            for (const el of items) {
                const on = el.getAttribute('data-example-id') === exId;
                el.classList.toggle('active', on);
                if (on)
                    match = el;
            }
            for (const opt of options) {
                const on = opt.getAttribute('data-example-value') === exId;
                opt.classList.toggle('active', on);
                if (on && searchInput)
                    searchInput.value = (opt.textContent || '').trim();
            }
            if (match && codeBlock)
                codeBlock.textContent = match.innerHTML.trim();
            if (usageTpl && usageBlock)
                usageBlock.textContent = usageTpl.innerHTML.trim();
            if (dropdown)
                dropdown.classList.add('hide');
            /* Next frame, once the active class swap has laid out. */
            const shown = match;
            if (shown)
                requestAnimationFrame(() => fitPanelToExample(shown));
        };
        options.forEach((opt) => opt.addEventListener('click', () => setActive(opt.getAttribute('data-example-value'))));
        if (searchInput && dropdown) {
            searchInput.addEventListener('focus', () => dropdown.classList.remove('hide'));
            searchInput.addEventListener('input', () => {
                const q = searchInput.value.toLowerCase();
                options.forEach((o) => o.classList.toggle('filtered-out', (o.textContent || '').toLowerCase().indexOf(q) === -1));
                dropdown.classList.remove('hide');
            });
            document.addEventListener('click', (e) => {
                if (!(e.target instanceof Element && e.target.closest('.example-search-wrap')))
                    dropdown.classList.add('hide');
            });
        }
        if (previewArea && dropdown) {
            previewArea.addEventListener('pointerdown', () => dropdown.classList.add('hide'));
        }
        /* Collapsible code blocks */
        panel.querySelectorAll('.example-panel-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.getAttribute('data-toggle-panel') || '');
                if (!target)
                    return;
                const collapsed = target.classList.toggle('collapsed');
                btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            });
        });
        /* Copy to clipboard */
        panel.querySelectorAll('.example-panel-copy').forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.getAttribute('data-copy-target') || '');
                if (!target || !navigator.clipboard)
                    return;
                navigator.clipboard.writeText(target.textContent || '').then(() => {
                    btn.classList.add('copied');
                    setTimeout(() => btn.classList.remove('copied'), 1200);
                });
            });
        });
        /* Expand the panel to full width */
        if (expandBtn && canvas) {
            expandBtn.addEventListener('click', () => {
                canvas.classList.toggle('examples-expanded');
                expandBtn.classList.toggle('is-expanded');
                panel.style.flex = '';
                panel.style.width = '';
            });
        }
        const handle = document.getElementById('example-panel-resize');
        if (handle && canvas) {
            setUpResizeHandle(handle, panel, (w) => { setPanelWidth(w); userResized = true; });
        }
        /* The width cap follows the viewport, so re-fit on resize. */
        window.addEventListener('resize', () => {
            const active = panel.querySelector('.example-item.active');
            if (active)
                fitPanelToExample(active);
        });
        const first = options[0];
        if (first)
            setActive(first.getAttribute('data-example-value'));
    }
    /* Dragging the handle at the panel's left edge sets its width, between
       320px and 65% of the viewport, by mouse or touch. */
    function setUpResizeHandle(handle, panel, setWidth) {
        let startX = 0;
        let startW = 0;
        let dragging = false;
        const apply = (x) => {
            setWidth(Math.max(320, Math.min(startW + (startX - x), window.innerWidth * 0.65)));
        };
        const end = () => {
            if (!dragging)
                return;
            dragging = false;
            handle.classList.remove('dragging');
            document.body.classList.remove('resizing-panel');
        };
        const begin = (x) => {
            dragging = true;
            startX = x;
            startW = panel.offsetWidth;
            handle.classList.add('dragging');
            document.body.classList.add('resizing-panel');
        };
        handle.addEventListener('mousedown', (e) => { e.preventDefault(); begin(e.clientX); });
        document.addEventListener('mousemove', (e) => { if (dragging)
            apply(e.clientX); });
        document.addEventListener('mouseup', end);
        handle.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            if (!t)
                return;
            e.preventDefault();
            begin(t.clientX);
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            if (dragging && t)
                apply(t.clientX);
        }, { passive: true });
        document.addEventListener('touchend', end);
        window.addEventListener('blur', end);
    }
    /* ─── Back-to-top button ─── */
    function setUpBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn)
            return;
        const contentEl = document.querySelector('.content.component-doc');
        const scroller = contentEl || window;
        scroller.addEventListener('scroll', () => {
            const y = contentEl ? contentEl.scrollTop : window.scrollY;
            btn.classList.toggle('visible', y > 300);
        });
        btn.addEventListener('click', () => {
            (contentEl || window).scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    /* The order matters: the sidebar exists before its search is wired, and
       the doc body gets its related chips, then the pager, then its
       section ids. The example panel waits for the rest of the page. */
    injectSprite();
    injectMasthead();
    injectCollapseStyles();
    setUpSidebar();
    injectRelated();
    injectPager();
    injectToc();
    setUpNavSearch();
    document.addEventListener('DOMContentLoaded', setUpExamplePanel);
    setUpBackToTop();
})();
