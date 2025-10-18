import { ValueChainStageProducts } from "@/lib/data/industries"

export const chemicalsProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Raw Materials & Basic Chemicals',
    layout: 'grid',
    products: [
      {
        id: 'raw-materials-chem',
        name: 'Raw Materials',
        description: 'Feedstocks and commodities',
        companiesDetailed: [
          { name: 'Dow', ticker: 'DOW', listing: 'US' },
          { name: 'LyondellBasell', ticker: 'LYB', listing: 'US' },
          { name: 'Westlake', ticker: 'WLK', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'petrochemicals',
            name: 'Petrochemicals',
            description: 'Ethylene, propylene and other petrochemical feedstocks',
            longDescription: 'Production of primary petrochemicals like ethylene, propylene, butadiene, and aromatics derived from oil and natural gas. These serve as fundamental building blocks for plastics, synthetic rubbers, and other organic chemicals.',
            companiesDetailed: [
              { name: 'Dow', ticker: 'DOW', listing: 'US' },
              { name: 'LyondellBasell', ticker: 'LYB', listing: 'US' }
            ]
          },
          {
            id: 'chlor-alkali',
            name: 'Chlor-Alkali',
            description: 'Chlorine, caustic soda and derivatives',
            longDescription: 'Manufacturing of chlorine, caustic soda (sodium hydroxide), and their derivatives through the electrolysis of brine. These essential industrial chemicals are widely used in water treatment, PVC production, and various manufacturing processes.',
            companiesDetailed: [
              { name: 'Westlake', ticker: 'WLK', listing: 'US' }
            ]
          }
        ]
      },
      {
        id: 'basic-chemicals',
        name: 'Basic Chemicals',
        description: 'Commodity chemicals and polymers',
        companiesDetailed: [
          { name: 'ExxonMobil (Chemicals)', ticker: 'XOM', listing: 'US' },
          { name: 'Chevron Phillips (Chevron)', ticker: 'CVX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'polymers',
            name: 'Polymers & Plastics',
            description: 'Polyethylene, polypropylene and other plastics',
            longDescription: 'Production of various polymers and plastics, including polyethylene (PE), polypropylene (PP), and polyvinyl chloride (PVC), which are used in packaging, automotive components, construction, and consumer goods.',
            companiesDetailed: [
              { name: 'Dow', ticker: 'DOW', listing: 'US' },
              { name: 'LyondellBasell', ticker: 'LYB', listing: 'US' }
            ]
          },
          {
            id: 'industrial-chemicals',
            name: 'Industrial Chemicals',
            description: 'Solvents, acids and bulk industrial chemicals',
            longDescription: 'Manufacturing of high-volume industrial chemicals such as sulfuric acid, nitric acid, methanol, and various solvents. These chemicals are critical for numerous industrial processes, including manufacturing, mining, and pulp & paper.',
            companiesDetailed: [
              { name: 'ExxonMobil (Chemicals)', ticker: 'XOM', listing: 'US' }
            ]
          }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Specialty & Performance',
    layout: 'hybrid',
    products: [
      {
        id: 'specialty-chemicals',
        name: 'Specialty Chemicals',
        description: 'Additives, coatings, and performance materials',
        companiesDetailed: [
          { name: 'PPG Industries', ticker: 'PPG', listing: 'US' },
          { name: 'Sherwin-Williams', ticker: 'SHW', listing: 'US' },
          { name: 'H.B. Fuller', ticker: 'FUL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'coatings',
            name: 'Coatings & Paints',
            description: 'Architectural and industrial coatings',
            longDescription: 'Development and production of paints, coatings, and sealants for architectural, automotive, industrial, and protective applications. These products provide aesthetic appeal, corrosion protection, and functional properties to surfaces.',
            companiesDetailed: [
              { name: 'PPG Industries', ticker: 'PPG', listing: 'US' },
              { name: 'Sherwin-Williams', ticker: 'SHW', listing: 'US' }
            ]
          },
          {
            id: 'adhesives-sealants',
            name: 'Adhesives & Sealants',
            description: 'Industrial adhesives and sealants',
            longDescription: 'Formulation and manufacturing of adhesives and sealants for bonding, sealing, and assembly across various industries, including construction, automotive, electronics, and packaging. These products are crucial for structural integrity and environmental protection.',
            companiesDetailed: [
              { name: 'H.B. Fuller', ticker: 'FUL', listing: 'US' }
            ]
          }
        ]
      },
      {
        id: 'agricultural-chemicals',
        name: 'Agricultural Chemicals',
        description: 'Fertilizers and crop protection',
        companiesDetailed: [
          { name: 'Nutrien', ticker: 'NTR', listing: 'US' },
          { name: 'CF Industries', ticker: 'CF', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'nitrogen',
            name: 'Nitrogen Fertilizers',
            description: 'Ammonia, urea and UAN',
            longDescription: 'Production of nitrogen-based fertilizers suchs as ammonia, urea, and UAN (urea ammonium nitrate). Nitrogen is a vital nutrient for plant growth, and these products are essential for agricultural productivity globally.',
            companiesDetailed: [
              { name: 'CF Industries', ticker: 'CF', listing: 'US' }
            ]
          },
          {
            id: 'phosphate-potash',
            name: 'Phosphate & Potash',
            description: 'Phosphate and potash fertilizers',
            longDescription: 'Mining and processing of phosphate rock and potash minerals to produce phosphate and potassium-based fertilizers. These provide essential nutrients (P and K) for plant development, root growth, and overall crop health.',
            companiesDetailed: [
              { name: 'Nutrien', ticker: 'NTR', listing: 'US' }
            ]
          }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Applications & Distribution',
    layout: 'grid',
    products: [
      {
        id: 'applications',
        name: 'Applications',
        description: 'End-use coatings, plastics, and materials',
        companiesDetailed: [
          { name: 'DuPont', ticker: 'DD', listing: 'US' },
          { name: '3M', ticker: 'MMM', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'automotive-materials',
            name: 'Automotive Materials',
            description: 'Materials used in automotive manufacturing',
            longDescription: 'Specialty chemicals and advanced materials used in automotive manufacturing for lightweighting, improved performance, and durability. Includes engineering plastics, composites, coatings, and adhesives for various vehicle components.',
            companiesDetailed: [
              { name: 'DuPont', ticker: 'DD', listing: 'US' }
            ]
          },
          {
            id: 'construction-materials',
            name: 'Construction Materials',
            description: 'Sealants, insulation and building materials',
            longDescription: 'Chemical products and materials for the construction industry, including high-performance sealants, insulation foams, roofing materials, and concrete additives. These enhance structural integrity, energy efficiency, and longevity of buildings.',
            companiesDetailed: [
              { name: '3M', ticker: 'MMM', listing: 'US' }
            ]
          }
        ]
      },
      {
        id: 'industrial-distribution',
        name: 'Industrial Distribution',
        description: 'Chemical distribution and logistics',
        companiesDetailed: [
          { name: 'Univar', ticker: 'UNVR', listing: 'US' },
          { name: 'Brenntag', ticker: 'BNTGY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'bulk-distribution',
            name: 'Bulk Distribution',
            description: 'Bulk chemicals distribution',
            longDescription: 'Logistics and distribution of large-volume, commodity chemicals from manufacturers to industrial customers. This involves managing complex supply chains, storage, transportation (rail, truck, ship), and regulatory compliance for hazardous materials.',
            companiesDetailed: [
              { name: 'Univar', ticker: 'UNVR', listing: 'US' }
            ]
          },
          {
            id: 'specialty-distribution',
            name: 'Specialty Distribution',
            description: 'Specialty chemical distribution',
            longDescription: 'Distribution of high-value, specialized chemicals that often require specific handling, technical support, and formulation expertise. These distributors serve diverse markets like personal care, food & beverage, pharmaceuticals, and electronics.',
            companiesDetailed: [
              { name: 'Brenntag', ticker: 'BNTGY', listing: 'ADR' }
            ]
          }
        ]
      }
    ]
  }
]


