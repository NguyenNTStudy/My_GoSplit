// Search results come in fixed pages, and only the first pages can be reached, so nobody can
// page through everything (R52). The page size is set here, never by the request.

export const PAGE_SIZE = 20;
export const MAX_PAGE = 10;

/** Page number from the URL: 1 when missing or invalid, at most MAX_PAGE. */
export function readPage(raw: string | null | undefined): number {
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1) return 1;
  return Math.min(page, MAX_PAGE);
}

/** Rows to fetch: one more than a page, to know whether a next page exists. */
export function pageQuery(page: number): { offset: number; limit: number } {
  return { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 };
}

export function pageResult<T>(
  rows: readonly T[],
  page: number,
): { items: T[]; page: number; hasNext: boolean } {
  return {
    items: rows.slice(0, PAGE_SIZE),
    page,
    hasNext: rows.length > PAGE_SIZE && page < MAX_PAGE,
  };
}
