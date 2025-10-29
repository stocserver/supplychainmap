import { ValueChainStageProducts } from "@/lib/data/industries"

export const telecommunicationsProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Infrastructure & Equipment',
    layout: 'flow',
    products: [
      {
        id: 'network-equipment',
        name: 'Network Equipment',
        description: 'Telecommunications infrastructure and networking equipment',
        longDescription: 'Companies that manufacture networking equipment, routers, switches, and telecommunications infrastructure components.',
        companiesDetailed: [
          { name: 'Cisco Systems', ticker: 'CSCO', listing: 'US' },
          { name: 'Juniper Networks', ticker: 'JNPR', listing: 'US' },
          { name: 'Arista Networks', ticker: 'ANET', listing: 'US' },
          { name: 'Nokia', ticker: 'NOK', listing: 'US' },
          { name: 'Ericsson', ticker: 'ERIC', listing: 'US' },
          { name: 'Samsung Electronics', ticker: 'SSNLF', listing: 'ADR' },
          { name: 'CommScope', ticker: 'COMM', listing: 'US' },
          { name: 'Fujitsu', ticker: 'FJTSY', listing: 'ADR' },
          { name: 'Motorola Solutions', ticker: 'MSI', listing: 'US' },
          { name: 'Ciena Corporation', ticker: 'CIEN', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'routing-switching',
            name: 'Routing & Switching',
            description: 'Network routers and switches',
            longDescription: 'Core and edge networking platforms that forward packets across LAN/WAN and data center fabrics. Features include high throughput, low latency, QoS, and programmability for SDN.',
            companiesDetailed: [
              { name: 'Cisco Systems', ticker: 'CSCO', listing: 'US' },
              { name: 'Juniper Networks', ticker: 'JNPR', listing: 'US' },
              { name: 'Arista Networks', ticker: 'ANET', listing: 'US' }
            ]
          },
          {
            id: 'wireless-infrastructure',
            name: 'Wireless Infrastructure',
            description: '5G and wireless network equipment',
            longDescription: 'Radio access network (RAN) equipment including radios, basebands, and antennas for 4G/5G, alongside small cells and Open RAN architectures to expand coverage and capacity.',
            companiesDetailed: [
              { name: 'Nokia', ticker: 'NOK', listing: 'US' },
              { name: 'Ericsson', ticker: 'ERIC', listing: 'US' },
              { name: 'CommScope', ticker: 'COMM', listing: 'US' }
            ]
          }
        ],
        tags: ['Network Equipment', 'Infrastructure', '5G', 'Wireless']
      },
      {
        id: 'tower-infrastructure',
        name: 'Tower Infrastructure',
        description: 'Cell tower and wireless infrastructure',
        longDescription: 'Companies that own, operate, and lease cell towers and wireless infrastructure to telecommunications carriers.',
        companiesDetailed: [
          { name: 'American Tower', ticker: 'AMT', listing: 'US' },
          { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
          { name: 'SBA Communications', ticker: 'SBAC', listing: 'US' },
          { name: 'Uniti Group', ticker: 'UNIT', listing: 'US' },
          { name: 'Digital Realty Trust', ticker: 'DLR', listing: 'US' },
          { name: 'Equinix', ticker: 'EQIX', listing: 'US' }
        ],
        tags: ['Cell Towers', 'Infrastructure', 'REITs', 'Wireless']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Service Providers',
    layout: 'hybrid',
    products: [
      {
        id: 'carriers',
        name: 'Wireless Carriers',
        description: 'Mobile network operators and wireless service providers',
        longDescription: 'Companies that operate wireless networks and provide mobile voice, data, and messaging services to consumers and businesses.',
        companiesDetailed: [
          { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
          { name: 'AT&T', ticker: 'T', listing: 'US' },
          { name: 'T-Mobile US', ticker: 'TMUS', listing: 'US' },
          { name: 'Dish Network', ticker: 'DISH', listing: 'US' },
          { name: 'US Cellular', ticker: 'USM', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'postpaid-services',
            name: 'Postpaid Services',
            description: 'Contract-based wireless services',
            longDescription: 'Mobile plans billed monthly after usage, typically with device financing, higher priority data, roaming, and enterprise features for business accounts.',
            companiesDetailed: [
              { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
              { name: 'AT&T', ticker: 'T', listing: 'US' },
              { name: 'T-Mobile US', ticker: 'TMUS', listing: 'US' }
            ]
          },
          {
            id: 'prepaid-services',
            name: 'Prepaid Services',
            description: 'No-contract wireless services',
            longDescription: 'Pay-in-advance mobile offerings with predictable costs, no credit checks, and flexible top-ups; popular for budget-conscious and secondary lines.',
            companiesDetailed: [
              { name: 'T-Mobile US', ticker: 'TMUS', listing: 'US' },
              { name: 'Dish Network', ticker: 'DISH', listing: 'US' },
              { name: 'US Cellular', ticker: 'USM', listing: 'US' }
            ]
          }
        ],
        tags: ['Wireless', 'Mobile', 'Carriers', '5G']
      },
      {
        id: 'fiber-networks',
        name: 'Fiber Networks',
        description: 'Fiber optic internet and broadband services',
        longDescription: 'Companies that provide high-speed internet services over fiber optic networks to residential and business customers.',
        companiesDetailed: [
          { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
          { name: 'AT&T', ticker: 'T', listing: 'US' },
          { name: 'Charter Communications', ticker: 'CHTR', listing: 'US' },
          { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
          { name: 'Altice USA', ticker: 'ATUS', listing: 'US' },
          { name: 'Frontier Communications', ticker: 'FYBR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'residential-broadband',
            name: 'Residential Broadband',
            description: 'Home internet services',
            longDescription: 'Last-mile fiber/coax access delivering high-speed internet to households, often bundled with Wi‑Fi gateways, voice, and streaming TV options.',
            companiesDetailed: [
              { name: 'Charter Communications', ticker: 'CHTR', listing: 'US' },
              { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
              { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' }
            ]
          },
          {
            id: 'business-services',
            name: 'Business Services',
            description: 'Enterprise internet and connectivity',
            longDescription: 'Dedicated internet access, Ethernet, SD‑WAN, and private connectivity solutions for branch networks and data center/cloud interconnects, with SLAs and managed options.',
            companiesDetailed: [
              { name: 'AT&T', ticker: 'T', listing: 'US' },
              { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
              { name: 'Lumen Technologies', ticker: 'LUMN', listing: 'US' }
            ]
          }
        ],
        tags: ['Fiber', 'Broadband', 'Internet', 'High-speed']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Consumer & Enterprise Services',
    layout: 'grid',
    products: [
      {
        id: 'consumer-services',
        name: 'Consumer Services',
        description: 'Consumer telecommunications and entertainment services',
        longDescription: 'Companies providing bundled telecommunications services including internet, TV, phone, and streaming services to consumers.',
        companiesDetailed: [
          { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
          { name: 'Charter Communications', ticker: 'CHTR', listing: 'US' },
          { name: 'Dish Network', ticker: 'DISH', listing: 'US' },
          { name: 'Altice USA', ticker: 'ATUS', listing: 'US' },
          { name: 'Frontier Communications', ticker: 'FYBR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'cable-tv',
            name: 'Cable TV',
            description: 'Traditional cable television services',
            longDescription: 'Linear TV delivered via hybrid fiber-coax networks with set-top boxes, channel bundles, DVRs, and regional sports/premium content.',
            companiesDetailed: [
              { name: 'Comcast', ticker: 'CMCSA', listing: 'US' },
              { name: 'Charter Communications', ticker: 'CHTR', listing: 'US' },
              { name: 'Altice USA', ticker: 'ATUS', listing: 'US' }
            ]
          },
          {
            id: 'streaming-services',
            name: 'Streaming Services',
            description: 'Over-the-top streaming platforms',
            longDescription: 'On-demand video platforms delivered over the public internet with subscription (SVOD), ad-supported (AVOD), or hybrid tiers; accessible on multi-screen devices.',
            companiesDetailed: [
              { name: 'Netflix', ticker: 'NFLX', listing: 'US' },
              { name: 'Disney', ticker: 'DIS', listing: 'US' },
              { name: 'Warner Bros. Discovery', ticker: 'WBD', listing: 'US' }
            ]
          }
        ],
        tags: ['Consumer', 'Bundled Services', 'Entertainment', 'Streaming']
      },
      {
        id: 'enterprise-solutions',
        name: 'Enterprise Solutions',
        description: 'Business telecommunications and cloud services',
        longDescription: 'Companies providing telecommunications, cloud, and connectivity solutions to businesses and enterprises.',
        companiesDetailed: [
          { name: 'AT&T', ticker: 'T', listing: 'US' },
          { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
          { name: 'Lumen Technologies', ticker: 'LUMN', listing: 'US' },
          { name: 'Cogent Communications', ticker: 'CCOI', listing: 'US' },
          { name: 'GTT Communications', ticker: 'GTT', listing: 'US' },
          { name: 'Zayo Group', ticker: 'ZAYO', listing: 'US' },
        ],
        subProducts: [
          {
            id: 'cloud-connectivity',
            name: 'Cloud Connectivity',
            description: 'Cloud and data center connectivity',
            longDescription: 'Direct connect and IP transit solutions linking enterprise networks to cloud providers and data centers, optimizing latency, throughput, and security for hybrid architectures.',
            companiesDetailed: [
              { name: 'Lumen Technologies', ticker: 'LUMN', listing: 'US' },
              { name: 'Cogent Communications', ticker: 'CCOI', listing: 'US' },
              { name: 'Zayo Group', ticker: 'ZAYO', listing: 'US' },
            ]
          },
          {
            id: 'managed-services',
            name: 'Managed Services',
            description: 'Managed telecommunications services',
            longDescription: 'Outsourced operation and monitoring of enterprise networks including SD‑WAN, security, voice, and collaboration, delivered with SLAs and 24/7 NOCs.',
            companiesDetailed: [
              { name: 'AT&T', ticker: 'T', listing: 'US' },
              { name: 'Verizon Communications', ticker: 'VZ', listing: 'US' },
              { name: 'Windstream', ticker: 'WINMQ', listing: 'US' },
              { name: 'Vonage', ticker: 'VG', listing: 'US' }
            ]
          }
        ],
        tags: ['Enterprise', 'Cloud', 'Managed Services', 'Connectivity']
      }
    ]
  }
]
