import React, { useState } from 'react';
import { AgentWallet, AgentStatus } from '../types/fleet';
import { Search, Eye, KeyRound, AlertTriangle, ShieldCheck, SlidersHorizontal, Zap } from 'lucide-react';

interface AgentFleetViewProps {
  agents: AgentWallet[];
  onSelectAgent: (agent: AgentWallet) => void;
  onOpenFirewallForAgent: (agent: AgentWallet) => void;
  onOpenSimulatorWithAgent: (agent: AgentWallet) => void;
  onOpenWizard?: () => void;
}

export const AgentFleetView: React.FC<AgentFleetViewProps> = ({
  agents,
  onSelectAgent,
  onOpenFirewallForAgent,
  onOpenSimulatorWithAgent,
  onOpenWizard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const clusters = ['All', 'Compute & Inference', 'Research & Synthesis', 'Operations & Payroll', 'Procurement'];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.modelFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.erc4337.smartAccountAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCluster = selectedCluster === 'All' || agent.cluster === selectedCluster;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;

    return matchesSearch && matchesCluster && matchesStatus;
  });

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'nominal':
        return (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nominal</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Transacting</span>
          </div>
        );
      case 'throttled':
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>Velocity Throttled</span>
          </div>
        );
      case 'quarantined':
        return (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <span>Quarantined</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Positioning */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Self-Custodied Agent Wallet Fleet
            </h1>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              Enables autonomous AI agents to own cryptographic identities, manage programmable token-bound smart accounts, and execute real-time commerce under human-defined spend firewall policies.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="text-cyan-400 font-medium">ERC-6551 Token Bound Accounts</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium">ERC-4337 Account Abstraction</span>
              <span aria-hidden="true">·</span>
              <span>Ephemeral Session Keys</span>
              <span aria-hidden="true">·</span>
              <span>EAS Attestations</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 text-xs">
              <div className="text-slate-400">Total Spend Guard Ceiling</div>
              <div className="mt-0.5 text-base font-bold text-white font-mono tabular-nums">$56,500.00 / day</div>
              <div className="text-[11px] text-emerald-400 font-mono">Real-time Policy Intercept: Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Dashboard Highlights: Compliance, Policy Violation Alert, Onboarding Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance Radar */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">EAS Attestation Compliance</span>
            <span className="font-mono text-emerald-400 font-bold">99.4%</span>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            All 184 UserOps today are cryptographically attested on Ethereum Attestation Service.
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Zero Unresolved Invariants · Verified SGX Nodes
          </div>
        </div>

        {/* Policy Violation Alert */}
        <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-300 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              <span>Policy Violation Intercepted</span>
            </span>
            <span className="font-mono text-rose-400 text-[11px]">42m ago</span>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Prompt injection attempt blocked on <strong className="text-white font-mono">SEC-BOUNTY-07</strong>. Agent automatically quarantined.
          </div>
          <div className="mt-2 text-[11px] text-rose-300 font-mono">
            Mixer address 0x7a25... rejected by Spend Firewall
          </div>
        </div>

        {/* Onboarding Wizard Launcher Card */}
        <div className="p-4 rounded-xl border border-cyan-900/50 bg-gradient-to-br from-cyan-950/40 to-slate-900/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-semibold">New to Agent Wallets?</span>
            <span className="font-mono text-cyan-400 text-[11px]">5-Min Setup</span>
          </div>
          <div className="mt-1 text-xs text-slate-300">
            Guide your team through ERC-6551 token identity minting and spend firewall guardrails.
          </div>
          <div className="mt-3">
            <button
              onClick={onOpenWizard}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors shadow-sm"
            >
              Launch Setup Wizard →
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Cluster Tabs (Interactive Filter Controls) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
          {clusters.map((cluster) => (
            <button
              key={cluster}
              onClick={() => setSelectedCluster(cluster)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCluster === cluster
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cluster}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by agent, model, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500/80 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500/80 focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="nominal">Nominal</option>
            <option value="active">Transacting</option>
            <option value="throttled">Throttled</option>
            <option value="quarantined">Quarantined</option>
          </select>
        </div>
      </div>

      {/* High-Density Fleet Roster */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Agent Identity & Model</th>
                <th className="py-3 px-4">Token Bound Account (ERC-6551)</th>
                <th className="py-3 px-4 text-right">Vault Balance (USDC / ETH)</th>
                <th className="py-3 px-4">Daily Spend Velocity</th>
                <th className="py-3 px-4">Session Key Status</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No autonomous agents match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const spendPercent = Math.min(
                    100,
                    Math.round((agent.spendingLimits.currentDailySpentUSD / agent.spendingLimits.dailyCapUSD) * 100)
                  );
                  const isNearCap = spendPercent >= 80;

                  return (
                    <tr
                      key={agent.id}
                      className="transition-colors hover:bg-slate-850/50 hover:bg-slate-800/20 group"
                    >
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {agent.name}
                          </span>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="font-mono text-cyan-400/90">{agent.codename}</span>
                            <span aria-hidden="true">·</span>
                            <span>{agent.modelFamily}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-500">{agent.cluster}</span>
                          </div>
                        </div>
                      </td>

                      {/* ERC-6551 TBA */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex flex-col">
                          <span className="text-slate-300">
                            Token #{agent.erc6551.tokenId}
                          </span>
                          <span className="text-slate-500 truncate max-w-[170px]" title={agent.erc4337.smartAccountAddress}>
                            4337: {agent.erc4337.smartAccountAddress.slice(0, 8)}...{agent.erc4337.smartAccountAddress.slice(-6)}
                          </span>
                        </div>
                      </td>

                      {/* Balances */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <div className="font-semibold text-white">
                          ${agent.balances.usdc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {agent.balances.eth.toFixed(2)} ETH · {agent.balances.gasCredits} Gas Credits
                        </div>
                      </td>

                      {/* Velocity Gauge */}
                      <td className="py-3.5 px-4">
                        <div className="w-36">
                          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400 mb-1">
                            <span>${agent.spendingLimits.currentDailySpentUSD.toFixed(0)}</span>
                            <span className="text-slate-500">/ ${agent.spendingLimits.dailyCapUSD.toFixed(0)}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isNearCap ? 'bg-amber-400' : 'bg-cyan-400'
                              }`}
                              style={{ width: `${spendPercent}%` }}
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-slate-500 font-mono">
                            Max/tx: ${agent.spendingLimits.maxPerTxUSD}
                          </div>
                        </div>
                      </td>

                      {/* Session Key */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <KeyRound className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <div className="flex flex-col text-[11px]">
                            <span className="font-mono text-slate-300">
                              {agent.erc4337.activeSessionKeysCount} Key{agent.erc4337.activeSessionKeysCount === 1 ? '' : 's'} Active
                            </span>
                            <span className="text-slate-500 truncate max-w-[120px]">
                              Max ${agent.sessionKey.maxTxValueUSD}/call
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Operational Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(agent.status)}
                        <div className="mt-0.5 text-[10px] text-slate-500">
                          {agent.threatsIntercepted > 0 ? `${agent.threatsIntercepted} threats intercepted` : 'Zero anomalies'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectAgent(agent)}
                            title="Inspect Token Bound Account"
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenFirewallForAgent(agent)}
                            title="Configure Spend Firewall Policies"
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenSimulatorWithAgent(agent)}
                            title="Test UserOp in Firewall Sandbox"
                            className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 rounded transition-colors"
                          >
                            <Zap className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
