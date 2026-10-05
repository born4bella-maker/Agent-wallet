import React from 'react';
import { Cpu, ShieldCheck, KeyRound, Layers, Database, Lock, Server, ArrowDown } from 'lucide-react';
import agentVaultImage from '../assets/images/agent_vault_core_1791195420520.jpg';

interface SecurityCardProps {
  title: string;
  text: string;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ title, text }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 hover:border-cyan-500/50 transition-colors">
      <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
        {title}
      </div>
      <div className="mt-2 text-sm font-bold text-white">
        {text}
      </div>
    </div>
  );
};

export const ArchitectureDocsView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Overview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            System Architecture & Standards
          </span>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-white">
            A Bank Account & Policy Engine for Every AI Agent
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Aegis Agent OS creates the foundational financial infrastructure that enables AI agents to safely own assets, make payments, and participate in digital economies while remaining accountable, auditable, and controllable.
          </p>
        </div>

        {/* Visual Architectural Core Rendering */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <img
            src={agentVaultImage}
            alt="Aegis Agent Token-Bound Cryptographic Vault Architecture"
            className="w-full h-72 md:h-96 object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2">
            <span className="font-mono text-cyan-300">
              Figure 1: Token Bound Account (ERC-6551) with Embedded ERC-4337 Spend Firewall
            </span>
            <span className="text-[11px] text-slate-500">Non-Custodial · Hardware Enclave Attested</span>
          </div>
        </div>
      </div>

      {/* How AgentRails Works - Complete Lifecycle Pipeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            How AgentRails Works: Autonomous Agent Lifecycle
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            The end-to-end pipeline from initial cryptographic identity minting to live, attested autonomous execution:
          </p>
        </div>

        {/* Vertical Flow Pipeline */}
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-2">
          {[
            {
              title: 'Identity & Role',
              desc: 'Agent persona, organizational mandate, and foundation model configuration.',
              detail: 'ERC-721 Identity NFT',
            },
            {
              title: 'Token Bound Vault',
              desc: 'Deterministic non-custodial smart account linked via canonical ERC-6551 Registry.',
              detail: '0x0210...0921 Canonical Registry',
            },
            {
              title: 'Spend Firewall',
              desc: 'Deterministic velocity curves, prompt-injection defense, and verified vendor allowlists.',
              detail: 'Zero-Tolerance Policy Engine',
            },
            {
              title: 'Initial Deposit',
              desc: 'Treasury liquidity allocation in USDC with ERC-4337 Verifying Paymaster gas sponsorship.',
              detail: 'Zero-Volatility Stable Settlement',
            },
            {
              title: 'Genesis Activation',
              desc: 'Cryptographic attestation and fleet registration on Ethereum Attestation Service (EAS).',
              detail: 'Immutable EAS Proof',
            },
            {
              title: 'Session Keys',
              desc: 'Time-bounded, method-scoped ephemeral keys delegated for autonomous UserOp signing.',
              detail: 'Hardware Enclave Constrained',
            },
            {
              title: 'Operational Status',
              desc: 'Live autonomous commerce, real-time telemetry, and human multi-sig escalation handling.',
              detail: 'Continuous Monitoring & Audit',
            },
          ].map((stage, idx, arr) => (
            <React.Fragment key={stage.title}>
              <div className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-900/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-mono text-cyan-400 font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      {stage.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    {stage.detail}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 pl-9">
                  {stage.desc}
                </p>
              </div>

              {idx < arr.length - 1 && (
                <div className="flex flex-col items-center py-0.5 text-cyan-400/80">
                  <ArrowDown className="h-4 w-4 stroke-[2.5]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Security Layer Architecture */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SecurityCard
            title="Identity"
            text="ERC-6551 Token Bound Accounts"
          />

          <SecurityCard
            title="Execution"
            text="ERC-4337 Smart Accounts"
          />

          <SecurityCard
            title="Policy"
            text="Spend Firewall"
          />

          <SecurityCard
            title="Governance"
            text="Human Approval & Audit"
          />
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The firewall compares the requested action, destination contracts, transaction parameters, and policy constraints against expected agent behavior before a transaction is authorized.
        </p>
      </div>

      {/* The Two Architectural Pillars: ERC-6551 + ERC-4337 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ERC-6551 Token Bound Accounts</h3>
              <span className="text-xs text-slate-500">Persistent Agent Ownership</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every agent is minted as an on-chain identity (ERC-721 NFT) registered via the universal ERC-6551 registry. This gives the agent a deterministic, non-custodial Ethereum address capable of holding NFTs, ERC-20 tokens, and contract ownership without requiring a human custodial key.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Identity portability across compute runtimes and hosting providers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Multi-agent organizational hierarchy and sub-account fleet clustering</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Asset separation prevents rogue agent contagion to enterprise treasury</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ERC-4337 Account Abstraction</h3>
              <span className="text-xs text-slate-500">Programmable Execution Engine</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transactions are dispatched as UserOperations through canonical ERC-4337 EntryPoints. This decouples the agent runtime from raw private keys, enabling paymasters (gas abstraction), batching, and strict validation logic before execution.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Sponsor gas tanks allow agents to transact seamlessly in USDC or stablecoins</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Batched multi-call executions for atomic machine-to-machine settlement</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Native co-signing support for Spend Firewall policy guardians</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Spend Firewall & Threat Defense Invariants */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Threat Model: How the Platform Protects Agent-Owned Assets</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Unlike traditional wallets where anyone with key access has unlimited transfer power, Aegis enforces deterministic execution boundaries:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-semibold text-rose-400">Prompt Injection Attacks</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Adversaries cannot hijack an agent's reasoning into draining funds. The firewall parses the LLM's chain-of-thought against target contract bytecode. Any discrepancy triggers immediate quarantine.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-semibold text-amber-400">Wallet Drain Attempts</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Strict velocity limits ($2,500/tx, $5,000/hr) guarantee that even an unconstrained infinite-loop or exploit payload cannot siphon the agent's full treasury balance.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-semibold text-cyan-400">Credential Compromise</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Agents only possess ephemeral session keys with short TTLs and method-scoped permissions (e.g. only <code className="font-mono text-cyan-300">transfer()</code> to approved vendors). Root keys never touch AI servers.
            </p>
          </div>
        </div>
      </div>

      {/* Six Enterprise Use Cases */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Use Cases</h3>
          <p className="mt-1 text-xs text-slate-400">
            Real-world autonomous enterprise applications powered by the Aegis financial operating system:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">AI Compute Purchasing</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Agents dynamically reserve, negotiate, and settle payment for on-demand GPU clusters (H100s, A100s) and serverless inference capacity without human procurement delays.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">Autonomous Research Agents</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Deep-research agents autonomously unlock academic paywalls (Nature, IEEE, ArXiv), purchase patent database queries, and stream micro-payments for specialized RAG datasets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">API Consumption Billing</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Machine-native metering and continuous micro-settlements for commercial LLM endpoints, web scrapers, and third-party SaaS integrations via stable USDC gas tanks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">AI Workforce Management</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Enterprises manage hundreds of specialized synthetic workers with cost-center segregation, departmental budgets, hourly velocity throttles, and automated payroll.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">Machine-to-Machine Commerce</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              IoT devices, autonomous robotics, and algorithmic agents stream real-time micro-payments for bandwidth, clean energy grids, and sensor telemetry under verifiable governance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
            <span className="font-bold text-white text-sm block mb-1">Autonomous Procurement</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              AI agents independently contract other specialist agents (e.g. audit agents, data cleansers) using atomic smart contract escrow, instant settlement, and cryptographic EAS proofs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
