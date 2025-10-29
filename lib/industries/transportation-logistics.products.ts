import { ValueChainStageProducts } from "@/lib/data/industries"

export const transportationLogisticsProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Equipment & Infrastructure',
    layout: 'grid',
    products: [
      {
        id: 'transportation-equipment',
        name: 'Transportation Equipment',
        description: 'Trucks, trailers, railcars, and equipment',
        longDescription: 'Manufacturing and supply of vehicles and machinery used for transporting goods and people, including commercial trucks, trailers, railcars, and specialized cargo handling equipment. This segment focuses on durability, efficiency, and safety for various modes of transportation.',
        companiesDetailed: [
          { name: 'Paccar', ticker: 'PCAR', listing: 'US' },
          { name: 'Caterpillar', ticker: 'CAT', listing: 'US' },
          { name: 'Navistar International', ticker: 'NAV', listing: 'US' },
          { name: 'Oshkosh Corporation', ticker: 'OSK', listing: 'US' },
          { name: 'Terex Corporation', ticker: 'TEX', listing: 'US' },
          { name: 'Triton International', ticker: 'TRTN', listing: 'US' },
          { name: 'Textron', ticker: 'TXT', listing: 'US' },
          { name: 'CNH Industrial', ticker: 'CNHI', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Carriers & Networks',
    layout: 'hybrid',
    products: [
      {
        id: 'freight-trucking',
        name: 'Freight Trucking',
        description: 'LTL and TL trucking carriers',
        longDescription: 'Road transportation services for goods, categorized by Less-Than-Truckload (LTL) for smaller shipments and Truckload (TL) for full truck capacity. This segment focuses on efficient route planning, timely delivery, and managing diverse cargo types across regional and national networks.',
        companiesDetailed: [
          { name: 'Old Dominion Freight Line', ticker: 'ODFL', listing: 'US' },
          { name: 'XPO', ticker: 'XPO', listing: 'US' },
          { name: 'J.B. Hunt Transport', ticker: 'JBHT', listing: 'US' },
          { name: 'Knight-Swift Transportation', ticker: 'KNX', listing: 'US' },
          { name: 'Schneider National', ticker: 'SNDR', listing: 'US' },
          { name: 'Ryder System', ticker: 'R', listing: 'US' },
          { name: 'Werner Enterprises', ticker: 'WERN', listing: 'US' },
          { name: 'Heartland Express', ticker: 'HTLD', listing: 'US' },
          { name: 'Landstar System', ticker: 'LSTR', listing: 'US' }
        ]
      },
      {
        id: 'railroads',
        name: 'Railroads',
        description: 'Class I railroads',
        longDescription: 'Operation of extensive rail networks for freight transportation, primarily by Class I railroads. This segment is crucial for moving bulk commodities, intermodal containers, and other heavy goods efficiently over long distances, serving various industrial and consumer sectors.',
        companiesDetailed: [
          { name: 'Union Pacific', ticker: 'UNP', listing: 'US' },
          { name: 'CSX', ticker: 'CSX', listing: 'US' },
          { name: 'BNSF Railway', ticker: 'BRK.B', listing: 'US' },
          { name: 'Norfolk Southern', ticker: 'NSC', listing: 'US' },
          { name: 'Kansas City Southern', ticker: 'KSU', listing: 'US' },
          { name: 'Canadian National Railway', ticker: 'CNI', listing: 'US' },
          { name: 'Canadian Pacific Railway', ticker: 'CP', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Last Mile & 3PL',
    layout: 'grid',
    products: [
      {
        id: 'last-mile',
        name: 'Last Mile',
        description: 'Parcel delivery and last mile services',
        longDescription: 'Specialized services focused on the final leg of the delivery journey, from a transportation hub to the end customer\'s doorstep. This includes parcel delivery, courier services, and local distribution, emphasizing speed, accuracy, and customer satisfaction.',
        companiesDetailed: [
          { name: 'FedEx', ticker: 'FDX', listing: 'US' },
          { name: 'UPS', ticker: 'UPS', listing: 'US' },
          { name: 'Amazon Logistics', ticker: 'AMZN', listing: 'US' },
          { name: 'DHL', ticker: 'DPW', listing: 'ADR' },
          { name: 'OnTrac', ticker: 'ONTR', listing: 'US' }
        ]
      },
      {
        id: '3pl-logistics',
        name: '3PL Logistics',
        description: 'Third-party logistics providers',
        longDescription: 'Outsourced logistics services that cover a range of supply chain functions, including warehousing, transportation, inventory management, and freight forwarding. 3PL providers help businesses optimize their supply chains, reduce costs, and improve efficiency by leveraging specialized expertise and networks.',
        companiesDetailed: [
          { name: 'C.H. Robinson', ticker: 'CHRW', listing: 'US' },
          { name: 'Expeditors', ticker: 'EXPD', listing: 'US' },
          { name: 'Ryder System', ticker: 'R', listing: 'US' },
          { name: 'XPO Logistics', ticker: 'XPO', listing: 'US' },
          { name: 'Penske Logistics', ticker: 'PAG', listing: 'US' },
          { name: 'Hub Group', ticker: 'HUBG', listing: 'US' },
          { name: 'Echo Global Logistics', ticker: 'ECHO', listing: 'US' },
          { name: 'Universal Logistics', ticker: 'ULH', listing: 'US' }
        ]
      }
    ]
  }
]


