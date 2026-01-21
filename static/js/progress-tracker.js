/**
 * Progress Tracker Module
 * Handles tracking user progress through training paths
 * Uses local storage with optional Supabase sync
 */

(function() {
  'use strict';

  // Storage key prefix
  const STORAGE_PREFIX = 'training_progress_';

  // Supabase client reference
  let supabase = null;

  /**
   * Initialize the progress tracker
   */
  function init() {
    // Check for Supabase
    if (window.supabase && window.SUPABASE_CONFIG?.url !== 'https://your-project-id.supabase.co') {
      supabase = window.supabase.createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey
      );
    }

    // Listen for user login to sync progress
    document.addEventListener('userLoggedIn', () => {
      syncToServer();
    });
  }

  /**
   * Get progress for a specific path
   */
  function getPathProgress(pathId) {
    const key = STORAGE_PREFIX + pathId;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing progress:', e);
      }
    }

    return {
      pathId: pathId,
      startedAt: null,
      modules: {},
      certificatesEarned: [],
      lastActivityAt: null
    };
  }

  /**
   * Save progress for a path
   */
  function savePathProgress(pathId, progress) {
    const key = STORAGE_PREFIX + pathId;
    progress.lastActivityAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(progress));

    // Trigger UI update
    document.dispatchEvent(new CustomEvent('progressUpdated', {
      detail: { pathId, progress }
    }));

    // Sync to server if logged in
    if (window.Auth?.isLoggedIn()) {
      syncModuleToServer(pathId, progress);
    }
  }

  /**
   * Get module progress
   */
  function getModuleProgress(pathId, moduleId) {
    const pathProgress = getPathProgress(pathId);
    return pathProgress.modules[moduleId] || {
      status: 'not_started',
      content: {},
      quizScores: {}
    };
  }

  /**
   * Update module status
   */
  function updateModuleStatus(pathId, moduleId, status) {
    const progress = getPathProgress(pathId);

    if (!progress.modules[moduleId]) {
      progress.modules[moduleId] = {
        status: 'not_started',
        content: {},
        quizScores: {}
      };
    }

    progress.modules[moduleId].status = status;

    if (status === 'in_progress' && !progress.modules[moduleId].startedAt) {
      progress.modules[moduleId].startedAt = new Date().toISOString();

      // Also mark path as started if this is the first module
      if (!progress.startedAt) {
        progress.startedAt = new Date().toISOString();
      }
    }

    if (status === 'completed') {
      progress.modules[moduleId].completedAt = new Date().toISOString();
    }

    savePathProgress(pathId, progress);
    return progress.modules[moduleId];
  }

  /**
   * Mark content item as completed
   */
  function completeContentItem(pathId, moduleId, contentId, data = {}) {
    const progress = getPathProgress(pathId);

    if (!progress.modules[moduleId]) {
      progress.modules[moduleId] = {
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        content: {},
        quizScores: {}
      };
    }

    progress.modules[moduleId].content[contentId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      ...data
    };

    // Auto-update module status to in_progress if not already
    if (progress.modules[moduleId].status === 'not_started') {
      progress.modules[moduleId].status = 'in_progress';
      progress.modules[moduleId].startedAt = new Date().toISOString();
    }

    savePathProgress(pathId, progress);

    // Check if all content is completed to mark module complete
    checkModuleCompletion(pathId, moduleId);

    return progress.modules[moduleId].content[contentId];
  }

  /**
   * Record quiz score
   */
  function recordQuizScore(pathId, moduleId, quizId, score, passed) {
    const progress = getPathProgress(pathId);

    if (!progress.modules[moduleId]) {
      progress.modules[moduleId] = {
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        content: {},
        quizScores: {}
      };
    }

    const existingScore = progress.modules[moduleId].quizScores[quizId];
    const attempts = existingScore ? existingScore.attempts + 1 : 1;

    progress.modules[moduleId].quizScores[quizId] = {
      score: score,
      passed: passed,
      attempts: attempts,
      lastAttemptAt: new Date().toISOString(),
      bestScore: existingScore ? Math.max(existingScore.bestScore || 0, score) : score
    };

    // Also mark the quiz content as completed if passed
    if (passed) {
      progress.modules[moduleId].content[quizId] = {
        completed: true,
        completedAt: new Date().toISOString(),
        score: score
      };
    }

    savePathProgress(pathId, progress);
    return progress.modules[moduleId].quizScores[quizId];
  }

  /**
   * Check if module should be marked as complete
   */
  function checkModuleCompletion(pathId, moduleId) {
    // This would need module content data to determine completion
    // For now, we'll leave it to manual completion or external trigger
  }

  /**
   * Mark module as complete
   */
  function completeModule(pathId, moduleId) {
    return updateModuleStatus(pathId, moduleId, 'completed');
  }

  /**
   * Award certificate
   */
  function awardCertificate(pathId, moduleId, certificateTitle) {
    const progress = getPathProgress(pathId);

    const certificate = {
      pathId: pathId,
      moduleId: moduleId,
      title: certificateTitle,
      awardedAt: new Date().toISOString(),
      id: `cert_${pathId}_${moduleId}_${Date.now()}`
    };

    if (!progress.certificatesEarned) {
      progress.certificatesEarned = [];
    }

    // Don't duplicate certificates
    const exists = progress.certificatesEarned.some(
      c => c.pathId === pathId && c.moduleId === moduleId
    );

    if (!exists) {
      progress.certificatesEarned.push(certificate);
      savePathProgress(pathId, progress);
    }

    return certificate;
  }

  /**
   * Get all certificates
   */
  function getAllCertificates() {
    const certificates = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_PREFIX)) {
        try {
          const progress = JSON.parse(localStorage.getItem(key));
          if (progress.certificatesEarned) {
            certificates.push(...progress.certificatesEarned);
          }
        } catch (e) {
          console.error('Error parsing progress:', e);
        }
      }
    }

    return certificates.sort((a, b) =>
      new Date(b.awardedAt) - new Date(a.awardedAt)
    );
  }

  /**
   * Calculate path completion percentage
   */
  function getPathCompletionPercentage(pathId, totalModules) {
    const progress = getPathProgress(pathId);
    const completedModules = Object.values(progress.modules)
      .filter(m => m.status === 'completed').length;

    if (totalModules === 0) return 0;
    return Math.round((completedModules / totalModules) * 100);
  }

  /**
   * Get module completion status
   */
  function isModuleCompleted(pathId, moduleId) {
    const moduleProgress = getModuleProgress(pathId, moduleId);
    return moduleProgress.status === 'completed';
  }

  /**
   * Get module status
   */
  function getModuleStatus(pathId, moduleId) {
    const moduleProgress = getModuleProgress(pathId, moduleId);
    return moduleProgress.status;
  }

  /**
   * Sync progress to server (Supabase)
   */
  async function syncToServer() {
    if (!supabase || !window.Auth?.isLoggedIn()) return;

    const user = window.Auth.getCurrentUser();
    if (!user) return;

    try {
      // Get all local progress
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(STORAGE_PREFIX)) {
          const pathId = key.replace(STORAGE_PREFIX, '');
          const progress = JSON.parse(localStorage.getItem(key));

          // Sync each module
          for (const [moduleId, moduleProgress] of Object.entries(progress.modules)) {
            await supabase.from('training_progress').upsert({
              user_id: user.id,
              path_id: pathId,
              module_id: moduleId,
              status: moduleProgress.status,
              started_at: moduleProgress.startedAt,
              completed_at: moduleProgress.completedAt,
              content_progress: moduleProgress.content,
              quiz_scores: moduleProgress.quizScores
            }, {
              onConflict: 'user_id,path_id,module_id'
            });
          }

          // Sync certificates
          for (const cert of (progress.certificatesEarned || [])) {
            await supabase.from('certificates').upsert({
              user_id: user.id,
              path_id: cert.pathId,
              module_id: cert.moduleId,
              certificate_type: 'module',
              title: cert.title,
              issued_at: cert.awardedAt
            }, {
              onConflict: 'user_id,path_id,module_id,certificate_type'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error syncing to server:', error);
    }
  }

  /**
   * Sync single module to server
   */
  async function syncModuleToServer(pathId, progress) {
    if (!supabase || !window.Auth?.isLoggedIn()) return;

    const user = window.Auth.getCurrentUser();
    if (!user) return;

    try {
      for (const [moduleId, moduleProgress] of Object.entries(progress.modules)) {
        await supabase.from('training_progress').upsert({
          user_id: user.id,
          path_id: pathId,
          module_id: moduleId,
          status: moduleProgress.status,
          started_at: moduleProgress.startedAt,
          completed_at: moduleProgress.completedAt,
          content_progress: moduleProgress.content,
          quiz_scores: moduleProgress.quizScores
        }, {
          onConflict: 'user_id,path_id,module_id'
        });
      }
    } catch (error) {
      console.error('Error syncing module to server:', error);
    }
  }

  /**
   * Load progress from server
   */
  async function loadFromServer() {
    if (!supabase || !window.Auth?.isLoggedIn()) return;

    const user = window.Auth.getCurrentUser();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Merge server data with local data
      for (const record of data) {
        const localProgress = getPathProgress(record.path_id);

        if (!localProgress.modules[record.module_id]) {
          localProgress.modules[record.module_id] = {
            status: 'not_started',
            content: {},
            quizScores: {}
          };
        }

        // Server data takes precedence if newer
        const localModule = localProgress.modules[record.module_id];
        const serverCompletedAt = record.completed_at ? new Date(record.completed_at) : null;
        const localCompletedAt = localModule.completedAt ? new Date(localModule.completedAt) : null;

        if (!localCompletedAt || (serverCompletedAt && serverCompletedAt > localCompletedAt)) {
          localProgress.modules[record.module_id] = {
            status: record.status,
            startedAt: record.started_at,
            completedAt: record.completed_at,
            content: record.content_progress || {},
            quizScores: record.quiz_scores || {}
          };
        }

        if (!localProgress.startedAt && record.started_at) {
          localProgress.startedAt = record.started_at;
        }

        const key = STORAGE_PREFIX + record.path_id;
        localStorage.setItem(key, JSON.stringify(localProgress));
      }

      // Load certificates
      const { data: certs } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id);

      if (certs) {
        for (const cert of certs) {
          const localProgress = getPathProgress(cert.path_id);

          if (!localProgress.certificatesEarned) {
            localProgress.certificatesEarned = [];
          }

          const exists = localProgress.certificatesEarned.some(
            c => c.pathId === cert.path_id && c.moduleId === cert.module_id
          );

          if (!exists) {
            localProgress.certificatesEarned.push({
              pathId: cert.path_id,
              moduleId: cert.module_id,
              title: cert.title,
              awardedAt: cert.issued_at,
              id: cert.id
            });

            const key = STORAGE_PREFIX + cert.path_id;
            localStorage.setItem(key, JSON.stringify(localProgress));
          }
        }
      }
    } catch (error) {
      console.error('Error loading from server:', error);
    }
  }

  /**
   * Clear all progress (for testing)
   */
  function clearAllProgress() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Public API
  window.ProgressTracker = {
    init,
    getPathProgress,
    getModuleProgress,
    updateModuleStatus,
    completeContentItem,
    recordQuizScore,
    completeModule,
    awardCertificate,
    getAllCertificates,
    getPathCompletionPercentage,
    isModuleCompleted,
    getModuleStatus,
    syncToServer,
    loadFromServer,
    clearAllProgress
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
