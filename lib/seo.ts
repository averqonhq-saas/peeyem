import { PRODUCTS, COMPANY_INFO } from "@/data/products";

export const SITE_URL = "https://peeyemtraders.com";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY_INFO.name,
    alternateName: "Peeyem Traders Coimbatore",
    description:
      "Industrial Conveyor Belts, Specialized Belts, Conveyor Accessories & Rubber Sheets in Coimbatore, Tamil Nadu",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}${COMPANY_INFO.logoUrl}`,
      width: 512,
      height: 512,
    },
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phoneRaw,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY_INFO.phoneRaw,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Tamil"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "16, M.M.A. Market, South Ukkadam",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641001",
      addressCountry: "IN",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY_INFO.name,
    alternateName: "Peeyem Traders Coimbatore",
    url: SITE_URL,
    logo: `${SITE_URL}${COMPANY_INFO.logoUrl}`,
    image: `${SITE_URL}/images/products/rubber-conveyor-belt-hero.jpg`,
    description:
      "Supplier of heavy-duty industrial conveyor belts, chevron cleated belts, specialized industrial belts, conveyor accessories, and industrial rubber sheets based at South Ukkadam, Coimbatore.",
    telephone: COMPANY_INFO.phoneRaw,
    email: COMPANY_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "16, M.M.A. Market, South Ukkadam",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.9934,
      longitude: 76.9587,
    },
    hasMap: COMPANY_INFO.mapsUrl,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Bank Transfer, UPI",
    areaServed: [
      {
        "@type": "City",
        name: "Coimbatore",
      },
      {
        "@type": "State",
        name: "Tamil Nadu",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    parentOrganization: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getProductsItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((prod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${SITE_URL}/products#${prod.id}`,
        name: prod.name,
        description: prod.description,
        image: `${SITE_URL}${prod.image}`,
        category: prod.categoryTag,
        url: `${SITE_URL}/products#${prod.id}`,
        brand: {
          "@type": "Brand",
          name: COMPANY_INFO.name,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/products#${prod.id}`,
          seller: {
            "@id": `${SITE_URL}/#organization`,
          },
        },
      },
    })),
  };
}
