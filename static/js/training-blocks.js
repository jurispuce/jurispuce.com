/**
 * training-blocks.js
 *
 * Handles:
 *  - Path view toggle (Flow View ↔ Sequential/Blocks View)
 *  - Blocks accordion expand/collapse
 *  - Block progress indicators driven by ProgressTracker
 *  - Split-screen player: drag-to-resize, expand-HTML, open-in-new-tab
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     VIEW TOGGLE  (Flow ↔ Sequential)
  ───────────────────────────────────────────────────────────── */

  function initViewToggle() {
    const toggleBtns = document.querySelectorAll('.view-toggle-btn');
    if (!toggleBtns.length) return;

    const flowSection   = document.getElementById('flow-diagram-section');
    const blocksSection = document.getElementById('blocks-section');

    // Restore last chosen view from sessionStorage
    const savedView = sessionStorage.getItem('trainingPathView') || 'flow';
    applyView(savedView);

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const view = btn.dataset.view;
        applyView(view);
        sessionStorage.setItem('trainingPathView', view);
      });
    });

    function applyView(view) {
      toggleBtns.forEach(function (b) {
        const active = b.dataset.view === view;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (flowSection) {
        flowSection.style.display = view === 'flow' ? '' : 'none';
      }
      if (blocksSection) {
        blocksSection.style.display = view === 'blocks' ? '' : 'none';
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     BLOCKS ACCORDION
  ───────────────────────────────────────────────────────────── */

  function initBlocksAccordion() {
    const headers = document.querySelectorAll('.block-header');
    if (!headers.length) return;

    headers.forEach(function (btn) {
      const contentId = btn.getAttribute('aria-controls');
      const content   = document.getElementById(contentId);
      if (!content) return;

      btn.addEventListener('click', function () {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) {
          content.setAttribute('hidden', '');
        } else {
          content.removeAttribute('hidden');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     BLOCK PROGRESS (reads from ProgressTracker if available)
  ───────────────────────────────────────────────────────────── */

  function initBlockProgress() {
    const blocksView = document.getElementById('blocks-view');
    if (!blocksView) return;

    const pathId = blocksView.dataset.pathId;
    if (!pathId || !window.ProgressTracker) return;

    const blockItems = blocksView.querySelectorAll('.block-item');

    blockItems.forEach(function (block) {
      const blockId = block.dataset.blockId;
      const moduleRows = block.querySelectorAll('.block-module');
      const totalModules = moduleRows.length;
      let completedCount = 0;

      moduleRows.forEach(function (row) {
        const moduleId = row.dataset.moduleId;
        const status   = window.ProgressTracker.getModuleStatus(pathId, moduleId);

        row.dataset.moduleStatus = status;

        const indicator = row.querySelector('[data-status-for="' + moduleId + '"]');
        if (indicator) indicator.dataset.status = status;

        if (status === 'completed') completedCount++;
      });

      // Update progress badge
      const badge = block.querySelector('[data-block-progress="' + blockId + '"]');
      if (badge) badge.textContent = completedCount + ' / ' + totalModules;

      // Update completion bar
      const fill  = block.querySelector('[data-block-fill="' + blockId + '"]');
      const label = block.querySelector('[data-block-label="' + blockId + '"]');
      const pct   = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

      if (fill)  fill.style.width = pct + '%';
      if (label) label.textContent = completedCount + ' of ' + totalModules + ' modules complete';
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SPLIT-SCREEN PLAYERS
  ───────────────────────────────────────────────────────────── */

  function initSplitPlayers() {
    const players = document.querySelectorAll('.split-player');
    if (!players.length) return;

    players.forEach(function (player) {
      const id = player.dataset.contentId;
      if (!id) return;

      const panels     = player.querySelector('#split-panels-' + id);
      const videoPanel = player.querySelector('#split-video-' + id);
      const htmlPanel  = player.querySelector('#split-html-'  + id);
      const handle     = player.querySelector('#split-handle-' + id);
      const expandBtn  = player.querySelector('#split-expand-html-' + id);
      const newTabBtn  = player.querySelector('#split-new-tab-'  + id);
      const resetBtn   = player.querySelector('#split-reset-'    + id);

      if (!panels || !videoPanel || !htmlPanel) return;

      let isExpanded = false;

      /* ── Expand / collapse HTML ── */
      if (expandBtn) {
        expandBtn.addEventListener('click', function () {
          isExpanded = !isExpanded;
          panels.classList.toggle('html-expanded', isExpanded);
          expandBtn.title = isExpanded ? 'Show video panel' : 'Expand HTML panel to full width';

          // Update button icon label
          const svg = expandBtn.querySelector('svg');
          if (isExpanded) {
            // Show compress icon
            svg.innerHTML =
              '<polyline points="4 14 10 14 10 20"/>' +
              '<polyline points="20 10 14 10 14 4"/>' +
              '<line x1="10" y1="14" x2="3" y2="21"/>' +
              '<line x1="21" y1="3" x2="14" y2="10"/>';
            expandBtn.childNodes[expandBtn.childNodes.length - 1].textContent = ' Show Video';
          } else {
            svg.innerHTML =
              '<polyline points="15 3 21 3 21 9"/>' +
              '<polyline points="9 21 3 21 3 15"/>' +
              '<line x1="21" y1="3" x2="14" y2="10"/>' +
              '<line x1="3" y1="21" x2="10" y2="14"/>';
            expandBtn.childNodes[expandBtn.childNodes.length - 1].textContent = ' Expand HTML';
          }
        });
      }

      /* ── Open HTML in new tab ── */
      if (newTabBtn) {
        newTabBtn.addEventListener('click', function () {
          const htmlSrc = player.dataset.htmlFile
            ? '/' + player.dataset.htmlFile
            : player.dataset.htmlUrl;
          if (htmlSrc) window.open(htmlSrc, '_blank', 'noopener');
        });
      }

      /* ── Reset panel sizes ── */
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          videoPanel.style.width = '33.333%';
          htmlPanel.style.width  = '66.666%';
          if (isExpanded) {
            isExpanded = false;
            panels.classList.remove('html-expanded');
          }
        });
      }

      /* ── Drag-to-resize handle ── */
      if (handle) {
        initDragHandle(panels, videoPanel, htmlPanel, handle);
      }
    });
  }

  function initDragHandle(panels, videoPanel, htmlPanel, handle) {
    let dragging = false;
    let startX   = 0;
    let startVW  = 0;  // video panel width in px at drag start
    let totalW   = 0;

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: true });

    function startDrag(e) {
      dragging = true;
      handle.classList.add('dragging');
      totalW  = panels.getBoundingClientRect().width;
      startVW = videoPanel.getBoundingClientRect().width;
      startX  = clientX(e);

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('mouseup',   stopDrag);
      document.addEventListener('touchend',  stopDrag);

      // Prevent iframe capturing pointer events during drag
      const iframes = panels.querySelectorAll('iframe');
      iframes.forEach(function (f) { f.style.pointerEvents = 'none'; });

      e.preventDefault();
    }

    function onDrag(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();

      const dx  = clientX(e) - startX;
      const handleW = handle.offsetWidth;
      const avail   = totalW - handleW;

      let newVW = startVW + dx;
      // Clamp: min 150px each side
      newVW = Math.max(150, Math.min(avail - 150, newVW));

      const vPct = (newVW / avail) * 100;
      const hPct = 100 - vPct;

      videoPanel.style.width = vPct + '%';
      htmlPanel.style.width  = hPct + '%';
    }

    function stopDrag() {
      dragging = false;
      handle.classList.remove('dragging');

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup',   stopDrag);
      document.removeEventListener('touchend',  stopDrag);

      const iframes = panels.querySelectorAll('iframe');
      iframes.forEach(function (f) { f.style.pointerEvents = ''; });
    }

    function clientX(e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────────── */

  function init() {
    initViewToggle();
    initBlocksAccordion();
    initSplitPlayers();

    // Progress needs ProgressTracker which may load async
    if (window.ProgressTracker) {
      initBlockProgress();
    } else {
      document.addEventListener('progressTrackerReady', initBlockProgress);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
