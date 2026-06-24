import { initArchiveIndex } from "./archive-index.js";
import { renderChrome } from "./shared.js";

renderChrome();

initArchiveIndex(document.querySelector("[data-work-archive]"), {
  title: "audris-workbook.xls",
  preview: true
});
