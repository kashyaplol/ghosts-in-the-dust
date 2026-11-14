import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { getBodyTheme, getStatusMeta } from '@/utils/missionTheme';

const BUTTON_VARIANTS = {
  primary:
    'border border-ice-accent/80 bg-ice-accent text-space-black font-medium hover:bg-[#7dd1e3] active:translate-y-px',
  secondary:
    'border border-white/15 bg-panel-recessed text-ink-primary hover:border-ice-accent/55 hover:bg-panel-elevated active:translate-y-px',
  tertiary:
    'border border-transparent bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04]',
  selected:
    'border border-ice-accent/60 bg-ice-accent/15 text-ice-accent hover:bg-ice-accent/20',
  amber:
    'border border-solar-amber/45 bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/18 hover:border-solar-amber/70 active:translate-y-px',
  danger:
    'border border-alert-red/45 bg-alert-red/10 text-alert-red hover:bg-alert-red/18 active:translate-y-px',
  icon:
    'border border-white/12 bg-panel-recessed/90 text-ink-secondary hover:border-ice-accent/50 hover:text-ink-primary hover:bg-panel-elevated',
};

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-xs gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-10 w-10 p-0 justify-center',
  'icon-sm': 'h-9 w-9 p-0 justify-center',
};

export const Button = forwardRef(function Button(
  { variant = 'secondary', size = 'md', className = '', type = 'button', children, ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center rounded-md font-sans whitespace-nowrap shrink-0 transition-[background-color,border-color,color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 focus-visible:ring-offset-1 focus-visible:ring-offset-space-black disabled:pointer-events-none disabled:opacity-35';
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.secondary} ${BUTTON_SIZES[size] || BUTTON_SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export function PanelHeader({
  eyebrow,
  title,
  eyebrowClass = 'text-ice-accent',
  onClose,
  closeLabel = 'Close panel',
  closeRef,
  children,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className={`text-[11px] font-medium tracking-[0.14em] uppercase ${eyebrowClass}`}>
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 font-display text-xl font-semibold leading-snug tracking-tight text-ink-primary">
          {title}
        </h2>
        {children}
      </div>
      {onClose && (
        <Button
          ref={closeRef}
          variant="icon"
          size="icon-sm"
          onClick={onClose}
          aria-label={closeLabel}
          className="shrink-0"
        >
          <X size={16} aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

export function StatusIndicator({ status, className = '' }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.textClass} ${className}`}>
      <span aria-hidden="true" className="text-[10px] leading-none">{meta.glyph}</span>
      <span>{status}</span>
    </span>
  );
}

export function BodyTag({ body, className = '' }) {
  const theme = getBodyTheme(body);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${theme.textClass} ${className}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${theme.dotClass}`} />
      <span>{body}</span>
    </span>
  );
}
