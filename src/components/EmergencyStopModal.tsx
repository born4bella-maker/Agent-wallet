import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2, X, Lock, Play } from 'lucide-react';

interface EmergencyStopModalProps {
  isOpen: boolean;
  isEmergencyStopActive: boolean;
  onClose: () => void;
  onConfirmToggle: () => void;
}

export const EmergencyStopModal: React.FC<EmergencyStopModalProps> = ({
  isOpen,
  isEmergencyStopActive,
  onClose,
  onConfirmToggle,
}) => {
  const [operatorConfirmationText, setOperatorConfirmationText] = useState('');
  const [confirmError, setConfirmError] = useState(false);

  if (!isOpen) return null;

  const handleAction = () => {
    if (!isEmergencyStopActive) {
      // Activating emergency stop
      onConfirmToggle();
      onClose();
    } else {
      // Resuming requires typing RESUME or direct confirmation
      onConfirmToggle();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-900/80 bg-slate-900 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isEmergencyStopActive
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                  : 'bg-rose-950 border-rose-800 text-rose-400'
              }`}
            >
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEmergencyStopActive
                  ? 'Resume Fleet Operations'
                  : 'Trigger Global Emergency Stop'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEmergencyStopActive
                  ? 'Restore autonomous agent transaction rails and session keys'
                  : 'Immediately pause all non-essential autonomous agent transactions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs">
          {!isEmergencyStopActive ? (
            <>
              <div className="p-3.5 rounded-xl border border-rose-800/80 bg-rose-950/40 text-rose-200 space-y-2">
                <span className="font-bold block text-sm flex items-center gap-1.5 text-rose-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Immediate Fleet-Wide Actions:</span>
                </span>
                <ul className="space-y-1.5 text-[11px] list-disc list-inside opacity-95">
                  <li>
                    <strong>ERC-4337 EntryPoint Freeze:</strong> Rejects all incoming UserOperations from non-essential agent wallets.
                  </li>
                  <li>
                    <strong>Session Key Revocation:</strong> Invalidates active ephemeral signing allowances across all clusters.
                  </li>
                  <li>
                    <strong>Spend Firewall Lockdown:</strong> Blocks all outbound capital routing and external vendor calls.
                  </li>
                  <li>
                    <strong>Heartbeat Preservation:</strong> Retains read-only health checks and safe-mode telemetry.
                  </li>
                  <li>
                    <strong>EAS Attestation:</strong> Automatically records an immutable incident attestation on Ethereum.
                  </li>
                </ul>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                Use this circuit breaker in response to detected adversarial zero-days, anomalous fleet-wide velocity spikes, or upstream API compromise.
              </p>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl border border-emerald-800/80 bg-emerald-950/30 text-emerald-200 space-y-2">
                <span className="font-bold block text-sm flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Restoration Checklist:</span>
                </span>
                <ul className="space-y-1.5 text-[11px] list-disc list-inside opacity-95">
                  <li>All quarantined threats have been resolved or investigated.</li>
                  <li>Spend Firewall policy rules and allowlists are verified intact.</li>
                  <li>Re-mints fresh ephemeral session keys with standard time-to-live.</li>
                  <li>Restores nominal autonomous procurement pipelines.</li>
                </ul>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                Confirm that upstream threat vectors have been neutralized before resuming autonomous spending.
              </p>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAction}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-md transition-all ${
              isEmergencyStopActive
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {isEmergencyStopActive ? (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Confirm Fleet Resumption</span>
              </>
            ) : (
              <>
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>Confirm Emergency Stop (Freeze Fleet)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
