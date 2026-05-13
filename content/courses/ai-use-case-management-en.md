---
title: AI Use Case Management in Practice — for SaaS Operators
description: >-
  A self-paced course for the people inside a SaaS company who own the 'should we / how do we use this AI?' decision —
  typically Heads of AI Governance, CISO/DPO-adjacent leads, Heads of Platform, COOs. Two-hour core plus optional
  deep-dives. Covers deployment models, registry design that piggybacks on existing TPRM/DPIA processes, disclosure and
  AI-content labelling, role-based enablement, surviving model churn, and the EU AI Act as it actually applies in 2026.
  Three interactives: a deployment-model selector, a use-case intake → registry-row generator, and an AI Act risk-tier
  classifier. Running case study: Loopwell — 'the AI-native operations platform,' allegedly.
weight: 30
difficulty: Intermediate
duration: 2 hours core + 1–2 hours optional
language: en
tags:
  - ai-governance
  - eu-ai-act
  - saas
  - compliance
private: true
courseSlug: ai-use-case-management-en
bucket: course-materials
generated: true
files:
  - path: 01_framing/01_what_an_ai_use_case_actually_is.html
    title: What 'an AI use case' actually is — and why 'we use AI' isn't one
    description: >-
      The unit of governance is the use case, not the model or the vendor. How to slice a fuzzy initiative into 3–4
      governable use cases. Introduces the running Loopwell case study.
    kind: lesson
    contentType: text/html
    size: 24755
  - path: 01_framing/02_three_risk_surfaces.html
    title: Internal AI, customer-facing AI, AI you sell — three different risk surfaces
    description: >-
      Where SaaS companies get burned by treating these as one. Which stakeholders, which contracts, and which controls
      differ across the three.
    kind: lesson
    contentType: text/html
    size: 22151
  - path: 01_framing/03_the_fear_map.html
    title: The fear map — rational fears, folklore, and proportionate responses
    description: >-
      Catalogue of the most common executive and employee fears about AI: job loss, hallucination liability, IP leakage,
      'the model trained on our data', shadow AI, vendor lock-in, regulator surprise. Which are real, which are
      folklore, and what the proportionate response is.
    kind: lesson
    contentType: text/html
    size: 25200
  - path: 02_deployment_models/01_deployment_spectrum_and_selector.html
    title: The deployment spectrum + selector
    description: >-
      Public SaaS API → enterprise tenant → hyperscaler-hosted → dedicated throughput → self-hosted open weights →
      in-house fine-tunes. Per model: data flow, contract terms, cost shape, the team you need to operate it.
      Interactive: a deployment-model selector driven by data sensitivity, latency, reversibility, and customer
      constraints.
    kind: lesson
    contentType: text/html
    size: 33737
  - path: 02_deployment_models/02_agentic_systems.html
    title: Agentic systems — when the model takes actions
    description: >-
      Why agents change the governance surface. Tool permissions, MCP, the blast-radius question. What
      'human-in-the-loop' actually means once a model can hit your APIs.
    kind: lesson
    contentType: text/html
    size: 26705
  - path: 03_registry/01_registry_as_a_view.html
    title: Why standalone AI registers die — and what to do instead
    description: >-
      The failure modes of bolt-on AI registers. How to express the registry as a view over TPRM, RoPA, and DPIA, with
      only a handful of AI-specific fields added at intake.
    kind: lesson
    contentType: text/html
    size: 22155
  - path: 03_registry/02_intake_and_registry_row.html
    title: Intake fields + the registry row
    description: >-
      The ~12 fields that actually matter at intake (purpose, deployment model, data classes, decisioning role,
      human-in-the-loop point, training opt-out, AI Act tier, model+version lock, vendor-disappearance fallback, owner,
      review cadence, kill switch). Interactive: an intake form that produces a filled Loopwell registry row.
    kind: lesson
    contentType: text/html
    size: 32386
  - path: 04_compliant_use/01_disclosure_and_labelling.html
    title: Disclosure + AI-content labelling
    description: >-
      EU AI Act Art. 50 transparency duties. C2PA and watermark provenance. Concrete UI patterns: when a chatbot must
      declare itself, what counts as a 'reasonably informed' user, and when generated content needs a label.
    kind: lesson
    contentType: text/html
    size: 22244
  - path: 04_compliant_use/02_data_ip_and_literacy.html
    title: Data leakage, training opt-outs, IP, and the Art. 4 AI-literacy duty
    description: >-
      Reading vendor terms honestly. What 'no training' actually guarantees and the human-review carve-outs most
      enterprises miss. The AI-literacy obligation in proportion — what counts, what doesn't, how to evidence it.
    kind: lesson
    contentType: text/html
    size: 23241
  - path: 05_roles/01_role_enablement_matrix.html
    title: Role enablement matrix — per-function playbook
    description: >-
      Expandable role cards for the seven functions where AI lands hardest in a SaaS company. Each card: high-leverage
      use cases, fitting deployment model, starter tool category, role-specific pitfall.
    kind: lesson
    contentType: text/html
    size: 28016
  - path: 06_eu_dimension/01_eu_ai_act_2026_and_tier_classifier.html
    title: EU AI Act in 2026 + risk-tier classifier
    description: >-
      Where the AI Act actually is in 2026: which duties are live, which are still coming, what the AI Office has
      actually produced, and whether the timeline is moving. Risk tiers (prohibited / high-risk / limited-risk /
      minimal-risk) walked through Loopwell use cases. Interactive: a tier classifier.
    kind: lesson
    contentType: text/html
    size: 36225
  - path: 07_practice/01_capstone_loopwell_portfolio_review.html
    title: Capstone — Loopwell's Q3 AI portfolio review
    description: >-
      Six proposed AI use cases land on Priya's desk before the next board meeting. Classify them, register them, pick
      deployment models, draft the disclosures, and write the one-page board summary.
    kind: lesson
    contentType: text/html
    size: 31407
  - path: 08_go_deeper/01_deployment_models_in_detail.html
    title: Each deployment model in detail
    description: >-
      Optional. Data flow diagrams, typical contract clauses, cost shape, and operating-team requirements for each of
      the six deployment models.
    kind: lesson
    contentType: text/html
    size: 27296
  - path: 08_go_deeper/02_full_role_chapters.html
    title: Full role chapters — Engineering, SRE, IT, CS, Sales, Finance, People Ops
    description: Optional. The full version of each per-role section, with worked Loopwell examples and tool comparisons.
    kind: lesson
    contentType: text/html
    size: 35650
  - path: 08_go_deeper/03_model_churn_and_evals.html
    title: Surviving model churn — evals and the two-vendor posture
    description: >-
      Optional. Why your model choice from last quarter is already not the best one, and how to design for
      substitutability without paying the migration cost every release. Building cheap eval sets that actually catch
      regressions.
    kind: lesson
    contentType: text/html
    size: 14574
  - path: 08_go_deeper/04_gpai_provider_vs_deployer.html
    title: 'GPAI: provider vs deployer — the trap door'
    description: >-
      Optional. Most SaaS companies are deployers. Fine-tuning, rebranding, or 'substantial modification' can flip you
      into provider obligations. How to spot the moment that happens.
    kind: lesson
    contentType: text/html
    size: 13984
  - path: 08_go_deeper/05_gdpr_nis2_dora_interaction.html
    title: GDPR, NIS2, DORA, Data Act — where AI governance is new vs. just GDPR with a hat on
    description: Optional. The interaction map between the AI Act and the regulations a SaaS company already lives under.
    kind: lesson
    contentType: text/html
    size: 14714
  - path: 08_go_deeper/06_cross_border_residency.html
    title: Cross-border — serving non-EU from the EU and vice versa
    description: >-
      Optional. Data residency, model residency, and transfer mechanisms. Where 'where does the inference happen?'
      becomes a contractual question.
    kind: lesson
    contentType: text/html
    size: 13074
  - path: 08_go_deeper/07_board_auditor_engineer_cheatsheet.html
    title: Board / auditor / engineer defence cheat sheet
    description: >-
      Optional. Three audiences you'll defend the AI program to, and the answer shape each one needs. A printable
      one-pager.
    kind: lesson
    contentType: text/html
    size: 16203
blocks:
  - id: 01_framing
    dir: 01_framing
    title: Framing — what we are actually managing
    summary: >-
      Three foundational shifts before any tooling or paperwork: the unit of governance is the use case (not the model,
      not the vendor); internal AI, customer-facing AI, and AI-you-sell are three different risk surfaces; and most of
      the fear in the room is a mix of rational and folkloric, which calls for proportionate — not panicked — responses.
    sequence: 1
    lessons:
      - path: 01_framing/01_what_an_ai_use_case_actually_is.html
        file: 01_what_an_ai_use_case_actually_is.html
        title: What 'an AI use case' actually is — and why 'we use AI' isn't one
        description: >-
          The unit of governance is the use case, not the model or the vendor. How to slice a fuzzy initiative into 3–4
          governable use cases. Introduces the running Loopwell case study.
        kind: lesson
        sequence: 1
        size: 24755
        contentType: text/html
      - path: 01_framing/02_three_risk_surfaces.html
        file: 02_three_risk_surfaces.html
        title: Internal AI, customer-facing AI, AI you sell — three different risk surfaces
        description: >-
          Where SaaS companies get burned by treating these as one. Which stakeholders, which contracts, and which
          controls differ across the three.
        kind: lesson
        sequence: 2
        size: 22151
        contentType: text/html
      - path: 01_framing/03_the_fear_map.html
        file: 03_the_fear_map.html
        title: The fear map — rational fears, folklore, and proportionate responses
        description: >-
          Catalogue of the most common executive and employee fears about AI: job loss, hallucination liability, IP
          leakage, 'the model trained on our data', shadow AI, vendor lock-in, regulator surprise. Which are real, which
          are folklore, and what the proportionate response is.
        kind: lesson
        sequence: 3
        size: 25200
        contentType: text/html
  - id: 02_deployment_models
    dir: 02_deployment_models
    title: Deployment models
    summary: >-
      The spectrum from public consumer chat to in-house fine-tunes, with the data flow, contracts, and operating cost
      shape that each implies — plus an interactive selector that maps a use case to a deployment model and the new
      governance surface that agentic systems introduce.
    sequence: 2
    lessons:
      - path: 02_deployment_models/01_deployment_spectrum_and_selector.html
        file: 01_deployment_spectrum_and_selector.html
        title: The deployment spectrum + selector
        description: >-
          Public SaaS API → enterprise tenant → hyperscaler-hosted → dedicated throughput → self-hosted open weights →
          in-house fine-tunes. Per model: data flow, contract terms, cost shape, the team you need to operate it.
          Interactive: a deployment-model selector driven by data sensitivity, latency, reversibility, and customer
          constraints.
        kind: lesson
        sequence: 1
        size: 33737
        contentType: text/html
      - path: 02_deployment_models/02_agentic_systems.html
        file: 02_agentic_systems.html
        title: Agentic systems — when the model takes actions
        description: >-
          Why agents change the governance surface. Tool permissions, MCP, the blast-radius question. What
          'human-in-the-loop' actually means once a model can hit your APIs.
        kind: lesson
        sequence: 2
        size: 26705
        contentType: text/html
  - id: 03_registry
    dir: 03_registry
    title: Registry as a view, not a parallel process
    summary: >-
      You already evaluate vendors, you already keep a RoPA, you already do DPIAs. A separate 'AI register' dies inside
      a year. The registry is a view over those existing artifacts plus a few AI-specific fields — and the intake form
      lives where the rest of your intake already lives.
    sequence: 3
    lessons:
      - path: 03_registry/01_registry_as_a_view.html
        file: 01_registry_as_a_view.html
        title: Why standalone AI registers die — and what to do instead
        description: >-
          The failure modes of bolt-on AI registers. How to express the registry as a view over TPRM, RoPA, and DPIA,
          with only a handful of AI-specific fields added at intake.
        kind: lesson
        sequence: 1
        size: 22155
        contentType: text/html
      - path: 03_registry/02_intake_and_registry_row.html
        file: 02_intake_and_registry_row.html
        title: Intake fields + the registry row
        description: >-
          The ~12 fields that actually matter at intake (purpose, deployment model, data classes, decisioning role,
          human-in-the-loop point, training opt-out, AI Act tier, model+version lock, vendor-disappearance fallback,
          owner, review cadence, kill switch). Interactive: an intake form that produces a filled Loopwell registry row.
        kind: lesson
        sequence: 2
        size: 32386
        contentType: text/html
  - id: 04_compliant_use
    dir: 04_compliant_use
    title: Compliant and visible use
    summary: >-
      The user-facing and data-facing duties that decide whether a use case is defensible: when users must know they're
      talking to AI, when content needs an AI label, what 'no training on your data' actually guarantees, and how to
      evidence the EU AI Act's AI-literacy duty without building a training-industrial complex.
    sequence: 4
    lessons:
      - path: 04_compliant_use/01_disclosure_and_labelling.html
        file: 01_disclosure_and_labelling.html
        title: Disclosure + AI-content labelling
        description: >-
          EU AI Act Art. 50 transparency duties. C2PA and watermark provenance. Concrete UI patterns: when a chatbot
          must declare itself, what counts as a 'reasonably informed' user, and when generated content needs a label.
        kind: lesson
        sequence: 1
        size: 22244
        contentType: text/html
      - path: 04_compliant_use/02_data_ip_and_literacy.html
        file: 02_data_ip_and_literacy.html
        title: Data leakage, training opt-outs, IP, and the Art. 4 AI-literacy duty
        description: >-
          Reading vendor terms honestly. What 'no training' actually guarantees and the human-review carve-outs most
          enterprises miss. The AI-literacy obligation in proportion — what counts, what doesn't, how to evidence it.
        kind: lesson
        sequence: 2
        size: 23241
        contentType: text/html
  - id: 05_roles
    dir: 05_roles
    title: Role enablement, compressed
    summary: >-
      One lesson with expandable role cards. Per function (Engineering, SRE, IT/desktop, Customer Success, Sales,
      Finance, People Ops): the two or three high-leverage use cases, the deployment model that fits, the starter tools,
      and the pitfall specific to that role.
    sequence: 5
    lessons:
      - path: 05_roles/01_role_enablement_matrix.html
        file: 01_role_enablement_matrix.html
        title: Role enablement matrix — per-function playbook
        description: >-
          Expandable role cards for the seven functions where AI lands hardest in a SaaS company. Each card:
          high-leverage use cases, fitting deployment model, starter tool category, role-specific pitfall.
        kind: lesson
        sequence: 1
        size: 28016
        contentType: text/html
  - id: 06_eu_dimension
    dir: 06_eu_dimension
    title: The EU dimension
    summary: >-
      The EU AI Act in 2026 as it actually applies — written against fresh research rather than recalled — plus an
      interactive tier classifier that turns the regulation into a decision a SaaS operator can defend.
    sequence: 6
    lessons:
      - path: 06_eu_dimension/01_eu_ai_act_2026_and_tier_classifier.html
        file: 01_eu_ai_act_2026_and_tier_classifier.html
        title: EU AI Act in 2026 + risk-tier classifier
        description: >-
          Where the AI Act actually is in 2026: which duties are live, which are still coming, what the AI Office has
          actually produced, and whether the timeline is moving. Risk tiers (prohibited / high-risk / limited-risk /
          minimal-risk) walked through Loopwell use cases. Interactive: a tier classifier.
        kind: lesson
        sequence: 1
        size: 36225
        contentType: text/html
  - id: 07_practice
    dir: 07_practice
    title: Putting it into practice
    summary: >-
      A capstone where the learner takes six proposed Loopwell use cases through the whole pipeline — classify,
      register, pick deployment, draft disclosures, write the one-pager for the board.
    sequence: 7
    lessons:
      - path: 07_practice/01_capstone_loopwell_portfolio_review.html
        file: 01_capstone_loopwell_portfolio_review.html
        title: Capstone — Loopwell's Q3 AI portfolio review
        description: >-
          Six proposed AI use cases land on Priya's desk before the next board meeting. Classify them, register them,
          pick deployment models, draft the disclosures, and write the one-page board summary.
        kind: lesson
        sequence: 1
        size: 31407
        contentType: text/html
  - id: 08_go_deeper
    dir: 08_go_deeper
    title: Go deeper (optional)
    summary: >-
      Optional lessons for learners who want the full picture: each deployment model in detail, full per-role chapters,
      surviving model churn with evals as the load-bearing artifact, the GPAI provider-vs-deployer trap,
      GDPR/NIS2/DORA/Data Act interaction, cross-border data residency, and the board/auditor/engineer defence cheat
      sheet.
    sequence: 8
    lessons:
      - path: 08_go_deeper/01_deployment_models_in_detail.html
        file: 01_deployment_models_in_detail.html
        title: Each deployment model in detail
        description: >-
          Optional. Data flow diagrams, typical contract clauses, cost shape, and operating-team requirements for each
          of the six deployment models.
        kind: lesson
        sequence: 1
        size: 27296
        contentType: text/html
      - path: 08_go_deeper/02_full_role_chapters.html
        file: 02_full_role_chapters.html
        title: Full role chapters — Engineering, SRE, IT, CS, Sales, Finance, People Ops
        description: Optional. The full version of each per-role section, with worked Loopwell examples and tool comparisons.
        kind: lesson
        sequence: 2
        size: 35650
        contentType: text/html
      - path: 08_go_deeper/03_model_churn_and_evals.html
        file: 03_model_churn_and_evals.html
        title: Surviving model churn — evals and the two-vendor posture
        description: >-
          Optional. Why your model choice from last quarter is already not the best one, and how to design for
          substitutability without paying the migration cost every release. Building cheap eval sets that actually catch
          regressions.
        kind: lesson
        sequence: 3
        size: 14574
        contentType: text/html
      - path: 08_go_deeper/04_gpai_provider_vs_deployer.html
        file: 04_gpai_provider_vs_deployer.html
        title: 'GPAI: provider vs deployer — the trap door'
        description: >-
          Optional. Most SaaS companies are deployers. Fine-tuning, rebranding, or 'substantial modification' can flip
          you into provider obligations. How to spot the moment that happens.
        kind: lesson
        sequence: 4
        size: 13984
        contentType: text/html
      - path: 08_go_deeper/05_gdpr_nis2_dora_interaction.html
        file: 05_gdpr_nis2_dora_interaction.html
        title: GDPR, NIS2, DORA, Data Act — where AI governance is new vs. just GDPR with a hat on
        description: Optional. The interaction map between the AI Act and the regulations a SaaS company already lives under.
        kind: lesson
        sequence: 5
        size: 14714
        contentType: text/html
      - path: 08_go_deeper/06_cross_border_residency.html
        file: 06_cross_border_residency.html
        title: Cross-border — serving non-EU from the EU and vice versa
        description: >-
          Optional. Data residency, model residency, and transfer mechanisms. Where 'where does the inference happen?'
          becomes a contractual question.
        kind: lesson
        sequence: 6
        size: 13074
        contentType: text/html
      - path: 08_go_deeper/07_board_auditor_engineer_cheatsheet.html
        file: 07_board_auditor_engineer_cheatsheet.html
        title: Board / auditor / engineer defence cheat sheet
        description: >-
          Optional. Three audiences you'll defend the AI program to, and the answer shape each one needs. A printable
          one-pager.
        kind: lesson
        sequence: 7
        size: 16203
        contentType: text/html
---

<!-- Generated by scripts/upload-course.js from course-source/ai-use-case-management-en/meta.yaml. Do not edit by hand. -->
