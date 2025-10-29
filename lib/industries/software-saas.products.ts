import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'dev-platforms',
      name: 'Development Platforms & DevOps',
      description: 'Source control, CI/CD, package registries, and developer platforms.',
      longDescription: 'Platforms and toolchains that support the software development lifecycle, including source code management (SCM), continuous integration/continuous delivery (CI/CD), artifact registries, and DevOps automation. These systems enable rapid, reliable releases and developer productivity at scale.',
      companiesDetailed: [
        { name: 'Microsoft (GitHub/Azure DevOps)', ticker: 'MSFT', listing: 'US' },
        { name: 'Atlassian', ticker: 'TEAM', listing: 'US' },
        { name: 'GitLab', ticker: 'GTLB', listing: 'US' },
      ],
      tags: ['CI/CD', 'SCM'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'enterprise-apps',
      name: 'Enterprise Applications',
      description: 'CRM, ERP, HCM, and industry suites running at cloud scale.',
      longDescription: 'Cloud-delivered suites that digitize core business functions—customer relationship management (CRM), enterprise resource planning (ERP), human capital management (HCM)—and vertical-specific workflows. Emphasis on configurability, APIs, analytics, and compliance.',
      companiesDetailed: [
        { name: 'Salesforce', ticker: 'CRM', listing: 'US' },
        { name: 'Microsoft', ticker: 'MSFT', listing: 'US' },
        { name: 'Oracle', ticker: 'ORCL', listing: 'US' },
        { name: 'SAP', ticker: 'SAP', listing: 'ADR' },
        { name: 'Workday', ticker: 'WDAY', listing: 'US' },
      ],
      tags: ['CRM', 'ERP', 'HCM'],
    },
    {
      id: 'collab',
      name: 'Collaboration & Productivity',
      description: 'Communications, meetings, docs, and e-signature platforms.',
      longDescription: 'Unified communications, team collaboration, and content platforms that enable messaging, meetings, document creation, workflow, and agreements. Focus on security, compliance, and integrations across the app ecosystem.',
      companiesDetailed: [
        { name: 'Microsoft', ticker: 'MSFT', listing: 'US' },
        { name: 'Zoom', ticker: 'ZM', listing: 'US' },
        { name: 'Atlassian', ticker: 'TEAM', listing: 'US' },
        { name: 'DocuSign', ticker: 'DOCU', listing: 'US' },
        { name: 'Slack', ticker: 'CRM', listing: 'US' },
        { name: 'Dropbox', ticker: 'DBX', listing: 'US' },
        { name: 'Box', ticker: 'BOX', listing: 'US' },
        { name: 'Asana', ticker: 'ASAN', listing: 'US' },
      ],
      tags: ['UCaaS', 'Docs'],
    },
    {
      id: 'analytics',
      name: 'Analytics & BI',
      description: 'Data analytics, observability, and business intelligence.',
      longDescription: 'Cloud analytics, business intelligence, and observability platforms that ingest and process data for dashboards, insights, and monitoring. Includes data warehouses, APM/logs/metrics, and AI-assisted analytics for decision support.',
      companiesDetailed: [
        { name: 'Snowflake', ticker: 'SNOW', listing: 'US' },
        { name: 'Datadog', ticker: 'DDOG', listing: 'US' },
        { name: 'Splunk', ticker: 'SPLK', listing: 'US' },
        { name: 'Domo', ticker: 'DOMO', listing: 'US' },
        { name: 'Tableau', ticker: 'CRM', listing: 'US' },
        { name: 'Alteryx', ticker: 'AYX', listing: 'US' },
        { name: 'Palantir Technologies', ticker: 'PLTR', listing: 'US' },
        { name: 'ServiceNow', ticker: 'NOW', listing: 'US' },
        { name: 'New Relic', ticker: 'NEWR', listing: 'US' },
      ],
      tags: ['APM', 'BI'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'vertical-saas',
      name: 'Vertical SaaS',
      description: 'Industry-specific cloud applications and data platforms.',
      longDescription: 'Applications tailored to the needs of specific industries (e.g., life sciences, manufacturing, financial services), with domain data models, compliance requirements, and specialized workflows that deliver faster time-to-value.',
      companiesDetailed: [
        { name: 'Veeva Systems', ticker: 'VEEV', listing: 'US' },
        { name: 'HubSpot', ticker: 'HUBS', listing: 'US' },
        { name: 'Bill Holdings', ticker: 'BILL', listing: 'US' },
        { name: 'ZoomInfo', ticker: 'ZI', listing: 'US' },
        { name: 'Toast', ticker: 'TOST', listing: 'US' },
        { name: 'nCino', ticker: 'NCNO', listing: 'US' },
        { name: 'Five9', ticker: 'FIVN', listing: 'US' },
        { name: 'Twilio', ticker: 'TWLO', listing: 'US' },
      ],
      tags: ['Life Sciences', 'MarTech', 'FinOps'],
    },
    {
      id: 'integration',
      name: 'Integration & Automation',
      description: 'Data integration platforms, event streams, and workflow automation.',
      longDescription: 'Integration-platform-as-a-service (iPaaS), streaming data pipelines, and automation tools that connect applications, orchestrate workflows, and enable event-driven architectures across hybrid and multi-cloud environments.',
      companiesDetailed: [
        { name: 'MongoDB', ticker: 'MDB', listing: 'US' },
        { name: 'Confluent', ticker: 'CFLT', listing: 'US' },
        { name: 'Palantir', ticker: 'PLTR', listing: 'US' },
        { name: 'Informatica', ticker: 'INFA', listing: 'US' },
        { name: 'F5 Networks', ticker: 'FFIV', listing: 'US' },
        { name: 'MuleSoft', ticker: 'CRM', listing: 'US' },
      ],
      tags: ['iPaaS', 'Streaming'],
    },
  ],
}

export const softwareSaaSProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]


