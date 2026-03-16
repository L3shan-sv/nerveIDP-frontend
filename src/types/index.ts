export type ServiceHealth = 'healthy' | 'degraded' | 'frozen'
export type ServiceLang = 'Python' | 'Go' | 'TypeScript' | 'Rust' | 'Java'
export type AlertSeverity = 'P0' | 'P1' | 'P2' | 'info'
export type BurnRateStatus = 'frozen' | 'fast' | 'slow' | 'watch' | 'healthy'
export type DoraRating = 'elite' | 'high' | 'medium' | 'low'
export type NavScreen = 'dashboard' | 'catalog' | 'deploy' | 'observability' | 'fleet' | 'ai'

export interface Service {
  id: string
  name: string
  team: string
  lang: ServiceLang
  version: string
  replicas: number
  health: ServiceHealth
  maturityScore: number
  budgetPct: number        // 0-100, consumed %
  budgetStatus: BurnRateStatus
  burnRate: number
  lastDeployAgo: string
  complianceScore: number
  hasCVE?: boolean
  cveCritical?: number
}

export interface Alert {
  id: string
  title: string
  service: string
  detail: string
  severity: AlertSeverity
  time: string
}

export interface DoraMetrics {
  deployFreq: number
  leadTimeHours: number
  mttrMinutes: number
  changeFailRate: number
  deployFreqRating: DoraRating
  leadTimeRating: DoraRating
  mttrRating: DoraRating
  cfrRating: DoraRating
}

export interface BurnRateAlert {
  service: string
  rate: number
  window: string
  timeToExhaustion: string
  action: 'page+freeze' | 'page' | 'ticket' | 'watch'
}

export interface Collection {
  id: string
  name: string
  count: number
  filter: string
  healthPct: number
  status: ServiceHealth
}

export interface Incident {
  id: string
  service: string
  title: string
  severity: 'P0' | 'P1' | 'P2'
  errorRate: number
  startedAt: string
  budgetLeft: number
  trigger: string
}

export interface SimilarIncident {
  id: string
  service: string
  daysAgo: number
  mttrMin: number
  resolution: string
  matchPct: number
  matchReason: string
}

export interface CheckResult {
  name: string
  key: string
  maxScore: number
  score: number
  status: 'pass' | 'fail' | 'warn'
  detail: string
  fixable?: boolean
}