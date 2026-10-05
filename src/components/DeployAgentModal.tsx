import React, { useState } from 'react';
import { AgentWallet } from '../types/fleet';
import { X, Cpu, PlusCircle, Check } from 'lucide-react';

interface DeployAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (agent: AgentWallet) => void;
}

export const DeployAgentModal: React.FC<DeployAgentModalProps> = ({ isOpen, onClose, onDeploy }) => {
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [purpose, setPurpose] = useState('');
  const [cluster, setCluster] = useState<AgentWallet['cluster']>('Compute & Inference');
  const [modelFamily, setModelFamily] = useState('Claude 3.7 Sonnet');
  const [initialDepositUSDC, setInitialDepositUSDC] = useState<number>(5000);
  const [maxPerTxUSD, setMaxPerTxUSD] = useState<number>(500);
  const [dailyCapUSD, setDailyCapUSD] = useState<number>(2500);
  const [policyProfile, setPolicyProfile] = useState('Strict Compute Procurement Policy v4');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomHex = () =>
      Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const randomTokenId = Math.floor(1000 + Math.random() * 9000).toString();

    const newAgent: AgentWallet = {
      id: `agt-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      codename: (codename.trim() || name.slice(0, 8).toUpperCase()).replace(/\s+/g, '-'),
      purpose: purpose.trim() || 'Autonomous digital commerce and micro-procurement worker',
      cluster,
      modelFamily,
      status: 'nominal',
      erc6551: {
        registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
        tokenContract: '0x3565e317042a344d9f67a21f6a19f3900dc1bc88',
        tokenId: randomTokenId,
        chainId: 1,
        salt: '0x00000000000000000000000000000000000000000000000000000000' + randomTokenId,
        implementation: '0x2d25602551487c3f3354dd80d76d54383a243358',
      },
      erc4337: {
        entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
        smartAccountAddress: `0x${randomHex()}`,
        bundler: 'Aegis Sentinel Bundler v2',
        paymasterPolicy: 'VerifyingPaymaster (Zero-Slip Gas)',
        nonce: 0,
        activeSessionKeysCount: 1,
      },
      balances: {
        usdc: initialDepositUSDC,
        eth: 1.5,
        gasCredits: 250,
      },
      spendingLimits: {
        maxPerTxUSD,
        dailyCapUSD,
        currentDailySpentUSD: 0,
        hourlyVelocityUSD: 0,
        hourlyVelocityCapUSD: Math.round(dailyCapUSD * 0.4),
      },
      policyProfile,
      sessionKey: {
        keyHash: `0x${randomHex().slice(0, 4)}...${randomHex().slice(-4)}`,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        maxGasAllowanceGwei: 40,
        allowedMethods: ['0xa9059cbb (transfer)', '0x095ea7b3 (approve)'],
        maxTxValueUSD: maxPerTxUSD,
      },
      recentTransactionsCount: 0,
      threatsIntercepted: 0,
      lastActive: 'Provisioned just now',
    };

    onDeploy(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Deploy Token-Bound Agent Account</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Provisions an ERC-6551 Token Bound Account (NFT-owned identity) paired with an ERC-4337 smart account and active Spend Firewall policy guardian.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Agent Fleet Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Synthetic Benchmark Evaluator"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Codename Identifier</label>
              <input
                type="text"
                placeholder="e.g. BENCH-EVAL-09"
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Operational Purpose</label>
            <input
              type="text"
              placeholder="e.g. Evaluates model benchmark outputs and pays micro-bounties"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Fleet Cluster</label>
              <select
                value={cluster}
                onChange={(e) => setCluster(e.target.value as AgentWallet['cluster'])}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Compute & Inference">Compute & Inference</option>
                <option value="Research & Synthesis">Research & Synthesis</option>
                <option value="Procurement">Procurement</option>
                <option value="Operations & Payroll">Operations & Payroll</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Foundation Model</label>
              <select
                value={modelFamily}
                onChange={(e) => setModelFamily(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                <option value="DeepSeek R1">DeepSeek R1</option>
                <option value="GPT-4.5 Sovereign">GPT-4.5 Sovereign</option>
                <option value="Llama 3.3 70B Quant">Llama 3.3 70B Quant</option>
                <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Initial USDC Vault</label>
              <input
                type="number"
                min="100"
                step="500"
                value={initialDepositUSDC}
                onChange={(e) => setInitialDepositUSDC(parseFloat(e.target.value) || 0)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Max USD / Tx</label>
              <input
                type="number"
                min="10"
                step="50"
                value={maxPerTxUSD}
                onChange={(e) => setMaxPerTxUSD(parseFloat(e.target.value) || 0)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Daily Spend Ceiling</label>
              <input
                type="number"
                min="50"
                step="250"
                value={dailyCapUSD}
                onChange={(e) => setDailyCapUSD(parseFloat(e.target.value) || 0)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Spend Firewall Profile</label>
            <select
              value={policyProfile}
              onChange={(e) => setPolicyProfile(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="Strict Compute Procurement Policy v4">Strict Compute Procurement Policy v4</option>
              <option value="Micro-Streaming RAG Policy">Micro-Streaming RAG Policy</option>
              <option value="High-Frequency M2M Market Maker Policy">High-Frequency M2M Market Maker Policy</option>
              <option value="Zero-Trust High Security Sandbox">Zero-Trust High Security Sandbox</option>
            </select>
          </div>

          <div className="rounded bg-slate-950/60 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between font-mono">
              <span>Token Bound Registry:</span>
              <span className="text-slate-300">0x0210...0921 (Canonical ERC-6551)</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>EntryPoint:</span>
              <span className="text-slate-300">0x5FF1...2789 (ERC-4337 v0.7)</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Deploy Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
