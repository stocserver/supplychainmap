export interface ValueChainSegment {
  id: string
  name: string
  description: string
  products?: string[] // Actual product categories in this segment
  subcategories?: {
    id: string
    name: string
    description?: string
    products?: string[]
    companies?: string[]
  }[]
  companies?: string[]
}

export interface ValueChain {
  upstream: ValueChainSegment[]
  midstream: ValueChainSegment[]
  downstream: ValueChainSegment[]
}

// Product-centric model (new)
export type ListingType = 'US' | 'ADR' | 'Foreign' | 'Private'

export interface ProductCompanyRef {
  name: string
  ticker?: string
  listing: ListingType
  exchange?: string
  country?: string
  url?: string
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  longDescription?: string
  companiesDetailed?: ProductCompanyRef[]
  subProducts?: ProductCategory[]
  flowsTo?: string[]
  tags?: string[]
}

export interface ValueChainStageProducts {
  stage: 'upstream' | 'midstream' | 'downstream'
  stageLabel: string
  layout?: 'grid' | 'flow' | 'nested' | 'hybrid'
  products: ProductCategory[]
}

export interface Industry {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  subcategories?: string[]
  featured_companies?: string[]
  valueChain?: ValueChain
  // Optional product-centric chain (pilot for selected industries)
  productValueChain?: ValueChainStageProducts[]
}

export const industries: Industry[] = [
  {
    id: 'semiconductors',
    name: 'Semiconductors',
    slug: 'semiconductors',
    description: 'Chip design, manufacturing, and equipment',
    color: 'bg-blue-500',
    icon: '💾',
    subcategories: ['Chip Design', 'Fab Equipment', 'Manufacturing', 'Materials'],
    featured_companies: ['NVDA', 'AMD', 'INTC', 'TSM', 'AVGO', 'QCOM', 'AMAT', 'ASML', 'LRCX', 'KLAC', 'MU', 'NXPI', 'MRVL', 'MCHP', 'ADI', 'TXN'],
    valueChain: {
      upstream: [
        {
          id: 'ip-design',
          name: 'IP Design / IC Design Services',
          description: 'Intellectual property design and IC design services provide foundational building blocks and design expertise. IP designers create reusable circuit designs, while IC design service companies help fabless companies develop custom chips.',
          products: ['ARM Architecture', 'RISC-V Cores', 'GPU IP Blocks', 'Interface IP', 'Memory Controllers', 'EDA Software'],
          companies: ['AVGO', 'QCOM', 'ARM'],
        },
        {
          id: 'ic-design',
          name: 'IC Design (Fabless)',
          description: 'Fabless semiconductor companies focus on chip design and marketing without owning manufacturing facilities. These companies design chips for various applications including GPUs, CPUs, mobile processors, and specialized AI accelerators.',
          products: ['GPU Designs', 'CPU Designs', 'Mobile SoCs', 'AI Accelerators', 'Automotive Chips', 'Analog ICs', 'Power Management ICs', 'RF Chips'],
          companies: ['NVDA', 'AMD', 'QCOM', 'AVGO', 'MRVL', 'NXPI', 'MCHP', 'ADI', 'TXN'],
        },
      ],
      midstream: [
        {
          id: 'wafer-manufacturing',
          name: 'IC / Wafer Manufacturing',
          description: 'Semiconductor foundries manufacture integrated circuits on silicon wafers. These facilities use advanced lithography and etching processes to create billions of transistors on each chip. This is the most capital-intensive part of the semiconductor value chain.',
          products: ['3nm Chips', '5nm Chips', '7nm Chips', 'Logic Wafers', 'Memory Wafers', 'Analog Wafers', 'Power Wafers'],
          subcategories: [
            {
              id: 'production-equipment',
              name: 'Production & Testing Equipment',
              description: 'Equipment manufacturers provide the advanced machinery needed for wafer fabrication, including lithography systems, etching tools, deposition equipment, and inspection systems.',
              products: ['EUV Lithography', 'DUV Lithography', 'Etching Tools', 'Deposition Equipment', 'CMP Tools', 'Inspection Systems', 'Metrology Tools'],
              companies: ['ASML', 'AMAT', 'LRCX', 'KLAC', 'TER'],
            },
            {
              id: 'photomasks',
              name: 'Photomasks',
              description: 'Photomasks are precision quartz plates containing circuit patterns used in the lithography process to transfer designs onto silicon wafers.',
              products: ['Reticles', 'Advanced Photomasks', 'EUV Masks'],
              companies: [],
            },
            {
              id: 'chemicals',
              name: 'Chemicals & Materials',
              description: 'Specialty chemicals and materials used in semiconductor manufacturing, including photoresists, etchants, cleaning chemicals, and ultra-pure gases.',
              products: ['Photoresists', 'Etchants', 'CMP Slurries', 'Ultra-Pure Gases', 'Silicon Wafers', 'Specialty Chemicals'],
              companies: ['DOW', 'LIN'],
            },
          ],
          companies: ['TSM', 'INTC', 'MU', 'UMC'],
        },
      ],
      downstream: [
        {
          id: 'packaging-testing',
          name: 'IC Packaging & Testing',
          description: 'After wafer fabrication, individual chips are cut, packaged to protect them and provide electrical connections, and thoroughly tested to ensure quality and performance standards are met.',
          products: ['BGA Packages', 'QFN Packages', 'Flip Chip', 'Chip-on-Wafer', 'System-in-Package', '3D Stacking', 'Wafer Testing', 'Final Testing'],
          subcategories: [
            {
              id: 'packaging-equipment',
              name: 'Packaging & Testing Equipment',
              description: 'Specialized equipment for chip packaging, wire bonding, substrate attachment, and final testing of packaged semiconductors.',
              products: ['Wire Bonders', 'Die Attach Systems', 'Test Handlers', 'Probe Cards', 'Burn-in Systems'],
              companies: ['AMAT', 'KLAC', 'TER'],
            },
            {
              id: 'substrates',
              name: 'Substrates',
              description: 'Advanced packaging substrates provide the foundation for mounting and connecting semiconductor dies, enabling high-performance multi-chip packages.',
              products: ['IC Substrates', 'Interposers', 'Organic Substrates', 'Ceramic Substrates'],
              companies: [],
            },
            {
              id: 'lead-frames',
              name: 'Lead Frames',
              description: 'Metal structures that provide electrical connections and mechanical support for semiconductor packages.',
              products: ['Copper Lead Frames', 'Alloy Lead Frames', 'Etched Lead Frames'],
              companies: [],
            },
          ],
          companies: ['ASX', 'AMKR'],
        },
        {
          id: 'ic-modules',
          name: 'IC Modules & Integration',
          description: 'Multiple chips are integrated into modules or systems for specific applications, such as memory modules, processor modules, or complete system-on-modules.',
          products: ['Memory Modules (DRAM/NAND)', 'SSD Controllers', 'Processor Modules', 'Camera Modules', 'RF Modules', 'Power Modules'],
          companies: [],
        },
        {
          id: 'distribution',
          name: 'IC Distribution',
          description: 'Semiconductor distributors connect chip manufacturers with end customers, providing inventory management, logistics, and technical support to electronics manufacturers worldwide.',
          products: ['To Smartphones', 'To PCs & Servers', 'To Automotive', 'To Data Centers', 'To IoT Devices', 'To Consumer Electronics'],
          companies: ['AVT', 'ARROW'],
        },
      ],
    },
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'AI platforms, machine learning, and infrastructure',
    color: 'bg-purple-500',
    icon: '🤖',
    subcategories: ['AI Platforms', 'ML Infrastructure', 'AI Chips', 'Applications'],
    featured_companies: ['NVDA', 'GOOGL', 'MSFT', 'META', 'ORCL', 'CRM', 'PLTR', 'AI', 'SNOW', 'DDOG'],
    valueChain: {
      upstream: [
        {
          id: 'ai-chips',
          name: 'AI Chips & Hardware',
          description: 'Specialized processors designed for AI workloads including GPUs, TPUs, and custom AI accelerators.',
          companies: ['NVDA', 'AMD', 'INTC', 'GOOGL'],
        },
        {
          id: 'data-infrastructure',
          name: 'Data Infrastructure & Storage',
          description: 'Data centers, storage solutions, and infrastructure required to train and deploy AI models.',
          companies: ['MSFT', 'GOOGL', 'AMZN', 'SNOW'],
        },
      ],
      midstream: [
        {
          id: 'ml-platforms',
          name: 'ML Platforms & Frameworks',
          description: 'Machine learning platforms, frameworks, and tools for building and training AI models.',
          companies: ['GOOGL', 'MSFT', 'META', 'AMZN'],
        },
        {
          id: 'ai-software',
          name: 'AI Software & APIs',
          description: 'AI software platforms, APIs, and services for natural language processing, computer vision, and more.',
          companies: ['GOOGL', 'MSFT', 'ORCL', 'AI', 'PLTR'],
        },
      ],
      downstream: [
        {
          id: 'ai-applications',
          name: 'AI Applications & Solutions',
          description: 'End-user AI applications across various industries including business intelligence, automation, and decision support.',
          companies: ['CRM', 'MSFT', 'PLTR', 'AI', 'NOW'],
        },
        {
          id: 'ai-services',
          name: 'AI Consulting & Services',
          description: 'Professional services helping businesses implement and optimize AI solutions.',
          companies: ['IBM', 'ORCL', 'PLTR'],
        },
      ],
    },
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Cloud infrastructure, platforms, and services',
    color: 'bg-sky-500',
    icon: '☁️',
    subcategories: ['Infrastructure', 'Platforms', 'Data Centers', 'Edge Computing'],
    featured_companies: ['AMZN', 'MSFT', 'GOOGL', 'ORCL', 'IBM', 'SNOW', 'NET', 'DDOG', 'MDB', 'CFLT'],
    valueChain: {
      upstream: [
        {
          id: 'data-center-infrastructure',
          name: 'Data Center Infrastructure',
          description: 'Physical data centers, servers, networking equipment, and power infrastructure.',
          companies: ['EQIX', 'DLR', 'CCI', 'AMT'],
        },
        {
          id: 'networking-hardware',
          name: 'Networking Hardware',
          description: 'Switches, routers, and networking equipment for cloud infrastructure.',
          companies: ['CSCO', 'JNPR', 'ANET'],
        },
      ],
      midstream: [
        {
          id: 'cloud-platforms',
          name: 'Cloud Platforms (IaaS/PaaS)',
          description: 'Infrastructure and platform services providing compute, storage, and networking resources.',
          companies: ['AMZN', 'MSFT', 'GOOGL', 'ORCL', 'IBM'],
        },
        {
          id: 'cloud-databases',
          name: 'Cloud Databases & Storage',
          description: 'Database services and storage solutions optimized for cloud environments.',
          companies: ['SNOW', 'MDB', 'ORCL', 'CFLT', 'ESTC'],
        },
      ],
      downstream: [
        {
          id: 'saas-applications',
          name: 'SaaS Applications',
          description: 'Software as a service applications running on cloud infrastructure.',
          companies: ['CRM', 'MSFT', 'ADBE', 'NOW', 'WDAY'],
        },
        {
          id: 'cloud-management',
          name: 'Cloud Management & Monitoring',
          description: 'Tools for managing, monitoring, and optimizing cloud resources.',
          companies: ['DDOG', 'NET', 'SPLK', 'ESTC'],
        },
      ],
    },
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Network security, endpoint protection, and threat intelligence',
    color: 'bg-red-500',
    icon: '🔒',
    subcategories: ['Network Security', 'Endpoint Protection', 'Cloud Security', 'Identity'],
    featured_companies: ['CRWD', 'PANW', 'ZS', 'FTNT', 'OKTA', 'S', 'CYBR', 'NET', 'TENB', 'QLYS'],
    valueChain: {
      upstream: [
        {
          id: 'threat-intelligence',
          name: 'Threat Intelligence & Research',
          description: 'Cyber threat research, vulnerability discovery, and intelligence gathering.',
          companies: ['CRWD', 'PANW', 'FTNT'],
        },
        {
          id: 'security-hardware',
          name: 'Security Hardware & Infrastructure',
          description: 'Physical security appliances, firewalls, and network security hardware.',
          companies: ['PANW', 'FTNT', 'CSCO'],
        },
      ],
      midstream: [
        {
          id: 'endpoint-security',
          name: 'Endpoint Security',
          description: 'Endpoint detection and response, antivirus, and device protection.',
          companies: ['CRWD', 'S', 'PANW', 'MSFT'],
        },
        {
          id: 'network-security',
          name: 'Network Security',
          description: 'Firewalls, intrusion detection/prevention, and network monitoring.',
          companies: ['PANW', 'FTNT', 'ZS', 'CSCO'],
        },
        {
          id: 'identity-access',
          name: 'Identity & Access Management',
          description: 'Identity verification, access control, and authentication services.',
          companies: ['OKTA', 'CYBR', 'MSFT'],
        },
      ],
      downstream: [
        {
          id: 'cloud-security',
          name: 'Cloud Security',
          description: 'Security solutions for cloud infrastructure, applications, and data.',
          companies: ['ZS', 'CRWD', 'PANW', 'OKTA'],
        },
        {
          id: 'security-services',
          name: 'Security Services & Consulting',
          description: 'Managed security services, consulting, and incident response.',
          companies: ['PANW', 'CRWD', 'IBM'],
        },
      ],
    },
  },
  {
    id: 'software-saas',
    name: 'Software & SaaS',
    slug: 'software-saas',
    description: 'Enterprise software and SaaS platforms',
    color: 'bg-indigo-500',
    icon: '📊',
    subcategories: ['Enterprise Software', 'Collaboration', 'Analytics', 'DevOps'],
    featured_companies: ['MSFT', 'CRM', 'ADBE', 'NOW', 'TEAM', 'WDAY', 'SNOW', 'DDOG', 'ZM', 'DOCU', 'HUBS', 'ZI', 'BILL', 'VEEV'],
    valueChain: {
      upstream: [
        {
          id: 'development-tools',
          name: 'Development Tools & Platforms',
          description: 'Software development tools, IDEs, and platforms for building applications.',
          companies: ['MSFT', 'TEAM', 'GTLB'],
        },
      ],
      midstream: [
        {
          id: 'enterprise-apps',
          name: 'Enterprise Applications',
          description: 'CRM, ERP, HCM, and other business-critical applications.',
          companies: ['CRM', 'MSFT', 'ORCL', 'SAP', 'WDAY'],
        },
        {
          id: 'collaboration',
          name: 'Collaboration & Productivity',
          description: 'Communication, collaboration, and productivity software.',
          companies: ['MSFT', 'ZM', 'TEAM', 'DOCU', 'WORK'],
        },
        {
          id: 'analytics',
          name: 'Analytics & Business Intelligence',
          description: 'Data analytics, business intelligence, and visualization tools.',
          companies: ['SNOW', 'DDOG', 'SPLK', 'DOMO'],
        },
      ],
      downstream: [
        {
          id: 'vertical-saas',
          name: 'Vertical SaaS',
          description: 'Industry-specific software solutions.',
          companies: ['VEEV', 'HUBS', 'BILL', 'ZI'],
        },
        {
          id: 'integration',
          name: 'Integration & Automation',
          description: 'Integration platforms and workflow automation tools.',
          companies: ['MDB', 'CFLT', 'PLTR'],
        },
      ],
    },
  },
  {
    id: 'electric-vehicles',
    name: 'Electric Vehicles',
    slug: 'electric-vehicles',
    description: 'EV manufacturers, batteries, and charging infrastructure',
    color: 'bg-green-500',
    icon: '🚗',
    subcategories: ['Manufacturers', 'Batteries', 'Charging', 'Components'],
    featured_companies: ['TSLA', 'RIVN', 'LCID', 'F', 'GM', 'NIO', 'XPEV', 'LI', 'CHPT', 'BLNK', 'EVGO', 'ALB', 'SQM', 'LAC', 'APTV', 'LEA'],
    valueChain: {
      upstream: [
        {
          id: 'raw-materials',
          name: 'Raw Materials & Mining',
          description: 'Mining and processing of critical materials for EV batteries including lithium, cobalt, nickel, and rare earth elements. These materials are essential for battery production and electric motors.',
          companies: ['ALB', 'SQM', 'LAC', 'LTHM', 'MP'],
        },
        {
          id: 'battery-materials',
          name: 'Battery Materials & Components',
          description: 'Production of refined battery materials such as cathode materials, anode materials, electrolytes, and separators. These are the building blocks for lithium-ion batteries.',
          companies: ['ALB', 'SQM'],
        },
      ],
      midstream: [
        {
          id: 'battery-manufacturing',
          name: 'Battery Cell & Pack Manufacturing',
          description: 'Manufacturing of battery cells and assembling them into battery packs. This includes cell production, battery management systems (BMS), and thermal management solutions.',
          subcategories: [
            {
              id: 'battery-cells',
              name: 'Battery Cells',
              description: 'Production of individual lithium-ion battery cells in various formats (cylindrical, prismatic, pouch).',
              companies: ['TSLA', 'PANW'],
            },
            {
              id: 'battery-packs',
              name: 'Battery Packs & BMS',
              description: 'Assembly of cells into complete battery packs with battery management systems for safety and performance.',
              companies: ['TSLA'],
            },
          ],
          companies: ['TSLA', 'PANW', 'QS'],
        },
        {
          id: 'ev-components',
          name: 'EV Components & Systems',
          description: 'Manufacturing of key EV components including electric motors, power electronics, inverters, and onboard chargers.',
          subcategories: [
            {
              id: 'electric-motors',
              name: 'Electric Motors & Drivetrains',
              description: 'Production of electric motors and drivetrain systems that power electric vehicles.',
              companies: [],
            },
            {
              id: 'power-electronics',
              name: 'Power Electronics & Inverters',
              description: 'Manufacturing of power electronics, inverters, and DC-DC converters for EV power management.',
              companies: ['ON', 'NXPI'],
            },
          ],
          companies: ['APTV', 'LEA', 'BWA'],
        },
      ],
      downstream: [
        {
          id: 'vehicle-manufacturing',
          name: 'Vehicle Manufacturing & Assembly',
          description: 'Final assembly of electric vehicles including both pure EV manufacturers and traditional automakers producing electric models.',
          subcategories: [
            {
              id: 'pure-ev',
              name: 'Pure EV Manufacturers',
              description: 'Companies focused exclusively on electric vehicle production.',
              companies: ['TSLA', 'RIVN', 'LCID', 'NIO', 'XPEV', 'LI'],
            },
            {
              id: 'traditional-oems',
              name: 'Traditional OEMs',
              description: 'Legacy automakers transitioning to electric vehicle production.',
              companies: ['F', 'GM', 'TM', 'STLA'],
            },
          ],
          companies: ['TSLA', 'RIVN', 'LCID', 'F', 'GM', 'NIO', 'XPEV', 'LI'],
        },
        {
          id: 'charging-infrastructure',
          name: 'Charging Infrastructure',
          description: 'Development and operation of EV charging networks, including home chargers, public charging stations, and fast-charging networks.',
          companies: ['CHPT', 'BLNK', 'EVGO', 'TSLA'],
        },
        {
          id: 'sales-service',
          name: 'Sales, Service & Software',
          description: 'Vehicle sales, after-sales service, software updates, and autonomous driving technology development.',
          companies: ['TSLA', 'RIVN'],
        },
      ],
    },
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy',
    slug: 'solar-energy',
    description: 'Solar panels, inverters, and installation',
    color: 'bg-yellow-500',
    icon: '☀️',
    subcategories: ['Solar Panels', 'Inverters', 'Installation', 'Storage'],
    featured_companies: ['ENPH', 'SEDG', 'FSLR', 'RUN', 'NOVA', 'MAXN', 'CSIQ', 'DQ', 'JKS', 'SPWR'],
    valueChain: {
      upstream: [
        {
          id: 'polysilicon',
          name: 'Polysilicon Production',
          description: 'Manufacturing of high-purity polysilicon, the primary raw material for solar cells.',
          companies: ['DQ', 'GCL'],
        },
        {
          id: 'wafer-production',
          name: 'Solar Wafer Production',
          description: 'Slicing polysilicon into thin wafers for solar cell manufacturing.',
          companies: ['JKS', 'CSIQ'],
        },
      ],
      midstream: [
        {
          id: 'solar-cells',
          name: 'Solar Cell Manufacturing',
          description: 'Converting silicon wafers into photovoltaic cells that generate electricity.',
          companies: ['FSLR', 'CSIQ', 'JKS', 'SPWR'],
        },
        {
          id: 'solar-panels',
          name: 'Solar Panel Assembly',
          description: 'Assembling solar cells into complete photovoltaic modules.',
          companies: ['FSLR', 'CSIQ', 'JKS', 'MAXN', 'SPWR'],
        },
        {
          id: 'inverters',
          name: 'Inverters & Power Electronics',
          description: 'Converting DC power from solar panels to AC power for grid connection.',
          companies: ['ENPH', 'SEDG', 'FSLR'],
        },
      ],
      downstream: [
        {
          id: 'residential-install',
          name: 'Residential Installation',
          description: 'Residential solar installation and financing services.',
          companies: ['RUN', 'NOVA', 'SPWR'],
        },
        {
          id: 'commercial-utility',
          name: 'Commercial & Utility Scale',
          description: 'Large-scale solar projects for commercial and utility applications.',
          companies: ['FSLR', 'NEE', 'AES'],
        },
      ],
    },
  },
  {
    id: 'energy-storage',
    name: 'Energy Storage',
    slug: 'energy-storage',
    description: 'Battery technology and energy storage systems',
    color: 'bg-amber-500',
    icon: '🔋',
    subcategories: ['Battery Tech', 'Grid Storage', 'Materials', 'Management Systems'],
    featured_companies: ['TSLA', 'ENPH', 'BE', 'QS', 'CHPT', 'ALB', 'STEM', 'FCEL', 'PLUG', 'BLDP'],
    valueChain: {
      upstream: [
        {
          id: 'battery-materials-storage',
          name: 'Battery Materials',
          description: 'Lithium, cobalt, nickel, and other materials for energy storage batteries.',
          companies: ['ALB', 'SQM', 'LAC'],
        },
      ],
      midstream: [
        {
          id: 'battery-cells-storage',
          name: 'Battery Cell Technology',
          description: 'Development and manufacturing of battery cells for energy storage.',
          companies: ['TSLA', 'QS', 'PLUG'],
        },
        {
          id: 'energy-systems',
          name: 'Energy Storage Systems',
          description: 'Complete energy storage systems including batteries, inverters, and management software.',
          companies: ['TSLA', 'ENPH', 'BE', 'STEM'],
        },
      ],
      downstream: [
        {
          id: 'residential-storage',
          name: 'Residential Storage',
          description: 'Home battery systems for solar and backup power.',
          companies: ['TSLA', 'ENPH', 'SEDG'],
        },
        {
          id: 'grid-storage',
          name: 'Grid-Scale Storage',
          description: 'Utility-scale energy storage for grid stabilization and renewable integration.',
          companies: ['TSLA', 'BE', 'STEM', 'NEE'],
        },
      ],
    },
  },
  {
    id: 'pharmaceuticals',
    name: 'Pharmaceuticals',
    slug: 'pharmaceuticals',
    description: 'Drug discovery, development, and manufacturing',
    color: 'bg-teal-500',
    icon: '💊',
    subcategories: ['Drug Development', 'Manufacturing', 'Research', 'Distribution'],
    featured_companies: ['JNJ', 'PFE', 'ABBV', 'MRK', 'LLY', 'BMY', 'AMGN', 'GILD', 'AZN', 'NVO', 'RHHBY', 'GSK', 'SNY'],
    valueChain: {
      upstream: [
        {
          id: 'drug-discovery',
          name: 'Drug Discovery & Research',
          description: 'Basic research, target identification, and early-stage drug discovery.',
          companies: ['PFE', 'JNJ', 'MRK', 'LLY', 'AZN'],
        },
        {
          id: 'clinical-trials',
          name: 'Clinical Development',
          description: 'Clinical trials and regulatory approval processes.',
          companies: ['PFE', 'MRK', 'LLY', 'ABBV', 'BMY'],
        },
      ],
      midstream: [
        {
          id: 'drug-manufacturing',
          name: 'Drug Manufacturing',
          description: 'Large-scale pharmaceutical manufacturing and quality control.',
          companies: ['JNJ', 'PFE', 'MRK', 'LLY', 'ABBV'],
        },
        {
          id: 'api-production',
          name: 'API Production',
          description: 'Active pharmaceutical ingredient production.',
          companies: ['PFE', 'TEVA', 'MYL'],
        },
      ],
      downstream: [
        {
          id: 'distribution',
          name: 'Distribution & Logistics',
          description: 'Pharmaceutical distribution, wholesaling, and cold chain logistics.',
          companies: ['MCK', 'ABC', 'CAH'],
        },
        {
          id: 'pharmacy-retail',
          name: 'Pharmacy & Retail',
          description: 'Retail pharmacies and direct-to-consumer channels.',
          companies: ['CVS', 'WBA', 'CI'],
        },
      ],
    },
  },
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    slug: 'biotechnology',
    description: 'Gene therapy, diagnostics, and research tools',
    color: 'bg-cyan-500',
    icon: '🧬',
    subcategories: ['Gene Therapy', 'Diagnostics', 'Research Tools', 'CRISPR'],
    featured_companies: ['GILD', 'AMGN', 'VRTX', 'REGN', 'BIIB', 'ILMN', 'MRNA', 'CRSP', 'NTLA', 'BEAM', 'EXAS', 'INCY', 'ALNY'],
    valueChain: {
      upstream: [
        {
          id: 'research-tools',
          name: 'Research Tools & Instruments',
          description: 'Laboratory equipment, genomic sequencing, and research tools.',
          companies: ['ILMN', 'TMO', 'DHR', 'A'],
        },
        {
          id: 'gene-editing',
          name: 'Gene Editing Technology',
          description: 'CRISPR and other gene editing platforms.',
          companies: ['CRSP', 'NTLA', 'BEAM', 'EDIT'],
        },
      ],
      midstream: [
        {
          id: 'therapeutics-dev',
          name: 'Therapeutics Development',
          description: 'Development of biologics, gene therapies, and novel treatments.',
          companies: ['GILD', 'AMGN', 'VRTX', 'REGN', 'BIIB', 'MRNA'],
        },
        {
          id: 'diagnostics-dev',
          name: 'Molecular Diagnostics',
          description: 'Genetic testing, cancer diagnostics, and precision medicine.',
          companies: ['ILMN', 'EXAS', 'MYGN', 'QGEN'],
        },
      ],
      downstream: [
        {
          id: 'commercialization',
          name: 'Commercialization',
          description: 'Marketing and distribution of biotech therapies.',
          companies: ['GILD', 'AMGN', 'VRTX', 'REGN'],
        },
        {
          id: 'cdmo',
          name: 'CDMO Services',
          description: 'Contract development and manufacturing for biologics.',
          companies: ['LH', 'DGX'],
        },
      ],
    },
  },
  {
    id: 'medical-devices',
    name: 'Medical Devices',
    slug: 'medical-devices',
    description: 'Medical equipment, diagnostics, and wearables',
    color: 'bg-blue-400',
    icon: '🏥',
    subcategories: ['Equipment', 'Diagnostics', 'Wearables', 'Surgical'],
    featured_companies: ['MDT', 'ABT', 'TMO', 'DHR', 'ISRG', 'SYK', 'BSX', 'EW', 'ZBH', 'BAX', 'BDX', 'HOLX', 'ALGN', 'DXCM', 'PODD'],
    valueChain: {
      upstream: [
        {
          id: 'components',
          name: 'Device Components & Materials',
          description: 'Medical-grade materials, sensors, and electronic components.',
          companies: ['TE', 'APH'],
        },
      ],
      midstream: [
        {
          id: 'device-manufacturing',
          name: 'Device Manufacturing',
          description: 'Manufacturing of medical devices, implants, and equipment.',
          companies: ['MDT', 'ABT', 'ISRG', 'SYK', 'BSX', 'EW', 'ZBH'],
        },
        {
          id: 'diagnostic-equipment',
          name: 'Diagnostic Equipment',
          description: 'Imaging systems, lab equipment, and diagnostic devices.',
          companies: ['TMO', 'DHR', 'HOLX', 'IQV'],
        },
        {
          id: 'wearables',
          name: 'Wearable Devices',
          description: 'Continuous glucose monitors, insulin pumps, and health wearables.',
          companies: ['DXCM', 'PODD', 'AAPL'],
        },
      ],
      downstream: [
        {
          id: 'distribution-sales',
          name: 'Distribution & Sales',
          description: 'Medical device distribution to hospitals and clinics.',
          companies: ['CAH', 'MCK', 'OWENS'],
        },
        {
          id: 'service-support',
          name: 'Service & Support',
          description: 'Installation, maintenance, and technical support for medical devices.',
          companies: ['MDT', 'ISRG', 'SYK'],
        },
      ],
    },
  },
  {
    id: 'digital-health',
    name: 'Digital Health',
    slug: 'digital-health',
    description: 'Telemedicine, health tech, and AI diagnostics',
    color: 'bg-emerald-500',
    icon: '📱',
    subcategories: ['Telemedicine', 'Health Records', 'AI Diagnostics', 'Remote Monitoring'],
    featured_companies: ['TDOC', 'VEEV', 'DXCM', 'HIMS', 'DOCS', 'LFST', 'ONEM', 'PHR', 'CALM'],
    valueChain: {
      upstream: [
        {
          id: 'health-data',
          name: 'Health Data & Infrastructure',
          description: 'Electronic health records, data management, and health IT infrastructure.',
          companies: ['VEEV', 'CERN', 'HCAT'],
        },
      ],
      midstream: [
        {
          id: 'telehealth-platforms',
          name: 'Telehealth Platforms',
          description: 'Virtual care platforms and telemedicine services.',
          companies: ['TDOC', 'AMWL', 'DOCS', 'ONEM'],
        },
        {
          id: 'remote-monitoring',
          name: 'Remote Patient Monitoring',
          description: 'Connected devices and monitoring systems for chronic disease management.',
          companies: ['DXCM', 'PODD', 'LIVN'],
        },
      ],
      downstream: [
        {
          id: 'direct-consumer',
          name: 'Direct-to-Consumer Health',
          description: 'Digital health apps, mental health, and consumer wellness.',
          companies: ['HIMS', 'LFST', 'CALM', 'PHR'],
        },
        {
          id: 'analytics',
          name: 'Health Analytics & AI',
          description: 'AI-powered diagnostics, predictive analytics, and clinical decision support.',
          companies: ['VEEV', 'ILMN', 'EXAS'],
        },
      ],
    },
  },
  {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    slug: 'aerospace-defense',
    description: 'Aircraft, defense systems, and space technology',
    color: 'bg-slate-600',
    icon: '✈️',
    subcategories: ['Commercial Aviation', 'Defense', 'Space', 'Components'],
    featured_companies: ['BA', 'LMT', 'RTX', 'NOC', 'GD', 'HWM', 'LHX', 'TDG', 'HEI', 'TXT', 'SPR'],
    valueChain: {
      upstream: [
        {
          id: 'raw-materials-aero',
          name: 'Raw Materials & Alloys',
          description: 'Specialized metals, composites, and materials for aerospace applications.',
          companies: ['ATI', 'HWM'],
        },
        {
          id: 'components-parts',
          name: 'Components & Parts',
          description: 'Engines, avionics, landing gear, and aircraft components.',
          companies: ['TDG', 'HEI', 'SPR', 'CW'],
        },
      ],
      midstream: [
        {
          id: 'aircraft-manufacturing',
          name: 'Aircraft Manufacturing',
          description: 'Commercial and military aircraft production.',
          companies: ['BA', 'LMT', 'NOC', 'TXT'],
        },
        {
          id: 'defense-systems',
          name: 'Defense Systems',
          description: 'Missiles, radar systems, and defense electronics.',
          companies: ['LMT', 'RTX', 'NOC', 'GD', 'LHX'],
        },
      ],
      downstream: [
        {
          id: 'airlines',
          name: 'Airlines & Operators',
          description: 'Commercial airlines and aircraft operators.',
          companies: ['DAL', 'UAL', 'AAL', 'LUV'],
        },
        {
          id: 'mro',
          name: 'Maintenance, Repair & Overhaul',
          description: 'Aircraft maintenance and support services.',
          companies: ['HEI', 'TDG', 'SPR'],
        },
      ],
    },
  },
  {
    id: 'space',
    name: 'Space Technology',
    slug: 'space-technology',
    description: 'Launch services, satellites, and ground systems',
    color: 'bg-violet-600',
    icon: '🚀',
    subcategories: ['Launch Services', 'Satellites', 'Ground Systems', 'Space Tourism'],
    featured_companies: ['RKLB', 'ASTS', 'SPCE', 'PL', 'LMT', 'NOC', 'BA'],
    valueChain: {
      upstream: [
        {
          id: 'components-space',
          name: 'Satellite Components',
          description: 'Satellite components, sensors, and propulsion systems.',
          companies: ['LMT', 'NOC', 'BA'],
        },
      ],
      midstream: [
        {
          id: 'satellite-manufacturing',
          name: 'Satellite Manufacturing',
          description: 'Design and manufacturing of satellites and space systems.',
          companies: ['LMT', 'NOC', 'BA', 'ASTS', 'PL'],
        },
        {
          id: 'launch-services',
          name: 'Launch Services',
          description: 'Rocket manufacturing and launch operations.',
          companies: ['RKLB', 'BA', 'LMT'],
        },
      ],
      downstream: [
        {
          id: 'satellite-operations',
          name: 'Satellite Operations',
          description: 'Satellite communications, Earth observation, and space services.',
          companies: ['ASTS', 'PL', 'MAXAR'],
        },
        {
          id: 'ground-systems',
          name: 'Ground Systems & Services',
          description: 'Ground stations, data processing, and space operations.',
          companies: ['LMT', 'NOC'],
        },
      ],
    },
  },
  {
    id: 'fintech',
    name: 'Financial Technology',
    slug: 'fintech',
    description: 'Payments, banking tech, and blockchain',
    color: 'bg-green-600',
    icon: '💳',
    subcategories: ['Payments', 'Banking Tech', 'Blockchain', 'InsurTech'],
    featured_companies: ['V', 'MA', 'PYPL', 'SQ', 'COIN', 'HOOD', 'AFRM', 'SOFI', 'UPST', 'NU', 'ADYEN', 'FIS', 'FISV', 'GPN'],
    valueChain: {
      upstream: [
        {
          id: 'payment-networks',
          name: 'Payment Networks',
          description: 'Global payment processing networks and infrastructure.',
          companies: ['V', 'MA', 'AXP'],
        },
        {
          id: 'blockchain-infrastructure',
          name: 'Blockchain Infrastructure',
          description: 'Blockchain networks, protocols, and cryptocurrency infrastructure.',
          companies: ['COIN', 'MARA', 'RIOT'],
        },
      ],
      midstream: [
        {
          id: 'payment-processors',
          name: 'Payment Processors',
          description: 'Payment processing, merchant services, and POS systems.',
          companies: ['PYPL', 'SQ', 'ADYEN', 'FIS', 'FISV', 'GPN'],
        },
        {
          id: 'digital-banking',
          name: 'Digital Banking',
          description: 'Neobanks, digital lending, and online banking platforms.',
          companies: ['SOFI', 'NU', 'UPST', 'LC', 'AFRM'],
        },
      ],
      downstream: [
        {
          id: 'consumer-apps',
          name: 'Consumer Financial Apps',
          description: 'Investment apps, trading platforms, and personal finance tools.',
          companies: ['HOOD', 'COIN', 'SQ', 'SOFI'],
        },
        {
          id: 'b2b-fintech',
          name: 'B2B Fintech Solutions',
          description: 'Business payments, expense management, and financial software.',
          companies: ['BILL', 'AXP', 'FI', 'FOUR'],
        },
      ],
    },
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    slug: 'ecommerce',
    description: 'Online retail platforms and marketplaces',
    color: 'bg-orange-500',
    icon: '🛒',
    subcategories: ['Marketplaces', 'Direct-to-Consumer', 'B2B', 'Logistics'],
    featured_companies: ['AMZN', 'SHOP', 'EBAY', 'ETSY', 'W', 'CHWY', 'CVNA', 'BABA', 'MELI', 'SE', 'BKNG', 'ABNB'],
    valueChain: {
      upstream: [
        {
          id: 'ecommerce-platforms',
          name: 'E-commerce Platforms',
          description: 'Platform software and infrastructure for online stores.',
          companies: ['SHOP', 'BIGC', 'WIX'],
        },
        {
          id: 'payment-gateway',
          name: 'Payment & Checkout',
          description: 'Payment gateways and checkout solutions for e-commerce.',
          companies: ['PYPL', 'SQ', 'ADYEN', 'SHOP'],
        },
      ],
      midstream: [
        {
          id: 'marketplaces',
          name: 'Online Marketplaces',
          description: 'Third-party marketplaces connecting buyers and sellers.',
          companies: ['AMZN', 'EBAY', 'ETSY', 'MELI', 'SE'],
        },
        {
          id: 'dtc-retail',
          name: 'Direct-to-Consumer Retail',
          description: 'Vertical e-commerce and direct-to-consumer brands.',
          companies: ['W', 'CHWY', 'CVNA', 'FTCH'],
        },
      ],
      downstream: [
        {
          id: 'fulfillment',
          name: 'Fulfillment & Logistics',
          description: 'Warehousing, fulfillment centers, and last-mile delivery.',
          companies: ['AMZN', 'FDX', 'UPS', 'XPO'],
        },
        {
          id: 'travel-booking',
          name: 'Travel & Hospitality',
          description: 'Online travel agencies and hospitality marketplaces.',
          companies: ['BKNG', 'ABNB', 'EXPE'],
        },
      ],
    },
  },
  {
    id: 'robotics',
    name: 'Robotics & Automation',
    slug: 'robotics-automation',
    description: 'Industrial robotics, automation, and AI systems',
    color: 'bg-gray-600',
    icon: '🦾',
    subcategories: ['Industrial Robots', 'Automation', 'Warehouse', 'Surgical Robots'],
    featured_companies: ['ISRG', 'ROK', 'EMR', 'ABB', 'TER', 'FANUY', 'IRBT', 'SSYS', 'DDD', 'NNDM'],
    valueChain: {
      upstream: [
        {
          id: 'sensors-actuators',
          name: 'Sensors & Actuators',
          description: 'Sensors, actuators, and motion control components for robotics.',
          companies: ['ROK', 'EMR', 'HON'],
        },
        {
          id: 'ai-vision',
          name: 'AI & Computer Vision',
          description: 'Machine vision, AI algorithms, and autonomous navigation.',
          companies: ['NVDA', 'GOOGL'],
        },
      ],
      midstream: [
        {
          id: 'industrial-robots',
          name: 'Industrial Robotics',
          description: 'Manufacturing robots, cobots, and industrial automation systems.',
          companies: ['ROK', 'EMR', 'ABB', 'FANUY'],
        },
        {
          id: 'surgical-robots',
          name: 'Surgical Robotics',
          description: 'Robot-assisted surgical systems and medical robotics.',
          companies: ['ISRG', 'STAA', 'OMCL'],
        },
        {
          id: '3d-printing',
          name: '3D Printing & Additive Manufacturing',
          description: 'Industrial 3D printers and additive manufacturing systems.',
          companies: ['SSYS', 'DDD', 'NNDM', 'MTLS'],
        },
      ],
      downstream: [
        {
          id: 'warehouse-automation',
          name: 'Warehouse Automation',
          description: 'Automated warehousing, picking systems, and logistics robots.',
          companies: ['AMZN', 'TER'],
        },
        {
          id: 'service-robots',
          name: 'Service Robots',
          description: 'Consumer and commercial service robots.',
          companies: ['IRBT', 'MBLY'],
        },
      ],
    },
  },
  {
    id: 'data-centers',
    name: 'Data Centers',
    slug: 'data-centers',
    description: 'Data center REITs, infrastructure, and cooling',
    color: 'bg-zinc-600',
    icon: '🏢',
    subcategories: ['REITs', 'Infrastructure', 'Cooling', 'Power'],
    featured_companies: ['EQIX', 'DLR', 'CCI', 'AMT', 'CONE', 'SBAC', 'VRT', 'QTS'],
    valueChain: {
      upstream: [
        {
          id: 'power-infrastructure',
          name: 'Power Infrastructure',
          description: 'Power generation, UPS systems, and backup power for data centers.',
          companies: ['NEE', 'DUK', 'SO'],
        },
        {
          id: 'cooling-systems',
          name: 'Cooling Systems',
          description: 'HVAC, liquid cooling, and thermal management systems.',
          companies: ['CARR', 'JCI'],
        },
      ],
      midstream: [
        {
          id: 'data-center-infrastructure',
          name: 'Data Center Infrastructure',
          description: 'Servers, storage systems, networking equipment for data centers.',
          companies: ['DELL', 'HPE', 'NTAP', 'PSTG'],
        },
        {
          id: 'colocation-reits',
          name: 'Colocation & Data Center REITs',
          description: 'Data center facilities and colocation services.',
          companies: ['EQIX', 'DLR', 'VRT', 'QTS'],
        },
      ],
      downstream: [
        {
          id: 'hyperscale',
          name: 'Hyperscale Data Centers',
          description: 'Massive data centers for cloud providers.',
          companies: ['AMZN', 'MSFT', 'GOOGL', 'META'],
        },
        {
          id: 'edge-computing',
          name: 'Edge Computing',
          description: 'Edge data centers and distributed computing infrastructure.',
          companies: ['EQIX', 'DLR', 'CCI', 'AMT'],
        },
      ],
    },
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    slug: 'telecommunications',
    description: '5G networks, infrastructure, and services',
    color: 'bg-pink-500',
    icon: '📡',
    subcategories: ['5G Infrastructure', 'Carriers', 'Equipment', 'Fiber'],
    featured_companies: ['VZ', 'T', 'TMUS', 'NOK', 'ERIC', 'CSCO', 'ANET', 'JNPR', 'AMT', 'CCI', 'SBAC'],
    valueChain: {
      upstream: [
        {
          id: 'network-equipment',
          name: 'Network Equipment',
          description: '5G equipment, base stations, and radio access networks.',
          companies: ['NOK', 'ERIC', 'CSCO', 'JNPR'],
        },
        {
          id: 'tower-infrastructure',
          name: 'Tower Infrastructure',
          description: 'Cell towers, small cells, and wireless infrastructure.',
          companies: ['AMT', 'CCI', 'SBAC', 'CONE'],
        },
      ],
      midstream: [
        {
          id: 'carriers',
          name: 'Wireless Carriers',
          description: 'Mobile network operators providing wireless services.',
          companies: ['VZ', 'T', 'TMUS'],
        },
        {
          id: 'fiber-networks',
          name: 'Fiber Networks',
          description: 'Fiber optic networks and broadband infrastructure.',
          companies: ['VZ', 'T', 'LUMN', 'FTR'],
        },
      ],
      downstream: [
        {
          id: 'consumer-services',
          name: 'Consumer Services',
          description: 'Wireless plans, broadband, and consumer telecommunications.',
          companies: ['VZ', 'T', 'TMUS', 'CHTR', 'CMCSA'],
        },
        {
          id: 'enterprise-solutions',
          name: 'Enterprise Solutions',
          description: 'Business communications, networking, and IoT services.',
          companies: ['CSCO', 'ANET', 'T', 'VZ'],
        },
      ],
    },
  },
  {
    id: 'agtech',
    name: 'Agriculture Technology',
    slug: 'agtech',
    description: 'Precision agriculture, biotech, and equipment',
    color: 'bg-lime-600',
    icon: '🌾',
    subcategories: ['Precision Ag', 'Biotech', 'Equipment', 'Vertical Farming'],
    featured_companies: ['DE', 'AGCO', 'CTVA', 'FMC', 'NTR', 'MOS', 'CF', 'IPI', 'SMG'],
    valueChain: {
      upstream: [
        {
          id: 'seeds-biotech',
          name: 'Seeds & Agricultural Biotech',
          description: 'Genetically modified seeds, crop protection, and agricultural biotechnology.',
          companies: ['CTVA', 'FMC', 'SMG'],
        },
        {
          id: 'fertilizers',
          name: 'Fertilizers & Nutrients',
          description: 'Nitrogen, phosphate, and potash fertilizers.',
          companies: ['NTR', 'MOS', 'CF', 'IPI'],
        },
      ],
      midstream: [
        {
          id: 'ag-equipment',
          name: 'Agricultural Equipment',
          description: 'Tractors, combines, and farming machinery.',
          companies: ['DE', 'AGCO', 'CNHI'],
        },
        {
          id: 'precision-ag',
          name: 'Precision Agriculture',
          description: 'GPS guidance, sensors, drones, and farm management software.',
          companies: ['DE', 'AGCO', 'TTC'],
        },
      ],
      downstream: [
        {
          id: 'farming-services',
          name: 'Farming Services',
          description: 'Contract farming, crop management, and agricultural services.',
          companies: ['ADM', 'BG'],
        },
        {
          id: 'food-processing',
          name: 'Food Processing & Distribution',
          description: 'Agricultural product processing and distribution.',
          companies: ['ADM', 'BG', 'TSN', 'HRL'],
        },
      ],
    },
  },
  {
    id: 'banking',
    name: 'Banking & Financial Services',
    slug: 'banking',
    description: 'Commercial banks, investment banks, and financial services',
    color: 'bg-emerald-600',
    icon: '🏦',
    subcategories: ['Commercial Banking', 'Investment Banking', 'Wealth Management', 'Payment Services'],
    featured_companies: ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'USB', 'PNC', 'TFC', 'SCHW', 'BK', 'STT', 'NTRS', 'CFG'],
    valueChain: {
      upstream: [
        {
          id: 'core-banking-tech',
          name: 'Core Banking Technology',
          description: 'Banking software platforms, core processing systems, and financial infrastructure.',
          companies: ['FIS', 'FISV', 'JACK', 'INTU'],
        },
        {
          id: 'financial-data',
          name: 'Financial Data & Analytics',
          description: 'Market data, credit ratings, and financial analytics providers.',
          companies: ['SPGI', 'MCO', 'MSCI', 'FACT'],
        },
      ],
      midstream: [
        {
          id: 'commercial-banking',
          name: 'Commercial Banking',
          description: 'Deposit accounts, business lending, and commercial banking services.',
          companies: ['JPM', 'BAC', 'WFC', 'C', 'USB', 'PNC', 'TFC', 'CFG'],
        },
        {
          id: 'investment-banking',
          name: 'Investment Banking & Capital Markets',
          description: 'Underwriting, M&A advisory, and capital markets services.',
          companies: ['JPM', 'GS', 'MS', 'C', 'BAC'],
        },
        {
          id: 'wealth-management',
          name: 'Wealth Management & Asset Custody',
          description: 'Private banking, wealth advisory, and asset custody services.',
          companies: ['MS', 'SCHW', 'BK', 'STT', 'NTRS', 'JPM'],
        },
      ],
      downstream: [
        {
          id: 'retail-banking',
          name: 'Retail Banking',
          description: 'Consumer checking, savings, mortgages, and personal loans.',
          companies: ['JPM', 'BAC', 'WFC', 'USB', 'PNC', 'TFC'],
        },
        {
          id: 'credit-cards',
          name: 'Credit Card Services',
          description: 'Credit card issuance and consumer credit.',
          companies: ['JPM', 'BAC', 'C', 'AXP', 'DFS', 'COF'],
        },
      ],
    },
  },
  {
    id: 'insurance',
    name: 'Insurance',
    slug: 'insurance',
    description: 'Life, property & casualty, and health insurance',
    color: 'bg-blue-700',
    icon: '🛡️',
    subcategories: ['Life Insurance', 'P&C Insurance', 'Health Insurance', 'Reinsurance'],
    featured_companies: ['BRK.B', 'UNH', 'PGR', 'CB', 'TRV', 'ALL', 'MET', 'PRU', 'AIG', 'AFL', 'AJG', 'MMC', 'AON', 'WTW'],
    valueChain: {
      upstream: [
        {
          id: 'reinsurance',
          name: 'Reinsurance',
          description: 'Insurance for insurance companies to manage risk.',
          companies: ['BRK.B', 'RE'],
        },
        {
          id: 'actuarial-data',
          name: 'Actuarial & Risk Analytics',
          description: 'Risk modeling, actuarial services, and insurance analytics.',
          companies: ['VRSK', 'AON', 'MMC'],
        },
      ],
      midstream: [
        {
          id: 'life-insurance',
          name: 'Life & Annuity Insurance',
          description: 'Life insurance, annuities, and retirement products.',
          companies: ['MET', 'PRU', 'AFL', 'LNC', 'GL'],
        },
        {
          id: 'pc-insurance',
          name: 'Property & Casualty Insurance',
          description: 'Auto, home, and commercial property insurance.',
          companies: ['BRK.B', 'PGR', 'CB', 'TRV', 'ALL', 'AIG', 'HIG'],
        },
        {
          id: 'health-insurance',
          name: 'Health Insurance',
          description: 'Medical insurance and managed care.',
          companies: ['UNH', 'ELV', 'CVS', 'CI', 'HUM', 'CNC'],
        },
      ],
      downstream: [
        {
          id: 'insurance-brokers',
          name: 'Insurance Brokers & Agents',
          description: 'Insurance brokerage and distribution services.',
          companies: ['AJG', 'MMC', 'AON', 'WTW', 'BRO'],
        },
        {
          id: 'claims-processing',
          name: 'Claims Processing & Management',
          description: 'Claims administration and third-party administrators.',
          companies: ['UNH', 'CVS', 'ELV'],
        },
      ],
    },
  },
  {
    id: 'asset-management',
    name: 'Asset Management & Investments',
    slug: 'asset-management',
    description: 'Investment funds, asset managers, and exchanges',
    color: 'bg-purple-700',
    icon: '📈',
    subcategories: ['Asset Managers', 'Exchanges', 'Index Providers', 'Alternative Investments'],
    featured_companies: ['BLK', 'TROW', 'BEN', 'IVZ', 'NDAQ', 'ICE', 'CME', 'CBOE', 'KKR', 'BX', 'APO', 'CG', 'ARES'],
    valueChain: {
      upstream: [
        {
          id: 'market-infrastructure',
          name: 'Market Infrastructure & Exchanges',
          description: 'Stock exchanges, futures exchanges, and trading platforms.',
          companies: ['NDAQ', 'ICE', 'CME', 'CBOE'],
        },
        {
          id: 'index-data',
          name: 'Index Providers & Market Data',
          description: 'Financial indices, benchmarks, and market data services.',
          companies: ['SPGI', 'MSCI', 'NDAQ', 'ICE'],
        },
      ],
      midstream: [
        {
          id: 'traditional-asset-mgmt',
          name: 'Traditional Asset Management',
          description: 'Institutional and traditional asset management (no ETFs).',
          companies: ['BLK', 'TROW', 'BEN', 'IVZ', 'SCHW'],
        },
        {
          id: 'alternative-investments',
          name: 'Alternative Asset Management',
          description: 'Private equity, hedge funds, and alternative investments.',
          companies: ['KKR', 'BX', 'APO', 'CG', 'ARES', 'BLK'],
        },
      ],
      downstream: [
        {
          id: 'distribution',
          name: 'Fund Distribution',
          description: 'Distribution platforms and financial advisors.',
          companies: ['SCHW', 'MS', 'TROW'],
        },
        {
          id: 'investor-services',
          name: 'Investor Services',
          description: 'Custody, fund administration, and investor services.',
          companies: ['BK', 'STT', 'NTRS'],
        },
      ],
    },
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    slug: 'real-estate',
    description: 'Commercial & residential real estate, REITs',
    color: 'bg-stone-600',
    icon: '🏢',
    subcategories: ['Residential', 'Commercial', 'Industrial', 'REITs'],
    featured_companies: ['PLD', 'AMT', 'CCI', 'EQIX', 'PSA', 'SPG', 'O', 'WELL', 'DLR', 'AVB', 'EQR', 'VTR', 'ARE', 'MAA'],
    valueChain: {
      upstream: [
        {
          id: 'land-acquisition',
          name: 'Land Acquisition & Development',
          description: 'Land purchase, entitlements, and site development.',
          companies: ['LEN', 'DHI', 'PHM'],
        },
        {
          id: 'construction',
          name: 'Construction & Building',
          description: 'Commercial and residential construction.',
          companies: ['LEN', 'DHI', 'PHM', 'TOL'],
        },
      ],
      midstream: [
        {
          id: 'residential-reits',
          name: 'Residential REITs',
          description: 'Apartment buildings, single-family rentals, and manufactured housing.',
          companies: ['AVB', 'EQR', 'MAA', 'ESS', 'UDR', 'CPT'],
        },
        {
          id: 'commercial-reits',
          name: 'Commercial REITs',
          description: 'Office buildings, retail centers, and mixed-use properties.',
          companies: ['SPG', 'O', 'REG', 'KIM', 'BXP'],
        },
        {
          id: 'specialized-reits',
          name: 'Specialized REITs',
          description: 'Healthcare, industrial, data centers, and infrastructure REITs.',
          companies: ['PLD', 'WELL', 'VTR', 'AMT', 'CCI', 'EQIX', 'DLR', 'PSA', 'ARE'],
        },
      ],
      downstream: [
        {
          id: 'property-management',
          name: 'Property Management',
          description: 'Property leasing, management, and tenant services.',
          companies: ['CBRE', 'JLL'],
        },
        {
          id: 'real-estate-services',
          name: 'Real Estate Services',
          description: 'Brokerage, appraisal, and transaction services.',
          companies: ['CBRE', 'JLL', 'Z', 'RDFN'],
        },
      ],
    },
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    slug: 'oil-gas',
    description: 'Exploration, production, refining, and distribution',
    color: 'bg-slate-700',
    icon: '⛽',
    subcategories: ['E&P', 'Integrated', 'Refining', 'Services'],
    featured_companies: ['XOM', 'CVX', 'COP', 'EOG', 'SLB', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL', 'BKR', 'DVN', 'FANG', 'HES', 'MRO'],
    valueChain: {
      upstream: [
        {
          id: 'exploration',
          name: 'Exploration & Production (E&P)',
          description: 'Oil and gas exploration, drilling, and production.',
          companies: ['XOM', 'CVX', 'COP', 'EOG', 'OXY', 'DVN', 'FANG', 'HES', 'MRO'],
        },
        {
          id: 'oilfield-services',
          name: 'Oilfield Services & Equipment',
          description: 'Drilling services, equipment, and field services.',
          companies: ['SLB', 'HAL', 'BKR', 'NOV', 'FTI'],
        },
      ],
      midstream: [
        {
          id: 'pipelines',
          name: 'Pipelines & Midstream',
          description: 'Oil and gas transportation, storage, and processing.',
          companies: ['ET', 'WMB', 'OKE', 'KMI', 'EPD'],
        },
        {
          id: 'refining',
          name: 'Refining & Processing',
          description: 'Crude oil refining and petrochemical processing.',
          companies: ['MPC', 'PSX', 'VLO', 'XOM', 'CVX'],
        },
      ],
      downstream: [
        {
          id: 'marketing-distribution',
          name: 'Marketing & Distribution',
          description: 'Fuel distribution, gas stations, and retail petroleum.',
          companies: ['XOM', 'CVX', 'MPC', 'PSX', 'VLO'],
        },
        {
          id: 'petrochemicals',
          name: 'Petrochemicals',
          description: 'Chemical products derived from petroleum.',
          companies: ['LYB', 'DOW', 'XOM', 'CVX'],
        },
      ],
    },
  },
  {
    id: 'mining-materials',
    name: 'Mining & Materials',
    slug: 'mining-materials',
    description: 'Mining, metals, and industrial materials',
    color: 'bg-amber-700',
    icon: '⛏️',
    subcategories: ['Mining', 'Metals', 'Industrial Materials', 'Packaging'],
    featured_companies: ['NEM', 'FCX', 'NUE', 'STLD', 'RS', 'VMC', 'MLM', 'APD', 'LIN', 'ECL', 'DD', 'DOW', 'PPG', 'SHW', 'BALL'],
    valueChain: {
      upstream: [
        {
          id: 'mining-extraction',
          name: 'Mining & Extraction',
          description: 'Gold, copper, iron ore, and other mineral mining.',
          companies: ['NEM', 'FCX', 'GOLD', 'AA'],
        },
        {
          id: 'industrial-gases',
          name: 'Industrial Gases',
          description: 'Oxygen, nitrogen, hydrogen, and specialty gases.',
          companies: ['APD', 'LIN'],
        },
      ],
      midstream: [
        {
          id: 'metals-production',
          name: 'Metals & Steel Production',
          description: 'Steel mills, aluminum smelting, and metal fabrication.',
          companies: ['NUE', 'STLD', 'RS', 'AA', 'X'],
        },
        {
          id: 'chemicals-specialty',
          name: 'Chemicals & Specialty Materials',
          description: 'Industrial chemicals, coatings, and specialty materials.',
          companies: ['DD', 'DOW', 'PPG', 'SHW', 'ECL', 'LYB'],
        },
        {
          id: 'construction-materials',
          name: 'Construction Materials',
          description: 'Cement, aggregates, and construction materials.',
          companies: ['VMC', 'MLM', 'MTX'],
        },
      ],
      downstream: [
        {
          id: 'packaging-materials',
          name: 'Packaging Materials',
          description: 'Metal, glass, and paper packaging products.',
          companies: ['BALL', 'AVY', 'PKG', 'IP'],
        },
        {
          id: 'industrial-distribution',
          name: 'Industrial Distribution',
          description: 'Distribution of metals, materials, and industrial supplies.',
          companies: ['MSM', 'GWW', 'FAST'],
        },
      ],
    },
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    slug: 'chemicals',
    description: 'Specialty chemicals, agricultural chemicals, and industrial chemistry',
    color: 'bg-violet-500',
    icon: '🧪',
    subcategories: ['Specialty Chemicals', 'Agricultural Chemicals', 'Industrial Chemicals'],
    featured_companies: ['DD', 'DOW', 'LYB', 'PPG', 'SHW', 'ECL', 'APD', 'LIN', 'ALB', 'FMC', 'CTVA', 'CE', 'EMN'],
    valueChain: {
      upstream: [
        {
          id: 'raw-materials-chem',
          name: 'Raw Materials & Feedstock',
          description: 'Petrochemicals, minerals, and chemical feedstock.',
          companies: ['DOW', 'LYB', 'XOM', 'CVX'],
        },
      ],
      midstream: [
        {
          id: 'basic-chemicals',
          name: 'Basic Chemicals',
          description: 'Commodity chemicals, polymers, and industrial chemicals.',
          companies: ['DOW', 'LYB', 'DD', 'CE', 'EMN'],
        },
        {
          id: 'specialty-chemicals',
          name: 'Specialty Chemicals',
          description: 'High-performance chemicals, coatings, and additives.',
          companies: ['PPG', 'SHW', 'ECL', 'ALB', 'APD', 'LIN'],
        },
        {
          id: 'agricultural-chemicals',
          name: 'Agricultural Chemicals',
          description: 'Fertilizers, pesticides, and crop protection products.',
          companies: ['CTVA', 'FMC', 'NTR', 'MOS', 'CF'],
        },
      ],
      downstream: [
        {
          id: 'applications',
          name: 'Applications & End Markets',
          description: 'Chemical products for automotive, construction, and consumer goods.',
          companies: ['PPG', 'SHW', 'ECL', 'ALB'],
        },
      ],
    },
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    slug: 'food-beverage',
    description: 'Food production, beverages, and consumer packaged goods',
    color: 'bg-orange-600',
    icon: '🍔',
    subcategories: ['Food Manufacturing', 'Beverages', 'Packaged Foods', 'Restaurants'],
    featured_companies: ['PEP', 'KO', 'MDLZ', 'GIS', 'K', 'HSY', 'CAG', 'CPB', 'MKC', 'SJM', 'HRL', 'TSN', 'TAP', 'STZ', 'MCD', 'SBUX', 'YUM', 'CMG'],
    valueChain: {
      upstream: [
        {
          id: 'agriculture-sourcing',
          name: 'Agricultural Sourcing',
          description: 'Sourcing grains, produce, meat, and raw ingredients.',
          companies: ['ADM', 'BG', 'TSN'],
        },
        {
          id: 'ingredients',
          name: 'Ingredients & Processing',
          description: 'Food ingredients, flavors, sweeteners, and processing.',
          companies: ['ADM', 'BG', 'IFF', 'CHD'],
        },
      ],
      midstream: [
        {
          id: 'food-manufacturing',
          name: 'Food Manufacturing',
          description: 'Packaged foods, snacks, and food products manufacturing.',
          companies: ['PEP', 'MDLZ', 'GIS', 'K', 'CAG', 'CPB', 'MKC', 'SJM', 'HRL', 'TSN'],
        },
        {
          id: 'beverages',
          name: 'Beverages',
          description: 'Soft drinks, alcoholic beverages, and specialty drinks.',
          companies: ['KO', 'PEP', 'TAP', 'STZ', 'MNST', 'CELH'],
        },
        {
          id: 'confectionery',
          name: 'Confectionery & Snacks',
          description: 'Chocolate, candy, and snack foods.',
          companies: ['HSY', 'MDLZ', 'K', 'GIS'],
        },
      ],
      downstream: [
        {
          id: 'retail-distribution',
          name: 'Retail Distribution',
          description: 'Grocery stores, supermarkets, and food retail.',
          companies: ['KR', 'WMT', 'TGT', 'COST'],
        },
        {
          id: 'restaurants',
          name: 'Restaurants & Food Service',
          description: 'Quick service, casual dining, and food service.',
          companies: ['MCD', 'SBUX', 'YUM', 'CMG', 'QSR', 'DPZ'],
        },
      ],
    },
  },
  {
    id: 'consumer-products',
    name: 'Consumer Products',
    slug: 'consumer-products',
    description: 'Household goods, personal care, and consumer staples',
    color: 'bg-pink-600',
    icon: '🧴',
    subcategories: ['Personal Care', 'Household Products', 'Tobacco'],
    featured_companies: ['PG', 'KMB', 'CL', 'CLX', 'CHD', 'EL', 'PEP', 'KO', 'PM', 'MO', 'NWL', 'SJM'],
    valueChain: {
      upstream: [
        {
          id: 'raw-materials-consumer',
          name: 'Raw Materials & Ingredients',
          description: 'Chemicals, fragrances, and raw materials for consumer products.',
          companies: ['IFF', 'FMC'],
        },
      ],
      midstream: [
        {
          id: 'personal-care',
          name: 'Personal Care Products',
          description: 'Skincare, cosmetics, hair care, and personal hygiene.',
          companies: ['PG', 'EL', 'CL', 'CHD', 'KMB'],
        },
        {
          id: 'household-products',
          name: 'Household Products',
          description: 'Cleaning products, paper goods, and household items.',
          companies: ['PG', 'KMB', 'CL', 'CLX', 'CHD'],
        },
        {
          id: 'tobacco',
          name: 'Tobacco Products',
          description: 'Cigarettes, vaping, and tobacco products.',
          companies: ['PM', 'MO', 'BTI'],
        },
      ],
      downstream: [
        {
          id: 'retail',
          name: 'Retail & Distribution',
          description: 'Mass merchandisers, drugstores, and online retail.',
          companies: ['WMT', 'TGT', 'COST', 'AMZN', 'WBA', 'CVS'],
        },
      ],
    },
  },
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Traditional automotive manufacturing and parts',
    color: 'bg-red-600',
    icon: '🚙',
    subcategories: ['Auto Manufacturers', 'Auto Parts', 'Tires', 'Dealers'],
    featured_companies: ['TM', 'F', 'GM', 'STLA', 'HMC', 'APTV', 'LEA', 'BWA', 'DLPH', 'ALV', 'GT', 'AN', 'PAG', 'LAD'],
    valueChain: {
      upstream: [
        {
          id: 'auto-parts-suppliers',
          name: 'Auto Parts & Components',
          description: 'Tier 1 and tier 2 automotive suppliers.',
          companies: ['APTV', 'LEA', 'BWA', 'DLPH', 'ALV'],
        },
        {
          id: 'tires',
          name: 'Tires',
          description: 'Tire manufacturing for passenger and commercial vehicles.',
          companies: ['GT', 'BRBR'],
        },
      ],
      midstream: [
        {
          id: 'auto-manufacturing',
          name: 'Vehicle Manufacturing',
          description: 'Traditional internal combustion and hybrid vehicle manufacturing.',
          companies: ['TM', 'F', 'GM', 'STLA', 'HMC'],
        },
      ],
      downstream: [
        {
          id: 'dealers',
          name: 'Auto Dealers & Retail',
          description: 'New and used car dealerships.',
          companies: ['AN', 'PAG', 'LAD', 'SAH'],
        },
        {
          id: 'aftermarket',
          name: 'Aftermarket & Parts',
          description: 'Auto parts retail, repair, and aftermarket services.',
          companies: ['AAP', 'AZO', 'ORLY'],
        },
      ],
    },
  },
  {
    id: 'retail',
    name: 'Retail',
    slug: 'retail',
    description: 'Department stores, specialty retail, and discount stores',
    color: 'bg-fuchsia-500',
    icon: '🛍️',
    subcategories: ['Department Stores', 'Specialty Retail', 'Discount Stores', 'Apparel'],
    featured_companies: ['WMT', 'COST', 'TGT', 'HD', 'LOW', 'TJX', 'DG', 'DLTR', 'ROST', 'BBY', 'ULTA', 'DKS', 'GPS', 'M'],
    valueChain: {
      upstream: [
        {
          id: 'sourcing-manufacturing',
          name: 'Sourcing & Manufacturing',
          description: 'Global sourcing, private label manufacturing, and imports.',
          companies: ['TJX', 'ROST', 'GPS'],
        },
      ],
      midstream: [
        {
          id: 'discount-retail',
          name: 'Discount & Mass Merchandise',
          description: 'Warehouse clubs, discount stores, and mass merchandisers.',
          companies: ['WMT', 'COST', 'TGT', 'DG', 'DLTR'],
        },
        {
          id: 'specialty-retail',
          name: 'Specialty Retail',
          description: 'Home improvement, electronics, beauty, and sporting goods.',
          companies: ['HD', 'LOW', 'BBY', 'ULTA', 'DKS'],
        },
        {
          id: 'apparel-retail',
          name: 'Apparel & Fashion Retail',
          description: 'Clothing retailers, department stores, and off-price stores.',
          companies: ['TJX', 'ROST', 'GPS', 'M', 'JWN'],
        },
      ],
      downstream: [
        {
          id: 'omnichannel',
          name: 'Omnichannel & E-commerce',
          description: 'Online shopping, mobile apps, and delivery services.',
          companies: ['WMT', 'TGT', 'HD', 'LOW', 'BBY'],
        },
      ],
    },
  },
  {
    id: 'media-entertainment',
    name: 'Media & Entertainment',
    slug: 'media-entertainment',
    description: 'Streaming, traditional media, gaming, and content',
    color: 'bg-rose-500',
    icon: '🎬',
    subcategories: ['Streaming', 'Traditional Media', 'Gaming', 'Social Media'],
    featured_companies: ['DIS', 'NFLX', 'META', 'GOOGL', 'CMCSA', 'WBD', 'PARA', 'LYV', 'SPOT', 'EA', 'TTWO', 'RBLX', 'MTCH', 'PINS'],
    valueChain: {
      upstream: [
        {
          id: 'content-production',
          name: 'Content Production',
          description: 'Film studios, TV production, music production, and content creation.',
          companies: ['DIS', 'NFLX', 'CMCSA', 'WBD', 'PARA', 'LYV'],
        },
        {
          id: 'game-development',
          name: 'Game Development',
          description: 'Video game development and publishing.',
          companies: ['EA', 'TTWO', 'RBLX', 'ATVI'],
        },
      ],
      midstream: [
        {
          id: 'streaming-platforms',
          name: 'Streaming Platforms',
          description: 'Video streaming, music streaming, and digital content platforms.',
          companies: ['NFLX', 'DIS', 'GOOGL', 'SPOT', 'WBD', 'PARA'],
        },
        {
          id: 'social-media',
          name: 'Social Media & Platforms',
          description: 'Social networks, user-generated content, and online communities.',
          companies: ['META', 'GOOGL', 'SNAP', 'PINS', 'RDDT'],
        },
        {
          id: 'traditional-media',
          name: 'Traditional Media',
          description: 'Cable TV, broadcast networks, and traditional media.',
          companies: ['CMCSA', 'DIS', 'WBD', 'PARA', 'FOXA'],
        },
      ],
      downstream: [
        {
          id: 'advertising',
          name: 'Digital Advertising',
          description: 'Ad platforms, ad tech, and programmatic advertising.',
          companies: ['GOOGL', 'META', 'AMZN', 'TTD', 'MGNI'],
        },
        {
          id: 'live-entertainment',
          name: 'Live Entertainment & Events',
          description: 'Concerts, sports, and live events.',
          companies: ['LYV', 'MSGS', 'MSGE'],
        },
      ],
    },
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Travel',
    slug: 'hospitality',
    description: 'Hotels, resorts, casinos, and travel services',
    color: 'bg-cyan-600',
    icon: '🏨',
    subcategories: ['Hotels', 'Casinos', 'Cruise Lines', 'Travel Services'],
    featured_companies: ['MAR', 'HLT', 'H', 'IHG', 'BKNG', 'ABNB', 'EXPE', 'MGM', 'WYNN', 'LVS', 'CZR', 'RCL', 'CCL', 'NCLH'],
    valueChain: {
      upstream: [
        {
          id: 'property-development-hosp',
          name: 'Property Development',
          description: 'Hotel, casino, and resort development and construction.',
          companies: ['MAR', 'HLT', 'MGM', 'WYNN', 'LVS'],
        },
      ],
      midstream: [
        {
          id: 'hotels-resorts',
          name: 'Hotels & Resorts',
          description: 'Hotel chains, resorts, and lodging properties.',
          companies: ['MAR', 'HLT', 'H', 'IHG', 'WH'],
        },
        {
          id: 'casinos-gaming',
          name: 'Casinos & Gaming',
          description: 'Casino resorts and gaming operations.',
          companies: ['MGM', 'WYNN', 'LVS', 'CZR', 'PENN'],
        },
        {
          id: 'cruise-lines',
          name: 'Cruise Lines',
          description: 'Ocean cruises and cruise vacation operators.',
          companies: ['RCL', 'CCL', 'NCLH'],
        },
      ],
      downstream: [
        {
          id: 'online-travel',
          name: 'Online Travel Agencies',
          description: 'Travel booking platforms and aggregators.',
          companies: ['BKNG', 'EXPE', 'ABNB', 'TRIP'],
        },
        {
          id: 'travel-services',
          name: 'Travel Services',
          description: 'Corporate travel, loyalty programs, and travel services.',
          companies: ['BKNG', 'EXPE', 'UBER', 'LYFT'],
        },
      ],
    },
  },
  {
    id: 'utilities',
    name: 'Utilities',
    slug: 'utilities',
    description: 'Electric power, natural gas, and water utilities',
    color: 'bg-yellow-600',
    icon: '⚡',
    subcategories: ['Electric Utilities', 'Gas Utilities', 'Renewables', 'Water'],
    featured_companies: ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'XEL', 'PCG', 'ED', 'ETR', 'ES', 'FE', 'AWK', 'ATO'],
    valueChain: {
      upstream: [
        {
          id: 'power-generation',
          name: 'Power Generation',
          description: 'Electricity generation from coal, natural gas, nuclear, and renewables.',
          companies: ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC'],
        },
        {
          id: 'renewable-generation',
          name: 'Renewable Power Generation',
          description: 'Solar, wind, and hydroelectric power generation.',
          companies: ['NEE', 'AES', 'NRG'],
        },
      ],
      midstream: [
        {
          id: 'transmission',
          name: 'Transmission & Distribution',
          description: 'Power transmission lines and distribution networks.',
          companies: ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'XEL'],
        },
        {
          id: 'gas-utilities',
          name: 'Natural Gas Utilities',
          description: 'Natural gas distribution and storage.',
          companies: ['SRE', 'D', 'ATO', 'NI', 'SR'],
        },
      ],
      downstream: [
        {
          id: 'retail-electric',
          name: 'Retail Electric Service',
          description: 'Electricity retail to residential and commercial customers.',
          companies: ['NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'PCG', 'ED'],
        },
        {
          id: 'water-utilities',
          name: 'Water Utilities',
          description: 'Water and wastewater treatment and distribution.',
          companies: ['AWK', 'WTR', 'SJW'],
        },
      ],
    },
  },
  {
    id: 'transportation-logistics',
    name: 'Transportation & Logistics',
    slug: 'transportation-logistics',
    description: 'Freight, shipping, airlines, and logistics',
    color: 'bg-indigo-600',
    icon: '🚚',
    subcategories: ['Freight', 'Airlines', 'Railroads', 'Logistics'],
    featured_companies: ['UPS', 'FDX', 'UNP', 'NSC', 'CSX', 'ODFL', 'JBHT', 'CHRW', 'EXPD', 'XPO', 'DAL', 'UAL', 'AAL', 'LUV', 'ALK'],
    valueChain: {
      upstream: [
        {
          id: 'transportation-equipment',
          name: 'Transportation Equipment',
          description: 'Trucks, railcars, aircraft, and shipping containers.',
          companies: ['PCAR', 'CAT', 'BA'],
        },
      ],
      midstream: [
        {
          id: 'freight-trucking',
          name: 'Freight & Trucking',
          description: 'Less-than-truckload, truckload, and freight forwarding.',
          companies: ['UPS', 'FDX', 'ODFL', 'JBHT', 'CHRW', 'EXPD', 'XPO'],
        },
        {
          id: 'railroads',
          name: 'Railroads',
          description: 'Freight rail transportation and logistics.',
          companies: ['UNP', 'NSC', 'CSX', 'CP', 'CNI'],
        },
        {
          id: 'airlines-passenger',
          name: 'Passenger Airlines',
          description: 'Commercial passenger air transportation.',
          companies: ['DAL', 'UAL', 'AAL', 'LUV', 'ALK', 'JBLU'],
        },
      ],
      downstream: [
        {
          id: 'last-mile',
          name: 'Last-Mile Delivery',
          description: 'Package delivery, courier services, and express shipping.',
          companies: ['UPS', 'FDX', 'AMZN'],
        },
        {
          id: '3pl-logistics',
          name: '3PL & Logistics Services',
          description: 'Third-party logistics, warehousing, and supply chain management.',
          companies: ['CHRW', 'EXPD', 'XPO', 'GXO'],
        },
      ],
    },
  },
  {
    id: 'construction-engineering',
    name: 'Construction & Engineering',
    slug: 'construction-engineering',
    description: 'Construction, engineering services, and building materials',
    color: 'bg-orange-700',
    icon: '🏗️',
    subcategories: ['Engineering Services', 'Construction', 'Building Products', 'HVAC'],
    featured_companies: ['CAT', 'DE', 'VMC', 'MLM', 'CARR', 'JCI', 'FAST', 'PWR', 'MTZ', 'BLD', 'OC', 'MAS', 'SWK', 'BLDR'],
    valueChain: {
      upstream: [
        {
          id: 'engineering-design',
          name: 'Engineering & Design',
          description: 'Engineering consulting, design services, and project planning.',
          companies: ['AECOM', 'JEC'],
        },
        {
          id: 'construction-equipment',
          name: 'Construction Equipment',
          description: 'Heavy machinery, excavators, and construction equipment.',
          companies: ['CAT', 'DE', 'CMI'],
        },
      ],
      midstream: [
        {
          id: 'construction-services',
          name: 'Construction & Contracting',
          description: 'General contractors, construction management, and project execution.',
          companies: ['PWR', 'MTZ', 'FLR'],
        },
        {
          id: 'building-products',
          name: 'Building Products',
          description: 'Roofing, siding, insulation, and building materials.',
          companies: ['OC', 'MAS', 'BLD', 'AZEK'],
        },
        {
          id: 'hvac-building-systems',
          name: 'HVAC & Building Systems',
          description: 'Heating, ventilation, air conditioning, and building controls.',
          companies: ['CARR', 'JCI', 'TT', 'GNRC'],
        },
      ],
      downstream: [
        {
          id: 'facilities-management',
          name: 'Facilities Management',
          description: 'Building maintenance, facilities services, and property management.',
          companies: ['ABM', 'CBRE'],
        },
        {
          id: 'industrial-distribution-const',
          name: 'Industrial Distribution',
          description: 'Tools, fasteners, and industrial supply distribution.',
          companies: ['FAST', 'SWK', 'GWW', 'MSM'],
        },
      ],
    },
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find(ind => ind.slug === slug)
}

export function getIndustriesByIds(ids: string[]): Industry[] {
  return industries.filter(ind => ids.includes(ind.id))
}
