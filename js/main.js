const WORKS_MIX_STORAGE_KEY = "ivok-works-mix-index";
const WORKS_MIX_SETS = [
  ["portraits-08", "landscapes-01", "interior-murals-01", "portraits-09", "exterior-murals-01", "landscapes-02"],
  ["portraits-10", "landscapes-03", "faux-finishes-01", "portraits-11", "interior-murals-02", "exterior-murals-02"],
  ["landscapes-01", "portraits-08", "exterior-murals-01", "interior-murals-01", "portraits-10", "landscapes-02"]
];

function getSiteVariantKey() {
  const variant = (new URLSearchParams(window.location.search).get("v") || "current").toLowerCase();
  return variant === "p1" || variant === "p2" || variant === "current" ? variant : "current";
}

function getPreservedVariant() {
  const variant = (new URLSearchParams(window.location.search).get("v") || "").toLowerCase();
  return variant === "current" || variant === "p1" || variant === "p2" ? variant : "";
}

function siteHref(href) {
  const variant = getPreservedVariant();
  if (!variant || !href || /^(mailto:|tel:|https?:|\/\/|#)/i.test(href)) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(search);
  params.set("v", variant);
  return `${path}?${params.toString()}${hash}`;
}

function readWorksMixIndex() {
  try {
    const stored = Number.parseInt(sessionStorage.getItem(WORKS_MIX_STORAGE_KEY) || "", 10);
    if (Number.isFinite(stored) && stored >= 0) {
      return stored % WORKS_MIX_SETS.length;
    }
  } catch (error) {
    // Private mode or blocked storage should still show mix A.
  }

  return 0;
}

function takeWorksMixIndex() {
  const index = readWorksMixIndex();

  try {
    sessionStorage.setItem(WORKS_MIX_STORAGE_KEY, String((index + 1) % WORKS_MIX_SETS.length));
  } catch (error) {
    // Ignore persistence failures and keep the current mix for this page.
  }

  return index;
}

function resolveWorksBySlug(works, slugs) {
  const lookup = Object.fromEntries(works.map((work) => [work.slug, work]));
  return slugs.map((slug) => lookup[slug]).filter(Boolean);
}

function prepareSiteData(data) {
  const copy = JSON.parse(JSON.stringify(data));
  const key = getSiteVariantKey();
  const heroVariants = (copy.hero && copy.hero.variants) || {};
  const aboutVariants = (copy.about && copy.about.portraitVariants) || {};

  if (!copy.hero) {
    copy.hero = {};
  }

  copy.hero.image = heroVariants[key] || heroVariants.current || copy.hero.image;

  if (aboutVariants[key]) {
    copy.about.portraitImage = aboutVariants[key];
  }

  const categories = Array.isArray(copy.categories) ? copy.categories : [];
  const works = [];

  categories.forEach((category) => {
    const items = Array.isArray(copy.worksByCategory && copy.worksByCategory[category.slug])
      ? copy.worksByCategory[category.slug]
      : [];

    items.forEach((work, index) => {
      const title = work.title || `${category.label} Work ${index + 1}`;
      works.push({
        ...work,
        slug: work.slug || slugify(title),
        title,
        category: category.slug,
        categoryLabel: category.label,
        room: category.room,
        atmosphere: category.atmosphere,
        description: Array.isArray(work.description) ? work.description : toParagraphs(work.description)
      });
    });
  });

  const featuredWorks = works.filter((work) => work.featured).slice(0, 4);
  if (featuredWorks.length < 4) {
    works.forEach((work) => {
      if (featuredWorks.length >= 4) {
        return;
      }

      if (!featuredWorks.some((item) => item.slug === work.slug)) {
        featuredWorks.push(work);
      }
    });
  }

  const page = document.body && document.body.dataset ? document.body.dataset.page : "";
  const mixIndex = page === "home" || page === "works" ? takeWorksMixIndex() : readWorksMixIndex();
  const mixedWorks = resolveWorksBySlug(works, WORKS_MIX_SETS[mixIndex]);

  return {
    ...copy,
    allWorks: works,
    featuredWorks,
    mixedWorks,
    worksLookup: Object.fromEntries(works.map((work) => [work.slug, work]))
  };
}

function brandName(data) {
  return data.site.artistName;
}

function hasEmail(value) {
  return Boolean(value) && value.includes("@");
}

function hasPublicUrl(value) {
  return Boolean(value) && value !== "#";
}

function renderHeader(data, page) {
  const navItems = [
    { page: "works", href: "works.html", label: "Works" },
    { page: "prints", href: "prints.html", label: "Prints" },
    { page: "commissions", href: "commissions.html", label: "Commissions" },
    { page: "about", href: "about.html", label: "About" },
    { page: "contact", href: "contact.html", label: "Contact" }
  ];

  const navMarkup = navItems
    .map((item) => {
      const active = item.page === page ? "is-active" : "";
      return `<a class="${active}" href="${escapeAttribute(siteHref(item.href))}">${escapeHtml(item.label)}</a>`;
    })
    .join("");

  document.querySelector("[data-site-header]").innerHTML = `
    <div class="container site-header-inner">
      <a class="site-brand" href="${escapeAttribute(siteHref("index.html"))}" aria-label="Back to homepage">
        <span class="site-brand-name">${escapeHtml(brandName(data))}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${navMarkup}
      </nav>
    </div>
  `;
}

function renderFooter(data) {
  const year = new Date().getFullYear();
  const footerLinks = [
    { href: "works.html", label: "Works" },
    { href: "prints.html", label: "Prints" },
    { href: "about.html", label: "About" },
    { href: "commissions.html", label: "Commissions" },
    { href: "contact.html", label: "Contact" }
  ];

  const extraLinks = [];

  extraLinks.push(`<a class="is-quiet" href="${escapeAttribute(siteHref("update.html"))}">Studio update</a>`);

  if (hasPublicUrl(data.site.instagramUrl) && data.site.instagramLabel) {
    extraLinks.push(
      `<a href="${escapeAttribute(data.site.instagramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
        data.site.instagramLabel
      )}</a>`
    );
  }

  if (hasPublicUrl(data.site.linkedInUrl) && data.site.linkedInLabel) {
    extraLinks.push(
      `<a href="${escapeAttribute(data.site.linkedInUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
        data.site.linkedInLabel
      )}</a>`
    );
  }

  if (hasEmail(data.site.email)) {
    extraLinks.push(`<a href="mailto:${escapeAttribute(data.site.email)}">${escapeHtml(data.site.email)}</a>`);
  }

  document.querySelector("[data-site-footer]").innerHTML = `
    <div class="container site-footer-inner">
      <div class="footer-top">
        <div>
          <p class="page-label">Footer</p>
          <h2>${escapeHtml(data.site.artistName)}</h2>
          ${data.site.footerNote ? `<p class="footer-note">${escapeHtml(data.site.footerNote)}</p>` : ""}
        </div>
        <div class="footer-links">
          ${footerLinks.map((item) => `<a href="${escapeAttribute(siteHref(item.href))}">${escapeHtml(item.label)}</a>`).join("")}
          ${extraLinks.join("")}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-meta">&copy; ${year} ${escapeHtml(data.site.artistName)}</p>
      </div>
    </div>
  `;
}

function renderPage(data, page) {
  const root = document.querySelector("[data-page-root]");

  if (page === "home") {
    document.title = `${data.site.artistName} - ${data.site.role}`;
    root.innerHTML = renderHomePage(data);
    return;
  }

  if (page === "works") {
    document.title = `Works - ${data.site.artistName}`;
    root.innerHTML = renderWorksPage(data);
    return;
  }

  if (page === "artwork") {
    root.innerHTML = renderArtworkPage(data);
    return;
  }

  if (page === "prints") {
    document.title = `Prints - ${data.site.artistName}`;
    root.innerHTML = renderPrintsPage(data);
    return;
  }

  if (page === "commissions") {
    document.title = `Commissions - ${data.site.artistName}`;
    root.innerHTML = renderCommissionsPage(data);
    return;
  }

  if (page === "about") {
    document.title = `About - ${data.site.artistName}`;
    root.innerHTML = renderAboutPage(data);
    return;
  }

  if (page === "contact") {
    document.title = `Contact - ${data.site.artistName}`;
    root.innerHTML = renderContactPage(data);
    return;
  }

  if (page === "update") {
    document.title = `Studio update - ${data.site.artistName}`;
    root.innerHTML = renderUpdatePage(data);
  }
}

function renderEmptyState(label, title) {
  return `
    <div class="empty-state">
      <p class="page-label">${escapeHtml(label)}</p>
      <h2 class="section-title">${escapeHtml(title)}</h2>
    </div>
  `;
}

function renderWorkCard(work, options) {
  const settings = options || {};
  const description = settings.compact ? "" : `<p class="art-card-description">${escapeHtml(firstParagraph(work.description))}</p>`;

  return `
    <a class="art-card" href="${escapeAttribute(siteHref("artwork.html?slug=" + encodeURIComponent(work.slug)))}" data-category="${escapeAttribute(work.category)}" data-slug="${escapeAttribute(work.slug)}">
      <div class="art-card-image${work.imageFit === "contain" ? " is-contain" : ""}">
        <img src="${escapeAttribute(work.image)}" alt="${escapeAttribute(work.alt)}" loading="lazy" />
      </div>
      <div class="art-card-body">
        <p class="card-label">${escapeHtml(work.categoryLabel)}</p>
        <h3>${escapeHtml(work.title)}</h3>
        <p class="work-meta">${escapeHtml(formatWorkLine(work))}</p>
        ${description}
      </div>
    </a>
  `;
}

function renderThumbnailCard(work) {
  return `
    <article class="thumb-card">
      <img src="${escapeAttribute(work.image)}" alt="${escapeAttribute(work.alt)}" loading="lazy" />
      <div class="thumb-card-body">
        <h3>${escapeHtml(work.title)}</h3>
        ${work.price ? `<p>${escapeHtml(work.price)}</p>` : ""}
      </div>
    </article>
  `;
}

function renderStepCard(step) {
  return `
    <article class="step-card">
      <p class="card-label">${escapeHtml(step.title)}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.text)}</p>
    </article>
  `;
}

function renderSizeCard(size) {
  return `
    <article class="size-card">
      <p class="card-label">${escapeHtml(size.name)}</p>
      <h3>${escapeHtml(size.dimensions)}</h3>
      ${size.price ? `<p>${escapeHtml(size.price)}</p>` : `<p>Contact for details</p>`}
    </article>
  `;
}

function renderRoomCard(category) {
  return `
    <article class="room-card">
      <h3>${escapeHtml(category.label)}</h3>
    </article>
  `;
}

function renderMetaRow(label, value) {
  if (!value) {
    return "";
  }

  return `
    <div class="meta-row">
      <p class="meta-label">${escapeHtml(label)}</p>
      <p>${escapeHtml(value)}</p>
    </div>
  `;
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initWorksFilter() {
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const mixGrid = document.querySelector("[data-works-mix]");
  const catalogGrid = document.querySelector("[data-works-catalog]");
  const catalogCards = catalogGrid
    ? Array.from(catalogGrid.querySelectorAll(".art-card"))
    : Array.from(document.querySelectorAll(".works-grid .art-card"));

  if (!buttons.length) {
    return;
  }

  function applyFilter(filter) {
    buttons.forEach((item) => {
      const active = (item.getAttribute("data-filter") || "all") === filter;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    if (mixGrid && catalogGrid) {
      const showMix = filter === "all";
      mixGrid.hidden = !showMix;
      catalogGrid.hidden = showMix;

      if (!showMix) {
        catalogCards.forEach((card) => {
          card.hidden = card.getAttribute("data-category") !== filter;
        });
      }

      return;
    }

    catalogCards.forEach((card) => {
      const matches = filter === "all" || card.getAttribute("data-category") === filter;
      card.hidden = !matches;
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      applyFilter(button.getAttribute("data-filter") || "all");
    });
  });

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  if (category && buttons.some((item) => item.getAttribute("data-filter") === category)) {
    applyFilter(category);
  }
}

function initMailtoForms(data) {
  if (!hasEmail(data.site.email)) {
    return;
  }

  const forms = Array.from(document.querySelectorAll("[data-mailto-form]"));

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const subject = form.getAttribute("data-mailto-subject") || "Website inquiry";
      const lines = [];

      for (const pair of formData.entries()) {
        const name = pair[0];
        const value = String(pair[1]).trim();

        if (!value) {
          continue;
        }

        const field = form.elements.namedItem(name);
        const label = field && field.dataset && field.dataset.label ? field.dataset.label : name;

        if (field && field.tagName === "TEXTAREA") {
          lines.push(`${label}:`);
          lines.push(value);
        } else {
          lines.push(`${label}: ${value}`);
        }

        lines.push("");
      }

      window.location.href = createMailtoUrl(data.site.email, subject, lines);
    });
  });
}

function initUpdateForm() {
  const form = document.querySelector("[data-update-form]");
  const thanks = document.querySelector("[data-update-thanks]");

  if (!form) {
    return;
  }

  const nextField = form.querySelector('[name="_next"]');
  if (nextField) {
    nextField.value = new URL(siteHref("update.html?sent=1"), window.location.href).href;
  }

  initAttachmentPreview(form);

  form.addEventListener("submit", function () {
    const subjectField = form.querySelector('[name="_subject"]');
    if (!subjectField) {
      return;
    }

    const categoryField = form.elements.namedItem("artwork_category");
    const sectionField = form.elements.namedItem("section");
    const category = categoryField && String(categoryField.value || "").trim();
    const section = sectionField && String(sectionField.value || "").trim();

    if (category) {
      subjectField.value = "IvoK " + category;
    } else if (section) {
      subjectField.value = "IvoK " + section;
    } else {
      subjectField.value = "IvoK studio update";
    }
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1" && thanks) {
    form.hidden = true;
    thanks.hidden = false;
  }
}

function initAttachmentPreview(form) {
  const input = form.querySelector('input[name="attachment"]');
  const preview = form.querySelector("[data-attachment-preview]");

  if (!input || !preview) {
    return;
  }

  const objectUrls = [];

  function revokePreviewUrls() {
    objectUrls.splice(0).forEach(function (url) {
      URL.revokeObjectURL(url);
    });
  }

  function selectedFiles() {
    return Array.from(input.files || []);
  }

  function assignFiles(files) {
    const transfer = new DataTransfer();
    files.forEach(function (file) {
      transfer.items.add(file);
    });
    input.files = transfer.files;
  }

  function showNameFallback(frame, fileName) {
    frame.textContent = "";
    const fallback = document.createElement("span");
    fallback.className = "attachment-preview-fallback";
    fallback.textContent = fileName;
    frame.appendChild(fallback);
  }

  function renderPreview() {
    revokePreviewUrls();
    preview.textContent = "";

    const files = selectedFiles();
    preview.hidden = files.length === 0;

    files.forEach(function (file, index) {
      const item = document.createElement("li");
      item.className = "attachment-preview-item";

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "attachment-preview-remove";
      remove.setAttribute("data-remove-index", String(index));
      remove.setAttribute("aria-label", "Remove " + file.name);
      remove.textContent = "X";

      const frame = document.createElement("div");
      frame.className = "attachment-preview-frame";

      const caption = document.createElement("p");
      caption.className = "attachment-preview-name";
      caption.textContent = file.name;

      const url = URL.createObjectURL(file);
      objectUrls.push(url);

      const image = document.createElement("img");
      image.src = url;
      image.alt = file.name;
      image.loading = "lazy";
      image.addEventListener("error", function () {
        showNameFallback(frame, file.name);
      });
      frame.appendChild(image);

      item.appendChild(remove);
      item.appendChild(frame);
      item.appendChild(caption);
      preview.appendChild(item);
    });
  }

  input.addEventListener("change", renderPreview);

  preview.addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove-index]");
    if (!button || !preview.contains(button)) {
      return;
    }

    const index = Number(button.getAttribute("data-remove-index"));
    if (Number.isNaN(index)) {
      return;
    }

    assignFiles(selectedFiles().filter(function (_file, fileIndex) {
      return fileIndex !== index;
    }));
    renderPreview();
  });
}

function createMailtoUrl(email, subject, lines) {
  const body = Array.isArray(lines) ? lines.join("\n").trim() : "";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formatWorkLine(work) {
  return [work.medium, work.year, work.price].filter(Boolean).join(" / ");
}

function firstParagraph(description) {
  return Array.isArray(description) && description.length ? description[0] : "";
}

function toParagraphs(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

(function () {
  const rawData = window.SITE_DATA;
  const header = document.querySelector("[data-site-header]");
  const root = document.querySelector("[data-page-root]");
  const footer = document.querySelector("[data-site-footer]");

  if (!rawData || !header || !root || !footer) {
    return;
  }

  const page = document.body.dataset.page || "home";
  const siteData = prepareSiteData(rawData);

  renderHeader(siteData, page);
  renderFooter(siteData);
  renderPage(siteData, page);
  initNavigation();
  initWorksFilter();
  initMailtoForms(siteData);
  initUpdateForm();
})();
