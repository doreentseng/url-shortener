import { generateUniqueCode } from '@/lib/utils';
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { SHORT_URL_EXPIRY_DAYS } from '@/config/expiry';
import type { ShortUrlStatus, RecentShortUrl } from '@/types/short-url';

export async function GET() {
  // Get recent 5 short codes from Redis List
  const codes = await redis.lrange('recent_shortens', 0, 4);

  if (codes.length === 0) {
    return NextResponse.json([]);
  }

  // Get long URLs
  const urls = await redis.mget<string[]>(...codes);

  // Get TTL
  const ttlPipeline = redis.pipeline();

  codes.forEach((code) => {
    ttlPipeline.ttl(code);
  });

  const ttls = await ttlPipeline.exec<number[]>();

  // 組合 response
  const data: RecentShortUrl[] = codes.map((code, index) => {
    const ttl = ttls[index];
    // Redis TTL response:
    //  > 0 : remaining time to live in seconds
    //   -1 : key exists but has no expiration
    //   -2 : key does not exist
    const status: ShortUrlStatus =
      ttl > 0 ? 'active' : ttl === -1 ? 'persistent' : 'expired';

    return {
      short: code,
      long: urls[index],
      ttl,
      status,
      expiresAt:
        ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null,
    };
  });
  console.log(data);

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // 1. Generate a unique short identifier (e.g., "aB7x9")
    const shortCode = await generateUniqueCode();

    /**
     * 2. Store the Mapping (Short Code -> Original Long URL)
     * - 'ex': Set a Time-To-Live (TTL) of 3 days (expressed in seconds).
     * - After 3 days, Redis will automatically evict this key to save space.
     */
    await redis.set(shortCode, url, {
      ex: SHORT_URL_EXPIRY_DAYS * 24 * 60 * 60,
    });

    /**
     * 3. Update the "Recent 5 Shortens" Global List
     * We use a Redis Pipeline (Atomic Transaction) to group multiple commands.
     * This reduces network round-trips and ensures data consistency.
     */
    const tx = redis.pipeline();
    tx.lpush('recent_shortens', shortCode);
    tx.ltrim('recent_shortens', 0, 4);
    await tx.exec(); // Execute all pipelined commands at once

    return NextResponse.json({ shortCode });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
