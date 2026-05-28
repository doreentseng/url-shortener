export type ShortUrlStatus = 'active' | 'persistent' | 'expired';

export interface RecentShortUrl {
  short: string;
  long: string | null;
  /** Redis TTL response: * > 0 : remaining time to live in seconds
   * -1 : key exists but has no expiration
   * -2 : key does not exist
   */
  ttl: number;
  status: ShortUrlStatus;
  /** ISO timestamp string
   * Example: 2026-05-28T06:11:22.000Z
   */
  expiresAt: string | null;
}
