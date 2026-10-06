// Shared safety net: the `hidden` attribute must win over button styling
// in every template so collapsed extra tags stay hidden until expanded.
export const FILTER_SHOW_MORE_CSS = `
  .pf-filter-btn[hidden] { display: none !important; }
`;

// Client-side tag filter: the only interactive JS in the artifact besides the
// lazy loader. Clicking a tag toggles it; items matching ALL selected tags are
// shown (empty selection = show everything).
// Also handles the "Show more tags" toggle (data-show-more): reveals extra
// filter buttons hidden with data-tag-extra + hidden, so the static artifact
// matches the React LivePreview without-duplicating state.
export const FILTER_SCRIPT = `
(function () {
  var selected = {};
  var buttons = document.querySelectorAll("[data-tag]");
  var cards = document.querySelectorAll("[data-tags]");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var tag = button.getAttribute("data-tag");
      if (selected[tag]) {
        delete selected[tag];
        button.classList.remove("active");
      } else {
        selected[tag] = true;
        button.classList.add("active");
      }
      var keys = Object.keys(selected);
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(",");
        var match = keys.length === 0 || keys.every(function (k) {
          return tags.indexOf(k) !== -1;
        });
        card.style.display = match ? "" : "none";
      });
    });
  });
  var moreBtns = document.querySelectorAll("[data-show-more]");
  moreBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.closest(".pf-filter");
      if (!filter) return;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      btn.setAttribute("aria-expanded", next ? "true" : "false");
      var extra = filter.querySelectorAll("[data-tag-extra]");
      extra.forEach(function (el) {
        if (next) {
          el.removeAttribute("hidden");
        } else {
          el.setAttribute("hidden", "");
        }
      });
      var collapsedLabel = btn.getAttribute("data-collapsed-label") || "Show more";
      btn.textContent = next ? "Show less" : collapsedLabel;
    });
  });
})();
`;
