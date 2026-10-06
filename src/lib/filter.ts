// Client-side tag filter: the only interactive JS in the artifact besides the
// lazy loader. Clicking a tag toggles it; items matching ALL selected tags are
// shown (empty selection = show everything).
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
  // "View more" toggle for collapsed tag pills. Extra pills render with
  // [data-collapsed] + hidden; the toggle unhides them (and back).
  document.querySelectorAll("[data-filter-more]").forEach(function (more) {
    more.addEventListener("click", function () {
      var filter = more.closest(".pf-filter");
      if (!filter) return;
      var extras = filter.querySelectorAll("[data-collapsed]");
      var collapsed = false;
      extras.forEach(function (el) {
        if (el.hasAttribute("hidden")) collapsed = true;
      });
      extras.forEach(function (el) {
        if (collapsed) {
          el.removeAttribute("hidden");
        } else {
          el.setAttribute("hidden", "");
        }
      });
      var total = more.getAttribute("data-collapsed-count") || extras.length;
      more.textContent = collapsed ? "Show less" : "View more (+" + total + ")";
    });
  });
})();
`;
