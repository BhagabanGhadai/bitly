# System Design

## Directory Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middleware/     # Express middleware
├── models/         # Data models
├── repositories/   # Database access layer
├── routes/         # API routes
├── services/       # Business logic
└── utils/         # Helper functions

docs/              # Documentation
tests/             # Test files
```

## Flow Diagrams

### URL Shortening Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cache
    participant DB

    Client->>API: POST /api/shorten
    API->>DB: Check alias availability
    DB-->>API: Response
    API->>DB: Create URL mapping
    API->>Cache: Cache URL mapping
    API-->>Client: Return short URL
```

### URL Redirection Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cache
    participant DB
    participant Analytics

    Client->>API: GET /:alias
    API->>Cache: Check cache
    alt Cache hit
        Cache-->>API: Return URL
    else Cache miss
        API->>DB: Fetch URL
        DB-->>API: Return URL
        API->>Cache: Cache URL
    end
    API->>Analytics: Log visit
    API-->>Client: Redirect to URL
```
