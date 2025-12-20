export const usData: Record<string, {
    featured: string[]
    nodes: Record<string, string[]>
}> = {}

/* COMMENTED OUT FOR DB TRANSITION
export const usData: Record<string, {
    featured: string[]
    nodes: Record<string, string[]>
}> = {
    semiconductors: {
        featured: ['NVDA', 'AMD', 'INTC', 'TSM', 'AVGO', 'QCOM', 'AMAT', 'ASML', 'LRCX', 'KLAC', 'MU', 'NXPI', 'MRVL', 'MCHP', 'ADI', 'TXN'],
        nodes: {
            'ip-design': ['AVGO', 'QCOM', 'ARM'],
            'ic-design': ['NVDA', 'AMD', 'QCOM', 'AVGO', 'MRVL', 'NXPI', 'MCHP', 'ADI', 'TXN'],
            'wafer-manufacturing': ['TSM', 'INTC', 'MU', 'UMC'],
            'production-equipment': ['ASML', 'AMAT', 'LRCX', 'KLAC', 'TER'],
            'chemicals': ['DOW', 'LIN'],
            'packaging-equipment': ['AMAT', 'KLAC', 'TER'],
            'distribution': ['AVT', 'ARROW'],
            'packaging-testing': ['ASX', 'AMKR']
        }
    },
    'ai-ml': {
        featured: ['NVDA', 'GOOGL', 'MSFT', 'META', 'ORCL', 'CRM', 'PLTR', 'AI', 'SNOW', 'DDOG', 'SMCI', 'PATH', 'MDB', 'CFLT', 'PSTG', 'NET'],
        nodes: {
            'ai-chips': ['NVDA', 'AMD', 'INTC', 'AVGO', 'QCOM', 'ARM', 'SMCI', 'HPE', 'DELL'],
            'data-infrastructure': ['MSFT', 'GOOGL', 'AMZN', 'SNOW', 'MDB', 'CFLT', 'PSTG', 'NTAP'],
            'ml-platforms': ['GOOGL', 'MSFT', 'META', 'AMZN', 'NVDA', 'ORCL', 'IBM', 'PLTR', 'AI'],
            'ai-software': ['GOOGL', 'MSFT', 'ORCL', 'AI', 'PLTR', 'CRM', 'ADBE', 'NOW'],
            'ai-applications': ['CRM', 'MSFT', 'PLTR', 'AI', 'NOW', 'PATH', 'CRWD', 'ADBE', 'WDAY'],
            'ai-services': ['IBM', 'ORCL', 'PLTR', 'ACN', 'CTSH', 'INFY', 'WIT', 'EPAM']
        }
    },
    'cloud-computing': {
        featured: ['AMZN', 'MSFT', 'GOOGL', 'ORCL', 'IBM', 'SNOW', 'NET', 'DDOG', 'MDB', 'CFLT'],
        nodes: {
            'data-center-infrastructure': ['EQIX', 'DLR', 'CCI', 'AMT'],
            'networking-hardware': ['CSCO', 'JNPR', 'ANET'],
            'cloud-platforms': ['AMZN', 'MSFT', 'GOOGL', 'ORCL', 'IBM'],
            'cloud-databases': ['SNOW', 'MDB', 'ORCL', 'CFLT', 'ESTC'],
            'saas-applications': ['CRM', 'MSFT', 'ADBE', 'NOW', 'WDAY'],
            'cloud-management': ['DDOG', 'NET', 'SPLK', 'ESTC']
        }
    },
    'data-centers': {
        featured: ['EQIX', 'DLR', 'IRM', 'AMT', 'CCI', 'SBAC', 'COR', 'GDS', 'VNET'],
        nodes: {
            'data-center-equipment': ['VRT', 'ETN', 'CAT'],
            'data-center-operators': ['EQIX', 'DLR', 'IRM'],
            'data-center-services': ['IBM', 'KND', 'DXC']
        }
    },
    'cybersecurity': {
        featured: ['CRWD', 'PANW', 'ZS', 'FTNT', 'OKTA', 'S', 'CYBR', 'NET', 'TENB', 'QLYS'],
        nodes: {
            'threat-intelligence': ['CRWD', 'PANW', 'FTNT'],
            'security-hardware': ['PANW', 'FTNT', 'CSCO'],
            'endpoint-security': ['CRWD', 'S', 'PANW', 'MSFT'],
            'network-security': ['PANW', 'FTNT', 'ZS', 'CSCO'],
            'identity-access': ['OKTA', 'CYBR', 'MSFT'],
            'cloud-security': ['ZS', 'CRWD', 'PANW', 'OKTA'],
            'security-services': ['PANW', 'CRWD', 'IBM']
        }
    },
    'software-saas': {
        featured: ['MSFT', 'CRM', 'ADBE', 'NOW', 'TEAM', 'WDAY', 'SNOW', 'DDOG', 'ZM', 'DOCU', 'HUBS', 'ZI', 'BILL', 'VEEV'],
        nodes: {
            'development-tools': ['MSFT', 'TEAM', 'GTLB'],
            'enterprise-apps': ['CRM', 'MSFT', 'ORCL', 'SAP', 'WDAY'],
            'collaboration': ['MSFT', 'ZM', 'TEAM', 'DOCU', 'WORK'],
            'analytics': ['SNOW', 'DDOG', 'SPLK', 'DOMO'],
            'vertical-saas': ['VEEV', 'HUBS', 'BILL', 'ZI'],
            'integration': ['MDB', 'CFLT', 'PLTR']
        }
    },
    'electric-vehicles': {
        featured: ['TSLA', 'RIVN', 'LCID', 'F', 'GM', 'NIO', 'XPEV', 'LI', 'BYDDY', 'CHPT', 'BLNK', 'EVGO', 'ALB', 'SQM', 'LAC', 'WBX'],
        nodes: {
            'raw-materials': ['ALB', 'SQM', 'LAC', 'LTHM', 'MP', 'PLL', 'SGML'],
            'battery-materials': ['ALB', 'SQM', 'LTHM', 'PLL', 'SGML'],
            'battery-cells': ['TSLA', 'PCRFY', 'QS', 'ENVX', 'FREY'],
            'battery-packs': ['TSLA'],
            'power-electronics': ['ON', 'WOLF', 'IFNNY', 'STM', 'NXPI'],
            'ev-components': ['APTV', 'LEA', 'BWA', 'MBLY'],
            'pure-ev': ['TSLA', 'RIVN', 'LCID', 'NIO', 'XPEV', 'LI'],
            'traditional-oems': ['F', 'GM', 'STLA'],
            'vehicle-manufacturing': ['TSLA', 'RIVN', 'LCID', 'F', 'GM', 'NIO', 'XPEV', 'LI'],
            'charging-infrastructure': ['CHPT', 'BLNK', 'EVGO', 'TSLA', 'WBX', 'ABBNY'],
            'sales-service': ['TSLA', 'RIVN']
        }
    },
    'solar-energy': {
        featured: ['ENPH', 'SEDG', 'FSLR', 'RUN', 'NOVA', 'MAXN', 'CSIQ', 'DQ', 'JKS', 'SPWR'],
        nodes: {
            'polysilicon': ['DQ', 'GCL'],
            'wafer-production': ['JKS', 'CSIQ'],
            'solar-cells': ['FSLR', 'CSIQ', 'JKS', 'SPWR'],
            'solar-panels': ['FSLR', 'CSIQ', 'JKS', 'MAXN', 'SPWR'],
            'inverters': ['ENPH', 'SEDG', 'FSLR'],
            'residential-install': ['RUN', 'NOVA', 'SPWR'],
            'commercial-utility': ['FSLR', 'NEE', 'AES']
        }
    },
    'energy-storage': {
        featured: ['TSLA', 'ENPH', 'BE', 'QS', 'CHPT', 'ALB', 'STEM', 'FCEL', 'PLUG', 'BLDP'],
        nodes: {
            'storage-cells': ['QS', 'FREY'],
            'battery-systems': ['TSLA', 'ENPH', 'STEM', 'FLUENCE'],
            'hydrogen-storage': ['PLUG', 'BE', 'FCEL', 'BLDP'],
            'grid-integration': ['STEM', 'FLUENCE']
        }
    },
    'biotechnology': {
        featured: ['AMGN', 'GILD', 'VRTX', 'REGN', 'MRNA', 'BNTX', 'ILMN', 'CRSP', 'NTLA', 'BEAM'],
        nodes: {
            'drug-discovery': ['VRTX', 'REGN', 'INCY'],
            'genomics': ['ILMN', 'PACB', 'CRSP', 'NTLA', 'BEAM'],
            'biologics-manufacturing': ['AMGN', 'GILD', 'MRNA', 'BNTX'],
            'clinical-trials': ['IQV', 'CRL']
        }
    },
    'medical-devices': {
        featured: ['MDT', 'ABT', 'ISRG', 'SYK', 'BSX', 'EW', 'DXCM', 'PODD', 'ALGN', 'ZBH'],
        nodes: {
            'surgical-robotics': ['ISRG', 'MDT', 'JNJ'],
            'cardiovascular': ['MDT', 'EW', 'BSX', 'ABT'],
            'orthopedics': ['SYK', 'ZBH', 'SNN'],
            'diabetes-care': ['DXCM', 'PODD', 'ABT'],
            'dental': ['ALGN', 'XRAY'],
            'diagnostics': ['TMO', 'DHR', 'ABT']
        }
    },
    'digital-health': {
        featured: ['TDOC', 'DOCS', 'GH', 'RGEN', 'TXG', 'SDGR'],
        nodes: {
            'telehealth': ['TDOC', 'AMWL'],
            'health-platforms': ['DOCS', 'API'],
            'health-data': ['RGEN', 'TXG', 'SDGR']
        }
    },
    'pharmaceuticals': {
        featured: ['LLY', 'JNJ', 'PFE', 'ABBV', 'MRK', 'BMY', 'AMGN', 'GILD'],
        nodes: {
            'pharma-manufacturing': ['LLY', 'JNJ', 'PFE', 'ABBV', 'MRK', 'BMY'],
            'drug-distribution': ['MCK', 'COR', 'CAH']
        }
    },
    'fintech': {
        featured: ['PYPL', 'SQ', 'COIN', 'HOOD', 'AFRM', 'SOFI', 'UPST', 'BILL', 'MQ', 'TOST'],
        nodes: {
            'payments': ['PYPL', 'SQ', 'MQ', 'TOST', 'ADYEY'],
            'lending': ['AFRM', 'SOFI', 'UPST', 'LC'],
            'crypto-blockchain': ['COIN', 'HOOD', 'MARA', 'RIOT'],
            'wealth-tech': ['HOOD', 'SOFI', 'SCHW'],
            'financial-software': ['BILL', 'INTU', 'NCNO']
        }
    },
    'ecommerce': {
        featured: ['AMZN', 'SHOP', 'EBAY', 'ETSY', 'W', 'MELI', 'CPNG', 'SE', 'CHWY'],
        nodes: {
            'marketplaces': ['AMZN', 'EBAY', 'ETSY', 'MELI', 'CPNG', 'SE'],
            'ecom-platforms': ['SHOP', 'WIX', 'SQ'],
            'niche-retail': ['W', 'CHWY', 'RVLV'],
            'logistics-delivery': ['UPS', 'FDX', 'UBER', 'DASH']
        }
    }
}
*/
