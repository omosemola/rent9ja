// ============================================================================
// Formatting helpers (ported from lib/core/utils/helpers.dart)
// Hand-written so output is identical on every JS engine (Hermes' Intl
// support for compact currency is partial).
// ============================================================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function groupThousands(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** ₦1,500,000 */
export function formatNaira(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}₦${groupThousands(Math.abs(amount))}`;
}

/** ₦1.5M, ₦500K, ₦2.5B */
export function formatNairaCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  const trim = (n: number) => n.toFixed(1).replace(/\.0$/, '');
  if (abs >= 1e9) return `${sign}₦${trim(abs / 1e9)}B`;
  if (abs >= 1e6) return `${sign}₦${trim(abs / 1e6)}M`;
  if (abs >= 1e3) return `${sign}₦${trim(abs / 1e3)}K`;
  return `${sign}₦${trim(abs)}`;
}

/** ₦1.5M/yr */
export function formatNairaWithPeriod(amount: number, period: string = 'yr'): string {
  return `${formatNairaCompact(amount)}/${period}`;
}

/** Card price used on Home/Search: ₦3.5M/yr (1 decimal) or ₦850K/yr (no decimal). */
export function formatPricePerYear(price: number): string {
  return price >= 1_000_000
    ? `₦${(price / 1_000_000).toFixed(1)}M/yr`
    : `₦${(price / 1_000).toFixed(0)}K/yr`;
}

/** Sum of a cost breakdown, formatted as ₦. */
export function formatMoveIn(costs: Record<string, number>): string {
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  return formatNaira(total);
}

export function formatDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}

export function timeAgo(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(date);
}

/** "Tunde Bakare" → "TB" */
export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return '?';
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/** 0803... → +234803..., 234803... → +234803... */
export function formatPhone(phone: string): string {
  let p = phone.replace(/[^0-9+]/g, '');
  if (p.startsWith('0')) p = `+234${p.substring(1)}`;
  if (p.startsWith('234')) p = `+${p}`;
  return p;
}
