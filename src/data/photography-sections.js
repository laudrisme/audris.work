export const photographySections = [
  {
    id: "01-opening",
    anchor: "overview",
    legacyAnchor: "opening",
    title: "Overview",
    displayTitle: true,
    layout: "opening",
    previewImage: "04.jpg",
    images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    dimensions: [[4399, 6598], [4374, 5468], [2107, 2809], [1739, 3091]]
  },
  {
    id: "02-Fashion-Styling",
    anchor: "fashion-styling",
    title: "Fashion Styling",
    displayTitle: true,
    layout: "asymmetric",
    images: ["01.jpg", "02.jpg", "03.jpeg", "04.jpg", "05.jpeg", "06.jpg", "07.jpg"],
    dimensions: [[4031, 5375], [1072, 2860], [1080, 1050], [4399, 6598], [3240, 1920], [1910, 2547], [2048, 2731]]
  },
  {
    id: "03-objects-and-texture",
    anchor: "objects-and-texture",
    title: "Objects and Texture",
    displayTitle: true,
    layout: "asymmetric",
    assetVersion: "20260629-objects-layout-reference",
    images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpeg", "07.jpeg", "08.jpg", "09.jpg"],
    dimensions: [[4384, 5845], [3890, 5187], [4472, 3354], [3536, 4714], [3354, 4472], [3710, 4948], [4183, 5577], [4362, 5816], [5205, 3904]]
  },
  {
    id: "04-place-and-atmosphere",
    anchor: "place-and-atmosphere",
    title: "Place and Atmosphere",
    displayTitle: true,
    layout: "essay",
    images: [
      "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpeg",
      "06.jpeg", "07.jpg", "08.jpeg", "09.jpg"
    ],
    dimensions: [[2048, 2694], [4492, 5989], [2649, 3311], [4492, 5989], [2228, 2971], [2228, 2971], [2048, 2731], [2048, 2731], [3649, 4865]]
  },
  {
    id: "05-closing",
    anchor: "star",
    legacyAnchor: "closing",
    title: "✩",
    displayTitle: true,
    layout: "closing",
    assetVersion: "20260628-closing",
    images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    dimensions: [[2117, 3764], [2117, 3764], [1738, 3090], [1739, 3091]]
  }
];

export function getPhotographyImages(section) {
  return section.images
    .map((image, sourceIndex) => {
      const entry = typeof image === "string" ? { file: image, include: true } : image;
      const [width, height] = section.dimensions[sourceIndex] || [];
      return { ...entry, width, height };
    })
    .filter(image => image.include !== false)
    .map((image, index) => ({
      ...image,
      order: index + 1,
      src: `assets/projects/photography/curated-sections/${section.id}/${image.file}${section.assetVersion ? `?v=${section.assetVersion}` : ""}`,
      alt: `Photography and Visual Storytelling, ${section.title || "opening and closing"}, image ${String(index + 1).padStart(2, "0")}`,
      caption: "TODO — add caption if context improves the sequence."
    }));
}
