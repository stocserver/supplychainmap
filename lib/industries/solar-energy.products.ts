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
        { name: 'Wacker Chemie', ticker: 'WKCMF', listing: 'ADR' },
        { name: 'REC Silicon', ticker: 'RECSI', listing: 'US' },
      ],
      tags: ['Poly', 'Wafers'],
    },
    {
      id: 'glass-encapsulants',
      name: 'Glass & Encapsulants',
      description: 'Front glass, backsheets, and encapsulants for module durability.',
      companiesDetailed: [
        { name: 'First Solar', ticker: 'FSLR', listing: 'US' },
        { name: 'Corning', ticker: 'GLW', listing: 'US' },
        { name: 'AGC', ticker: 'ASGLY', listing: 'ADR' },
        { name: '3M', ticker: 'MMM', listing: 'US' },
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
        { name: 'Canadian Solar', ticker: 'CSIQ', listing: 'US' },
        { name: 'JinkoSolar', ticker: 'JKS', listing: 'US' },
        { name: 'Trina Solar', ticker: 'TSL', listing: 'US' },
        { name: 'Q Cells', ticker: 'HQCL', listing: 'US' },
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
        { name: 'SMA Solar Technology', ticker: 'SMTGF', listing: 'ADR' },
        { name: 'Fronius', ticker: 'FRO', listing: 'ADR' },
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
        { name: 'SunPower', ticker: 'SPWR', listing: 'US' },
        { name: 'Vivint Solar', ticker: 'VSLR', listing: 'US' },
      ],
    },
    {
      id: 'utility-scale',
      name: 'Utility-scale Developers',
      description: 'Develop, finance, and operate utility-scale solar farms.',
      companiesDetailed: [
        { name: 'NextEra Energy', ticker: 'NEE', listing: 'US' },
        { name: 'Brookfield Renewable', ticker: 'BEP', listing: 'US' },
        { name: 'Clearway Energy', ticker: 'CWEN', listing: 'US' },
        { name: '8point3 Energy Partners', ticker: 'CAFD', listing: 'US' },
        { name: 'TerraForm Power', ticker: 'TERP', listing: 'US' },
      ],
    },
  ],
}

export const solarProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]




