

const CATEGORY_ICONS = {
  "social-media-tools": "/icons/socialtools.svg",
  "text-tools": "/icons/texttools.svg",
  "image-tools": "/icons/imagetools.svg",
  "css-tools": "/icons/csstools.svg",
  "coding-tools": "/icons/codingtools.svg",
  "color-tools": "/icons/colortools.svg",
  "Miscellaneous-tools": "/icons/miscellaneoustools.svg",
};

const CATEGORY_LABELS = {
  "social-media-tools": "Social Media Tools",
  "text-tools": "Text Tools",
  "image-tools": "Image Tools",
  "css-tools": "CSS Tools",
  "coding-tools": "Coding Tools",
  "color-tools": "Color Tools",
  "Miscellaneous-tools": "Miscellaneous Tools",
};

export async function buildSidebarData() {
  const response = await fetch('/data.json');
  const tools = await response.json();

  const grouped = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = {
        category: tool.category,
        displayName: CATEGORY_LABELS[tool.category] || tool.category,
        icon: CATEGORY_ICONS[tool.category],
        tools: [],
      };
    }

    acc[tool.category].tools.push({
      title: tool.title,
      slug: tool.slug.trim().toLowerCase(),
      image: tool.image,
    });

    return acc;
  }, {});

  return Object.values(grouped);
}