import { ValueChainStageProducts } from "../../data/structure"

export const heavyIndustryProducts: ValueChainStageProducts[] = [
    {
        stage: 'upstream',
        stageLabel: 'Materials & Engineering',
        products: [
            {
                id: 'steel-metals',
                name: 'Specialty Steel & Alloy Production',
                description: 'High-grade steel and alloys for heavy machinery.',
                tags: ['steel-metals']
            },
            {
                id: 'engineering-services',
                name: 'Heavy Industrial Engineering & Design',
                description: 'Design and engineering for plants and infrastructure.',
                tags: ['engineering-services']
            }
        ]
    },
    {
        stage: 'midstream',
        stageLabel: 'Manufacturing',
        products: [
            {
                id: 'shipbuilding',
                name: 'Naval & Commercial Shipbuilding',
                description: 'Construction of commercial and naval vessels.',
                tags: ['shipbuilding']
            },
            {
                id: 'power-systems',
                name: 'Power Generation Systems & Turbines',
                description: 'Gas turbines, steam turbines, and power generators.',
                tags: ['power-systems']
            },
            {
                id: 'industrial-machinery',
                name: 'Heavy Industrial & Construction Machinery',
                description: 'Construction equipment, forklifts, and factory robots.',
                tags: ['industrial-machinery']
            }
        ]
    },
    {
        stage: 'downstream',
        stageLabel: 'Infrastructure',
        products: [
            {
                id: 'plant-construction',
                name: 'Industrial Plant Construction & Commissioning',
                description: 'Building of energy and chemical plants.',
                tags: ['plant-construction']
            },
            {
                id: 'rail-rolling-stock',
                name: 'Rail Rolling Stock Manufacturing',
                description: 'Manufacturing of trains and rail cars.',
                tags: ['rail-rolling-stock']
            }
        ]
    }
]
