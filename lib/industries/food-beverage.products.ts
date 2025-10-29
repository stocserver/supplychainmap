import { ValueChainStageProducts } from "@/lib/data/industries"

export const foodBeverageProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Ingredients & Processing',
    layout: 'grid',
    products: [
      {
        id: 'ingredients',
        name: 'Ingredients & Flavors',
        description: 'Ingredients, flavors, and nutrition inputs',
        longDescription: 'Supply of raw materials, flavors, and nutritional ingredients used in the production of food and beverage products. This includes natural and synthetic ingredients, as well as functional additives for fortification and enhancement.',
        companiesDetailed: [
          { name: 'Ingredion', ticker: 'INGR', listing: 'US' },
          { name: 'International Flavors & Fragrances', ticker: 'IFF', listing: 'US' },
          { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
          { name: 'Bunge', ticker: 'BG', listing: 'US' },
          { name: 'Tate & Lyle', ticker: 'TATYY', listing: 'ADR' },
          { name: 'McCormick', ticker: 'MKC', listing: 'US' },
          { name: 'Ajinomoto', ticker: 'AJINY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'sweeteners-starches',
            name: 'Sweeteners & Starches',
            description: 'Corn-based sweeteners, starches, and texturizers',
            longDescription: 'Production and supply of sweeteners (e.g., high-fructose corn syrup, glucose), starches, and plant-based texturizers. These ingredients are crucial for food texture, flavor, and shelf-life across a wide range of processed foods and beverages.',
            companiesDetailed: [
              { name: 'Ingredion', ticker: 'INGR', listing: 'US' },
              { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
              { name: 'Bunge', ticker: 'BG', listing: 'US' },
              { name: 'Tate & Lyle', ticker: 'TATYY', listing: 'ADR' }
            ]
          },
          {
            id: 'flavors-seasonings',
            name: 'Flavors & Seasonings',
            description: 'Flavor houses, spices, and seasonings',
            longDescription: 'Development and production of natural and artificial flavors, extracts, spices, and seasoning blends. These ingredients are essential for enhancing the taste, aroma, and overall sensory experience of food and beverage products.',
            companiesDetailed: [
              { name: 'International Flavors & Fragrances', ticker: 'IFF', listing: 'US' },
              { name: 'McCormick', ticker: 'MKC', listing: 'US' },
              { name: 'Ajinomoto', ticker: 'AJINY', listing: 'ADR' }
            ]
          },
          {
            id: 'nutrition-ingredients',
            name: 'Nutrition Ingredients',
            description: 'Proteins, fibers, and functional ingredients',
            longDescription: 'Supply of specialized nutritional ingredients such as plant-based proteins, dietary fibers, vitamins, and functional food additives. These are used to fortify products, support health claims, and meet consumer demand for healthier options.',
            companiesDetailed: [
              { name: 'Archer Daniels Midland', ticker: 'ADM', listing: 'US' },
              { name: 'Ingredion', ticker: 'INGR', listing: 'US' }
            ]
          }
        ]
      },
      {
        id: 'food-processing',
        name: 'Food Processing',
        description: 'Packaged food manufacturing',
        longDescription: 'Manufacturing of various packaged food products, encompassing categories like snacks, confectionery, prepared meals, and meat products. This involves raw material sourcing, production, packaging, and quality control to deliver consumer-ready goods.',
        companiesDetailed: [
          { name: 'General Mills', ticker: 'GIS', listing: 'US' },
          { name: 'Kraft Heinz', ticker: 'KHC', listing: 'US' },
          { name: 'Kellanova (Kellogg Snacks)', ticker: 'K', listing: 'US' },
          { name: 'J.M. Smucker', ticker: 'SJM', listing: 'US' },
          { name: 'B&G Foods', ticker: 'BGS', listing: 'US' },
          { name: 'TreeHouse Foods', ticker: 'THS', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'snacks-confectionery',
            name: 'Snacks & Confectionery',
            description: 'Snacks, candy, and confectionery',
            longDescription: 'Production of snack foods such as chips, crackers, and popcorn, as well as confectionery items like chocolates, candies, and gum. This segment focuses on convenient, ready-to-eat products for indulgence and everyday consumption.',
            companiesDetailed: [
              { name: 'Mondelez', ticker: 'MDLZ', listing: 'US' },
              { name: 'Hershey', ticker: 'HSY', listing: 'US' },
              { name: 'Utz Brands', ticker: 'UTZ', listing: 'US' },
              { name: 'Lamb Weston', ticker: 'LW', listing: 'US' }
            ]
          },
          {
            id: 'packaged-meals',
            name: 'Packaged Meals',
            description: 'Canned, frozen, and shelf-stable meals',
            longDescription: 'Manufacturing of convenient, pre-prepared meals and meal components, including canned goods, frozen entrees, and shelf-stable kits. These products offer ease of preparation and extended shelf-life for busy consumers.',
            companiesDetailed: [
              { name: 'Conagra Brands', ticker: 'CAG', listing: 'US' },
              { name: 'Campbell Soup', ticker: 'CPB', listing: 'US' },
              { name: 'B&G Foods', ticker: 'BGS', listing: 'US' },
              { name: 'TreeHouse Foods', ticker: 'THS', listing: 'US' }
            ]
          },
          {
            id: 'meat-processing',
            name: 'Meat Processing',
            description: 'Meat, poultry, and protein processing',
            longDescription: 'Processing of livestock and poultry into various meat products, including fresh cuts, processed meats, and value-added protein products. This segment involves slaughtering, butchering, packaging, and distribution to retail and foodservice.',
            companiesDetailed: [
              { name: 'Tyson Foods', ticker: 'TSN', listing: 'US' },
              { name: 'Hormel Foods', ticker: 'HRL', listing: 'US' },
              { name: 'JBS', ticker: 'JBSAY', listing: 'ADR' },
              { name: 'Pilgrim\'s Pride', ticker: 'PPC', listing: 'US' }
            ]
          }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Beverages & Distribution',
    layout: 'hybrid',
    products: [
      {
        id: 'beverages',
        name: 'Beverages',
        description: 'Soft drinks, beer, wine, spirits',
        longDescription: 'Production and marketing of non-alcoholic and alcoholic beverages, including carbonated soft drinks, juices, bottled water, beer, wine, and spirits. This segment caters to diverse consumer preferences for refreshment, hydration, and social consumption.',
        companiesDetailed: [
          { name: 'Coca-Cola', ticker: 'KO', listing: 'US' },
          { name: 'PepsiCo', ticker: 'PEP', listing: 'US' },
          { name: 'Keurig Dr Pepper', ticker: 'KDP', listing: 'US' },
          { name: 'Constellation Brands', ticker: 'STZ', listing: 'US' },
          { name: 'Diageo', ticker: 'DEO', listing: 'ADR' },
          { name: 'Heineken', ticker: 'HEINY', listing: 'ADR' },
          { name: 'Brown-Forman', ticker: 'BF.B', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'soft-drinks',
            name: 'Soft Drinks',
            description: 'Carbonated soft drinks and juices',
            longDescription: 'Manufacturing and distribution of carbonated soft drinks, fruit juices, and other non-alcoholic ready-to-drink beverages. This category is characterized by strong brand recognition and extensive distribution networks.',
            companiesDetailed: [
              { name: 'Coca-Cola', ticker: 'KO', listing: 'US' },
              { name: 'PepsiCo', ticker: 'PEP', listing: 'US' },
              { name: 'Keurig Dr Pepper', ticker: 'KDP', listing: 'US' }
            ]
          },
          {
            id: 'beer',
            name: 'Beer',
            description: 'Beer and hard seltzer',
            longDescription: 'Brewing, marketing, and distribution of various beer types (lagers, ales, craft beers) and increasingly, hard seltzers. This segment is influenced by consumer tastes, regional preferences, and promotional activities.',
            companiesDetailed: [
              { name: 'Constellation Brands', ticker: 'STZ', listing: 'US' },
              { name: 'Molson Coors', ticker: 'TAP', listing: 'US' },
              { name: 'Heineken', ticker: 'HEINY', listing: 'ADR' },
              { name: 'Boston Beer', ticker: 'SAM', listing: 'US' }
            ]
          },
          {
            id: 'energy-drinks',
            name: 'Energy & Performance',
            description: 'Energy and performance drinks',
            longDescription: 'Specialized beverages formulated to provide energy, focus, or hydration benefits, including energy drinks, sports drinks, and other functional beverages. These products target consumers seeking enhanced physical or mental performance.',
            companiesDetailed: [
              { name: 'Celsius Holdings', ticker: 'CELH', listing: 'US' },
              { name: 'Monster Beverage', ticker: 'MNST', listing: 'US' }
            ]
          }
        ]
      },
      {
        id: 'retail-distribution',
        name: 'Retail Distribution',
        description: 'Grocery and wholesale distribution',
        longDescription: 'Logistics and sales channels for moving food and beverage products from manufacturers to consumers. This includes grocery retailers, supermarkets, wholesale clubs, and foodservice distributors supplying restaurants and institutions.',
        companiesDetailed: [
          { name: 'Walmart', ticker: 'WMT', listing: 'US' },
          { name: 'Costco', ticker: 'COST', listing: 'US' },
          { name: 'Sysco', ticker: 'SYY', listing: 'US' },
          { name: 'Albertsons', ticker: 'ACI', listing: 'US' },
          { name: 'Performance Food Group', ticker: 'PFGC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'grocery-retail',
            name: 'Grocery Retail',
            description: 'Supermarkets and grocery retail',
            longDescription: 'Operation of supermarkets, hypermarkets, and other grocery retail formats that sell a wide range of food, beverage, and household products directly to consumers. Key factors include store location, product assortment, pricing, and customer experience.',
            companiesDetailed: [
              { name: 'Walmart', ticker: 'WMT', listing: 'US' },
              { name: 'Kroger', ticker: 'KR', listing: 'US' },
              { name: 'Costco', ticker: 'COST', listing: 'US' },
              { name: 'Albertsons', ticker: 'ACI', listing: 'US' },
              { name: 'Target', ticker: 'TGT', listing: 'US' }
            ]
          },
          {
            id: 'foodservice-distribution',
            name: 'Foodservice Distribution',
            description: 'Restaurant and hospitality supply',
            longDescription: 'Distribution of food, beverages, and supplies to restaurants, hotels, schools, hospitals, and other foodservice establishments. This segment focuses on high-volume, efficient delivery and specialized product requirements.',
            companiesDetailed: [
              { name: 'Sysco', ticker: 'SYY', listing: 'US' },
              { name: 'US Foods', ticker: 'USFD', listing: 'US' },
              { name: 'Performance Food Group', ticker: 'PFGC', listing: 'US' }
            ]
          }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Restaurants & QSR',
    layout: 'grid',
    products: [
      {
        id: 'restaurants',
        name: 'Restaurants & QSR',
        description: 'Restaurant operators and quick service chains',
        longDescription: 'Operation of various restaurant formats, from full-service dining to quick-service restaurants (QSR) and fast-casual concepts. This segment focuses on food preparation, customer service, brand experience, and efficient operations.',
        companiesDetailed: [
          { name: 'McDonald\'s', ticker: 'MCD', listing: 'US' },
          { name: 'Yum! Brands', ticker: 'YUM', listing: 'US' },
          { name: 'Darden Restaurants', ticker: 'DRI', listing: 'US' },
          { name: 'Restaurant Brands International', ticker: 'QSR', listing: 'US' },
          { name: 'Wendy\'s', ticker: 'WEN', listing: 'US' },
          { name: 'Domino\'s Pizza', ticker: 'DPZ', listing: 'US' },
          { name: 'Brinker International', ticker: 'EAT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'qsr',
            name: 'Quick Service Restaurants',
            description: 'QSR concepts and franchises',
            longDescription: 'Fast-food chains and franchised operations emphasizing speed, convenience, and consistent offerings at affordable prices. Examples include burger, chicken, and pizza chains with drive-thru and takeout options.',
            companiesDetailed: [
              { name: 'McDonald\'s', ticker: 'MCD', listing: 'US' },
              { name: 'Yum! Brands', ticker: 'YUM', listing: 'US' },
              { name: 'Restaurant Brands International', ticker: 'QSR', listing: 'US' },
              { name: 'Wendy\'s', ticker: 'WEN', listing: 'US' },
              { name: 'Domino\'s Pizza', ticker: 'DPZ', listing: 'US' }
            ]
          },
          {
            id: 'fast-casual',
            name: 'Fast Casual',
            description: 'Fast casual restaurant brands',
            longDescription: 'Restaurants offering higher-quality ingredients and a more upscale dining experience than QSR, but with counter service and faster preparation times than traditional casual dining. Focus on customization and fresh ingredients.',
            companiesDetailed: [
              { name: 'Chipotle Mexican Grill', ticker: 'CMG', listing: 'US' },
              { name: 'Shake Shack', ticker: 'SHAK', listing: 'US' },
              { name: 'Wingstop', ticker: 'WING', listing: 'US' }
            ]
          },
          {
            id: 'coffee-cafes',
            name: 'Coffee & Cafes',
            description: 'Coffee chains and cafes',
            longDescription: 'Operation of coffee shops, cafes, and bakeries, offering a range of coffee, tea, pastries, and light meals. These establishments often serve as social hubs and provide grab-and-go options for commuters.',
            companiesDetailed: [
              { name: 'Starbucks', ticker: 'SBUX', listing: 'US' },
              { name: 'Dutch Bros', ticker: 'BROS', listing: 'US' },
              { name: 'JDE Peet\'s', ticker: 'JDEPY', listing: 'ADR' }
            ]
          }
        ]
      }
    ]
  }
]


