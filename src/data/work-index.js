export const workIndex = [
  {
    id: "cyta-sustainable-incense-brand",
    title: "Cyta / Sustainable Incense Brand",
    type: "project",
    category: "Brand",
    subcategory: "Sustainable Ritual Goods",
    year: "2023–2026",
    route: "project.html?slug=cyta-sustainable-incense-brand",
    anchor: "",
    keywords: ["brand", "product", "incense", "sustainability", "packaging", "ritual"],
    image: "assets/project-covers/cyta-cover-packaging-01.png",
    featured: true
  },
  {
    id: "cross-border-ecommerce-operations",
    title: "Cross-Border E-commerce & Operations",
    type: "project",
    category: "E-commerce",
    subcategory: "Operations / Sourcing",
    year: "2026",
    route: "project.html?slug=cross-border-ecommerce-operations",
    anchor: "",
    keywords: ["e-commerce", "operations", "sourcing", "suppliers", "international", "retail"],
    image: "assets/project-covers/ecommerce-cover-factory-production-01.jpg",
    featured: true
  },
  {
    id: "ai-customer-experience-research",
    title: "AI Customer Experience Research",
    type: "project",
    category: "Research",
    subcategory: "AI / CX / Accessibility",
    year: "2025",
    route: "project.html?slug=ai-customer-experience-research",
    anchor: "",
    keywords: ["research", "ai", "customer experience", "accessibility", "adhd", "fashion"],
    image: "assets/projects/ai-cx-research/ai-cx-cover-academic-poster-01.png",
    featured: true
  },
  {
    id: "marketing-retail-projects",
    title: "Marketing & Retail Projects",
    type: "project",
    category: "Retail",
    subcategory: "Brand / Consumer / Strategy",
    year: "2024–2026",
    route: "project.html?slug=marketing-retail-projects",
    anchor: "",
    keywords: ["retail", "marketing", "brand", "consumer", "strategy", "crm", "gamification"],
    image: "assets/projects/marketing-retail/web-ready-spreads/marketing-retail-icicle-spread-04.png",
    featured: true
  },
  {
    id: "photography-visual-storytelling",
    title: "Photography & Visual Storytelling",
    type: "project",
    category: "Photography",
    subcategory: "Visual Essay",
    year: "2022–2026",
    route: "work/photography-visual-storytelling/",
    anchor: "",
    keywords: ["photography", "visual storytelling", "editorial", "image making"],
    image: "assets/project-covers/photography-cover-jewellery-between-courses-01.jpg",
    featured: true
  },
  {
    id: "photography-overview",
    title: "Overview",
    type: "photography-section",
    category: "Photography",
    subcategory: "Visual Essay Overview",
    year: "/",
    route: "work/photography-visual-storytelling/",
    anchor: "overview",
    keywords: ["photography", "overview", "sequence", "visual essay"],
    image: "assets/projects/photography/curated-sections/01-opening/01.jpg",
    featured: true
  },
  {
    id: "photography-fashion-styling",
    title: "Fashion Styling",
    type: "photography-section",
    category: "Photography",
    subcategory: "Styling / Fashion Photography",
    year: "/",
    route: "work/photography-visual-storytelling/",
    anchor: "fashion-styling",
    keywords: ["photography", "fashion", "styling", "portrait", "still life"],
    image: "assets/projects/photography/curated-sections/02-Fashion-Styling/01.jpg",
    featured: true
  },
  {
    id: "photography-objects-texture",
    title: "Objects and Texture",
    type: "photography-section",
    category: "Photography",
    subcategory: "Detail / Material / Jewellery",
    year: "/",
    route: "work/photography-visual-storytelling/",
    anchor: "objects-and-texture",
    keywords: ["photography", "objects", "texture", "jewellery", "material", "still life"],
    image: "assets/projects/photography/curated-sections/03-objects-and-texture/01.jpg",
    featured: true
  },
  {
    id: "photography-place-atmosphere",
    title: "Place and Atmosphere",
    type: "photography-section",
    category: "Photography",
    subcategory: "Street / Travel / Mood",
    year: "/",
    route: "work/photography-visual-storytelling/",
    anchor: "place-and-atmosphere",
    keywords: ["photography", "place", "atmosphere", "street", "travel", "mood"],
    image: "assets/projects/photography/curated-sections/04-place-and-atmosphere/01.jpg",
    featured: true
  },
  {
    id: "photography-star",
    title: "✩",
    type: "photography-section",
    category: "Photography",
    subcategory: "Final Sequence",
    year: "/",
    route: "work/photography-visual-storytelling/",
    anchor: "star",
    keywords: ["photography", "closing", "star", "place", "sequence", "visual essay"],
    image: "assets/projects/photography/curated-sections/05-closing/01.jpg",
    featured: false
  },
  {
    id: "fashion-styling-visual-direction",
    title: "Fashion Styling / Visual Direction",
    type: "project",
    category: "Styling",
    subcategory: "Editorial / Image-making",
    year: "/",
    route: "project.html?slug=fashion-styling-visual-direction",
    anchor: "",
    keywords: ["styling", "fashion", "visual direction", "editorial", "portrait", "still life"],
    image: "assets/project-covers/fashion-styling-cover-revolution-01.jpg",
    featured: false
  }
];

export const workFilters = ["All", "Brand", "E-commerce", "Research", "Retail", "Photography", "Styling"];

export function workEntryHref(entry) {
  return `${entry.route}${entry.anchor ? `#${entry.anchor}` : ""}`;
}
