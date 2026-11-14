import { AnimatePresence, motion } from 'framer-motion';
import { Radio, X } from 'lucide-react';

const statusColors = {
  'Lost Contact': '#ff4d4d',
  Decommissioned: '#ffb703',
  Preserved: '#00f3ff',
  Active: '#00f3ff',
  Operational: '#00f3ff',
  'Mission Complete': '#00f3ff',
};

function getStatusColor(status) {
  return statusColors[status] || '#ffb703';
}

function getStatusHeading(status) {
  if (status === 'Lost Contact') return 'Cause of Signal Loss';
  if (status === 'Decommissioned') return 'Decommissioning Details';
  if (status === 'Mission Complete') return 'Mission Completion';
  return 'Current Mission Status';
}

function getOperationalLifespan(landedDate, lastSignalDate) {
  const start = new Date(`${landedDate}T00:00:00Z`);
  const end = new Date(`${lastSignalDate}T00:00:00Z`);
  const elapsedDays = Math.max(0, Math.round((end - start) / 86400000));
  const years = Math.floor(elapsedDays / 365.25);
  const days = Math.round(elapsedDays - years * 365.25);
  return years ? `${years}y ${days}d` : `${elapsedDays}d`;
}

export default function TelemetryHUD({
  selectedEquipment,
  onClose,
  onOpenInspector,
  onPlayAudio,
}) {
  return (
    <AnimatePresence>
      {selectedEquipment && (
        <motion.section
          data-tutorial="telemetry"
          key={selectedEquipment.id}
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="pointer-events-auto fixed right-6 top-24 z-50 max-h-[80vh] w-96 overflow-y-auto rounded-xl border border-glass-border bg-panel-dark/85 p-6 shadow-2xl backdrop-blur-md"
          aria-label={`${selectedEquipment.name} telemetry`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                Mission Telemetry
              </span>
              <h2 className="mt-2 text-xl font-semibold leading-tight text-white">
                {selectedEquipment.name}
              </h2>
              <span className="mt-3 inline-flex rounded border border-[#00f3ff]/30 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-[#00f3ff]">
                {selectedEquipment.body.toUpperCase()}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70"
              aria-label="Close mission telemetry"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between border-y border-white/10 py-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/50">
              Status
            </span>
            <span
              className="rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider"
              style={{
                borderColor: `${getStatusColor(selectedEquipment.status)}66`,
                color: getStatusColor(selectedEquipment.status),
              }}
            >
              {selectedEquipment.status}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Landed Date
              </dt>
              <dd className="mt-1 font-mono text-sm text-white">
                {selectedEquipment.landedDate}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Last Signal
              </dt>
              <dd className="mt-1 font-mono text-sm text-white">
                {selectedEquipment.lastSignalDate}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                Operational Lifespan
              </dt>
              <dd className="mt-1 font-mono text-sm text-white">
                {getOperationalLifespan(
                  selectedEquipment.landedDate,
                  selectedEquipment.lastSignalDate,
                )}
              </dd>
            </div>
          </dl>

          <div
            className="mt-6 rounded-lg border p-4"
            style={{
              borderColor: `${getStatusColor(selectedEquipment.status)}55`,
              backgroundColor: `${getStatusColor(selectedEquipment.status)}0d`,
            }}
          >
            <h3
              className="font-mono text-xs uppercase tracking-wider"
              style={{ color: getStatusColor(selectedEquipment.status) }}
            >
              {getStatusHeading(selectedEquipment.status)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {selectedEquipment.causeOfDeath}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
              Technical Specifications
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {[
                ['Mass', selectedEquipment.technicalSpecs.mass],
                ['Power Source', selectedEquipment.technicalSpecs.powerSource],
                ['Total Distance', selectedEquipment.technicalSpecs.totalDistance],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-white/10 p-3">
                  <dt className="font-mono text-[10px] uppercase text-white/40">
                    {label}
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-white/80">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
              Primary Mission
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {selectedEquipment.primaryMission}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              data-tutorial="inspect-button"
              type="button"
              onClick={onOpenInspector}
              className="rounded border border-[#00f3ff]/40 px-4 py-3 font-mono text-xs font-bold tracking-wider text-[#00f3ff] transition-colors hover:bg-[#00f3ff]/10 focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70"
            >
              INSPECT 3D HARDWARE
            </button>
            <button
              data-tutorial="transmission-button"
              type="button"
              onClick={onPlayAudio}
              className="flex items-center justify-center gap-2 rounded border border-[#ffb703]/40 px-4 py-3 font-mono text-xs font-bold tracking-wider text-[#ffb703] transition-colors hover:bg-[#ffb703]/10 focus:outline-none focus:ring-2 focus:ring-[#ffb703]/70"
            >
              <Radio size={15} />
              TRANSMISSION LOG
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
