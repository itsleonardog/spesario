const SERVICE_WORKER_URL = "/sw.js";
const MANAGED_CACHE_PREFIX = "spesario-";

/**
 * Registers the service worker only in production builds.
 *
 * During development the worker is never registered, and any worker/cache left
 * over from a previous production run on the same origin is removed, so caching
 * never gets in the way of `next dev`.
 */
export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    void disableServiceWorker();
    return;
  }

  const register = () => {
    navigator.serviceWorker.register(SERVICE_WORKER_URL).catch((error: unknown) => {
      console.error("Service worker registration failed", error);
    });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}

async function disableServiceWorker(): Promise<void> {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
    }

    if (!("caches" in window)) return;

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(MANAGED_CACHE_PREFIX))
        .map((name) => caches.delete(name)),
    );
  } catch (error) {
    console.warn("Unable to disable the service worker in development", error);
  }
}
