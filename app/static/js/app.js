(function () {
  if (typeof io === "undefined") return;
  var s = io({ transports: ["websocket", "polling"] });
  s.on("connect", function () {
    console.info("[uci] realtime connected");
  });
  s.on("tvk_news", function (payload) {
    if (payload && payload.title) {
      var bar = document.getElementById("live-toast");
      if (!bar) return;
      bar.textContent = "TVK update: " + payload.title;
      bar.classList.remove("hidden");
      setTimeout(function () {
        bar.classList.add("hidden");
      }, 8000);
    }
  });
})();
