import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'battery-materials',
      name: 'Battery Materials',
      description: 'Lithium, nickel, cobalt, and processing into cathode/anode materials and electrolytes.',
      companiesDetailed: [
        { name: 'Albemarle', ticker: 'ALB', listing: 'US' },
        { name: 'Livent', ticker: 'LTHM', listing: 'US' },
        { name: 'Piedmont Lithium', ticker: 'PLL', listing: 'US' },
      ],
      tags: ['Lithium', 'Cathode', 'Anode'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'cells-bess',
      name: 'Cells & BESS Systems',
      description: 'Battery cell manufacturing and integrated battery energy storage systems (BESS).',
      companiesDetailed: [
        { name: 'Tesla', ticker: 'TSLA', listing: 'US' },
        { name: 'Fluence', ticker: 'FLNC', listing: 'US' },
        { name: 'Stem', ticker: 'STEM', listing: 'US' },
      ],
      tags: ['BESS'],
    },
    {
      id: 'inverters-ems',
      name: 'Inverters & EMS',
      description: 'Bidirectional inverters, power conversion, and energy management systems.',
      companiesDetailed: [
        { name: 'Enphase', ticker: 'ENPH', listing: 'US' },
        { name: 'SolarEdge', ticker: 'SEDG', listing: 'US' },
      ],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'residential-storage',
      name: 'Residential Storage',
      description: 'Home batteries integrated with rooftop solar and backup power.',
      companiesDetailed: [
        { name: 'Tesla Powerwall', ticker: 'TSLA', listing: 'US' },
        { name: 'Enphase', ticker: 'ENPH', listing: 'US' },
      ],
    },
    {
      id: 'grid-scale',
      name: 'Grid-scale Storage',
      description: 'Utility-scale BESS deployments for peak shaving, frequency regulation, and renewables integration.',
      companiesDetailed: [
        { name: 'Fluence', ticker: 'FLNC', listing: 'US' },
        { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
      ],
    },
  ],
}

export const energyStorageProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]




