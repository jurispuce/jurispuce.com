/**
 * Training Flow Diagram Module
 * Handles the interactive branched flow visualization
 */

(function() {
  'use strict';

  // DOM Elements
  let flowContainer = null;
  let flowNodes = null;
  let flowConnectors = null;
  let modulePanel = null;
  let modulePanelBackdrop = null;

  // Current path data
  let currentPathId = null;
  let pathData = null;

  /**
   * Initialize the flow diagram
   */
  function init() {
    flowContainer = document.querySelector('.flow-container');
    flowNodes = document.querySelector('.flow-nodes');
    flowConnectors = document.querySelector('.flow-connectors');
    modulePanel = document.querySelector('.module-panel');
    modulePanelBackdrop = document.querySelector('.module-panel-backdrop');

    if (!flowContainer) return;

    // Get path ID from data attribute
    currentPathId = flowContainer.dataset.pathId;

    // Setup event listeners
    setupEventListeners();

    // Draw connectors after nodes are positioned
    setTimeout(drawConnectors, 100);

    // Update node states based on progress
    updateNodeStates();

    // Listen for progress updates
    document.addEventListener('progressUpdated', () => {
      updateNodeStates();
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      drawConnectors();
    }, 250));
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Node click handlers
    document.querySelectorAll('.flow-node').forEach(node => {
      node.addEventListener('click', () => {
        const branchId = node.dataset.branchId;
        openModulePanel(branchId);
      });

      // Hover effects for path highlighting
      node.addEventListener('mouseenter', () => {
        highlightPath(node.dataset.branchId);
      });

      node.addEventListener('mouseleave', () => {
        clearPathHighlight();
      });
    });

    // Module panel close
    modulePanelBackdrop?.addEventListener('click', closeModulePanel);
    document.querySelector('.module-panel-close')?.addEventListener('click', closeModulePanel);

    // Close panel on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModulePanel();
      }
    });

    // Content item click handlers
    document.addEventListener('click', (e) => {
      const contentItem = e.target.closest('.content-item');
      if (contentItem && !contentItem.classList.contains('locked')) {
        handleContentItemClick(contentItem);
      }
    });

    // Start learning button
    document.addEventListener('click', (e) => {
      if (e.target.matches('.module-action-btn.primary')) {
        const moduleId = modulePanel?.dataset.currentModule;
        if (moduleId) {
          startModule(moduleId);
        }
      }
    });
  }

  /**
   * Draw SVG connectors between nodes
   */
  function drawConnectors() {
    if (!flowConnectors || !flowNodes) return;

    // Clear existing connectors
    flowConnectors.innerHTML = '';

    // Get all connection data from nodes
    const nodes = document.querySelectorAll('.flow-node');
    const connections = [];

    nodes.forEach(node => {
      const prerequisite = node.dataset.prerequisite;
      const prerequisites = node.dataset.prerequisites;

      if (prerequisite) {
        connections.push({
          from: prerequisite,
          to: node.dataset.branchId
        });
      }

      if (prerequisites) {
        prerequisites.split(',').forEach(prereq => {
          connections.push({
            from: prereq.trim(),
            to: node.dataset.branchId
          });
        });
      }
    });

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

    // Draw each connection
    connections.forEach(conn => {
      const fromNode = document.querySelector(`[data-branch-id="${conn.from}"]`);
      const toNode = document.querySelector(`[data-branch-id="${conn.to}"]`);

      if (fromNode && toNode) {
        const line = createConnectorLine(fromNode, toNode, conn);
        svg.appendChild(line);
      }
    });

    flowConnectors.appendChild(svg);
  }

  /**
   * Create a connector line between two nodes
   */
  function createConnectorLine(fromNode, toNode, connectionData) {
    const containerRect = flowContainer.getBoundingClientRect();
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();

    // Calculate positions relative to container
    const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
    const fromY = fromRect.top - containerRect.top + fromRect.height;
    const toX = toRect.left - containerRect.left + toRect.width / 2;
    const toY = toRect.top - containerRect.top;

    // Create a path for curved line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Calculate control points for bezier curve
    const midY = (fromY + toY) / 2;
    const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--connector-color)');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    path.dataset.from = connectionData.from;
    path.dataset.to = connectionData.to;

    return path;
  }

  /**
   * Highlight path from start to selected node
   */
  function highlightPath(branchId) {
    // Get all prerequisite branches
    const branch = document.querySelector(`[data-branch-id="${branchId}"]`);
    if (!branch) return;

    const toHighlight = new Set([branchId]);

    function findPrerequisites(nodeId) {
      const node = document.querySelector(`[data-branch-id="${nodeId}"]`);
      if (!node) return;

      const prereq = node.dataset.prerequisite;
      const prereqs = node.dataset.prerequisites;

      if (prereq) {
        toHighlight.add(prereq);
        findPrerequisites(prereq);
      }

      if (prereqs) {
        prereqs.split(',').forEach(p => {
          const trimmed = p.trim();
          toHighlight.add(trimmed);
          findPrerequisites(trimmed);
        });
      }
    }

    findPrerequisites(branchId);

    // Highlight nodes
    document.querySelectorAll('.flow-node').forEach(node => {
      if (toHighlight.has(node.dataset.branchId)) {
        node.classList.add('highlighted');
      } else {
        node.classList.add('dimmed');
      }
    });

    // Highlight connectors
    document.querySelectorAll('.flow-connectors path').forEach(path => {
      if (toHighlight.has(path.dataset.from) && toHighlight.has(path.dataset.to)) {
        path.style.stroke = 'var(--primary-color)';
        path.style.strokeWidth = '4';
      } else {
        path.style.opacity = '0.3';
      }
    });
  }

  /**
   * Clear path highlighting
   */
  function clearPathHighlight() {
    document.querySelectorAll('.flow-node').forEach(node => {
      node.classList.remove('highlighted', 'dimmed');
    });

    document.querySelectorAll('.flow-connectors path').forEach(path => {
      path.style.stroke = 'var(--connector-color)';
      path.style.strokeWidth = '3';
      path.style.opacity = '1';
    });
  }

  /**
   * Open module detail panel
   */
  function openModulePanel(branchId) {
    if (!modulePanel) return;

    // Load module data (would come from Hugo data in real implementation)
    const branchNode = document.querySelector(`[data-branch-id="${branchId}"]`);
    if (!branchNode) return;

    // Update panel content
    const panelTitle = modulePanel.querySelector('.module-panel-title');
    const panelDescription = modulePanel.querySelector('.module-panel-description');

    if (panelTitle) {
      panelTitle.textContent = branchNode.dataset.branchTitle || branchNode.querySelector('.flow-node-title')?.textContent || 'Module';
    }

    modulePanel.dataset.currentBranch = branchId;

    // Update progress state
    updatePanelProgress(branchId);

    // Show panel
    modulePanel.classList.add('open');
    modulePanelBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close module detail panel
   */
  function closeModulePanel() {
    modulePanel?.classList.remove('open');
    modulePanelBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * Update panel with progress information
   */
  function updatePanelProgress(branchId) {
    // Get modules in this branch
    const branchNode = document.querySelector(`[data-branch-id="${branchId}"]`);
    const moduleIds = branchNode?.dataset.modules?.split(',') || [];

    moduleIds.forEach(moduleId => {
      const trimmedId = moduleId.trim();
      const status = window.ProgressTracker?.getModuleStatus(currentPathId, trimmedId);

      // Update content items in panel
      const contentItems = modulePanel?.querySelectorAll(`.content-item[data-module="${trimmedId}"]`);
      contentItems?.forEach(item => {
        const contentId = item.dataset.contentId;
        const moduleProgress = window.ProgressTracker?.getModuleProgress(currentPathId, trimmedId);

        if (moduleProgress?.content?.[contentId]?.completed) {
          item.classList.add('completed');
        }
      });
    });
  }

  /**
   * Update node states based on progress
   */
  function updateNodeStates() {
    if (!currentPathId || !window.ProgressTracker) return;

    document.querySelectorAll('.flow-node').forEach(node => {
      const branchId = node.dataset.branchId;
      const moduleIds = node.dataset.modules?.split(',') || [];

      let allCompleted = moduleIds.length > 0;
      let anyInProgress = false;
      let anyStarted = false;

      moduleIds.forEach(moduleId => {
        const trimmedId = moduleId.trim();
        const status = window.ProgressTracker.getModuleStatus(currentPathId, trimmedId);

        if (status !== 'completed') {
          allCompleted = false;
        }
        if (status === 'in_progress') {
          anyInProgress = true;
        }
        if (status !== 'not_started') {
          anyStarted = true;
        }
      });

      // Update node classes
      node.classList.remove('completed', 'in-progress', 'locked');

      if (allCompleted && moduleIds.length > 0) {
        node.classList.add('completed');
        updateNodeStatusIcon(node, 'completed');
      } else if (anyInProgress) {
        node.classList.add('in-progress');
        updateNodeStatusIcon(node, 'in-progress');
      } else if (!anyStarted && !checkPrerequisitesMet(node)) {
        node.classList.add('locked');
        updateNodeStatusIcon(node, 'locked');
      }
    });

    // Update path progress display
    updatePathProgressDisplay();
  }

  /**
   * Check if prerequisites are met for a node
   */
  function checkPrerequisitesMet(node) {
    const prereq = node.dataset.prerequisite;
    const prereqs = node.dataset.prerequisites;

    if (!prereq && !prereqs) return true;

    const toCheck = [];
    if (prereq) toCheck.push(prereq);
    if (prereqs) {
      prereqs.split(',').forEach(p => toCheck.push(p.trim()));
    }

    return toCheck.every(prereqId => {
      const prereqNode = document.querySelector(`[data-branch-id="${prereqId}"]`);
      const moduleIds = prereqNode?.dataset.modules?.split(',') || [];

      return moduleIds.every(moduleId => {
        const trimmedId = moduleId.trim();
        return window.ProgressTracker?.isModuleCompleted(currentPathId, trimmedId);
      });
    });
  }

  /**
   * Update node status icon
   */
  function updateNodeStatusIcon(node, status) {
    const statusEl = node.querySelector('.flow-node-status');
    if (!statusEl) return;

    switch (status) {
      case 'completed':
        statusEl.innerHTML = '✓';
        break;
      case 'in-progress':
        statusEl.innerHTML = '●';
        break;
      case 'locked':
        statusEl.innerHTML = '🔒';
        break;
      default:
        statusEl.innerHTML = '';
    }
  }

  /**
   * Update path progress display
   */
  function updatePathProgressDisplay() {
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.path-progress-percentage');

    if (!progressBar || !currentPathId) return;

    // Count total modules
    let totalModules = 0;
    document.querySelectorAll('.flow-node').forEach(node => {
      const modules = node.dataset.modules?.split(',') || [];
      totalModules += modules.length;
    });

    const percentage = window.ProgressTracker?.getPathCompletionPercentage(currentPathId, totalModules) || 0;

    progressBar.style.width = `${percentage}%`;
    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }
  }

  /**
   * Handle content item click
   */
  function handleContentItemClick(contentItem) {
    const moduleId = contentItem.dataset.module;
    const contentId = contentItem.dataset.contentId;
    const contentType = contentItem.dataset.type;

    // Check access level
    const accessLevel = contentItem.dataset.accessLevel;
    if (accessLevel === 'authorized' || accessLevel === 'commercial') {
      if (!window.Auth?.isLoggedIn()) {
        window.Auth?.openAuthModal();
        return;
      }
      // For commercial content, would need to check purchase status
    }

    // Handle different content types
    switch (contentType) {
      case 'video':
        openVideoPlayer(contentItem);
        break;
      case 'quiz':
        openQuiz(moduleId, contentId);
        break;
      case 'exercise':
      case 'case-study':
      case 'reading':
        // Navigate to content page or open modal
        openContentPage(moduleId, contentId);
        break;
    }
  }

  /**
   * Open video player
   */
  function openVideoPlayer(contentItem) {
    const videoUrl = contentItem.dataset.videoUrl;
    // Would open video player modal or navigate to video page
    console.log('Opening video:', videoUrl);

    // Mark as watched after a delay (simulating video completion)
    const moduleId = contentItem.dataset.module;
    const contentId = contentItem.dataset.contentId;

    // For demo, mark as completed immediately
    if (currentPathId && moduleId && contentId) {
      window.ProgressTracker?.completeContentItem(currentPathId, moduleId, contentId, {
        watched: true
      });
    }
  }

  /**
   * Open quiz
   */
  function openQuiz(moduleId, quizId) {
    // Would open quiz component
    console.log('Opening quiz:', moduleId, quizId);
  }

  /**
   * Open content page
   */
  function openContentPage(moduleId, contentId) {
    // Navigate to content page
    const url = `/training/paths/${currentPathId}/modules/${moduleId}/#${contentId}`;
    console.log('Would navigate to:', url);
  }

  /**
   * Start a module
   */
  function startModule(moduleId) {
    if (currentPathId) {
      window.ProgressTracker?.updateModuleStatus(currentPathId, moduleId, 'in_progress');
      updateNodeStates();
    }
  }

  /**
   * Debounce helper
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API
  window.TrainingFlow = {
    init,
    openModulePanel,
    closeModulePanel,
    updateNodeStates,
    drawConnectors
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
