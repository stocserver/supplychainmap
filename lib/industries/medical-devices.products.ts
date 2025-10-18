import { ValueChainStageProducts } from "@/lib/data/industries"

export const medicalDevicesProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'Components & Materials',
    layout: 'flow',
    products: [
      {
        id: 'components',
        name: 'Medical Device Components',
        description: 'Specialized components and materials for medical devices',
        longDescription: 'Manufacturing and supply of specialized components, materials, and subsystems essential for the assembly of medical devices. This includes high-precision sensors, advanced electronics, biocompatible polymers and metals, and other critical inputs that ensure the safety, performance, and reliability of medical technology.',
        companiesDetailed: [
          { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
          { name: 'Johnson & Johnson', ticker: 'JNJ', listing: 'US' },
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Boston Scientific', ticker: 'BSX', listing: 'US' },
          { name: 'Stryker', ticker: 'SYK', listing: 'US' },
          { name: 'Baxter International', ticker: 'BAX', listing: 'US' },
          { name: 'Becton Dickinson', ticker: 'BDX', listing: 'US' },
          { name: 'Zimmer Biomet', ticker: 'ZBH', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'biocompatible-materials',
            name: 'Biocompatible Materials',
            description: 'Materials safe for medical use',
            longDescription: 'Development and supply of materials designed to be compatible with biological systems, minimizing adverse reactions when used in medical devices and implants. Examples include medical-grade polymers, ceramics, and metals used in various applications from surgical tools to long-term implants.',
            companiesDetailed: [
              { name: 'Johnson & Johnson', ticker: 'JNJ', listing: 'US' },
              { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
              { name: 'Baxter International', ticker: 'BAX', listing: 'US' }
            ]
          },
          {
            id: 'medical-electronics',
            name: 'Medical Electronics',
            description: 'Electronic components for devices',
            longDescription: 'Design and manufacturing of specialized electronic components, integrated circuits, and embedded systems tailored for medical devices. This includes low-power sensors, microcontrollers, connectivity modules, and processing units that enable advanced diagnostic and therapeutic functions.',
            companiesDetailed: [
              { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
              { name: 'Boston Scientific', ticker: 'BSX', listing: 'US' },
              { name: 'Stryker', ticker: 'SYK', listing: 'US' }
            ]
          }
        ],
        tags: ['Components', 'Materials', 'Electronics', 'Biocompatible']
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'Device Manufacturing',
    layout: 'hybrid',
    products: [
      {
        id: 'device-manufacturing',
        name: 'Medical Device Manufacturing',
        description: 'Manufacturing of complete medical devices',
        longDescription: 'Full-cycle design, development, and manufacturing of a wide array of medical devices, encompassing everything from simple surgical instruments to complex implants, diagnostic imaging equipment, and advanced robotic surgical systems. This segment operates under stringent regulatory requirements to ensure product safety and efficacy.',
        companiesDetailed: [
          { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
          { name: 'Johnson & Johnson', ticker: 'JNJ', listing: 'US' },
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Boston Scientific', ticker: 'BSX', listing: 'US' },
          { name: 'Stryker', ticker: 'SYK', listing: 'US' },
          { name: 'Baxter International', ticker: 'BAX', listing: 'US' },
          { name: 'Becton Dickinson', ticker: 'BDX', listing: 'US' },
          { name: 'Zimmer Biomet', ticker: 'ZBH', listing: 'US' },
          { name: 'Intuitive Surgical', ticker: 'ISRG', listing: 'US' },
          { name: 'Edwards Lifesciences', ticker: 'EW', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'surgical-devices',
            name: 'Surgical Devices',
            description: 'Surgical instruments and equipment',
            longDescription: 'Manufacturing of a broad range of instruments and equipment used in surgical procedures, from basic scalpels and clamps to advanced endoscopic tools, robotic surgical systems, and operating room integration solutions. These devices are critical for precision, safety, and efficiency in surgery.',
            companiesDetailed: [
              { name: 'Intuitive Surgical', ticker: 'ISRG', listing: 'US' },
              { name: 'Stryker', ticker: 'SYK', listing: 'US' },
              { name: 'Medtronic', ticker: 'MDT', listing: 'US' }
            ]
          },
          {
            id: 'implants',
            name: 'Medical Implants',
            description: 'Orthopedic and cardiovascular implants',
            longDescription: 'Production of devices designed to be permanently or temporarily inserted into the body to replace missing biological structures, support damaged areas, or deliver therapy. This includes orthopedic implants (e.g., joint replacements), cardiovascular implants (e.g., pacemakers, stents), and neurostimulation devices.',
            companiesDetailed: [
              { name: 'Zimmer Biomet', ticker: 'ZBH', listing: 'US' },
              { name: 'Stryker', ticker: 'SYK', listing: 'US' },
              { name: 'Edwards Lifesciences', ticker: 'EW', listing: 'US' }
            ]
          }
        ],
        tags: ['Manufacturing', 'Surgical', 'Implants', 'Devices']
      },
      {
        id: 'diagnostic-equipment',
        name: 'Diagnostic Equipment',
        description: 'Medical diagnostic and imaging equipment',
        longDescription: 'Manufacturing of equipment used to diagnose diseases, monitor health conditions, and provide detailed insights into the human body. This encompasses a wide range of technologies, including advanced imaging systems (MRI, CT, X-ray, ultrasound), laboratory analyzers for blood and tissue, and point-of-care diagnostic devices.',
        companiesDetailed: [
          { name: 'General Electric', ticker: 'GE', listing: 'US' },
          { name: 'Siemens', ticker: 'SIEGY', listing: 'ADR' },
          { name: 'Philips', ticker: 'PHG', listing: 'ADR' },
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Danaher', ticker: 'DHR', listing: 'US' },
          { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
          { name: 'Becton Dickinson', ticker: 'BDX', listing: 'US' },
          { name: 'Hologic', ticker: 'HOLX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'imaging-systems',
            name: 'Medical Imaging Systems',
            description: 'MRI, CT, X-ray, and ultrasound equipment',
            longDescription: 'Production of advanced medical imaging modalities such as Magnetic Resonance Imaging (MRI), Computed Tomography (CT), X-ray, and Ultrasound machines. These systems provide non-invasive views into the body\'s structures and functions, aiding in diagnosis and treatment planning.',
            companiesDetailed: [
              { name: 'General Electric', ticker: 'GE', listing: 'US' },
              { name: 'Siemens', ticker: 'SIEGY', listing: 'ADR' },
              { name: 'Philips', ticker: 'PHG', listing: 'ADR' }
            ]
          },
          {
            id: 'laboratory-analyzers',
            name: 'Laboratory Analyzers',
            description: 'Clinical laboratory equipment',
            longDescription: 'Manufacturing of automated instruments and systems used in clinical laboratories for analyzing biological samples (blood, urine, tissue). These analyzers perform tests for chemistry, hematology, immunology, and molecular diagnostics, crucial for disease detection and monitoring.',
            companiesDetailed: [
              { name: 'Danaher', ticker: 'DHR', listing: 'US' },
              { name: 'Thermo Fisher Scientific', ticker: 'TMO', listing: 'US' },
              { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' }
            ]
          }
        ],
        tags: ['Diagnostics', 'Imaging', 'Laboratory', 'Equipment']
      },
      {
        id: 'wearables',
        name: 'Medical Wearables',
        description: 'Wearable medical devices and monitoring systems',
        longDescription: 'Development and commercialization of wearable devices designed to continuously monitor physiological parameters, track health metrics, and provide remote patient care. This includes smartwatches, continuous glucose monitors, cardiac rhythm recorders, and other sensors that offer personalized health insights and facilitate early intervention.',
        companiesDetailed: [
          { name: 'Apple', ticker: 'AAPL', listing: 'US' },
          { name: 'Alphabet', ticker: 'GOOGL', listing: 'US' },
          { name: 'Garmin', ticker: 'GRMN', listing: 'US' },
          { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
          { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
          { name: 'Dexcom', ticker: 'DXCM', listing: 'US' },
          { name: 'iRhythm Technologies', ticker: 'IRTC', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'continuous-monitoring',
            name: 'Continuous Monitoring',
            description: 'Continuous glucose and cardiac monitoring',
            longDescription: 'Devices and systems that provide real-time, continuous measurement of vital health parameters, such as blood glucose levels (CGM) for diabetes management and cardiac rhythms for arrhythmia detection. These technologies enable proactive health management and remote oversight by healthcare providers.',
            companiesDetailed: [
              { name: 'Dexcom', ticker: 'DXCM', listing: 'US' },
              { name: 'Abbott Laboratories', ticker: 'ABT', listing: 'US' },
              { name: 'iRhythm Technologies', ticker: 'IRTC', listing: 'US' }
            ]
          },
          {
            id: 'fitness-trackers',
            name: 'Fitness Trackers',
            description: 'Health and fitness monitoring devices',
            longDescription: 'Wearable devices designed to track and provide insights into an individual\'s physical activity, sleep patterns, heart rate, and other wellness metrics. These devices aim to promote healthy lifestyles and offer personal data for fitness and well-being management.',
            companiesDetailed: [
              { name: 'Apple', ticker: 'AAPL', listing: 'US' },
              { name: 'Garmin', ticker: 'GRMN', listing: 'US' }
            ]
          }
        ],
        tags: ['Wearables', 'Monitoring', 'Health Tracking', 'Remote Care']
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'Distribution & Services',
    layout: 'grid',
    products: [
      {
        id: 'distribution-sales',
        name: 'Medical Device Distribution',
        description: 'Distribution and sales of medical devices',
        longDescription: 'Logistics and sales channels responsible for delivering medical devices from manufacturers to healthcare providers, hospitals, clinics, and other points of care. This includes inventory management, warehousing, order fulfillment, and regulatory-compliant transportation, ensuring timely and safe supply.',
        companiesDetailed: [
          { name: 'McKesson', ticker: 'MCK', listing: 'US' },
          { name: 'Cardinal Health', ticker: 'CAH', listing: 'US' },
          { name: 'AmerisourceBergen', ticker: 'ABC', listing: 'US' },
          { name: 'Henry Schein', ticker: 'HSIC', listing: 'US' },
          { name: 'Patterson Companies', ticker: 'PDCO', listing: 'US' },
          { name: 'Owens & Minor', ticker: 'OMI', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'hospital-distribution',
            name: 'Hospital Distribution',
            description: 'Medical device distribution to hospitals',
            longDescription: 'Specialized distribution services focused on supplying a wide range of medical devices, equipment, and supplies directly to hospitals and large healthcare systems. This often involves managing complex logistics, sterile products, and just-in-time inventory for critical care.',
            companiesDetailed: [
              { name: 'McKesson', ticker: 'MCK', listing: 'US' },
              { name: 'Cardinal Health', ticker: 'CAH', listing: 'US' },
              { name: 'AmerisourceBergen', ticker: 'ABC', listing: 'US' }
            ]
          },
          {
            id: 'dental-distribution',
            name: 'Dental Distribution',
            description: 'Dental equipment and supplies',
            longDescription: 'Distribution of dental equipment, instruments, and supplies to dental practices, clinics, and laboratories. This includes everything from hand tools and imaging systems to restorative materials and orthodontic supplies, catering to the specific needs of dental care.',
            companiesDetailed: [
              { name: 'Henry Schein', ticker: 'HSIC', listing: 'US' },
              { name: 'Patterson Companies', ticker: 'PDCO', listing: 'US' }
            ]
          }
        ],
        tags: ['Distribution', 'Sales', 'Logistics', 'Healthcare']
      },
      {
        id: 'service-support',
        name: 'Service & Support',
        description: 'Medical device maintenance and support services',
        longDescription: 'Provision of post-sale services for medical devices, including installation, preventative maintenance, repair, calibration, and technical support. These services ensure the optimal functioning, longevity, and regulatory compliance of medical equipment throughout its lifecycle.',
        companiesDetailed: [
          { name: 'General Electric', ticker: 'GE', listing: 'US' },
          { name: 'Siemens', ticker: 'SIEGY', listing: 'ADR' },
          { name: 'Philips', ticker: 'PHG', listing: 'ADR' },
          { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
          { name: 'Stryker', ticker: 'SYK', listing: 'US' },
          { name: 'Boston Scientific', ticker: 'BSX', listing: 'US' }
        ],
        subProducts: [
          {
            id: 'maintenance-repair',
            name: 'Maintenance & Repair',
            description: 'Device maintenance and repair services',
            longDescription: 'Specialized services focused on the upkeep, troubleshooting, and repair of medical devices and equipment. This includes routine maintenance, calibration, component replacement, and emergency repairs to ensure devices operate safely and accurately, minimizing downtime in clinical settings.',
            companiesDetailed: [
              { name: 'General Electric', ticker: 'GE', listing: 'US' },
              { name: 'Siemens', ticker: 'SIEGY', listing: 'ADR' },
              { name: 'Philips', ticker: 'PHG', listing: 'ADR' }
            ]
          },
          {
            id: 'training-support',
            name: 'Training & Support',
            description: 'Clinical training and technical support',
            longDescription: 'Provision of educational programs, workshops, and technical assistance to healthcare professionals on the proper use, operation, and maintenance of medical devices. This ensures clinicians are proficient with new technologies and can provide optimal patient care.',
            companiesDetailed: [
              { name: 'Medtronic', ticker: 'MDT', listing: 'US' },
              { name: 'Stryker', ticker: 'SYK', listing: 'US' },
              { name: 'Boston Scientific', ticker: 'BSX', listing: 'US' }
            ]
          }
        ],
        tags: ['Service', 'Maintenance', 'Training', 'Support']
      }
    ]
  }
]
