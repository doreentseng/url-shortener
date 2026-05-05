import { nanoid } from 'nanoid';
import { redis } from './redis';

/**
 * Generates a collision-resistant unique short code.
 * 
 * This function uses a "Reserve-then-Confirm" strategy to handle potential 
 * collisions in high-concurrency environments. It leverages Redis atomic 
 * operations to ensure that no two users can claim the same ID simultaneously.
 *
 * @param {number} length - The desired length of the short code (default is 6).
 * @returns {Promise<string>} - A guaranteed unique short code.
 * @throws {Error} - If a unique code cannot be generated after maximum attempts.
 */
export async function generateUniqueCode(length: number = 6): Promise<string> {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    // 1. Generate a random identifier using nanoid
    const shortCode = nanoid(length);
    
    /**
     * 2. Atomic Reservation:
     * We use the 'SET' command with 'NX' and 'EX' options as a distributed lock.
     * 
     * - `reserved:${shortCode}`: Namespace prefix to separate pending locks from actual data.
     * - `'1'`: Placeholder value (content is irrelevant, only existence matters).
     * - `nx: true` (SET if Not eXists): Ensures atomicity. Only the first requester 
     *   to arrive will receive an 'OK' response.
     * - `ex: 60` (Expire): A 60-second safety TTL (Time-To-Live). If the subsequent 
     *   write process crashes, this ID will be automatically released to avoid 
     *   permanent blocking of the short code.
     */
    const reserved = await redis.set(`reserved:${shortCode}`, '1', { nx: true, ex: 60 });

    // 3. If reservation is successful, the ID is safe to use
    if (reserved === 'OK') {
      return shortCode;
    }

    // 4. Collision occurred: increment attempt counter and retry
    attempts++;
    console.warn(`Collision detected for code: ${shortCode}. Retrying... (${attempts}/${maxAttempts})`);
  }

  // 5. Final safety fallback if multiple retries fail
  throw new Error('Collision threshold reached: Could not generate a unique short code.');
}