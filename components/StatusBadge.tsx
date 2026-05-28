import { ShortUrlStatus } from '@/types/short-url';

interface StatusBadgeProps {
  status: ShortUrlStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const baseClass = 'px-2 py-0.5 rounded-full text-[11px] font-medium';

  const config = {
    active: {
      label: 'Active',
      className: 'bg-amber-100 text-amber-700',
    },
    persistent: {
      label: 'Permanent',
      className: 'bg-emerald-100 text-emerald-700',
    },
    expired: {
      label: 'Expired',
      className: 'bg-red-100 text-red-700',
    },
  } as const;

  const { label, className } = config[status];

  return <span className={`${baseClass} ${className}`}>{label}</span>;
}
