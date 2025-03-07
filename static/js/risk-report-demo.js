/**
 * Risk Treatment Report Demo
 * 
 * This is a self-contained demo application that displays an interactive
 * risk treatment report with sample data.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the risk report demo
  initRiskReportDemo();
});

/**
 * Initialize the risk report demo
 */
function initRiskReportDemo() {
  const container = document.getElementById('risk-report-demo');
  if (!container) return;

  // Remove loading message
  container.innerHTML = '';

  // Create the report UI
  createReportUI(container);
}

/**
 * Create the report UI
 * @param {HTMLElement} container - The container element
 */
function createReportUI(container) {
  // Create header
  const header = document.createElement('div');
  header.className = 'risk-report-header';
  header.innerHTML = '<h3>Risk Treatment Report</h3>';
  container.appendChild(header);

  // Create filters
  const filters = createFilters();
  container.appendChild(filters);

  // Create risk list container
  const riskListContainer = document.createElement('div');
  riskListContainer.className = 'risk-list';
  riskListContainer.id = 'risk-list';
  container.appendChild(riskListContainer);

  // Initialize with default data
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const fromDate = document.getElementById('filter-from-date');
  const toDate = document.getElementById('filter-to-date');
  
  fromDate.valueAsDate = oneMonthAgo;
  toDate.valueAsDate = today;
  
  // Generate and display initial report
  generateReport();
}

/**
 * Create filter controls
 * @returns {HTMLElement} The filters container
 */
function createFilters() {
  const filters = document.createElement('div');
  filters.className = 'risk-report-filters';
  
  // Date range filters - From date
  const fromDateGroup = document.createElement('div');
  fromDateGroup.className = 'filter-group';
  fromDateGroup.innerHTML = `
    <label>From Date</label>
    <input type="date" id="filter-from-date" name="filter-from-date">
  `;
  
  // Date range filters - To date
  const toDateGroup = document.createElement('div');
  toDateGroup.className = 'filter-group';
  toDateGroup.innerHTML = `
    <label>To Date</label>
    <input type="date" id="filter-to-date" name="filter-to-date">
  `;
  
  // Risk type filter
  const riskTypeGroup = document.createElement('div');
  riskTypeGroup.className = 'filter-group';
  riskTypeGroup.innerHTML = `
    <label>Risk Type</label>
    <select id="filter-risk-type" name="filter-risk-type">
      <option value="all">All Types</option>
      <option value="cybersecurity">Cybersecurity</option>
      <option value="ai">AI</option>
      <option value="supplier">Supplier</option>
      <option value="personal-data">Personal Data</option>
    </select>
  `;
  
  // Filter actions
  const filterActions = document.createElement('div');
  filterActions.className = 'filter-actions';
  filterActions.innerHTML = `
    <button id="generate-report-btn" class="btn btn-primary">Generate Report</button>
    <button id="reset-filters-btn" class="btn btn-secondary">Reset Filters</button>
  `;
  
  // Append all filter groups
  filters.appendChild(fromDateGroup);
  filters.appendChild(toDateGroup);
  filters.appendChild(riskTypeGroup);
  filters.appendChild(filterActions);
  
  // Add event listeners
  setTimeout(() => {
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    document.getElementById('reset-filters-btn').addEventListener('click', resetFilters);
  }, 100);
  
  return filters;
}

/**
 * Reset filters to default values
 */
function resetFilters() {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  document.getElementById('filter-from-date').valueAsDate = oneMonthAgo;
  document.getElementById('filter-to-date').valueAsDate = today;
  document.getElementById('filter-risk-type').value = 'all';
  
  generateReport();
}

/**
 * Generate and display the risk report based on filter values
 */
function generateReport() {
  const fromDate = document.getElementById('filter-from-date').valueAsDate;
  const toDate = document.getElementById('filter-to-date').valueAsDate;
  const riskType = document.getElementById('filter-risk-type').value;
  
  // Generate sample data
  const risks = generateSampleRisks(fromDate, toDate, riskType);
  
  // Display risks
  displayRisks(risks);
}

/**
 * Generate sample risk data
 * @param {Date} fromDate - Start date for the report
 * @param {Date} toDate - End date for the report
 * @param {string} riskType - Type of risks to include
 * @returns {Array} Array of risk objects
 */
function generateSampleRisks(fromDate, toDate, riskType) {
  // Sample risk data
  const allRisks = [
    {
      id: 'RISK-2025-001',
      description: 'Unauthorized access to sensitive customer data due to weak authentication mechanisms in the customer portal. This could lead to data breaches, regulatory penalties, and reputational damage. The risk is exacerbated by the increasing sophistication of threat actors targeting our industry.',
      probability: 3,
      impact: 4,
      lastUpdate: new Date(2025, 2, 5, 14, 30),
      identificationDate: new Date(2025, 1, 10),
      tags: ['cybersecurity', 'personal-data'],
      owner: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com'
      },
      comments: [
        {
          author: 'Michael Chen',
          date: new Date(2025, 2, 3, 10, 15),
          text: 'We should prioritize implementing MFA for all customer-facing applications.'
        },
        {
          author: 'Sarah Johnson',
          date: new Date(2025, 2, 5, 14, 30),
          text: 'Agreed. I\'ve updated the risk assessment to reflect the increased probability based on recent threat intelligence.'
        }
      ],
      history: [
        { date: new Date(2025, 1, 15), value: 9 },
        { date: new Date(2025, 2, 1), value: 12 },
        { date: new Date(2025, 2, 5), value: 12 }
      ],
      assets: {
        added: [
          { name: 'Customer Database', description: 'Primary database storing customer information', owner: 'Database Team' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'Customer Portal', description: 'Web application for customer self-service', owner: 'Web Development Team' },
          { name: 'Customer Database', description: 'Primary database storing customer information', owner: 'Database Team' },
          { name: 'Authentication Service', description: 'Centralized authentication service', owner: 'Security Team' }
        ]
      },
      actions: {
        added: [
          { name: 'Implement MFA', description: 'Implement multi-factor authentication for customer portal', dueDate: new Date(2025, 3, 15), status: 'in-progress', assignee: 'Alex Rivera' }
        ],
        removed: [],
        modified: [
          { name: 'Security Assessment', description: 'Conduct security assessment of authentication mechanisms', dueDate: new Date(2025, 2, 1), status: 'done', assignee: 'Security Team' }
        ],
        active: [
          { name: 'Implement MFA', description: 'Implement multi-factor authentication for customer portal', dueDate: new Date(2025, 3, 15), status: 'in-progress', assignee: 'Alex Rivera' },
          { name: 'Update Password Policy', description: 'Strengthen password requirements for customer accounts', dueDate: new Date(2025, 3, 30), status: 'planned', assignee: 'Security Team' }
        ]
      },
      controls: {
        added: [
          { name: 'Password Complexity', description: 'Enforce strong password requirements', type: 'Technical control' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'Access Control Policy', description: 'Policy defining access control requirements', type: 'Policy' },
          { name: 'Password Complexity', description: 'Enforce strong password requirements', type: 'Technical control' },
          { name: 'Security Monitoring', description: 'Real-time monitoring of security events', type: 'Technical control' }
        ]
      },
      requirements: {
        added: [],
        removed: [],
        modified: [
          { name: 'Data Protection', description: 'Requirements for protecting sensitive data', source: 'GDPR' }
        ],
        active: [
          { name: 'Authentication Controls', description: 'Requirements for authentication mechanisms', source: 'ISO 27001:2022' },
          { name: 'Data Protection', description: 'Requirements for protecting sensitive data', source: 'GDPR' },
          { name: 'Access Control', description: 'Requirements for controlling access to systems and data', source: 'SOC 2 Type 2' }
        ]
      }
    },
    {
      id: 'RISK-2025-002',
      description: 'AI model bias leading to unfair automated decisions in the customer credit scoring system. This could result in regulatory non-compliance, discrimination claims, and reputational damage. The risk is particularly significant as we expand the use of AI in decision-making processes.',
      probability: 2,
      impact: 4,
      lastUpdate: new Date(2025, 2, 6, 9, 45),
      identificationDate: new Date(2025, 2, 1),
      tags: ['ai', 'personal-data'],
      owner: {
        name: 'David Kim',
        email: 'david.kim@example.com'
      },
      comments: [
        {
          author: 'David Kim',
          date: new Date(2025, 2, 6, 9, 45),
          text: 'We need to implement more robust testing for bias in our AI models before deployment.'
        }
      ],
      history: [
        { date: new Date(2025, 1, 20), value: 6 },
        { date: new Date(2025, 2, 1), value: 8 },
        { date: new Date(2025, 2, 6), value: 8 }
      ],
      assets: {
        added: [],
        removed: [],
        modified: [
          { name: 'Credit Scoring Model', description: 'AI model for customer credit scoring', owner: 'Data Science Team' }
        ],
        active: [
          { name: 'Credit Scoring Model', description: 'AI model for customer credit scoring', owner: 'Data Science Team' },
          { name: 'Customer Data Warehouse', description: 'Data warehouse storing customer information used for model training', owner: 'Data Team' }
        ]
      },
      actions: {
        added: [
          { name: 'Bias Testing Framework', description: 'Develop and implement a framework for testing AI models for bias', dueDate: new Date(2025, 4, 1), status: 'planned', assignee: 'Data Science Team' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'Bias Testing Framework', description: 'Develop and implement a framework for testing AI models for bias', dueDate: new Date(2025, 4, 1), status: 'planned', assignee: 'Data Science Team' },
          { name: 'Model Documentation', description: 'Improve documentation of model design and training data', dueDate: new Date(2025, 3, 15), status: 'in-progress', assignee: 'Maria Garcia' }
        ]
      },
      controls: {
        added: [
          { name: 'AI Ethics Guidelines', description: 'Guidelines for ethical AI development and use', type: 'Policy' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'AI Ethics Guidelines', description: 'Guidelines for ethical AI development and use', type: 'Policy' },
          { name: 'Model Validation Process', description: 'Process for validating AI models before deployment', type: 'Procedure' }
        ]
      },
      requirements: {
        added: [
          { name: 'AI Fairness', description: 'Requirements for ensuring fairness in AI systems', source: 'AI Ethics Framework' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'AI Fairness', description: 'Requirements for ensuring fairness in AI systems', source: 'AI Ethics Framework' },
          { name: 'Non-discrimination', description: 'Requirements for preventing discrimination', source: 'GDPR' },
          { name: 'Automated Decision Making', description: 'Requirements for systems making automated decisions about individuals', source: 'GDPR' }
        ]
      }
    },
    {
      id: 'RISK-2025-003',
      description: 'Supply chain disruption due to key supplier financial instability. This could lead to production delays, increased costs, and inability to meet customer commitments. The risk has increased due to economic conditions affecting our industry.',
      probability: 3,
      impact: 5,
      lastUpdate: new Date(2025, 2, 4, 16, 20),
      identificationDate: new Date(2025, 0, 20),
      tags: ['supplier'],
      owner: {
        name: 'Robert Chen',
        email: 'robert.chen@example.com'
      },
      comments: [
        {
          author: 'Robert Chen',
          date: new Date(2025, 2, 2, 11, 30),
          text: 'We need to identify alternative suppliers for critical components.'
        },
        {
          author: 'Emily Wong',
          date: new Date(2025, 2, 4, 16, 20),
          text: 'Procurement has started the process of qualifying backup suppliers.'
        }
      ],
      history: [
        { date: new Date(2025, 1, 10), value: 10 },
        { date: new Date(2025, 1, 25), value: 15 },
        { date: new Date(2025, 2, 4), value: 15 }
      ],
      assets: {
        added: [],
        removed: [],
        modified: [],
        active: [
          { name: 'Production Line A', description: 'Main production line for flagship products', owner: 'Operations Team' },
          { name: 'Component Inventory', description: 'Inventory of critical components', owner: 'Inventory Management Team' }
        ]
      },
      actions: {
        added: [
          { name: 'Supplier Audit', description: 'Conduct financial and operational audit of key supplier', dueDate: new Date(2025, 2, 28), status: 'in-progress', assignee: 'Procurement Team' }
        ],
        removed: [],
        modified: [
          { name: 'Backup Supplier Identification', description: 'Identify and qualify backup suppliers for critical components', dueDate: new Date(2025, 3, 15), status: 'in-progress', assignee: 'Procurement Team' }
        ],
        active: [
          { name: 'Supplier Audit', description: 'Conduct financial and operational audit of key supplier', dueDate: new Date(2025, 2, 28), status: 'in-progress', assignee: 'Procurement Team' },
          { name: 'Backup Supplier Identification', description: 'Identify and qualify backup suppliers for critical components', dueDate: new Date(2025, 3, 15), status: 'in-progress', assignee: 'Procurement Team' },
          { name: 'Inventory Buffer', description: 'Increase inventory buffer for critical components', dueDate: new Date(2025, 3, 30), status: 'planned', assignee: 'Inventory Management Team' }
        ]
      },
      controls: {
        added: [],
        removed: [],
        modified: [
          { name: 'Supplier Management Procedure', description: 'Procedure for managing supplier relationships', type: 'Procedure' }
        ],
        active: [
          { name: 'Supplier Management Procedure', description: 'Procedure for managing supplier relationships', type: 'Procedure' },
          { name: 'Supplier Risk Assessment', description: 'Process for assessing supplier risks', type: 'Procedure' },
          { name: 'Business Continuity Plan', description: 'Plan for maintaining operations during disruptions', type: 'Procedure' }
        ]
      },
      requirements: {
        added: [],
        removed: [],
        modified: [],
        active: [
          { name: 'Supplier Management', description: 'Requirements for managing supplier relationships', source: 'ISO 27001:2022' },
          { name: 'Business Continuity', description: 'Requirements for ensuring business continuity', source: 'ISO 22301' }
        ]
      }
    },
    {
      id: 'RISK-2025-004',
      description: 'Data breach of personal information due to inadequate access controls in the HR system. This could result in regulatory penalties, legal action, and reputational damage. The risk is heightened by recent changes to the system and increased regulatory scrutiny.',
      probability: 2,
      impact: 5,
      lastUpdate: new Date(2025, 2, 7, 13, 10),
      identificationDate: new Date(2025, 2, 4),
      tags: ['cybersecurity', 'personal-data'],
      owner: {
        name: 'Jennifer Lee',
        email: 'jennifer.lee@example.com'
      },
      comments: [
        {
          author: 'Jennifer Lee',
          date: new Date(2025, 2, 7, 13, 10),
          text: 'We need to implement role-based access controls and review all current access permissions.'
        }
      ],
      history: [
        { date: new Date(2025, 1, 15), value: 8 },
        { date: new Date(2025, 2, 1), value: 10 },
        { date: new Date(2025, 2, 7), value: 10 }
      ],
      assets: {
        added: [
          { name: 'HR Analytics Dashboard', description: 'Dashboard for HR data analysis', owner: 'HR Systems Team' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'HR Management System', description: 'System for managing employee information', owner: 'HR Systems Team' },
          { name: 'HR Analytics Dashboard', description: 'Dashboard for HR data analysis', owner: 'HR Systems Team' },
          { name: 'Employee Database', description: 'Database storing employee personal information', owner: 'Database Team' }
        ]
      },
      actions: {
        added: [
          { name: 'Access Review', description: 'Review and update access permissions for HR systems', dueDate: new Date(2025, 2, 28), status: 'in-progress', assignee: 'Security Team' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'Access Review', description: 'Review and update access permissions for HR systems', dueDate: new Date(2025, 2, 28), status: 'in-progress', assignee: 'Security Team' },
          { name: 'RBAC Implementation', description: 'Implement role-based access controls for HR systems', dueDate: new Date(2025, 3, 15), status: 'planned', assignee: 'HR Systems Team' },
          { name: 'Security Training', description: 'Conduct security awareness training for HR staff', dueDate: new Date(2025, 3, 30), status: 'planned', assignee: 'Training Team' }
        ]
      },
      controls: {
        added: [],
        removed: [],
        modified: [
          { name: 'Data Protection Controls', description: 'Controls for protecting personal data', type: 'Technical control' }
        ],
        active: [
          { name: 'Data Protection Policy', description: 'Policy for protecting personal data', type: 'Policy' },
          { name: 'Data Protection Controls', description: 'Controls for protecting personal data', type: 'Technical control' },
          { name: 'Access Control Procedure', description: 'Procedure for managing access to systems and data', type: 'Procedure' }
        ]
      },
      requirements: {
        added: [],
        removed: [],
        modified: [],
        active: [
          { name: 'Data Protection', description: 'Requirements for protecting personal data', source: 'GDPR' },
          { name: 'Access Control', description: 'Requirements for controlling access to systems and data', source: 'ISO 27001:2022' },
          { name: 'Personal Data Processing', description: 'Requirements for processing personal data', source: 'GDPR' }
        ]
      }
    },
    {
      id: 'RISK-2025-005',
      description: 'AI system making incorrect recommendations due to data quality issues. This could lead to poor business decisions, customer dissatisfaction, and financial losses. The risk is increasing as we expand the use of AI for customer recommendations.',
      probability: 3,
      impact: 3,
      lastUpdate: new Date(2025, 2, 3, 15, 45),
      identificationDate: new Date(2025, 1, 25),
      tags: ['ai'],
      owner: {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com'
      },
      comments: [
        {
          author: 'Maria Garcia',
          date: new Date(2025, 2, 1, 10, 30),
          text: 'We need to implement more robust data quality checks in our data pipeline.'
        },
        {
          author: 'David Kim',
          date: new Date(2025, 2, 3, 15, 45),
          text: 'I agree. We should also consider implementing a monitoring system to detect anomalies in model outputs.'
        }
      ],
      history: [
        { date: new Date(2025, 1, 10), value: 6 },
        { date: new Date(2025, 1, 25), value: 9 },
        { date: new Date(2025, 2, 3), value: 9 }
      ],
      assets: {
        added: [],
        removed: [],
        modified: [
          { name: 'Recommendation Engine', description: 'AI system for generating customer recommendations', owner: 'Data Science Team' }
        ],
        active: [
          { name: 'Recommendation Engine', description: 'AI system for generating customer recommendations', owner: 'Data Science Team' },
          { name: 'Customer Data Lake', description: 'Data lake storing customer behavior data', owner: 'Data Team' },
          { name: 'Data Pipeline', description: 'Pipeline for processing and preparing data for AI models', owner: 'Data Engineering Team' }
        ]
      },
      actions: {
        added: [
          { name: 'Data Quality Framework', description: 'Develop and implement a data quality framework', dueDate: new Date(2025, 3, 15), status: 'planned', assignee: 'Data Engineering Team' }
        ],
        removed: [],
        modified: [
          { name: 'Model Monitoring', description: 'Implement monitoring system for AI model outputs', dueDate: new Date(2025, 3, 30), status: 'in-progress', assignee: 'Data Science Team' }
        ],
        active: [
          { name: 'Data Quality Framework', description: 'Develop and implement a data quality framework', dueDate: new Date(2025, 3, 15), status: 'planned', assignee: 'Data Engineering Team' },
          { name: 'Model Monitoring', description: 'Implement monitoring system for AI model outputs', dueDate: new Date(2025, 3, 30), status: 'in-progress', assignee: 'Data Science Team' },
          { name: 'Model Validation', description: 'Enhance model validation process', dueDate: new Date(2025, 4, 15), status: 'planned', assignee: 'Data Science Team' }
        ]
      },
      controls: {
        added: [
          { name: 'Data Quality Controls', description: 'Controls for ensuring data quality', type: 'Technical control' }
        ],
        removed: [],
        modified: [],
        active: [
          { name: 'Data Quality Controls', description: 'Controls for ensuring data quality', type: 'Technical control' },
          { name: 'AI Development Standards', description: 'Standards for AI development and deployment', type: 'Procedure' },
          { name: 'Model Governance', description: 'Framework for governing AI models', type: 'Policy' }
        ]
      },
      requirements: {
        added: [],
        removed: [],
        modified: [],
        active: [
          { name: 'AI Quality', description: 'Requirements for ensuring AI system quality', source: 'AI Ethics Framework' },
          { name: 'Data Quality', description: 'Requirements for ensuring data quality', source: 'Internal Data Governance' }
        ]
      }
    }
  ];
  
  // Filter risks based on date range and risk type
  return allRisks.filter(risk => {
    // Check if risk was updated within the date range
    const riskDate = risk.lastUpdate;
    const isInDateRange = riskDate >= fromDate && riskDate <= toDate;
    
    // Check if risk matches the selected type
    const matchesType = riskType === 'all' || risk.tags.includes(riskType);
    
    // Add a flag to indicate if the risk was identified within the selected period
    if (isInDateRange && matchesType) {
      risk.identifiedInPeriod = risk.identificationDate >= fromDate && risk.identificationDate <= toDate;
    }
    
    return isInDateRange && matchesType;
  });
}

/**
 * Display risks in the risk list container
 * @param {Array} risks - Array of risk objects to display
 */
function displayRisks(risks) {
  const riskListContainer = document.getElementById('risk-list');
  riskListContainer.innerHTML = '';
  
  if (risks.length === 0) {
    riskListContainer.innerHTML = '<p class="no-risks-message">No risks found matching the selected criteria.</p>';
    return;
  }
  
  risks.forEach(risk => {
    const riskElement = createRiskElement(risk);
    riskListContainer.appendChild(riskElement);
  });
  
  // Add event listeners to risk headers for expanding/collapsing
  document.querySelectorAll('.risk-item-header').forEach(header => {
    header.addEventListener('click', function() {
      const riskItem = this.parentElement;
      const isExpanded = riskItem.classList.contains('expanded');
      
      // Close all expanded risks
      document.querySelectorAll('.risk-item.expanded').forEach(item => {
        if (item !== riskItem) {
          item.classList.remove('expanded');
        }
      });
      
      // Toggle current risk
      riskItem.classList.toggle('expanded', !isExpanded);
    });
  });
  
  // Add event listeners to tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabsContainer = this.parentElement;
      const tabContentContainer = tabsContainer.nextElementSibling;
      const tabIndex = Array.from(tabsContainer.children).indexOf(this);
      
      // Update active tab
      tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update active tab content
      tabContentContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      tabContentContainer.querySelectorAll('.tab-content')[tabIndex].classList.add('active');
    });
  });
}

/**
 * Create a risk element
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The risk element
 */
function createRiskElement(risk) {
  const riskElement = document.createElement('div');
  riskElement.className = 'risk-item';
  
  // Create risk header
  const riskHeader = document.createElement('div');
  riskHeader.className = 'risk-item-header';
  
  // Risk value class based on the value
  const riskValue = risk.probability * risk.impact;
  let riskValueClass = 'low';
  if (riskValue >= 15) {
    riskValueClass = 'high';
  } else if (riskValue >= 8) {
    riskValueClass = 'medium';
  }
  
  // Format date
  const formattedDate = formatDate(risk.lastUpdate);
  
  // Create tags HTML
  const tagsHtml = risk.tags.map(tag => `<span class="risk-tag ${tag}">${tag}</span>`).join('');
  
  riskHeader.innerHTML = `
    <div class="risk-item-title">
      <span class="risk-id">${risk.id}</span>
      ${risk.identifiedInPeriod ? '<span class="new-risk-badge">New</span>' : ''}
      <span class="risk-description-short">${truncateText(risk.description, 150)}</span>
    </div>
    <div class="risk-meta">
      <span class="risk-value ${riskValueClass}">${riskValue}</span>
      <span class="risk-date">${formattedDate}</span>
      <span class="risk-identification-date">Identified: ${formatDate(risk.identificationDate)}</span>
      <div class="risk-tags">${tagsHtml}</div>
    </div>
  `;
  
  // Create risk details
  const riskDetails = document.createElement('div');
  riskDetails.className = 'risk-item-details';
  
  // Create tabs
  const tabs = document.createElement('div');
  tabs.className = 'tabs';
  tabs.innerHTML = `
    <div class="tab active">Main</div>
    <div class="tab">Related Assets</div>
    <div class="tab">Risk Actions</div>
    <div class="tab">Related Controls</div>
    <div class="tab">Related Requirements</div>
  `;
  
  // Create tab content container
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content-container';
  
  // Main tab content
  const mainTabContent = createMainTabContent(risk);
  
  // Related assets tab content
  const assetsTabContent = createAssetsTabContent(risk);
  
  // Risk actions tab content
  const actionsTabContent = createActionsTabContent(risk);
  
  // Related controls tab content
  const controlsTabContent = createControlsTabContent(risk);
  
  // Related requirements tab content
  const requirementsTabContent = createRequirementsTabContent(risk);
  
  // Add all tab contents to the container
  tabContent.appendChild(mainTabContent);
  tabContent.appendChild(assetsTabContent);
  tabContent.appendChild(actionsTabContent);
  tabContent.appendChild(controlsTabContent);
  tabContent.appendChild(requirementsTabContent);
  
  // Add tabs and tab content to risk details
  riskDetails.appendChild(tabs);
  riskDetails.appendChild(tabContent);
  
  // Add header and details to risk element
  riskElement.appendChild(riskHeader);
  riskElement.appendChild(riskDetails);
  
  return riskElement;
}

/**
 * Create the main tab content
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The main tab content element
 */
function createMainTabContent(risk) {
  const mainTabContent = document.createElement('div');
  mainTabContent.className = 'tab-content active';
  
  // Create tags HTML
  const tagsHtml = risk.tags.map(tag => `<span class="risk-tag ${tag}">${tag}</span>`).join('');
  
  // Risk owner
  const ownerInitials = risk.owner.name.split(' ').map(n => n[0]).join('');
  
  mainTabContent.innerHTML = `
    <div class="risk-detail-section">
      <h4>Risk Description</h4>
      <p>${risk.description}</p>
    </div>
    
    <div class="risk-detail-section">
      <h4>Risk Tags</h4>
      <div class="risk-tags">${tagsHtml}</div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Risk Owner</h4>
      <div class="risk-owner">
        <div class="risk-owner-avatar">${ownerInitials}</div>
        <div class="risk-owner-info">
          <div class="risk-owner-name">${risk.owner.name}</div>
          <div class="risk-owner-email">${risk.owner.email}</div>
        </div>
      </div>
      <div class="risk-dates">
        <div><strong>Identified:</strong> ${formatDate(risk.identificationDate)}</div>
        <div><strong>Last Updated:</strong> ${formatDate(risk.lastUpdate)}</div>
        ${risk.identifiedInPeriod ? '<div class="new-risk-badge">Identified in selected period</div>' : ''}
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Risk Assessment</h4>
      <div class="risk-metrics">
        <div class="risk-metric">
          <div class="risk-metric-label">Probability</div>
          <div class="risk-metric-value">${risk.probability}</div>
        </div>
        <div class="risk-metric">
          <div class="risk-metric-label">Impact</div>
          <div class="risk-metric-value">${risk.impact}</div>
        </div>
        <div class="risk-metric">
          <div class="risk-metric-label">Risk Value</div>
          <div class="risk-metric-value">${risk.probability * risk.impact}</div>
        </div>
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Risk History</h4>
      <div class="risk-history-graph" id="risk-history-${risk.id}">
        <div class="risk-chart-container">
          ${createRiskHistoryChart(risk)}
        </div>
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Comments</h4>
      <div class="comments-list">
        ${risk.comments.map(comment => `
          <div class="comment-item">
            <div class="comment-header">
              <span class="comment-author">${comment.author}</span>
              <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return mainTabContent;
}

/**
 * Create the related assets tab content
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The assets tab content element
 */
function createAssetsTabContent(risk) {
  const assetsTabContent = document.createElement('div');
  assetsTabContent.className = 'tab-content';
  
  assetsTabContent.innerHTML = `
    <div class="risk-detail-section">
      <h4>Changes in Assets</h4>
      <div class="related-list">
        ${risk.assets.added.map(asset => `
          <div class="related-item added">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">+</span>${asset.name}</span>
              <span class="related-item-meta">Added</span>
            </div>
            <div>${asset.description}</div>
            <div>Owner: ${asset.owner}</div>
          </div>
        `).join('')}
        
        ${risk.assets.removed.map(asset => `
          <div class="related-item removed">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">-</span>${asset.name}</span>
              <span class="related-item-meta">Removed</span>
            </div>
            <div>${asset.description}</div>
            <div>Owner: ${asset.owner}</div>
          </div>
        `).join('')}
        
        ${risk.assets.modified.map(asset => `
          <div class="related-item modified">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">~</span>${asset.name}</span>
              <span class="related-item-meta">Modified</span>
            </div>
            <div>${asset.description}</div>
            <div>Owner: ${asset.owner}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Active Related Assets</h4>
      <div class="related-list">
        ${risk.assets.active.map(asset => `
          <div class="related-item">
            <div class="related-item-header">
              <span class="related-item-title">${asset.name}</span>
            </div>
            <div>${asset.description}</div>
            <div>Owner: ${asset.owner}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return assetsTabContent;
}

/**
 * Create the risk actions tab content
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The actions tab content element
 */
function createActionsTabContent(risk) {
  const actionsTabContent = document.createElement('div');
  actionsTabContent.className = 'tab-content';
  
  actionsTabContent.innerHTML = `
    <div class="risk-detail-section">
      <h4>Changes in Actions</h4>
      <div class="related-list">
        ${risk.actions.added.map(action => `
          <div class="related-item added">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">+</span>${action.name}</span>
              <span class="related-item-meta">Added</span>
            </div>
            <div>${action.description}</div>
            <div>Due: ${formatDate(action.dueDate)} | <span class="task-status ${action.status}">${action.status}</span> | Assignee: ${action.assignee}</div>
          </div>
        `).join('')}
        
        ${risk.actions.removed.map(action => `
          <div class="related-item removed">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">-</span>${action.name}</span>
              <span class="related-item-meta">Removed</span>
            </div>
            <div>${action.description}</div>
            <div>Due: ${formatDate(action.dueDate)} | <span class="task-status ${action.status}">${action.status}</span> | Assignee: ${action.assignee}</div>
          </div>
        `).join('')}
        
        ${risk.actions.modified.map(action => `
          <div class="related-item modified">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">~</span>${action.name}</span>
              <span class="related-item-meta">Modified</span>
            </div>
            <div>${action.description}</div>
            <div>Due: ${formatDate(action.dueDate)} | <span class="task-status ${action.status}">${action.status}</span> | Assignee: ${action.assignee}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Active Related Actions</h4>
      <div class="related-list">
        ${risk.actions.active.map(action => `
          <div class="related-item">
            <div class="related-item-header">
              <span class="related-item-title">${action.name}</span>
            </div>
            <div>${action.description}</div>
            <div>Due: ${formatDate(action.dueDate)} | <span class="task-status ${action.status}">${action.status}</span> | Assignee: ${action.assignee}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return actionsTabContent;
}

/**
 * Create the related controls tab content
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The controls tab content element
 */
function createControlsTabContent(risk) {
  const controlsTabContent = document.createElement('div');
  controlsTabContent.className = 'tab-content';
  
  controlsTabContent.innerHTML = `
    <div class="risk-detail-section">
      <h4>Changes in Controls</h4>
      <div class="related-list">
        ${risk.controls.added.map(control => `
          <div class="related-item added">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">+</span>${control.name}</span>
              <span class="related-item-meta">Added</span>
            </div>
            <div>${control.description}</div>
            <div>Type: ${control.type}</div>
          </div>
        `).join('')}
        
        ${risk.controls.removed.map(control => `
          <div class="related-item removed">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">-</span>${control.name}</span>
              <span class="related-item-meta">Removed</span>
            </div>
            <div>${control.description}</div>
            <div>Type: ${control.type}</div>
          </div>
        `).join('')}
        
        ${risk.controls.modified.map(control => `
          <div class="related-item modified">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">~</span>${control.name}</span>
              <span class="related-item-meta">Modified</span>
            </div>
            <div>${control.description}</div>
            <div>Type: ${control.type}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Active Related Controls</h4>
      <div class="related-list">
        ${risk.controls.active.map(control => `
          <div class="related-item">
            <div class="related-item-header">
              <span class="related-item-title">${control.name}</span>
            </div>
            <div>${control.description}</div>
            <div>Type: ${control.type}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return controlsTabContent;
}

/**
 * Create the related requirements tab content
 * @param {Object} risk - Risk object
 * @returns {HTMLElement} The requirements tab content element
 */
function createRequirementsTabContent(risk) {
  const requirementsTabContent = document.createElement('div');
  requirementsTabContent.className = 'tab-content';
  
  requirementsTabContent.innerHTML = `
    <div class="risk-detail-section">
      <h4>Changes in Requirements</h4>
      <div class="related-list">
        ${risk.requirements.added.map(requirement => `
          <div class="related-item added">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">+</span>${requirement.name}</span>
              <span class="related-item-meta">Added</span>
            </div>
            <div>${requirement.description}</div>
            <div>Source: ${requirement.source}</div>
          </div>
        `).join('')}
        
        ${risk.requirements.removed.map(requirement => `
          <div class="related-item removed">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">-</span>${requirement.name}</span>
              <span class="related-item-meta">Removed</span>
            </div>
            <div>${requirement.description}</div>
            <div>Source: ${requirement.source}</div>
          </div>
        `).join('')}
        
        ${risk.requirements.modified.map(requirement => `
          <div class="related-item modified">
            <div class="related-item-header">
              <span class="related-item-title"><span class="change-indicator">~</span>${requirement.name}</span>
              <span class="related-item-meta">Modified</span>
            </div>
            <div>${requirement.description}</div>
            <div>Source: ${requirement.source}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="risk-detail-section">
      <h4>Active Related Requirements</h4>
      <div class="related-list">
        ${risk.requirements.active.map(requirement => `
          <div class="related-item">
            <div class="related-item-header">
              <span class="related-item-title">${requirement.name}</span>
            </div>
            <div>${requirement.description}</div>
            <div>Source: ${requirement.source}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return requirementsTabContent;
}

/**
 * Create a simple risk history chart
 * @param {Object} risk - Risk object
 * @returns {string} HTML for the chart
 */
function createRiskHistoryChart(risk) {
  const history = risk.history;
  if (history.length === 0) return '<div class="no-data">No history data available</div>';
  
  const maxValue = Math.max(...history.map(h => h.value));
  const chartHeight = 150;
  
  let chartHtml = '';
  
  // Create a simple bar chart
  chartHtml += '<div style="display: flex; height: 100%; align-items: flex-end; justify-content: space-around;">';
  
  history.forEach(point => {
    const barHeight = (point.value / maxValue) * chartHeight;
    const formattedDate = formatDate(point.date, true);
    
    chartHtml += `
      <div style="display: flex; flex-direction: column; align-items: center; width: ${100 / history.length}%;">
        <div style="margin-bottom: 5px;">${point.value}</div>
        <div style="background-color: #0d6efd; width: 30px; height: ${barHeight}px; border-radius: 3px 3px 0 0;"></div>
        <div style="margin-top: 5px; font-size: 0.8rem; text-align: center;">${formattedDate}</div>
      </div>
    `;
  });
  
  chartHtml += '</div>';
  
  return chartHtml;
}

/**
 * Format a date object to a readable string
 * @param {Date} date - Date object
 * @param {boolean} short - Whether to use short format
 * @returns {string} Formatted date string
 */
function formatDate(date, short = false) {
  if (!date) return 'N/A';
  
  if (short) {
    return new Date(date).toLocaleDateString();
  }
  
  return new Date(date).toLocaleString();
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, length) {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.substring(0, length) + '...';
}
