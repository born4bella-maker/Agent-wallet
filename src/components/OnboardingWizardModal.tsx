import React, { useState } from 'react';
import { AgentWallet } from '../types/fleet';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  Cpu,
  Layers,
  Sliders,
  CreditCard,
  Rocket,
  Info,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (agent: AgentWallet) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [agentName, setAgentName] = useState('Research Data Specialist');
  const [codename, setCodename] = useState('RES-DATA-01');
  const [purpose, setPurpose] = useState('Purchases ArXiv research papers, patent database tokens, and specialized scientific datasets.');
  const [modelFamily, setModelFamily] = useState('Claude 3.7 Sonnet');
  const [cluster, setCluster] = useState<AgentWallet['cluster']>('Research & Synthesis');

  // Policy Preset
  const [policyPreset, setPolicyPreset] = useState<'strict' | 'standard' | 'high_throughput'>('standard');
  const [maxPerTxUSD, setMaxPerTxUSD] = useState<number>(250);
  const [dailyCapUSD, setDailyCapUSD] = useState<number>(1500);
  const [enablePromptInjectionShield, setEnablePromptInjectionShield] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([
    'Together.ai Cloud GPU',
    'OpenAI Direct API',
    'ArXiv & Nature DOI Gate'
  ]);

  // Funding
  const [fundingAmount, setFundingAmount] = useState<number>(1000);
  const [fundingMethod, setFundingMethod] = useState<'fiat_card' | 'usdc_crypto' | 'sandbox_grant'>('sandbox_grant');

  // Simulation test in Step 5
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 5;

  const handlePresetSelect = (preset: 'strict' | 'standard' | 'high_throughput') => {
    setPolicyPreset(preset);
    if (preset === 'strict') {
      setMaxPerTxUSD(100);
      setDailyCapUSD(500);
    } else if (preset === 'standard') {
      setMaxPerTxUSD(250);
      setDailyCapUSD(1500);
    } else {
      setMaxPerTxUSD(1500);
      setDailyCapUSD(6000);
    }
  };

  const toggleVendor = (vendorName: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorName) ? prev.filter((v) => v !== vendorName) : [...prev, vendorName]
    );
  };

  const handleRunVerificationTest = () => {
    setIsTestRunning(true);
    setTimeout(() => {
      setIsTestRunning(false);
      setTestSuccess(true);
    }, 1200);
  };

  const handleFinishDeployment = () => {
    const randomHex = () =>
      Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const randomTokenId = Math.floor(2000 + Math.random() * 7000).toString();

    const createdAgent: AgentWallet = {
      id: `agt-${Date.now().toString().slice(-6)}`,
      name: agentName.trim(),
      codename: (codename.trim() || agentName.slice(0, 8).toUpperCase()).replace(/\s+/g, '-'),
      purpose: purpose.trim(),
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
        nonce: 1,
        activeSessionKeysCount: 1,
      },
      balances: {
        usdc: fundingAmount,
        eth: 2.0,
        gasCredits: 350,
      },
      spendingLimits: {
        maxPerTxUSD,
        dailyCapUSD,
        currentDailySpentUSD: 0,
        hourlyVelocityUSD: 0,
        hourlyVelocityCapUSD: Math.round(dailyCapUSD * 0.4),
      },
      policyProfile: `${policyPreset === 'strict' ? 'Strict Sandbox' : policyPreset === 'standard' ? 'Standard Enterprise' : 'High Velocity'} Policy`,
      sessionKey: {
        keyHash: `0x${randomHex().slice(0, 4)}...${randomHex().slice(-4)}`,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        maxGasAllowanceGwei: 40,
        allowedMethods: ['0xa9059cbb (transfer)', '0x095ea7b3 (approve)'],
        maxTxValueUSD: maxPerTxUSD,
      },
      recentTransactionsCount: 1,
      threatsIntercepted: 0,
      lastActive: 'Deployed via Onboarding Wizard',
    };

    onComplete(createdAgent);
    onClose();
  };

  const stepsMeta = [
    { num: 1, label: 'Identity & Role' },
    { num: 2, label: 'Token Vault' },
    { num: 3, label: 'Spend Firewall' },
    { num: 4, label: 'Initial Deposit' },
    { num: 5, label: 'Deploy & Verify' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Top Header */}
        <div className="border-b border-slate-800 bg-slate-950/70 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Agent Fleet Setup Wizard
                </h2>
                <p className="text-xs text-slate-400">
                  Step-by-step non-custodial onboarding for autonomous AI agents
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mt-6 flex items-center justify-between">
            {stepsMeta.map((s, idx) => {
              const isPast = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono font-bold transition-all ${
                        isPast
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isPast ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.num}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs font-medium whitespace-nowrap ${
                        isCurrent ? 'text-white' : isPast ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < stepsMeta.length - 1 && (
                    <div
                      className={`flex-1 mx-3 h-0.5 rounded transition-all ${
                        currentStep > s.num ? 'bg-emerald-500/80' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 md:p-8 flex-1 max-h-[60vh] overflow-y-auto space-y-6">
          {/* STEP 1: IDENTITY & ROLE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Define Agent Role & Intelligence Model</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Give your autonomous agent a human-readable title, codename, and select the foundation model driving its reasoning.
                </p>
              </div>

              {/* Template Quick-Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quick Role Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      name: 'Compute Procurement',
                      code: 'COMP-H100-01',
                      cluster: 'Compute & Inference' as AgentWallet['cluster'],
                      purpose: 'Autonomously buys GPU clusters and inference capacity on demand.',
                    },
                    {
                      name: 'Research & Data Indexer',
                      code: 'RES-DATA-01',
                      cluster: 'Research & Synthesis' as AgentWallet['cluster'],
                      purpose: 'Purchases scientific paywalled papers, patents, and web datasets.',
                    },
                    {
                      name: 'Code Review & Bounty',
                      code: 'BOUNTY-AUDIT-02',
                      cluster: 'Procurement' as AgentWallet['cluster'],
                      purpose: 'Receives and disburses micro-bounties for security fuzzing runs.',
                    },
                  ].map((tpl) => (
                    <button
                      key={tpl.name}
                      type="button"
                      onClick={() => {
                        setAgentName(tpl.name);
                        setCodename(tpl.code);
                        setCluster(tpl.cluster);
                        setPurpose(tpl.purpose);
                      }}
                      className="p-3 text-left rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/60 transition-all text-xs"
                    >
                      <div className="font-semibold text-white">{tpl.name}</div>
                      <div className="mt-1 text-slate-400 text-[11px] line-clamp-2">{tpl.purpose}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Agent Fleet Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g. GPU Infrastructure Buyer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Codename Identifier</label>
                  <input
                    type="text"
                    value={codename}
                    onChange={(e) => setCodename(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none uppercase"
                    placeholder="e.g. COMP-GPU-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Organizational Cluster</label>
                  <select
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value as AgentWallet['cluster'])}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Compute & Inference">Compute & Inference</option>
                    <option value="Research & Synthesis">Research & Synthesis</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Operations & Payroll">Operations & Payroll</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">AI Reasoning Engine</label>
                  <select
                    value={modelFamily}
                    onChange={(e) => setModelFamily(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (Recommended for Procurement)</option>
                    <option value="DeepSeek R1">DeepSeek R1 (Advanced Reasoning & Search)</option>
                    <option value="GPT-4.5 Sovereign">GPT-4.5 Sovereign</option>
                    <option value="Llama 3.3 70B Quant">Llama 3.3 70B Quant (Low Latency M2M)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Agent Purpose & Mandate</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TOKEN-BOUND ACCOUNT (ERC-6551) */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Non-Custodial Account Architecture</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  How does an AI agent own assets without exposing your company to risk? Aegis uses <strong>ERC-6551 Token Bound Accounts</strong> to bind a smart contract wallet directly to an on-chain agent identity.
                </p>
              </div>

              {/* Explainer Box: Plain English Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-2">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>Traditional Crypto Bots (Fragile)</span>
                  </div>
                  <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                    <li>Stores raw private key in memory or environment variable.</li>
                    <li>If prompt injection occurs, attacker steals full private key.</li>
                    <li>No velocity controls or automated emergency revocation.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-2">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Aegis Token-Bound Architecture (Secure)</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Agent owns an identity NFT linked to a smart account.</li>
                    <li>Agent only receives short-lived <strong>Session Keys</strong>.</li>
                    <li>Root ownership remains with your enterprise multi-sig.</li>
                  </ul>
                </div>
              </div>

              {/* Visual Architecture Map */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Generated Vault Configuration</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Registry Standard</div>
                    <div className="text-cyan-400 font-bold mt-0.5">ERC-6551 v1</div>
                    <div className="text-[10px] text-slate-500 mt-1">EIP Canonical Registry</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Execution Engine</div>
                    <div className="text-indigo-400 font-bold mt-0.5">ERC-4337 v0.7</div>
                    <div className="text-[10px] text-slate-500 mt-1">Canonical EntryPoint</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Gas Sponsorship</div>
                    <div className="text-emerald-400 font-bold mt-0.5">Zero-Slip Paymaster</div>
                    <div className="text-[10px] text-slate-500 mt-1">Settles gas in USDC</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Smart Account Address: <span className="font-mono text-slate-200">0x88f2...41a9 (Deterministic)</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                    Ready to Deploy
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SPEND FIREWALL & POLICY LIMITS */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Configure Spend Firewall & Guardrails</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Establish deterministic financial limits. The agent cannot exceed these thresholds even if its reasoning logic is manipulated.
                </p>
              </div>

              {/* Policy Preset Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Policy Profile Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'strict',
                      title: 'Strict Sandbox',
                      desc: 'For testing new agents. Low limits with mandatory human co-signing.',
                      perTx: '$100.00',
                      daily: '$500.00',
                    },
                    {
                      id: 'standard',
                      title: 'Standard Enterprise',
                      desc: 'Ideal for operational procurement and serverless inference tasks.',
                      perTx: '$250.00',
                      daily: '$1,500.00',
                    },
                    {
                      id: 'high_throughput',
                      title: 'High Velocity M2M',
                      desc: 'For high-frequency algorithmic pipelines and data trading.',
                      perTx: '$1,500.00',
                      daily: '$6,000.00',
                    },
                  ].map((p) => {
                    const isSelected = policyPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePresetSelect(p.id as any)}
                        className={`p-3.5 text-left rounded-xl border transition-all text-xs ${
                          isSelected
                            ? 'border-cyan-500/80 bg-slate-900 shadow-md ring-1 ring-cyan-500/30'
                            : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span>{p.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-cyan-400" />}
                        </div>
                        <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">{p.desc}</p>
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 flex justify-between">
                          <span>Max/Tx: {p.perTx}</span>
                          <span className="text-cyan-300">Cap: {p.daily}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Threshold Fine-Tuning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Max Single Transaction (USD)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={maxPerTxUSD}
                    onChange={(e) => setMaxPerTxUSD(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Any transaction above this is held in Human Escrow.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Daily Cumulative Spending Limit (USD)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="250"
                    value={dailyCapUSD}
                    onChange={(e) => setDailyCapUSD(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Hard ceiling per 24-hour rolling window.
                  </span>
                </div>
              </div>

              {/* Whitelisted Counterparties */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pre-Approved Verified Vendor Allowlist
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Together.ai Cloud GPU',
                    'OpenAI Direct API',
                    'Anthropic Infrastructure',
                    'HuggingFace Compute',
                    'ArXiv & Nature DOI Gate',
                    'AWS Bedrock Relayer',
                  ].map((vendor) => {
                    const isChecked = selectedVendors.includes(vendor);
                    return (
                      <button
                        key={vendor}
                        type="button"
                        onClick={() => toggleVendor(vendor)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          isChecked
                            ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        <span className="truncate pr-1 text-[11px]">{vendor}</span>
                        {isChecked && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Injection Shield Toggle */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span>Semantic Prompt-Injection Interceptor</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Analyzes reasoning traces before session key signing. Halts if discrepancy &gt; 15%.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnablePromptInjectionShield(!enablePromptInjectionShield)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    enablePromptInjectionShield
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {enablePromptInjectionShield ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FUNDING SOURCE & INITIAL DEPOSIT */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Fund Initial Agent Vault Liquidity</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Deposit funds into your agent’s ERC-6551 vault. The agent only has access to allocated budget and cannot touch your main corporate balance.
                </p>
              </div>

              {/* Funding Rail Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'sandbox_grant',
                    title: 'Sponsored Sandbox Credit',
                    badge: 'Instant Setup',
                    desc: 'Start immediately with $1,000 simulated USDC on the Aegis Testnet.',
                  },
                  {
                    id: 'fiat_card',
                    title: 'Corporate Credit Card',
                    badge: 'Stripe Onramp',
                    desc: 'Link a corporate expense card to auto-refill the agent USDC tank.',
                  },
                  {
                    id: 'usdc_crypto',
                    title: 'Direct USDC Transfer',
                    badge: 'On-Chain',
                    desc: 'Transfer from an existing corporate multi-sig (Safe / Fireblocks).',
                  },
                ].map((opt) => {
                  const isSelected = fundingMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFundingMethod(opt.id as any)}
                      className={`p-3.5 text-left rounded-xl border transition-all text-xs ${
                        isSelected
                          ? 'border-cyan-500/80 bg-slate-900 shadow-md ring-1 ring-cyan-500/30'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{opt.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-400 text-[11px] leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Initial Deposit Amount (USDC)
                </label>
                <div className="flex items-center gap-2 mb-3">
                  {[500, 1000, 2500, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFundingAmount(val)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                        fundingAmount === val
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs font-mono">$</span>
                  <input
                    type="number"
                    min="50"
                    step="100"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-7 pr-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Gasless Paymaster Notice */}
              <div className="p-3.5 rounded-xl border border-indigo-900/50 bg-indigo-950/20 text-xs flex items-start gap-2.5">
                <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>Zero-Volatility Gas Sponsorship:</strong> Your agent does not need to hold Ethereum (ETH) for transaction gas. The built-in ERC-4337 Verifying Paymaster automatically converts pennies of USDC to pay network relayer fees without user friction.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW, SIMULATION TEST & GENESIS DEPLOYMENT */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Genesis Verification & Fleet Activation</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Review the cryptographic passport specifications. Run a pre-flight simulation to verify Spend Firewall interception before unleashing the agent.
                </p>
              </div>

              {/* Agent Identity & Vault Card Summary */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div>
                    <span className="text-sm font-bold text-white">{agentName}</span>
                    <span className="ml-2 font-mono text-xs text-cyan-400">[{codename}]</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ${fundingAmount.toLocaleString()} USDC Balance
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Model</div>
                    <div className="text-slate-200 truncate mt-0.5">{modelFamily}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Max / Tx</div>
                    <div className="text-slate-200 mt-0.5">${maxPerTxUSD}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Daily Cap</div>
                    <div className="text-slate-200 mt-0.5">${dailyCapUSD}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Policy Profile</div>
                    <div className="text-cyan-400 truncate mt-0.5 capitalize">{policyPreset}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Approved Vendors: <span className="text-slate-200">{selectedVendors.join(', ')}</span>
                </div>
              </div>

              {/* Pre-Flight Test Run */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Pre-Flight Policy Check</div>
                  <span className="text-[10px] font-mono text-slate-500">Autonomous Test UserOp</span>
                </div>

                <p className="text-xs text-slate-400">
                  Simulates a $4.50 micro-procurement UserOp through the Spend Firewall to verify that the ERC-4337 session key and EAS attestation engines respond with zero latency.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRunVerificationTest}
                    disabled={isTestRunning || testSuccess}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-medium hover:bg-cyan-900/60 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {isTestRunning ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                        <span>Validating UserOp...</span>
                      </>
                    ) : testSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Verified & Signed (Attestation Passed)</span>
                      </>
                    ) : (
                      <span>Run Pre-Flight Test UserOp</span>
                    )}
                  </button>

                  {testSuccess && (
                    <span className="text-xs text-emerald-400 font-mono">
                      ✓ Firewall Integrity: 100% Nominal
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="border-t border-slate-800 bg-slate-950/80 p-4 px-6 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishDeployment}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-300 hover:from-cyan-300 hover:to-emerald-200 rounded-lg shadow-md transition-all"
              >
                <Rocket className="h-4 w-4" />
                <span>Activate Agent in Fleet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
