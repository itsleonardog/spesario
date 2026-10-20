"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/src/infrastructure/pwa/register-service-worker";

/** Client-only bridge that installs the PWA service worker in production. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
