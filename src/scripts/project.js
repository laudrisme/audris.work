import { projectCopy } from "../data/project-copy.js?v=20260627-layout-notes";
import { projectVisuals } from "../data/project-visuals.js?v=20260630-pdf-size-labels";
import { escapeHtml, loadProjects, renderChrome } from "./shared.js?v=20260630-publish-cleanup";

renderChrome();

const main = document.querySelector("[data-project-page]");
const slug = new URLSearchParams(location.search).get("slug");

try {
  const projects = await loadProjects();
  const project = projects.find(item => item.project_slug === slug);
  const copy = projectCopy[slug];
  if (!project || !copy) throw new Error("Project not found");

  const coverImage = project.cover_image || copy.coverImage || "";
  const showCoverImage = coverImage && slug !== "ai-customer-experience-research";
  const projectAssets = projectVisuals[slug] || {};
  const selectedVisuals = projectAssets.selectedVisuals || [];
  const downloads = projectAssets.downloads || [];
  const sourceSections = copy.sections || [
    { heading: "Overview", body: copy.overview },
    { heading: "Context", body: copy.context },
    { heading: "My Role", body: copy.role },
    { heading: "Approach", body: copy.approach },
    { heading: "Outcome / What it shows", body: copy.outcome }
  ];
  const sections = sourceSections.filter(section => !/^skills demonstrated$/i.test(section.heading || ""));
  const skills = copy.skills || [];
  const visualGroups = buildVisualGroups(sections, selectedVisuals, projectAssets.visualGroups);
  const downloadSectionNumber = String(sourceSections.length + 1).padStart(2, "0");
  document.title = `${project.project_title} — Audris Li`;
  document.body.classList.add("project-editorial-page");
  main.classList.add(`project-page--${slug}`);
  main.innerHTML = `
    <aside class="project-context-bar" aria-label="Project context">
      <a href="work.html">← Archive</a>
      <span class="project-context-name">${escapeHtml(project.project_title)}</span>
      <span data-project-context-section>Index / ${escapeHtml(project.year)}</span>
    </aside>
    <article class="project-editorial-document" aria-labelledby="project-title">
      <header class="page-shell project-hero">
        <div class="project-hero__heading">
          <p class="eyebrow">Archive entry / ${escapeHtml(project.category)}</p>
          <h1 id="project-title">${escapeHtml(project.project_title)}</h1>
          <p class="project-hero__summary">${escapeHtml(project.one_line_summary)}</p>
        </div>
        <dl class="project-file-notes" aria-label="Project details">
          <div><dt>Category</dt><dd>${escapeHtml(project.category)}</dd></div>
          <div><dt>Year</dt><dd>${escapeHtml(project.year)}</dd></div>
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
        </dl>
      </header>
      ${showCoverImage ? `<figure class="project-cover">
        <img src="${escapeHtml(coverImage)}" alt="Cover image for ${escapeHtml(project.project_title)}" loading="eager" decoding="async" fetchpriority="high"${project.cover_width ? ` width="${project.cover_width}"` : ""}${project.cover_height ? ` height="${project.cover_height}"` : ""}>
      </figure>` : ""}
      <div class="page-shell case-study">
        ${sections.map((section, index) => `
          <section class="case-study__section${sectionAlignmentClass(section.alignment || editorialSectionAlignment(section))}" data-case-study-section="${sectionSlug(section.heading)}" data-content-layout="${escapeHtml(section.contentLayout || "standard")}">
            <p class="case-study__number">${String(index + 1).padStart(2, "0")}</p>
            <h2>${escapeHtml(section.heading)}</h2>
            <div class="case-study__content">${renderSectionBody(section.body, section.contentLayout)}</div>
            ${renderVisualGroups(visualGroups.get(index) || [], slug)}
          </section>`).join("")}
        ${skills.length ? `<section class="project-skills" aria-label="Skills demonstrated">
          <p class="eyebrow">Skills demonstrated</p>
          <ul>${skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
        </section>` : ""}
      </div>
      ${downloads.length ? `<section class="page-shell project-downloads" aria-labelledby="project-downloads-title">
        <header class="project-downloads__header">
          <p class="case-study__number">${downloadSectionNumber}</p>
          <h2 id="project-downloads-title">Project downloads</h2>
          <p>Download selected project documents for further detail.</p>
        </header>
        <div class="project-downloads__list">
          ${downloads.map(download => `<a href="${escapeHtml(download.href)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(download.title)}</span>
            <small>${escapeHtml(download.meta)} · Download ↓</small>
          </a>`).join("")}
        </div>
      </section>` : ""}
      <footer class="page-shell project-endnote">
        <a href="work.html">← Back to archive</a>
        <span>Project index / ${escapeHtml(project.project_title)}</span>
      </footer>
    </article>`;
  setupContextAwareProject();

function renderSectionBody(body, layout = "standard") {
  const blocks = Array.isArray(body) ? body : [body];
  if (layout === "split") {
    const proseBlocks = blocks.filter(block => typeof block === "string");
    const listBlock = blocks.find(block => block && Array.isArray(block.items));
    return `<div class="case-study__content-split">
      <div class="case-study__content-main">${proseBlocks.map(block => `<p>${escapeHtml(block)}</p>`).join("")}</div>
      ${listBlock ? `<div class="case-study__content-aside">
        ${listBlock.listTitle ? `<p>${escapeHtml(listBlock.listTitle)}</p>` : ""}
        <ul>${listBlock.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>` : ""}
    </div>`;
  }
  return blocks.map(block => {
    if (typeof block === "string") return `<p>${escapeHtml(block)}</p>`;
    if (block && Array.isArray(block.items)) {
      return `${block.listTitle ? `<p>${escapeHtml(block.listTitle)}</p>` : ""}<ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    return "";
  }).join("");
}

function editorialSectionAlignment(section) {
  const heading = (section.heading || "").toLowerCase();
  const blocks = Array.isArray(section.body) ? section.body : [section.body];
  const length = blocks.reduce((total, block) => {
    if (typeof block === "string") return total + block.length;
    if (block && Array.isArray(block.items)) return total + block.items.join(" ").length;
    return total;
  }, 0);

  if (/question|emphasis/.test(heading) && length <= 320) return "center";
  if (/my role|approach/.test(heading) && length <= 700) return "left";
  if (/outcome|what it led to|what it shows/.test(heading) && length <= 680) return "right";
  return "";
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
            decoding="async"
            ${visual.transparent ? 'data-transparent="true"' : ""}
          >
          ${projectSlug !== "marketing-retail-projects" && visual.caption ? `<figcaption>${escapeHtml(visual.caption)}</figcaption>` : ""}
        </figure>`).join("")}
      ${Array.isArray(group.notes) && group.notes.length ? `<div class="case-study__visual-notes">
        ${group.notes.map((note, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(note)}</p></article>`).join("")}
      </div>` : ""}
    </div>`).join("");
}

function setupContextAwareProject() {
  const contextBar = document.querySelector(".project-context-bar");
  const contextLabel = document.querySelector("[data-project-context-section]");
  const sections = [...document.querySelectorAll("[data-case-study-section]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [
    document.querySelector(".project-cover"),
    ...document.querySelectorAll(".case-study__section > .case-study__number, .case-study__section > h2, .case-study__content, .case-study__visual, .project-skills, .project-downloads__header, .project-downloads__list")
  ].filter(Boolean);

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
      const number = active.target.querySelector(".case-study__number")?.textContent || "";
      const heading = active.target.querySelector("h2")?.textContent || "";
      contextLabel.textContent = `${number} / ${heading}`;
      contextBar.classList.toggle("is-visual-context", Boolean(active.target.querySelector(".case-study__visuals")));
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

} catch (error) {
  main.innerHTML = `<div class="page-shell page-top"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="text-link" href="work.html">Return to work</a></div>`;
}
