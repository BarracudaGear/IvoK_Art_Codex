window.SITE_DATA = {
  site: {
    artistName: "IVO",
    role: "Painter",
    email: "studio@artistname.com",
    instagramUrl: "#",
    instagramLabel: "Instagram",
    footerNote: "Portraits, landscapes, murals, and finishes shaped for quiet viewing."
  },
  hero: {
    label: "Painter",
    title: "IVO",
    statement: "A painting practice built around portraiture, landscape, murals, and material finishes.",
    description:
      "The homepage is intentionally pared back so the work carries the color, weight, and emotional tone of the entire experience.",
    image: "images/hero.svg",
    alt: "Featured painting placeholder",
    primaryCtaLabel: "View Works",
    primaryCtaHref: "works.html",
    secondaryCtaLabel: "Commission a Painting",
    secondaryCtaHref: "commissions.html"
  },
  categories: [
    {
      slug: "portraits",
      label: "Portraits",
      room: "Room I",
      atmosphere: "Warm terracotta - intimate and close"
    },
    {
      slug: "landscapes",
      label: "Landscapes",
      room: "Room II",
      atmosphere: "Open sky blue-grey - expansive and airy"
    },
    {
      slug: "murals",
      label: "Outdoor and Indoor Murals",
      room: "Room III",
      atmosphere: "Stone and concrete - monumental and public"
    },
    {
      slug: "finishes",
      label: "Finishes",
      room: "Room IV",
      atmosphere: "Neutral warm white - refined and material"
    }
  ],
  worksByCategory: {
    portraits: [
      {
        slug: "study-in-ochre-and-silence",
        title: "Study in Ochre and Silence",
        image: "images/work-1.svg",
        alt: "Portrait painting placeholder",
        year: "2024",
        medium: "Oil on canvas",
        dimensions: "80 x 60 cm",
        price: "EUR 1,400",
        featured: true,
        description: [
          "A close portrait built around soft umber tones and a steady front-facing gaze.",
          "The composition explores how stillness can carry as much force as gesture."
        ]
      },
      {
        slug: "threshold-figure",
        title: "Threshold Figure",
        image: "images/work-2.svg",
        alt: "Second portrait painting placeholder",
        year: "2023",
        medium: "Mixed media on canvas",
        dimensions: "90 x 70 cm",
        price: "EUR 1,950",
        featured: true,
        description: [
          "A portrait structured around entry, pause, and the visual language of arrival.",
          "The figure is held between architectural edges and soft fields of color."
        ]
      }
    ],
    landscapes: [
      {
        slug: "after-rain-open-ground",
        title: "After Rain, Open Ground",
        image: "images/work-3.svg",
        alt: "Landscape painting placeholder",
        year: "2024",
        medium: "Oil on linen",
        dimensions: "100 x 120 cm",
        price: "EUR 2,400",
        featured: true,
        description: [
          "A broad landscape painting focused on atmosphere, low light, and saturated earth.",
          "The work holds the quiet scale of a room viewed after weather has passed."
        ]
      }
    ],
    murals: [
      {
        slug: "red-earth-wall",
        title: "Red Earth Wall",
        image: "images/work-4.svg",
        alt: "Mural painting placeholder",
        year: "2025",
        medium: "Exterior mural study",
        dimensions: "Site specific",
        price: "Commission",
        featured: true,
        description: [
          "A mural concept developed for civic space, balancing visibility with calm material presence.",
          "The color structure is meant to read clearly at distance without overwhelming the architecture."
        ]
      }
    ],
    finishes: [
      {
        slug: "limewash-study-no-2",
        title: "Limewash Study No. 2",
        image: "images/work-5.svg",
        alt: "Finish sample artwork placeholder",
        year: "2024",
        medium: "Pigment, limewash, and wax on board",
        dimensions: "60 x 60 cm",
        price: "EUR 950",
        featured: false,
        description: [
          "A material study that treats finish as a complete visual work rather than a supporting surface.",
          "Subtle tonal shifts and texture carry the composition."
        ]
      }
    ]
  },
  prints: {
    label: "Prints",
    title: "Own the work at any scale",
    description:
      "Archival giclee prints are available in fixed sizes. The presentation follows the same pared-back approach as the rest of the site so the image remains central.",
    note: "Ordering is currently handled by email while direct checkout is finalized.",
    sizes: [
      {
        name: "Small",
        dimensions: "30 x 40 cm",
        price: "EUR 180"
      },
      {
        name: "Medium",
        dimensions: "50 x 70 cm",
        price: "EUR 320"
      },
      {
        name: "Large",
        dimensions: "70 x 100 cm",
        price: "EUR 520"
      }
    ]
  },
  commissions: {
    label: "Commissions",
    title: "A clear four-step process",
    description:
      "Commission inquiries move through a simple sequence so the conversation stays focused and practical from the first message onward.",
    steps: [
      {
        title: "Inquiry",
        text: "Share the subject, budget range, preferred scale, and timeline."
      },
      {
        title: "Proposal",
        text: "Receive a tailored response covering scope, price, and process."
      },
      {
        title: "Creation",
        text: "The work is developed through agreed milestones and image updates."
      },
      {
        title: "Delivery",
        text: "Final varnish, packing, and shipping are arranged with care."
      }
    ]
  },
  about: {
    label: "About",
    title: "An artwork-first portfolio",
    statement:
      "The site follows a gallery model: restrained typography, warm off-white surfaces, and just enough structure to move between viewing, prints, and commissions.",
    portraitImage: "images/about.svg",
    portraitAlt: "Artist portrait placeholder",
    biography: [
      "IVO works across portraiture, landscape, murals, and finish-based surfaces, moving between intimate studio pieces and public-scale work.",
      "The practice is rooted in earthy color, material sensitivity, and a strong preference for quiet compositions that gather attention slowly rather than demand it all at once."
    ]
  },
  contact: {
    label: "Contact",
    title: "Start the conversation",
    description:
      "Use the form for commissions, print questions, or general inquiries. Location details can be shared privately when needed.",
    location: "Location details available on request."
  }
};
