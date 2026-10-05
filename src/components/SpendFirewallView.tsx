import React, { useState } from 'react';
import { FirewallPolicyRule, PolicyCategory } from '../types/fleet';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Sliders, Lock, Zap } from 'lucide-react';

interface SpendFirewallViewProps {
  rules: FirewallPolicyRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (newRule: Omit<FirewallPolicyRule, 'id' | 'hits24h'>) => void;
  onLaunchSimulator: () => void;
}

export const SpendFirewallView: React.FC<SpendFirewallViewProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onLaunchSimulator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<PolicyCategory>('velocity');
  const [newRuleCondition, setNewRuleCondition] = useState('tx.value_usd > 500');
  const [newRuleThreshold, setNewRuleThreshold] = useState('$500.00 USD');
  const [newRuleAction, setNewRuleAction] = useState<FirewallPolicyRule['action']>('escalate_human');
  const [newRuleSeverity, setNewRuleSeverity] = useState<FirewallPolicyRule['severity']>('high');

  const categories = [
    { id: 'all', label: 'All Policy Rules' },
    { id: 'prompt_injection', label: 'Prompt Injection Defense' },
    { id: 'velocity', label: 'Velocity & Limits' },
    { id: 'allowlist', label: 'Allowlists & Blocklists' },
    { id: 'gas_cap', label: 'Gas Consumption Caps' },
  ];

  const filteredRules = rules.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    onAddRule({
      name: newRuleName.trim(),
      description: newRuleDesc.trim() || 'Custom agent spend policy rule',
      category: newRuleCategory,
      condition: newRuleCondition,
      threshold: newRuleThreshold,
      action: newRuleAction,
      severity: newRuleSeverity,
      isEnabled: true,
    });

    setNewRuleName('');
    setNewRuleDesc('');
    setShowAddRuleModal(false);
  };

  const getActionBadge = (action: FirewallPolicyRule['action']) => {
    switch (action) {
      case 'block':
        return <span className="font-mono text-rose-400">BLOCK_USEROP</span>;
      case 'escalate_human':
        return <span className="font-mono text-amber-400">ESCALATE_TO_HUMAN</span>;
      case 'quarantine_agent':
        return <span className="font-mono text-purple-400">QUARANTINE_AGENT</span>;
      case 'allow':
        return <span className="font-mono text-emerald-400">ALLOW</span>;
    }
  };

  const getSeverityColor = (severity: FirewallPolicyRule['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400';
      case 'high':
        return 'text-amber-400';
      case 'medium':
        return 'text-cyan-400';
      case 'low':
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Spend Firewall & Real-Time Policy Engine
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every autonomous transaction initiated by an agent is evaluated before execution against real-time velocity curves, cryptographic allowlists, and semantic prompt-injection detectors.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onLaunchSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 rounded-md hover:bg-cyan-900/60 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Simulate Threat Scenarios</span>
            </button>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Policy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rules Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-medium">
            <tr>
              <th className="py-3 px-4">Policy Rule & Intent</th>
              <th className="py-3 px-4">Evaluation Condition</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Firewall Action</th>
              <th className="py-3 px-4 text-center">24h Hits</th>
              <th className="py-3 px-4 text-center">Severity</th>
              <th className="py-3 px-4 text-right">Enforcement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRules.map((rule) => (
              <tr
                key={rule.id}
                className={`transition-colors ${
                  rule.isEnabled ? 'hover:bg-slate-800/20' : 'opacity-60 bg-slate-950/40'
                }`}
              >
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-semibold text-white">{rule.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                    {rule.description}
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                  <code>{rule.condition}</code>
                </td>

                <td className="py-3.5 px-4 font-mono text-cyan-300 text-[11px]">
                  {rule.threshold}
                </td>

                <td className="py-3.5 px-4 text-xs font-medium">
                  {getActionBadge(rule.action)}
                </td>

                <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-300">
                  {rule.hits24h}
                </td>

                <td className="py-3.5 px-4 text-center font-medium capitalize">
                  <span className={getSeverityColor(rule.severity)}>{rule.severity}</span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                      rule.isEnabled
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/60'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {rule.isEnabled ? 'Active' : 'Disabled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verified Vendor Allowlists & Prompt Injection Shield Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Allowlists */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Verified Machine-to-Machine Vendors</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Tier 1 Allowlist</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Transactions to these verified vendor contracts bypass manual approval up to the individual agent limit:
          </p>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Together.ai GPU Compute Rails', address: '0x881D...7b91', status: 'Whitelisted' },
              { name: 'OpenAI Direct Batch API Vault', address: '0x3914...419b', status: 'Whitelisted' },
              { name: 'HuggingFace Endpoint Cluster', address: '0x12c4...aa01', status: 'Whitelisted' },
              { name: 'ArXiv & Nature DOI Micro-pay Gate', address: '0x1928...3019', status: 'Whitelisted' },
            ].map((vendor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80"
              >
                <div>
                  <div className="font-medium text-slate-200">{vendor.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">{vendor.address}</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">{vendor.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Injection & Semantic Firewall Engine */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Prompt-Injection Defense Guardian</span>
            </h3>
            <span className="text-[11px] text-rose-400 font-mono">Active Interceptor</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Prevents adversaries from manipulating LLM outputs (via poisoned prompts, scraped web data, or third-party API responses) to drain funds.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-slate-300 font-medium">Calldata Semantic Alignment Check</div>
              <div className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                Before the session key signs a UserOp, the Spend Firewall parses the agent’s reasoning tokens against the generated ABI parameters. If an injection is detected, execution aborts immediately.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-slate-300 font-medium">Automatic Emergency Circuit Breaker</div>
              <div className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                If an agent experiences 2 consecutive injection payloads or anomalous velocity spikes, its ERC-4337 session keys are automatically revoked on-chain.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Policy Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create Spend Firewall Policy</h3>
            <p className="mt-1 text-xs text-slate-400">
              Define a new deterministic policy constraint to enforce across all autonomous agent wallets.
            </p>

            <form onSubmit={handleCreateRule} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Policy Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Max GPU Inference Hourly Ceiling"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <input
                  type="text"
                  placeholder="Explain why this constraint is enforced..."
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={(e) => setNewRuleCategory(e.target.value as PolicyCategory)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="velocity">Velocity & Limits</option>
                    <option value="allowlist">Allowlist & Blocklist</option>
                    <option value="prompt_injection">Prompt Injection Defense</option>
                    <option value="gas_cap">Gas Consumption Cap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Enforcement Action</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as FirewallPolicyRule['action'])}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="escalate_human">Escalate to Human Queue</option>
                    <option value="block">Block UserOp Immediately</option>
                    <option value="quarantine_agent">Quarantine Agent & Revoke Key</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Threshold Expression</label>
                  <input
                    type="text"
                    required
                    placeholder="$1,000.00 USD"
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Severity Level</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value as FirewallPolicyRule['severity'])}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
