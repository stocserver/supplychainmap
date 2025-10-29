import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'battery-materials',
      name: 'Battery Materials & Components',
      description: 'Lithium, cathode/anode materials, electrolytes, and separators for EV batteries.',
      companiesDetailed: [
        { name: 'Albemarle', ticker: 'ALB', listing: 'US' },
        { name: 'Livent', ticker: 'LTHM', listing: 'US' },
        { name: 'SQM', ticker: 'SQM', listing: 'US' },
        { name: 'Piedmont Lithium', ticker: 'PLL', listing: 'US' },
        { name: 'Sigma Lithium', ticker: 'SGML', listing: 'US' },
        { name: 'Lithium Americas', ticker: 'LAC', listing: 'US' },
        { name: 'MP Materials', ticker: 'MP', listing: 'US' },
      ],
      tags: ['Lithium', 'Cathode', 'Anode'],
    },
    {
      id: 'power-semis',
      name: 'Power Semiconductors (SiC/GaN)',
      description: 'High-voltage devices enabling efficient traction inverters, OBCs, and DC-DC converters.',
      companiesDetailed: [
        { name: 'onsemi', ticker: 'ON', listing: 'US' },
        { name: 'Wolfspeed', ticker: 'WOLF', listing: 'US' },
        { name: 'Infineon', ticker: 'IFNNY', listing: 'ADR' },
        { name: 'STMicroelectronics', ticker: 'STM', listing: 'US' },
        { name: 'NXP Semiconductors', ticker: 'NXPI', listing: 'US' },
      ],
      tags: ['SiC', 'GaN'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'cells-packs',
      name: 'Battery Cells & Packs',
      description: 'Cell manufacturing, module assembly, and pack integration with BMS.',
      companiesDetailed: [
        { name: 'Tesla', ticker: 'TSLA', listing: 'US' },
        { name: 'Panasonic Holdings', ticker: 'PCRFY', listing: 'ADR' },
        { name: 'QuantumScape', ticker: 'QS', listing: 'US' },
        { name: 'Enovix', ticker: 'ENVX', listing: 'US' },
        { name: 'FREYR Battery', ticker: 'FREY', listing: 'US' },
        { name: 'BYD', ticker: 'BYDDY', listing: 'ADR' },
      ],
      tags: ['Cells', 'BMS'],
    },
    {
      id: 'drivetrain',
      name: 'Drivetrain & Power Electronics',
      description: 'Traction inverters, e-axles, motors, onboard chargers, DC-DC converters.',
      companiesDetailed: [
        { name: 'BorgWarner', ticker: 'BWA', listing: 'US' },
        { name: 'Aptiv', ticker: 'APTV', listing: 'US' },
        { name: 'Wolfspeed', ticker: 'WOLF', listing: 'US' },
        { name: 'onsemi', ticker: 'ON', listing: 'US' },
        { name: 'Mobileye', ticker: 'MBLY', listing: 'US' },
      ],
      tags: ['Inverters', 'Motors'],
    },
    {
      id: 'charging-hw',
      name: 'Charging Hardware',
      description: 'Fast DC chargers, AC charging stations, connectors, and power modules.',
      companiesDetailed: [
        { name: 'ChargePoint', ticker: 'CHPT', listing: 'US' },
        { name: 'EVgo', ticker: 'EVGO', listing: 'US' },
        { name: 'Blink Charging', ticker: 'BLNK', listing: 'US' },
        { name: 'Wallbox', ticker: 'WBX', listing: 'US' },
        { name: 'ABB', ticker: 'ABBNY', listing: 'ADR' },
        { name: 'Tritium DCFC', ticker: 'DCFC', listing: 'US' },
        { name: 'Allego', ticker: 'ALLG', listing: 'US' },
      ],
      tags: ['DCFC', 'AC L2'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'ev-oems',
      name: 'EV OEMs',
      description: 'Pure-play and legacy automakers producing battery electric vehicles.',
      companiesDetailed: [
        { name: 'Tesla', ticker: 'TSLA', listing: 'US' },
        { name: 'Rivian', ticker: 'RIVN', listing: 'US' },
        { name: 'Lucid', ticker: 'LCID', listing: 'US' },
        { name: 'BYD', ticker: 'BYDDY', listing: 'ADR' },
        { name: 'NIO', ticker: 'NIO', listing: 'US' },
        { name: 'XPeng', ticker: 'XPEV', listing: 'US' },
        { name: 'Li Auto', ticker: 'LI', listing: 'US' },
        { name: 'Ford', ticker: 'F', listing: 'US' },
        { name: 'General Motors', ticker: 'GM', listing: 'US' },
      ],
      tags: ['BEV'],
    },
    {
      id: 'charging-networks',
      name: 'Charging Networks & Services',
      description: 'Public charging networks, software, and payments.',
      companiesDetailed: [
        { name: 'ChargePoint', ticker: 'CHPT', listing: 'US' },
        { name: 'EVgo', ticker: 'EVGO', listing: 'US' },
        { name: 'Blink Charging', ticker: 'BLNK', listing: 'US' },
        { name: 'Tesla Supercharger', ticker: 'TSLA', listing: 'US' },
        { name: 'Wallbox', ticker: 'WBX', listing: 'US' },
      ],
      tags: ['Roaming', 'Payments'],
    },
  ],
}

export const evProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]




