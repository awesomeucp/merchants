# UCP Merchant Directory

**Discover stores ready for AI commerce.**

Browse verified UCP-enabled merchants compatible with AI shopping agents.

## About

The UCP Merchant Directory is a curated collection of online stores that implement the [Universal Commerce Protocol (UCP)](https://ucp.dev). This directory helps AI shopping agents discover and interact with UCP-enabled merchants.

## Features

- **Browse & Search**: Explore merchants by category, capabilities, and payment methods
- **Detailed Profiles**: View merchant capabilities, service endpoints, and integration guides
- **Public API**: Programmatic access for AI agents to discover merchants
- **Open Contributions**: Submit your store via pull request

## Quick Start

### Running Locally

```bash
# Clone the repository
git clone https://github.com/awesomeucp/merchants.git
cd merchants

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

Visit [http://localhost:3000](http://localhost:3000) to see the directory.

### Development Workflow

When adding or modifying merchant data:

```bash
# 1. Edit merchant JSON files in data/merchants/
# 2. Validate and regenerate metadata
bun run metadata:generate

# 3. Build and test
bun run build
```

The `metadata:generate` script validates all merchant JSON files and generates filter metadata. It checks:

- JSON syntax validity
- Required fields present
- Slug matches filename
- HTTPS URLs
- Valid UCP profile structure
- Lowercase categories and tags

Run `bun run metadata:generate` before committing to catch validation errors early.

### Adding Your Merchant

1. Implement UCP on your store
2. Deploy a UCP discovery profile at `/.well-known/ucp`
3. Create a JSON file in `data/merchants/your-store.json`
4. Run `bun run metadata:generate` to validate
5. Submit a pull request

See the [Submission Guide](https://merchants.awesomeucp.com/submit) for detailed instructions.

## API Usage

The directory provides a public JSON API for AI agents with pagination and rate limiting.

### Endpoints

#### List Merchants

```bash
# Get merchants (paginated, default 20 per page)
curl https://merchants.awesomeucp.com/api/merchants

# Pagination parameters
curl "https://merchants.awesomeucp.com/api/merchants?page=2&limit=50"

# Filter by capability
curl "https://merchants.awesomeucp.com/api/merchants?capability=dev.ucp.shopping.checkout"

# Filter by category
curl "https://merchants.awesomeucp.com/api/merchants?category=electronics"

# Combined filters with pagination
curl "https://merchants.awesomeucp.com/api/merchants?category=electronics&page=1&limit=10"
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)
- `q` - Search query
- `category` - Filter by category
- `capability` - Filter by UCP capability
- `payment` - Filter by payment provider

**Response:**
```json
{
  "merchants": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "links": {
    "first": "...",
    "prev": "...",
    "next": "...",
    "last": "..."
  },
  "metadata": {...}
}
```

#### Get Single Merchant

```bash
# Get merchant by slug
curl https://merchants.awesomeucp.com/api/merchants/tech-haven
```

### Rate Limiting

All API endpoints are rate limited to prevent abuse:

- **Limit**: 20 requests per client
- **Refill Rate**: 2 requests per second
- **Algorithm**: Token bucket

**Rate Limit Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 3
```

When rate limited, you'll receive a `429 Too Many Requests` response:
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later."
}
```

## Project Structure

```
ucp-merchants/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home/browse page
│   ├── merchants/[slug]/  # Merchant detail pages
│   ├── submit/            # Submission guide
│   └── api/merchants/     # JSON API routes
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── merchants/        # Browse components
│   ├── detail/           # Detail page components
│   └── ui/               # Base UI components
├── lib/                   # Utilities and types
│   ├── types/            # TypeScript interfaces
│   ├── data/             # Data loading
│   └── utils/            # Helper functions
└── data/merchants/        # Merchant JSON files
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data**: JSON files (static generation)
- **Deployment**: Vercel

## Contributing

We welcome contributions! Please see our [Contribution Guidelines](./CONTRIBUTING.md) for details.

### Merchant Submissions

Submit your UCP-enabled store by creating a pull request with your merchant JSON file. See the [Submission Guide](https://merchants.awesomeucp.com/submit) for instructions.

### Code Contributions

- Bug fixes and improvements are welcome
- Please open an issue before major changes
- Follow the existing code style
- Write clear commit messages

## License

Apache License 2.0 - see [LICENSE](./LICENSE) for details.

## Links

- **Website**: [merchants.awesomeucp.com](https://merchants.awesomeucp.com)
- **UCP Documentation**: [ucp.dev](https://ucp.dev)
- **GitHub**: [github.com/awesomeucp/merchants](https://github.com/awesomeucp/merchants)
- **Issues**: [github.com/awesomeucp/merchants/issues](https://github.com/awesomeucp/merchants/issues)

---

Part of the [Universal Commerce Protocol](https://ucp.dev) ecosystem.
