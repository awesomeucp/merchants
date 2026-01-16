# Contributing to UCP Merchant Directory

Thank you for your interest in contributing to the UCP Merchant Directory! This document provides guidelines for different types of contributions.

## Table of Contents

- [Merchant Submissions](#merchant-submissions)
- [Code Contributions](#code-contributions)
- [Reporting Issues](#reporting-issues)
- [Development Setup](#development-setup)

## Merchant Submissions

### Prerequisites

Before submitting your merchant, ensure:

1. Your store implements the [Universal Commerce Protocol (UCP)](https://ucp.dev)
2. You have a live UCP discovery profile at `https://yourstore.com/.well-known/ucp`
3. You are authorized to represent the merchant
4. Your store is production-ready and accessible

### Submission Process

1. **Fork the Repository**

   ```bash
   git clone https://github.com/awesomeucp/merchants.git
   cd merchants
   ```

2. **Create Your Merchant JSON**

   Create a new file in `data/merchants/your-store-slug.json`:

   ```json
   {
     "slug": "your-store-slug",
     "name": "Your Store Name",
     "url": "https://yourstore.com",
     "description": "Brief description of your store",
     "logo": {
       "url": "https://yourstore.com/logo.png",
       "width": 400,
       "height": 400,
       "alt": "Your Store Logo"
     },
     "categories": ["electronics", "gadgets"],
     "tags": ["fast-shipping", "warranty"],
     "ucpProfile": {
       "version": "2026-01-11",
       "wellKnownUrl": "https://yourstore.com/.well-known/ucp",
       "capabilities": [...],
       "services": {...},
       "paymentHandlers": [...]
     },
     "metadata": {
       "submittedAt": "2026-01-16T12:00:00Z",
       "submittedBy": "your-github-username",
       "verified": false,
       "featured": false
     }
   }
   ```

3. **Validate Your JSON**

   - Ensure valid JSON syntax
   - Slug must match filename (without `.json`)
   - All required fields are present
   - URLs are HTTPS only
   - Logo URL is publicly accessible

4. **Run Validation Script**

   ```bash
   bun install
   bun run metadata:generate
   ```

   This validates your merchant JSON and generates filter metadata. Fix any errors before proceeding.

5. **Test Locally**

   ```bash
   bun run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to verify your merchant appears correctly.

6. **Submit Pull Request**

   ```bash
   git checkout -b add-merchant/your-store-slug
   git add data/merchants/your-store-slug.json
   git commit -m "Add Your Store to merchant directory"
   git push origin add-merchant/your-store-slug
   ```

   Open a pull request using the template.

### Review Process

- Our team will review your submission within 5 business days
- We will verify your UCP profile is live and valid
- Once approved, your merchant will be merged and deployed
- Set `verified: false` and `featured: false` in your submission

## Code Contributions

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/merchants.git
   cd merchants
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

**Code Style**

- Use TypeScript for all new code
- Follow existing code formatting (we use Prettier)
- Use meaningful variable and function names
- Add comments for complex logic

**Component Guidelines**

- Use functional components with hooks
- Keep components small and focused
- Place reusable components in `/components/ui/`
- Use TypeScript interfaces for props

**File Organization**

```
components/
  ├── layout/      # Site-wide layout components
  ├── merchants/   # Merchant browsing components
  ├── detail/      # Merchant detail components
  └── ui/          # Reusable UI components

lib/
  ├── types/       # TypeScript types
  ├── data/        # Data loading functions
  └── utils/       # Utility functions
```

**Testing**

Before submitting:

```bash
# Validate merchants and generate metadata
bun run metadata:generate

# Build the project
bun run build

# Check for TypeScript errors
bun run lint
```

### Submitting Changes

1. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Description of changes"
   ```

   Use clear, descriptive commit messages:
   - `feat: Add dark mode toggle`
   - `fix: Resolve search filter bug`
   - `docs: Update README`

2. **Push and Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

   Open a pull request with:
   - Clear description of changes
   - Screenshots (for UI changes)
   - Reference to related issues

## Reporting Issues

### Bug Reports

Include:

- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Feature Requests

Include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- Git

### Environment

No environment variables required for local development.

### Build Commands

```bash
bun run dev                # Start development server
bun run build              # Build for production
bun run start              # Start production server
bun run lint               # Run ESLint
bun run metadata:generate  # Validate merchants and generate metadata
```

### Project Architecture

- **Static Generation**: All pages pre-rendered at build time
- **Client-Side Filtering**: Instant search/filter without API calls
- **JSON Data**: Merchant data stored as JSON files
- **API Routes**: Public API for programmatic access

## Questions?

- Open a [GitHub Discussion](https://github.com/awesomeucp/merchants/discussions)
- Check the [UCP Documentation](https://ucp.dev/docs)
- Review existing [Issues](https://github.com/awesomeucp/merchants/issues)

Thank you for contributing!
