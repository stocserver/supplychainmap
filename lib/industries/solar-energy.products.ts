import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'polysilicon-wafers',
      name: 'Polysilicon & Wafers',
      description: 'Polysilicon production and wafer slicing for downstream cell manufacturing.',
      companiesDetailed: [
        { name: 'First Solar', ticker: 'FSLR', listing: 'US' },
        { name: 'Hemlock (HSC)', listing: 'Private' },
      ],
      tags: ['Poly', 'Wafers'],
    },
    {
      id: 'glass-encapsulants',
      name: 'Glass & Encapsulants',
      description: 'Front glass, backsheets, and encapsulants for module durability.',
      companiesDetailed: [
        { name: 'First Solar', ticker: 'FSLR', listing: 'US' },
      ],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'cells-modules',
      name: 'Cells & Modules',
      description: 'Solar cell processing and module assembly.',
      companiesDetailed: [
        { name: 'First Solar', ticker: 'FSLR', listing: 'US' },
        { name: 'SunPower', ticker: 'SPWR', listing: 'US' },
        { name: 'Maxeon', ticker: 'MAXN', listing: 'US' },
      ],
      tags: ['Thin Film', 'c-Si'],
    },
    {
      id: 'inverters',
      name: 'Inverters & Power Electronics',
      description: 'String and microinverters, optimizers, and BOS electronics.',
      companiesDetailed: [
        { name: 'Enphase', ticker: 'ENPH', listing: 'US' },
        { name: 'SolarEdge', ticker: 'SEDG', listing: 'US' },
      ],
      tags: ['String', 'Micro'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'residential',
      name: 'Residential Installers',
      description: 'Design, install, and service rooftop solar systems for homes.',
      companiesDetailed: [
        { name: 'Sunrun', ticker: 'RUN', listing: 'US' },
        { name: 'Sunnova', ticker: 'NOVA', listing: 'US' },
      ],
    },
    {
      id: 'utility-scale',
      name: 'Utility-scale Developers',
      description: 'Develop, finance, and operate utility-scale solar farms.',
      companiesDetailed: [
        { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
        { name: 'Brookfield Renewable', ticker: 'BEP', listing: 'US' },
      ],
    },
  ],
}

export const solarProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]




