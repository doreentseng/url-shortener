## [1.5.0] - 2026-05-29

🚀 Features

- Added persistent demo activity section with static short URL entries
- Introduced permanent activity showcase data for UI demonstration

🔧 Behavior Changes

- Fixed runtime error caused by accessing `window` during SSR

🔧 Refactor

- Moved `window.location.origin` into client-side state initialization

## [1.4.0] - 2026-05-28

🚀 Features

- Extend short URL API response with:
  - ttl (remaining time to live from Redis)
  - status (active | persistent | expired)
  - expiresAt (computed expiration timestamp)
- Introduce shared type definitions in `types/short-url.ts`
- Add reusable `StatusBadge` component

🎨 UI / UX

- Improve Recent Activity view by displaying:
  - Status badge for each short URL
  - Expiration time for active links
- Enhance visual hierarchy of URL metadata

🔧 Behavior Changes

- Update redirect status code from 302 to 307
  - Preserve HTTP method during redirection
  - Improve correctness for non-GET requests

🔧 Refactor

- Centralize short URL domain types and status representation
- Improve separation of API response structure and UI logic

## [1.3.1] - 2026-05-23

🚀 Features

- Client-side URL validation with inline error feedback

## [1.3.0] - 2026-05-06

🚀 Features

- Introduce centralized short URL expiry configuration via `/src/config/expiry.ts`
- Apply `SHORT_URL_EXPIRY_DAYS` to Redis TTL logic for short URL expiration handling
- Update page UI text to reflect current expiration policy

🔧 Refactor

- Replace hardcoded expiry values with shared configuration constant across API routes

## [1.2.0] - 2026-05-06

🚀 Features

- Add loading spinner for fetching history in UI
- Expose application version via NEXT_PUBLIC_APP_VERSION and display it in page UI

🎨 UI / UX

- Update favicon
- Add page footer

📚 Documentation

- Add credits section in README

## [1.1.0] - 2026-05-05

🚀 Features

- Set 3-day TTL for short URLs in Redis

🔧 Behavior Changes

- Short URLs now expire after 3 days instead of persisting indefinitely

## [0.1.0] - 2026-05-05

🚀 Features

- Initial release
