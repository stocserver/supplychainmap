import { ValueChainStageProducts } from "../../data/structure"

export const consumerElectronicsProducts: ValueChainStageProducts[] = [
    {
        stage: 'upstream',
        stageLabel: 'Component Sourcing & Development',
        products: [
            {
                id: 'electronic-components',
                name: 'Electronic Components',
                description: 'Core components like capacitors, resistors, and PCBs.',
                tags: ['electronic-components']
            },
            {
                id: 'display-technology',
                name: 'Display Panels',
                description: 'LCD, OLED, and other display technologies.',
                tags: ['display-panels']
            }
        ]
    },
    {
        stage: 'midstream',
        stageLabel: 'Product Assembly & Manufacturing',
        products: [
            {
                id: 'audio-video',
                name: 'Audio / Video Equipment',
                description: 'Headphones, speakers, cameras, and televisions.',
                tags: ['audio-video']
            },
            {
                id: 'imaging-optical',
                name: 'Imaging & Optical',
                description: 'Cameras, lenses, and copiers/printers.',
                tags: ['imaging-optical']
            },
            {
                id: 'appliances',
                name: 'Home Appliances',
                description: 'Refrigerators, washing machines, and HVAC.',
                tags: ['appliances']
            }
        ]
    },
    {
        stage: 'downstream',
        stageLabel: 'Distribution & End-User Sales',
        products: [
            {
                id: 'gaming',
                name: 'Video Games & Consoles',
                description: 'Gaming hardware and software.',
                tags: ['gaming', 'console-games']
            },
            {
                id: 'consumer-devices',
                name: 'Personal Devices',
                description: 'Wearables, smartphones, and tablets.',
                tags: ['consumer-devices']
            }
        ]
    }
]
