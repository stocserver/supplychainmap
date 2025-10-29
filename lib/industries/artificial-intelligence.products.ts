import { ValueChainStageProducts } from "@/lib/data/industries"

export const artificialIntelligenceProductStages: ValueChainStageProducts[] = [
  {
    stage: 'upstream',
    stageLabel: 'AI Compute & Data Infrastructure',
    layout: 'grid',
    products: [
      {
        id: 'ai-chips',
        name: 'AI Chips & Systems',
        description: 'GPUs, accelerators, and systems for AI training and inference',
        longDescription: 'Specialized hardware components, including Graphics Processing Units (GPUs), Application-Specific Integrated Circuits (ASICs), and Field-Programmable Gate Arrays (FPGAs), designed to accelerate AI and machine learning workloads. These systems provide the computational power required for training complex neural networks and performing high-speed inference.',
        companiesDetailed: [
          { name: 'NVIDIA', ticker: 'NVDA', listing: 'US' },
          { name: 'AMD', ticker: 'AMD', listing: 'US' },
          { name: 'Intel', ticker: 'INTC', listing: 'US' },
          { name: 'Marvell', ticker: 'MRVL', listing: 'US' },
          { name: 'Super Micro Computer', ticker: 'SMCI', listing: 'US' },
          { name: 'Broadcom', ticker: 'AVGO', listing: 'US' },
          { name: 'Qualcomm', ticker: 'QCOM', listing: 'US' },
          { name: 'Arm', ticker: 'ARM', listing: 'US' },
          { name: 'Hewlett Packard Enterprise', ticker: 'HPE', listing: 'US' },
          { name: 'Dell Technologies', ticker: 'DELL', listing: 'US' }
        ]
      },
      {
        id: 'data-infrastructure',
        name: 'Data Infrastructure',
        description: 'Data platforms, pipelines, observability for AI workloads',
        longDescription: 'Foundational systems and tools for managing, processing, and analyzing the vast amounts of data required for AI development. This includes data lakes, data warehouses, ETL pipelines, and observability tools that ensure data quality and availability for training and deploying AI models.',
        companiesDetailed: [
          { name: 'Snowflake', ticker: 'SNOW', listing: 'US' },
          { name: 'Datadog', ticker: 'DDOG', listing: 'US' },
          { name: 'Elastic', ticker: 'ESTC', listing: 'US' },
          { name: 'MongoDB', ticker: 'MDB', listing: 'US' },
          { name: 'Confluent', ticker: 'CFLT', listing: 'US' },
          { name: 'Pure Storage', ticker: 'PSTG', listing: 'US' },
          { name: 'NetApp', ticker: 'NTAP', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'midstream',
    stageLabel: 'ML Platforms & MLOps',
    layout: 'hybrid',
    products: [
      {
        id: 'ml-platforms',
        name: 'ML Platforms',
        description: 'Model development, training, hosting, and API platforms',
        longDescription: 'Integrated platforms that provide tools and services for the entire machine learning lifecycle, from data preparation and model development to training, deployment, and management. These platforms often offer features like automated machine learning (AutoML), experiment tracking, and model serving via APIs.',
        companiesDetailed: [
          { name: 'Microsoft (Azure AI)', ticker: 'MSFT', listing: 'US' },
          { name: 'Alphabet (Google Cloud AI)', ticker: 'GOOGL', listing: 'US' },
          { name: 'Amazon (AWS AI)', ticker: 'AMZN', listing: 'US' },
          { name: 'NVIDIA (AI Enterprise)', ticker: 'NVDA', listing: 'US' },
          { name: 'Oracle (OCI AI)', ticker: 'ORCL', listing: 'US' },
          { name: 'IBM (watsonx)', ticker: 'IBM', listing: 'US' },
          { name: 'Palantir', ticker: 'PLTR', listing: 'US' },
          { name: 'C3.ai', ticker: 'AI', listing: 'US' }
        ]
      },
      {
        id: 'mlops',
        name: 'MLOps & ModelOps',
        description: 'Experiment tracking, deployment, monitoring, and governance',
        longDescription: 'Practices and tools for operationalizing machine learning models in production environments. MLOps focuses on automating and standardizing the deployment, monitoring, and management of ML models to ensure reliability, scalability, and compliance, bridging the gap between data science and operations.',
        companiesDetailed: [
          { name: 'Datadog', ticker: 'DDOG', listing: 'US' },
          { name: 'Snowflake', ticker: 'SNOW', listing: 'US' },
          { name: 'Dynatrace', ticker: 'DT', listing: 'US' },
          { name: 'Elastic', ticker: 'ESTC', listing: 'US' }
        ]
      }
    ]
  },
  {
    stage: 'downstream',
    stageLabel: 'AI Applications',
    layout: 'grid',
    products: [
      {
        id: 'ai-software',
        name: 'AI Software',
        description: 'Applied AI in productivity, security, and analytics',
        longDescription: 'Software solutions that embed AI capabilities to enhance various business functions, including productivity tools (e.g., AI assistants), cybersecurity platforms (e.g., threat detection), and advanced analytics applications. These solutions leverage AI models to automate tasks, provide insights, and improve decision-making.',
        companiesDetailed: [
          { name: 'ServiceNow', ticker: 'NOW', listing: 'US' },
          { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
          { name: 'Adobe', ticker: 'ADBE', listing: 'US' },
          { name: 'Salesforce', ticker: 'CRM', listing: 'US' },
          { name: 'Palantir', ticker: 'PLTR', listing: 'US' },
          { name: 'UiPath', ticker: 'PATH', listing: 'US' },
          { name: 'Intuit', ticker: 'INTU', listing: 'US' }
        ]
      }
    ]
  }
]


