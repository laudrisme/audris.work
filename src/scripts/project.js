import { projectCopy } from "../data/project-copy.js?v=20260627-refine";
import { projectVisuals } from "../data/project-visuals.js?v=20260627-refine";
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
  const visualGroups = buildVisualGroups(sections, selectedVisuals, projectAssets.visualGroups);
  const downloadSectionNumber = String(sections.length + 1).padStart(2, "0");

  document.title = `${project.project_title} — Audris Li`;
  main.classList.add(`project-page--${slug}`);
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
          <section class="case-study__section${sectionAlignmentClass(section.alignment)}" data-case-study-section="${sectionSlug(section.heading)}">
            <p class="case-study__number">${String(index + 1).padStart(2, "0")}</p>
            <h2>${escapeHtml(section.heading)}</h2>
            <div class="case-study__content">${renderSectionBody(section.body)}</div>
            ${renderVisualGroups(visualGroups.get(index) || [], slug)}
          </section>`).join("")}
        ${showStandaloneSkills ? `<section class="project-skills" aria-label="Skills demonstrated">
          <p class="eyebrow">Skills demonstrated</p>
          <ul>${copy.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
        </section>` : ""}
      </div>
      ${downloads.length ? `<section class="page-shell project-downloads" aria-labelledby="project-downloads-title">
        <header class="project-downloads__header">
          <p class="case-study__number">${downloadSectionNumber}</p>
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

function sectionSlug(heading = "") {
  return heading
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sectionAlignmentClass(alignment = "") {
  return ["left", "center", "right"].includes(alignment)
    ? ` case-study__section--text-${alignment}`
    : "";
}

function buildVisualGroups(sections, visuals, configuredGroups) {
  const groupsBySection = new Map();
  const addGroup = (sectionIndex, group) => {
    if (!groupsBySection.has(sectionIndex)) groupsBySection.set(sectionIndex, []);
    groupsBySection.get(sectionIndex).push(group);
  };

  if (Array.isArray(configuredGroups) && configuredGroups.length) {
    configuredGroups.forEach(group => {
      const sectionIndex = Number(group.sectionIndex);
      const groupVisuals = (group.visualIndexes || [])
        .map(index => visuals[index])
        .filter(Boolean);
      if (Number.isInteger(sectionIndex) && groupVisuals.length) {
        addGroup(sectionIndex, { ...group, visuals: groupVisuals });
      }
    });
    return groupsBySection;
  }

  visuals.forEach((visual, index) => {
    const sectionIndex = Math.min(
      sections.length - 1,
      Math.floor((index * sections.length) / Math.max(visuals.length, 1))
    );
    const layoutCycle = ["editorial-left", "editorial-right", "editorial-wide", "editorial-center"];
    addGroup(sectionIndex, {
      layout: layoutCycle[index % layoutCycle.length],
      visuals: [visual]
    });
  });
  return groupsBySection;
}

function renderVisualGroups(groups, projectSlug) {
  return groups.map((group, groupIndex) => `
    <div class="case-study__visuals case-study__visuals--${escapeHtml(group.layout || "editorial-left")}" data-visual-group="${groupIndex + 1}">
      ${group.visuals.map((visual, visualIndex) => `
        <figure class="case-study__visual">
          <img
            src="${escapeHtml(visual.src)}"
            alt="${escapeHtml(visual.alt)}"
            loading="${visualIndex === 0 && groupIndex === 0 ? "eager" : "lazy"}"
            ${visual.transparent ? 'data-transparent="true"' : ""}
          >
          ${projectSlug !== "marketing-retail-projects" && visual.caption ? `<figcaption>${escapeHtml(visual.caption)}</figcaption>` : ""}
        </figure>`).join("")}
    </div>`).join("");
}

} catch (error) {
  main.innerHTML = `<div class="page-shell page-top"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="text-link" href="work.html">Return to work</a></div>`;
}
