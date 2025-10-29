import { ValueChainStageProducts } from "@/lib/data/industries"

export const fintechProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Infrastructure & Technology',
    layout: 'flow',
    products: [
      {
        id: 'payment-networks',
        name: 'Payment Networks',
        description: 'Core payment processing infrastructure',
        longDescription: 'Operators of the fundamental global payment networks that facilitate electronic transactions, enabling secure and efficient money movement between consumers, merchants, and financial institutions. These networks support credit, debit, and prepaid card transactions, as well as digital wallet functionality.',
        companiesDetailed: [
          { name: 'Visa', ticker: 'V', listing: 'US' },
          { name: 'Mastercard', ticker: 'MA', listing: 'US' },
          { name: 'American Express', ticker: 'AXP', listing: 'US' },
          { name: 'Discover Financial', ticker: 'DFS', listing: 'US' },
          { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
          { name: 'Square', ticker: 'SQ', listing: 'US' },
          { name: 'Adyen', ticker: 'ADYEY', listing: 'ADR' },
          { name: 'Marqeta', ticker: 'MQ', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'card-networks',
            name: 'Card Networks',
            description: 'Credit and debit card processing',
            longDescription: 'The underlying infrastructure that processes transactions made with credit, debit, and prepaid cards. These networks connect issuers, acquirers, and merchants, ensuring secure and rapid authorization, clearing, and settlement of payments globally.',
            companiesDetailed: [
              { name: 'Visa', ticker: 'V', listing: 'US' },
              { name: 'Mastercard', ticker: 'MA', listing: 'US' },
              { name: 'American Express', ticker: 'AXP', listing: 'US' }
            ]
          },
          {
            id: 'digital-wallets',
            name: 'Digital Wallets',
            description: 'Mobile and digital payment platforms',
            longDescription: 'Software-based systems that securely store payment information and allow users to make electronic transactions via mobile devices or online. These platforms enhance convenience, often integrate with loyalty programs, and support various payment methods.',
            companiesDetailed: [
              { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
              { name: 'Square', ticker: 'SQ', listing: 'US' },
              { name: 'Apple Pay', ticker: 'AAPL', listing: 'US' }
            ]
          }
        ],
        tags: ['Payment Networks', 'Processing', 'Infrastructure', 'Transactions']
      },
      {
        id: 'blockchain-infrastructure',
        name: 'Blockchain Infrastructure',
        description: 'Cryptocurrency and blockchain technology platforms',
        longDescription: 'Development and maintenance of the underlying technology that powers decentralized digital currencies and distributed ledgers. This includes blockchain protocols, cryptocurrency exchanges, and platforms for decentralized finance (DeFi), enabling secure and transparent digital asset transactions.',
        companiesDetailed: [
          { name: 'Coinbase', ticker: 'COIN', listing: 'US' },
          { name: 'MicroStrategy', ticker: 'MSTR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'cryptocurrency-exchanges',
            name: 'Cryptocurrency Exchanges',
            description: 'Digital asset trading platforms',
            longDescription: 'Online platforms where users can buy, sell, and trade various cryptocurrencies. These exchanges provide market access, liquidity, and often offer custody services for digital assets, facilitating participation in the broader blockchain ecosystem.',
            companiesDetailed: [
              { name: 'Coinbase', ticker: 'COIN', listing: 'US' },
              { name: 'MicroStrategy', ticker: 'MSTR', listing: 'US' }
            ]
          },
          
        ],
        tags: ['Blockchain', 'Cryptocurrency', 'DeFi', 'Digital Assets']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Financial Services',
    layout: 'hybrid',
    products: [
      {
        id: 'payment-processors',
        name: 'Payment Processors',
        description: 'Payment processing and merchant services',
        longDescription: 'Companies that provide a full suite of services enabling merchants to accept various forms of electronic payments. This includes point-of-sale (POS) systems, online payment gateways, and backend processing that handles transaction authorization, clearing, and settlement for businesses of all sizes.',
        companiesDetailed: [
          { name: 'Square', ticker: 'SQ', listing: 'US' },
          { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
          { name: 'Adyen', ticker: 'ADYEY', listing: 'ADR' },
          { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
          { name: 'Global Payments', ticker: 'GPN', listing: 'US' },
          { name: 'Worldpay', ticker: 'WP', listing: 'US' },
          { name: 'Marqeta', ticker: 'MQ', listing: 'US' },
          { name: 'Shift4 Payments', ticker: 'FOUR', listing: 'US' },
          { name: 'Toast', ticker: 'TOST', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'merchant-services',
            name: 'Merchant Services',
            description: 'Point-of-sale and payment acceptance',
            longDescription: 'Services and technologies provided to businesses to enable them to accept customer payments, whether in-person via Point-of-Sale (POS) systems, online, or through mobile devices. This includes hardware, software, and payment processing infrastructure.',
            companiesDetailed: [
              { name: 'Square', ticker: 'SQ', listing: 'US' },
              { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
              { name: 'Global Payments', ticker: 'GPN', listing: 'US' }
            ]
          },
          {
            id: 'online-payments',
            name: 'Online Payments',
            description: 'E-commerce payment processing',
            longDescription: 'Specialized payment processing solutions for e-commerce transactions, enabling businesses to securely accept payments through their websites and online platforms. This involves integrating payment gateways, managing fraud detection, and ensuring compliance with online security standards.',
            companiesDetailed: [
              { name: 'PayPal', ticker: 'PYPL', listing: 'US' },
              { name: 'Adyen', ticker: 'ADYEY', listing: 'ADR' },
              { name: 'Shift4 Payments', ticker: 'FOUR', listing: 'US' },
              { name: 'Toast', ticker: 'TOST', listing: 'US' }
            ]
          }
        ],
        tags: ['Payment Processing', 'Merchant Services', 'POS', 'E-commerce']
      },
      {
        id: 'digital-banking',
        name: 'Digital Banking',
        description: 'Online and mobile banking platforms',
        longDescription: 'Innovative financial service providers that leverage technology to offer banking services primarily through digital channels (web and mobile apps), often without traditional physical branches. This includes neobanks, mobile-first banking solutions, and platforms offering streamlined financial management.',
        companiesDetailed: [
          { name: 'SoFi', ticker: 'SOFI', listing: 'US' },
          { name: 'Robinhood', ticker: 'HOOD', listing: 'US' },
          { name: 'Dave', ticker: 'DAVE', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'neobanks',
            name: 'Neobanks',
            description: 'Digital-only banking platforms',
            longDescription: 'Financial technology companies that provide banking services entirely online or through mobile apps, often without physical branches. Neobanks typically offer features like checking and savings accounts, debit cards, and budgeting tools with a focus on user experience and lower fees.',
            companiesDetailed: [
              { name: 'SoFi', ticker: 'SOFI', listing: 'US' }
            ]
          },
          {
            id: 'mobile-banking',
            name: 'Mobile Banking',
            description: 'Mobile-first banking applications',
            longDescription: 'Applications designed for smartphones and tablets that allow users to manage their bank accounts, conduct transactions, deposit checks, and access financial services on the go. These apps prioritize ease of use and accessibility through mobile devices.',
            companiesDetailed: [
              { name: 'Robinhood', ticker: 'HOOD', listing: 'US' },
              { name: 'Dave', ticker: 'DAVE', listing: 'US' }
            ]
          }
        ],
        tags: ['Digital Banking', 'Mobile Banking', 'Neobanks', 'Fintech']
      },
      {
        id: 'consumer-apps',
        name: 'Consumer Financial Apps',
        description: 'Personal finance and investment applications',
        longDescription: 'Mobile and web applications designed for individual consumers to manage their personal finances, investments, and access various lending products. This includes budgeting tools, trading platforms, personal loan originators, and buy-now-pay-later (BNPL) services, empowering users with greater control over their financial lives.',
        companiesDetailed: [
          { name: 'Intuit', ticker: 'INTU', listing: 'US' },
          { name: 'Robinhood', ticker: 'HOOD', listing: 'US' },
          { name: 'SoFi', ticker: 'SOFI', listing: 'US' },
          { name: 'LendingClub', ticker: 'LC', listing: 'US' },
          { name: 'Upstart', ticker: 'UPST', listing: 'US' },
          { name: 'Affirm', ticker: 'AFRM', listing: 'US' },
          { name: 'Bill.com', ticker: 'BILL', listing: 'US' },
          { name: 'Dave', ticker: 'DAVE', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'investment-apps',
            name: 'Investment Apps',
            description: 'Trading and investment platforms',
            longDescription: 'Digital platforms that enable individuals to buy, sell, and manage various investment assets, including stocks, ETFs, and cryptocurrencies. These apps often feature user-friendly interfaces, educational content, and sometimes commission-free trading.',
            companiesDetailed: [
              { name: 'Robinhood', ticker: 'HOOD', listing: 'US' },
              { name: 'SoFi', ticker: 'SOFI', listing: 'US' },
              { name: 'Intuit', ticker: 'INTU', listing: 'US' }
            ]
          },
          {
            id: 'lending-platforms',
            name: 'Lending Platforms',
            description: 'Personal and consumer lending',
            longDescription: 'Online platforms that facilitate personal and consumer loans, often using alternative data and AI-driven underwriting models to assess creditworthiness. These platforms provide quick access to credit for various purposes, including debt consolidation, home improvements, and unexpected expenses.',
            companiesDetailed: [
              { name: 'LendingClub', ticker: 'LC', listing: 'US' },
              { name: 'Upstart', ticker: 'UPST', listing: 'US' },
              { name: 'Affirm', ticker: 'AFRM', listing: 'US' },
              { name: 'SoFi', ticker: 'SOFI', listing: 'US' }
            ]
          }
        ],
        tags: ['Personal Finance', 'Investing', 'Lending', 'Consumer Apps']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'B2B & Enterprise',
    layout: 'grid',
    products: [
      {
        id: 'b2b-fintech',
        name: 'B2B Fintech',
        description: 'Enterprise financial technology solutions',
        longDescription: 'Financial technology solutions designed for businesses, encompassing areas like treasury management, corporate payment processing, supply chain finance, and regulatory compliance software. These solutions streamline financial operations, enhance efficiency, and provide analytical insights for enterprises.',
        companiesDetailed: [
          { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
          { name: 'Fidelity National Information Services', ticker: 'FIS', listing: 'US' },
          { name: 'Jack Henry & Associates', ticker: 'JKHY', listing: 'US' },
          { name: 'Guidewire Software', ticker: 'GWRE', listing: 'US' },
          { name: 'NCR Corporation', ticker: 'NCR', listing: 'US' },
          { name: 'Duck Creek Technologies', ticker: 'DCT', listing: 'US' },
          { name: 'Yodlee', ticker: 'ENV', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'core-banking-systems',
            name: 'Core Banking Systems',
            description: 'Banking infrastructure and platforms',
            longDescription: "Integrated software solutions that manage a bank's central operations, including customer accounts, transaction processing, loan management, and general ledger functions. These systems are critical for the efficient and compliant operation of financial institutions.",
            companiesDetailed: [
              { name: 'Fiserv', ticker: 'FISV', listing: 'US' },
              { name: 'Fidelity National Information Services', ticker: 'FIS', listing: 'US' },
              { name: 'Jack Henry & Associates', ticker: 'JKHY', listing: 'US' }
            ]
          },
          {
            id: 'api-platforms',
            name: 'API Platforms',
            description: 'Financial data and API services',
            longDescription: 'Platforms that provide programmatic access to financial data and services through Application Programming Interfaces (APIs). These enable seamless integration of financial functionalities into third-party applications, fostering innovation in areas like open banking and embedded finance.',
            companiesDetailed: [
              { name: 'Yodlee', ticker: 'ENV', listing: 'US' },
              
            ]
          }
        ],
        tags: ['B2B', 'Enterprise', 'Banking Systems', 'APIs']
      },
      {
        id: 'insurtech',
        name: 'Insurtech',
        description: 'Insurance technology and digital platforms',
        longDescription: 'Technology-driven companies that aim to innovate and disrupt the traditional insurance industry. Insurtech solutions leverage data analytics, AI, and digital platforms to improve underwriting, claims processing, customer engagement, and offer new insurance products like parametric insurance and on-demand coverage.',
        companiesDetailed: [
          { name: 'Lemonade', ticker: 'LMND', listing: 'US' },
          { name: 'Root Insurance', ticker: 'ROOT', listing: 'US' },
          { name: 'Metromile', ticker: 'MILE', listing: 'US' },
          { name: 'Hippo', ticker: 'HIPO', listing: 'US' },
          { name: 'Oscar Health', ticker: 'OSCR', listing: 'US' },
          { name: 'Clover Health', ticker: 'CLOV', listing: 'US' },
          { name: 'Bright Health', ticker: 'BHG', listing: 'US' },
          { name: 'GoHealth', ticker: 'GOCO', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'digital-insurance',
            name: 'Digital Insurance',
            description: 'Online insurance platforms',
            longDescription: 'Platforms that offer insurance products and services primarily through digital channels, providing simplified online quotes, policy management, and claims processing. These solutions aim to enhance customer experience and operational efficiency through technology.',
            companiesDetailed: [
              { name: 'Lemonade', ticker: 'LMND', listing: 'US' },
              { name: 'Root Insurance', ticker: 'ROOT', listing: 'US' },
              { name: 'Hippo', ticker: 'HIPO', listing: 'US' }
            ]
          },
          {
            id: 'health-insurtech',
            name: 'Health Insurtech',
            description: 'Digital health insurance platforms',
            longDescription: 'Insurtech companies focused on leveraging technology to innovate within the health insurance sector. This includes platforms offering personalized health plans, telehealth integration, wellness programs, and data-driven risk assessment to improve health outcomes and reduce costs.',
            companiesDetailed: [
              { name: 'Oscar Health', ticker: 'OSCR', listing: 'US' },
              { name: 'Clover Health', ticker: 'CLOV', listing: 'US' },
              { name: 'Bright Health', ticker: 'BHG', listing: 'US' }
            ]
          }
        ],
        tags: ['Insurtech', 'Digital Insurance', 'Health Insurance', 'Technology']
      }
    ]
  }
]
