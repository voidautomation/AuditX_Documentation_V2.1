/**
 * ============================================================
 * AuditX Documentation Portal — Complete Master Script
 * Version 2.1 — All Enhancements + Video Support
 * ============================================================
 */

// ============================================================
// VIDEO CONFIGURATION — Edit these values with your actual files
// ============================================================
const VIDEO_CONFIG = {
    // ─────────────────────────────────────────────────────────
    // OPTION 1: Local MP4 files in video/ folder
    //   'login':        'video/login-tutorial.mp4',
    //
    // OPTION 2: YouTube
    //   'login':        'https://www.youtube.com/embed/YOUR_VIDEO_ID',
    //
    // OPTION 3: Vimeo
    //   'login':        'https://player.vimeo.com/video/YOUR_VIDEO_ID',
    //
    // OPTION 4: SharePoint / Network
    //   'login':        'https://company.sharepoint.com/videos/login.mp4',
    // ─────────────────────────────────────────────────────────

    'login': {
        src: 'video/login-tutorial.mp4',   // ← Change this
        type: 'local',                      // 'local', 'youtube', 'vimeo', 'external'
        title: 'Getting Started: Login & Setup',
        duration: '00:25',
        description: 'Windows authentication, license validation, initial configuration'
    },
    'execute': {
        src: 'video/execute-tutorial.mp4',  // ← Change this
        type: 'local',
        title: 'Executing ITGC Controls',
        duration: '5:47',
        description: 'Running individual and batch audits with evidence capture'
    },
    'housekeeping': {
        src: 'video/housekeeping-tutorial.mp4', // ← Change this
        type: 'local',
        title: 'User Inactivity Analysis',
        duration: '8:12',
        description: 'RFC setup, analysis, and user management'
    }
};

// ============================================================
// INIT — Run everything on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60, disable: 'mobile' });

    initThemeToggle();
    initScrollTop();
    initNavbarScroll();
    initReadingProgress();
    initAnimatedCounters();
    initSidebarNavigation();
    initSmoothScroll();
    initSidebarScrollSpy();
    initControlExplorer();
    initGlobalSearch();
    initGlossaryTooltips();
    initCopyCodeButtons();
    initVideoCards();
    initMermaid();
    initImageLightbox();
    registerServiceWorker();
});

// ============================================================
// VIDEO CARDS — Click to play in modal
// ============================================================
function initVideoCards() {
    document.querySelectorAll('.video-thumbnail').forEach(thumb => {
        thumb.style.cursor = 'pointer';
        thumb.addEventListener('click', () => {
            const videoId = thumb.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });

    // Close video when modal closes — stop playback
    const modalEl = document.getElementById('videoModal');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
            clearVideoModal();
        });
    }
}

function openVideoModal(videoId) {
    const config = VIDEO_CONFIG[videoId];
    const modalEl = document.getElementById('videoModal');
    if (!modalEl) return;

    // Set modal title
    const titleEl = document.getElementById('videoModalTitle');
    if (titleEl && config) titleEl.textContent = config.title || 'Video Tutorial';

    // Build video content based on type
    const bodyEl = modalEl.querySelector('.modal-body');
    if (!bodyEl) return;

    if (!config) {
        bodyEl.innerHTML = getNoVideoHTML('Video configuration not found.');
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
        return;
    }

    bodyEl.innerHTML = buildVideoPlayer(config);
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function buildVideoPlayer(config) {
    switch (config.type) {

        // ─── LOCAL MP4 ─────────────────────────────────────────
        case 'local':
            return `
                <video
                    class="w-100"
                    controls
                    autoplay
                    style="max-height:70vh;background:#000;display:block;"
                    onerror="this.parentElement.innerHTML=getNoVideoHTML('Video file not found: ${config.src}')">
                    <source src="${config.src}" type="video/mp4">
                    <source src="${config.src.replace('.mp4', '.webm')}" type="video/webm">
                    Your browser does not support the video tag.
                </video>
                <div class="p-3" style="background:#1a1a2e;">
                    <p class="text-white-50 small mb-0">${config.description || ''}</p>
                </div>`;

        // ─── YOUTUBE ───────────────────────────────────────────
        case 'youtube':
            return `
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                    <iframe
                        src="${config.src}?autoplay=1&rel=0&modestbranding=1"
                        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="p-3" style="background:#1a1a2e;">
                    <p class="text-white-50 small mb-0">${config.description || ''}</p>
                </div>`;

        // ─── VIMEO ─────────────────────────────────────────────
        case 'vimeo':
            return `
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                    <iframe
                        src="${config.src}?autoplay=1&color=0078D4&title=0&byline=0"
                        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="p-3" style="background:#1a1a2e;">
                    <p class="text-white-50 small mb-0">${config.description || ''}</p>
                </div>`;

        // ─── EXTERNAL (SharePoint, CDN, etc.) ──────────────────
        case 'external':
            return `
                <video
                    class="w-100"
                    controls
                    autoplay
                    style="max-height:70vh;background:#000;display:block;"
                    onerror="this.parentElement.innerHTML='<div class=video-error>Cannot load video from: ${config.src}</div>'">
                    <source src="${config.src}" type="video/mp4">
                    Your browser does not support this video.
                </video>
                <div class="p-3" style="background:#1a1a2e;">
                    <p class="text-white-50 small mb-0">${config.description || ''}</p>
                </div>`;

        default:
            return getNoVideoHTML('Unknown video type: ' + config.type);
    }
}

function getNoVideoHTML(message) {
    return `
        <div class="text-center py-5 px-4">
            <i class="bi bi-camera-video-off text-muted" style="font-size:3.5rem;display:block;margin-bottom:1rem;"></i>
            <h6 class="text-white mb-2">Video Not Available</h6>
            <p class="text-white-50 small mb-3">${message || 'No video configured for this tutorial.'}</p>
            <div class="text-start d-inline-block">
                <p class="text-muted small mb-2"><strong>To add your video, edit VIDEO_CONFIG in script.js:</strong></p>
                <div style="background:#0f172a;padding:12px 16px;border-radius:8px;font-family:monospace;font-size:11px;color:#94a3b8;">
                    'login': {<br>
                    &nbsp;&nbsp;src: 'video/login-tutorial.mp4',<br>
                    &nbsp;&nbsp;type: 'local',<br>
                    &nbsp;&nbsp;title: 'Login Tutorial'<br>
                    }
                </div>
            </div>
        </div>`;
}

function clearVideoModal() {
    const modalEl = document.getElementById('videoModal');
    if (!modalEl) return;
    const bodyEl = modalEl.querySelector('.modal-body');
    if (bodyEl) {
        // Pause any playing video before clearing
        const video = bodyEl.querySelector('video');
        if (video) { video.pause(); video.src = ''; }
        const iframe = bodyEl.querySelector('iframe');
        if (iframe) iframe.src = '';
        bodyEl.innerHTML = '';
    }
}

// ============================================================
// 7. READING PROGRESS BAR
// ============================================================
function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) + '%' : '0%';
    });
}

// ============================================================
// THEME TOGGLE
// ============================================================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const saved = localStorage.getItem('auditx-theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', saved);
    updateThemeIcon(toggle, saved);
    toggle.addEventListener('click', () => {
        const curr = document.documentElement.getAttribute('data-bs-theme');
        const next = curr === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', next);
        localStorage.setItem('auditx-theme', next);
        updateThemeIcon(toggle, next);
        if (typeof AOS !== 'undefined') AOS.refresh();
        initMermaid(); // Re-render mermaid with new theme
    });
}
function updateThemeIcon(btn, theme) {
    const i = btn.querySelector('i');
    if (i) i.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
}

// ============================================================
// SCROLL TOP
// ============================================================
function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
function initNavbarScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'var(--shadow-sm)';
    });
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const animate = el => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const start = performance.now();
        const update = now => {
            const progress = Math.min((now - start) / 2000, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + '+';
        };
        requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================
function initSidebarNavigation() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
            }
        });
    });
}

// ============================================================
// SIDEBAR SCROLL SPY
// ============================================================
function initSidebarScrollSpy() {
    const sections = document.querySelectorAll('[id]');
    const links = document.querySelectorAll('.sidebar-link');
    if (!sections.length || !links.length) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                links.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === `#${id}`) {
                        l.classList.add('active');
                        const sidebar = document.getElementById('docSidebar');
                        if (sidebar) {
                            const linkTop = l.offsetTop;
                            sidebar.scrollTo({ top: linkTop - sidebar.clientHeight / 3, behavior: 'smooth' });
                        }
                    }
                });
            }
        });
    }, { rootMargin: '-100px 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
}

// ============================================================
// 1. INTERACTIVE CONTROL EXPLORER
// ============================================================
function initControlExplorer() {
    document.querySelectorAll('.control-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.control-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.control-card').forEach(card => {
                const show = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = show ? '' : 'none';
                if (show) card.style.animation = 'none';
            });
        });
    });

    document.querySelectorAll('.control-card').forEach(card => {
        card.addEventListener('click', () => {
            const controlId = card.getAttribute('data-control');
            const title = card.querySelector('.control-card-title')?.textContent || '';
            const detailHTML = card.querySelector('.control-card-detail')?.innerHTML || '<p class="text-muted">Click the card to see detailed information.</p>';
            const panel = document.getElementById('controlDetailPanel');
            if (!panel) return;
            document.getElementById('detailControlId').textContent = controlId;
            document.getElementById('detailControlTitle').textContent = title;
            document.getElementById('detailControlBody').innerHTML = detailHTML;
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            document.querySelectorAll('.control-card').forEach(c => c.classList.remove('expanded'));
            card.classList.add('expanded');
        });
    });
}

function closeControlDetail() {
    const panel = document.getElementById('controlDetailPanel');
    if (panel) panel.style.display = 'none';
    document.querySelectorAll('.control-card').forEach(c => c.classList.remove('expanded'));
}

// ============================================================
// 2. GLOBAL SEARCH (Fuse.js)
// ============================================================
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResults');
    const trigger = document.getElementById('searchTrigger');
    const modalEl = document.getElementById('searchModal');
    if (!searchInput || !searchResults || !modalEl) return;

    const searchData = [
        { title: 'Prerequisites', desc: 'System requirements, SAP scripting, security settings, VC++ runtime', page: 'sopdoc.html#sop-prereq', type: 'SOP', icon: 'bi-check2-square' },
        { title: 'Application Login', desc: 'Windows authentication, license validation, CredUI', page: 'sopdoc.html#sop-1', type: 'SOP', icon: 'bi-key' },
        { title: 'Configure SAP System', desc: 'System selection, execution mode, credentials, date range', page: 'sopdoc.html#sop-2', type: 'SOP', icon: 'bi-gear' },
        { title: 'Execute ITGC Control', desc: 'Run individual audit control with SAP GUI scripting and evidence capture', page: 'sopdoc.html#sop-3', type: 'SOP', icon: 'bi-play-circle' },
        { title: 'Execute All Controls Batch', desc: 'Run all 15 active ITGC controls sequentially in one session', page: 'sopdoc.html#sop-4', type: 'SOP', icon: 'bi-collection-play' },
        { title: 'Generate Monthly Report', desc: 'Word report with cover, metadata, summary, detailed records, actions', page: 'sopdoc.html#sop-5', type: 'SOP', icon: 'bi-file-earmark-word' },
        { title: 'RFC System Setup', desc: 'Configure RFC connections, test connectivity, DPAPI password storage', page: 'sopdoc.html#sop-6', type: 'SOP', icon: 'bi-hdd-network' },
        { title: 'User Inactivity Analysis', desc: 'USR02 data fetch, filters, paginated results, Active/Inactive status', page: 'sopdoc.html#sop-7', type: 'SOP', icon: 'bi-person-x' },
        { title: 'Multi-System Analysis', desc: 'Cross-system user comparison, system selection dialog', page: 'sopdoc.html#sop-8', type: 'SOP', icon: 'bi-diagram-3' },
        { title: 'Lock Manage Users', desc: 'BAPI_USER_LOCK, change validity date, change user group to INACTIVE', page: 'sopdoc.html#sop-9', type: 'SOP', icon: 'bi-lock' },
        { title: 'View Filter Logs', desc: 'Log viewer, keyword filter, SUCCESS ERROR EXCEPTION color coding', page: 'sopdoc.html#sop-10', type: 'SOP', icon: 'bi-journal-text' },
        { title: 'Edit ITGC Appendix', desc: 'XML editor, note popups, XML backup on save, Ctrl+S', page: 'sopdoc.html#sop-11', type: 'SOP', icon: 'bi-pencil-square' },
        { title: 'Update Application Settings', desc: 'My.Settings, paths, timing, approved users per control', page: 'sopdoc.html#sop-12', type: 'SOP', icon: 'bi-sliders' },
        { title: 'System Architecture', desc: 'Layered architecture, presentation business data layers', page: 'technicaldoc.html#sec-2', type: 'Technical', icon: 'bi-diagram-2' },
        { title: 'Authentication Security', desc: 'Login flow, CredUI, LogonUser API, DPAPI, license certificate', page: 'technicaldoc.html#sec-3', type: 'Technical', icon: 'bi-shield-lock' },
        { title: 'SAP GUI Scripting', desc: 'COM automation, GetObject SAPGUI, foreground background screenshot modes', page: 'technicaldoc.html#sec-4-1', type: 'Technical', icon: 'bi-display' },
        { title: 'RFC NCo Integration', desc: 'RFC_READ_TABLE, BAPI_USER_LOCK, BAPI_USER_CHANGE, NCo config', page: 'technicaldoc.html#sec-4-2', type: 'Technical', icon: 'bi-plug' },
        { title: 'ITGC Controls Map', desc: 'All 18 controls with SAP transactions and active status', page: 'technicaldoc.html#sec-4-3', type: 'Technical', icon: 'bi-map' },
        { title: 'Data Model', desc: 'SQLite schema SapSystems table, CSV audit format, file directory structure', page: 'technicaldoc.html#sec-5', type: 'Technical', icon: 'bi-database' },
        { title: 'Reporting Engine', desc: 'Word report sections cover metadata summary records actions', page: 'technicaldoc.html#sec-6', type: 'Technical', icon: 'bi-file-richtext' },
        { title: 'Error Handling Logging', desc: 'SUCCESS ERROR EXCEPTION log format stack traces daily files', page: 'technicaldoc.html#sec-7', type: 'Technical', icon: 'bi-bug' },
        { title: 'Deployment Guide', desc: 'Required files checklist, DLLs, prerequisites, startup path', page: 'technicaldoc.html#sec-8', type: 'Technical', icon: 'bi-box-seam' },
        { title: 'DPAPI Encryption', desc: 'ProtectedData Protect Unprotect CurrentUser scope Base64 entropy', page: 'technicaldoc.html#sec-3-3', type: 'Technical', icon: 'bi-key' },
        { title: 'Firebase License Validation', desc: 'REST GET licensed_users CID expiry check AES SHA256', page: 'technicaldoc.html#sec-3-2', type: 'Technical', icon: 'bi-cloud' },
        { title: 'ITGC01 SAP OSS Audit', desc: 'SUIM change documents OSS ID', page: 'index.html#control-explorer', type: 'Control', icon: 'bi-terminal' },
        { title: 'ITGC02 Client Opening', desc: 'SCC4 client change logs production', page: 'index.html#control-explorer', type: 'Control', icon: 'bi-terminal' },
        { title: 'ITGC07 SAP_ALL SAP_NEW', desc: 'Profiles SAP_ALL SAP_NEW Dialog Service users', page: 'index.html#control-explorer', type: 'Control', icon: 'bi-terminal' },
        { title: 'ITGC10 Security Config', desc: '5 checkpoints create users lock roles profiles assignments', page: 'index.html#control-explorer', type: 'Control', icon: 'bi-terminal' },
        { title: 'ITGC18 Parameter Review', desc: 'RZ11 password length expiry lockout scripting audit parameters', page: 'index.html#control-explorer', type: 'Control', icon: 'bi-terminal' },
        { title: 'Visual C++ Redistributable', desc: 'Required for sapnco.dll SAP NCo runtime dependency', page: 'sopdoc.html#sop-prereq', type: 'SOP', icon: 'bi-download' },
        { title: 'SAP Scripting Enable', desc: 'sapgui/user_scripting TRUE RZ11 client server side scripting', page: 'sopdoc.html#sop-prereq', type: 'SOP', icon: 'bi-toggles' },
        { title: 'SAP Security Settings Always Allow', desc: 'Automation directory rule prevent scripting block prompt', page: 'sopdoc.html#sop-prereq', type: 'SOP', icon: 'bi-shield-check' },
        { title: 'Word Report Generation', desc: 'WordReportGenerator cover image metadata summary records action items', page: 'technicaldoc.html#sec-6', type: 'Technical', icon: 'bi-file-earmark-word' },
        { title: 'USR02 Table', desc: 'User logon data creation date validity last login type lock status password', page: 'technicaldoc.html#sec-4-2', type: 'Technical', icon: 'bi-table' },
    ];

    let fuse;
    if (typeof Fuse !== 'undefined') {
        fuse = new Fuse(searchData, {
            keys: ['title', 'desc', 'type'],
            threshold: 0.35,
            distance: 100,
            includeMatches: true,
            minMatchCharLength: 2
        });
    }

    const openSearch = () => {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
        setTimeout(() => { searchInput.value = ''; searchInput.focus(); resetSearchResults(); }, 300);
    };

    if (trigger) trigger.addEventListener('click', openSearch);

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });

    let selectedIndex = -1;

    searchInput.addEventListener('input', () => {
        selectedIndex = -1;
        runSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', e => {
        const items = searchResults.querySelectorAll('.search-result-item');
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); highlightItem(items, selectedIndex); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); highlightItem(items, selectedIndex); }
        else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) { items[selectedIndex].click(); }
    });

    function highlightItem(items, idx) {
        items.forEach((item, i) => item.classList.toggle('active', i === idx));
        if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
    }

    function resetSearchResults() {
        searchResults.innerHTML = `
            <div class="search-hint text-center py-4">
                <i class="bi bi-lightbulb text-warning fs-3 d-block mb-2"></i>
                <p class="text-muted mb-1">Search across Technical Documentation and SOP Guide</p>
                <small class="text-muted">Try: "RFC", "login", "ITGC01", "password", "scripting"</small>
            </div>`;
    }

    function runSearch(query) {
        if (!query || !fuse) { resetSearchResults(); return; }

        const results = fuse.search(query);
        if (!results.length) {
            searchResults.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search text-muted fs-3 d-block mb-2"></i>
                    <p class="text-muted">No results for "<strong>${escapeHtml(query)}</strong>"</p>
                    <small class="text-muted">Try different keywords</small>
                </div>`;
            return;
        }

        const typeColors = {
            'SOP': 'bg-success-subtle text-success',
            'Technical': 'bg-primary-subtle text-primary',
            'Control': 'bg-warning-subtle text-warning'
        };

        searchResults.innerHTML = results.slice(0, 12).map(r => {
            const item = r.item;
            const colorClass = typeColors[item.type] || 'bg-secondary-subtle text-secondary';
            return `
                <a href="${item.page}" class="search-result-item" onclick="bootstrap.Modal.getInstance(document.getElementById('searchModal'))?.hide()">
                    <div class="search-result-icon ${colorClass}"><i class="bi ${item.icon}"></i></div>
                    <div class="flex-grow-1">
                        <div class="search-result-title">${escapeHtml(item.title)}</div>
                        <div class="search-result-desc">${escapeHtml(item.desc)}</div>
                        <span class="search-result-badge ${colorClass}">${item.type}</span>
                    </div>
                    <i class="bi bi-arrow-right-short text-muted"></i>
                </a>`;
        }).join('');
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// 5. GLOSSARY TOOLTIPS
// ============================================================
function initGlossaryTooltips() {
    const glossary = {
        'SUIM': 'User Information System — SAP transaction for analyzing user authorizations, change documents, and access patterns.',
        'RFC': 'Remote Function Call — SAP protocol for calling ABAP functions on remote SAP systems. Used via SAP NCo.',
        'BAPI': 'Business Application Programming Interface — Standardized SAP functions (e.g., BAPI_USER_LOCK, BAPI_USER_CHANGE).',
        'DPAPI': 'Data Protection API — Windows built-in encryption API scoped to CurrentUser. Passwords encrypted with it cannot be moved to another machine.',
        'NCo': 'SAP .NET Connector — Library (sapnco.dll + sapnco_utils.dll) enabling .NET apps to call SAP via RFC.',
        'USR02': 'SAP user logon data table: BNAME (username), ERDAT (created), GLTGB (valid-to), TRDAT (last login), USTYP (type), UFLAG (lock), PWDCHGDATE.',
        'ITGC': 'IT General Controls — Controls applied to IT systems to support business process controls (access, change mgmt, operations).',
        'SCC4': 'Client Administration — SAP transaction for managing client settings and enabling/disabling changes to the production client.',
        'SE16': 'Data Browser — SAP transaction for viewing database table contents. Used in ITGC04 (CDHDR), ITGC06 (DEVACCESS), ITGC16 (TRDIR).',
        'RZ11': 'Profile Parameter Maintenance — View and change SAP system profile parameters like sapgui/user_scripting, login/min_password_lng.',
        'SA38': 'ABAP Program Execution — SAP transaction for running ABAP programs. ITGC14 uses SA38 to run RSUSR003 (default ID password check).',
        'STMS': 'Transport Management System — SAP transaction for managing transport requests and imports to production.',
        'SM37': 'Job Overview — SAP transaction for monitoring and managing SAP background jobs. ITGC12 checks SM37 admin access.',
        'PFCG': 'Role Maintenance — SAP transaction for creating and managing SAP authorization roles.',
    };

    const tooltip = document.getElementById('glossaryTooltip');
    if (!tooltip) return;
    const header = tooltip.querySelector('.glossary-tooltip-header');
    const body = tooltip.querySelector('.glossary-tooltip-body');

    document.querySelectorAll('.glossary-term[data-term]').forEach(term => {
        const key = term.getAttribute('data-term');
        if (!key || !glossary[key]) return;
        term.title = '';

        term.addEventListener('mouseenter', e => {
            header.textContent = key;
            body.textContent = glossary[key];
            tooltip.style.display = 'block';
            positionTooltip(e, tooltip);
        });

        term.addEventListener('mousemove', e => positionTooltip(e, tooltip));
        term.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
    });
}

function positionTooltip(e, tooltip) {
    const w = 320;
    let left = e.clientX + 12;
    let top = e.clientY + 12;
    if (left + w > window.innerWidth) left = e.clientX - w - 12;
    if (top + 120 > window.innerHeight) top = e.clientY - tooltip.offsetHeight - 12;
    tooltip.style.left = Math.max(10, left) + 'px';
    tooltip.style.top = Math.max(10, top) + 'px';
}

// ============================================================
// 8. COPY CODE BUTTONS
// ============================================================
function initCopyCodeButtons() {
    document.querySelectorAll('.code-block').forEach(block => {
        const header = block.querySelector('.code-header');
        if (!header || header.querySelector('.copy-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-light copy-btn ms-auto';
        btn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        btn.title = 'Copy to clipboard';
        btn.addEventListener('click', () => copyCode(btn));
        header.appendChild(btn);
    });
}

function copyCode(btn) {
    const block = btn.closest('.code-block');
    if (!block) return;
    const code = block.querySelector('pre code') || block.querySelector('pre');
    if (!code) return;
    const text = code.textContent || '';
    const icon = btn.querySelector('i');

    navigator.clipboard.writeText(text).then(() => {
        icon.className = 'bi bi-check-lg';
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
        btn.classList.add('text-success');
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
            btn.classList.remove('text-success');
        }, 2000);
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
        setTimeout(() => { btn.innerHTML = '<i class="bi bi-clipboard"></i> Copy'; }, 2000);
    });
}

// ============================================================
// 6. MERMAID.JS FLOWCHARTS
// ============================================================
function initMermaid() {
    if (typeof mermaid === 'undefined') return;
    const theme = document.documentElement.getAttribute('data-bs-theme');
    mermaid.initialize({
        startOnLoad: true,
        theme: theme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        flowchart: { curve: 'basis', htmlLabels: true, padding: 15 },
    });
    // Re-render existing diagrams
    try { mermaid.contentLoaded(); } catch (e) {}
}

// ============================================================
// IMAGE LIGHTBOX
// ============================================================
function initImageLightbox() {
    document.querySelectorAll('.screenshot-img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            if (this.classList.contains('zoomed')) {
                closeLightbox(this);
            } else {
                document.querySelectorAll('.screenshot-img.zoomed').forEach(i => closeLightbox(i));
                this.classList.add('zoomed');
                document.body.style.overflow = 'hidden';
                this.style.cursor = 'zoom-out';
            }
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.classList.contains('screenshot-img')) {
            document.querySelectorAll('.screenshot-img.zoomed').forEach(img => closeLightbox(img));
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.screenshot-img.zoomed').forEach(img => closeLightbox(img));
        }
    });
}

function closeLightbox(img) {
    img.classList.remove('zoomed');
    img.style.cursor = 'zoom-in';
    document.body.style.overflow = '';
}

// ============================================================
// 9. SERVICE WORKER (PWA Offline)
// ============================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

// ============================================================
// PDF EXPORT
// ============================================================
function exportPageAsPDF(fileName) {
    const modal = document.getElementById('pdfModal');
    let bsModal = null;
    if (modal) { bsModal = new bootstrap.Modal(modal); bsModal.show(); }

    const element = document.getElementById('printableArea') || document.querySelector('.doc-content') || document.body;
    const clone = element.cloneNode(true);

    clone.querySelectorAll('button, .btn, .scroll-top-btn, .control-filter-tabs, .video-thumbnail').forEach(el => el.style.display = 'none');

    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;left:-9999px;top:0;width:210mm;padding:12mm;background:white;color:#1a1a1a;font-family:Inter,sans-serif;font-size:10pt;';
    container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:3px solid #0078D4;margin-bottom:20px;">
            <div><div style="font-size:22px;font-weight:800;color:#0078D4;">AuditX</div>
            <div style="font-size:11px;color:#666;">ITGC Audit Automation Framework</div></div>
            <div style="text-align:right;font-size:10px;color:#666;">
                <div>Generated: ${new Date().toLocaleString()}</div>
                <div>Document: ${fileName || 'AuditX Documentation'}</div>
            </div>
        </div>`;
    container.appendChild(clone);
    container.innerHTML += `
        <div style="margin-top:30px;padding-top:12px;border-top:1px solid #ddd;text-align:center;">
            <div style="font-size:9px;color:#aaa;">&copy; 2025 Void Automation — AuditX Documentation Portal — CONFIDENTIAL</div>
        </div>`;

    document.body.appendChild(container);

    html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: `${fileName || 'AuditX'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).from(container).save().then(() => {
        document.body.removeChild(container);
        if (bsModal) setTimeout(() => bsModal.hide(), 500);
    }).catch(() => {
        document.body.removeChild(container);
        if (bsModal) bsModal.hide();
        alert('PDF failed. Use Ctrl+P to print instead.');
    });
}

// ============================================================
// PARTICLES (Hero only)
// ============================================================
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    canvas.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    let particles = [], animId;

    const resize = () => { cvs.width = canvas.offsetWidth; cvs.height = canvas.offsetHeight; };
    const create = () => {
        particles = [];
        const n = Math.min(40, Math.floor((cvs.width * cvs.height) / 20000));
        for (let i = 0; i < n; i++) {
            particles.push({ x: Math.random() * cvs.width, y: Math.random() * cvs.height, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + .5, a: Math.random() * .3 + .1 });
        }
    };
    const draw = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
            if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,180,216,${p.a})`; ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 150) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,180,216,${.06 * (1 - d / 150)})`; ctx.lineWidth = .5; ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(draw);
    };
    resize(); create(); draw();
    window.addEventListener('resize', () => { resize(); create(); });
    window.addEventListener('beforeunload', () => cancelAnimationFrame(animId));
})();