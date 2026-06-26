import { projectCopy } from "../data/project-copy.js";
import { projectVisuals } from "../data/project-visuals.js?v=20260626-1";
import { escapeHtml, loadProjects, renderChrome } from "./shared.js";

renderChrome();

const main = document.querySelector("[data-project-page]");
const slug = new URLSearchParams(location.search).get("slug");

try {
  const projects = await loadProjects();
  const project = projects.find(item => item.project_slug === slug);
  const copy = projectCopy[slug];
  if (!project || !copy) throw new Error("Project not found");

  const coverImage = project.cover_image || copy.coverImage || "";
  const projectAssets = projectVisuals[slug] || {};
  const selectedVisuals = projectAssets.selectedVisuals || [];
  const downloads = projectAssets.downloads || [];
  const sections = copy.sections || [
    { heading: "Overview", body: copy.overview },
    { heading: "Context", body: copy.context },
    { heading: "My Role", body: copy.role },
    { heading: "Approach", body: copy.approach },
    { heading: "Outcome / What it shows", body: copy.outcome }
  ];
  const showStandaloneSkills = !copy.sections;
  const visualSectionNumber = String(sections.length + 1).padStart(2, "0");
  const visualHeading = copy.visualHeading || "Selected visuals";

  document.title = `${project.project_title} — Audris Li`;
  main.innerHTML = `
    <article>
      <header class="page-shell page-top project-hero">
        <div class="project-hero__heading">
          <p class="eyebrow">Project / ${escapeHtml(project.year)}</p>
          <h1>${escapeHtml(project.project_title)}</h1>
          <p class="project-hero__summary">${escapeHtml(project.one_line_summary)}</p>
          ${copy.placeholder ? '<p class="copy-status">Editable project draft — details marked for confirmation.</p>' : ""}
        </div>
        <dl class="project-facts">
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt>Category</dt><dd>${escapeHtml(project.category)}</dd></div>
          <div><dt>Year</dt><dd>${escapeHtml(project.year)}</dd></div>
        </dl>
      </header>
      ${coverImage ? `<figure class="project-cover">
        <img src="${escapeHtml(coverImage)}" alt="Cover image for ${escapeHtml(project.project_title)}" loading="eager">
      </figure>` : ""}
      <div class="page-shell case-study">
        ${sections.map((section, index) => `
          <section class="case-study__section">
            <p class="case-study__number">${String(index + 1).padStart(2, "0")}</p>
            <h2>${escapeHtml(section.heading)}</h2>
            <div class="case-study__content">${renderSectionBody(section.body)}</div>
          </section>`).join("")}
        ${showStandaloneSkills ? `<section class="project-skills" aria-label="Skills demonstrated">
          <p class="eyebrow">Skills demonstrated</p>
          <ul>${copy.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
        </section>` : ""}
      </div>
      <section class="page-shell project-selected-visuals project-selected-visuals--${escapeHtml(slug)}" aria-labelledby="selected-visuals-title">
        <header class="project-selected-visuals__header">
          <p class="case-study__number">${visualSectionNumber}</p>
          <h2 id="selected-visuals-title">${escapeHtml(visualHeading)}</h2>
          <p>${escapeHtml(copy.visuals)}</p>
        </header>
        ${selectedVisuals.length ? `<div class="project-selected-visuals__grid">
          ${selectedVisuals.map((visual, index) => `<figure class="project-selected-visual${index === 0 || index % 5 === 3 ? " project-selected-visual--wide" : ""}" data-visual-order="${index + 1}">
            <div class="project-selected-visual__media">
              <div class="project-selected-visual__frame">
                <img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}" loading="${slug === "fashion-styling-visual-direction" && index < 7 ? "eager" : index < 2 ? "eager" : "lazy"}">
              </div>
              ${slug !== "marketing-retail-projects" && visual.caption ? `<figcaption>${escapeHtml(visual.caption)}</figcaption>` : ""}
            </div>
          </figure>`).join("")}
        </div>` : `<p class="project-selected-visuals__empty">No selected visuals are available yet. This section will be updated as suitable material is confirmed.</p>`}
      </section>
      ${downloads.length ? `<section class="page-shell project-downloads" aria-labelledby="project-downloads-title">
        <header class="project-downloads__header">
          <p class="case-study__number">07</p>
          <h2 id="project-downloads-title">Project downloads</h2>
          <p>Download selected project documents for further detail.</p>
        </header>
        <div class="project-downloads__list">
          ${downloads.map(download => `<a href="${escapeHtml(download.href)}" download="${escapeHtml(download.filename)}">
            <span>${escapeHtml(download.title)}</span>
            <small>${escapeHtml(download.meta)} · Download ↓</small>
          </a>`).join("")}
        </div>
      </section>` : ""}
    </article>`;
function renderSectionBody(body) {
  const blocks = Array.isArray(body) ? body : [body];
  return blocks.map(block => {
    if (typeof block === "string") return `<p>${escapeHtml(block)}</p>`;
    if (block && Array.isArray(block.items)) {
      return `${block.listTitle ? `<p>${escapeHtml(block.listTitle)}</p>` : ""}<ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    return "";
  }).join("");
}

} catch (error) {
  main.innerHTML = `<div class="page-shell page-top"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="text-link" href="work.html">Return to work</a></div>`;
}
