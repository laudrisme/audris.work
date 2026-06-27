import { initArchiveIndex } from "./archive-index.js?v=20260627-small-fixes";
import { renderChrome } from "./shared.js?v=20260627-cv-label";

renderChrome();

initArchiveIndex(document.querySelector("[data-work-archive]"), {
  title: "audris-workbook.xls",
  preview: true
});
