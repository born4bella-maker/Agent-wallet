import React, { useState } from 'react';
import { INITIAL_AGENTS, INITIAL_FIREWALL_RULES, INITIAL_ATTESTATIONS, INITIAL_APPROVALS } from './data/mockFleetData';
import { AgentWallet, FirewallPolicyRule, AttestationRecord, HumanApprovalItem } from './types/fleet';
import { Header } from './components/Header';
import { FleetMetricsBar } from './components/FleetMetricsBar';
import { AgentFleetView } from './components/AgentFleetView';
import { AgentDetailModal } from './components/AgentDetailModal';
import { SpendFirewallView } from './components/SpendFirewallView';
import { AttackSimulatorView } from './components/AttackSimulatorView';
import { ApprovalQueueView } from './components/ApprovalQueueView';
import { AttestationsView } from './components/AttestationsView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { DeployAgentModal } from './components/DeployAgentModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { EmergencyStopModal } from './components/EmergencyStopModal';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [agents, setAgents] = useState<AgentWallet[]>(INITIAL_AGENTS);
  const [firewallRules, setFirewallRules] = useState<FirewallPolicyRule[]>(INITIAL_FIREWALL_RULES);
  const [attestations, setAttestations] = useState<AttestationRecord[]>(INITIAL_ATTESTATIONS);
  const [approvals, setApprovals] = useState<HumanApprovalItem[]>(INITIAL_APPROVALS);
  const [interceptedCount, setInterceptedCount] = useState<number>(14);

  // Modals & Emergency State
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AgentWallet | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEmergencyStopActive, setIsEmergencyStopActive] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Global Emergency Stop Toggle
  const handleToggleEmergencyStop = () => {
    const nextState = !isEmergencyStopActive;
    setIsEmergencyStopActive(nextState);

    // Update agent wallets
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.status === 'quarantined') return agent;
        return {
          ...agent,
          status: nextState ? 'throttled' : 'nominal',
        };
      })
    );

    // Record EAS Attestation of emergency action
    const emergencyAttestation: AttestationRecord = {
      id: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      txHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...',
      timestamp: new Date().toISOString(),
      agentId: 'fleet-global-sentinel',
      agentName: 'Global Fleet Sentinel Engine',
      amountUSD: 0,
      token: 'USDC',
      recipient: '0x0000000000000000000000000000000000000000',
      recipientLabel: nextState ? 'Global Circuit Breaker (PAUSED)' : 'Global Circuit Breaker (RESUMED)',
      status: nextState ? 'blocked' : 'settled',
      policySummary: {
        passed: !nextState,
        riskScore: nextState ? 100 : 0,
        promptInjectionRisk: 0,
        ruleTriggered: nextState ? 'Global Human Operator Emergency Stop' : undefined,
      },
      attester: 'Aegis Sentinel Root Enclave (Operator Key)',
      schemaUID: '0xa41c09...881f',
      agentReasoningSnippet: nextState
        ? 'SYSTEM ALERT: Global Emergency Stop engaged by human operator. Paused all non-essential ERC-4337 EntryPoints and autonomous payment rails across all agents.'
        : 'SYSTEM ALERT: Global Emergency Stop disengaged by human operator. Re-authorized standard spend firewall parameters.',
      rawUserOp: {
        sender: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 (EntryPoint)',
        callDataSelector: nextState ? '0x00000000 (PAUSE_ALL)' : '0x00000001 (UNPAUSE_ALL)',
        targetContract: 'Aegis Spend Firewall Guardian v3',
        gasLimit: '21,000',
      },
    };

    setAttestations((prev) => [emergencyAttestation, ...prev]);
  };

  // Quarantine Handler
  const handleToggleQuarantine = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          const nextStatus = agent.status === 'quarantined' ? 'nominal' : 'quarantined';
          return {
            ...agent,
            status: nextStatus,
            sessionKey: {
              ...agent.sessionKey,
              allowedMethods: nextStatus === 'quarantined' ? [] : ['0xa9059cbb (transfer)', '0x095ea7b3 (approve)'],
              expiresAt: nextStatus === 'quarantined' ? 'EXPIRED (Quarantined)' : '2026-10-12T00:00:00Z',
            },
          };
        }
        return agent;
      })
    );

    if (selectedAgentForModal && selectedAgentForModal.id === agentId) {
      setSelectedAgentForModal((prev) => {
        if (!prev) return null;
        const nextStatus = prev.status === 'quarantined' ? 'nominal' : 'quarantined';
        return {
          ...prev,
          status: nextStatus,
          sessionKey: {
            ...prev.sessionKey,
            allowedMethods: nextStatus === 'quarantined' ? [] : ['0xa9059cbb (transfer)', '0x095ea7b3 (approve)'],
            expiresAt: nextStatus === 'quarantined' ? 'EXPIRED (Quarantined)' : '2026-10-12T00:00:00Z',
          },
        };
      });
    }
  };

  // Liquidity Top-up
  const handleFundAgent = (agentId: string, amount: number) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            balances: {
              ...agent.balances,
              usdc: agent.balances.usdc + amount,
            },
          };
        }
        return agent;
      })
    );

    if (selectedAgentForModal && selectedAgentForModal.id === agentId) {
      setSelectedAgentForModal((prev) =>
        prev
          ? {
              ...prev,
              balances: {
                ...prev.balances,
                usdc: prev.balances.usdc + amount,
              },
            }
          : null
      );
    }
  };

  // Rule Toggle
  const handleToggleRule = (ruleId: string) => {
    setFirewallRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  // Add Rule
  const handleAddRule = (newRule: Omit<FirewallPolicyRule, 'id' | 'hits24h'>) => {
    const created: FirewallPolicyRule = {
      ...newRule,
      id: `rule-spf-${Date.now().toString().slice(-4)}`,
      hits24h: 0,
    };
    setFirewallRules((prev) => [created, ...prev]);
  };

  // Attestation generated via simulator or live action
  const handleAttestationGenerated = (record: AttestationRecord) => {
    setAttestations((prev) => [record, ...prev]);
  };

  // Blocked threat callback
  const handleThreatBlocked = (agentId: string) => {
    setInterceptedCount((prev) => prev + 1);
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: 'quarantined',
            threatsIntercepted: agent.threatsIntercepted + 1,
            sessionKey: {
              ...agent.sessionKey,
              allowedMethods: [],
              expiresAt: 'EXPIRED (Revoked by Firewall)',
            },
          };
        }
        return agent;
      })
    );
  };

  // Human Approval Handlers
  const handleApproveEscrow = (id: string) => {
    const item = approvals.find((a) => a.id === id);
    if (!item) return;

    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );

    // Deduct agent balance
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === item.agentId) {
          return {
            ...a,
            balances: {
              ...a.balances,
              usdc: Math.max(0, a.balances.usdc - item.amountUSD),
            },
            spendingLimits: {
              ...a.spendingLimits,
              currentDailySpentUSD: a.spendingLimits.currentDailySpentUSD + item.amountUSD,
            },
          };
        }
        return a;
      })
    );

    // Generate settlement attestation
    const approvedAttestation: AttestationRecord = {
      id: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      txHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...',
      timestamp: new Date().toISOString(),
      agentId: item.agentId,
      agentName: item.agentName,
      amountUSD: item.amountUSD,
      token: item.token,
      recipient: item.recipient,
      recipientLabel: item.recipientLabel,
      status: 'settled',
      policySummary: {
        passed: true,
        riskScore: item.riskScore,
        promptInjectionRisk: 0,
        ruleTriggered: 'Human Operator Multi-Sig Override Signature',
      },
      attester: 'Aegis Human Multi-Sig Escrow Committee',
      schemaUID: '0xa41c09...881f',
      agentReasoningSnippet: item.agentIntentTrace,
      rawUserOp: {
        sender: item.agentId,
        callDataSelector: '0xa9059cbb (transfer)',
        targetContract: item.recipient,
        gasLimit: '92,000',
      },
    };
    setAttestations((prev) => [approvedAttestation, ...prev]);
  };

  const handleRejectEscrow = (id: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected', reason } : a))
    );
  };

  const handleDeployAgent = (newAgent: AgentWallet) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  // Export Fleet Report CSV Generator
  const handleExportFleetReport = () => {
    const headers = [
      'Agent ID',
      'Codename',
      'Name',
      'Cluster',
      'Model Family',
      'Operational Status',
      'ERC-6551 Token ID',
      'ERC-4337 Smart Account',
      'USDC Balance',
      'ETH Balance',
      'Gas Credits',
      'Max Per Tx (USD)',
      'Daily Spend Cap (USD)',
      'Current 24h Spent (USD)',
      'Hourly Velocity (USD)',
      'Hourly Velocity Cap (USD)',
      'Recent Transactions (24h)',
      'Compliance Threats Intercepted',
      'Active Session Keys',
      'Spend Firewall Profile',
      'Last Active',
    ];

    const escapeCSV = (value: string | number | undefined) => {
      if (value === undefined || value === null) return '""';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const rows = agents.map((a) => [
      escapeCSV(a.id),
      escapeCSV(a.codename),
      escapeCSV(a.name),
      escapeCSV(a.cluster),
      escapeCSV(a.modelFamily),
      escapeCSV(a.status),
      escapeCSV(a.erc6551.tokenId),
      escapeCSV(a.erc4337.smartAccountAddress),
      escapeCSV(a.balances.usdc.toFixed(2)),
      escapeCSV(a.balances.eth.toFixed(4)),
      escapeCSV(a.balances.gasCredits),
      escapeCSV(a.spendingLimits.maxPerTxUSD.toFixed(2)),
      escapeCSV(a.spendingLimits.dailyCapUSD.toFixed(2)),
      escapeCSV(a.spendingLimits.currentDailySpentUSD.toFixed(2)),
      escapeCSV(a.spendingLimits.hourlyVelocityUSD.toFixed(2)),
      escapeCSV(a.spendingLimits.hourlyVelocityCapUSD.toFixed(2)),
      escapeCSV(a.recentTransactionsCount),
      escapeCSV(a.threatsIntercepted),
      escapeCSV(a.erc4337.activeSessionKeysCount),
      escapeCSV(a.policyProfile),
      escapeCSV(a.lastActive),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `aegis-fleet-report-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={approvals.filter((a) => a.status === 'pending').length}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onLaunchSimulator={() => setActiveTab('simulator')}
        isEmergencyStopActive={isEmergencyStopActive}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onExportFleetReport={handleExportFleetReport}
      />

      {/* Global Emergency Stop Alert Banner */}
      {isEmergencyStopActive && (
        <div className="bg-rose-600 px-6 py-2.5 text-white text-xs font-semibold shadow-inner flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>
              <strong>GLOBAL EMERGENCY CIRCUIT BREAKER ACTIVE:</strong> All non-essential autonomous agent transactions and session keys are paused across the fleet. Only whitelisted keepalive telemetry is active.
            </span>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-3 py-1 bg-white text-rose-700 font-bold rounded hover:bg-rose-50 transition-colors shrink-0 ml-4 shadow-sm"
          >
            Review & Resume Fleet
          </button>
        </div>
      )}

      {/* Real-time Fleet Metrics Bar */}
      <FleetMetricsBar
        agents={agents}
        approvals={approvals}
        interceptedCount={interceptedCount}
      />

      {/* Main Content Workspace Canvas */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {activeTab === 'fleet' && (
          <AgentFleetView
            agents={agents}
            onSelectAgent={(agent) => setSelectedAgentForModal(agent)}
            onOpenFirewallForAgent={(agent) => setActiveTab('firewall')}
            onOpenSimulatorWithAgent={(agent) => setActiveTab('simulator')}
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        )}

        {activeTab === 'firewall' && (
          <SpendFirewallView
            rules={firewallRules}
            onToggleRule={handleToggleRule}
            onAddRule={handleAddRule}
            onLaunchSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <AttackSimulatorView
            agents={agents}
            onAttestationGenerated={handleAttestationGenerated}
            onThreatBlocked={handleThreatBlocked}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalQueueView
            approvals={approvals}
            onApprove={handleApproveEscrow}
            onReject={handleRejectEscrow}
            onQuarantineAgentFromApproval={handleToggleQuarantine}
          />
        )}

        {activeTab === 'attestations' && (
          <AttestationsView attestations={attestations} />
        )}

        {(activeTab === 'overview' || activeTab === 'architecture') && (
          <ArchitectureDocsView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Aegis Agent OS</span>
            <span aria-hidden="true">·</span>
            <span>Self-Custodied Agent Wallet Fleet</span>
            <span aria-hidden="true">·</span>
            <span>ERC-6551 & ERC-4337 Architecture</span>
          </div>
          <div>
            <span>Auditable Payment Rails for Autonomous AI Agents</span>
          </div>
        </div>
      </footer>

      {/* Inspector Modal */}
      {selectedAgentForModal && (
        <AgentDetailModal
          agent={selectedAgentForModal}
          onClose={() => setSelectedAgentForModal(null)}
          onToggleQuarantine={handleToggleQuarantine}
          onFundAgent={handleFundAgent}
        />
      )}

      {/* Deploy Agent Modal */}
      <DeployAgentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeployAgent}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleDeployAgent}
      />

      {/* Emergency Stop Modal */}
      <EmergencyStopModal
        isOpen={isEmergencyModalOpen}
        isEmergencyStopActive={isEmergencyStopActive}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmToggle={handleToggleEmergencyStop}
      />
    </div>
  );
}
