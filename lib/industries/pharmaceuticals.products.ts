import { ValueChainStageProducts } from "@/lib/data/industries"

export const pharmaceuticalProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Research & Discovery',
    layout: 'flow',
    products: [
      {
        id: 'drug-discovery',
        name: 'Drug Discovery',
        description: 'Early-stage research and identification of potential drug candidates',
        longDescription: 'Drug discovery involves identifying and validating new molecular entities that could become therapeutic drugs. This includes target identification, lead compound discovery, and initial optimization.',
        companiesDetailed: [
          { name: 'Pfizer', ticker: 'PFE', listing: 'US' },
          { name: 'Johnson & Johnson', ticker: 'JNJ', listing: 'US' },
          { name: 'Merck', ticker: 'MRK', listing: 'US' },
          { name: 'AbbVie', ticker: 'ABBV', listing: 'US' },
          { name: 'Bristol Myers Squibb', ticker: 'BMY', listing: 'US' },
          { name: 'Eli Lilly', ticker: 'LLY', listing: 'US' },
          { name: 'Amgen', ticker: 'AMGN', listing: 'US' },
          { name: 'Gilead Sciences', ticker: 'GILD', listing: 'US' },
          { name: 'Regeneron', ticker: 'REGN', listing: 'US' },
          { name: 'Vertex Pharmaceuticals', ticker: 'VRTX', listing: 'US' },
          { name: 'Moderna', ticker: 'MRNA', listing: 'US' },
          { name: 'Novo Nordisk', ticker: 'NVO', listing: 'ADR' },
          { name: 'Sanofi', ticker: 'SNY', listing: 'ADR' },
          { name: 'Roche', ticker: 'RHHBY', listing: 'ADR' },
          { name: 'AstraZeneca', ticker: 'AZN', listing: 'ADR' },
          { name: 'GlaxoSmithKline', ticker: 'GSK', listing: 'ADR' },
          { name: 'Takeda Pharmaceutical', ticker: 'TAK', listing: 'ADR' }
        ],
        tags: ['R&D', 'Target Identification', 'Lead Discovery']
      },
      {
        id: 'research-tools',
        name: 'Research Tools & Services',
        description: 'Laboratory equipment, reagents, and research services',
        longDescription: 'Companies providing essential tools, equipment, and services that enable pharmaceutical research and development.',
        companiesDetailed: [
          { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
          { name: 'Danaher', ticker: 'DHR', listing: 'US' },
          { name: 'Agilent Technologies', ticker: 'A', listing: 'US' },
          { name: 'Waters Corporation', ticker: 'WAT', listing: 'US' },
          { name: 'PerkinElmer', ticker: 'PKI', listing: 'US' },
          { name: 'Bio-Rad Laboratories', ticker: 'BIO', listing: 'US' },
          { name: 'Illumina', ticker: 'ILMN', listing: 'US' },
          { name: 'Charles River Laboratories', ticker: 'CRL', listing: 'US' },
          { name: 'Bruker Corporation', ticker: 'BRKR', listing: 'US' },
          { name: 'Mettler-Toledo', ticker: 'MTD', listing: 'US' },
          { name: 'Shimadzu Corporation', ticker: 'SMZAY', listing: 'ADR' },
          { name: 'LabCorp', ticker: 'LH', listing: 'US' },
          { name: 'Quest Diagnostics', ticker: 'DGX', listing: 'US' }
        ],
        tags: ['Laboratory Equipment', 'Research Services', 'Analytical Tools']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Development & Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'clinical-trials',
        name: 'Clinical Trials',
        description: 'Human testing phases for drug safety and efficacy',
        longDescription: 'Clinical trials are conducted in phases to test drug safety, efficacy, and optimal dosing in human subjects before regulatory approval.',
        companiesDetailed: [
          { name: 'IQVIA', ticker: 'IQV', listing: 'US' },
          { name: 'Syneos Health', ticker: 'SYNH', listing: 'US' },
          { name: 'Parexel International', ticker: 'PRXL', listing: 'US' },
          { name: 'ICON plc', ticker: 'ICLR', listing: 'US' },
          { name: 'Medpace', ticker: 'MEDP', listing: 'US' },
          { name: 'Fortrea Holdings', ticker: 'FTRE', listing: 'US' }
        ],
        tags: ['Clinical Research', 'Patient Recruitment', 'Data Management']
      },
      {
        id: 'drug-manufacturing',
        name: 'Drug Manufacturing',
        description: 'Production of active pharmaceutical ingredients and finished drugs',
        longDescription: 'Large-scale manufacturing of pharmaceutical products including active pharmaceutical ingredients (APIs) and finished dosage forms.',
        companiesDetailed: [
          { name: 'Catalent', ticker: 'CTLT', listing: 'US' },
          { name: 'Lonza Group', ticker: 'LZAGY', listing: 'ADR' },
          { name: 'Cambrex', ticker: 'CBM', listing: 'US' },
          { name: 'Dr. Reddy\'s Laboratories', ticker: 'RDY', listing: 'ADR' },
          { name: 'Piramal Enterprises', ticker: 'PEL', listing: 'ADR' },
          { name: 'Aurobindo Pharma', ticker: 'ARBPF', listing: 'ADR' },
          { name: 'Lupin Limited', ticker: 'LUPN', listing: 'ADR' },
          { name: 'Cipla', ticker: 'CPLA', listing: 'ADR' },
          { name: 'Sun Pharmaceutical', ticker: 'SUNPHARMA', listing: 'ADR' },
          { name: 'WuXi AppTec', ticker: 'WX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'api-production',
            name: 'API Production',
            description: 'Active Pharmaceutical Ingredient manufacturing',
            longDescription: 'Synthesis and purification of active pharmaceutical ingredients (APIs) at scale under cGMP conditions. Activities include process development, scale-up, impurity control, and technology transfer to ensure consistent quality and regulatory compliance.',
            companiesDetailed: [
              { name: 'Lonza Group', ticker: 'LZAGY', listing: 'ADR' },
              { name: 'Cambrex', ticker: 'CBM', listing: 'US' },
              { name: 'Dr. Reddy\'s Laboratories', ticker: 'RDY', listing: 'ADR' },
              { name: 'Aurobindo Pharma', ticker: 'ARBPF', listing: 'ADR' },
              { name: 'WuXi AppTec', ticker: 'WX', listing: 'US' }
            ]
          },
          {
            id: 'formulation',
            name: 'Formulation & Packaging',
            description: 'Converting APIs into finished dosage forms',
            longDescription: 'Development and production of finished dosage forms (tablets, capsules, injectables) by combining APIs with excipients, optimizing bioavailability, and ensuring stability. Includes primary and secondary packaging with serialization for supply chain security.',
            companiesDetailed: [
              { name: 'Catalent', ticker: 'CTLT', listing: 'US' },
              { name: 'West Pharmaceutical', ticker: 'WST', listing: 'US' },
              { name: 'AptarGroup', ticker: 'ATR', listing: 'US' },
              { name: 'Berry Global', ticker: 'BERY', listing: 'US' },
              { name: 'Gerresheimer', ticker: 'GRRMF', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Manufacturing', 'API', 'Formulation', 'Packaging']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Distribution & Sales',
    layout: 'grid',
    products: [
      {
        id: 'distribution',
        name: 'Pharmaceutical Distribution',
        description: 'Wholesale distribution of pharmaceutical products',
        longDescription: 'Large-scale distribution networks that move pharmaceutical products from manufacturers to pharmacies, hospitals, and other healthcare providers.',
        companiesDetailed: [
          { name: 'McKesson', ticker: 'MCK', listing: 'US' },
          { name: 'AmerisourceBergen', ticker: 'ABC', listing: 'US' },
          { name: 'Cardinal Health', ticker: 'CAH', listing: 'US' },
          { name: 'Cencora', ticker: 'COR', listing: 'US' }
        ],
        tags: ['Wholesale', 'Distribution', 'Supply Chain']
      },
      {
        id: 'pharmacy-retail',
        name: 'Pharmacy & Retail',
        description: 'Retail pharmacy chains and specialty pharmacies',
        longDescription: 'Retail pharmacies that dispense prescription medications directly to consumers, including specialty pharmacies for complex conditions.',
        companiesDetailed: [
          { name: 'CVS Health', ticker: 'CVS', listing: 'US' },
          { name: 'Walgreens Boots Alliance', ticker: 'WBA', listing: 'US' },
          { name: 'OptumRx', ticker: 'UNH', listing: 'US' },
          { name: 'GoodRx', ticker: 'GDRX', listing: 'US' },
          { name: 'Amazon Pharmacy', ticker: 'AMZN', listing: 'US' },
          { name: 'Costco Wholesale', ticker: 'COST', listing: 'US' }
        ],
        tags: ['Retail Pharmacy', 'Specialty Pharmacy', 'PBM']
      },
      {
        id: 'specialty-pharma',
        name: 'Specialty Pharmaceuticals',
        description: 'High-cost, complex medications for rare diseases',
        longDescription: 'Specialized pharmaceutical companies focused on developing and commercializing treatments for rare diseases and complex conditions.',
        companiesDetailed: [
          { name: 'Biogen', ticker: 'BIIB', listing: 'US' },
          { name: 'BioMarin Pharmaceutical', ticker: 'BMRN', listing: 'US' },
          { name: 'Ultragenyx Pharmaceutical', ticker: 'RARE', listing: 'US' },
          { name: 'Sarepta Therapeutics', ticker: 'SRPT', listing: 'US' },
          { name: 'Alnylam Pharmaceuticals', ticker: 'ALNY', listing: 'US' },
          { name: 'Ionis Pharmaceuticals', ticker: 'IONS', listing: 'US' },
          { name: 'Bluebird Bio', ticker: 'BLUE', listing: 'US' },
          { name: 'uniQure', ticker: 'QURE', listing: 'US' },
          { name: 'CRISPR Therapeutics', ticker: 'CRSP', listing: 'US' }
        ],
        tags: ['Rare Diseases', 'Orphan Drugs', 'Specialty Care']
      }
    ]
  }
]
