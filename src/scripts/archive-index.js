import { workFilters, workEntryHref, workIndex } from "../data/work-index.js?v=20260627-zine";
import { escapeHtml } from "./shared.js";

function matchesFilter(entry, filter) {
  if (filter === "All") return true;
  const haystack = [entry.title, entry.type, entry.category, entry.subcategory, entry.year, ...entry.keywords]
    .join(" ")
    .toLowerCase();
  return haystack.includes(filter.toLowerCase());
}

function matchesSearch(entry, query) {
  if (!query) return true;
  const haystack = [entry.title, entry.type, entry.category, entry.subcategory, entry.year, ...entry.keywords]
    .join(" ")
    .toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every(term => haystack.includes(term));
}

function rowMarkup(entry) {
  return `<a class="archive-row" href="${workEntryHref(entry)}" data-entry-id="${entry.id}" data-image="${escapeHtml(entry.image || "")}">
    <span class="archive-cell archive-cell--work"><i aria-hidden="true"></i>${escapeHtml(entry.title)}</span>
    <span class="archive-cell" data-label="Category">${escapeHtml(entry.category)}</span>
    <span class="archive-cell" data-label="Subcategory">${escapeHtml(entry.subcategory)}</span>
    <span class="archive-cell archive-cell--year" data-label="Year">${escapeHtml(entry.year)}</span>
  </a>`;
}

export function initArchiveIndex(root, options = {}) {
  if (!root) return;
  const state = { filter: "All", query: "" };
  const title = options.title || "audris-portfolio-index.xls";
  root.innerHTML = `
    <section class="archive-window${options.preview ? " archive-window--with-preview" : ""}" aria-label="Browsable work archive">
      <header class="archive-titlebar">
        <span class="archive-window-controls" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>${escapeHtml(title)}</span>
        <span class="archive-count" data-archive-count></span>
      </header>
      <div class="archive-toolbar">
        <label class="archive-search">
          <span class="visually-hidden">Search work</span>
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search the archive…" autocomplete="off" data-archive-search>
        </label>
        <div class="archive-filters" aria-label="Filter work" data-archive-filters>
          ${workFilters.map(filter => `<button type="button" data-filter="${filter}" aria-pressed="${filter === "All"}">${filter}</button>`).join("")}
        </div>
      </div>
      <div class="archive-browser">
        <div class="archive-table" role="table" aria-label="Work index">
          <div class="archive-head" role="row">
            <span role="columnheader">Work</span><span role="columnheader">Category</span><span role="columnheader">Subcategory</span><span role="columnheader">Year</span>
          </div>
          <div class="archive-body" data-archive-rows></div>
        </div>
        ${options.preview ? `<aside class="archive-preview" aria-live="polite" data-archive-preview>
          <img src="${workIndex[0].image}" alt="" data-archive-preview-image>
          <div><span data-archive-preview-type>${workIndex[0].category}</span><p data-archive-preview-title>${workIndex[0].title}</p></div>
        </aside>` : ""}
      </div>
      <p class="archive-empty" hidden data-archive-empty>No matching work. Try a broader word or another filter.</p>
    </section>`;

  const rows = root.querySelector("[data-archive-rows]");
  const count = root.querySelector("[data-archive-count]");
  const empty = root.querySelector("[data-archive-empty]");
  const search = root.querySelector("[data-archive-search]");
  const filters = [...root.querySelectorAll("[data-filter]")];
  const previewImage = root.querySelector("[data-archive-preview-image]");
  const previewTitle = root.querySelector("[data-archive-preview-title]");
  const previewType = root.querySelector("[data-archive-preview-type]");

  function setPreview(entry) {
    if (!previewImage || !entry?.image) return;
    previewImage.src = entry.image;
    previewImage.alt = `Preview of ${entry.title}`;
    previewTitle.textContent = entry.title;
    previewType.textContent = `${entry.category} · ${entry.year}`;
  }

  function bindPreview() {
    root.querySelectorAll(".archive-row").forEach(row => {
      const entry = workIndex.find(item => item.id === row.dataset.entryId);
      row.addEventListener("mouseenter", () => setPreview(entry));
      row.addEventListener("focus", () => setPreview(entry));
    });
  }

  function render() {
    const visible = workIndex.filter(entry => matchesFilter(entry, state.filter) && matchesSearch(entry, state.query));
    rows.innerHTML = visible.map(rowMarkup).join("");
    count.textContent = `${visible.length} of ${workIndex.length}`;
    empty.hidden = visible.length > 0;
    rows.hidden = visible.length === 0;
    bindPreview();
    if (visible[0]) setPreview(visible[0]);
  }

  search.addEventListener("input", event => {
    state.query = event.target.value;
    render();
  });

  filters.forEach(button => button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    render();
  }));

  render();
}
