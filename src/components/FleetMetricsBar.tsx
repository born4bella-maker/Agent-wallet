import React from 'react';
import { AgentWallet, HumanApprovalItem } from '../types/fleet';
import { TrendingUp, ShieldAlert, Cpu, Lock } from 'lucide-react';

interface FleetMetricsBarProps {
  agents: AgentWallet[];
  approvals: HumanApprovalItem[];
  interceptedCount: number;
}

export const FleetMetricsBar: React.FC<FleetMetricsBarProps> = ({
  agents,
  approvals,
  interceptedCount,
}) => {
  const totalAUM = agents.reduce((acc, a) => acc + a.balances.usdc, 0);
  const totalEth = agents.reduce((acc, a) => acc + a.balances.eth, 0);
  const total24hSpent = agents.reduce((acc, a) => acc + a.spendingLimits.currentDailySpentUSD, 0);
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeAgentsCount = agents.filter((a) => a.status !== 'quarantined').length;

  return (
    <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-4">
      <div className="mx-auto max-w-7xl grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {/* Metric 1 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Fleet Vault Liquidity (AUM)</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
              ${totalAUM.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              + {totalEth.toFixed(2)} ETH
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <span>ERC-6551 Token Bound Accounts</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span className="text-emerald-400">100% Non-Custodial</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>24h Autonomous Spend</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
              ${total24hSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-emerald-400 font-mono tabular-nums">
              184 UserOps
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <span>Velocity Index: Nominal</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>Zero Slashing</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>Threats Intercepted</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-rose-400 font-mono tabular-nums">
              {interceptedCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Injections & Drains Blocked
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <span>Spend Firewall Guardian</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span className="text-cyan-400">100% Policy Intercept</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Agent Fleet Status</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
              {activeAgentsCount} / {agents.length}
            </span>
            <span className="text-xs text-slate-400">
              Active Agents
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <span>{pendingApprovalsCount} In Human Queue</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>ERC-4337 Bundlers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
