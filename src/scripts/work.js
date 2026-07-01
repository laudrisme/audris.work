import { initArchiveIndex } from "./archive-index.js?v=20260701-archive-preview-refresh";
import { renderChrome } from "./shared.js?v=20260630-publish-cleanup";

renderChrome();

initArchiveIndex(document.querySelector("[data-work-archive]"), {
  title: "audris-workbook.xls",
  preview: true
});
