/**
 * Course access: fetches short-lived signed URLs from Supabase Storage
 * for files a signed-in, allowlisted user is permitted to read.
 *
 * Supports two modes:
 *   openCourseFile()       – opens lesson in a new tab (legacy + blocks)
 *   openCourseFileInline() – loads lesson into the inline split-screen viewer
 *
 * Both modes derive the Supabase storage path as:
 *   <bucket>/<slug>/<storagePath>
 * where storagePath is now block-prefixed: "01_it-systems/01_file.html"
 */
(function () {
  'use strict';

  const SIGNED_URL_TTL_SECONDS = 300;

  let supabaseClient = null;

  // ── Supabase client ───────────────────────────────────────────

  function getClient() {
    if (supabaseClient) return supabaseClient;
    // Prefer the shared client owned by auth.js to avoid creating
    // multiple GoTrueClient instances against the same storage key.
    if (window.Auth?.getClient) {
      const shared = window.Auth.getClient();
      if (shared) {
        supabaseClient = shared;
        return supabaseClient;
      }
    }
    const config = window.SUPABASE_CONFIG;
    if (!window.supabase || !config) return null;
    if (!config.url || config.url.includes('your-project-id')) return null;
    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    return supabaseClient;
  }

  // ── Helpers ───────────────────────────────────────────────────

  function courseRoot(el) {
    return el.closest('.course-single');
  }

  function courseSlugAndBucket(root) {
    return {
      slug:   root?.dataset.courseSlug,
      bucket: root?.dataset.courseBucket || 'course-materials',
    };
  }

  function setLessonStatus(lessonEl, message, kind) {
    const el = lessonEl.querySelector('.cblock__lesson-status-msg, .course-file__status');
    if (!el) return;
    el.textContent = message;
    el.dataset.kind = kind || 'info';
    el.hidden = false;
  }

  function clearLessonStatus(lessonEl) {
    const el = lessonEl.querySelector('.cblock__lesson-status-msg, .course-file__status');
    if (!el) return;
    el.textContent = '';
    el.hidden = true;
  }

  /**
   * Fetch a signed URL + convert HTML to a blob URL.
   * Returns { blobUrl, signedUrl } on success, throws on error.
   */
  async function fetchBlobUrl(slug, bucket, filePath) {
    const client = getClient();
    if (!client) throw new Error('Sign-in is not configured yet.');

    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData?.session) {
      if (window.Auth) window.Auth.openAuthModal();
      throw new Error('Please sign in with your invited email first.');
    }

    // Pre-check allowlist. Storage RLS hides unauthorised objects as
    // "Object not found", which is indistinguishable from a real missing
    // file — so we check course_access first to give a clear message.
    const userEmail = sessionData.session.user?.email || '';
    const { data: accessRows, error: accessErr } = await client
      .from('course_access')
      .select('course_slug')
      .eq('course_slug', slug)
      .limit(1);
    if (!accessErr && (!accessRows || accessRows.length === 0)) {
      throw new Error(
        `Your account (${userEmail}) is not authorised for this course. ` +
        `If you have an invitation under a different email, sign out and sign in with that address. ` +
        `Otherwise contact the course owner.`
      );
    }

    const remotePath = `${slug}/${filePath}`;
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(remotePath, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      const raw = error?.message || '';
      const friendly = /permission|row-level security|denied|not authorized/i.test(raw)
        ? `Your account (${userEmail}) is not authorised for this course. Sign in with the invited email or contact the course owner.`
        : /not found|object not found|does not exist/i.test(raw)
          ? 'This file is not available.'
          : raw || 'Could not open this file.';
      throw new Error(friendly);
    }

    if (/\.html?$/i.test(filePath)) {
      const resp = await fetch(data.signedUrl);
      if (!resp.ok) throw new Error('Could not load the file. Try again.');
      const blob    = await resp.blob();
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'text/html' }));
      return { blobUrl, signedUrl: data.signedUrl };
    }

    return { blobUrl: data.signedUrl, signedUrl: data.signedUrl };
  }

  // ── New-tab mode (legacy + blocks "New Tab" button) ───────────

  async function openCourseFile(btn) {
    const lessonEl = btn.closest('.course-file, .cblock__lesson');
    const root     = courseRoot(btn);
    if (!lessonEl || !root) return;

    clearLessonStatus(lessonEl);

    const { slug, bucket } = courseSlugAndBucket(root);
    const filePath = btn.dataset.filePath;
    if (!slug || !filePath) return;

    btn.setAttribute('aria-busy', 'true');
    try {
      const { blobUrl } = await fetchBlobUrl(slug, bucket, filePath);
      window.open(blobUrl, '_blank', 'noopener');
    } catch (err) {
      setLessonStatus(lessonEl, err.message, 'error');
    } finally {
      btn.removeAttribute('aria-busy');
    }
  }

  // ── Inline viewer mode ────────────────────────────────────────

  const viewer = {
    el:         null,
    backdrop:   null,
    titleEl:    null,
    panels:     null,
    videoPanel: null,
    videoIframe:null,
    htmlPanel:  null,
    htmlIframe: null,
    loadingEl:  null,
    errorEl:    null,
    errorMsgEl: null,
    handle:     null,
    expandBtn:  null,
    newTabBtn:  null,
    resetBtn:   null,
    closeBtn:   null,
    retryBtn:   null,
    // state
    currentFilePath: null,
    currentSlug:     null,
    currentBucket:   null,
    isExpanded:      false,
  };

  function initViewer() {
    viewer.el          = document.getElementById('course-inline-viewer');
    viewer.backdrop    = document.getElementById('cviewer-backdrop');
    if (!viewer.el) return;

    viewer.titleEl     = document.getElementById('cviewer-title');
    viewer.panels      = document.getElementById('cviewer-panels');
    viewer.videoPanel  = document.getElementById('cviewer-video-panel');
    viewer.videoIframe = document.getElementById('cviewer-video-iframe');
    viewer.htmlPanel   = document.getElementById('cviewer-html-panel');
    viewer.htmlIframe  = document.getElementById('cviewer-html-iframe');
    viewer.loadingEl   = document.getElementById('cviewer-loading');
    viewer.errorEl     = document.getElementById('cviewer-error');
    viewer.errorMsgEl  = document.getElementById('cviewer-error-msg');
    viewer.handle      = document.getElementById('cviewer-handle');
    viewer.expandBtn   = document.getElementById('cviewer-expand-btn');
    viewer.newTabBtn   = document.getElementById('cviewer-newtab-btn');
    viewer.resetBtn    = document.getElementById('cviewer-reset-btn');
    viewer.closeBtn    = document.getElementById('cviewer-close-btn');
    viewer.retryBtn    = document.getElementById('cviewer-retry-btn');

    viewer.closeBtn?.addEventListener('click', closeViewer);
    viewer.backdrop?.addEventListener('click', closeViewer);
    viewer.expandBtn?.addEventListener('click', toggleExpand);
    viewer.resetBtn?.addEventListener('click', resetPanels);
    viewer.newTabBtn?.addEventListener('click', openCurrentInNewTab);
    viewer.retryBtn?.addEventListener('click', retryLoad);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !viewer.el.hidden) closeViewer();
    });

    if (viewer.handle) initDragHandle();
  }

  function openViewer(filePath, videoUrl, title, slug, bucket) {
    viewer.currentFilePath = filePath;
    viewer.currentSlug     = slug;
    viewer.currentBucket   = bucket;

    if (viewer.titleEl) viewer.titleEl.textContent = title || filePath;

    // Video panel: show only when a videoUrl is provided
    if (viewer.videoPanel && viewer.htmlPanel && viewer.handle) {
      const hasVideo = !!videoUrl;
      viewer.videoPanel.hidden = !hasVideo;
      viewer.handle.hidden     = !hasVideo;
      if (hasVideo) {
        viewer.videoPanel.style.width = '33.333%';
        viewer.htmlPanel.style.width  = '66.666%';
        viewer.videoIframe.src = videoUrl;
      } else {
        viewer.htmlPanel.style.width = '100%';
        viewer.videoIframe.src = '';
      }
    }

    // Reset expand state
    viewer.isExpanded = false;
    viewer.panels?.classList.remove('cviewer-expanded');
    if (viewer.expandBtn) {
      viewer.expandBtn.title = 'Expand HTML to full width';
      // reset icon
      const svg = viewer.expandBtn.querySelector('svg');
      if (svg) svg.innerHTML =
        '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>' +
        '<line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>';
    }

    // Show viewer + backdrop
    viewer.el.hidden      = false;
    if (viewer.backdrop) viewer.backdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    loadIntoViewer(filePath, slug, bucket);
  }

  async function loadIntoViewer(filePath, slug, bucket) {
    // Show loading state
    if (viewer.loadingEl)  viewer.loadingEl.hidden  = false;
    if (viewer.errorEl)    viewer.errorEl.hidden     = true;
    if (viewer.htmlIframe) viewer.htmlIframe.hidden  = true;

    try {
      const { blobUrl } = await fetchBlobUrl(slug, bucket, filePath);
      viewer.htmlIframe.src    = blobUrl;
      viewer.htmlIframe.hidden = false;
      if (viewer.loadingEl) viewer.loadingEl.hidden = true;
    } catch (err) {
      if (viewer.loadingEl)    viewer.loadingEl.hidden  = true;
      if (viewer.errorEl)      viewer.errorEl.hidden     = false;
      if (viewer.errorMsgEl)   viewer.errorMsgEl.textContent = err.message;
    }
  }

  function closeViewer() {
    viewer.el.hidden      = true;
    if (viewer.backdrop) viewer.backdrop.hidden = true;
    document.body.style.overflow = '';
    // Clear iframe src to stop any ongoing content
    if (viewer.videoIframe) viewer.videoIframe.src = '';
    if (viewer.htmlIframe)  viewer.htmlIframe.src  = '';
  }

  function retryLoad() {
    if (viewer.currentFilePath) {
      loadIntoViewer(viewer.currentFilePath, viewer.currentSlug, viewer.currentBucket);
    }
  }

  async function openCurrentInNewTab() {
    if (!viewer.currentFilePath) return;
    try {
      const { blobUrl } = await fetchBlobUrl(
        viewer.currentSlug, viewer.currentBucket, viewer.currentFilePath
      );
      window.open(blobUrl, '_blank', 'noopener');
    } catch (err) {
      // fallback: nothing to show, error already visible in viewer
    }
  }

  function toggleExpand() {
    if (!viewer.videoPanel || !viewer.htmlPanel || !viewer.handle) return;
    viewer.isExpanded = !viewer.isExpanded;

    const hasVideo = !viewer.videoPanel.hidden;

    if (viewer.isExpanded && hasVideo) {
      viewer.videoPanel.hidden = true;
      viewer.handle.hidden     = true;
      viewer.htmlPanel.style.width = '100%';
      viewer.expandBtn.title = 'Show video panel';
      const svg = viewer.expandBtn.querySelector('svg');
      if (svg) svg.innerHTML =
        '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>' +
        '<line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>';
    } else {
      viewer.videoPanel.hidden = !hasVideo && !viewer.isExpanded;
      if (hasVideo) viewer.videoPanel.hidden = false;
      viewer.handle.hidden     = !hasVideo;
      viewer.videoPanel.style.width = hasVideo ? '33.333%' : '0%';
      viewer.htmlPanel.style.width  = hasVideo ? '66.666%' : '100%';
      viewer.expandBtn.title = 'Expand HTML to full width';
      const svg = viewer.expandBtn.querySelector('svg');
      if (svg) svg.innerHTML =
        '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>' +
        '<line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>';
      viewer.isExpanded = false;
    }
  }

  function resetPanels() {
    if (!viewer.videoPanel || !viewer.htmlPanel || !viewer.handle) return;
    const hasVideo = viewer.videoIframe?.src && viewer.videoIframe.src !== window.location.href;
    if (hasVideo) {
      viewer.videoPanel.hidden      = false;
      viewer.handle.hidden          = false;
      viewer.videoPanel.style.width = '33.333%';
      viewer.htmlPanel.style.width  = '66.666%';
    } else {
      viewer.htmlPanel.style.width = '100%';
    }
    viewer.isExpanded = false;
  }

  function initDragHandle() {
    const handle = viewer.handle;
    let dragging = false;
    let startX = 0;
    let startVW = 0;

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
      if (viewer.videoPanel.hidden) return;
      dragging = true;
      handle.classList.add('dragging');
      startX  = clientX(e);
      startVW = viewer.videoPanel.getBoundingClientRect().width;

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('mouseup',   stopDrag);
      document.addEventListener('touchend',  stopDrag);

      viewer.panels.querySelectorAll('iframe').forEach(f => { f.style.pointerEvents = 'none'; });
      if (e.cancelable) e.preventDefault();
    }

    function onDrag(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();

      const totalW  = viewer.panels.getBoundingClientRect().width;
      const handleW = handle.offsetWidth;
      const avail   = totalW - handleW;
      const dx      = clientX(e) - startX;
      const newVW   = Math.max(150, Math.min(avail - 150, startVW + dx));

      viewer.videoPanel.style.width = (newVW / avail * 100) + '%';
      viewer.htmlPanel.style.width  = ((avail - newVW) / avail * 100) + '%';
    }

    function stopDrag() {
      dragging = false;
      handle.classList.remove('dragging');
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup',   stopDrag);
      document.removeEventListener('touchend',  stopDrag);
      viewer.panels.querySelectorAll('iframe').forEach(f => { f.style.pointerEvents = ''; });
    }

    function clientX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
  }

  // ── Block accordion ───────────────────────────────────────────

  function initBlockAccordion() {
    document.querySelectorAll('.cblock__header').forEach(function (btn) {
      const contentId = btn.getAttribute('aria-controls');
      const body      = document.getElementById(contentId);
      if (!body) return;
      btn.addEventListener('click', function () {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
      });
    });
  }

  // ── Block button wiring ───────────────────────────────────────

  function wireBlockButtons() {
    // "View" (inline) buttons
    document.querySelectorAll('[data-inline-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const lessonEl = btn.closest('.cblock__lesson');
        const root     = courseRoot(btn);
        if (!lessonEl || !root) return;

        const { slug, bucket } = courseSlugAndBucket(root);
        const filePath  = btn.dataset.filePath;
        const videoUrl  = btn.dataset.videoUrl  || '';
        const titleEl   = lessonEl.querySelector('.cblock__lesson-title');
        const title     = titleEl ? titleEl.textContent.trim() : filePath;

        clearLessonStatus(lessonEl);
        openViewer(filePath, videoUrl, title, slug, bucket);
      });
    });

    // "New Tab" buttons inside blocks
    document.querySelectorAll('.cblock__btn--tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openCourseFile(btn);
      });
    });
  }

  // ── Legacy flat-list buttons ──────────────────────────────────

  function wireFileButtons() {
    document.querySelectorAll('.course-file__open[data-file-path]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openCourseFile(btn);
      });
    });
  }

  // ── Search (works across both list and block view) ────────────

  function wireSearch() {
    const input = document.querySelector('[data-course-search]');
    if (!input) return;

    // Collect both legacy items and block lesson rows
    const legacyItems  = Array.from(document.querySelectorAll('.course-file'));
    const lessonItems  = Array.from(document.querySelectorAll('.cblock__lesson'));
    const blockHeaders = Array.from(document.querySelectorAll('.cblock'));

    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();

      // Legacy list
      legacyItems.forEach(item => {
        item.hidden = !!(q && !item.textContent.toLowerCase().includes(q));
      });

      // Block lessons: hide lesson rows, then hide blocks with no visible lessons
      lessonItems.forEach(item => {
        item.hidden = !!(q && !item.textContent.toLowerCase().includes(q));
      });

      blockHeaders.forEach(function (block) {
        if (!q) { block.hidden = false; return; }
        const anyVisible = Array.from(block.querySelectorAll('.cblock__lesson'))
          .some(l => !l.hidden);
        block.hidden = !anyVisible;
      });
    });
  }

  // ── Auth state gating ─────────────────────────────────────────

  function applyAuthState() {
    const loggedIn = !!(window.Auth && window.Auth.isLoggedIn && window.Auth.isLoggedIn());
    document.querySelectorAll('[data-show-when]').forEach(function (el) {
      const wants   = el.dataset.showWhen;
      const visible = (wants === 'logged-in' && loggedIn) || (wants === 'logged-out' && !loggedIn);
      el.hidden = !visible;
    });
  }

  // ── Private-course catalog visibility ─────────────────────────
  //
  // Cards rendered with `data-course-private="true"` start `hidden`.
  // For a logged-in user we read their `course_access` rows once and
  // unhide cards whose slug is in the set. File access is independently
  // gated by storage RLS — this only controls catalog discovery.

  async function applyPrivateCourseVisibility() {
    const cards = document.querySelectorAll('[data-course-private="true"]');
    if (cards.length === 0) return;

    const loggedIn = !!(window.Auth && window.Auth.isLoggedIn && window.Auth.isLoggedIn());
    if (!loggedIn) {
      cards.forEach(c => { c.hidden = true; });
      return;
    }

    const client = getClient();
    if (!client) return;

    const { data, error } = await client
      .from('course_access')
      .select('course_slug');
    if (error) return;

    const allowed = new Set((data || []).map(r => r.course_slug));
    cards.forEach(c => {
      c.hidden = !allowed.has(c.dataset.courseSlug);
    });
  }

  // ── Boot ──────────────────────────────────────────────────────

  function init() {
    if (!document.querySelector('.course-single')) {
      applyAuthState();
      applyPrivateCourseVisibility();
      document.addEventListener('userLoggedIn',  applyPrivateCourseVisibility);
      document.addEventListener('userLoggedOut', applyPrivateCourseVisibility);
      return;
    }

    initViewer();
    initBlockAccordion();
    wireBlockButtons();
    wireFileButtons();
    wireSearch();
    applyAuthState();
    applyPrivateCourseVisibility();

    document.addEventListener('userLoggedIn',  applyAuthState);
    document.addEventListener('userLoggedOut', applyAuthState);
    document.addEventListener('userLoggedIn',  applyPrivateCourseVisibility);
    document.addEventListener('userLoggedOut', applyPrivateCourseVisibility);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
