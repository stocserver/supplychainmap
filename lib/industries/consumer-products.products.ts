import { ValueChainStageProducts } from "@/lib/data/industries"

export const consumerProductsProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Raw Materials & Personal Care',
    layout: 'grid',
    products: [
      {
        id: 'raw-materials-consumer',
        name: 'Raw Materials & Ingredients',
        description: 'Fragrances, flavors and key inputs for consumer goods',
        longDescription: 'Inputs that feed personal care and household product manufacturing, including fragrances, surfactants and packaging resins.',
        companiesDetailed: [
          { name: 'International Flavors & Fragrances', ticker: 'IFF', listing: 'US' },
          { name: 'Ecolab', ticker: 'ECL', listing: 'US' },
          { name: 'LyondellBasell', ticker: 'LYB', listing: 'US' }
        ],
        tags: ['Fragrances', 'Surfactants', 'Packaging Resins']
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        description: 'Personal and household care products',
        longDescription: 'Manufacturing and marketing of products for personal hygiene and grooming, including skincare, haircare, oral care, and cosmetics. This segment focuses on brand innovation, consumer preferences, and broad distribution channels.',
        companiesDetailed: [
          { name: 'Procter & Gamble', ticker: 'PG', listing: 'US' },
          { name: 'Colgate-Palmolive', ticker: 'CL', listing: 'US' },
          { name: 'Kimberly-Clark', ticker: 'KMB', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'skincare',
            name: 'Skincare & Beauty',
            description: 'Skincare, cosmetics and beauty products',
            longDescription: 'Development and sale of products for skin health, appearance, and beauty enhancement, such as moisturizers, serums, cleansers, and makeup. This segment is driven by trends in dermatology, anti-aging, and natural ingredients.',
            companiesDetailed: [
              { name: 'Estée Lauder', ticker: 'EL', listing: 'US' },
              { name: 'Procter & Gamble', ticker: 'PG', listing: 'US' }
            ]
          },
          {
            id: 'hair-care',
            name: 'Hair Care',
            description: 'Shampoo, conditioner and hair styling',
            longDescription: 'Production and marketing of products for hair cleansing, conditioning, styling, and treatment. This includes shampoos, conditioners, styling gels, and colorants, catering to diverse hair types and consumer needs.',
            companiesDetailed: [
              { name: 'Procter & Gamble', ticker: 'PG', listing: 'US' }
            ]
          },
          {
            id: 'oral-care',
            name: 'Oral Care',
            description: 'Toothpaste and oral hygiene',
            longDescription: 'Manufacturing and distribution of oral hygiene products such as toothpastes, mouthwashes, and toothbrushes. This segment focuses on promoting dental health, cavity prevention, and fresh breath.',
            companiesDetailed: [
              { name: 'Colgate-Palmolive', ticker: 'CL', listing: 'US' }
            ]
          }
        ],
        tags: ['Skincare', 'Hair Care', 'Oral Care']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Manufacturing & Brands',
    layout: 'hybrid',
    products: [
      {
        id: 'household-products',
        name: 'Household Products',
        description: 'Household consumables and appliances',
        longDescription: 'Production and marketing of cleaning supplies, paper goods, and small household appliances for home use. This segment emphasizes effectiveness, convenience, and value for everyday household tasks.',
        companiesDetailed: [
          { name: 'Whirlpool', ticker: 'WHR', listing: 'US' },
          { name: 'Newell Brands', ticker: 'NWL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'home-cleaning',
            name: 'Home Cleaning',
            description: 'Surface cleaners, detergents and sanitizers',
            longDescription: 'Manufacturing of products for cleaning and sanitizing homes, including surface cleaners, laundry detergents, dishwashing liquids, and disinfectants. Focus on effectiveness, safety, and scent preferences.',
            companiesDetailed: [
              { name: 'The Clorox Company', ticker: 'CLX', listing: 'US' },
              { name: 'Church & Dwight', ticker: 'CHD', listing: 'US' }
            ]
          },
          {
            id: 'paper-goods',
            name: 'Paper Goods',
            description: 'Tissue and paper-based products',
            longDescription: 'Production of disposable paper products for household use, such as facial tissues, paper towels, toilet paper, and napkins. Emphasis on softness, absorbency, and sustainable sourcing.',
            companiesDetailed: [
              { name: 'Kimberly-Clark', ticker: 'KMB', listing: 'US' }
            ]
          }
        ],
        tags: ['Cleaning', 'Paper Goods']
      },
      {
        id: 'tobacco',
        name: 'Tobacco',
        description: 'Tobacco and reduced-risk products',
        longDescription: 'Manufacturing and marketing of tobacco products, including traditional cigarettes and cigars, as well as developing and distributing reduced-risk alternatives. This segment navigates evolving regulations and public health concerns.',
        companiesDetailed: [
          { name: 'Altria', ticker: 'MO', listing: 'US' },
          { name: 'Philip Morris', ticker: 'PM', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'combustibles',
            name: 'Combustibles',
            description: 'Traditional cigarette products',
            longDescription: 'Production and sale of traditional combustible tobacco products, primarily cigarettes. This segment faces declining volumes in many markets due to health concerns and regulatory pressures.',
            companiesDetailed: [
              { name: 'Altria', ticker: 'MO', listing: 'US' },
              { name: 'Philip Morris', ticker: 'PM', listing: 'US' }
            ]
          },
          {
            id: 'rrp',
            name: 'Reduced-Risk Products',
            description: 'Heated tobacco and other reduced-risk formats',
            longDescription: 'Development, manufacturing, and commercialization of tobacco and nicotine products with the potential to reduce harm compared to traditional cigarettes, such as heated tobacco products, e-cigarettes, and oral smokeless products.',
            companiesDetailed: [
              { name: 'Philip Morris', ticker: 'PM', listing: 'US' }
            ]
          }
        ],
        tags: ['Combustibles', 'RRPs']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Retail',
    layout: 'grid',
    products: [
      {
        id: 'retail',
        name: 'Retail Channels',
        description: 'Big box and specialty retail',
        longDescription: 'Distribution channels through which consumer products reach end-users. This includes mass merchandisers, drugstores, and online platforms, each with distinct strategies for product display, pricing, and customer engagement.',
        companiesDetailed: [
          { name: 'Walmart', ticker: 'WMT', listing: 'US' },
          { name: 'Target', ticker: 'TGT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'mass-merch',
            name: 'Mass Merchandisers',
            description: 'Big-box retail chains',
            longDescription: 'Large retail formats (superstores, hypermarkets) offering a wide variety of consumer goods at competitive prices, including groceries, electronics, apparel, and household items. Focus on high volume and broad appeal.',
            companiesDetailed: [
              { name: 'Walmart', ticker: 'WMT', listing: 'US' },
              { name: 'Target', ticker: 'TGT', listing: 'US' },
              { name: 'Costco Wholesale', ticker: 'COST', listing: 'US' }
            ]
          },
          {
            id: 'drugstores',
            name: 'Drugstores',
            description: 'Drugstore chains and health retail',
            longDescription: 'Retailers primarily focused on health, beauty, and wellness products, alongside pharmaceuticals, over-the-counter medicines, and some convenience goods. They serve as accessible community health and shopping hubs.',
            companiesDetailed: [
              { name: 'CVS Health', ticker: 'CVS', listing: 'US' },
              { name: 'Walgreens Boots Alliance', ticker: 'WBA', listing: 'US' }
            ]
          },
          {
            id: 'online',
            name: 'Online Retail',
            description: 'E-commerce channels',
            longDescription: 'Sales of consumer products through digital platforms and websites. This channel offers convenience, vast product selection, and competitive pricing, driven by rapid fulfillment and personalized shopping experiences.',
            companiesDetailed: [
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' }
            ]
          }
        ],
        tags: ['Mass', 'Drugstores', 'Online']
      }
    ]
  }
]


