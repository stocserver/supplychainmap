import { ValueChainStageProducts } from "@/lib/data/industries"

export const agtechProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Seeds & Inputs',
    layout: 'grid',
    products: [
      {
        id: 'seeds-biotech',
        name: 'Seeds & Biotech',
        description: 'Seed genetics and biotech inputs',
        longDescription: 'Development and commercialization of genetically modified and improved crop seeds, along with biotechnological solutions for crop protection and yield enhancement. This includes traits for herbicide tolerance, insect resistance, and increased nutritional value.',
        companiesDetailed: [
          { name: 'Corteva', ticker: 'CTVA', listing: 'US' }
        ]
      },
      {
        id: 'fertilizers',
        name: 'Fertilizers',
        description: 'Nutrients and soil inputs',
        longDescription: 'Production and distribution of essential plant nutrients, including nitrogen, phosphorus, and potassium-based fertilizers, as well as micronutrients and soil amendments. These inputs are vital for optimizing crop growth, soil health, and agricultural productivity.',
        companiesDetailed: [
          { name: 'Nutrien', ticker: 'NTR', listing: 'US' },
          { name: 'CF Industries', ticker: 'CF', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Equipment & Precision Ag',
    layout: 'hybrid',
    products: [
      {
        id: 'ag-equipment',
        name: 'Ag Equipment',
        description: 'Tractors, harvesters, and implements',
        longDescription: 'Manufacturing and sale of heavy machinery and equipment used in farming operations, such as tractors, combines, planters, sprayers, and tillage implements. This segment focuses on enhancing efficiency, automation, and scale in agricultural production.',
        companiesDetailed: [
          { name: 'Deere', ticker: 'DE', listing: 'US' },
          { name: 'AGCO', ticker: 'AGCO', listing: 'US' }
        ]
      },
      {
        id: 'precision-ag',
        name: 'Precision Ag',
        description: 'Sensors, drones, and farm software',
        longDescription: 'Integration of advanced technologies like GPS, sensors, drones, and data analytics software to optimize farming practices. This enables precise application of inputs, monitoring of crop health, and automated decision-making for improved yields and resource efficiency.',
        companiesDetailed: [
          { name: 'Trimble', ticker: 'TRMB', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Farming Services & Processing',
    layout: 'grid',
    products: [
      {
        id: 'farming-services',
        name: 'Farming Services',
        description: 'Co-ops and managed services',
        longDescription: 'Provision of various services to farmers, including agricultural cooperatives, crop consulting, custom application of inputs, and managed farm operations. These services help farmers optimize production, manage risks, and access markets.',
        companiesDetailed: [
          { name: 'CHS Inc.', listing: 'US' }
        ]
      },
      {
        id: 'food-processing',
        name: 'Food Processing',
        description: 'Downstream processing and packaging',
        longDescription: 'Initial processing of raw agricultural commodities into ingredients or semi-finished products for further use in the food and beverage industry. This includes grain milling, oilseed crushing, and sugar refining, often with integrated packaging operations.',
        companiesDetailed: [
          { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
          { name: 'Bunge', ticker: 'BG', listing: 'US' }
        ]
      }
    ]
  }
]


