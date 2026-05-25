(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");
  const topicFilters = document.querySelectorAll(".topic-filter");
  const episodeCards = document.querySelectorAll(".episode-card");

  function closeNavigation() {
    if (!navToggle || !navLinks) {
      return;
    }

    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNavigation);
    });
  }

  function setActiveFilter(activeButton) {
    topicFilters.forEach(function (button) {
      button.classList.toggle("active", button === activeButton);
    });
  }

  function filterEpisodes(filter) {
    episodeCards.forEach(function (card) {
      const topics = (card.dataset.topics || "").split(/\s+/).filter(Boolean);
      const shouldShow = filter === "all" || topics.includes(filter);
      card.hidden = !shouldShow;
    });
  }

  topicFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter || "all";
      setActiveFilter(button);
      filterEpisodes(filter);
    });
  });
})();
