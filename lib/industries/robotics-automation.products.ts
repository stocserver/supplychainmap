import { ValueChainStageProducts } from "@/lib/data/industries"

export const roboticsAutomationProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Sensors & Actuators',
    layout: 'grid',
    products: [
      {
        id: 'sensors-actuators',
        name: 'Sensors & Actuators',
        description: 'Industrial sensors, vision, and motion components',
        longDescription: 'Manufacturing and supply of critical components for robotic and automation systems, including industrial sensors (e.g., proximity, vision, force), specialized cameras, and actuators (e.g., servo motors, grippers). These components enable robots to perceive their environment, interact with objects, and execute precise movements.',
        companiesDetailed: [
          { name: 'Keyence', listing: 'ADR' },
          { name: 'Cognex', ticker: 'CGNX', listing: 'US' },
          { name: 'Rockwell Automation', ticker: 'ROK', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Industrial & Service Robots',
    layout: 'hybrid',
    products: [
      {
        id: 'industrial-robots',
        name: 'Industrial Robots',
        description: 'Robotic arms, cobots, and automation cells',
        longDescription: 'Design, manufacturing, and deployment of robotic systems for industrial applications, such as assembly, welding, painting, and material handling. This includes traditional industrial robotic arms, collaborative robots (cobots) that work alongside humans, and fully automated production cells.',
        companiesDetailed: [
          { name: 'ABB', listing: 'ADR' },
          { name: 'Fanuc', listing: 'ADR' },
          { name: 'Rockwell Automation', ticker: 'ROK', listing: 'US' }
        ]
      },
      {
        id: 'warehouse-automation',
        name: 'Warehouse Automation',
        description: 'Automated storage, picking, AMRs',
        longDescription: 'Development and implementation of automated solutions for warehousing and logistics, including automated storage and retrieval systems (AS/RS), robotic picking solutions, and autonomous mobile robots (AMRs). These systems optimize inventory management, order fulfillment, and material flow within distribution centers.',
        companiesDetailed: [
          { name: 'Honeywell', ticker: 'HON', listing: 'US' },
          { name: 'Zebra Technologies', ticker: 'ZBRA', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Applications',
    layout: 'grid',
    products: [
      {
        id: 'service-robots',
        name: 'Service Robots',
        description: 'Cleaning, delivery, and retail robots',
        longDescription: 'Development and deployment of robots designed to assist humans in non-industrial settings, such as cleaning robots for commercial spaces, delivery robots for last-mile logistics, and retail robots for inventory management and customer assistance. These robots enhance efficiency and convenience in various service sectors.',
        companiesDetailed: [
          { name: 'iRobot', ticker: 'IRBT', listing: 'US' },
          { name: 'Zebra Technologies', ticker: 'ZBRA', listing: 'US' }
        ]
      }
    ]
  }
]


