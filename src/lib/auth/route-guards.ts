export function isCottageManagementPath(pathname: string): boolean {
  return pathname.startsWith('/create') || pathname.startsWith('/edit');
}
