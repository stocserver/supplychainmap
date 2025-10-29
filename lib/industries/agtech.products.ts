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
          { name: 'Corteva Agriscience', ticker: 'CTVA', listing: 'US' },
          { name: 'Bayer', ticker: 'BAYRY', listing: 'ADR' },
          { name: 'BASF', ticker: 'BASFY', listing: 'ADR' },
          { name: 'FMC Corporation', ticker: 'FMC', listing: 'US' },
          { name: 'Scotts Miracle-Gro', ticker: 'SMG', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'seed-genetics',
            name: 'Seed Genetics & Breeding',
            description: 'Crop seed development and genetic improvement',
            companiesDetailed: [
              { name: 'Corteva Agriscience', ticker: 'CTVA', listing: 'US' },
              { name: 'Bayer', ticker: 'BAYRY', listing: 'ADR' }
            ]
          },
          {
            id: 'crop-protection',
            name: 'Crop Protection Chemicals',
            description: 'Herbicides, fungicides, and insecticides',
            companiesDetailed: [
              { name: 'FMC Corporation', ticker: 'FMC', listing: 'US' },
              { name: 'Bayer', ticker: 'BAYRY', listing: 'ADR' },
              { name: 'BASF', ticker: 'BASFY', listing: 'ADR' },
              { name: 'Corteva Agriscience', ticker: 'CTVA', listing: 'US' }
            ]
          }
        ],
        tags: ['Seeds', 'Biotech', 'Crop Protection', 'Genetics']
      },
      {
        id: 'fertilizers',
        name: 'Fertilizers',
        description: 'Nutrients and soil inputs',
        longDescription: 'Production and distribution of essential plant nutrients, including nitrogen, phosphorus, and potassium-based fertilizers, as well as micronutrients and soil amendments. These inputs are vital for optimizing crop growth, soil health, and agricultural productivity.',
        companiesDetailed: [
          { name: 'Nutrien', ticker: 'NTR', listing: 'US' },
          { name: 'CF Industries', ticker: 'CF', listing: 'US' },
          { name: 'Mosaic Company', ticker: 'MOS', listing: 'US' },
          { name: 'Intrepid Potash', ticker: 'IPI', listing: 'US' },
          { name: 'ICL Group', ticker: 'ICL', listing: 'US' },
          { name: 'Yara International', ticker: 'YARIY', listing: 'ADR' },
          { name: 'Sociedad Química y Minera', ticker: 'SQM', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'commodity-fertilizers',
            name: 'Commodity Fertilizers',
            description: 'Nitrogen, phosphate, and potash fertilizers',
                  companiesDetailed: [
                    { name: 'Nutrien', ticker: 'NTR', listing: 'US' },
                    { name: 'CF Industries', ticker: 'CF', listing: 'US' },
                    { name: 'Mosaic Company', ticker: 'MOS', listing: 'US' },
                    { name: 'Intrepid Potash', ticker: 'IPI', listing: 'US' },
                    { name: 'Yara International', ticker: 'YARIY', listing: 'ADR' },
                    { name: 'Sociedad Química y Minera', ticker: 'SQM', listing: 'US' }
                  ]
          },
          {
            id: 'specialty-nutrients',
            name: 'Specialty Nutrients',
            description: 'Specialized fertilizers and micronutrients',
            companiesDetailed: [
              { name: 'ICL Group', ticker: 'ICL', listing: 'US' },
              { name: 'FMC Corporation', ticker: 'FMC', listing: 'US' }
            ]
          }
        ],
        tags: ['Fertilizers', 'Nutrients', 'Nitrogen', 'Phosphate', 'Potash']
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
          { name: 'Deere & Company', ticker: 'DE', listing: 'US' },
          { name: 'AGCO Corporation', ticker: 'AGCO', listing: 'US' },
          { name: 'CNH Industrial', ticker: 'CNHI', listing: 'US' },
          { name: 'Kubota Corporation', ticker: 'KUBTY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'tractors-harvesters',
            name: 'Tractors & Harvesters',
            description: 'Large farm tractors and harvesting equipment',
            companiesDetailed: [
              { name: 'Deere & Company', ticker: 'DE', listing: 'US' },
              { name: 'AGCO Corporation', ticker: 'AGCO', listing: 'US' },
              { name: 'CNH Industrial', ticker: 'CNHI', listing: 'US' },
              { name: 'Kubota Corporation', ticker: 'KUBTY', listing: 'ADR' }
            ]
          },
          {
            id: 'planting-equipment',
            name: 'Planting & Tillage Equipment',
            description: 'Planters, drills, and tillage implements',
            companiesDetailed: [
              { name: 'Deere & Company', ticker: 'DE', listing: 'US' },
              { name: 'AGCO Corporation', ticker: 'AGCO', listing: 'US' },
              { name: 'CNH Industrial', ticker: 'CNHI', listing: 'US' }
            ]
          }
        ],
        tags: ['Equipment', 'Tractors', 'Harvesters', 'Machinery']
      },
      {
        id: 'precision-ag',
        name: 'Precision Ag',
        description: 'Sensors, drones, and farm software',
        longDescription: 'Integration of advanced technologies like GPS, sensors, drones, and data analytics software to optimize farming practices. This enables precise application of inputs, monitoring of crop health, and automated decision-making for improved yields and resource efficiency.',
        companiesDetailed: [
          { name: 'Trimble', ticker: 'TRMB', listing: 'US' },
          { name: 'Lindsay Corporation', ticker: 'LNN', listing: 'US' },
          { name: 'Deere & Company', ticker: 'DE', listing: 'US' },
          { name: 'AGCO Corporation', ticker: 'AGCO', listing: 'US' },
          { name: 'Valmont Industries', ticker: 'VMI', listing: 'US' },
          { name: 'Toro Company', ticker: 'TTC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'guidance-systems',
            name: 'GPS Guidance & Auto-Steer',
            description: 'Precision guidance and autonomous steering systems',
            companiesDetailed: [
              { name: 'Trimble', ticker: 'TRMB', listing: 'US' },
              { name: 'Deere & Company', ticker: 'DE', listing: 'US' },
              { name: 'AGCO Corporation', ticker: 'AGCO', listing: 'US' }
            ]
          },
                {
                  id: 'irrigation-systems',
                  name: 'Smart Irrigation',
                  description: 'Automated and precision irrigation systems',
                  companiesDetailed: [
                    { name: 'Lindsay Corporation', ticker: 'LNN', listing: 'US' },
                    { name: 'Trimble', ticker: 'TRMB', listing: 'US' },
                    { name: 'Valmont Industries', ticker: 'VMI', listing: 'US' },
                    { name: 'Toro Company', ticker: 'TTC', listing: 'US' }
                  ]
                },
          {
            id: 'farm-software',
            name: 'Farm Management Software',
            description: 'Data analytics and farm management platforms',
            companiesDetailed: [
              { name: 'Trimble', ticker: 'TRMB', listing: 'US' },
              { name: 'Deere & Company', ticker: 'DE', listing: 'US' }
            ]
          }
        ],
        tags: ['Precision Ag', 'GPS', 'Automation', 'Sensors', 'Drones', 'Software']
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
          { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
          { name: 'Bunge', ticker: 'BG', listing: 'US' },
          { name: 'Ingredion', ticker: 'INGR', listing: 'US' },
          { name: 'CHS Inc.', listing: 'US' }
        ],
        tags: ['Services', 'Cooperatives', 'Crop Consulting', 'Farm Management']
      },
      {
        id: 'food-processing',
        name: 'Food Processing',
        description: 'Downstream processing and packaging',
        longDescription: 'Initial processing of raw agricultural commodities into ingredients or semi-finished products for further use in the food and beverage industry. This includes grain milling, oilseed crushing, and sugar refining, often with integrated packaging operations.',
        companiesDetailed: [
          { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
          { name: 'Bunge', ticker: 'BG', listing: 'US' },
          { name: 'Ingredion', ticker: 'INGR', listing: 'US' },
          { name: 'Tyson Foods', ticker: 'TSN', listing: 'US' },
          { name: 'Hormel Foods', ticker: 'HRL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'grain-processing',
            name: 'Grain & Oilseed Processing',
            description: 'Milling, crushing, and refining operations',
            companiesDetailed: [
              { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
              { name: 'Bunge', ticker: 'BG', listing: 'US' },
              { name: 'Ingredion', ticker: 'INGR', listing: 'US' }
            ]
          },
          {
            id: 'protein-processing',
            name: 'Protein Processing',
            description: 'Meat and poultry processing',
            companiesDetailed: [
              { name: 'Tyson Foods', ticker: 'TSN', listing: 'US' },
              { name: 'Hormel Foods', ticker: 'HRL', listing: 'US' }
            ]
          }
        ],
        tags: ['Processing', 'Milling', 'Crushing', 'Ingredients', 'Commodities']
      },
      {
        id: 'animal-health',
        name: 'Animal Health',
        description: 'Livestock health and management',
        longDescription: 'Development and delivery of animal health products, including pharmaceuticals, vaccines, diagnostics, and management solutions for livestock production. This segment ensures animal welfare, disease prevention, and productivity optimization in cattle, poultry, swine, and aquaculture operations.',
        companiesDetailed: [
          { name: 'Zoetis', ticker: 'ZTS', listing: 'US' },
          { name: 'Elanco Animal Health', ticker: 'ELAN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'animal-pharma',
            name: 'Animal Pharmaceuticals & Vaccines',
            description: 'Veterinary drugs and vaccines for livestock',
            companiesDetailed: [
              { name: 'Zoetis', ticker: 'ZTS', listing: 'US' },
              { name: 'Elanco Animal Health', ticker: 'ELAN', listing: 'US' }
            ]
          },
          {
            id: 'livestock-management',
            name: 'Livestock Management Solutions',
            description: 'Animal health monitoring and herd management systems',
            companiesDetailed: [
              { name: 'Zoetis', ticker: 'ZTS', listing: 'US' },
              { name: 'Elanco Animal Health', ticker: 'ELAN', listing: 'US' }
            ]
          }
        ],
        tags: ['Animal Health', 'Livestock', 'Veterinary', 'Vaccines', 'Pharmaceuticals']
      }
    ]
  }
]


