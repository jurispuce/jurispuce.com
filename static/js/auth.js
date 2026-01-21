/**
 * Authentication Module
 * Handles user authentication using Supabase
 */

(function() {
  'use strict';

  // Supabase client instance
  let supabase = null;

  // Current user state
  let currentUser = null;

  // DOM Elements
  const elements = {
    authModal: null,
    authForm: null,
    googleBtn: null,
    emailInput: null,
    nameInput: null,
    nameGroup: null,
    toggleBtn: null,
    toggleText: null,
    closeBtn: null,
    userMenu: null,
    authMessage: null
  };

  // Auth mode: 'signin' or 'signup'
  let authMode = 'signin';

  /**
   * Initialize the authentication module
   */
  function init() {
    // Check if Supabase is available
    if (typeof window.supabase === 'undefined') {
      console.warn('Supabase client not loaded. Auth features disabled.');
      initLocalStorageMode();
      return;
    }

    // Initialize Supabase client
    const config = window.SUPABASE_CONFIG;
    if (!config || config.url === 'https://your-project-id.supabase.co') {
      console.warn('Supabase not configured. Running in local storage mode.');
      initLocalStorageMode();
      return;
    }

    supabase = window.supabase.createClient(config.url, config.anonKey);

    // Cache DOM elements
    cacheElements();

    // Setup event listeners
    setupEventListeners();

    // Check for existing session
    checkSession();

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(handleAuthStateChange);
  }

  /**
   * Initialize local storage mode (when Supabase is not configured)
   */
  function initLocalStorageMode() {
    cacheElements();
    setupEventListeners();

    // Check for local user
    const localUser = localStorage.getItem('training_user');
    if (localUser) {
      currentUser = JSON.parse(localUser);
      updateUIForLoggedInUser();
    } else {
      updateUIForLoggedOutUser();
    }
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    elements.authModal = document.getElementById('auth-modal');
    elements.authForm = document.getElementById('email-auth-form');
    elements.googleBtn = document.getElementById('google-signin');
    elements.emailInput = document.getElementById('auth-email');
    elements.nameInput = document.getElementById('auth-name');
    elements.nameGroup = document.getElementById('name-group');
    elements.toggleBtn = document.getElementById('auth-toggle');
    elements.toggleText = document.getElementById('auth-toggle-text');
    elements.closeBtn = document.querySelector('.auth-modal__close');
    elements.userMenu = document.getElementById('user-menu');
    elements.authMessage = document.getElementById('auth-message');
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Sign in buttons throughout the page
    document.querySelectorAll('[data-auth-trigger]').forEach(btn => {
      btn.addEventListener('click', openAuthModal);
    });

    if (elements.authModal) {
      // Close modal
      elements.closeBtn?.addEventListener('click', closeAuthModal);
      elements.authModal.querySelector('.auth-modal__backdrop')?.addEventListener('click', closeAuthModal);

      // Toggle between signin/signup
      elements.toggleBtn?.addEventListener('click', toggleAuthMode);

      // Google sign in
      elements.googleBtn?.addEventListener('click', signInWithGoogle);

      // Email form submit
      elements.authForm?.addEventListener('submit', handleEmailAuth);
    }

    // User menu toggle
    const userMenuTrigger = document.querySelector('.user-menu-trigger');
    userMenuTrigger?.addEventListener('click', toggleUserMenu);

    // Sign out button
    document.getElementById('sign-out-btn')?.addEventListener('click', signOut);

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      const userMenu = document.querySelector('.user-menu');
      if (userMenu && !userMenu.contains(e.target)) {
        userMenu.classList.remove('open');
      }
    });

    // Close modal on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    });
  }

  /**
   * Check for existing session
   */
  async function checkSession() {
    if (!supabase) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        currentUser = session.user;
        await fetchUserProfile();
        updateUIForLoggedInUser();
      } else {
        updateUIForLoggedOutUser();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      updateUIForLoggedOutUser();
    }
  }

  /**
   * Handle auth state changes
   */
  function handleAuthStateChange(event, session) {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      fetchUserProfile().then(() => {
        updateUIForLoggedInUser();
        closeAuthModal();

        // Sync local progress to server
        if (window.ProgressTracker) {
          window.ProgressTracker.syncToServer();
        }
      });
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      updateUIForLoggedOutUser();
    }
  }

  /**
   * Fetch user profile from database
   */
  async function fetchUserProfile() {
    if (!supabase || !currentUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data) {
        currentUser.profile = data;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  /**
   * Open the auth modal
   */
  function openAuthModal(e) {
    e?.preventDefault();
    if (elements.authModal) {
      elements.authModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      elements.emailInput?.focus();
    }
  }

  /**
   * Close the auth modal
   */
  function closeAuthModal() {
    if (elements.authModal) {
      elements.authModal.classList.remove('open');
      document.body.style.overflow = '';
      clearAuthMessage();
    }
  }

  /**
   * Toggle between sign in and sign up modes
   */
  function toggleAuthMode() {
    authMode = authMode === 'signin' ? 'signup' : 'signin';

    if (authMode === 'signup') {
      elements.toggleText.textContent = 'Already have an account?';
      elements.toggleBtn.textContent = 'Sign in';
      elements.nameGroup?.removeAttribute('hidden');
      document.querySelector('.auth-modal__title').textContent = 'Create Account';
      document.querySelector('.auth-modal__subtitle').textContent = 'Start tracking your learning progress';
    } else {
      elements.toggleText.textContent = "Don't have an account?";
      elements.toggleBtn.textContent = 'Sign up';
      elements.nameGroup?.setAttribute('hidden', '');
      document.querySelector('.auth-modal__title').textContent = 'Welcome Back';
      document.querySelector('.auth-modal__subtitle').textContent = 'Sign in to track your progress';
    }

    clearAuthMessage();
  }

  /**
   * Sign in with Google
   */
  async function signInWithGoogle(e) {
    e.preventDefault();

    if (!supabase) {
      // Local mode - simulate Google sign in
      const mockUser = {
        id: 'local-' + Date.now(),
        email: 'user@example.com',
        full_name: 'Training User',
        avatar_url: null
      };
      localStorage.setItem('training_user', JSON.stringify(mockUser));
      currentUser = mockUser;
      updateUIForLoggedInUser();
      closeAuthModal();
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.SUPABASE_CONFIG.redirectUrl
        }
      });

      if (error) throw error;
    } catch (error) {
      showAuthMessage(error.message, 'error');
    }
  }

  /**
   * Handle email authentication
   */
  async function handleEmailAuth(e) {
    e.preventDefault();

    const email = elements.emailInput?.value.trim();
    const fullName = elements.nameInput?.value.trim();

    if (!email) {
      showAuthMessage('Please enter your email address', 'error');
      return;
    }

    if (!supabase) {
      // Local mode - simulate email sign in
      const mockUser = {
        id: 'local-' + Date.now(),
        email: email,
        full_name: fullName || email.split('@')[0],
        avatar_url: null
      };
      localStorage.setItem('training_user', JSON.stringify(mockUser));
      currentUser = mockUser;
      updateUIForLoggedInUser();
      closeAuthModal();
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.SUPABASE_CONFIG.redirectUrl
        }
      });

      if (error) throw error;

      showAuthMessage('Check your email for the login link!', 'success');
      elements.authForm.reset();
    } catch (error) {
      showAuthMessage(error.message, 'error');
    }
  }

  /**
   * Sign out
   */
  async function signOut(e) {
    e?.preventDefault();

    if (!supabase) {
      // Local mode
      localStorage.removeItem('training_user');
      currentUser = null;
      updateUIForLoggedOutUser();
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Toggle user menu dropdown
   */
  function toggleUserMenu(e) {
    e.stopPropagation();
    const userMenu = document.querySelector('.user-menu');
    userMenu?.classList.toggle('open');
  }

  /**
   * Update UI for logged in user
   */
  function updateUIForLoggedInUser() {
    const user = currentUser;
    if (!user) return;

    const fullName = user.profile?.full_name || user.user_metadata?.full_name || user.full_name || 'User';
    const email = user.email || '';
    const avatarUrl = user.profile?.avatar_url || user.user_metadata?.avatar_url || user.avatar_url;
    const initials = getInitials(fullName);

    // Update user menu
    const userMenuContainer = document.getElementById('user-menu-container');
    const authTriggerContainer = document.getElementById('auth-trigger-container');

    if (userMenuContainer) {
      userMenuContainer.innerHTML = `
        <div class="user-menu" id="user-menu">
          <button class="user-menu-trigger">
            <div class="user-avatar">
              ${avatarUrl ? `<img src="${avatarUrl}" alt="${fullName}">` : initials}
            </div>
            <span class="user-name">${fullName}</span>
          </button>
          <div class="user-menu-dropdown">
            <a href="/training/progress/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              My Progress
            </a>
            <a href="/training/certificates/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
              Certificates
            </a>
            <button id="sign-out-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      `;

      // Re-attach event listeners
      const trigger = userMenuContainer.querySelector('.user-menu-trigger');
      trigger?.addEventListener('click', toggleUserMenu);

      const signOutBtn = userMenuContainer.querySelector('#sign-out-btn');
      signOutBtn?.addEventListener('click', signOut);
    }

    if (authTriggerContainer) {
      authTriggerContainer.style.display = 'none';
    }

    // Dispatch event for other modules
    document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user } }));
  }

  /**
   * Update UI for logged out user
   */
  function updateUIForLoggedOutUser() {
    const userMenuContainer = document.getElementById('user-menu-container');
    const authTriggerContainer = document.getElementById('auth-trigger-container');

    if (userMenuContainer) {
      userMenuContainer.innerHTML = '';
    }

    if (authTriggerContainer) {
      authTriggerContainer.style.display = 'block';
    }

    // Dispatch event for other modules
    document.dispatchEvent(new CustomEvent('userLoggedOut'));
  }

  /**
   * Show auth message
   */
  function showAuthMessage(message, type) {
    if (!elements.authMessage) {
      // Create message element if it doesn't exist
      const msgEl = document.createElement('div');
      msgEl.id = 'auth-message';
      msgEl.className = 'auth-message';
      const form = elements.authForm || document.querySelector('.auth-form');
      form?.parentNode.insertBefore(msgEl, form);
      elements.authMessage = msgEl;
    }

    elements.authMessage.textContent = message;
    elements.authMessage.className = `auth-message ${type}`;
    elements.authMessage.style.display = 'block';
  }

  /**
   * Clear auth message
   */
  function clearAuthMessage() {
    if (elements.authMessage) {
      elements.authMessage.style.display = 'none';
      elements.authMessage.textContent = '';
    }
  }

  /**
   * Get initials from name
   */
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Get current user
   */
  function getCurrentUser() {
    return currentUser;
  }

  /**
   * Check if user is logged in
   */
  function isLoggedIn() {
    return currentUser !== null;
  }

  // Public API
  window.Auth = {
    init,
    openAuthModal,
    closeAuthModal,
    signOut,
    getCurrentUser,
    isLoggedIn
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
