export const cnData: Record<string, {
    featured: string[]
    nodes: Record<string, string[]>
}> = {
    semiconductors: {
        featured: ['0981.HK', '1347.HK', '603986.SS', '603501.SS', '002371.SZ', '688981.SS', '600584.SS'],
        nodes: {
            // IP & Design
            'ip-design': ['603068.SS', '300613.SZ'], // VeriSilicon, Unigroup Guoxin
            'ic-design': ['300782.SZ', '603986.SS', '603501.SS', '300456.SZ'], // GigaDevice, Will Semi, GTA Semi
            // Manufacturing
            'wafer-manufacturing': ['0981.HK', '1347.HK', '688981.SS'], // SMIC, Hua Hong
            'production-equipment': ['603806.SS', '688012.SS'], // AMEC, Naura
            'chemicals': ['600460.SS', '300037.SZ'], // Silan, Neway
            'photomasks': ['688037.SS'], // Shenzhen Longsys
            // Packaging
            'packaging-testing': ['600584.SS', '002156.SZ'], // JCET, TongFu
            'packaging-equipment': ['688037.SS'],
            'distribution': ['300184.SZ', '000021.SZ'] // CECEP, Shenzhen Kaifa
        }
    },
    'electric-vehicles': {
        featured: ['1211.HK', '9866.HK', '2015.HK', '9868.HK', '002594.SZ'],
        nodes: {
            'raw-materials': ['002460.SZ', '002466.SZ'], // Ganfeng Lithium, Tianqi
            'battery-cells': ['300750.SZ', '002594.SZ'], // CATL, BYD
            'battery-packs': ['300750.SZ'],
            'pure-ev': ['9866.HK', '2015.HK', '9868.HK'], // NIO, Li Auto, Xpeng
            'traditional-oems': ['1211.HK', '0175.HK'], // BYD, Geely
            'vehicle-manufacturing': ['1211.HK', '9866.HK', '2015.HK'],
            'charging-infrastructure': ['300001.SZ'] // TELD
        }
    },
    'solar-energy': {
        featured: ['688599.SS', '601012.SS', '000591.SZ', '600438.SS'],
        nodes: {
            'polysilicon': ['600438.SS', '002518.SZ'], // Tongwei
            'wafer-production': ['601012.SS'], // Longi
            'solar-cells': ['000591.SZ'], // Chint
            'solar-panels': ['688599.SS', '601012.SS'] // Trina, Longi
        }
    }
}
