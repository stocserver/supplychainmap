import { ValueChainStageProducts } from "@/lib/data/industries"

export const retailProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Sourcing & Manufacturing',
    layout: 'flow',
    products: [
      {
        id: 'sourcing-manufacturing',
        name: 'Sourcing & Manufacturing',
        description: 'Product sourcing, manufacturing, and supply chain management',
        longDescription: 'Companies involved in sourcing raw materials, manufacturing consumer products, and managing global supply chains for retail distribution.',
        companiesDetailed: [
          { name: 'Procter & Gamble', ticker: 'PG', listing: 'US' },
          { name: 'Unilever', ticker: 'UL', listing: 'ADR' },
          { name: 'Nestle', ticker: 'NSRGY', listing: 'ADR' },
          { name: 'Coca-Cola', ticker: 'KO', listing: 'US' },
          { name: 'PepsiCo', ticker: 'PEP', listing: 'US' },
          { name: 'Johnson & Johnson', ticker: 'JNJ', listing: 'US' },
          { name: 'Kimberly-Clark', ticker: 'KMB', listing: 'US' },
          { name: 'Colgate-Palmolive', ticker: 'CL', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'consumer-goods',
            name: 'Consumer Goods Manufacturing',
            description: 'Manufacturing of consumer products',
            companiesDetailed: [
              { name: 'Procter & Gamble', ticker: 'PG', listing: 'US' },
              { name: 'Unilever', ticker: 'UL', listing: 'ADR' },
              { name: 'Kimberly-Clark', ticker: 'KMB', listing: 'US' }
            ]
          },
          {
            id: 'food-beverage',
            name: 'Food & Beverage',
            description: 'Food and beverage manufacturing',
            companiesDetailed: [
              { name: 'Nestle', ticker: 'NSRGY', listing: 'ADR' },
              { name: 'Coca-Cola', ticker: 'KO', listing: 'US' },
              { name: 'PepsiCo', ticker: 'PEP', listing: 'US' }
            ]
          }
        ],
        tags: ['Manufacturing', 'Sourcing', 'Supply Chain', 'Consumer Goods']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Retail Formats',
    layout: 'hybrid',
    products: [
      {
        id: 'discount-retail',
        name: 'Discount Retail',
        description: 'Value-focused retail chains and discount stores',
        longDescription: 'Retailers focused on providing value through low prices, bulk sales, and efficient operations.',
        companiesDetailed: [
          { name: 'Walmart', ticker: 'WMT', listing: 'US' },
          { name: 'Target', ticker: 'TGT', listing: 'US' },
          { name: 'Costco Wholesale', ticker: 'COST', listing: 'US' },
          { name: 'Dollar General', ticker: 'DG', listing: 'US' },
          { name: 'Dollar Tree', ticker: 'DLTR', listing: 'US' },
          { name: 'Five Below', ticker: 'FIVE', listing: 'US' },
          { name: 'Burlington Stores', ticker: 'BURL', listing: 'US' },
          { name: 'Ross Stores', ticker: 'ROST', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'supercenters',
            name: 'Supercenters & Hypermarkets',
            description: 'Large format stores with wide product selection',
            companiesDetailed: [
              { name: 'Walmart', ticker: 'WMT', listing: 'US' },
              { name: 'Target', ticker: 'TGT', listing: 'US' }
            ]
          },
          {
            id: 'warehouse-clubs',
            name: 'Warehouse Clubs',
            description: 'Membership-based bulk retail',
            companiesDetailed: [
              { name: 'Costco Wholesale', ticker: 'COST', listing: 'US' },
              { name: 'BJ\'s Wholesale Club', ticker: 'BJ', listing: 'US' }
            ]
          }
        ],
        tags: ['Discount', 'Value', 'Bulk', 'Membership']
      },
      {
        id: 'specialty-retail',
        name: 'Specialty Retail',
        description: 'Category-focused retail chains',
        longDescription: 'Retailers specializing in specific product categories with deep expertise and curated selections.',
        companiesDetailed: [
          { name: 'Home Depot', ticker: 'HD', listing: 'US' },
          { name: 'Lowe\'s', ticker: 'LOW', listing: 'US' },
          { name: 'Best Buy', ticker: 'BBY', listing: 'US' },
          { name: 'Petco', ticker: 'WOOF', listing: 'US' },
          { name: 'PetSmart', ticker: 'PETM', listing: 'Private' },
          { name: 'Dick\'s Sporting Goods', ticker: 'DKS', listing: 'US' },
          { name: 'Ulta Beauty', ticker: 'ULTA', listing: 'US' },
          { name: 'Sephora', ticker: 'LVMUY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'home-improvement',
            name: 'Home Improvement',
            description: 'Home improvement and construction materials',
            companiesDetailed: [
              { name: 'Home Depot', ticker: 'HD', listing: 'US' },
              { name: 'Lowe\'s', ticker: 'LOW', listing: 'US' }
            ]
          },
          {
            id: 'electronics',
            name: 'Electronics & Technology',
            description: 'Consumer electronics and technology products',
            companiesDetailed: [
              { name: 'Best Buy', ticker: 'BBY', listing: 'US' },
              { name: 'GameStop', ticker: 'GME', listing: 'US' }
            ]
          }
        ],
        tags: ['Specialty', 'Category Focus', 'Expertise', 'Curated']
      },
      {
        id: 'apparel-retail',
        name: 'Apparel & Fashion',
        description: 'Clothing and fashion retail chains',
        longDescription: 'Retailers specializing in clothing, footwear, and fashion accessories.',
        companiesDetailed: [
          { name: 'Nike', ticker: 'NKE', listing: 'US' },
          { name: 'Adidas', ticker: 'ADDYY', listing: 'ADR' },
          { name: 'Lululemon', ticker: 'LULU', listing: 'US' },
          { name: 'Under Armour', ticker: 'UAA', listing: 'US' },
          { name: 'Gap', ticker: 'GPS', listing: 'US' },
          { name: 'American Eagle Outfitters', ticker: 'AEO', listing: 'US' },
          { name: 'Urban Outfitters', ticker: 'URBN', listing: 'US' },
          { name: 'Abercrombie & Fitch', ticker: 'ANF', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'athletic-wear',
            name: 'Athletic Wear',
            description: 'Sports and athletic apparel',
            companiesDetailed: [
              { name: 'Nike', ticker: 'NKE', listing: 'US' },
              { name: 'Adidas', ticker: 'ADDYY', listing: 'ADR' },
              { name: 'Lululemon', ticker: 'LULU', listing: 'US' }
            ]
          },
          {
            id: 'casual-fashion',
            name: 'Casual Fashion',
            description: 'Casual and lifestyle apparel',
            companiesDetailed: [
              { name: 'Gap', ticker: 'GPS', listing: 'US' },
              { name: 'American Eagle Outfitters', ticker: 'AEO', listing: 'US' },
              { name: 'Urban Outfitters', ticker: 'URBN', listing: 'US' }
            ]
          }
        ],
        tags: ['Fashion', 'Apparel', 'Footwear', 'Lifestyle']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Digital & Omnichannel',
    layout: 'grid',
    products: [
      {
        id: 'omnichannel',
        name: 'Omnichannel Retail',
        description: 'Integrated online and offline retail experiences',
        longDescription: 'Retailers that seamlessly integrate online and offline channels to provide unified customer experiences.',
        companiesDetailed: [
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'Walmart', ticker: 'WMT', listing: 'US' },
          { name: 'Target', ticker: 'TGT', listing: 'US' },
          { name: 'Home Depot', ticker: 'HD', listing: 'US' },
          { name: 'Best Buy', ticker: 'BBY', listing: 'US' },
          { name: 'Nordstrom', ticker: 'JWN', listing: 'US' },
          { name: 'Macy\'s', ticker: 'M', listing: 'US' },
          { name: 'Kohl\'s', ticker: 'KSS', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'ecommerce-platforms',
            name: 'E-commerce Platforms',
            description: 'Online retail platforms and marketplaces',
            companiesDetailed: [
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
              { name: 'eBay', ticker: 'EBAY', listing: 'US' },
              { name: 'Etsy', ticker: 'ETSY', listing: 'US' }
            ]
          },
          {
            id: 'click-collect',
            name: 'Click & Collect',
            description: 'Buy online, pick up in store services',
            companiesDetailed: [
              { name: 'Walmart', ticker: 'WMT', listing: 'US' },
              { name: 'Target', ticker: 'TGT', listing: 'US' },
              { name: 'Home Depot', ticker: 'HD', listing: 'US' }
            ]
          }
        ],
        tags: ['Omnichannel', 'E-commerce', 'Digital', 'Integration']
      },
      {
        id: 'luxury-retail',
        name: 'Luxury Retail',
        description: 'High-end luxury goods and premium retail',
        longDescription: 'Retailers specializing in luxury goods, premium brands, and high-end customer experiences.',
        companiesDetailed: [
          { name: 'LVMH', ticker: 'LVMUY', listing: 'ADR' },
          { name: 'Kering', ticker: 'PPRUY', listing: 'ADR' },
          { name: 'Hermes', ticker: 'HESAY', listing: 'ADR' },
          { name: 'Tiffany & Co.', ticker: 'TIF', listing: 'US' },
          { name: 'Nordstrom', ticker: 'JWN', listing: 'US' },
          { name: 'Neiman Marcus', ticker: 'NMG', listing: 'Private' },
          { name: 'Saks Fifth Avenue', ticker: 'SKS', listing: 'Private' }
        ],
        tags: ['Luxury', 'Premium', 'High-end', 'Exclusive']
      }
    ]
  }
]






