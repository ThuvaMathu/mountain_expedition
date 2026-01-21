// AI Middleware Exports
export * from './query-processor';
export * from './context-builder';
export * from './response-filter';

// Utility function to get IP address
export function getIpAddress(request: Request): string {
  const headers = (request as any).headers || {};
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}
