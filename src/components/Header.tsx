import React from 'react';
import { ShieldCheck, Plus, Sparkles, AlertOctagon, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingApprovalsCount: number;
  onOpenDeployModal: () => void;
  onOpenWizard: () => void;
  onLaunchSimulator: () => void;
  isEmergencyStopActive: boolean;
  onOpenEmergencyModal: () => void;
  onExportFleetReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
  onOpenDeployModal,
  onOpenWizard,
  onLaunchSimulator,
  isEmergencyStopActive,
  onOpenEmergencyModal,
  onExportFleetReport,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'firewall', label: 'Firewall' },
    { id: 'simulator', label: 'Simulator' },
    { 
      id: 'approvals', 
      label: pendingApprovalsCount > 0 ? `Approvals (${pendingApprovalsCount})` : 'Approvals' 
    },
    { id: 'attestations', label: 'Attestations' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-3.5 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark with subtle security emblem */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shadow-sm">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('fleet');
            }}
            className="text-base font-bold tracking-tight text-white transition-colors hover:text-cyan-400"
          >
            Aegis Agent OS
          </a>
        </div>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions plus Emergency Stop button */}
      <div className="flex items-center gap-2">
        {/* Global Emergency Stop Circuit Breaker */}
        <button
          onClick={onOpenEmergencyModal}
          title={isEmergencyStopActive ? 'Fleet is paused. Click to review and resume operations.' : 'Immediately pause all non-essential transactions across all agent wallets.'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
            isEmergencyStopActive
              ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-950 border border-rose-500 hover:bg-rose-500'
              : 'text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/60 hover:text-white'
          }`}
        >
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>{isEmergencyStopActive ? 'Fleet Paused (Resume)' : 'Emergency Stop'}</span>
        </button>

        {/* Export Fleet Report CSV */}
        <button
          onClick={onExportFleetReport}
          title="Download CSV summary of agent balances, transaction volumes, and compliance violations"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-750 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" />
          <span>Export Fleet Report</span>
        </button>

        <button
          onClick={onOpenWizard}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-md hover:bg-cyan-900/50 transition-colors whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Setup Wizard</span>
        </button>

        <button
          onClick={onOpenDeployModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-md hover:from-cyan-300 hover:to-teal-200 shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Deploy Agent</span>
        </button>
      </div>
    </header>
  );
};

