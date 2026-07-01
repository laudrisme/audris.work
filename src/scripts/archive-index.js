import { workFilters, workEntryHref, workIndex } from "../data/work-index.js?v=20260628-multitag-filters";
import { escapeHtml } from "./shared.js";

const archivePreviewEntries = new Map(workIndex.map(entry => [entry.id, entry]));
const preloadedArchiveImages = new Set();
const archivePreviewImageCache = [];

function getArchivePreviewImage(entry) {
  return entry?.previewImage || entry?.image || "";
}

function matchesFilter(entry, filter) {
  if (filter === "All") return true;
  const filterTags = entry.filterTags || [entry.category];
  return filterTags.some(tag => tag.toLowerCase() === filter.toLowerCase());
}

function matchesSearch(entry, query) {
  if (!query) return true;
  const haystack = [
    entry.title,
    entry.type,
    entry.category,
    entry.subcategory,
    entry.year,
    ...(entry.filterTags || []),
    ...entry.keywords
  ]
    .join(" ")
    .toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every(term => haystack.includes(term));
}

function rowMarkup(entry) {
  return `<a class="archive-row" href="${workEntryHref(entry)}" data-entry-id="${entry.id}" data-image="${escapeHtml(getArchivePreviewImage(entry))}">
    <span class="archive-cell archive-cell--work"><i aria-hidden="true"></i>${escapeHtml(entry.title)}</span>
    <span class="archive-cell" data-label="Category">${escapeHtml(entry.category)}</span>
    <span class="archive-cell" data-label="Subcategory">${escapeHtml(entry.subcategory)}</span>
    <span class="archive-cell archive-cell--year" data-label="Year">${escapeHtml(entry.year)}</span>
  </a>`;
}

function scheduleArchiveIdle(task) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task, { timeout: 1200 });
    return;
  }
  window.setTimeout(() => task(), 180);
}

function warmArchiveImage(src) {
  if (!src || preloadedArchiveImages.has(src)) return;
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  preloadedArchiveImages.add(src);
  archivePreviewImageCache.push(image);
}

function preloadArchivePreviewImages(entries) {
  const queue = [...new Set(entries.map(entry => getArchivePreviewImage(entry)).filter(Boolean))];
  let nextIndex = 0;

  function step(deadline) {
    while (nextIndex < queue.length) {
      warmArchiveImage(queue[nextIndex]);
      nextIndex += 1;
      if (!deadline || typeof deadline.timeRemaining !== "function" || deadline.timeRemaining() < 5) break;
    }

    if (nextIndex < queue.length) scheduleArchiveIdle(step);
  }

  if (queue.length) scheduleArchiveIdle(step);
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
          <img src="${getArchivePreviewImage(workIndex[0])}" alt="" decoding="async" data-archive-preview-image>
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
  let activePreviewId = "";

  function markActiveRow(entryId) {
    rows.querySelectorAll(".archive-row").forEach(row => {
      const isActive = row.dataset.entryId === entryId;
      row.toggleAttribute("data-preview-active", isActive);
    });
  }

  function setPreview(entry) {
    const previewSrc = getArchivePreviewImage(entry);
    if (!previewImage || !previewSrc) return;
    markActiveRow(entry.id);
    if (activePreviewId === entry.id && previewImage.getAttribute("src") === previewSrc) return;
    previewImage.src = previewSrc;
    previewImage.alt = `Preview of ${entry.title}`;
    previewTitle.textContent = entry.title;
    previewType.textContent = `${entry.category} · ${entry.year}`;
    activePreviewId = entry.id;
  }

  function previewEntryFromTarget(target) {
    if (!(target instanceof Element)) return null;
    const row = target.closest(".archive-row");
    if (!row) return null;
    return archivePreviewEntries.get(row.dataset.entryId) || null;
  }

  if (rows && previewImage) {
    const syncPreviewFromEvent = event => {
      const entry = previewEntryFromTarget(event.target);
      if (entry) setPreview(entry);
    };

    rows.addEventListener("pointerover", syncPreviewFromEvent);
    rows.addEventListener("mouseover", syncPreviewFromEvent);
    rows.addEventListener("focusin", syncPreviewFromEvent);
    rows.addEventListener("pointerdown", syncPreviewFromEvent);
    rows.addEventListener("click", syncPreviewFromEvent);

    preloadArchivePreviewImages(workIndex);
  }

  function render() {
    const visible = workIndex.filter(entry => matchesFilter(entry, state.filter) && matchesSearch(entry, state.query));
    rows.innerHTML = visible.map(rowMarkup).join("");
    count.textContent = `${visible.length} of ${workIndex.length}`;
    empty.hidden = visible.length > 0;
    rows.hidden = visible.length === 0;
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
