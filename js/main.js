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
})();

function prepareSiteData(data) {
  const copy = JSON.parse(JSON.stringify(data));
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

  return {
    ...copy,
    allWorks: works,
    featuredWorks,
    worksLookup: Object.fromEntries(works.map((work) => [work.slug, work]))
  };
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
      return `<a class="${active}" href="${item.href}">${escapeHtml(item.label)}</a>`;
    })
    .join("");

  document.querySelector("[data-site-header]").innerHTML = `
    <div class="container site-header-inner">
      <a class="site-brand" href="index.html" aria-label="Back to homepage">
        <span class="site-brand-name">${escapeHtml(data.site.artistName)}</span>
        <span class="site-brand-role">${escapeHtml(data.site.role)}</span>
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

  document.querySelector("[data-site-footer]").innerHTML = `
    <div class="container site-footer-inner">
      <div class="footer-top">
        <div>
          <p class="page-label">Footer</p>
          <h2>${escapeHtml(data.site.artistName)}</h2>
          <p class="footer-note">${escapeHtml(data.site.footerNote)}</p>
        </div>
        <div class="footer-links">
          ${footerLinks.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
          <a href="${escapeHtml(data.site.instagramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
            data.site.instagramLabel
          )}</a>
          <a href="mailto:${escapeHtml(data.site.email)}">${escapeHtml(data.site.email)}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-meta">&copy; ${year} ${escapeHtml(data.site.artistName)}</p>
        <p class="footer-meta">Quiet gallery structure with artwork-led navigation.</p>
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
  }
}

function renderHomePage(data) {
  return `
    <section class="section">
      <div class="container hero-layout">
        <div class="hero-media">
          <img src="${escapeAttribute(data.hero.image)}" alt="${escapeAttribute(data.hero.alt)}" />
        </div>
        <div class="hero-copy">
          <p class="page-label">${escapeHtml(data.hero.label)}</p>
          <h1 class="page-title">${escapeHtml(data.hero.title)}</h1>
          <p class="hero-statement">${escapeHtml(data.hero.statement)}</p>
          <p class="hero-description">${escapeHtml(data.hero.description)}</p>
          <div class="button-row">
            <a class="button" href="${escapeAttribute(data.hero.primaryCtaHref)}">${escapeHtml(
              data.hero.primaryCtaLabel
            )}</a>
            <a class="button-secondary" href="${escapeAttribute(data.hero.secondaryCtaHref)}">${escapeHtml(
              data.hero.secondaryCtaLabel
            )}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">Selected Works</p>
        <h2 class="section-title">Featured paintings from the current body of work</h2>
        <p class="section-copy">
          The homepage stays intentionally short: four chosen works, a clear print path, and a commission route.
        </p>
        <div class="featured-grid">
          ${data.featuredWorks.map((work) => renderWorkCard(work, { compact: true })).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-banner">
        <div class="split-copy">
          <p class="section-label">${escapeHtml(data.prints.label)}</p>
          <h2 class="section-title">${escapeHtml(data.prints.title)}</h2>
          <p>${escapeHtml(data.prints.description)}</p>
          <p>${escapeHtml(data.prints.note)}</p>
          <div class="button-row">
            <a class="button" href="prints.html">Shop Prints</a>
          </div>
        </div>
        <div class="thumbnail-grid">
          ${data.featuredWorks.map((work) => renderThumbnailCard(work)).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">${escapeHtml(data.commissions.label)}</p>
        <h2 class="section-title">${escapeHtml(data.commissions.title)}</h2>
        <p class="section-copy">${escapeHtml(data.commissions.description)}</p>
        <div class="steps-grid">
          ${data.commissions.steps.map((step) => renderStepCard(step)).join("")}
        </div>
        <div class="button-row">
          <a class="button" href="commissions.html">Start a Conversation</a>
        </div>
      </div>
    </section>
  `;
}

function renderWorksPage(data) {
  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">Works</p>
        <h1 class="page-title">A category-led gallery with room for future expansion</h1>
        <p class="page-copy">
          Browse all works at once or filter by the four core categories. Each piece has its own detail page with
          image, medium, dimensions, year, and price.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="room-grid">
          ${data.categories.map((category) => renderRoomCard(category)).join("")}
        </div>
        <div class="filter-bar" aria-label="Filter works by category">
          <button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">All Works</button>
          ${data.categories
            .map(
              (category) => `
                <button class="filter-button" type="button" data-filter="${escapeAttribute(category.slug)}" aria-pressed="false">
                  ${escapeHtml(category.label)}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="works-grid is-filtering">
          ${data.allWorks.map((work) => renderWorkCard(work)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderArtworkPage(data) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "";
  const work = data.worksLookup[slug];

  if (!work) {
    document.title = `Artwork - ${data.site.artistName}`;
    return `
      <section class="page-hero">
        <div class="container empty-state">
          <p class="page-label">Artwork</p>
          <h1 class="page-title">That artwork could not be found</h1>
          <p>Please return to the gallery and choose a work from the available categories.</p>
          <div class="button-row">
            <a class="button" href="works.html">Browse Works</a>
          </div>
        </div>
      </section>
    `;
  }

  document.title = `${work.title} - ${data.site.artistName}`;

  const relatedWorks = data.allWorks
    .filter((item) => item.slug !== work.slug && item.category === work.category)
    .slice(0, 3);

  const inquiryBody = [
    `Artwork: ${work.title}`,
    `Category: ${work.categoryLabel}`,
    `Year: ${work.year}`,
    `Medium: ${work.medium}`,
    "",
    "I would like to enquire about this work."
  ];

  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(work.categoryLabel)}</p>
        <h1 class="detail-title">${escapeHtml(work.title)}</h1>
        <p class="page-copy">${escapeHtml(firstParagraph(work.description))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container detail-layout">
        <div>
          <div class="detail-media">
            <img src="${escapeAttribute(work.image)}" alt="${escapeAttribute(work.alt)}" />
          </div>
          <div class="detail-copy">
            ${work.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        </div>
        <aside class="detail-sidebar">
          <p class="detail-price">${escapeHtml(work.price || "Price on request")}</p>
          <div class="detail-meta">
            ${renderMetaRow("Category", work.categoryLabel)}
            ${renderMetaRow("Medium", work.medium)}
            ${renderMetaRow("Dimensions", work.dimensions)}
            ${renderMetaRow("Year", work.year)}
            ${renderMetaRow("Room", work.room)}
          </div>
          <div class="button-row">
            <a
              class="button"
              href="${escapeAttribute(createMailtoUrl(data.site.email, `Inquiry about ${work.title}`, inquiryBody))}"
            >
              Enquire About This Work
            </a>
            <a class="button-secondary" href="works.html">Back to Works</a>
          </div>
        </aside>
      </div>
    </section>

    ${
      relatedWorks.length
        ? `
          <section class="section">
            <div class="container">
              <p class="section-label">More in ${escapeHtml(work.categoryLabel)}</p>
              <h2 class="section-title">Related works</h2>
              <div class="related-grid">
                ${relatedWorks.map((item) => renderWorkCard(item, { compact: true })).join("")}
              </div>
            </div>
          </section>
        `
        : ""
    }
  `;
}

function renderPrintsPage(data) {
  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(data.prints.label)}</p>
        <h1 class="page-title">${escapeHtml(data.prints.title)}</h1>
        <p class="page-copy">${escapeHtml(data.prints.description)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container split-banner">
        <div class="split-copy">
          <p class="section-label">Ordering</p>
          <h2 class="section-title">Fixed sizes, restrained presentation, direct inquiry</h2>
          <p>${escapeHtml(data.prints.note)}</p>
          <div class="button-row">
            <a class="button" href="mailto:${escapeAttribute(data.site.email)}">Order by Email</a>
            <a class="button-secondary" href="contact.html">General Contact</a>
          </div>
        </div>
        <div class="size-grid">
          ${data.prints.sizes.map((size) => renderSizeCard(size)).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">Print Preview</p>
        <h2 class="section-title">Images currently highlighted in the print program</h2>
        <div class="thumbnail-grid">
          ${data.featuredWorks.map((work) => renderThumbnailCard(work)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCommissionsPage(data) {
  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(data.commissions.label)}</p>
        <h1 class="page-title">Commission a painting with a simple, transparent process</h1>
        <p class="page-copy">${escapeHtml(data.commissions.description)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="steps-grid">
          ${data.commissions.steps.map((step) => renderStepCard(step)).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container contact-layout">
        <div class="contact-panel">
          <p class="section-label">What to include</p>
          <h2 class="section-title">Helpful details for a first message</h2>
          <p>Share the subject, intended setting, budget range, preferred size, and any deadline you are working toward.</p>
          <p>The clearer the brief, the faster the proposal can be shaped.</p>
        </div>
        <form class="contact-panel form-grid" data-mailto-form="commission" data-mailto-subject="Commission inquiry">
          <div class="field">
            <label>
              <span>Name</span>
              <input type="text" name="name" data-label="Name" required />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Email</span>
              <input type="email" name="email" data-label="Email" required />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Budget</span>
              <input type="text" name="budget" data-label="Budget" placeholder="EUR 2,000 - 4,000" />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Preferred size</span>
              <input type="text" name="size" data-label="Preferred size" placeholder="100 x 140 cm" />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Timeline</span>
              <input type="text" name="timeline" data-label="Timeline" placeholder="Autumn 2026" />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Description</span>
              <textarea name="description" data-label="Project description" placeholder="Describe the subject, mood, references, or installation context."></textarea>
            </label>
          </div>
          <p class="form-note">Submitting opens your email app with the details filled in.</p>
          <button class="button" type="submit">Send Commission Inquiry</button>
        </form>
      </div>
    </section>
  `;
}

function renderAboutPage(data) {
  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(data.about.label)}</p>
        <h1 class="page-title">${escapeHtml(data.about.title)}</h1>
        <p class="page-copy">${escapeHtml(data.about.statement)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <div class="portrait-frame">
          <img src="${escapeAttribute(data.about.portraitImage)}" alt="${escapeAttribute(data.about.portraitAlt)}" loading="lazy" />
        </div>
        <div class="split-copy">
          <p class="section-label">Biography</p>
          <div class="stack-copy">
            ${data.about.biography.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
          <div class="button-row">
            <a class="button" href="works.html">View Works</a>
            <a class="button-secondary" href="contact.html">Contact</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContactPage(data) {
  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(data.contact.label)}</p>
        <h1 class="page-title">${escapeHtml(data.contact.title)}</h1>
        <p class="page-copy">${escapeHtml(data.contact.description)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-layout">
        <div class="contact-panel">
          <p class="section-label">Direct Contact</p>
          <h2 class="section-title">Email and social</h2>
          <p><strong>Email:</strong> <a href="mailto:${escapeAttribute(data.site.email)}">${escapeHtml(data.site.email)}</a></p>
          <p><strong>Instagram:</strong> <a href="${escapeAttribute(data.site.instagramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
            data.site.instagramLabel
          )}</a></p>
          <p><strong>Location:</strong> ${escapeHtml(data.contact.location)}</p>
        </div>
        <form class="contact-panel form-grid" data-mailto-form="contact" data-mailto-subject="General inquiry">
          <div class="field">
            <label>
              <span>Name</span>
              <input type="text" name="name" data-label="Name" required />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Email</span>
              <input type="email" name="email" data-label="Email" required />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Subject</span>
              <input type="text" name="subject" data-label="Subject" required />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Message</span>
              <textarea name="message" data-label="Message" placeholder="Share your question or request."></textarea>
            </label>
          </div>
          <p class="form-note">Submitting opens your email app with the details filled in.</p>
          <button class="button" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  `;
}

function renderWorkCard(work, options) {
  const settings = options || {};
  const description = settings.compact ? "" : `<p class="art-card-description">${escapeHtml(firstParagraph(work.description))}</p>`;

  return `
    <a class="art-card" href="artwork.html?slug=${encodeURIComponent(work.slug)}" data-category="${escapeAttribute(work.category)}">
      <div class="art-card-image">
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
        <p>${escapeHtml(work.price || "Price on request")}</p>
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
      <p>${escapeHtml(size.price)}</p>
    </article>
  `;
}

function renderRoomCard(category) {
  return `
    <article class="room-card">
      <p class="card-label">${escapeHtml(category.room)}</p>
      <h3>${escapeHtml(category.label)}</h3>
      <p class="room-meta">${escapeHtml(category.atmosphere)}</p>
      <p>Each work is assigned from day one, keeping the gallery ready for a future room-by-room tour.</p>
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
  const cards = Array.from(document.querySelectorAll(".works-grid .art-card"));

  if (!buttons.length || !cards.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter") || "all";

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        const matches = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !matches;
      });
    });
  });
}

function initMailtoForms(data) {
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
