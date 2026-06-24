import { projectCopy } from "../data/project-copy.js";
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
  const sections = [
    ["Overview", copy.overview],
    ["Context", copy.context],
    ["My Role", copy.role],
    ["Approach", copy.approach],
    ["Outcome / What it shows", copy.outcome],
    ["Selected visuals", copy.visuals]
  ];

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
        ${sections.map(([heading, text], index) => `
          <section class="case-study__section">
            <p class="case-study__number">${String(index + 1).padStart(2, "0")}</p>
            <h2>${escapeHtml(heading)}</h2>
            <p>${escapeHtml(text)}</p>
          </section>`).join("")}
        <section class="project-skills" aria-label="Skills demonstrated">
          <p class="eyebrow">Skills demonstrated</p>
          <ul>${copy.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
        </section>
      </div>
    </article>`;
} catch (error) {
  main.innerHTML = `<div class="page-shell page-top"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="text-link" href="work.html">Return to work</a></div>`;
}
