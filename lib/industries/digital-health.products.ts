import { ValueChainStageProducts } from "@/lib/data/industries"

export const digitalHealthProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Health Data & Platforms',
    layout: 'grid',
    products: [
      {
        id: 'health-data',
        name: 'Health Data Platforms',
        description: 'EHR, health data integration, analytics',
        longDescription: 'Platforms that manage, integrate, and analyze electronic health records (EHR) and other diverse health data sources. These systems enable healthcare providers and researchers to gain insights, improve patient care coordination, and support clinical decision-making.',
        companiesDetailed: [
          { name: 'Cerner (Oracle)', ticker: 'ORCL', listing: 'US' },
          { name: 'Health Catalyst', ticker: 'HCAT', listing: 'US' },
          { name: 'Veradigm', ticker: 'MDRX', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Telehealth & Remote Care',
    layout: 'hybrid',
    products: [
      {
        id: 'telehealth-platforms',
        name: 'Telehealth Platforms',
        description: 'Virtual care delivery platforms',
        longDescription: 'Technology platforms that enable virtual healthcare delivery, including video consultations, remote diagnostics, and digital patient engagement tools. These platforms increase access to care, reduce costs, and offer convenience for both patients and providers.',
        companiesDetailed: [
          { name: 'Teladoc Health', ticker: 'TDOC', listing: 'US' },
          { name: 'Amwell', ticker: 'AMWL', listing: 'US' }
        ]
      },
      {
        id: 'remote-monitoring',
        name: 'Remote Monitoring',
        description: 'RPM devices and software',
        longDescription: 'Devices and software solutions for continuously monitoring patients\' health data outside traditional clinical settings. This includes wearables, connected medical devices, and platforms that collect and analyze vital signs, glucose levels, and other physiological parameters to manage chronic conditions and prevent adverse events.',
        companiesDetailed: [
          { name: 'iRhythm Technologies', ticker: 'IRTC', listing: 'US' },
          { name: 'ResMed', ticker: 'RMD', listing: 'US' },
          { name: 'Dexcom', ticker: 'DXCM', listing: 'US' },
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
          { name: 'Tandem Diabetes Care', ticker: 'TNDM', listing: 'US' },
          { name: 'Insulet', ticker: 'PODD', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Consumer Health & Analytics',
    layout: 'grid',
    products: [
      {
        id: 'consumer-health',
        name: 'Consumer Health',
        description: 'Wellness, mental health, and chronic disease apps',
        longDescription: 'Digital applications and platforms directly engaging consumers for wellness, mental health support, and chronic disease management. These tools often provide personalized insights, coaching, and educational content to empower individuals in managing their health.',
        companiesDetailed: [
          { name: 'WW International', ticker: 'WW', listing: 'US' },
          { name: 'Hims & Hers Health', ticker: 'HIMS', listing: 'US' },
          { name: 'Livongo (merged with Teladoc)', ticker: 'TDOC', listing: 'US' },
          { name: 'GoodRx', ticker: 'GDRX', listing: 'US' },
          { name: 'Cigna (Evernorth)', ticker: 'CI', listing: 'US' }
        ]
      }
    ]
  }
]


