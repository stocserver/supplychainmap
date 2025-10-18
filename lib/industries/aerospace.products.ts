import { ValueChainStageProducts } from "@/lib/data/industries"

export const aerospaceProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Materials & Components',
    layout: 'flow',
    products: [
      {
        id: 'raw-materials-aero',
        name: 'Raw Materials',
        description: 'Specialized aerospace materials and alloys',
        longDescription: 'Companies that produce specialized materials, alloys, and composites used in aerospace manufacturing including titanium, aluminum, carbon fiber, and advanced alloys.',
        companiesDetailed: [
          { name: 'Alcoa', ticker: 'AA', listing: 'US' },
          { name: 'Arconic', ticker: 'ARNC', listing: 'US' },
          { name: 'Carpenter Technology', ticker: 'CRS', listing: 'US' },
          { name: 'ATI', ticker: 'ATI', listing: 'US' },
          { name: 'Hexcel', ticker: 'HXL', listing: 'US' },
          { name: 'Toray Industries', ticker: 'TRIL', listing: 'ADR' },
          { name: 'Teijin', ticker: 'TINLY', listing: 'ADR' }
        ],
        subProducts: [
          {
            id: 'titanium-alloys',
            name: 'Titanium Alloys',
            description: 'High-strength titanium materials',
            companiesDetailed: [
              { name: 'ATI', ticker: 'ATI', listing: 'US' },
              { name: 'Carpenter Technology', ticker: 'CRS', listing: 'US' }
            ]
          },
          {
            id: 'composites',
            name: 'Carbon Fiber Composites',
            description: 'Advanced composite materials',
            companiesDetailed: [
              { name: 'Hexcel', ticker: 'HXL', listing: 'US' },
              { name: 'Toray Industries', ticker: 'TRIL', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Materials', 'Alloys', 'Composites', 'Titanium']
      },
      {
        id: 'components-parts',
        name: 'Aerospace Components',
        description: 'Specialized aerospace components and systems',
        longDescription: 'Companies that manufacture specialized components, systems, and subsystems for aircraft including engines, avionics, landing gear, and structural components.',
        companiesDetailed: [
          { name: 'General Electric', ticker: 'GE', listing: 'US' },
          { name: 'Raytheon Technologies', ticker: 'RTX', listing: 'US' },
          { name: 'Honeywell International', ticker: 'HON', listing: 'US' },
          { name: 'Safran', ticker: 'SAFRY', listing: 'ADR' },
          { name: 'Rolls-Royce', ticker: 'RYCEY', listing: 'ADR' },
          { name: 'Pratt & Whitney', ticker: 'RTX', listing: 'US' },
          { name: 'Collins Aerospace', ticker: 'RTX', listing: 'US' },
          { name: 'Spirit AeroSystems', ticker: 'SPR', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'engines',
            name: 'Aircraft Engines',
            description: 'Jet engines and propulsion systems',
            companiesDetailed: [
              { name: 'General Electric', ticker: 'GE', listing: 'US' },
              { name: 'Pratt & Whitney', ticker: 'RTX', listing: 'US' },
              { name: 'Rolls-Royce', ticker: 'RYCEY', listing: 'ADR' }
            ]
          },
          {
            id: 'avionics',
            name: 'Avionics Systems',
            description: 'Flight control and navigation systems',
            companiesDetailed: [
              { name: 'Honeywell International', ticker: 'HON', listing: 'US' },
              { name: 'Collins Aerospace', ticker: 'RTX', listing: 'US' },
              { name: 'Thales', ticker: 'THLEF', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Components', 'Engines', 'Avionics', 'Systems']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Aircraft Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'aircraft-manufacturing',
        name: 'Aircraft Manufacturing',
        description: 'Commercial and military aircraft assembly',
        longDescription: 'Companies that design, engineer, and manufacture complete aircraft including commercial airliners, business jets, military aircraft, and helicopters.',
        companiesDetailed: [
          { name: 'Boeing', ticker: 'BA', listing: 'US' },
          { name: 'Airbus', ticker: 'EADSY', listing: 'ADR' },
          { name: 'Embraer', ticker: 'ERJ', listing: 'US' },
          { name: 'Bombardier', ticker: 'BDRBF', listing: 'ADR' },
          { name: 'Textron', ticker: 'TXT', listing: 'US' },
          { name: 'Leonardo', ticker: 'LDO', listing: 'ADR' },
          
        ],
        subProducts: [
          {
            id: 'commercial-aircraft',
            name: 'Commercial Aircraft',
            description: 'Passenger and cargo aircraft',
            companiesDetailed: [
              { name: 'Boeing', ticker: 'BA', listing: 'US' },
              { name: 'Airbus', ticker: 'EADSY', listing: 'ADR' },
              { name: 'Embraer', ticker: 'ERJ', listing: 'US' }
            ]
          },
          {
            id: 'business-jets',
            name: 'Business Jets',
            description: 'Private and corporate aircraft',
            companiesDetailed: [
              { name: 'Textron', ticker: 'TXT', listing: 'US' },
              { name: 'Bombardier', ticker: 'BDRBF', listing: 'ADR' },
              { name: 'Gulfstream', ticker: 'GD', listing: 'US' }
            ]
          }
        ],
        tags: ['Aircraft Assembly', 'Manufacturing', 'Commercial', 'Military']
      },
      {
        id: 'defense-systems',
        name: 'Defense Systems',
        description: 'Military aircraft and defense systems',
        longDescription: 'Companies that develop and manufacture military aircraft, defense systems, and related technologies for national defense.',
        companiesDetailed: [
          { name: 'Lockheed Martin', ticker: 'LMT', listing: 'US' },
          { name: 'Northrop Grumman', ticker: 'NOC', listing: 'US' },
          { name: 'General Dynamics', ticker: 'GD', listing: 'US' },
          { name: 'Boeing Defense', ticker: 'BA', listing: 'US' },
          { name: 'Raytheon Technologies', ticker: 'RTX', listing: 'US' },
          { name: 'L3Harris Technologies', ticker: 'LHX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'fighter-aircraft',
            name: 'Fighter Aircraft',
            description: 'Military fighter jets and combat aircraft',
            companiesDetailed: [
              { name: 'Lockheed Martin', ticker: 'LMT', listing: 'US' },
              { name: 'Boeing Defense', ticker: 'BA', listing: 'US' }
            ]
          },
          {
            id: 'missile-systems',
            name: 'Missile Systems',
            description: 'Defense missiles and weapons systems',
            companiesDetailed: [
              { name: 'Raytheon Technologies', ticker: 'RTX', listing: 'US' },
              { name: 'Lockheed Martin', ticker: 'LMT', listing: 'US' }
            ]
          }
        ],
        tags: ['Defense', 'Military', 'Weapons', 'Security']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Operations & Services',
    layout: 'grid',
    products: [
      {
        id: 'airlines',
        name: 'Airlines',
        description: 'Commercial airline operations',
        longDescription: 'Companies that operate commercial airline services, providing passenger and cargo transportation.',
        companiesDetailed: [
          { name: 'American Airlines', ticker: 'AAL', listing: 'US' },
          { name: 'Delta Air Lines', ticker: 'DAL', listing: 'US' },
          { name: 'United Airlines', ticker: 'UAL', listing: 'US' },
          { name: 'Southwest Airlines', ticker: 'LUV', listing: 'US' },
          { name: 'JetBlue Airways', ticker: 'JBLU', listing: 'US' },
          { name: 'Alaska Air Group', ticker: 'ALK', listing: 'US' },
          { name: 'Spirit Airlines', ticker: 'SAVE', listing: 'US' },
          { name: 'Frontier Airlines', ticker: 'ULCC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'legacy-carriers',
            name: 'Legacy Carriers',
            description: 'Full-service network airlines',
            companiesDetailed: [
              { name: 'American Airlines', ticker: 'AAL', listing: 'US' },
              { name: 'Delta Air Lines', ticker: 'DAL', listing: 'US' },
              { name: 'United Airlines', ticker: 'UAL', listing: 'US' }
            ]
          },
          {
            id: 'low-cost-carriers',
            name: 'Low-Cost Carriers',
            description: 'Budget and low-cost airlines',
            companiesDetailed: [
              { name: 'Southwest Airlines', ticker: 'LUV', listing: 'US' },
              { name: 'JetBlue Airways', ticker: 'JBLU', listing: 'US' },
              { name: 'Spirit Airlines', ticker: 'SAVE', listing: 'US' }
            ]
          }
        ],
        tags: ['Airlines', 'Passenger Transport', 'Cargo', 'Operations']
      },
      {
        id: 'mro',
        name: 'Maintenance, Repair & Overhaul',
        description: 'Aircraft maintenance and repair services',
        longDescription: 'Companies that provide maintenance, repair, and overhaul services for aircraft, engines, and components.',
        companiesDetailed: [
          { name: 'AAR Corp', ticker: 'AIR', listing: 'US' },
          { name: 'StandardAero', ticker: 'SA', listing: 'Private' },
          { name: 'Lufthansa Technik', ticker: 'LHA', listing: 'ADR' },
          { name: 'ST Engineering', ticker: 'SGGKY', listing: 'ADR' },
          
        ],
        subProducts: [
          {
            id: 'engine-mro',
            name: 'Engine MRO',
            description: 'Aircraft engine maintenance',
            companiesDetailed: [
              
              { name: 'Lufthansa Technik', ticker: 'LHA', listing: 'ADR' }
            ]
          },
          {
            id: 'airframe-mro',
            name: 'Airframe MRO',
            description: 'Aircraft structure maintenance',
            companiesDetailed: [
              { name: 'AAR Corp', ticker: 'AIR', listing: 'US' },
              { name: 'ST Engineering', ticker: 'SGGKY', listing: 'ADR' }
            ]
          }
        ],
        tags: ['Maintenance', 'Repair', 'Overhaul', 'Services']
      }
    ]
  }
]
