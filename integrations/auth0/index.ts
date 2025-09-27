import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { headers } from "next/headers";

// Dynamically determine the base URL from request headers
async function getBaseUrl() {
  // If APP_BASE_URL is explicitly set, use it (useful for custom domains)
  if (
    process.env.APP_BASE_URL &&
    process.env.APP_BASE_URL !== "http://localhost:3000"
  ) {
    return process.env.APP_BASE_URL;
  }

  try {
    // Try to get the URL from request headers
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    if (host) {
      return `${protocol}://${host}`;
    }
  } catch (error) {
    // headers() can only be called in Server Components/Route handlers
    // Fall back to env var if called during build or in wrong context
  }

  // Final fallback
  return process.env.APP_BASE_URL || "http://localhost:3000";
}

export const getAuth0Client = async () => {
  return new Auth0Client({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    appBaseUrl: await getBaseUrl(),
    secret: process.env.AUTH0_SECRET,
  });
};
