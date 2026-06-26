import { initArchiveIndex } from "./archive-index.js?v=20260626-previews";
import { renderChrome } from "./shared.js";

renderChrome();

initArchiveIndex(document.querySelector("[data-work-archive]"), {
  title: "audris-workbook.xls",
  preview: true
});
