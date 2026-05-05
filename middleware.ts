
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log(`~~~PATH: ${path}`);

  // 1. 過濾不需要攔截的路徑 (首頁、API、靜態檔案)
  if (
    path === '/' || 
    path.startsWith('/api') || 
    path.startsWith('/_next') || 
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. 提取短碼 (例如 /abc -> abc)
  const shortCode = path.split('/')[1];

  // 3. 在邊緣節點直接查詢 Redis
  const longUrl: string | null = await redis.get(shortCode);

  console.log(`Short code: ${shortCode}, Long URL: ${longUrl}`);

  // 4. 若找到，執行 302 跳轉；若無，進入 404
  if (longUrl) {
    return NextResponse.redirect(new URL(longUrl, req.url));
  }

  return NextResponse.next();
}

// 設定 Matcher 確保效能，只攔截必要路徑
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};