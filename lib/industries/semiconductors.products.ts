import type { ProductCategory, ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'ip-design',
      name: 'IP Design / IC Design Services',
      description:
        'Reusable circuit intellectual property (IP) and outsourced IC design services. Includes CPU/GPU cores, interface IP, and EDA-enabled design houses supporting fabless teams.',
      longDescription:
        'IP providers license reusable circuit blocks (CPU/GPU architectures, PHYs, memory controllers, interface IP like PCIe/DDR/USB). Design service firms augment internal teams with RTL, verification, physical design, DFT, and bring-up expertise. These products and services reduce time-to-market and allow fabless firms to focus on differentiation rather than reinventing commodity logic. Typical deliverables include synthesizable RTL, hard macros, verification suites, and implementation support across process nodes.',
      companiesDetailed: [
        { name: 'Arm', ticker: 'ARM', listing: 'US' },
        { name: 'Cadence', ticker: 'CDNS', listing: 'US' },
        { name: 'Synopsys', ticker: 'SNPS', listing: 'US' },
      ],
      tags: ['EDA'],
      flowsTo: ['ic-design']
    },
    {
      id: 'ic-design',
      name: 'IC Design (Fabless)',
      description:
        'Chip design firms that create GPUs, CPUs, mobile SoCs, AI accelerators, analog and RF parts without owning fabs. Designs flow to foundries for manufacturing.',
      longDescription:
        'Fabless firms manage product definition, architecture, RTL/analog design, verification, physical implementation, tape-out, and post-silicon validation. Outputs include GDSII for wafer fabrication, and software/firmware stacks. Business models span merchant silicon and custom silicon (ASIC/SoC) for hyperscalers and OEMs. Key risks: mask costs, yield, and time-to-market; key moats: IP portfolio, software ecosystem, and channel access.',
      subProducts: [
        { id: 'gpu', name: 'GPU Designs', description: 'Graphics processors for AI, gaming, and visualization.', companiesDetailed: [{ name: 'NVIDIA', ticker: 'NVDA', listing: 'US' }, { name: 'AMD', ticker: 'AMD', listing: 'US' }] },
        { id: 'cpu', name: 'CPU Designs', description: 'General-purpose processors for PCs, servers, and edge devices.', companiesDetailed: [{ name: 'AMD', ticker: 'AMD', listing: 'US' }, { name: 'Intel', ticker: 'INTC', listing: 'US' }] },
        { id: 'mobile-soc', name: 'Mobile SoCs', description: 'System-on-chips integrating CPU, GPU, modem, and AI engines for smartphones and tablets.', companiesDetailed: [{ name: 'Qualcomm', ticker: 'QCOM', listing: 'US' }, { name: 'Broadcom', ticker: 'AVGO', listing: 'US' }] },
        { id: 'ai-accelerators', name: 'AI Accelerators', description: 'Specialized chips optimized for training and inference workloads.', companiesDetailed: [{ name: 'NVIDIA', ticker: 'NVDA', listing: 'US' }, { name: 'AMD', ticker: 'AMD', listing: 'US' }] },
        { id: 'analog', name: 'Analog ICs', description: 'Signal conditioning, power management, converters, and interface chips.', companiesDetailed: [{ name: 'Texas Instruments', ticker: 'TXN', listing: 'US' }, { name: 'Analog Devices', ticker: 'ADI', listing: 'US' }, { name: 'Microchip', ticker: 'MCHP', listing: 'US' }, { name: 'Monolithic Power', ticker: 'MPWR', listing: 'US' }] },
        { id: 'rf', name: 'RF & Connectivity', description: 'Wireless transceivers, front-end modules, and connectivity chips.', companiesDetailed: [{ name: 'NXP', ticker: 'NXPI', listing: 'US' }, { name: 'Skyworks', ticker: 'SWKS', listing: 'US' }, { name: 'Qorvo', ticker: 'QRVO', listing: 'US' }] },
      ],
      companiesDetailed: [
        { name: 'NVIDIA', ticker: 'NVDA', listing: 'US' },
        { name: 'AMD', ticker: 'AMD', listing: 'US' },
        { name: 'Qualcomm', ticker: 'QCOM', listing: 'US' },
        { name: 'Broadcom', ticker: 'AVGO', listing: 'US' },
        { name: 'Marvell', ticker: 'MRVL', listing: 'US' },
        { name: 'NXP', ticker: 'NXPI', listing: 'US' },
        { name: 'Microchip', ticker: 'MCHP', listing: 'US' },
        { name: 'Analog Devices', ticker: 'ADI', listing: 'US' },
        { name: 'Texas Instruments', ticker: 'TXN', listing: 'US' },
      ],
      flowsTo: ['wafer-fab'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'wafer-fab',
      name: 'Wafer Fabrication',
      description:
        'Foundries and IDMs manufacture integrated circuits on silicon wafers using lithography, deposition, etch, and metrology steps in cleanroom fabs.',
      subProducts: [
        {
          id: 'foundries-idms',
          name: 'Foundries & IDMs',
          description: 'Contract foundries and integrated device manufacturers that fabricate chips on silicon wafers.',
          companiesDetailed: [
            { name: 'TSMC', ticker: 'TSM', listing: 'ADR' },
            { name: 'Intel', ticker: 'INTC', listing: 'US' },
            { name: 'Micron', ticker: 'MU', listing: 'US' },
            { name: 'GlobalFoundries', ticker: 'GFS', listing: 'US' },
            { name: 'UMC', ticker: 'UMC', listing: 'ADR' },
          ],
        },
        {
          id: 'equipment',
          name: 'Production Equipment',
          subProducts: [
            { id: 'litho', name: 'Lithography (EUV/DUV)', description: 'Optical systems project circuit patterns onto photoresist to form transistors and interconnects.', longDescription: 'EUV (13.5nm) enables leading-edge logic nodes; DUV (ArF/KrF) remains critical for multiple patterning and mature nodes. Scanner uptime and pellicle availability directly impact fab throughput and yield.', companiesDetailed: [{ name: 'ASML', ticker: 'ASML', listing: 'ADR' }, { name: 'Nikon', listing: 'Foreign' }] },
            { id: 'etch', name: 'Etching Tools', description: 'Remove material selectively to define features after patterning.', companiesDetailed: [{ name: 'Applied Materials', ticker: 'AMAT', listing: 'US' }, { name: 'Lam Research', ticker: 'LRCX', listing: 'US' }, { name: 'Tokyo Electron', listing: 'Foreign' }] },
        { id: 'dep', name: 'Deposition & CMP', description: 'Thin-film deposition and planarization to build device layers.', longDescription: 'ALD/CVD/PVD processes deposit conductive, dielectric, and barrier films with angstrom-level control; CMP planarizes surfaces to enable subsequent lithography steps. Film quality (uniformity, conformality) and defectivity directly affect device performance and yield.', companiesDetailed: [{ name: 'Applied Materials', ticker: 'AMAT', listing: 'US' }, { name: 'Lam Research', ticker: 'LRCX', listing: 'US' }, { name: 'ASM International', listing: 'ADR' }, { name: 'Veeco', ticker: 'VECO', listing: 'US' }] },
        { id: 'inspect', name: 'Inspection/Metrology', description: 'Detect defects and measure features to control process yield.', longDescription: 'Optical/e-beam inspection identifies pattern defects and particles; scatterometry, CD-SEM, and X-ray tools measure critical dimensions, film thickness, and overlay. Advanced analytics flag excursions early to protect yield on expensive wafers.', companiesDetailed: [{ name: 'KLA', ticker: 'KLAC', listing: 'US' }, { name: 'Onto Innovation', ticker: 'ONTO', listing: 'US' }, { name: 'Nova', ticker: 'NVMI', listing: 'US' }] },
          ],
        },
        {
          id: 'materials',
          name: 'Chemicals & Materials',
          description: 'Specialty chemicals, gases, and substrates consumed by fabrication processes.',
          subProducts: [
            { id: 'photoresist', name: 'Photoresists', description: 'Light-sensitive polymers used to transfer patterns onto wafers.', longDescription: 'Chemistries tuned for wavelength (EUV/DUV) and process windows; ancillary chemistries include developers, strippers, and adhesion promoters.', companiesDetailed: [{ name: 'Dow', ticker: 'DOW', listing: 'US' }, { name: 'DuPont', ticker: 'DD', listing: 'US' }, { name: 'JSR', listing: 'Foreign' }, { name: 'TOK (Tokyo Ohka)', listing: 'Foreign' }] },
            { id: 'gases', name: 'Ultra-Pure Gases', description: 'Process gases (e.g., nitrogen, hydrogen, fluorine) with extremely low contaminants.', companiesDetailed: [{ name: 'Linde', ticker: 'LIN', listing: 'US' }, { name: 'Air Products', ticker: 'APD', listing: 'US' }] },
            { id: 'wafers', name: 'Silicon Wafers', description: 'Monocrystalline silicon substrates that chips are built on.', companiesDetailed: [{ name: 'SUMCO', listing: 'Foreign' }, { name: 'Shin-Etsu', listing: 'Foreign' }, { name: 'GlobalWafers', listing: 'Foreign' }] },
            { id: 'consumables', name: 'Fab Consumables', description: 'Filters, slurries, and specialty materials vital for contamination control and planarization.', companiesDetailed: [{ name: 'Entegris', ticker: 'ENTG', listing: 'US' }] },
          ],
        },
        { id: 'photomasks', name: 'Photomasks', description: 'Quartz plates with circuit patterns that guide the lithography exposure.', companiesDetailed: [{ name: 'Photronics', ticker: 'PLAB', listing: 'US' }, { name: 'DNP', listing: 'Foreign' }, { name: 'Hoya', listing: 'Foreign' }, { name: 'Toppan', listing: 'Foreign' }] },
      ],
      companiesDetailed: [],
      flowsTo: ['packaging'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'packaging',
      name: 'IC Packaging & Testing',
      description: 'Assemble, protect, connect, and test finished dies to ensure performance and reliability before shipment.',
      subProducts: [
        { id: 'bga', name: 'BGA / QFN / Flip-Chip', description: 'Package families that provide electrical I/O and thermal paths for chips.', longDescription: 'Advanced packaging (2.5D/3D, chiplet architectures, fan-out) improves bandwidth and power while shrinking form factor. Reliability concerns include warpage, electromigration, and thermal cycling.', companiesDetailed: [{ name: 'ASE', ticker: 'ASX', listing: 'ADR' }, { name: 'Amkor', ticker: 'AMKR', listing: 'US' }] },
        { id: 'substrates', name: 'Substrates & Interposers', description: 'ABF/BT substrates and silicon interposers used in advanced packaging.', longDescription: 'High-density organic substrates and silicon interposers route thousands of signals between chiplets and boards. Key specs include line/space, via technology, warpage, and CTE matching to dies and boards.', companiesDetailed: [{ name: 'Unimicron', listing: 'Foreign' }, { name: 'Ibiden', listing: 'Foreign' }, { name: 'AT&S', listing: 'Foreign' }] },
        { id: 'test', name: 'Test & Handlers', description: 'Equipment and services for wafer sort, final test, and burn-in.', companiesDetailed: [{ name: 'Teradyne', ticker: 'TER', listing: 'US' }, { name: 'Cohu', ticker: 'COHU', listing: 'US' }, { name: 'Advantest', ticker: 'ATEYY', listing: 'ADR' }] },
        { id: 'pkg-equip', name: 'Packaging Equipment', description: 'Equipment vendors for bonding, dicing, molding, plating, and advanced packaging.', companiesDetailed: [{ name: 'ASMPT', listing: 'Foreign' }, { name: 'BE Semiconductor (BESI)', listing: 'Foreign' }, { name: 'Kulicke & Soffa', ticker: 'KLIC', listing: 'US' }] },
      ],
      companiesDetailed: [
        { name: 'ASE', listing: 'Foreign' },
        { name: 'Amkor', ticker: 'AMKR', listing: 'US' },
      ],
      flowsTo: ['modules', 'distribution'],
    },
    {
      id: 'modules',
      name: 'IC Modules',
      description: 'Combine multiple chips and components into functional assemblies for systems.',
      subProducts: [
        { id: 'memory-mods', name: 'Memory Modules', description: 'DRAM and NAND assemblies for PCs, servers, and devices.', companiesDetailed: [{ name: 'Micron', ticker: 'MU', listing: 'US' }] },
        { id: 'rf-mods', name: 'RF Modules', description: 'Front-end and connectivity modules for wireless systems.', companiesDetailed: [{ name: 'Qualcomm', ticker: 'QCOM', listing: 'US' }, { name: 'Skyworks', ticker: 'SWKS', listing: 'US' }, { name: 'Qorvo', ticker: 'QRVO', listing: 'US' }] },
        { id: 'power-mods', name: 'Power Modules', description: 'High-efficiency power conversion modules incl. SiC/GaN.', companiesDetailed: [{ name: 'ON Semiconductor', ticker: 'ON', listing: 'US' }, { name: 'Wolfspeed', ticker: 'WOLF', listing: 'US' }] },
      ],
    },
    {
      id: 'distribution',
      name: 'Distribution (End Markets)',
      description: 'Distributors and direct channels that route components to device makers and OEMs in target verticals.',
      subProducts: [
        { id: 'to-smartphones', name: 'To Smartphones', companiesDetailed: [{ name: 'Arrow', ticker: 'ARW', listing: 'US' }, { name: 'Avnet', ticker: 'AVT', listing: 'US' }] },
        { id: 'to-pc', name: 'To PCs & Servers', companiesDetailed: [{ name: 'Arrow', ticker: 'ARW', listing: 'US' }, { name: 'Avnet', ticker: 'AVT', listing: 'US' }] },
        { id: 'to-automotive', name: 'To Automotive', companiesDetailed: [{ name: 'Arrow', ticker: 'ARW', listing: 'US' }, { name: 'Avnet', ticker: 'AVT', listing: 'US' }] },
        { id: 'to-dc', name: 'To Data Centers', companiesDetailed: [{ name: 'Arrow', ticker: 'ARW', listing: 'US' }, { name: 'Avnet', ticker: 'AVT', listing: 'US' }] },
      ],
      companiesDetailed: [
        { name: 'Arrow', ticker: 'ARW', listing: 'US' },
        { name: 'Avnet', ticker: 'AVT', listing: 'US' },
      ],
    },
  ],
}

export const semiconductorProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]


