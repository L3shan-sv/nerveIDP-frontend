import type {
  Service, Alert, DoraMetrics, BurnRateAlert,
  Collection, Incident, SimilarIncident, CheckResult
} from '../types'

export const services: Service[] = [
  { id: 's1', name: 'api-gateway',       team: 'platform-team',  lang: 'Go',         version: 'v3.2.1', replicas: 4, health: 'healthy',  maturityScore: 94, budgetPct: 22,  budgetStatus: 'healthy', burnRate: 0.4, lastDeployAgo: '4m ago',  complianceScore: 94 },
  { id: 's2', name: 'auth-service',      team: 'identity-team',  lang: 'TypeScript',  version: 'v2.1.4', replicas: 3, health: 'healthy',  maturityScore: 88, budgetPct: 41,  budgetStatus: 'healthy', burnRate: 0.8, lastDeployAgo: '12m ago', complianceScore: 88 },
  { id: 's3', name: 'payment-service',   team: 'fintech-team',   lang: 'Python',      version: 'v1.8.0', replicas: 2, health: 'frozen',   maturityScore: 52, budgetPct: 100, budgetStatus: 'frozen',  burnRate: 14,  lastDeployAgo: '3h ago',  complianceScore: 52, hasCVE: true, cveCritical: 1 },
  { id: 's4', name: 'order-service',     team: 'commerce-team',  lang: 'Python',      version: 'v4.0.2', replicas: 6, health: 'degraded', maturityScore: 62, budgetPct: 78,  budgetStatus: 'fast',    burnRate: 6,   lastDeployAgo: '28m ago', complianceScore: 62 },
  { id: 's5', name: 'inventory-service', team: 'commerce-team',  lang: 'Go',          version: 'v2.3.1', replicas: 2, health: 'degraded', maturityScore: 44, budgetPct: 35,  budgetStatus: 'healthy', burnRate: 0.6, lastDeployAgo: '1h ago',  complianceScore: 44, hasCVE: true, cveCritical: 1 },
  { id: 's6', name: 'notification-svc',  team: 'platform-team',  lang: 'TypeScript',  version: 'v1.2.0', replicas: 2, health: 'healthy',  maturityScore: 91, budgetPct: 15,  budgetStatus: 'healthy', burnRate: 0.3, lastDeployAgo: '2h ago',  complianceScore: 91 },
  { id: 's7', name: 'search-service',    team: 'discovery-team', lang: 'Rust',        version: 'v5.1.0', replicas: 4, health: 'healthy',  maturityScore: 84, budgetPct: 28,  budgetStatus: 'healthy', burnRate: 0.6, lastDeployAgo: '5h ago',  complianceScore: 84 },
  { id: 's8', name: 'user-service',      team: 'identity-team',  lang: 'Go',          version: 'v3.4.0', replicas: 3, health: 'healthy',  maturityScore: 86, budgetPct: 29,  budgetStatus: 'watch',   burnRate: 1.1, lastDeployAgo: '1h ago',  complianceScore: 86 },
  { id: 's9', name: 'data-pipeline',     team: 'data-team',      lang: 'Python',      version: 'v2.1.1', replicas: 2, health: 'degraded', maturityScore: 68, budgetPct: 55,  budgetStatus: 'slow',    burnRate: 3,   lastDeployAgo: '6h ago',  complianceScore: 68 },
  { id: 's10', name: 'analytics-svc',    team: 'data-team',      lang: 'Python',      version: 'v1.0.4', replicas: 1, health: 'healthy',  maturityScore: 79, budgetPct: 32,  budgetStatus: 'healthy', burnRate: 0.7, lastDeployAgo: '8h ago',  complianceScore: 79 },
]

export const alerts: Alert[] = [
  { id: 'a1', title: 'Budget exhausted',   service: 'payment-service',   detail: '14× burn rate · 0% remaining',       severity: 'P0',  time: '09:12' },
  { id: 'a2', title: 'Critical CVE',       service: 'inventory-service', detail: 'CVE-2024-3094 · CVSS 9.8',           severity: 'P0',  time: '09:08' },
  { id: 'a3', title: 'Fast burn rate',     service: 'order-service',     detail: '6× burn · 22% budget remaining',     severity: 'P1',  time: '08:55' },
  { id: 'a4', title: 'Cost anomaly',       service: 'data-pipeline',     detail: '+340% spend spike · last 2h',        severity: 'P1',  time: '08:40' },
  { id: 'a5', title: 'Deploy unblocked',   service: 'search-service',    detail: 'CVE patched · compliance score 84',  severity: 'info', time: '08:22' },
]

export const dora: DoraMetrics = {
  deployFreq: 6.2,
  leadTimeHours: 1.4,
  mttrMinutes: 48,
  changeFailRate: 3.1,
  deployFreqRating: 'elite',
  leadTimeRating: 'elite',
  mttrRating: 'medium',
  cfrRating: 'elite',
}

export const burnRateAlerts: BurnRateAlert[] = [
  { service: 'payment-service', rate: 14, window: '1h + 6h', timeToExhaustion: 'exhausted',       action: 'page+freeze' },
  { service: 'order-service',   rate: 6,  window: '6h',      timeToExhaustion: '~5 days left',    action: 'page' },
  { service: 'data-pipeline',   rate: 3,  window: '1d',      timeToExhaustion: '~10 days left',   action: 'ticket' },
  { service: 'user-service',    rate: 1.1, window: '3d',     timeToExhaustion: 'on pace to exhaust', action: 'watch' },
]

export const collections: Collection[] = [
  { id: 'c1', name: 'python-services',    count: 47, filter: 'lang:python',      healthPct: 89, status: 'healthy' },
  { id: 'c2', name: 'commerce-team',      count: 18, filter: 'team:commerce',    healthPct: 72, status: 'degraded' },
  { id: 'c3', name: 'platform-team',      count: 12, filter: 'team:platform',    healthPct: 100, status: 'healthy' },
  { id: 'c4', name: 'score < 80',         count: 34, filter: 'maturity:lt:80',   healthPct: 45, status: 'degraded' },
  { id: 'c5', name: 'prod-critical-path', count: 8,  filter: 'tag:prod-critical', healthPct: 95, status: 'healthy' },
]

export const activeIncident: Incident = {
  id: 'INC-2841',
  service: 'payment-service',
  title: 'Error budget exhausted — 500 spike post-deploy',
  severity: 'P0',
  errorRate: 18.4,
  startedAt: '09:12 UTC',
  budgetLeft: 0,
  trigger: 'deploy v1.8.1',
}

export const similarIncidents: SimilarIncident[] = [
  { id: 'INC-2791', service: 'payment-service', daysAgo: 22, mttrMin: 6,  resolution: 'rollback to v1.8.0', matchPct: 94, matchReason: 'stripe-client dependency' },
  { id: 'INC-2654', service: 'payment-service', daysAgo: 41, mttrMin: 47, resolution: 'DB connection pool fix', matchPct: 71, matchReason: 'budget exhaustion pattern' },
  { id: 'INC-2201', service: 'order-service',   daysAgo: 89, mttrMin: 12, resolution: 'rollback + hotfix', matchPct: 68, matchReason: '500 spike post-deploy' },
]

export const deployChecks: CheckResult[] = [
  { name: 'Health endpoints', key: 'health',   maxScore: 20, score: 20, status: 'pass', detail: '/health → 200 · /ready → 200 · liveness probe configured' },
  { name: 'SLO defined',      key: 'slo',      maxScore: 20, score: 20, status: 'pass', detail: 'uptime: 99.9% · latency P99: 200ms · window: 30d' },
  { name: 'Runbook (live doc)', key: 'runbook', maxScore: 15, score: 0,  status: 'fail', detail: 'No TechDocs runbook found · last URL returned 404', fixable: true },
  { name: 'OTel instrumentation', key: 'otel', maxScore: 15, score: 8,  status: 'warn', detail: 'Traces exporting to Jaeger · metrics missing from /process and /refund', fixable: true },
  { name: 'Secrets via Vault',  key: 'secrets', maxScore: 10, score: 10, status: 'pass', detail: 'No env var secrets · Vault dynamic secrets active · k8s auth configured' },
  { name: 'Security posture',   key: 'security', maxScore: 20, score: 0, status: 'fail', detail: 'CRITICAL CVE-2024-3094 (CVSS 9.8) in openssl:3.0.1 → upgrade to 3.0.2', fixable: true },
]

export const activityFeed = [
  { time: '09:41', actor: '@maya',  msg: 'deployed auth-service v2.1.4',       type: 'deploy' },
  { time: '09:38', actor: '@nerve', msg: 'froze payment-service deploys',       type: 'freeze' },
  { time: '09:22', actor: '@james', msg: 'scaffolded search-service-v2',        type: 'scaffold' },
  { time: '09:11', actor: '@nerve', msg: 'blocked deploy · CVE-2024-3094',      type: 'block' },
  { time: '08:55', actor: '@priya', msg: 'approved IaC plan · prod-vpc',        type: 'approve' },
  { time: '08:40', actor: '@nerve', msg: 'cost anomaly · data-pipeline +340%',  type: 'alert' },
]