import type { ValueChainStageProducts } from '@/lib/data/industries'

const upstream: ValueChainStageProducts = {
  stage: 'upstream',
  stageLabel: 'Upstream',
  layout: 'grid',
  products: [
    {
      id: 'threat-intel',
      name: 'Threat Intelligence & Research',
      description: 'Research labs, intelligence feeds, and security data that inform detections and response.',
      longDescription: 'Security research organizations and intelligence platforms that collect indicators of compromise, analyze adversary tactics/techniques (TTPs), and publish detections to improve prevention and response across the ecosystem.',
      companiesDetailed: [
        { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'Fortinet', ticker: 'FTNT', listing: 'US' },
        { name: 'Mandiant (Google)', ticker: 'GOOGL', listing: 'US' },
      ],
      tags: ['Intel', 'Research'],
    },
    {
      id: 'security-hardware',
      name: 'Security Hardware & Appliances',
      description: 'Next-gen firewalls, secure web gateways, and hardware accelerators supporting inline security.',
      longDescription: 'Purpose-built security appliances and hardware-accelerated platforms that provide inline inspection and policy enforcement (NGFW, SWG, IDS/IPS). Emphasis on throughput, low latency, and advanced signature/ML detections.',
      companiesDetailed: [
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'Fortinet', ticker: 'FTNT', listing: 'US' },
        { name: 'Cisco', ticker: 'CSCO', listing: 'US' },
        { name: 'Check Point', ticker: 'CHKP', listing: 'US' },
        { name: 'Juniper Networks', ticker: 'JNPR', listing: 'US' },
        { name: 'SonicWall (Dell)', ticker: 'DELL', listing: 'US' },
      ],
      tags: ['NGFW', 'SWG'],
    },
  ],
}

const midstream: ValueChainStageProducts = {
  stage: 'midstream',
  stageLabel: 'Midstream',
  layout: 'hybrid',
  products: [
    {
      id: 'endpoint',
      name: 'Endpoint Security (EDR/XDR)',
      description: 'Endpoint detection and response, extended detection across endpoints, identities, and cloud.',
      longDescription: 'Detection and response platforms that prevent, detect, and investigate threats on endpoints and extend telemetry across identities, email, and cloud workloads (XDR). Focus on real‑time telemetry, behavioral analytics, and automated response.',
      companiesDetailed: [
        { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
        { name: 'SentinelOne', ticker: 'S', listing: 'US' },
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'Microsoft', ticker: 'MSFT', listing: 'US' },
        { name: 'BlackBerry', ticker: 'BB', listing: 'US' },
      ],
      tags: ['EDR', 'XDR'],
    },
    {
      id: 'network-security',
      name: 'Network Security',
      description: 'Firewalls, IDS/IPS, SSE/SASE for secure access and threat prevention.',
      longDescription: 'Secure connectivity and inspection across users/sites/apps using firewalls, secure web gateway, zero trust network access (ZTNA), and cloud-delivered security (SSE/SASE). Prioritizes least privilege access, data protection, and threat prevention.',
      companiesDetailed: [
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'Fortinet', ticker: 'FTNT', listing: 'US' },
        { name: 'Zscaler', ticker: 'ZS', listing: 'US' },
        { name: 'Cisco', ticker: 'CSCO', listing: 'US' },
        { name: 'F5 Networks', ticker: 'FFIV', listing: 'US' },
      ],
      tags: ['SASE', 'SSE'],
    },
    {
      id: 'identity',
      name: 'Identity & Access Management',
      description: 'Identity providers, privileged access, MFA, and zero trust access controls.',
      longDescription: 'Platforms for authentication, authorization, lifecycle management, and privileged access. Incorporates MFA, risk‑based access, passwordless, and policy‑driven controls foundational to zero trust architectures.',
      companiesDetailed: [
        { name: 'Okta', ticker: 'OKTA', listing: 'US' },
        { name: 'CyberArk', ticker: 'CYBR', listing: 'US' },
        { name: 'Microsoft', ticker: 'MSFT', listing: 'US' },
      ],
      tags: ['IDP', 'PAM', 'MFA'],
    },
  ],
}

const downstream: ValueChainStageProducts = {
  stage: 'downstream',
  stageLabel: 'Downstream',
  layout: 'grid',
  products: [
    {
      id: 'cloud-security',
      name: 'Cloud Security',
      description: 'CASB, CNAPP, and posture management securing cloud apps, containers, and workloads.',
      longDescription: 'Security for SaaS/IaaS/PaaS encompassing CASB for SaaS governance, CNAPP for cloud‑native app protection (CSPM+CWPP), and K8s/container security. Focus on misconfigurations, workload runtime threats, and data protection.',
      companiesDetailed: [
        { name: 'Zscaler', ticker: 'ZS', listing: 'US' },
        { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'Okta', ticker: 'OKTA', listing: 'US' },
      ],
      tags: ['CASB', 'CNAPP', 'CSPM'],
    },
    {
      id: 'siem-analytics',
      name: 'Security Analytics & SIEM',
      description: 'Log management, detection engineering, vulnerability management, and compliance analytics.',
      longDescription: 'Platforms that collect and analyze logs, metrics, and traces for threat hunting, detection engineering, and compliance. Integrates vulnerability scanning and prioritization for risk‑based remediation.',
      companiesDetailed: [
        { name: 'Splunk', ticker: 'SPLK', listing: 'US' },
        { name: 'Qualys', ticker: 'QLYS', listing: 'US' },
        { name: 'Tenable', ticker: 'TENB', listing: 'US' },
        { name: 'Elastic', ticker: 'ESTC', listing: 'US' },
        { name: 'Rapid7', ticker: 'RPD', listing: 'US' },
        { name: 'Varonis Systems', ticker: 'VRNS', listing: 'US' },
        { name: 'Secureworks', ticker: 'SCWX', listing: 'US' },
      ],
      tags: ['SIEM', 'Vuln Mgmt'],
    },
    {
      id: 'managed-services',
      name: 'Managed Security & Consulting',
      description: 'Managed detection and response (MDR), SOC-as-a-service, and incident response.',
      longDescription: 'Outsourced security services delivering 24/7 monitoring, detection, and response through SOCs, plus incident response retainers and advisory to strengthen security programs.',
      companiesDetailed: [
        { name: 'Palo Alto Networks', ticker: 'PANW', listing: 'US' },
        { name: 'CrowdStrike', ticker: 'CRWD', listing: 'US' },
        { name: 'IBM', ticker: 'IBM', listing: 'US' },
      ],
      tags: ['MDR', 'IR'],
    },
  ],
}

export const cyberProductStages: ValueChainStageProducts[] = [upstream, midstream, downstream]


