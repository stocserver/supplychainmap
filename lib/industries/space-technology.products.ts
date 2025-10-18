import { ValueChainStageProducts } from "@/lib/data/industries"

export const spaceTechnologyProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Components & Manufacturing',
    layout: 'grid',
    products: [
      {
        id: 'components-space',
        name: 'Space Components',
        description: 'Sat payload components and systems',
        longDescription: 'Manufacturing of specialized components and systems for spacecraft, including satellite payloads, communication modules, propulsion systems, and optical instruments. These components are designed to withstand the harsh conditions of space and provide critical functionality for various missions.',
        companiesDetailed: [
          { name: 'Maxar Technologies', ticker: 'MAXR', listing: 'US' },
          { name: 'L3Harris', ticker: 'LHX', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Launch & Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'satellite-manufacturing',
        name: 'Satellite Manufacturing',
        description: 'Manufacture satellites and payloads',
        longDescription: 'Design, assembly, integration, and testing of satellites and their payloads. This involves combining various components into a fully functional spacecraft capable of performing communication, earth observation, navigation, or scientific missions in orbit.',
        companiesDetailed: [
          { name: 'Boeing', ticker: 'BA', listing: 'US' },
          { name: 'Lockheed Martin', ticker: 'LMT', listing: 'US' }
        ]
      },
      {
        id: 'launch-services',
        name: 'Launch Services',
        description: 'Orbital launch providers',
        longDescription: 'Providers of rocket launch services to transport satellites and spacecraft into various orbits. This includes the development, manufacturing, and operation of launch vehicles, as well as mission integration and launch campaign management.',
        companiesDetailed: [
          { name: 'Northrop Grumman', ticker: 'NOC', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Satellite Ops & Ground',
    layout: 'grid',
    products: [
      {
        id: 'satellite-operations',
        name: 'Satellite Operations',
        description: 'Operators and data services',
        longDescription: 'Operation and management of in-orbit satellites, including telemetry, tracking, and command (TT&C) functions, as well as the provision of satellite-derived data services (e.g., imagery, communications, navigation). These services deliver critical information and connectivity to various end-users.',
        companiesDetailed: [
          { name: 'Iridium', ticker: 'IRDM', listing: 'US' },
          { name: 'Viasat', ticker: 'VSAT', listing: 'US' }
        ]
      },
      {
        id: 'ground-systems',
        name: 'Ground Systems',
        description: 'Ground stations and terminals',
        longDescription: 'Development and deployment of ground segment infrastructure, including satellite ground stations, antenna systems, and user terminals. These systems are essential for communicating with satellites, receiving data, and enabling satellite-based services on Earth.',
        companiesDetailed: [
          { name: 'Hughes (EchoStar)', ticker: 'SATS', listing: 'US' }
        ]
      }
    ]
  }
]


