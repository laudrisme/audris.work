import { initArchiveIndex } from "./archive-index.js?v=20260701-archive-preview-refresh";

initArchiveIndex(document.querySelector("[data-home-archive]"), {
  title: "audris-portfolio-index.xls"
});

const clock = document.querySelector("[data-desktop-clock]");
const formatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });
if (clock) clock.textContent = formatter.format(new Date());
