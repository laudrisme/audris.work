import { photographySections, getPhotographyImages } from "../data/photography-sections.js";
import { escapeHtml, loadProjects, renderChrome } from "./shared.js";

renderChrome();

const intro = document.querySelector("[data-photography-intro]");
const sectionIndex = document.querySelector("[data-photography-index]");
const essay = document.querySelector("[data-photography-essay]");

function imageMarkup(image, section, index, lead = false) {
  const rhythm = lead ? "lead" : ["tile-a", "tile-b", "tile-wide", "tile-small"][index % 4];
  return `<figure class="photo photo--${rhythm}">
    <img src="${image.src}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${lead && section.layout === "opening" ? "eager" : "lazy"}">
    <figcaption class="visually-hidden">${escapeHtml(image.caption)}</figcaption>
  </figure>`;
}

try {
  const projects = await loadProjects();
  const project = projects.find(item => item.project_slug === "photography-visual-storytelling");
  if (!project) throw new Error("Photography metadata missing");
  intro.id = "top";
  intro.innerHTML = `
    <p class="eyebrow">Photography archive / ${escapeHtml(project.year)}</p>
    <div class="photography-intro__grid">
      <h1>${escapeHtml(project.project_title)}</h1>
      <p>${escapeHtml(project.one_line_summary)} Browse the five sequences below.</p>
    </div>`;

  sectionIndex.innerHTML = photographySections.map((section, index) => {
    const first = getPhotographyImages(section)[0];
    return `<a href="#${section.anchor}" class="photography-index-card">
      <img src="${first.src}" alt="Preview of ${escapeHtml(section.title)}" width="${first.width}" height="${first.height}" loading="${index < 2 ? "eager" : "lazy"}">
      <span><i>${String(index + 1).padStart(2, "0")}</i>${escapeHtml(section.title)}</span>
    </a>`;
  }).join("");

  essay.innerHTML = photographySections.map(section => {
    const images = getPhotographyImages(section);
    return `<section class="photo-section photo-section--${section.layout}" id="${section.anchor}">
      <header class="photo-section__title"><p>${section.id.slice(0, 2)}</p><h2>${escapeHtml(section.title)}</h2><a href="#top">Index ↑</a></header>
      <div class="photo-section__lead">${imageMarkup(images[0], section, 0, true)}</div>
      <div class="photo-works-grid">${images.slice(1).map((image, index) => imageMarkup(image, section, index)).join("")}</div>
    </section>`;
  }).join("");

  const scrollToHash = () => {
    const anchor = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!anchor) return;
    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  };
  requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
  [0, 160, 640].forEach(delay => window.setTimeout(scrollToHash, delay));
  window.addEventListener("load", scrollToHash, { once: true });
  window.addEventListener("hashchange", scrollToHash);
} catch (error) {
  intro.innerHTML = `<p class="data-error">Photography metadata could not be loaded. Preview the site through a local web server.</p>`;
}
