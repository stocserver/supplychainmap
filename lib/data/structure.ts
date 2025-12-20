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
    }[]
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
    tags?: string[]
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
    valueChain?: ValueChain
    // Optional product-centric chain (pilot for selected industries)
    productValueChain?: ValueChainStageProducts[]
    // Featured companies for this industry (tickers)
    featured_companies?: string[]
}

export const industriesStructure: Industry[] = [
    {
        id: 'semiconductors',
        name: 'Semiconductors',
        slug: 'semiconductors',
        description: 'Chip design, manufacturing, and equipment',
        color: 'bg-blue-500',
        icon: '💾',
        subcategories: ['Chip Design', 'Fab Equipment', 'Manufacturing', 'Materials'],
        valueChain: {
            upstream: [
                {
                    id: 'ip-design',
                    name: 'IP Design / IC Design Services',
                    description: 'Intellectual property design and IC design services provide foundational building blocks and design expertise. IP designers create reusable circuit designs, while IC design service companies help fabless companies develop custom chips.',
                    products: ['ARM Architecture', 'RISC-V Cores', 'GPU IP Blocks', 'Interface IP', 'Memory Controllers', 'EDA Software'],
                },
                {
                    id: 'ic-design',
                    name: 'IC Design (Fabless)',
                    description: 'Fabless semiconductor companies focus on chip design and marketing without owning manufacturing facilities. These companies design chips for various applications including GPUs, CPUs, mobile processors, and specialized AI accelerators.',
                    products: ['GPU Designs', 'CPU Designs', 'Mobile SoCs', 'AI Accelerators', 'Automotive Chips', 'Analog ICs', 'Power Management ICs', 'RF Chips'],
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
                        },
                        {
                            id: 'photomasks',
                            name: 'Photomasks',
                            description: 'Photomasks are precision quartz plates containing circuit patterns used in the lithography process to transfer designs onto silicon wafers.',
                            products: ['Reticles', 'Advanced Photomasks', 'EUV Masks'],
                        },
                        {
                            id: 'chemicals',
                            name: 'Chemicals & Materials',
                            description: 'Specialty chemicals and materials used in semiconductor manufacturing, including photoresists, etchants, cleaning chemicals, and ultra-pure gases.',
                            products: ['Photoresists', 'Etchants', 'CMP Slurries', 'Ultra-Pure Gases', 'Silicon Wafers', 'Specialty Chemicals'],
                        },
                    ],
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
                        },
                        {
                            id: 'substrates',
                            name: 'Substrates',
                            description: 'Advanced packaging substrates provide the foundation for mounting and connecting semiconductor dies, enabling high-performance multi-chip packages.',
                            products: ['IC Substrates', 'Interposers', 'Organic Substrates', 'Ceramic Substrates'],
                        },
                        {
                            id: 'lead-frames',
                            name: 'Lead Frames',
                            description: 'Metal structures that provide electrical connections and mechanical support for semiconductor packages.',
                            products: ['Copper Lead Frames', 'Alloy Lead Frames', 'Etched Lead Frames'],
                        },
                    ],
                },
                {
                    id: 'ic-modules',
                    name: 'IC Modules & Integration',
                    description: 'Multiple chips are integrated into modules or systems for specific applications, such as memory modules, processor modules, or complete system-on-modules.',
                    products: ['Memory Modules (DRAM/NAND)', 'SSD Controllers', 'Processor Modules', 'Camera Modules', 'RF Modules', 'Power Modules'],
                },
                {
                    id: 'distribution',
                    name: 'IC Distribution',
                    description: 'Semiconductor distributors connect chip manufacturers with end customers, providing inventory management, logistics, and technical support to electronics manufacturers worldwide.',
                    products: ['To Smartphones', 'To PCs & Servers', 'To Automotive', 'To Data Centers', 'To IoT Devices', 'To Consumer Electronics'],
                },
            ],
        },
    },
    // ... (Previous industries: ai-ml, cloud-computing, cybersecurity, software-saas, electric-vehicles, solar-energy, energy-storage, pharmaceuticals, biotechnology, medical-devices, digital-health)
    // Note: I am rewriting the file to ensure the abbreviated list above isn't actual code in the file.

    // RESTORING MISSING INDUSTRIES
    {
        id: 'banking',
        name: 'Banking',
        slug: 'banking',
        description: 'Commercial, investment, and retail banking services',
        color: 'bg-emerald-600',
        icon: '🏦',
        subcategories: ['Commercial Banking', 'Investment Banking', 'Wealth Management', 'Payments'],
    },
    {
        id: 'oil-gas',
        name: 'Oil & Gas',
        slug: 'oil-gas',
        description: 'Exploration, production, and refining of petroleum',
        color: 'bg-stone-600',
        icon: '🛢️',
        subcategories: ['Upstream', 'Midstream', 'Downstream', 'Services'],
    },
    {
        id: 'automotive',
        name: 'Automotive',
        slug: 'automotive',
        description: 'Vehicle manufacturing and parts',
        color: 'bg-red-600',
        icon: '🚙',
        subcategories: ['OEMs', 'Parts Suppliers', 'Dealers', 'Mobility'],
    },
    {
        id: 'retail',
        name: 'Retail',
        slug: 'retail',
        description: 'Consumer retail and commerce',
        color: 'bg-orange-500',
        icon: '🛍️',
        subcategories: ['E-commerce', 'Brick & Mortar', 'Luxury', 'Discount'],
    },
    {
        id: 'telecommunications',
        name: 'Telecommunications',
        slug: 'telecommunications',
        description: 'Wireless, wireline, and infrastructure',
        color: 'bg-blue-600',
        icon: '📡',
        subcategories: ['Carriers', 'Infrastructure', 'Equipment', 'Services'],
    },
    {
        id: 'aerospace-defense',
        name: 'Aerospace & Defense',
        slug: 'aerospace-defense',
        description: 'Aircraft, defense systems, and space',
        color: 'bg-slate-600',
        icon: '✈️',
        subcategories: ['Commercial Aviation', 'Defense', 'Space', 'systems'],
    },
    {
        id: 'insurance',
        name: 'Insurance',
        slug: 'insurance',
        description: 'Life, property, and casualty insurance',
        color: 'bg-indigo-600',
        icon: '🛡️',
        subcategories: ['Life & Health', 'Property & Casualty', 'Reinsurance', 'Brokers'],
    },
    {
        id: 'media-entertainment',
        name: 'Media & Entertainment',
        slug: 'media-entertainment',
        description: 'Content creation, broadcasting, and streaming',
        color: 'bg-purple-600',
        icon: '🎬',
        subcategories: ['Studios', 'Streaming', 'Gaming', 'Music'],
    },
    {
        id: 'utilities',
        name: 'Utilities',
        slug: 'utilities',
        description: 'Electric, gas, and water utilities',
        color: 'bg-yellow-600',
        icon: '💡',
        subcategories: ['Electric', 'Gas', 'Water', 'Renewables'],
    },
    {
        id: 'fintech',
        name: 'FinTech',
        slug: 'fintech',
        description: 'Financial technology and payments',
        color: 'bg-cyan-600',
        icon: '💳',
        subcategories: ['Payments', 'Lending', 'Blockchain', 'Personal Finance'],
    },
    {
        id: 'ecommerce',
        name: 'E-Commerce',
        slug: 'ecommerce',
        description: 'Online retail and marketplaces',
        color: 'bg-orange-600',
        icon: '🛒',
        subcategories: ['Marketplaces', 'DTC', 'Logistics', 'Platforms'],
    },
    {
        id: 'real-estate',
        name: 'Real Estate',
        slug: 'real-estate',
        description: 'Property development, REITs, and services',
        color: 'bg-emerald-700',
        icon: '🏢',
        subcategories: ['Residential', 'Commercial', 'REITs', 'Services'],
    },
    {
        id: 'asset-management',
        name: 'Asset Management',
        slug: 'asset-management',
        description: 'Investment management and private equity',
        color: 'bg-green-700',
        icon: '📈',
        subcategories: ['Asset Managers', 'Private Equity', 'Wealth Tech', 'Exchanges'],
    },
    {
        id: 'chemicals',
        name: 'Chemicals',
        slug: 'chemicals',
        description: 'Specialty and commodity chemicals',
        color: 'bg-teal-600',
        icon: '⚗️',
        subcategories: ['Specialty', 'Commodity', 'Agricultural', 'Industrial'],
    },
    {
        id: 'food-beverage',
        name: 'Food & Beverage',
        slug: 'food-beverage',
        description: 'Food production, processing, and distribution',
        color: 'bg-amber-600',
        icon: '🍔',
        subcategories: ['Packaged Food', 'Beverages', 'Restaurants', 'Ingredients'],
    },
    {
        id: 'robotics-automation',
        name: 'Robotics & Automation',
        slug: 'robotics-automation',
        description: 'Industrial robotics and automations systems',
        color: 'bg-zinc-500',
        icon: '🦾',
        subcategories: ['Industrial', 'Service', 'Vision Systems', 'Components'],
    },
    {
        id: 'transportation-logistics',
        name: 'Transportation & Logistics',
        slug: 'transportation-logistics',
        description: 'Shipping, rail, trucking, and logistics',
        color: 'bg-blue-800',
        icon: '🚛',
        subcategories: ['Rail', 'Trucking', 'Marine', 'Logistics'],
    },
    {
        id: 'space-technology',
        name: 'Space Technology',
        slug: 'space-technology',
        description: 'Space exploration, satellites, and launch services',
        color: 'bg-slate-800',
        icon: '🚀',
        subcategories: ['Launch Services', 'Satellites', 'Exploration', 'Infrastructure'],
    },
    {
        id: 'mining-materials',
        name: 'Mining & Materials',
        slug: 'mining-materials',
        description: 'Metals, mining, and basic materials',
        color: 'bg-stone-500',
        icon: '⛏️',
        subcategories: ['Precious Metals', 'Industrial Metals', 'Materials', 'Processing'],
    },
    {
        id: 'consumer-products',
        name: 'Consumer Products',
        slug: 'consumer-products',
        description: 'Household goods and personal care',
        color: 'bg-rose-500',
        icon: '🧴',
        subcategories: ['Personal Care', 'Household', 'Apparel', 'Durables'],
    },
    {
        id: 'hospitality',
        name: 'Hospitality',
        slug: 'hospitality',
        description: 'Hotels, travel, and leisure',
        color: 'bg-orange-400',
        icon: '🏨',
        subcategories: ['Hotels', 'Travel Agencies', 'Cruises', 'Casinos'],
    },
    {
        id: 'construction-engineering',
        name: 'Construction & Engineering',
        slug: 'construction-engineering',
        description: 'Infrastructure and building construction',
        color: 'bg-neutral-600',
        icon: '🏗️',
        subcategories: ['Infrastructure', 'Residential', 'Commercial', 'Services'],
    },
    {
        id: 'agtech',
        name: 'AgTech',
        slug: 'agtech',
        description: 'Agricultural technology and innovation',
        color: 'bg-lime-600',
        icon: '🌾',
        subcategories: ['Precision Ag', 'Biotech', 'Equipment', 'Vertical Farming'],
    },
    // Adding back the other ones I missed in the "Adding back" comment above using the original data I DO have
    {
        id: 'ai-ml',
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'AI platforms, machine learning, and infrastructure',
        color: 'bg-purple-500',
        icon: '🤖',
        subcategories: ['AI Platforms', 'ML Infrastructure', 'AI Chips', 'Applications'],
    },
    {
        id: 'cloud-computing',
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Cloud infrastructure, platforms, and services',
        color: 'bg-sky-500',
        icon: '☁️',
        subcategories: ['Infrastructure', 'Platforms', 'Data Centers', 'Edge Computing'],
    },
    {
        id: 'data-centers',
        name: 'Data Centers',
        slug: 'data-centers',
        description: 'Colocation, hyperscale, and edge data centers',
        color: 'bg-indigo-500',
        icon: '🏢',
        subcategories: ['Colocation', 'Hyperscale', 'Edge', 'Services'],
        valueChain: {
            upstream: [
                {
                    id: 'data-center-equipment',
                    name: 'Data Center Equipment',
                    description: 'Power, cooling, and security equipment for data centers.',
                },
            ],
            midstream: [
                {
                    id: 'data-center-operators',
                    name: 'Data Center Operators',
                    description: 'Owners and operators of data center facilities.',
                },
            ],
            downstream: [
                {
                    id: 'data-center-services',
                    name: 'Data Center Services',
                    description: 'Managed services, interconnection, and remote hands.',
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
    },
    {
        id: 'software-saas',
        name: 'Software & SaaS',
        slug: 'software-saas',
        description: 'Enterprise software and SaaS platforms',
        color: 'bg-indigo-500',
        icon: '📊',
        subcategories: ['Enterprise Software', 'Collaboration', 'Analytics', 'DevOps'],
    },
    {
        id: 'electric-vehicles',
        name: 'Electric Vehicles',
        slug: 'electric-vehicles',
        description: 'EV manufacturers, batteries, and charging infrastructure',
        color: 'bg-green-500',
        icon: '🚗',
        subcategories: ['Manufacturers', 'Batteries', 'Charging', 'Components'],
        valueChain: {
            upstream: [
                {
                    id: 'raw-materials',
                    name: 'Raw Materials & Mining',
                    description: 'Mining and processing of critical materials for EV batteries including lithium, cobalt, nickel, and rare earth elements. These materials are essential for battery production and electric motors.',
                },
                {
                    id: 'battery-materials',
                    name: 'Battery Materials & Components',
                    description: 'Production of refined battery materials such as cathode materials, anode materials, electrolytes, and separators. These are the building blocks for lithium-ion batteries.',
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
                        },
                        {
                            id: 'battery-packs',
                            name: 'Battery Packs & BMS',
                            description: 'Assembly of cells into complete battery packs with battery management systems for safety and performance.',
                        },
                    ],
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
                        },
                        {
                            id: 'power-electronics',
                            name: 'Power Electronics & Inverters',
                            description: 'Manufacturing of power electronics, inverters, and DC-DC converters for EV power management.',
                        },
                    ],
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
                        },
                        {
                            id: 'traditional-oems',
                            name: 'Traditional OEMs',
                            description: 'Legacy automakers transitioning to electric vehicle production.',
                        },
                    ],
                },
                {
                    id: 'charging-infrastructure',
                    name: 'Charging Infrastructure',
                    description: 'Development and operation of EV charging networks, including home chargers, public charging stations, and fast-charging networks.',
                },
                {
                    id: 'sales-service',
                    name: 'Sales, Service & Software',
                    description: 'Vehicle sales, after-sales service, software updates, and autonomous driving technology development.',
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
        valueChain: {
            upstream: [
                {
                    id: 'polysilicon',
                    name: 'Polysilicon Production',
                    description: 'Manufacturing of high-purity polysilicon, the primary raw material for solar cells.',
                },
                {
                    id: 'wafer-production',
                    name: 'Solar Wafer Production',
                    description: 'Slicing polysilicon into thin wafers for solar cell manufacturing.',
                },
            ],
            midstream: [
                {
                    id: 'solar-cells',
                    name: 'Solar Cell Manufacturing',
                    description: 'Converting silicon wafers into photovoltaic cells that generate electricity.',
                },
                {
                    id: 'solar-panels',
                    name: 'Solar Panel Assembly',
                    description: 'Assembling solar cells into complete photovoltaic modules.',
                },
                {
                    id: 'inverters',
                    name: 'Inverters & Power Electronics',
                    description: 'Converting DC power from solar panels to AC power for grid connection.',
                },
            ],
            downstream: [
                {
                    id: 'residential-install',
                    name: 'Residential Installation',
                    description: 'Residential solar installation and financing services.',
                },
                {
                    id: 'commercial-utility',
                    name: 'Commercial & Utility Scale',
                    description: 'Large-scale solar projects for commercial and utility applications.',
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
    },
    {
        id: 'pharmaceuticals',
        name: 'Pharmaceuticals',
        slug: 'pharmaceuticals',
        description: 'Drug discovery, development, and manufacturing',
        color: 'bg-teal-500',
        icon: '💊',
        subcategories: ['Drug Development', 'Manufacturing', 'Research', 'Distribution'],
    },
    {
        id: 'biotechnology',
        name: 'Biotechnology',
        slug: 'biotechnology',
        description: 'Gene therapy, diagnostics, and research tools',
        color: 'bg-cyan-500',
        icon: '🧬',
        subcategories: ['Gene Therapy', 'Diagnostics', 'Research Tools', 'CRISPR'],
    },
    {
        id: 'medical-devices',
        name: 'Medical Devices',
        slug: 'medical-devices',
        description: 'Medical equipment, diagnostics, and wearables',
        color: 'bg-blue-400',
        icon: '🏥',
        subcategories: ['Equipment', 'Diagnostics', 'Wearables', 'Surgical'],
    },
    {
        id: 'digital-health',
        name: 'Digital Health',
        slug: 'digital-health',
        description: 'Telemedicine, health tech, and AI diagnostics',
        color: 'bg-emerald-500',
        icon: '📱',
        subcategories: ['Telemedicine', 'Health Records', 'AI Diagnostics', 'Remote Monitoring'],
    },
    // --- JAPAN / GLOBAL STRUCTURE ADDITIONS ---
    {
        id: 'wholesale-trading',
        name: 'Wholesale & Trading',
        slug: 'wholesale-trading',
        description: 'General trading companies (Sogo Shosha) and distributors',
        color: 'bg-indigo-700',
        icon: '🌏',
        subcategories: ['General Trading', 'Specialized Trading', 'Industrial Supply', 'Export/Import'],
    },
    {
        id: 'consumer-electronics',
        name: 'Consumer Electronics',
        slug: 'consumer-electronics',
        description: 'Audio, video, gaming, and appliances',
        color: 'bg-blue-500',
        icon: '📸',
        subcategories: ['Imaging & Optical', 'Gaming', 'Audio/Video', 'Appliances'],
    },
    {
        id: 'heavy-industry',
        name: 'Heavy Industry',
        slug: 'heavy-industry',
        description: 'Shipbuilding, power systems, and industrial machinery',
        color: 'bg-slate-700',
        icon: '⚓',
        subcategories: ['Shipbuilding', 'Power Systems', 'Industrial Machinery', 'Defense'],
    },
]
