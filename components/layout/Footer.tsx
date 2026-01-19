import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              UCP Merchant Directory
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
              Discover stores ready for AI commerce. Browse verified UCP-enabled
              merchants compatible with AI shopping agents.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://ucp.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  UCP Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://ucp.dev/specification/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Specification
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/awesomeucp/merchants"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Submit Merchant
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/awesomeucp/merchants/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            {currentYear} UCP Merchant Directory. Part of the{' '}
            <a
              href="https://ucp.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Universal Commerce Protocol
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
