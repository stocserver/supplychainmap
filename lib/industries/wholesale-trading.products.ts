import { ValueChainStageProducts } from "../../data/structure"

export const wholesaleTradingProducts: ValueChainStageProducts[] = [
    {
        stage: 'upstream',
        stageLabel: 'Sourcing & Supply',
        products: [
            {
                id: 'general-trading',
                name: 'General Wholesale Trading',
                description: 'Conglomerates trading in a wide range of products from energy to food.',
                tags: ['general-trading']
            },
            {
                id: 'specialized-trading',
                name: 'Specialized Trading',
                description: 'Trading companies focused on specific sectors like diverse electronics or medical supplies.',
                tags: ['specialized-trading']
            }
        ]
    }, // midstream
    {
        stage: 'midstream',
        stageLabel: 'Distribution & Logistics',
        products: [
            {
                id: 'industrial-supply',
                name: 'Industrial Materials Distribution',
                description: 'Distribution of machinery, parts, and industrial materials.',
                tags: ['industrial-supply']
            },
            {
                id: 'export-import',
                name: 'International Trade Logistics',
                description: 'Specialized logistics and customs brokerage services.',
                tags: ['export-import']
            }
        ]
    },
    {
        stage: 'downstream',
        stageLabel: 'Retail & Sales',
        products: [
            {
                id: 'wholesale-distribution',
                name: 'Wholesale to Retail Distribution',
                description: 'Direct supply to retailers and businesses.',
                tags: ['wholesale-distribution']
            },
            {
                id: 'diversified-holdings',
                name: 'Investment & Trading Holdings',
                description: 'Investment and holding operations.',
                tags: ['diversified-holdings']
            }
        ]
    }
]
