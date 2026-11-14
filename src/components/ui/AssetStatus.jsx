import { AlertTriangle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { ASSET_STATES, getTextureStatusLabel } from '@/utils/assetStatus';

export default function AssetStatus({ body, status }) {
  const loading = status === ASSET_STATES.LOADING;
  const failed = status === ASSET_STATES.FAILED || status === ASSET_STATES.FALLBACK;
  const Icon = loading ? LoaderCircle : failed ? AlertTriangle : CheckCircle2;
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-20 flex items-center gap-2 rounded border border-white/10 bg-[#12141d]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/55" role="status" aria-live="polite">
      <Icon size={12} className={loading ? 'animate-spin text-[#00f3ff]' : failed ? 'text-[#ffb703]' : 'text-[#00f3ff]'} />
      {body} · {getTextureStatusLabel(status)}
    </div>
  );
}
