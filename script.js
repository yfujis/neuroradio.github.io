(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");
  const archiveFilter = document.querySelector(".archive-filter");
  const selectedFilters = document.querySelector(".selected-filters");
  const archiveEpisodes = document.querySelectorAll(".archive-episode");
  const archiveList = document.querySelector(".archive-list");
  const archivePagination = document.querySelector("[data-client-pagination]");
  const tagSearchInput = document.querySelector("#tag-search-input");
  const tagSuggestions = document.querySelector("[data-tag-suggestions]");
  const archiveBasePath = window.location.pathname.includes("/episodes/")
    ? `${window.location.pathname.split("/episodes/")[0]}/episodes/`
    : "/episodes/";
  const pageSize = 10;

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

  function selectedValues(params, name) {
    return params.getAll(name).filter(Boolean);
  }

  function splitDataList(value) {
    return (value || "").split("|").filter(Boolean);
  }

  function hasEveryFilter(values, selected) {
    return selected.every(function (item) {
      return values.includes(item);
    });
  }

  function renderSelectedFilters(topics, performers) {
    if (!selectedFilters) return;

    selectedFilters.replaceChildren();

    function icon(type) {
      const wrapper = document.createElement("span");
      wrapper.className = "selected-filter-icon";
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.innerHTML = type === "performer"
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><path d="M12 19v3"></path></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5A5 5 0 1 0 8 11.5c.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>';
      return wrapper;
    }

    function chip(type, value, label) {
      const item = document.createElement("span");
      item.className = `selected-filter ${type}-filter`;
      item.setAttribute("aria-label", `${label}: ${value}`);
      item.append(icon(type), document.createTextNode(value));
      selectedFilters.append(item);
    }

    performers.forEach(function (performer) {
      chip("performer", performer, "出演者");
    });

    topics.forEach(function (topic) {
      chip("topic", topic, "Topic");
    });
  }

  function uniqueValues(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function archiveUrlFor(topics, performers) {
    const params = new URLSearchParams();
    uniqueValues(performers).forEach(function (performer) {
      params.append("performer", performer);
    });
    uniqueValues(topics).forEach(function (topic) {
      params.append("topic", topic);
    });
    const query = params.toString();
    return query ? `${archiveBasePath}?${query}` : archiveBasePath;
  }

  function applyArchiveTagLinks(topics, performers) {
    if (!archiveList) return;

    archiveList.querySelectorAll(".tags a[data-filter-type]").forEach(function (link) {
      const type = link.dataset.filterType;
      const value = link.textContent.trim();
      const nextPerformers = type === "performer" ? uniqueValues([...performers, value]) : performers;
      const nextTopics = type === "topic" ? uniqueValues([...topics, value]) : topics;

      link.href = archiveUrlFor(nextTopics, nextPerformers);
    });
  }

  if (archiveFilter && selectedFilters && archiveEpisodes.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const legacyTag = params.get("tag");
    const topics = uniqueValues(selectedValues(params, "topic"));
    const performers = uniqueValues(selectedValues(params, "performer"));

    if (legacyTag && topics.length === 0) {
      topics.push(legacyTag);
    }

    applyArchiveTagLinks(topics, performers);

    function candidateKey(candidate) {
      return `${candidate.type}:${candidate.value}`;
    }

    function allTagCandidates() {
      const candidates = [];
      archiveEpisodes.forEach(function (episode) {
        splitDataList(episode.dataset.performers).forEach(function (performer) {
          candidates.push({ type: "performer", value: performer });
        });
        splitDataList(episode.dataset.topics).forEach(function (topic) {
          candidates.push({ type: "topic", value: topic });
        });
      });
      const seen = new Set();
      return candidates
        .filter(function (candidate) {
          const key = candidateKey(candidate);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort(function (a, b) {
          if (a.type !== b.type) return a.type === "performer" ? -1 : 1;
          return a.value.localeCompare(b.value, "ja");
        });
    }

    function renderTagSuggestions() {
      if (!tagSearchInput || !tagSuggestions) return;

      const search = tagSearchInput.value.trim().toLowerCase();
      const selectedKeys = new Set([
        ...performers.map(function (performer) { return `performer:${performer}`; }),
        ...topics.map(function (topic) { return `topic:${topic}`; }),
      ]);
      const matches = allTagCandidates().filter(function (candidate) {
        if (selectedKeys.has(candidateKey(candidate))) return false;
        if (!search) return true;
        return candidate.value.toLowerCase().includes(search);
      });

      tagSuggestions.replaceChildren();
      matches.forEach(function (candidate) {
        const link = document.createElement("a");
        const nextPerformers = candidate.type === "performer" ? [...performers, candidate.value] : performers;
        const nextTopics = candidate.type === "topic" ? [...topics, candidate.value] : topics;
        link.className = `tag-suggestion ${candidate.type}-suggestion`;
        link.href = archiveUrlFor(nextTopics, nextPerformers);
        link.textContent = candidate.value;
        link.setAttribute("data-label", candidate.type === "performer" ? "出演者" : "Topic");
        tagSuggestions.append(link);
      });

      if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.className = "tag-suggestions-empty";
        empty.textContent = "一致するタグはありません";
        tagSuggestions.append(empty);
      }
    }

    if (tagSearchInput && tagSuggestions) {
      renderTagSuggestions();
      tagSearchInput.addEventListener("input", renderTagSuggestions);
    }

    function matchingEpisodes() {
      return Array.from(archiveEpisodes).filter(function (episode) {
        const episodeTopics = splitDataList(episode.dataset.topics);
        const episodePerformers = splitDataList(episode.dataset.performers);
        return hasEveryFilter(episodeTopics, topics) && hasEveryFilter(episodePerformers, performers);
      });
    }

    function pageUrl(pageNumber) {
      const next = new URLSearchParams(window.location.search);
      if (pageNumber <= 1) {
        next.delete("page");
      } else {
        next.set("page", String(pageNumber));
      }
      const query = next.toString();
      return query ? `${archiveBasePath}?${query}` : archiveBasePath;
    }

    function renderPagination(totalPages, currentPage) {
      if (!archivePagination) return;
      archivePagination.replaceChildren();
      if (totalPages <= 1) return;

      const numbers = document.createElement("div");
      numbers.className = "page-numbers";
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        if (pageNumber === currentPage) {
          const current = document.createElement("span");
          current.setAttribute("aria-current", "page");
          current.textContent = String(pageNumber);
          numbers.append(current);
        } else {
          const link = document.createElement("a");
          link.href = pageUrl(pageNumber);
          link.textContent = String(pageNumber);
          numbers.append(link);
        }
      }
      archivePagination.append(numbers);

      if (currentPage < totalPages) {
        const nextLink = document.createElement("a");
        nextLink.className = "next-page";
        nextLink.href = pageUrl(currentPage + 1);
        nextLink.textContent = "次へ";
        archivePagination.append(nextLink);
      }
    }

    const matches = matchingEpisodes();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    const requestedPage = Number(params.get("page") || "1");
    const currentPage = Math.min(Math.max(requestedPage || 1, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const visible = new Set(matches.slice(start, start + pageSize));

    archiveEpisodes.forEach(function (episode) {
      episode.hidden = !visible.has(episode);
    });
    renderPagination(totalPages, currentPage);

    if (topics.length > 0 || performers.length > 0) {
      renderSelectedFilters(topics, performers);
      archiveFilter.hidden = false;
      archiveFilter.setAttribute("data-count", String(matches.length));
    }
  }
})();
