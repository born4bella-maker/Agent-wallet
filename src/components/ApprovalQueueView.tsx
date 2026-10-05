import React, { useState } from 'react';
import { HumanApprovalItem } from '../types/fleet';
import { Check, X, ShieldAlert, AlertTriangle, Eye, FileText, Lock, Bell, Sliders, Send, MessageSquare } from 'lucide-react';

interface ApprovalQueueViewProps {
  approvals: HumanApprovalItem[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onQuarantineAgentFromApproval: (agentId: string) => void;
}

export const ApprovalQueueView: React.FC<ApprovalQueueViewProps> = ({
  approvals,
  onApprove,
  onReject,
  onQuarantineAgentFromApproval,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'triggers' | 'ux_architecture'>('queue');
  const [selectedItem, setSelectedItem] = useState<HumanApprovalItem | null>(
    approvals.find((a) => a.status === 'pending') || approvals[0] || null
  );
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Trigger Settings State
  const [thresholdAmount, setThresholdAmount] = useState('2500');
  const [triggerNewVendors, setTriggerNewVendors] = useState(true);
  const [triggerMixingServices, setTriggerMixingServices] = useState(true);
  const [triggerAnomalyScore, setTriggerAnomalyScore] = useState('65');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [isTestNotificationSent, setIsTestNotificationSent] = useState(false);

  const pendingList = approvals.filter((a) => a.status === 'pending');
  const resolvedList = approvals.filter((a) => a.status !== 'pending');

  const handleConfirmReject = () => {
    if (selectedItem) {
      onReject(selectedItem.id, rejectReason || 'Operator rejected: Policy threshold exceeded.');
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  const handleSendTestAlert = () => {
    setIsTestNotificationSent(true);
    setTimeout(() => setIsTestNotificationSent(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Human Approval & Multi-Sig Governance
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl leading-relaxed">
              High-value autonomous transactions, unfamiliar vendor contracts, and anomalous reasoning traces trigger instant human escalation with cryptographic multi-sig authorization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-xs font-mono">
              <span className="text-slate-400">Escrow Queue: </span>
              <span className="text-amber-400 font-bold">{pendingList.length} Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Queue vs Trigger Rules vs Dual UX Flow */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('queue')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'queue'
              ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pending Review Queue ({pendingList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('triggers')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'triggers'
              ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Trigger Conditions & Notifications
        </button>
        <button
          onClick={() => setActiveSubTab('ux_architecture')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSubTab === 'ux_architecture'
              ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dual Actor UX Architecture
        </button>
      </div>

      {/* SubTab 1: Queue */}
      {activeSubTab === 'queue' && (
        approvals.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center text-slate-400">
            <Check className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
            <div className="text-base font-semibold text-white">Approval Queue Is Empty</div>
            <div className="mt-1 text-xs text-slate-500">
              All autonomous transactions are currently within nominal firewall thresholds.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Escrow Items List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                Escrowed Requests ({pendingList.length} Pending)
              </h3>

              <div className="space-y-2.5">
                {approvals.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsRejecting(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-amber-500/80 bg-slate-900 ring-1 ring-amber-500/40'
                          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                          {item.agentName}
                        </span>
                        <span className="text-xs font-bold text-white font-mono tabular-nums">
                          ${item.amountUSD.toLocaleString()} {item.token}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-slate-400 truncate">
                        {item.recipientLabel}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-amber-400 truncate max-w-[220px]">
                          Trigger: {item.triggerRule}
                        </span>
                        <span
                          className={`font-mono capitalize px-1.5 py-0.5 rounded text-[10px] ${
                            item.status === 'pending'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                              : item.status === 'approved'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Inspector & Multi-Sig Action (7 cols) */}
            <div className="lg:col-span-7">
              {selectedItem ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">Escrowed Transaction #{selectedItem.id}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>Agent: <strong className="text-slate-200">{selectedItem.agentName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Requested by: <strong className="text-cyan-400">{selectedItem.requestedByModel}</strong></span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xl font-bold text-white tabular-nums">
                        ${selectedItem.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedItem.token}
                      </div>
                      <div className="text-xs text-amber-400">Risk Score: {selectedItem.riskScore}/100</div>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[11px]">Recipient Smart Contract</span>
                      <div className="mt-1 font-mono text-slate-200 truncate" title={selectedItem.recipient}>
                        {selectedItem.recipient}
                      </div>
                      <div className="text-[11px] text-cyan-400 mt-0.5">{selectedItem.recipientLabel}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[11px]">Firewall Policy Trigger</span>
                      <div className="mt-1 font-medium text-amber-300">{selectedItem.triggerRule}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{selectedItem.reason}</div>
                    </div>
                  </div>

                  {/* Agent Reasoning Trace */}
                  <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      <span>Agent Chain-of-Thought & Reasoning Trace</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900 p-3 rounded border border-slate-800/80">
                      "{selectedItem.agentIntentTrace}"
                    </p>
                  </div>

                  {/* Multi-Sig Sign-off Actions */}
                  {selectedItem.status === 'pending' ? (
                    <div className="pt-2">
                      {isRejecting ? (
                        <div className="space-y-3 rounded-lg border border-rose-800/80 bg-rose-950/30 p-4">
                          <span className="text-xs font-semibold text-rose-300">
                            Specify Rejection Reason (Sent to Agent Memory):
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. Budget reallocation / vendor not approved..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full rounded border border-rose-700/60 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setIsRejecting(false)}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirmReject}
                              className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <button
                            onClick={() => onQuarantineAgentFromApproval(selectedItem.agentId)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-md hover:bg-rose-900/60 transition-colors"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Quarantine Agent</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsRejecting(true)}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject UserOp</span>
                            </button>

                            <button
                              onClick={() => onApprove(selectedItem.id)}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-all shadow-sm"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Sign & Co-Authorize Execution</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
                      <span>
                        This transaction has already been{' '}
                        <strong className={selectedItem.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'}>
                          {selectedItem.status.toUpperCase()}
                        </strong>
                        .
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">Immutable Audit Record</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-500">
                  Select an escrow item on the left to inspect calldata and intent traces.
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* SubTab 2: Trigger Conditions & Notification Channels */}
      {activeSubTab === 'triggers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Trigger Rules */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span>Escalation Trigger Thresholds</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Define the transaction boundary conditions that mandate human sign-off before smart contract execution.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  High-Value Transaction Threshold (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-7 pr-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Any UserOp &gt; ${thresholdAmount} automatically pauses the agent and triggers a human notification.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200">First-Time / Unverified Vendors</span>
                    <p className="text-[11px] text-slate-400">Escalate if contract address is absent from Verified Registry.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={triggerNewVendors}
                    onChange={(e) => setTriggerNewVendors(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200">DeFi Swaps & Liquidity Pools</span>
                    <p className="text-[11px] text-slate-400">Escalate DEX swaps (`swapExactTokensForTokens`) over $1,000.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={triggerMixingServices}
                    onChange={(e) => setTriggerMixingServices(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Reasoning Anomaly Sensitivity Ceiling ({triggerAnomalyScore}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={triggerAnomalyScore}
                  onChange={(e) => setTriggerAnomalyScore(e.target.value)}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>20% (Ultra Strict)</span>
                  <span className="text-amber-300 font-bold">{triggerAnomalyScore}% Anomaly</span>
                  <span>90% (High Tolerance)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Notification Channels & Webhook Integrations */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400" />
                <span>Approver Notification Dispatch</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Send push alerts with deep-links to mobile or desktop human signers when escrow triggers fire.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Slack Incident Channel Webhook</span>
                </label>
                <input
                  type="text"
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono text-[11px] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Primary Dispatch</span>
                  <div className="font-semibold text-slate-200 mt-1">#finance-agent-escrow</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">● Connected</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Fallback Escalation</span>
                  <div className="font-semibold text-slate-200 mt-1">PagerDuty On-Call P2</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">● Multi-Sig Signer</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendTestAlert}
                  disabled={isTestNotificationSent}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
                >
                  <Send className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isTestNotificationSent ? '✓ Webhook Payload Delivered to #finance-agent-escrow' : 'Send Test Notification Payload'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Dual Actor UX Architecture */}
      {activeSubTab === 'ux_architecture' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Dual-Actor User Experience & Lifecycle</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
              Autonomous agents and human operators interact via asynchronous cryptographic handshakes. Here is the operational state machine:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Actor 1: Agent Experience */}
            <div className="p-5 rounded-xl border border-cyan-900/50 bg-slate-950/80 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-mono">
                  A
                </span>
                <span>The Autonomous Agent Experience</span>
              </div>

              <ol className="space-y-3 text-slate-300">
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">1. UserOp Generation & Policy Rejection</strong>
                  Agent submits UserOp to Spend Firewall Guardian. Firewall triggers rule (e.g. value &gt; $2,500).
                </li>
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">2. Asynchronous State Hold (HTTP 202 Accepted)</strong>
                  Instead of throwing a fatal execution error, the gateway returns an <code className="font-mono text-cyan-300">ESCROW_PENDING</code> ticket with polling URL. The agent halts this specific sub-task without crashing.
                </li>
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">3. Webhook / Polling Callback</strong>
                  Upon human decision:
                  <ul className="mt-1 space-y-0.5 text-[11px] text-slate-400 list-disc list-inside">
                    <li><strong className="text-emerald-400">If Approved:</strong> Receives signed UserOp hash and proceeds to next reasoning step.</li>
                    <li><strong className="text-rose-400">If Rejected:</strong> Receives structured rejection reason and adds note to its short-term memory to re-plan.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Actor 2: Human Operator Experience */}
            <div className="p-5 rounded-xl border border-amber-900/50 bg-slate-950/80 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-950 border border-amber-800 text-[11px] font-mono">
                  B
                </span>
                <span>The Human Operator Experience</span>
              </div>

              <ol className="space-y-3 text-slate-300">
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">1. Instant Contextual Notification</strong>
                  Approver receives Slack/PagerDuty push with agent codename, amount, and deep link to the Aegis Escrow Inspector.
                </li>
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">2. Chain-of-Thought Audit</strong>
                  Operator reviews the agent's exact prompt intent trace, verifying that the agent actually intended this spend and was not hijacked.
                </li>
                <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <strong className="text-white block mb-0.5">3. 1-Click Cryptographic Co-Sign</strong>
                  Approver signs via WebAuthn / Passkey / Multi-sig. The transaction executes via ERC-4337 EntryPoint and mints an EAS Attestation receipt for compliance.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
