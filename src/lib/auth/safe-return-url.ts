export function getSafeReturnUrl(
  returnUrl: string | null | undefined,
  origin: string,
): string | null {
  if (!returnUrl) {
    return null;
  }

  try {
    const url = new URL(returnUrl, origin);
    if (url.origin !== new URL(origin).origin) {
      return null;
    }

    if (!url.pathname.startsWith('/')) {
      return null;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}
