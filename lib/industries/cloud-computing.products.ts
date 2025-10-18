import type { ProductCategory, ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'dc-infra',
      name: 'Data Center Infrastructure',
      description:
        'Facilities, power, cooling, and interconnection platforms that underpin cloud availability and performance.',
      longDescription:
        'Colocation and interconnection hubs provide resilient power, cooling, and connectivity for cloud regions and on-ramps. Neutral meet-me fabrics and dense peering ecosystems reduce latency and transit costs. Designs emphasize PUE efficiency, modularity, and fault-tolerant topologies.',
      companiesDetailed: [
        { name: 'Equinix', ticker: 'EQIX', listing: 'US' },
        { name: 'Digital Realty', ticker: 'DLR', listing: 'US' },
        { name: 'Crown Castle', ticker: 'CCI', listing: 'US' },
        { name: 'American Tower', ticker: 'AMT', listing: 'US' },
      ],
      tags: ['Colocation', 'Interconnect'],
    },
    {
      id: 'network-hw',
      name: 'Networking Hardware',
      description:
        'Switches, routers, and data center networking fabrics enabling east–west/edge connectivity at scale.',
      longDescription:
        'High-performance data center networking platforms built for leaf-spine and AI/HPC fabrics, enabling low-latency east–west traffic and scalable edge aggregation. Focus on merchant silicon, SRv6/EVPN, and automation/telemetry at massive scale.',
      companiesDetailed: [
        { name: 'Cisco', ticker: 'CSCO', listing: 'US' },
        { name: 'Juniper Networks', ticker: 'JNPR', listing: 'US' },
        { name: 'Arista Networks', ticker: 'ANET', listing: 'US' },
      ],
      tags: ['DCN', 'Routing', 'Switching'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'iaas-paas',
      name: 'Cloud Platforms (IaaS/PaaS)',
      description:
        'Compute, storage, and networking primitives plus managed platform services for building applications.',
      longDescription:
        'IaaS provides elastic infrastructure (VMs, storage, VPC) while PaaS layers managed services (Kubernetes, serverless, queues, analytics). Differentiation includes global footprint, price/perf, egress costs, resiliency SLAs, and service breadth. Enterprise adoption hinges on governance, IAM, and hybrid connectivity.',
      companiesDetailed: [
        { name: 'Amazon Web Services (Amazon)', ticker: 'AMZN', listing: 'US' },
        { name: 'Microsoft Azure (Microsoft)', ticker: 'MSFT', listing: 'US' },
        { name: 'Google Cloud (Alphabet)', ticker: 'GOOGL', listing: 'US' },
        { name: 'Oracle Cloud', ticker: 'ORCL', listing: 'US' },
        { name: 'IBM Cloud', ticker: 'IBM', listing: 'US' },
      ],
      tags: ['Compute', 'Storage', 'Networking'],
    },
    {
      id: 'databases-storage',
      name: 'Cloud Databases & Storage',
      description:
        'Managed databases, data warehouses, streaming, and scalable object/block/file storage.',
      longDescription:
        'Fully managed data services spanning OLTP/OLAP databases, data lakehouses, streaming platforms, and multi-tier storage. Priorities include performance/consistency, elasticity, durability (11x9s), and cross-region replication for resilience.',
      companiesDetailed: [
        { name: 'Snowflake', ticker: 'SNOW', listing: 'US' },
        { name: 'MongoDB', ticker: 'MDB', listing: 'US' },
        { name: 'Confluent', ticker: 'CFLT', listing: 'US' },
        { name: 'Oracle', ticker: 'ORCL', listing: 'US' },
        { name: 'Elastic', ticker: 'ESTC', listing: 'US' },
      ],
      tags: ['Data Warehouse', 'NoSQL', 'Streaming'],
    },
    {
      id: 'cdn-edge',
      name: 'CDN & Edge Compute',
      description:
        'Global content delivery, security at the edge, and serverless compute near users.',
      longDescription:
        'Distributed edge networks that cache content close to users and run serverless functions at the edge for low-latency personalization, security (WAF/DDoS), and API acceleration. Emphasizes PoP density, egress locality, and developer tooling.',
      companiesDetailed: [
        { name: 'Cloudflare', ticker: 'NET', listing: 'US' },
        { name: 'Akamai', ticker: 'AKAM', listing: 'US' },
      ],
      tags: ['CDN', 'WAF', 'Serverless Edge'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'saas',
      name: 'SaaS Applications',
      description: 'Enterprise applications delivered as a service on cloud platforms.',
      longDescription:
        'Multi-tenant applications built on cloud platforms that deliver business capabilities via subscription. Emphasize time-to-value, integrations, security/compliance, and continuous delivery of features.',
      companiesDetailed: [
        { name: 'Salesforce', ticker: 'CRM', listing: 'US' },
        { name: 'ServiceNow', ticker: 'NOW', listing: 'US' },
        { name: 'Adobe', ticker: 'ADBE', listing: 'US' },
        { name: 'Workday', ticker: 'WDAY', listing: 'US' },
        { name: 'Atlassian', ticker: 'TEAM', listing: 'US' },
      ],
      tags: ['CRM', 'ITSM', 'Productivity'],
    },
    {
      id: 'observability',
      name: 'Observability & Security',
      description: 'Monitoring, logging, APM, and cloud security posture management.',
      longDescription:
        'Cloud-native monitoring, logging, and application performance platforms that provide full-stack visibility and security posture management to meet reliability, performance, and compliance objectives.',
      companiesDetailed: [
        { name: 'Datadog', ticker: 'DDOG', listing: 'US' },
        { name: 'Splunk', ticker: 'SPLK', listing: 'US' },
        { name: 'Elastic', ticker: 'ESTC', listing: 'US' },
        { name: 'Zscaler', ticker: 'ZS', listing: 'US' },
        { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
      ],
      tags: ['APM', 'SIEM', 'CSPM'],
    },
  ],
}

export const cloudProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]



