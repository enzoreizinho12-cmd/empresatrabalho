/** Resolve a user supplied destination to a same-origin path. */
export function safeInternalRedirect(
  destination: string | null | undefined,
  origin: string,
  fallback = "/painel",
): string {
  if (!destination?.startsWith("/")) return fallback;
  if (/%(?:2f|5c)/i.test(destination)) return fallback;

  try {
    const base = new URL(origin);
    const target = new URL(destination, base);
    if (target.origin !== base.origin) return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
