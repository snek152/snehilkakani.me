"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="flex min-h-[70vh] items-center px-6 py-16 sm:px-8 lg:px-12">
      <div className="max-w-[var(--measure-body)]">
        <h1 className="m-0 font-display text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)] text-fg">
          Something interrupted this route.
        </h1>
        <p className="mt-5 text-[length:var(--text-lead)] leading-[var(--leading-lead)] text-dim">
          Try loading it again, or return to the home page.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center border border-accent bg-accent px-4 text-[length:var(--text-meta)] font-medium text-fg transition-[opacity,scale] duration-[120ms] ease-[var(--ease-press)] hover:opacity-80 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center border border-border px-4 text-[length:var(--text-meta)] font-medium text-dim no-underline transition-[color,border-color,scale] duration-[120ms] ease-[var(--ease-press)] hover:border-accent hover:text-fg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
