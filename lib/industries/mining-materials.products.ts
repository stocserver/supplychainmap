import { ValueChainStageProducts } from "@/lib/data/industries"

export const miningMaterialsProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Mining & Extraction',
    layout: 'grid',
    products: [
      {
        id: 'mining-extraction',
        name: 'Mining & Extraction',
        description: 'Metals and minerals exploration and extraction',
        longDescription: 'Exploration, development, and operation of mines to extract various metals (e.g., copper, gold, aluminum) and industrial minerals. This upstream stage involves geological surveys, resource definition, and extraction methods to supply raw materials for further processing.',
        companiesDetailed: [
          { name: 'Freeport-McMoRan', ticker: 'FCX', listing: 'US' },
          { name: 'Newmont', ticker: 'NEM', listing: 'US' },
          { name: 'Alcoa', ticker: 'AA', listing: 'US' },
          { name: 'Barrick Gold', ticker: 'GOLD', listing: 'US' },
          { name: 'Rio Tinto', ticker: 'RIO', listing: 'US' },
          { name: 'BHP Group', ticker: 'BHP', listing: 'US' },
          { name: 'Vale', ticker: 'VALE', listing: 'US' },
          { name: 'Southern Copper', ticker: 'SCCO', listing: 'US' },
          { name: 'Anglo American', ticker: 'NGLOY', listing: 'ADR' },
          { name: 'Kinross Gold', ticker: 'KGC', listing: 'US' },
          { name: 'Hecla Mining', ticker: 'HL', listing: 'US' },
          { name: 'Coeur Mining', ticker: 'CDE', listing: 'US' },
          { name: 'Harmony Gold', ticker: 'HMY', listing: 'US' },
          { name: 'Cleveland-Cliffs', ticker: 'CLF', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Processing & Production',
    layout: 'hybrid',
    products: [
      {
        id: 'metals-production',
        name: 'Metals Production',
        description: 'Smelting, refining, and alloy production',
        longDescription: 'Processing of extracted ores and concentrates through smelting, refining, and alloying to produce finished metals. This midstream stage involves energy-intensive processes to purify metals and create specialized alloys for diverse industrial applications.',
        companiesDetailed: [
          { name: 'Nucor', ticker: 'NUE', listing: 'US' },
          { name: 'United States Steel', ticker: 'X', listing: 'US' },
          { name: 'ArcelorMittal', ticker: 'MT', listing: 'US' },
          { name: 'Steel Dynamics', ticker: 'STLD', listing: 'US' },
          { name: 'Commercial Metals', ticker: 'CMC', listing: 'US' },
          { name: 'Reliance Steel & Aluminum', ticker: 'RS', listing: 'US' },
          { name: 'Ryerson Holding', ticker: 'RYI', listing: 'US' },
          { name: 'Kaiser Aluminum', ticker: 'KALU', listing: 'US' },
          { name: 'Century Aluminum', ticker: 'CENX', listing: 'US' },
          { name: 'Constellium', ticker: 'CSTM', listing: 'US' }
        ]
      },
      {
        id: 'industrial-gases',
        name: 'Industrial Gases',
        description: 'Industrial gases for processing and manufacturing',
        longDescription: 'Production and supply of industrial gases such as oxygen, nitrogen, argon, and hydrogen, which are essential for various stages of metals production, welding, and other manufacturing processes within the materials sector.',
        companiesDetailed: [
          { name: 'Linde', ticker: 'LIN', listing: 'US' },
          { name: 'Air Products', ticker: 'APD', listing: 'US' },
          { name: 'Air Liquide', ticker: 'AIQUY', listing: 'ADR' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Distribution & Services',
    layout: 'grid',
    products: [
      {
        id: 'industrial-distribution',
        name: 'Industrial Distribution',
        description: 'Distribution of metals and industrial supplies',
        longDescription: 'Distribution and logistics of metals, industrial components, and maintenance, repair, and operations (MRO) supplies to end-users across manufacturing, construction, and other heavy industries. This ensures timely supply of critical materials and parts.',
        companiesDetailed: [
          { name: 'Fastenal', ticker: 'FAST', listing: 'US' },
          { name: 'W.W. Grainger', ticker: 'GWW', listing: 'US' },
          { name: 'MSC Industrial Direct', ticker: 'MSM', listing: 'US' },
          { name: 'Applied Industrial Technologies', ticker: 'AIT', listing: 'US' },
          { name: 'DXP Enterprises', ticker: 'DXPE', listing: 'US' },
          { name: 'NOW Inc', ticker: 'DNOW', listing: 'US' },
          { name: 'Core & Main', ticker: 'CNM', listing: 'US' },
          { name: 'Ferguson', ticker: 'FERG', listing: 'US' }
        ]
      }
    ]
  }
]


