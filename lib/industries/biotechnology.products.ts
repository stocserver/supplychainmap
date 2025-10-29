import { ValueChainStageProducts } from "@/lib/data/industries"

export const biotechnologyProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Research & Discovery',
    layout: 'flow',
    products: [
      {
        id: 'research-tools',
        name: 'Research Tools & Platforms',
        description: 'Biotechnology research tools and platforms',
        longDescription: 'Companies that develop and provide research tools, laboratory equipment, and platforms that enable biotechnology research and drug discovery.',
        companiesDetailed: [
          { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
          { name: 'Danaher', ticker: 'DHR', listing: 'US' },
          { name: 'Agilent Technologies', ticker: 'A', listing: 'US' },
          { name: 'Waters Corporation', ticker: 'WAT', listing: 'US' },
          { name: 'Revvity (formerly PerkinElmer)', ticker: 'RVTY', listing: 'US' },
          { name: 'Bio-Rad Laboratories', ticker: 'BIO', listing: 'US' },
          { name: '10x Genomics', ticker: 'TXG', listing: 'US' },
          { name: 'Illumina', ticker: 'ILMN', listing: 'US' },
          { name: 'Pacific Biosciences', ticker: 'PACB', listing: 'US' },
          { name: 'Bionano Genomics', ticker: 'BNGO', listing: 'US' },
          { name: 'Element Biosciences', ticker: 'ELBM', listing: 'US' },
          { name: 'Nanostring Technologies', ticker: 'NSTG', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'sequencing-platforms',
            name: 'DNA Sequencing Platforms',
            description: 'Next-generation sequencing technology',
            longDescription: 'High-throughput technologies and instruments that determine the order of nucleotides in DNA and RNA. These platforms enable genomics research, clinical diagnostics, and precision medicine by providing rapid, cost-effective sequencing.',
            companiesDetailed: [
              { name: 'Illumina', ticker: 'ILMN', listing: 'US' },
              { name: 'Pacific Biosciences', ticker: 'PACB', listing: 'US' }
            ]
          },
          {
            id: 'analytical-instruments',
            name: 'Analytical Instruments',
            description: 'Laboratory analysis equipment',
            longDescription: 'Laboratory instrumentation used for sample preparation, detection, and analysis, including mass spectrometry, chromatography, and spectroscopy systems that support discovery, quality control, and clinical workflows.',
            companiesDetailed: [
              { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
              { name: 'Agilent Technologies', ticker: 'A', listing: 'US' },
              { name: 'Waters Corporation', ticker: 'WAT', listing: 'US' }
            ]
          }
        ],
        tags: ['Research Tools', 'Sequencing', 'Analytics', 'Laboratory']
      },
      {
        id: 'gene-editing',
        name: 'Gene Editing & Cell Therapy',
        description: 'Advanced gene editing and cell therapy technologies',
        longDescription: 'Companies developing gene editing technologies like CRISPR and cell therapy platforms for treating genetic diseases and cancer.',
        companiesDetailed: [
          { name: 'CRISPR Therapeutics', ticker: 'CRSP', listing: 'US' },
          { name: 'Editas Medicine', ticker: 'EDIT', listing: 'US' },
          { name: 'Intellia Therapeutics', ticker: 'NTLA', listing: 'US' },
          { name: 'Bluebird Bio', ticker: 'BLUE', listing: 'US' },
          { name: 'Sangamo Therapeutics', ticker: 'SGMO', listing: 'US' },
          { name: 'Precision BioSciences', ticker: 'DTIL', listing: 'US' },
          { name: 'Beam Therapeutics', ticker: 'BEAM', listing: 'US' },
          { name: 'Fate Therapeutics', ticker: 'FATE', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'crispr-technology',
            name: 'CRISPR Technology',
            description: 'CRISPR gene editing platforms',
            longDescription: 'Programmable nucleases (e.g., Cas9, Cas12) and delivery systems enabling targeted genome modification for research and therapeutic applications, including in vivo and ex vivo approaches.',
            companiesDetailed: [
              { name: 'CRISPR Therapeutics', ticker: 'CRSP', listing: 'US' },
              { name: 'Editas Medicine', ticker: 'EDIT', listing: 'US' },
              { name: 'Intellia Therapeutics', ticker: 'NTLA', listing: 'US' }
            ]
          },
          {
            id: 'cell-therapy',
            name: 'Cell Therapy',
            description: 'Cell-based therapeutic approaches',
            longDescription: 'Therapies that modify or use living cells (e.g., CAR-T, stem cells) to restore, replace, or enhance biological functions, targeting oncology, genetic, and autoimmune diseases.',
            companiesDetailed: [
              { name: 'Bluebird Bio', ticker: 'BLUE', listing: 'US' },
              { name: 'Sangamo Therapeutics', ticker: 'SGMO', listing: 'US' },
              { name: 'Precision BioSciences', ticker: 'DTIL', listing: 'US' }
            ]
          }
        ],
        tags: ['Gene Editing', 'CRISPR', 'Cell Therapy', 'Genetics']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Development & Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'therapeutics-dev',
        name: 'Therapeutic Development',
        description: 'Biotechnology drug development and clinical trials',
        longDescription: 'Companies that develop biotechnological therapeutics including monoclonal antibodies, recombinant proteins, and other biologics.',
        companiesDetailed: [
          { name: 'Amgen', ticker: 'AMGN', listing: 'US' },
          { name: 'Gilead Sciences', ticker: 'GILD', listing: 'US' },
          { name: 'Biogen', ticker: 'BIIB', listing: 'US' },
          { name: 'Regeneron', ticker: 'REGN', listing: 'US' },
          { name: 'Vertex Pharmaceuticals', ticker: 'VRTX', listing: 'US' },
          { name: 'Moderna', ticker: 'MRNA', listing: 'US' },
          { name: 'Arcturus Therapeutics', ticker: 'ARCT', listing: 'US' },
          { name: 'Incyte', ticker: 'INCY', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'monoclonal-antibodies',
            name: 'Monoclonal Antibodies',
            description: 'Therapeutic antibody development',
            companiesDetailed: [
              { name: 'Regeneron', ticker: 'REGN', listing: 'US' },
              { name: 'Amgen', ticker: 'AMGN', listing: 'US' },
              { name: 'Biogen', ticker: 'BIIB', listing: 'US' }
            ]
          },
          {
            id: 'mrna-technology',
            name: 'mRNA Technology',
            description: 'Messenger RNA therapeutics',
            companiesDetailed: [
              { name: 'Moderna', ticker: 'MRNA', listing: 'US' },
              { name: 'BioNTech', ticker: 'BNTX', listing: 'US' },
              { name: 'Arcturus Therapeutics', ticker: 'ARCT', listing: 'US' }
            ]
          }
        ],
        tags: ['Biologics', 'Antibodies', 'mRNA', 'Therapeutics']
      },
      {
        id: 'diagnostics-dev',
        name: 'Diagnostics Development',
        description: 'Biotechnology diagnostic tools and tests',
        longDescription: 'Companies that develop diagnostic tests, biomarkers, and diagnostic tools using biotechnology approaches.',
        companiesDetailed: [
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Roche', ticker: 'RHHBY', listing: 'ADR' },
          { name: 'Danaher', ticker: 'DHR', listing: 'US' },
          { name: 'Becton Dickinson', ticker: 'BDX', listing: 'US' },
          { name: 'Hologic', ticker: 'HOLX', listing: 'US' },
          { name: 'QuidelOrtho', ticker: 'QDEL', listing: 'US' },
          { name: 'Exact Sciences', ticker: 'EXAS', listing: 'US' },
          { name: 'Guardant Health', ticker: 'GH', listing: 'US' },
          { name: 'Natera', ticker: 'NTRA', listing: 'US' },
          { name: 'Invitae', ticker: 'NVTA', listing: 'US' },
          { name: 'NeoGenomics', ticker: 'NEO', listing: 'US' },
          { name: 'Adaptive Biotechnologies', ticker: 'ADPT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'molecular-diagnostics',
            name: 'Molecular Diagnostics',
            description: 'DNA and RNA-based diagnostic tests',
            companiesDetailed: [
              { name: 'Roche', ticker: 'RHHBY', listing: 'ADR' },
              { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
              { name: 'Exact Sciences', ticker: 'EXAS', listing: 'US' },
              { name: 'Hologic', ticker: 'HOLX', listing: 'US' }
            ]
          },
          {
            id: 'liquid-biopsy',
            name: 'Liquid Biopsy',
            description: 'Blood-based cancer detection',
            companiesDetailed: [
              { name: 'Guardant Health', ticker: 'GH', listing: 'US' },
              { name: 'Natera', ticker: 'NTRA', listing: 'US' }
            ]
          }
        ],
        tags: ['Diagnostics', 'Biomarkers', 'Testing', 'Detection']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Commercialization & Services',
    layout: 'grid',
    products: [
      {
        id: 'commercialization',
        name: 'Commercialization',
        description: 'Biotechnology product commercialization and marketing',
        longDescription: 'Companies that commercialize biotechnology products, manage regulatory approvals, and market biotech therapeutics and diagnostics.',
        companiesDetailed: [
          { name: 'Amgen', ticker: 'AMGN', listing: 'US' },
          { name: 'Gilead Sciences', ticker: 'GILD', listing: 'US' },
          { name: 'Biogen', ticker: 'BIIB', listing: 'US' },
          { name: 'Regeneron', ticker: 'REGN', listing: 'US' },
          { name: 'Vertex Pharmaceuticals', ticker: 'VRTX', listing: 'US' },
          { name: 'BioMarin Pharmaceutical', ticker: 'BMRN', listing: 'US' },
          { name: 'Ultragenyx Pharmaceutical', ticker: 'RARE', listing: 'US' },
          { name: 'Alnylam Pharmaceuticals', ticker: 'ALNY', listing: 'US' },
          { name: 'Incyte', ticker: 'INCY', listing: 'US' },
          { name: 'Exelixis', ticker: 'EXEL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'rare-diseases',
            name: 'Rare Disease Therapeutics',
            description: 'Orphan drugs for rare diseases',
            companiesDetailed: [
              { name: 'BioMarin Pharmaceutical', ticker: 'BMRN', listing: 'US' },
              { name: 'Ultragenyx Pharmaceutical', ticker: 'RARE', listing: 'US' },
              { name: 'Sarepta Therapeutics', ticker: 'SRPT', listing: 'US' }
            ]
          },
          {
            id: 'oncology',
            name: 'Oncology Therapeutics',
            description: 'Cancer treatment biologics',
            companiesDetailed: [
              { name: 'Amgen', ticker: 'AMGN', listing: 'US' },
              { name: 'Regeneron', ticker: 'REGN', listing: 'US' },
              { name: 'Gilead Sciences', ticker: 'GILD', listing: 'US' },
              { name: 'Exelixis', ticker: 'EXEL', listing: 'US' }
            ]
          }
        ],
        tags: ['Commercialization', 'Marketing', 'Regulatory', 'Sales']
      },
      {
        id: 'cdmo',
        name: 'Contract Development & Manufacturing',
        description: 'Biotechnology contract services',
        longDescription: 'Companies that provide contract development and manufacturing services for biotechnology companies.',
        companiesDetailed: [
          { name: 'Catalent', ticker: 'CTLT', listing: 'US' },
          { name: 'Charles River Laboratories', ticker: 'CRL', listing: 'US' },
          { name: 'Avid Bioservices', ticker: 'CDMO', listing: 'US' },
          { name: 'Emergent BioSolutions', ticker: 'EBS', listing: 'US' },
          { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
          { name: 'Lonza Group', ticker: 'LZAGY', listing: 'ADR' },
          { name: 'WuXi Biologics', ticker: 'WXXWY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'biologics-manufacturing',
            name: 'Biologics Manufacturing',
            description: 'Large-scale biologics production',
            companiesDetailed: [
              { name: 'Catalent', ticker: 'CTLT', listing: 'US' },
              { name: 'Charles River Laboratories', ticker: 'CRL', listing: 'US' },
              { name: 'Avid Bioservices', ticker: 'CDMO', listing: 'US' }
            ]
          },
          {
            id: 'cell-gene-therapy',
            name: 'Cell & Gene Therapy Manufacturing',
            description: 'Specialized manufacturing for advanced therapies',
            companiesDetailed: [
              { name: 'Catalent', ticker: 'CTLT', listing: 'US' },
              { name: 'Charles River Laboratories', ticker: 'CRL', listing: 'US' },
              { name: 'Emergent BioSolutions', ticker: 'EBS', listing: 'US' }
            ]
          }
        ],
        tags: ['CDMO', 'Contract Manufacturing', 'Biologics', 'Services']
      }
    ]
  }
]
