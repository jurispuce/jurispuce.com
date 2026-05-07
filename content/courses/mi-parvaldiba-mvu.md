---
title: MI pārvaldība praksē — MVU un valsts iestādēm
description: >-
  Praktisks kurss MVU vadītājiem un valsts iestāžu kiberdrošības atbildīgajiem par to, kā ieviest MI sistēmas,
  integrējot ES MI Akta, GDPR, risku pārvaldības un piegādātāju pārvaldības prasības. Fokuss uz deployment modeļu izvēli
  (lokāli vs. mākonis vs. nedraudzīgo valstu modeļi) un integrētu kontroļu sistēmu.
weight: 20
difficulty: Intermediate
duration: 1 hour
private: true
courseSlug: mi-parvaldiba-mvu
bucket: course-materials
generated: true
files:
  - path: 00_ievads/01_kursa_ievads.html
    title: Kursa ievads — orientācija un pieeja
    description: >-
      Mērķauditorija (kiberdrošības atbildīgie MVU un valsts iestādēs), mācību rezultāti, laika ieguldījums, lietošanas
      ceļvedis un kursa kartējums.
    kind: lesson
    contentType: text/html
    size: 19036
  - path: 01_konteksts/01_kapec_integret.html
    title: Trīs jomu krustpunkts — MI, personas dati un piegādātāji
    description: >-
      Kāpēc viens MI lietojums vienlaicīgi pieskaras MI Aktam, GDPR un piegādātāju pārvaldībai. Clearview AI gadījums kā
      piemērs vairāku regulatoru reakcijai uz vienu incidentu.
    kind: lesson
    contentType: text/html
    size: 21097
  - path: 02_lomas_un_piegades_kede/01_lomu_kede_diagramma.html
    title: MI lomu un piegādes ķēdes interaktīvā diagramma
    description: >-
      Klikšķināma piegādes ķēde no bāzes modeļa pie gala lietotāja. Katrā mezglā parāda atbildības, MI Akta lomu, GDPR
      lomu un to, ko deployer joprojām nevar deleģēt.
    kind: lesson
    contentType: text/html
    size: 25715
  - path: 03_deployment_modeli/01_deployment_salidzinajums.html
    title: Deployment modeļu salīdzinātājs
    description: >-
      Interaktīvs salīdzinājums starp 4 deployment modeļiem. Datu suverenitāte, modeļa suverenitāte, GDPR transfer, MI
      Akta lomas un tipiskās kontroles katrā variantā. Mīti par 'lokāli = drošāk' un 'ES region = ES jurisdikcija'.
    kind: lesson
    contentType: text/html
    size: 46744
  - path: 04_integreta_risku_parvaldiba/01_kontrolu_laika_skala.html
    title: MI kontroļu laika skala — preliminary, monitoring, recurring
    description: >-
      Interaktīva trīs fāžu laika skala. Klikšķini katrā fāzē un redzi, kuras MI specifiskās, GDPR un piegādātāju
      kontroles tiek veiktas un kā tās savstarpēji baro viena otru.
    kind: lesson
    contentType: text/html
    size: 29544
  - path: 04_integreta_risku_parvaldiba/02_mi_registrs_minimums.html
    title: MI lietojumu reģistra minimums — ar atsaucēm
    description: >-
      12 lauku minimālais MI lietojumu reģistrs. Princips 'reģistrs kā centrmezgls, ne kopija' — riski paliek risku
      reģistrā, kontroles paliek kontroļu reģistrā, vendori paliek piegādātāju reģistrā. Pilna parauga ieraksts.
    kind: lesson
    contentType: text/html
    size: 28658
  - path: 05_lemumu_pienemsana/01_lemumu_koks.html
    title: Lēmumu koks — Vai un kā ieviest MI rīku
    description: >-
      Soli pa solim no jautājuma 'Vai mums tas ir vajadzīgs?' līdz dokumentētai ieviešanai. Tipisko kļūdu (Wishful
      Thinking, It's Not AI, Vendor Blame Game) izgaismošana.
    kind: lesson
    contentType: text/html
    size: 26030
blocks:
  - id: 00_ievads
    dir: 00_ievads
    title: Kursa ievads
    summary: >-
      Kam šis kurss ir paredzēts, ko iegūsiet, cik laika jāvelta un kā lietot materiālu. Kursa kartējums un
      priekšnoteikumi.
    sequence: 1
    lessons:
      - path: 00_ievads/01_kursa_ievads.html
        file: 01_kursa_ievads.html
        title: Kursa ievads — orientācija un pieeja
        description: >-
          Mērķauditorija (kiberdrošības atbildīgie MVU un valsts iestādēs), mācību rezultāti, laika ieguldījums,
          lietošanas ceļvedis un kursa kartējums.
        kind: lesson
        sequence: 1
        size: 19036
        contentType: text/html
  - id: 01_konteksts
    dir: 01_konteksts
    title: Kāpēc integrēt MI, GDPR, risku un piegādātāju pārvaldību
    summary: >-
      Kāpēc MI Akts nedrīkst dzīvot atsevišķi no GDPR, risku reģistra un piegādātāju pārvaldības. Latvijas konteksts ar
      DVI kā uzraugošo iestādi un Clearview AI gadījuma piemēru.
    sequence: 2
    lessons:
      - path: 01_konteksts/01_kapec_integret.html
        file: 01_kapec_integret.html
        title: Trīs jomu krustpunkts — MI, personas dati un piegādātāji
        description: >-
          Kāpēc viens MI lietojums vienlaicīgi pieskaras MI Aktam, GDPR un piegādātāju pārvaldībai. Clearview AI
          gadījums kā piemērs vairāku regulatoru reakcijai uz vienu incidentu.
        kind: lesson
        sequence: 1
        size: 21097
        contentType: text/html
  - id: 02_lomas_un_piegades_kede
    dir: 02_lomas_un_piegades_kede
    title: Lomas un piegādes ķēde
    summary: >-
      Provider, deployer, importer, distributor un downstream provider — kā šīs lomas izpaužas reālā piegādes ķēdē, kur
      tev paliek atbildība un kas to nevar deleģēt vendoram.
    sequence: 3
    lessons:
      - path: 02_lomas_un_piegades_kede/01_lomu_kede_diagramma.html
        file: 01_lomu_kede_diagramma.html
        title: MI lomu un piegādes ķēdes interaktīvā diagramma
        description: >-
          Klikšķināma piegādes ķēde no bāzes modeļa pie gala lietotāja. Katrā mezglā parāda atbildības, MI Akta lomu,
          GDPR lomu un to, ko deployer joprojām nevar deleģēt.
        kind: lesson
        sequence: 1
        size: 25715
        contentType: text/html
  - id: 03_deployment_modeli
    dir: 03_deployment_modeli
    title: Deployment modeļi un to riski
    summary: >-
      Četri deployment modeļi: provider-hosted SaaS, cloud API ES regionā, self-hosted open-source un hibrīds/RAG.
      Lokālie modeļi pret mākoņa modeļiem, ASV jurisdikcija pret Ķīnas/Krievijas izcelsmes modeļiem — ko izvēlēties un
      kādēļ.
    sequence: 4
    lessons:
      - path: 03_deployment_modeli/01_deployment_salidzinajums.html
        file: 01_deployment_salidzinajums.html
        title: Deployment modeļu salīdzinātājs
        description: >-
          Interaktīvs salīdzinājums starp 4 deployment modeļiem. Datu suverenitāte, modeļa suverenitāte, GDPR transfer,
          MI Akta lomas un tipiskās kontroles katrā variantā. Mīti par 'lokāli = drošāk' un 'ES region = ES
          jurisdikcija'.
        kind: lesson
        sequence: 1
        size: 46744
        contentType: text/html
  - id: 04_integreta_risku_parvaldiba
    dir: 04_integreta_risku_parvaldiba
    title: Integrētā risku pārvaldība
    summary: >-
      Trīs kontroļu kategorijas — preliminary (pirms ieviešanas), monitoring (operatīvie) un recurring (regulāri
      pārskatāmie). Integrētais kontroļu plāns un MI lietojumu reģistra minimums ar atsaucēm uz eksistējošiem
      reģistriem.
    sequence: 5
    lessons:
      - path: 04_integreta_risku_parvaldiba/01_kontrolu_laika_skala.html
        file: 01_kontrolu_laika_skala.html
        title: MI kontroļu laika skala — preliminary, monitoring, recurring
        description: >-
          Interaktīva trīs fāžu laika skala. Klikšķini katrā fāzē un redzi, kuras MI specifiskās, GDPR un piegādātāju
          kontroles tiek veiktas un kā tās savstarpēji baro viena otru.
        kind: lesson
        sequence: 1
        size: 29544
        contentType: text/html
      - path: 04_integreta_risku_parvaldiba/02_mi_registrs_minimums.html
        file: 02_mi_registrs_minimums.html
        title: MI lietojumu reģistra minimums — ar atsaucēm
        description: >-
          12 lauku minimālais MI lietojumu reģistrs. Princips 'reģistrs kā centrmezgls, ne kopija' — riski paliek risku
          reģistrā, kontroles paliek kontroļu reģistrā, vendori paliek piegādātāju reģistrā. Pilna parauga ieraksts.
        kind: lesson
        sequence: 2
        size: 28658
        contentType: text/html
  - id: 05_lemumu_pienemsana
    dir: 05_lemumu_pienemsana
    title: Praktiskā lēmumu pieņemšana
    summary: >-
      Lēmumu koks 'Es gribu ieviest jaunu MI rīku — no kurienes sākt?'. Tipiskās kļūdas un to izvairīšanās. Ko darīt
      šonedēļ, šomēnes un šogad.
    sequence: 6
    lessons:
      - path: 05_lemumu_pienemsana/01_lemumu_koks.html
        file: 01_lemumu_koks.html
        title: Lēmumu koks — Vai un kā ieviest MI rīku
        description: >-
          Soli pa solim no jautājuma 'Vai mums tas ir vajadzīgs?' līdz dokumentētai ieviešanai. Tipisko kļūdu (Wishful
          Thinking, It's Not AI, Vendor Blame Game) izgaismošana.
        kind: lesson
        sequence: 1
        size: 26030
        contentType: text/html
---

<!-- Generated by scripts/upload-course.js from course-source/mi-parvaldiba-mvu/meta.yaml. Do not edit by hand. -->
