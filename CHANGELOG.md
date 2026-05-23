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
