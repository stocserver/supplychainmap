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
          { name: 'Alcoa', ticker: 'AA', listing: 'US' }
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
          { name: 'United States Steel', ticker: 'X', listing: 'US' }
        ]
      },
      {
        id: 'industrial-gases',
        name: 'Industrial Gases',
        description: 'Industrial gases for processing and manufacturing',
        longDescription: 'Production and supply of industrial gases such as oxygen, nitrogen, argon, and hydrogen, which are essential for various stages of metals production, welding, and other manufacturing processes within the materials sector.',
        companiesDetailed: [
          { name: 'Linde', ticker: 'LIN', listing: 'US' },
          { name: 'Air Products', ticker: 'APD', listing: 'US' }
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
          { name: 'W.W. Grainger', ticker: 'GWW', listing: 'US' }
        ]
      }
    ]
  }
]


