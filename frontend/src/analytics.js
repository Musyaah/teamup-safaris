// Google Analytics 4. Only loads when VITE_GA_ID is set (for example G-ABC123XYZ),
// so local development and test builds send nothing to Google.

export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id || window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // gtag needs the "arguments" object
  };
  window.gtag("js", new Date());
  // GA4 also records page changes inside the site (React Router) automatically.
  window.gtag("config", id);
}

// Custom events, for example "generate_lead" or "whatsapp_click".
// Never put names, emails or phone numbers in here.
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}