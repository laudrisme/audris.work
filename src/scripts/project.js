import { escapeHtml, loadProjects, renderChrome } from "./shared.js";

renderChrome();

const main = document.querySelector("[data-project-page]");
const slug = new URLSearchParams(location.search).get("slug");

try {
  const projects = await loadProjects();
  const project = projects.find(item => item.project_slug === slug);
  if (!project) throw new Error("Project not found");
  document.title = `${project.project_title} — Audris Li`;
  main.innerHTML = `
    <article>
      <header class="page-shell page-top project-hero">
        <div class="project-hero__heading">
          <p class="eyebrow">Project / ${escapeHtml(project.year)}</p>
          <h1>${escapeHtml(project.project_title)}</h1>
          <p class="project-hero__summary">${escapeHtml(project.one_line_summary)}</p>
        </div>
        <dl class="project-facts">
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt>Category</dt><dd>${escapeHtml(project.category)}</dd></div>
          <div><dt>Year</dt><dd>${escapeHtml(project.year)}</dd></div>
        </dl>
      </header>
      <figure class="project-cover">
        <img src="${escapeHtml(project.cover_image)}" alt="Cover image for ${escapeHtml(project.project_title)}" loading="eager">
      </figure>
      <div class="page-shell case-study">
        ${["Context", "Challenge", "Approach", "Outcome", "Selected visuals", "Skills demonstrated"].map((heading, index) => `
          <section class="case-study__section">
            <p class="case-study__number">${String(index + 1).padStart(2, "0")}</p>
            <h2>${heading}</h2>
            <p>${heading === "Selected visuals" ? "Image sequence and captions to be added from the curated project assets." : "Project copy is ready to be refined from the existing content draft."}</p>
          </section>`).join("")}
      </div>
    </article>`;
} catch (error) {
  main.innerHTML = `<div class="page-shell page-top"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="text-link" href="work.html">Return to work</a></div>`;
}
