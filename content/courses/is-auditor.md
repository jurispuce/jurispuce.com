---
title: IS Auditors — Informācijas sistēmu audits
description: >-
  Praktisks kurss informācijas sistēmu auditoriem: no IT pamatu izpratnes līdz audita ziņojuma sagatavošanai. Ietver
  interaktīvus materiālus, simulācijas un atsauces uz ISO 27001, ISO 19011, MK 397 un EU MI Aktu.
weight: 10
difficulty: Intermediate
duration: 12 hours
courseSlug: is-auditor
bucket: course-materials
generated: true
blocks:
- id: 01_it-systems
  dir: 01_it-systems
  title: IT Sistēmas pamati
  summary: Sistēmas slāņi, žurnālfaili un laika sinhronizācija — auditoram nepieciešamā IT pamatzināšanu bāze. Iepazīstieties ar
    datu bāzu tipiem, OSI modeli un procesu atkarībām, pirms pārejat pie audita metodēm.
  sequence: 1
  lessons:
  - path: 01_it-systems/01_it_sistemas_anatomija_pamata.html
    file: 01_it_sistemas_anatomija_pamata.html
    title: IT sistēmas anatomija auditoram (pamata)
    description: Sistēmas slāņi, IT procesi, OSI modelis un atkarības — pamata versija ar fokusu uz tradicionālajām datubāzēm.
    kind: lesson
    sequence: 1
    size: 83798
    contentType: text/html
  - path: 01_it-systems/02_it_sistemas_anatomija_paplasinata.html
    file: 02_it_sistemas_anatomija_paplasinata.html
    title: IT sistēmas anatomija auditoram (paplašinātā)
    description: Paplašināta versija, kas papildus ietver modernos datu glabāšanas veidus — SQL, objektu krātuve (S3/Blob),
      NoSQL un kešatmiņa (Redis), ar audita jautājumiem katram tipam.
    kind: lesson
    sequence: 2
    size: 87781
    contentType: text/html
  - path: 01_it-systems/03_zurnalfaili_laika_sinhronizacija.html
    file: 03_zurnalfaili_laika_sinhronizacija.html
    title: Žurnālfaili un laika sinhronizācija
    description: Praktiski scenāriji par žurnālfailu avotiem, laika formātiem un pulksteņa nobīdes vizualizāciju SmartCity Rīga
      kontekstā.
    kind: lesson
    sequence: 3
    size: 36461
    contentType: text/html
- id: 02_risk-management
  dir: 02_risk-management
  title: Risku pārvaldība
  summary: ISO 27005 un ISO 31000 risku apstrādes iespējas un brīdinājumu pārvaldība praksē. Izprotiet, kā novērtēt risku
    līmeņus pirms un pēc kontrolēm, un kā samazināt alert fatigue efektu.
  sequence: 2
  lessons:
  - path: 02_risk-management/01_risk_treatment_options.html
    file: 01_risk_treatment_options.html
    title: Risku pārvaldības iespējas — interaktīva diagramma
    description: ISO 27005/ISO 31000 risku apstrādes opcijas — pieņemt, modificēt (kontroles/pārnese), izvairīties. MedReg
      un SmartCity scenāriji ar pirms/pēc risku līmeņiem.
    kind: lesson
    sequence: 1
    size: 15669
    contentType: text/html
  - path: 02_risk-management/02_bridinajumu_parvaldiba_alert_fatigue.html
    file: 02_bridinajumu_parvaldiba_alert_fatigue.html
    title: Brīdinājumu pārvaldība un alert fatigue
    description: Alert fatigue problēma, 4 iespējamie iznākumi (confusion matrix), 6 soļu brīdinājumu noskaņošanas cikls
      un audita jautājumi par monitoringa efektivitāti.
    kind: lesson
    sequence: 2
    size: 39428
    contentType: text/html
- id: 03_audit-process
  dir: 03_audit-process
  title: Audita process
  summary: No informācijas avota līdz secinājumam — audita soļu secība, kontroļu novērtēšana un tehniskā audita veidi.
    Šī bloka materiāli veido audita darba kodolu.
  sequence: 3
  lessons:
  - path: 03_audit-process/01_no_avota_lidz_secinajumam.html
    file: 01_no_avota_lidz_secinajumam.html
    title: No avota līdz secinājumam
    description: Interaktīvs modelis par audita informācijas transformāciju 6 posmos — no sākotnējā avota līdz audita secinājumam.
      Atsauce uz ISO 19011, 7.2.3.
    kind: lesson
    sequence: 1
    size: 40021
    contentType: text/html
  - path: 03_audit-process/02_kontrolu_pietiekamiba_efektivitate.html
    file: 02_kontrolu_pietiekamiba_efektivitate.html
    title: Kontroļu pietiekamība un efektivitāte
    description: Divi audita ceļi (prasību un risku bāzēti), auditora lēmumu punkti katrā posmā — vai kontroles ir pietiekamas
      un vai tās faktiski darbojas.
    kind: lesson
    sequence: 2
    size: 40452
    contentType: text/html
  - path: 03_audit-process/03_tehniska_audita_tipi.html
    file: 03_tehniska_audita_tipi.html
    title: Tehniskā audita tipi
    description: 5 tehniskā IT audita veidi — ievainojamību novērtējums, konfigurācijas pārskats, koda pārskats, piekļuves
      pārskats, tīkla audits. Ietver lēmumu palīga viktorīnu.
    kind: lesson
    sequence: 3
    size: 45460
    contentType: text/html
  - path: 03_audit-process/04_audita_konstatejumu_klasifikacija.html
    file: 04_audita_konstatejumu_klasifikacija.html
    title: Audita konstatējumu klasifikācija — 8 kategorijas
    description: 8 audita konstatējumu kategorijas no pozitīviem novērojumiem līdz būtiskām neatbilstībām. Atsauces uz
      ISO 19011, ISO 17021 un IIA praksi.
    kind: lesson
    sequence: 4
    size: 28486
    contentType: text/html
- id: 04_audit-documentation
  dir: 04_audit-documentation
  title: Audita dokumentācija
  summary: Neatbilstības ziņojuma (NCR) aizpildīšana un audita ziņojuma struktūra saskaņā ar ISO 19011. Uzziniet, kā
    sagatavot profesionālu dokumentāciju, kas iztur ārējo pārskatu.
  sequence: 4
  lessons:
  - path: 04_audit-documentation/01_ncr_forma.html
    file: 01_ncr_forma.html
    title: Neatbilstības ziņojuma forma (NCR) — interaktīvs paraugs
    description: Interaktīva NCR formas veidne ar klikšķināmiem lauku skaidrojumiem. Māca pareizi aizpildīt neatbilstības
      ziņojumu IS audita laikā.
    kind: lesson
    sequence: 1
    size: 32235
    contentType: text/html
  - path: 04_audit-documentation/02_audita_zinojuma_struktura.html
    file: 02_audita_zinojuma_struktura.html
    title: Audita ziņojuma struktūra
    description: ISMS iekšējā audita ziņojuma struktūras interaktīvs pārskats — klienta informācija, audita tvērums, metodoloģija,
      konstatējumi, atbilstības secinājumi un A pielikuma prasību izpilde.
    kind: lesson
    sequence: 2
    size: 39665
    contentType: text/html
- id: 05_incident-management
  dir: 05_incident-management
  title: Incidentu pārvaldība
  summary: Incidentu dzīves cikls saskaņā ar ISO 27035 un MK 397, un praktiska simulācija reālu scenāriju apgūšanai.
    Šis bloks sagatavo auditoru pārbaudīt, vai organizācija spēj reaģēt uz incidentiem.
  sequence: 5
  lessons:
  - path: 05_incident-management/01_incidentu_dzives_cikls_audits.html
    file: 01_incidentu_dzives_cikls_audits.html
    title: Incidentu dzīves cikls un audita pārbaude
    description: 6 incidentu dzīves cikla fāzes ar fokusu uz slēgšanas procesu un tā 5 obligātajiem elementiem. ISO 27035
      un MK 397 atsauces.
    kind: lesson
    sequence: 1
    size: 45835
    contentType: text/html
  - path: 05_incident-management/02_incidentu_parvaldibas_simulacija.html
    file: 02_incidentu_parvaldibas_simulacija.html
    title: Incidentu pārvaldības simulācija
    description: Interaktīva simulācija, balstoties uz MK 397 un ISO 27035 — scenāriju vingrinājums incidentu atklāšanā,
      klasifikācijā, reaģēšanā un ziņošanā.
    kind: lesson
    sequence: 2
    size: 111472
    contentType: text/html
- id: 06_continuity-and-ai
  dir: 06_continuity-and-ai
  title: Nepārtrauktība un MI
  summary: Biznesa nepārtrauktības plānošana (BIA → BCP → DRP) un EU Mākslīgā intelekta akta prasības no izvietotāja
    perspektīvas. Nobeiguma bloks, kas aptver modernākās regulatīvās prasības.
  sequence: 6
  lessons:
  - path: 06_continuity-and-ai/01_bia_bcp_drp_vizualizacija.html
    file: 01_bia_bcp_drp_vizualizacija.html
    title: BIA → BCP → DRP — No analīzes līdz plāniem
    description: Pilna biznesa nepārtrauktības ķēde — ietekmes analīze (BIA), nepārtrauktības plāns (BCP), avārijas atjaunošanas
      plāns (DRP). RTO/RPO/SLA metrikas, testēšanas pieejas. MK 397, ISO 22301, ISO 27031.
    kind: lesson
    sequence: 1
    size: 46602
    contentType: text/html
  - path: 06_continuity-and-ai/02_mi_lietojumu_registrs_audits.html
    file: 02_mi_lietojumu_registrs_audits.html
    title: MI lietojumu reģistrs un audits — EU MI Akts
    description: EU Mākslīgā intelekta akts no izvietotāja perspektīvas — lomas, 36 lauku reģistra veidne, 3 audita pieejas
      un pašnovērtējuma rīks. MedReg/SmartCity piemēri.
    kind: lesson
    sequence: 2
    size: 73314
    contentType: text/html
files:
- path: 01_it-systems/01_it_sistemas_anatomija_pamata.html
  title: IT sistēmas anatomija auditoram (pamata)
  description: Sistēmas slāņi, IT procesi, OSI modelis un atkarības — pamata versija ar fokusu uz tradicionālajām datubāzēm.
  kind: lesson
  contentType: text/html
  size: 83798
- path: 01_it-systems/02_it_sistemas_anatomija_paplasinata.html
  title: IT sistēmas anatomija auditoram (paplašinātā)
  description: Paplašināta versija, kas papildus ietver modernos datu glabāšanas veidus — SQL, objektu krātuve (S3/Blob),
    NoSQL un kešatmiņa (Redis), ar audita jautājumiem katram tipam.
  kind: lesson
  contentType: text/html
  size: 87781
- path: 01_it-systems/03_zurnalfaili_laika_sinhronizacija.html
  title: Žurnālfaili un laika sinhronizācija
  description: Praktiski scenāriji par žurnālfailu avotiem, laika formātiem un pulksteņa nobīdes vizualizāciju SmartCity
    Rīga kontekstā.
  kind: lesson
  contentType: text/html
  size: 36461
- path: 02_risk-management/01_risk_treatment_options.html
  title: Risku pārvaldības iespējas — interaktīva diagramma
  description: ISO 27005/ISO 31000 risku apstrādes opcijas — pieņemt, modificēt (kontroles/pārnese), izvairīties.
  kind: lesson
  contentType: text/html
  size: 15669
- path: 02_risk-management/02_bridinajumu_parvaldiba_alert_fatigue.html
  title: Brīdinājumu pārvaldība un alert fatigue
  description: Alert fatigue problēma, 4 iespējamie iznākumi, 6 soļu brīdinājumu noskaņošanas cikls.
  kind: lesson
  contentType: text/html
  size: 39428
- path: 03_audit-process/01_no_avota_lidz_secinajumam.html
  title: No avota līdz secinājumam
  description: Interaktīvs modelis par audita informācijas transformāciju 6 posmos.
  kind: lesson
  contentType: text/html
  size: 40021
- path: 03_audit-process/02_kontrolu_pietiekamiba_efektivitate.html
  title: Kontroļu pietiekamība un efektivitāte
  description: Divi audita ceļi (prasību un risku bāzēti), auditora lēmumu punkti katrā posmā.
  kind: lesson
  contentType: text/html
  size: 40452
- path: 03_audit-process/03_tehniska_audita_tipi.html
  title: Tehniskā audita tipi
  description: 5 tehniskā IT audita veidi ar lēmumu palīga viktorīnu.
  kind: lesson
  contentType: text/html
  size: 45460
- path: 03_audit-process/04_audita_konstatejumu_klasifikacija.html
  title: Audita konstatējumu klasifikācija — 8 kategorijas
  description: 8 audita konstatējumu kategorijas. Atsauces uz ISO 19011, ISO 17021 un IIA.
  kind: lesson
  contentType: text/html
  size: 28486
- path: 04_audit-documentation/01_ncr_forma.html
  title: Neatbilstības ziņojuma forma (NCR) — interaktīvs paraugs
  description: Interaktīva NCR formas veidne ar klikšķināmiem lauku skaidrojumiem.
  kind: lesson
  contentType: text/html
  size: 32235
- path: 04_audit-documentation/02_audita_zinojuma_struktura.html
  title: Audita ziņojuma struktūra
  description: ISMS iekšējā audita ziņojuma struktūras interaktīvs pārskats.
  kind: lesson
  contentType: text/html
  size: 39665
- path: 05_incident-management/01_incidentu_dzives_cikls_audits.html
  title: Incidentu dzīves cikls un audita pārbaude
  description: 6 incidentu dzīves cikla fāzes. ISO 27035 un MK 397 atsauces.
  kind: lesson
  contentType: text/html
  size: 45835
- path: 05_incident-management/02_incidentu_parvaldibas_simulacija.html
  title: Incidentu pārvaldības simulācija
  description: Interaktīva simulācija, balstoties uz MK 397 un ISO 27035.
  kind: lesson
  contentType: text/html
  size: 111472
- path: 06_continuity-and-ai/01_bia_bcp_drp_vizualizacija.html
  title: BIA → BCP → DRP — No analīzes līdz plāniem
  description: Pilna biznesa nepārtrauktības ķēde. MK 397, ISO 22301, ISO 27031.
  kind: lesson
  contentType: text/html
  size: 46602
- path: 06_continuity-and-ai/02_mi_lietojumu_registrs_audits.html
  title: MI lietojumu reģistrs un audits — EU MI Akts
  description: EU Mākslīgā intelekta akts no izvietotāja perspektīvas. MedReg/SmartCity piemēri.
  kind: lesson
  contentType: text/html
  size: 73314
---

<!-- Generated by scripts/upload-course.js from course-source/is-auditor/meta.yaml. Do not edit by hand. -->
