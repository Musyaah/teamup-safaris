import { useEffect } from "react";

// Title and description for every page. Google shows these in search results.
// Keep titles under about 60 characters and descriptions under about 160.
export const PAGE_META = {
  "/": {
    title: "Teamup Safaris | Transfers & Safaris in Kenya",
    description:
      "Airport and hotel transfers, personal chauffeur and safari tours across Kenya, from Karen, Nairobi. Contact Teamup Safaris to plan your trip.",
  },
  "/services": {
    title: "Our Services | Teamup Safaris Nairobi",
    description:
      "Airport transfers, hotel transfers, game drives, personal chauffeur, tours and custom travel planning in Kenya. Enquire with Teamup Safaris.",
  },
  "/destinations": {
    title: "Kenya Safari Destinations | Teamup Safaris",
    description:
      "Explore Maasai Mara, Amboseli, Tsavo, Lamu, Diani, Watamu and more. Plan a Kenyan safari, beach or cultural trip with Teamup Safaris.",
  },
  "/about": {
    title: "About Us | Teamup Safaris, Karen Nairobi",
    description:
      "Teamup Safaris is a Karen, Nairobi travel and transport service offering private transfers and safari planning across Kenya.",
  },
  "/hotels": {
    title: "Hotels & Stays in Kenya | Teamup Safaris",
    description:
      "Safari lodges, hotels, beach resorts and nature retreats across Kenya. Ask Teamup Safaris about stays for your itinerary.",
  },
  "/contact": {
    title: "Contact & Enquiries | Teamup Safaris",
    description:
      "Contact Teamup Safaris in Karen, Nairobi. Call 0702049587, message on WhatsApp or send an enquiry for transfers, safaris and tours.",
  },
};

const NOT_FOUND = {
  title: "Page not found | Teamup Safaris",
  description: "The page you requested could not be found.",
  noindex: true,
};

// Finds a <meta>/<link> tag in <head> (or creates it) and sets its attributes.
function upsert(tagName, matchAttr, matchValue, attrs) {
  let el = document.head.querySelector(`${tagName}[${matchAttr}="${matchValue}"]`);
  if (!el) {
    el = document.createElement(tagName);
    el.setAttribute(matchAttr, matchValue);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

export function usePageMeta(pathname) {
  useEffect(() => {
    const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const meta = PAGE_META[clean] || NOT_FOUND;
    const url = `${window.location.origin}${clean}`;

    document.title = meta.title;
    upsert("meta", "name", "description", { content: meta.description });
    upsert("meta", "name", "robots", { content: meta.noindex ? "noindex, follow" : "index, follow" });
    upsert("link", "rel", "canonical", { href: url });
    upsert("meta", "property", "og:title", { content: meta.title });
    upsert("meta", "property", "og:description", { content: meta.description });
    upsert("meta", "property", "og:url", { content: url });
  }, [pathname]);
}