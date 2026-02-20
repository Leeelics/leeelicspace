export const buildApiUrl = (path: string): string => {
  if (typeof window === "undefined") {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3002");
    return new URL(path, baseUrl).toString();
  }
  return path;
};
