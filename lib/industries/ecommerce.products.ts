import { ValueChainStageProducts } from "@/lib/data/industries"

export const ecommerceProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Platforms & Infrastructure',
    layout: 'flow',
    products: [
      {
        id: 'ecommerce-platforms',
        name: 'E-commerce Platforms',
        description: 'Online marketplace and platform infrastructure',
        longDescription: 'Providers of the foundational technology and infrastructure that enable businesses to conduct sales online. This includes robust marketplace platforms for multi-vendor environments and SaaS solutions that empower businesses to build, host, and manage their own e-commerce stores, handling everything from product listings to order processing.',
        companiesDetailed: [
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'Shopify', ticker: 'SHOP', listing: 'US' },
          { name: 'eBay', ticker: 'EBAY', listing: 'US' },
          { name: 'Etsy', ticker: 'ETSY', listing: 'US' },
          
          { name: 'Magento', ticker: 'ADBE', listing: 'US' },
          { name: 'BigCommerce', ticker: 'BIGC', listing: 'US' },
          { name: 'Squarespace', ticker: 'SQSP', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'marketplace-platforms',
            name: 'Marketplace Platforms',
            description: 'Multi-vendor marketplace platforms',
            longDescription: 'Online platforms that host multiple third-party sellers offering products directly to consumers. These marketplaces provide a broad selection, centralized payment processing, and often handle logistics, connecting buyers and sellers at scale.',
            companiesDetailed: [
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
              { name: 'eBay', ticker: 'EBAY', listing: 'US' },
              { name: 'Etsy', ticker: 'ETSY', listing: 'US' }
            ]
          },
          {
            id: 'saas-platforms',
            name: 'SaaS E-commerce Platforms',
            description: 'Software-as-a-service e-commerce solutions',
            longDescription: 'Cloud-based software solutions that allow businesses to create and manage their online stores without needing to host or maintain the underlying infrastructure. These platforms typically offer features like store design, product management, payment integration, and analytics on a subscription model.',
            companiesDetailed: [
          { name: 'Shopify', ticker: 'SHOP', listing: 'US' },
          { name: 'BigCommerce', ticker: 'BIGC', listing: 'US' },
          { name: 'Squarespace', ticker: 'SQSP', listing: 'US' },
          { name: 'Wix', ticker: 'WIX', listing: 'US' }
            ]
          }
        ],
        tags: ['Platforms', 'Marketplace', 'SaaS', 'Infrastructure']
      },
      {
        id: 'payment-gateway',
        name: 'Payment Processing',
        description: 'Online payment processing and gateway services',
        longDescription: 'Services that facilitate secure electronic financial transactions for e-commerce businesses. This includes payment gateways that authorize transactions between customers and merchants, and payment processors that handle the actual transfer of funds, supporting various methods like credit cards, digital wallets, and bank transfers.',
        companiesDetailed: [
          { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
          
          { name: 'Square', ticker: 'SQ', listing: 'US' },
          { name: 'Adyen', ticker: 'ADYEY', listing: 'ADR' },
          { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
          { name: 'Global Payments', ticker: 'GPN', listing: 'US' },
          { name: 'Worldpay', ticker: 'WP', listing: 'US' },
          { name: 'Marqeta', ticker: 'MQ', listing: 'US' },
          { name: 'Toast', ticker: 'TOST', listing: 'US' },
          { name: 'Shift4 Payments', ticker: 'FOUR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'online-payments',
            name: 'Online Payment Processing',
            description: 'E-commerce payment processing',
            longDescription: 'Systems and services designed to handle secure monetary transactions conducted over the internet for e-commerce. This involves encrypting sensitive financial data, authorizing payments, and settling funds between customers, merchants, and banks.',
            companiesDetailed: [
              
              { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
              { name: 'Adyen', ticker: 'ADYEY', listing: 'ADR' },
              { name: 'Shift4 Payments', ticker: 'FOUR', listing: 'US' }
            ]
          },
          {
            id: 'mobile-payments',
            name: 'Mobile Payment Solutions',
            description: 'Mobile commerce payment solutions',
            longDescription: 'Payment methods and technologies optimized for transactions conducted via mobile devices. This includes digital wallets, in-app payments, and contactless payment systems, offering convenience and security for on-the-go consumers.',
            companiesDetailed: [
              { name: 'Square', ticker: 'SQ', listing: 'US' },
              { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
              { name: 'Apple Pay', ticker: 'AAPL', listing: 'US' }
            ]
          }
        ],
        tags: ['Payments', 'Processing', 'Gateway', 'Transactions']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Marketplaces & Retail',
    layout: 'hybrid',
    products: [
      {
        id: 'marketplaces',
        name: 'Online Marketplaces',
        description: 'Multi-vendor online marketplaces',
        longDescription: 'Digital platforms that aggregate products from multiple sellers, allowing consumers to compare and purchase items in a single online destination. These marketplaces provide a wide selection, often manage payment processing, and facilitate connections between diverse vendors and a large customer base.',
        companiesDetailed: [
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'eBay', ticker: 'EBAY', listing: 'US' },
          { name: 'Etsy', ticker: 'ETSY', listing: 'US' },
          { name: 'Alibaba', ticker: 'BABA', listing: 'ADR' },
          { name: 'JD.com', ticker: 'JD', listing: 'ADR' },
          { name: 'Walmart', ticker: 'WMT', listing: 'US' },
          { name: 'MercadoLibre', ticker: 'MELI', listing: 'US' },
          { name: 'Target', ticker: 'TGT', listing: 'US' },
          { name: 'Wayfair', ticker: 'W', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'general-marketplaces',
            name: 'General Marketplaces',
            description: 'Broad product category marketplaces',
            longDescription: 'Online platforms that offer a vast array of products across numerous categories from various sellers. These marketplaces cater to a broad consumer base, providing convenience and one-stop shopping for diverse needs.',
            companiesDetailed: [
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
              { name: 'eBay', ticker: 'EBAY', listing: 'US' },
              { name: 'Walmart', ticker: 'WMT', listing: 'US' }
            ]
          },
          {
            id: 'specialty-marketplaces',
            name: 'Specialty Marketplaces',
            description: 'Niche and specialty product marketplaces',
            longDescription: 'Online platforms focusing on specific product categories or niches, connecting specialized sellers with targeted buyers. These marketplaces often offer curated selections, unique products, and cater to particular consumer interests or hobbies.',
            companiesDetailed: [
          { name: 'Etsy', ticker: 'ETSY', listing: 'US' },
          { name: 'Wayfair', ticker: 'W', listing: 'US' },
          { name: 'Chewy', ticker: 'CHWY', listing: 'US' },
          { name: 'The RealReal', ticker: 'REAL', listing: 'US' },
          { name: 'Revolve Group', ticker: 'RVLV', listing: 'US' }
            ]
          }
        ],
        tags: ['Marketplaces', 'Multi-vendor', 'Platforms', 'Retail']
      },
      {
        id: 'dtc-retail',
        name: 'Direct-to-Consumer Retail',
        description: 'Brand-owned e-commerce stores',
        longDescription: 'Retail model where brands sell their products directly to end-consumers, bypassing traditional intermediaries. This is primarily done through brand-owned e-commerce websites and direct channels, allowing for greater control over brand experience, customer data, and profit margins.',
        companiesDetailed: [
          { name: 'Nike', ticker: 'NKE', listing: 'US' },
          { name: 'Adidas', ticker: 'ADDYY', listing: 'ADR' },
          { name: 'Lululemon', ticker: 'LULU', listing: 'US' },
          { name: 'Under Armour', ticker: 'UAA', listing: 'US' },
          { name: 'Warby Parker', ticker: 'WRBY', listing: 'US' },
          { name: 'Allbirds', ticker: 'BIRD', listing: 'US' },
          { name: 'Revolve Group', ticker: 'RVLV', listing: 'US' },
          { name: 'Stitch Fix', ticker: 'SFIX', listing: 'US' },
          { name: 'Rent the Runway', ticker: 'RENT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'fashion-dtc',
            name: 'Fashion DTC',
            description: 'Direct-to-consumer fashion brands',
            longDescription: 'Brands that design, manufacture, and sell clothing, accessories, and footwear directly to consumers through their own online stores. This model often emphasizes unique designs, sustainable practices, and strong brand narratives.',
            companiesDetailed: [
              { name: 'Nike', ticker: 'NKE', listing: 'US' },
              { name: 'Lululemon', ticker: 'LULU', listing: 'US' },
              { name: 'Warby Parker', ticker: 'WRBY', listing: 'US' },
              { name: 'Revolve Group', ticker: 'RVLV', listing: 'US' }
            ]
          },
          {
            id: 'lifestyle-dtc',
            name: 'Lifestyle DTC',
            description: 'Lifestyle and wellness brands',
            longDescription: 'Direct-to-consumer brands offering products related to lifestyle, home goods, wellness, and personal care. These brands often focus on aesthetic, ethical sourcing, and building a community around their products.',
            companiesDetailed: [
              { name: 'Allbirds', ticker: 'BIRD', listing: 'US' },
              { name: 'Stitch Fix', ticker: 'SFIX', listing: 'US' }
            ]
          }
        ],
        tags: ['DTC', 'Brand Retail', 'Direct Sales', 'E-commerce']
      },
      {
        id: 'fulfillment',
        name: 'Fulfillment & Logistics',
        description: 'E-commerce fulfillment and logistics services',
        longDescription: 'Services encompassing warehousing, inventory management, order processing, packaging, and shipping for online businesses. These providers ensure efficient and timely delivery of products from the seller to the end customer, often including returns management and supply chain optimization.',
        companiesDetailed: [
          { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
          { name: 'FedEx', ticker: 'FDX', listing: 'US' },
          { name: 'UPS', ticker: 'UPS', listing: 'US' },
          { name: 'DHL', ticker: 'DPSGY', listing: 'ADR' },
          { name: 'Shopify', ticker: 'SHOP', listing: 'US' },
          { name: 'XPO Logistics', ticker: 'XPO', listing: 'US' },
          { name: 'Walmart', ticker: 'WMT', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'warehousing',
            name: 'Warehousing & Storage',
            description: 'E-commerce warehousing services',
            longDescription: 'Storage facilities and inventory management services specifically tailored for e-commerce businesses. This includes receiving, organizing, and tracking products, as well as preparing them for shipment as orders are placed.',
            companiesDetailed: [
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' },
              { name: 'Shopify', ticker: 'SHOP', listing: 'US' }
            ]
          },
          {
            id: 'last-mile-delivery',
            name: 'Last-Mile Delivery',
            description: 'Final delivery to customers',
            longDescription: 'The final leg of the e-commerce delivery process, involving the transportation of goods from a distribution center or local hub directly to the customer\'s specified address. This stage is critical for customer satisfaction and often involves various delivery methods.',
            companiesDetailed: [
              { name: 'FedEx', ticker: 'FDX', listing: 'US' },
              { name: 'UPS', ticker: 'UPS', listing: 'US' },
              { name: 'Amazon', ticker: 'AMZN', listing: 'US' }
            ]
          }
        ],
        tags: ['Fulfillment', 'Logistics', 'Warehousing', 'Delivery']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Services & Support',
    layout: 'grid',
    products: [
      {
        id: 'travel-booking',
        name: 'Online Travel Booking',
        description: 'Travel and hospitality booking platforms',
        longDescription: 'Digital platforms that enable consumers to research, compare, and book various travel-related services, including flights, accommodations (hotels, vacation rentals), car rentals, and package tours. These platforms consolidate offerings from numerous providers for user convenience.',
        companiesDetailed: [
          { name: 'Booking Holdings', ticker: 'BKNG', listing: 'US' },
          { name: 'Expedia Group', ticker: 'EXPE', listing: 'US' },
          { name: 'Airbnb', ticker: 'ABNB', listing: 'US' },
          { name: 'TripAdvisor', ticker: 'TRIP', listing: 'US' },
          { name: 'Sabre', ticker: 'SABR', listing: 'US' },
          { name: 'Amadeus', ticker: 'AMADF', listing: 'ADR' },
          { name: 'Despegar', ticker: 'DESP', listing: 'US' },
          { name: 'Redfin', ticker: 'RDFN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'hotel-booking',
            name: 'Hotel Booking Platforms',
            description: 'Online hotel reservation services',
            longDescription: 'Online platforms dedicated to facilitating hotel reservations, allowing users to search, compare, and book rooms across a wide range of hotel brands and independent properties. Features often include user reviews, price comparisons, and loyalty programs.',
            companiesDetailed: [
              { name: 'Booking Holdings', ticker: 'BKNG', listing: 'US' },
              { name: 'Expedia Group', ticker: 'EXPE', listing: 'US' },
              { name: 'TripAdvisor', ticker: 'TRIP', listing: 'US' }
            ]
          },
          {
            id: 'vacation-rentals',
            name: 'Vacation Rentals',
            description: 'Short-term rental platforms',
            longDescription: 'Digital platforms that connect property owners with travelers seeking short-term accommodations like houses, apartments, and unique stays. These services offer alternatives to traditional hotels, often providing a more local experience and greater flexibility.',
            companiesDetailed: [
              { name: 'Airbnb', ticker: 'ABNB', listing: 'US' },
              { name: 'Booking Holdings', ticker: 'BKNG', listing: 'US' },
              { name: 'Expedia Group', ticker: 'EXPE', listing: 'US' }
            ]
          }
        ],
        tags: ['Travel', 'Booking', 'Hospitality', 'Vacation Rentals']
      },
      {
        id: 'ecommerce-services',
        name: 'E-commerce Services',
        description: 'Supporting services for e-commerce businesses',
        longDescription: 'A suite of auxiliary services that support and enhance the operations of online businesses. This includes digital marketing tools to attract customers, analytics platforms for performance tracking, customer service solutions for engagement, and various business tools to streamline back-office functions.',
        companiesDetailed: [
          { name: 'Shopify', ticker: 'SHOP', listing: 'US' },
          { name: 'BigCommerce', ticker: 'BIGC', listing: 'US' },
          { name: 'Klaviyo', ticker: 'KVYO', listing: 'US' },
          { name: 'Zendesk', ticker: 'ZEN', listing: 'US' },
          { name: 'HubSpot', ticker: 'HUBS', listing: 'US' },
          { name: 'LivePerson', ticker: 'LPSN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'marketing-tools',
            name: 'Marketing Tools',
            description: 'E-commerce marketing and analytics',
            longDescription: 'Software and services designed to help e-commerce businesses attract, engage, and retain customers. This includes email marketing, social media advertising, search engine optimization (SEO) tools, and data analytics to track campaign performance and customer behavior.',
            companiesDetailed: [
              { name: 'Klaviyo', ticker: 'KVYO', listing: 'US' },
              { name: 'HubSpot', ticker: 'HUBS', listing: 'US' },
              { name: 'BigCommerce', ticker: 'BIGC', listing: 'US' }
            ]
          },
          {
            id: 'customer-service',
            name: 'Customer Service',
            description: 'Customer support and service tools',
            longDescription: 'Platforms and solutions that enable e-commerce businesses to manage customer inquiries, provide support, and resolve issues efficiently. This includes helpdesk software, chatbots, and CRM systems designed to enhance customer satisfaction and loyalty.',
            companiesDetailed: [
              { name: 'Zendesk', ticker: 'ZEN', listing: 'US' },
              { name: 'HubSpot', ticker: 'HUBS', listing: 'US' }
            ]
          }
        ],
        tags: ['Services', 'Marketing', 'Analytics', 'Customer Service']
      }
    ]
  }
]
