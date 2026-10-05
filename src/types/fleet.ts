export type AgentStatus = 'nominal' | 'active' | 'throttled' | 'quarantined';

export interface ERC6551Config {
  registryAddress: string;
  tokenContract: string; // The NFT identity contract (ERC-721)
  tokenId: string;
  chainId: number;
  salt: string;
  implementation: string;
}

export interface ERC4337Config {
  entryPoint: string;
  smartAccountAddress: string;
  bundler: string;
  paymasterPolicy: string;
  nonce: number;
  activeSessionKeysCount: number;
}

export interface SessionKeyInfo {
  keyHash: string;
  expiresAt: string;
  maxGasAllowanceGwei: number;
  allowedMethods: string[];
  maxTxValueUSD: number;
}

export interface AgentWallet {
  id: string;
  name: string;
  codename: string;
  purpose: string;
  cluster: 'Procurement' | 'Compute & Inference' | 'Research & Synthesis' | 'Operations & Payroll';
  modelFamily: string;
  status: AgentStatus;
  erc6551: ERC6551Config;
  erc4337: ERC4337Config;
  balances: {
    usdc: number;
    eth: number;
    gasCredits: number;
  };
  spendingLimits: {
    maxPerTxUSD: number;
    dailyCapUSD: number;
    currentDailySpentUSD: number;
    hourlyVelocityUSD: number;
    hourlyVelocityCapUSD: number;
  };
  policyProfile: string;
  sessionKey: SessionKeyInfo;
  recentTransactionsCount: number;
  threatsIntercepted: number;
  lastActive: string;
}

export type PolicyCategory = 'velocity' | 'allowlist' | 'prompt_injection' | 'human_approval' | 'gas_cap';
export type PolicyAction = 'allow' | 'block' | 'escalate_human' | 'quarantine_agent';
export type PolicySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface FirewallPolicyRule {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  condition: string;
  threshold: string;
  action: PolicyAction;
  isEnabled: boolean;
  hits24h: number;
  severity: PolicySeverity;
}

export type AttestationStatus = 'attested' | 'blocked' | 'escalated' | 'settled';

export interface AttestationRecord {
  id: string; // EAS UID
  txHash: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  amountUSD: number;
  token: string;
  recipient: string;
  recipientLabel: string;
  status: AttestationStatus;
  policySummary: {
    passed: boolean;
    ruleTriggered?: string;
    riskScore: number; // 0 - 100
    promptInjectionRisk: number; // 0 - 100
  };
  attester: string;
  schemaUID: string;
  agentReasoningSnippet: string;
  rawUserOp: {
    sender: string;
    callDataSelector: string;
    targetContract: string;
    gasLimit: string;
  };
}

export interface HumanApprovalItem {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  amountUSD: number;
  token: string;
  recipient: string;
  recipientLabel: string;
  reason: string;
  triggerRule: string;
  agentIntentTrace: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedByModel: string;
}
