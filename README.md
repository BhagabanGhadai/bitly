# URL Shortener API

A scalable URL shortener API with advanced analytics, Google Sign-In authentication, and rate limiting.

## Features

- User authentication via Google Sign-In
- URL shortening with optional custom aliases
- Topic-based URL grouping
- Detailed analytics including:
  - Click tracking
  - Device analytics
  - OS analytics
  - Geographic data
- Rate limiting
- Redis caching
- Dockerized deployment

## Prerequisites

- Node.js 20+
- Redis
- Supabase account
- Google OAuth credentials

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start Redis:
   ```bash
   docker-compose up redis -d
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Deployment

1. Build the Docker image:

   ```bash
   docker-compose build
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT
