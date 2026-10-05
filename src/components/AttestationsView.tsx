import React, { useState } from 'react';
import { AttestationRecord } from '../types/fleet';
import { ShieldCheck, Search, Download, ExternalLink, Check, Copy, FileJson, AlertCircle } from 'lucide-react';

interface AttestationsViewProps {
  attestations: AttestationRecord[];
}

export const AttestationsView: React.FC<AttestationsViewProps> = ({ attestations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAttestation, setSelectedAttestation] = useState<AttestationRecord | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const filtered = attestations.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.recipientLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(attestations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aegis-eas-attestations-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Cryptographic Attestations & Audit Trail (EAS)
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every autonomous transaction and firewall interception is signed by SGX enclave attestors and indexed onto the Ethereum Attestation Service (EAS) for immutable regulatory readiness.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-md transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Package (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by UID, hash, agent, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Attestations</option>
            <option value="settled">Settled (Compliant)</option>
            <option value="blocked">Blocked (Threat Intercepted)</option>
            <option value="escalated">Escalated (Human Review)</option>
          </select>
        </div>
      </div>

      {/* Attestations Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Attestation UID / Timestamp</th>
                <th className="py-3 px-4">Agent Identity</th>
                <th className="py-3 px-4 text-right">Value (USD)</th>
                <th className="py-3 px-4">Counterparty / Recipient</th>
                <th className="py-3 px-4">Policy Compliance</th>
                <th className="py-3 px-4">Enclave Attester</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200 truncate max-w-[150px]" title={item.id}>
                      {item.id.slice(0, 10)}...{item.id.slice(-6)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans text-xs">
                    <div className="font-medium text-slate-200">{item.agentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Agent ID: {item.agentId}</div>
                  </td>

                  <td className="py-3 px-4 text-right tabular-nums text-xs">
                    <span className="font-semibold text-white">
                      ${item.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-slate-500 ml-1">{item.token}</span>
                  </td>

                  <td className="py-3 px-4 font-sans text-xs">
                    <div className="text-slate-200 truncate max-w-[160px]">{item.recipientLabel}</div>
                    <div className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                      {item.recipient.slice(0, 8)}...{item.recipient.slice(-6)}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          item.status === 'settled'
                            ? 'bg-emerald-400'
                            : item.status === 'blocked'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold capitalize ${
                          item.status === 'settled'
                            ? 'text-emerald-400'
                            : item.status === 'blocked'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {item.policySummary.ruleTriggered && (
                      <div className="text-[10px] text-rose-400 font-mono truncate max-w-[180px]">
                        Trigger: {item.policySummary.ruleTriggered}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-sans text-xs text-slate-400">
                    <div className="truncate max-w-[180px]">{item.attester}</div>
                    <div className="text-[10px] font-mono text-cyan-400">Schema: {item.schemaUID}</div>
                  </td>

                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedAttestation(item)}
                      className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attestation Inspector Modal */}
      {selectedAttestation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-cyan-400" />
                  <span>Attestation Record Proof</span>
                </h3>
                <div className="mt-1 font-mono text-xs text-slate-400 truncate max-w-md">
                  UID: {selectedAttestation.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedAttestation(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 text-[11px]">EAS Schema Identifier</span>
                <div className="font-mono text-cyan-300 mt-0.5">{selectedAttestation.schemaUID}</div>
              </div>
              <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 text-[11px]">Verification Enclave</span>
                <div className="font-mono text-slate-200 mt-0.5">{selectedAttestation.attester}</div>
              </div>
            </div>

            <div className="rounded bg-slate-950/60 border border-slate-800 p-3 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Agent Reasoning Excerpt</span>
              <p className="font-mono text-slate-300 text-[11px] leading-relaxed">
                "{selectedAttestation.agentReasoningSnippet}"
              </p>
            </div>

            <div className="rounded bg-slate-950 border border-slate-800 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">Raw ERC-4337 UserOp Calldata</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedAttestation.rawUserOp, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId ? 'Copied' : 'Copy Calldata'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900/80 rounded border border-slate-850">
                {JSON.stringify(selectedAttestation.rawUserOp, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAttestation(null)}
                className="px-4 py-1.5 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
