const metadataUrl = "data/project_metadata_draft.csv?v=20260627-layout-notes";

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some(value => value.length)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...records] = rows;
  return records.map(values => Object.fromEntries(headers.map((header, index) => [header.replace(/^\uFEFF/, ""), values[index] || ""])));
}

export async function loadProjects() {
  const response = await fetch(metadataUrl);
  if (!response.ok) throw new Error(`Could not load project metadata (${response.status})`);
  return parseCsv(await response.text());
}

export function isVisibleProject(project) {
  return !/(hidden|archive-only)/i.test(project.status || "");
}

export function projectHref(project) {
  return project.project_slug === "photography-visual-storytelling"
    ? "work/photography-visual-storytelling/"
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
          ["work.html", "Work"], ["work/photography-visual-storytelling/", "Photography"],
          ["about.html", "About"], ["contact.html", "Contact"]
        ].map(([href, label]) => `<a href="${href}"${currentPath.endsWith(href) || (label === "Photography" && currentPath.endsWith("photography.html")) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
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
