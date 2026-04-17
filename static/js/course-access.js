/**
 * Course access: fetches short-lived signed URLs from Supabase Storage
 * for files a signed-in, allowlisted user is permitted to read.
 *
 * Wiring:
 *   * layouts/courses/single.html renders a <section class="course-single">
 *     with data-course-slug and data-course-bucket, plus file buttons
 *     carrying data-file-path.
 *   * auth.js already manages the OTP session; we reuse that session by
 *     creating a second Supabase client with the same publishable key
 *     (session is stored in localStorage and shared across instances).
 *   * RLS on storage.objects enforces the allowlist — this script just
 *     surfaces the result as a signed URL or a friendly error.
 */
(function () {
  'use strict';

  const SIGNED_URL_TTL_SECONDS = 300;

  let supabaseClient = null;

  function getClient() {
    if (supabaseClient) return supabaseClient;
    const config = window.SUPABASE_CONFIG;
    if (!window.supabase || !config) return null;
    if (!config.url || config.url.includes('your-project-id')) return null;
    supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    return supabaseClient;
  }

  function showStatus(fileEl, message, kind) {
    const status = fileEl.querySelector('.course-file__status');
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind || 'info';
    status.hidden = false;
  }

  function clearStatus(fileEl) {
    const status = fileEl.querySelector('.course-file__status');
    if (!status) return;
    status.textContent = '';
    status.hidden = true;
  }

  async function openCourseFile(btn) {
    const fileEl = btn.closest('.course-file');
    const root = btn.closest('.course-single');
    if (!fileEl || !root) return;

    clearStatus(fileEl);

    const slug = root.dataset.courseSlug;
    const bucket = root.dataset.courseBucket || 'course-materials';
    const filePath = btn.dataset.filePath;
    if (!slug || !filePath) return;

    const client = getClient();
    if (!client) {
      showStatus(fileEl, 'Sign-in is not configured yet.', 'error');
      return;
    }

    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData?.session) {
      showStatus(fileEl, 'Please sign in with your invited email first.', 'error');
      if (window.Auth) window.Auth.openAuthModal();
      return;
    }

    btn.setAttribute('aria-busy', 'true');
    const remotePath = `${slug}/${filePath}`;
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(remotePath, SIGNED_URL_TTL_SECONDS);
    btn.removeAttribute('aria-busy');

    if (error || !data?.signedUrl) {
      const raw = error?.message || '';
      const friendly = /not found|object not found|does not exist/i.test(raw)
        ? 'This file is not available.'
        : /permission|row-level security|denied|not authorized/i.test(raw)
          ? 'This email is not on the allowlist for this course. Contact the course owner if you believe this is a mistake.'
          : raw || 'Could not open this file.';
      showStatus(fileEl, friendly, 'error');
      return;
    }

    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  }

  function applyAuthState() {
    const loggedIn = !!(window.Auth && window.Auth.isLoggedIn && window.Auth.isLoggedIn());
    document.querySelectorAll('[data-show-when]').forEach((el) => {
      const wants = el.dataset.showWhen;
      const visible = (wants === 'logged-in' && loggedIn) || (wants === 'logged-out' && !loggedIn);
      el.hidden = !visible;
    });
  }

  function wireSearch() {
    const input = document.querySelector('[data-course-search]');
    if (!input) return;
    const items = Array.from(document.querySelectorAll('.course-file'));
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      items.forEach((item) => {
        const hay = item.textContent.toLowerCase();
        item.hidden = q && !hay.includes(q);
      });
    });
  }

  function wireFileButtons() {
    document.querySelectorAll('.course-file__open[data-file-path]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCourseFile(btn);
      });
    });
  }

  function init() {
    if (!document.querySelector('.course-single')) {
      applyAuthState();
      return;
    }
    wireFileButtons();
    wireSearch();
    applyAuthState();
    document.addEventListener('userLoggedIn', applyAuthState);
    document.addEventListener('userLoggedOut', applyAuthState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
