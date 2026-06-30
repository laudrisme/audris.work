import { photographySections, getPhotographyImages } from "../data/photography-sections.js?v=20260629-reference-layout";
import { projectCopy } from "../data/project-copy.js";
import { workIndex } from "../data/work-index.js";
import { escapeHtml, loadProjects, renderChrome } from "./shared.js?v=20260630-publish-cleanup";

renderChrome();

const intro = document.querySelector("[data-photography-intro]");
const sectionIndex = document.querySelector("[data-photography-index]");
const essay = document.querySelector("[data-photography-essay]");
const photographyPageHref = "work/photography-visual-storytelling/index.html";

function imageMarkup(image, section, index, lead = false, className = "", variant = "") {
  const rhythm = variant || (lead ? "lead" : ["tile-a", "tile-b", "tile-wide", "tile-small"][index % 4]);
  const classes = ["photo", `photo--${rhythm}`, className].filter(Boolean).join(" ");
  return `<figure class="${classes}">
    <img src="${image.src}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${lead && section.layout === "opening" ? "eager" : "lazy"}">
    ${image.caption ? `<figcaption class="visually-hidden">${escapeHtml(image.caption)}</figcaption>` : ""}
  </figure>`;
}

function referenceImageMarkup(images, section, file, className) {
  const image = images.find(entry => entry.file === file);
  if (!image) return "";
  return imageMarkup(image, section, image.order - 1, false, className, "reference");
}

function objectsReferenceLayoutMarkup(section, images) {
  return `<div class="photo-layout photo-layout--objects">
    <div class="objects-layout-row objects-layout-row-01">
      ${referenceImageMarkup(images, section, "01.jpg", "objects-image-01")}
      ${referenceImageMarkup(images, section, "02.jpg", "objects-image-02")}
    </div>
    <div class="objects-layout-row objects-layout-row-02">
      ${referenceImageMarkup(images, section, "03.jpg", "objects-image-03")}
    </div>
    <div class="objects-layout-row objects-layout-row-03">
      ${referenceImageMarkup(images, section, "04.jpg", "objects-image-04")}
      ${referenceImageMarkup(images, section, "05.jpg", "objects-image-05")}
    </div>
    <div class="objects-layout-row objects-layout-row-04">
      ${referenceImageMarkup(images, section, "06.jpeg", "objects-image-06")}
      <div class="objects-layout-stack">
        ${referenceImageMarkup(images, section, "08.jpg", "objects-image-08")}
        ${referenceImageMarkup(images, section, "07.jpeg", "objects-image-07")}
      </div>
    </div>
    <div class="objects-layout-row objects-layout-row-05">
      ${referenceImageMarkup(images, section, "09.jpg", "objects-image-09")}
    </div>
  </div>`;
}

function placesReferenceLayoutMarkup(section, images) {
  return `<div class="photo-layout photo-layout--places">
    <div class="place-layout-row place-layout-row-01">
      ${referenceImageMarkup(images, section, "01.jpg", "place-image-01")}
    </div>
    <div class="place-layout-row place-layout-row-02">
      ${referenceImageMarkup(images, section, "02.jpg", "place-image-02")}
      ${referenceImageMarkup(images, section, "03.jpg", "place-image-03")}
    </div>
    <div class="place-layout-row place-layout-row-03">
      ${referenceImageMarkup(images, section, "04.jpg", "place-image-04")}
    </div>
    <div class="place-layout-row place-layout-row-04">
      ${referenceImageMarkup(images, section, "05.jpeg", "place-image-05")}
    </div>
    <div class="place-layout-row place-layout-row-05">
      ${referenceImageMarkup(images, section, "06.jpeg", "place-image-06")}
      ${referenceImageMarkup(images, section, "07.jpg", "place-image-07")}
    </div>
    <div class="place-layout-row place-layout-row-06">
      ${referenceImageMarkup(images, section, "08.jpeg", "place-image-08")}
    </div>
    <div class="place-layout-row place-layout-row-07">
      ${referenceImageMarkup(images, section, "09.jpg", "place-image-09")}
    </div>
  </div>`;
}

function sectionVisualsMarkup(section, images) {
  if (section.anchor === "fashion-styling") {
    return `<div class="photo-works-grid photo-works-grid--fashion-styling">
      ${images.map((image, index) => imageMarkup(image, section, index)).join("")}
    </div>`;
  }
  if (section.anchor === "star") {
    return `<div class="photo-works-grid photo-works-grid--star">
      ${images.map((image, index) => imageMarkup(image, section, index)).join("")}
    </div>`;
  }
  if (section.anchor === "objects-and-texture") {
    return objectsReferenceLayoutMarkup(section, images);
  }
  if (section.anchor === "place-and-atmosphere") {
    return placesReferenceLayoutMarkup(section, images);
  }
  return `<div class="photo-section__lead">${imageMarkup(images[0], section, 0, true)}</div>
    <div class="photo-works-grid">${images.slice(1).map((image, index) => imageMarkup(image, section, index)).join("")}</div>`;
}

try {
  const projects = await loadProjects();
  const project = projects.find(item => item.project_slug === "photography-visual-storytelling");
  const copy = projectCopy["photography-visual-storytelling"];
  const indexProject = workIndex.find(item => item.id === "photography-visual-storytelling");
  if (!project) throw new Error("Photography metadata missing");
  intro.id = "top";
  intro.innerHTML = `
    <p class="eyebrow">Photography archive / ${escapeHtml(indexProject.year)}</p>
    <div class="photography-intro__grid">
      <h1>${escapeHtml(project.project_title)}</h1>
      <p>${escapeHtml(project.one_line_summary)} Browse the five sequences below.</p>
    </div>`;

  sectionIndex.innerHTML = photographySections.map((section, index) => {
    const sectionImages = getPhotographyImages(section);
    const first = sectionImages.find(image => image.file === section.previewImage) || sectionImages[0];
    return `<a href="${photographyPageHref}#${section.anchor}" class="photography-index-card">
      <img src="${first.src}" alt="Preview of ${escapeHtml(section.title)}" width="${first.width}" height="${first.height}" loading="${index < 2 ? "eager" : "lazy"}">
      <span><i>${String(index + 1).padStart(2, "0")}</i>${escapeHtml(section.title)}</span>
    </a>`;
  }).join("");

  essay.innerHTML = photographySections.map(section => {
    const images = getPhotographyImages(section);
    return `<section class="photo-section photo-section--${section.layout}" id="${section.anchor}">
      <header class="photo-section__title"><p>${section.id.slice(0, 2)}</p><h2>${escapeHtml(section.title)}</h2><a href="${photographyPageHref}#top">Index ↑</a></header>
      ${section.anchor === "overview" ? `<div class="photo-overview-copy">
        <p class="photo-overview-copy__lead">${escapeHtml(copy.overview)}</p>
        <dl>
          <div><dt>Context</dt><dd>${escapeHtml(copy.context)}</dd></div>
          <div><dt>My Role</dt><dd>${escapeHtml(copy.role)}</dd></div>
          <div><dt>Approach</dt><dd>${escapeHtml(copy.approach)}</dd></div>
          <div><dt>What it shows</dt><dd>${escapeHtml(copy.outcome)}</dd></div>
        </dl>
      </div>
      <section class="project-skills project-skills--photography" aria-label="Skills demonstrated">
        <p class="eyebrow">Skills demonstrated</p>
        <ul>${copy.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
      </section>` : ""}
      ${sectionVisualsMarkup(section, images)}
    </section>`;
  }).join("");

  const scrollToHash = () => {
    const requestedAnchor = decodeURIComponent(location.hash.replace(/^#/, ""));
    const anchor = ({ opening: "overview", closing: "star" })[requestedAnchor] || requestedAnchor;
    if (!anchor) return;
    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  };
  requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
  [0, 160, 640].forEach(delay => window.setTimeout(scrollToHash, delay));
  window.addEventListener("load", scrollToHash, { once: true });
  window.addEventListener("hashchange", scrollToHash);
  setupContextAwarePhotography();
} catch (error) {
  intro.innerHTML = `<p class="data-error">Photography metadata could not be loaded. Preview the site through a local web server.</p>`;
}

function setupContextAwarePhotography() {
  const contextBar = document.querySelector(".project-context-bar");
  const contextLabel = document.querySelector("[data-photography-context-section]");
  const sections = [...document.querySelectorAll(".photo-section")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [
    ...document.querySelectorAll(
      ".photography-intro__grid > *, .photography-index-card, .photo-section__title, .photo-overview-copy > *, .project-skills--photography, .photo"
    )
  ];

  if (!reducedMotion && "IntersectionObserver" in window) {
    document.body.classList.add("project-motion-ready");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach((item, index) => {
      item.classList.add("project-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 3) * 55}ms`);
      revealObserver.observe(item);
    });

    const sectionObserver = new IntersectionObserver(entries => {
      const active = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!active || !contextLabel || !contextBar) return;
      const number = active.target.querySelector(".photo-section__title p")?.textContent || "";
      const heading = active.target.querySelector(".photo-section__title h2")?.textContent || "";
      contextLabel.textContent = `${number} / ${heading}`;
      contextBar.classList.add("is-visual-context");
    }, { threshold: 0, rootMargin: "-22% 0px -62% 0px" });
    sections.forEach(section => sectionObserver.observe(section));

    let lastScrollY = window.scrollY;
    let scrollTicking = false;
    const updateContextBar = () => {
      const currentScrollY = window.scrollY;
      const movingDown = currentScrollY > lastScrollY + 3;
      const pastIntro = currentScrollY > Math.min(window.innerHeight * 0.45, 420);
      contextBar?.classList.toggle("is-visible", pastIntro && !movingDown);
      lastScrollY = currentScrollY;
      scrollTicking = false;
    };
    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateContextBar);
    }, { passive: true });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
    contextBar?.classList.add("is-reduced-motion");
  }
}
