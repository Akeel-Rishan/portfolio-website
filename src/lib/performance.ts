export function preloadCriticalAssets() {
  if (typeof document === "undefined") {
    return;
  }

  const assets = [
    { href: "/fonts/inter-var.woff2", as: "font", type: "font/woff2" },
    { href: "/fonts/fira-code-var.woff2", as: "font", type: "font/woff2" },
    { href: "/project-rag.svg", as: "image" }
  ];

  assets.forEach((asset) => {
    if (document.querySelector(`link[rel="preload"][href="${asset.href}"]`)) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = asset.href;
    link.as = asset.as;
    if (asset.type) {
      link.type = asset.type;
      link.crossOrigin = "anonymous";
    }
    document.head.appendChild(link);
  });
}

export function measureWebVitals() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  const logMetric = (name: string, value: number) => {
    console.info(`[web-vitals] ${name}`, Number(value.toFixed(2)));
  };

  try {
    new PerformanceObserver((entryList) => {
      const lastEntry = entryList.getEntries().at(-1);
      if (lastEntry) {
        logMetric("LCP", lastEntry.startTime);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    let cls = 0;
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShift.hadRecentInput) {
          cls += layoutShift.value ?? 0;
          logMetric("CLS", cls);
        }
      });
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        const firstInput = entry as PerformanceEntry & { processingStart?: number };
        if (firstInput.processingStart) {
          logMetric("FID", firstInput.processingStart - firstInput.startTime);
        }
      });
    }).observe({ type: "first-input", buffered: true });
  } catch (error) {
    console.warn("[web-vitals] Unable to start performance observers", error);
  }
}
