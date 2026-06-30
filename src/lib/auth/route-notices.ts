export const ROUTE_NOTICE = {
  OWNER_ONLY: 'owner_only',
} as const;

export type RouteNotice = (typeof ROUTE_NOTICE)[keyof typeof ROUTE_NOTICE];
