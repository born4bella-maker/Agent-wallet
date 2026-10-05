import React, { useState } from 'react';
import { AgentWallet } from '../types/fleet';
import { X, ShieldAlert, KeyRound, ExternalLink, Check, Copy, AlertOctagon, RotateCcw } from 'lucide-react';

interface AgentDetailModalProps {
  agent: AgentWallet | null;
  onClose: () => void;
  onToggleQuarantine: (agentId: string) => void;
  onFundAgent: (agentId: string, amount: number) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onToggleQuarantine,
  onFundAgent,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('500');
  const [fundingSuccess, setFundingSuccess] = useState(false);

  if (!agent) return null;

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fundAmount);
    if (!isNaN(val) && val > 0) {
      onFundAgent(agent.id, val);
      setFundingSuccess(true);
      setTimeout(() => setFundingSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-6 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{agent.name}</h2>
              <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {agent.codename}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-xl">
              {agent.purpose}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Model: <strong className="text-slate-300 font-medium">{agent.modelFamily}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Cluster: <strong className="text-slate-300 font-medium">{agent.cluster}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Policy: <strong className="text-cyan-400 font-medium">{agent.policyProfile}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Balance & Funding Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">USDC Treasury Vault</span>
              <div className="mt-1 text-xl font-bold text-white font-mono tabular-nums">
                ${agent.balances.usdc.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">ERC-20 Token Balance</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Gas Tank Reserve</span>
              <div className="mt-1 text-xl font-bold text-cyan-400 font-mono tabular-nums">
                {agent.balances.gasCredits} Credits
              </div>
              <div className="mt-1 text-[11px] text-slate-500">{agent.balances.eth.toFixed(3)} Native ETH</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400">Inject Vault Liquidity</span>
              <form onSubmit={handleFund} className="mt-2 flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors shrink-0"
                >
                  {fundingSuccess ? 'Funded!' : 'Deposit'}
                </button>
              </form>
            </div>
          </div>

          {/* ERC-6551 Token Bound Account Specification */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                ERC-6551 Token Bound Account Architecture
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">EIP-6551 Registry v1</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">NFT Identity Contract (ERC-721)</span>
                <div className="mt-1 flex items-center justify-between font-mono text-slate-200">
                  <span className="truncate mr-2">{agent.erc6551.tokenContract}</span>
                  <button
                    onClick={() => handleCopy('tokenContract', agent.erc6551.tokenContract)}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    {copiedField === 'tokenContract' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Bound Token ID</span>
                <div className="mt-1 font-mono text-slate-200">
                  #{agent.erc6551.tokenId} (Chain ID: {agent.erc6551.chainId} Ethereum Mainnet)
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">ERC-6551 Registry Contract</span>
                <div className="mt-1 flex items-center justify-between font-mono text-slate-200">
                  <span className="truncate mr-2">{agent.erc6551.registryAddress}</span>
                  <button
                    onClick={() => handleCopy('registry', agent.erc6551.registryAddress)}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    {copiedField === 'registry' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">TBA Implementation Proxy</span>
                <div className="mt-1 flex items-center justify-between font-mono text-slate-200">
                  <span className="truncate mr-2">{agent.erc6551.implementation}</span>
                  <button
                    onClick={() => handleCopy('impl', agent.erc6551.implementation)}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    {copiedField === 'impl' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ERC-4337 Account Abstraction Details */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                ERC-4337 Smart Account & Bundler Integration
              </h3>
              <span className="text-[11px] font-mono text-indigo-400">Canonical EntryPoint 0.7.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Smart Account Address</span>
                <div className="mt-1 flex items-center justify-between font-mono text-slate-200">
                  <span className="truncate mr-2">{agent.erc4337.smartAccountAddress}</span>
                  <button
                    onClick={() => handleCopy('smartAccount', agent.erc4337.smartAccountAddress)}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    {copiedField === 'smartAccount' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Paymaster Policy</span>
                <div className="mt-1 font-mono text-emerald-400">
                  {agent.erc4337.paymasterPolicy}
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Account Nonce</span>
                <div className="mt-1 font-mono text-slate-200">
                  {agent.erc4337.nonce} executed UserOps
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Assigned Bundler Relayer</span>
                <div className="mt-1 font-mono text-slate-200">
                  {agent.erc4337.bundler}
                </div>
              </div>
            </div>
          </div>

          {/* Ephemeral Session Key Delegation */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <span>Delegated Ephemeral Session Key</span>
            </div>
            <p className="text-xs text-slate-400">
              The agent holds an isolated ephemeral private key with scoped execution rights. Even if the AI agent's memory or runtime environment is compromised, the session key cannot bypass these constraints:
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[11px]">Key Hash</div>
                <div className="text-slate-200 truncate">{agent.sessionKey.keyHash}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[11px]">Max USD / Call</div>
                <div className="text-slate-200">${agent.sessionKey.maxTxValueUSD}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[11px]">Gas Allowance</div>
                <div className="text-slate-200">{agent.sessionKey.maxGasAllowanceGwei} Gwei</div>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Allowed Selectors: {agent.sessionKey.allowedMethods.length > 0 ? (
                <span className="font-mono text-cyan-300">{agent.sessionKey.allowedMethods.join(', ')}</span>
              ) : (
                <span className="text-rose-400 font-mono">None (Revoked)</span>
              )}
            </div>
          </div>

          {/* Emergency Quarantine Controls */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertOctagon className={`h-5 w-5 ${agent.status === 'quarantined' ? 'text-rose-400' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-semibold text-white">
                  {agent.status === 'quarantined' ? 'Agent Is Quarantined' : 'Emergency Quarantine Control'}
                </div>
                <div className="text-xs text-slate-400">
                  {agent.status === 'quarantined'
                    ? 'All session keys are revoked. No transactions can leave this wallet.'
                    : 'Instantly revoke session keys and freeze autonomous payment rails.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleQuarantine(agent.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                agent.status === 'quarantined'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-800/80 hover:bg-rose-900/60'
              }`}
            >
              {agent.status === 'quarantined' ? 'Release Quarantine' : 'Quarantine Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
