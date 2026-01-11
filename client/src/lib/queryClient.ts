import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Capacitor, CapacitorHttp } from "@capacitor/core";

// For native mobile apps, ALWAYS use the production server.
// For web, use the env var (dev/prod) or default to empty (relative path).
const BASE_URL = Capacitor.isNativePlatform()
  ? "https://cropsdoctor.vercel.app"
  : (import.meta.env.VITE_API_URL || "");

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = void>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T> {
  const fullUrl = `${BASE_URL}${url}`;

  if (Capacitor.isNativePlatform()) {
    // Native Mobile Request (Bypasses CORS via Capacitor Core)
    const options = {
      url: fullUrl,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
      data: data || null, // Native bridge prefers null over undefined for missing body
    };

    try {
      const response = await CapacitorHttp.request(options);

      if (response.status >= 400) {
        // CapacitorHttp returns error object or string in data
        const errorMessage = typeof response.data === 'string'
          ? response.data
          : (response.data?.message || JSON.stringify(response.data) || 'API Error');
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.data as T;
    } catch (error: any) {
      // Catch network errors or plugin errors (like NPE if it still persists, but we hope not)
      throw new Error(error.message || "Native Request Failed");
    }

  } else {
    // Standard Web Fetch
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);

    if (res.status === 204) {
      return undefined as T;
    }

    return await res.json();
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const url = queryKey.join("/");
      return apiRequest("GET", url);
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
