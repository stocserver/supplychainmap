import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'power-cooling',
      name: 'Power & Cooling Infrastructure',
      description: 'UPS, thermal management, switchgear, and busway systems for reliable DC power and thermal performance.',
      longDescription: 'Critical infrastructure components ensuring continuous and optimized operation of data centers. This includes Uninterruptible Power Supplies (UPS) for backup, precision cooling systems (CRAC/CRAH) for thermal management, switchgear for power distribution, and busway systems for efficient power delivery within the facility. These systems are vital for maintaining uptime and energy efficiency.',
      companiesDetailed: [
        { name: 'Vertiv', ticker: 'VRT', listing: 'US' },
        { name: 'Eaton', ticker: 'ETN', listing: 'US' },
        { name: 'Trane Technologies', ticker: 'TT', listing: 'US' },
        { name: 'Carrier', ticker: 'CARR', listing: 'US' },
        { name: 'Johnson Controls', ticker: 'JCI', listing: 'US' },
        { name: 'Honeywell', ticker: 'HON', listing: 'US' },
      ],
      tags: ['UPS', 'CRAC/CRAH', 'Switchgear'],
    },
    {
      id: 'generators',
      name: 'Backup Power & Generators',
      description: 'Diesel/natural gas gensets and energy storage for runtime and resiliency.',
      longDescription: 'Systems providing emergency power to data centers during grid outages. This typically includes diesel or natural gas generators for long-duration backup and battery energy storage systems (BESS) for immediate power during switchovers, ensuring continuous operation and data integrity.',
      companiesDetailed: [
        { name: 'Cummins', ticker: 'CMI', listing: 'US' },
        { name: 'Caterpillar', ticker: 'CAT', listing: 'US' },
      ],
      tags: ['Gensets', 'BESS'],
    },
    {
      id: 'optical-cabling',
      name: 'Optical & Structured Cabling',
      description: 'Fiber/optical, copper, and racks for intra-DC connectivity.',
      longDescription: 'High-performance cabling infrastructure essential for data center connectivity. This encompasses fiber optic cables for high-speed data transmission, copper cabling for shorter distances, and structured racking systems to organize and protect network equipment. These components form the backbone for communication within and between data centers.',
      companiesDetailed: [
        { name: 'Corning', ticker: 'GLW', listing: 'US' },
        { name: 'Ciena', ticker: 'CIEN', listing: 'US' },
        { name: 'CommScope', ticker: 'COMM', listing: 'US' },
        { name: 'Amphenol', ticker: 'APH', listing: 'US' },
      ],
      tags: ['Fiber', 'DWDM'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'servers-storage',
      name: 'Servers & Storage',
      description: 'Compute and storage platforms for colocation and hyperscale data centers.',
      longDescription: 'Hardware platforms providing the computational power and data retention capabilities for modern data centers. This includes rack-mounted servers for processing workloads (e.g., x86, GPU-accelerated) and various storage solutions (e.g., NVMe, all-flash arrays, hybrid cloud storage) for managing vast amounts of data efficiently and securely.',
      companiesDetailed: [
        { name: 'Dell Technologies', ticker: 'DELL', listing: 'US' },
        { name: 'Hewlett Packard Enterprise', ticker: 'HPE', listing: 'US' },
        { name: 'Super Micro Computer', ticker: 'SMCI', listing: 'US' },
        { name: 'NetApp', ticker: 'NTAP', listing: 'US' },
        { name: 'Pure Storage', ticker: 'PSTG', listing: 'US' },
      ],
      tags: ['x86', 'GPU', 'NVMe'],
    },
    {
      id: 'colo-reits',
      name: 'Colocation & DC REITs',
      description: 'Wholesale/retail colocation and interconnection platforms operating global campuses.',
      longDescription: 'Real Estate Investment Trusts (REITs) specializing in owning, operating, and leasing data center space. They provide physical infrastructure (power, cooling, security) and interconnection services (neutral meet-me rooms) to enterprises, cloud providers, and network carriers, enabling them to house their IT equipment in purpose-built facilities.',
      companiesDetailed: [
        { name: 'Equinix', ticker: 'EQIX', listing: 'US' },
        { name: 'Digital Realty', ticker: 'DLR', listing: 'US' },
        { name: 'Iron Mountain', ticker: 'IRM', listing: 'US' },
        { name: 'Switch', ticker: 'SWCH', listing: 'US' },
      ],
      tags: ['Interconnection', 'Neutral Meet-Me'],
    },
    {
      id: 'towers-fiber',
      name: 'Towers & Metro Fiber',
      description: 'Macro/small cell towers and metro fiber backbones connecting data centers and edge.',
      longDescription: 'Network infrastructure enabling connectivity between data centers, cloud regions, and edge locations. This includes communication towers (macro/small cell) for wireless networks and extensive metropolitan fiber optic networks that provide high-bandwidth, low-latency connectivity, crucial for distributed data processing and cloud services.',
      companiesDetailed: [
        { name: 'American Tower', ticker: 'AMT', listing: 'US' },
        { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
        { name: 'SBA Communications', ticker: 'SBAC', listing: 'US' },
        { name: 'Uniti Group', ticker: 'UNIT', listing: 'US' },
      ],
      tags: ['Backbone', 'Edge'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'hyperscale',
      name: 'Hyperscale & Cloud Regions',
      description: 'Public cloud regions, availability zones, and on-ramps into colocation campuses.',
      longDescription: 'Massive, highly scalable data center deployments owned and operated by major cloud providers (e.g., AWS, Azure, Google Cloud). These global regions contain multiple availability zones, offering resilient and redundant infrastructure for cloud computing, storage, networking, and a wide array of managed services to enterprises worldwide.',
      companiesDetailed: [
        { name: 'Amazon Web Services (Amazon)', ticker: 'AMZN', listing: 'US' },
        { name: 'Microsoft Azure (Microsoft)', ticker: 'MSFT', listing: 'US' },
        { name: 'Google Cloud (Alphabet)', ticker: 'GOOGL', listing: 'US' },
        { name: 'Oracle Cloud', ticker: 'ORCL', listing: 'US' },
        { name: 'IBM Cloud', ticker: 'IBM', listing: 'US' },
      ],
      tags: ['Regions', 'On-Ramps'],
    },
    {
      id: 'edge-cdn',
      name: 'Edge & CDN Operators',
      description: 'Content delivery, security at the edge, and compute close to users and devices.',
      longDescription: 'Distributed network architectures that bring computing resources and content closer to end-users and devices. Content Delivery Networks (CDNs) cache content at edge locations to reduce latency, while edge compute platforms enable real-time processing and security services for applications requiring immediate response times, such as IoT and AI inferencing.',
      companiesDetailed: [
        { name: 'Cloudflare', ticker: 'NET', listing: 'US' },
        { name: 'Akamai', ticker: 'AKAM', listing: 'US' },
        { name: 'Fastly', ticker: 'FSLY', listing: 'US' },
      ],
      tags: ['CDN', 'Security'],
    },
  ],
}

export const dataCenterProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]


