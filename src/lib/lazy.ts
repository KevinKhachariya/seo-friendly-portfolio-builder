// Click-to-play facade: the video URL lives only in data-src on .pf-video.
// Nothing (not even <video>) loads upfront — just the poster <img> plus a
// play button. On click the facade is swapped for a real autoplaying <video>.
export const LAZY_MEDIA_SCRIPT = `
(function () {
  document.querySelectorAll(".pf-video[data-src]").forEach(function (facade) {
    facade.addEventListener("click", function () {
      var src = facade.getAttribute("data-src");
      if (!src) return;
      var img = facade.querySelector("img");
      var poster = img ? img.getAttribute("src") : null;
      var title = facade.getAttribute("data-title") || "";
      var video = document.createElement("video");
      video.className = "pf-media";
      video.setAttribute("controls", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "metadata");
      video.setAttribute("autoplay", "");
      if (poster) video.setAttribute("poster", poster);
      if (title) video.setAttribute("title", title);
      video.setAttribute("src", src);
      facade.replaceWith(video);
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
  });
})();
`;
