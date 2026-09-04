// The only JavaScript in the shipped artifact: loads videos just before they
// enter the viewport, so the page stays near-instant.
export const LAZY_MEDIA_SCRIPT = `
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var video = entry.target;
      var src = video.getAttribute("data-src");
      if (src) {
        video.setAttribute("src", src);
        video.removeAttribute("data-src");
        video.load();
      }
      io.unobserve(video);
    });
  }, { rootMargin: "200px" });
  document.querySelectorAll("video[data-src]").forEach(function (video) {
    io.observe(video);
  });
})();
`;
