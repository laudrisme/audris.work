import { projectMetadata } from "../data/project-metadata.js?v=20260630-publish-cleanup";

export async function loadProjects() {
  return projectMetadata;
}

export function projectHref(project) {
  return project.project_slug === "photography-visual-storytelling"
    ? "work/photography-visual-storytelling/index.html"
    : `project.html?slug=${encodeURIComponent(project.project_slug)}`;
}

export function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

export function renderChrome() {
  const currentPath = location.pathname;
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) {
    header.innerHTML = `
      <a class="site-name" href="index.html">Audris Li</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${[
          ["work.html", "Work"], ["work/photography-visual-storytelling/index.html", "Photography"],
          ["about.html", "About"], ["contact.html", "Contact"]
        ].map(([href, label]) => `<a href="${href}"${currentPath.endsWith(href) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        <a href="assets/documents/cv/audris-li-cv.pdf?v=20260627-cv-title" target="_blank">Audris’s CV <span aria-hidden="true">↗</span></a>
      </nav>`;
    const toggle = header.querySelector(".nav-toggle");
    toggle?.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      header.classList.toggle("nav-open", !open);
    });
  }
  if (footer) {
    footer.innerHTML = `<div><span>Audris Li</span><span>London · ${new Date().getFullYear()}</span></div><a href="mailto:laudrisme@gmail.com">Say hello <span aria-hidden="true">↗</span></a>`;
  }
}

renderChrome();
