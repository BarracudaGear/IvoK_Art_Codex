function renderHomePage(data) {
  const featuredMarkup = data.featuredWorks.length
    ? `<div class="featured-grid">${data.featuredWorks.map((work) => renderWorkCard(work, { compact: true })).join("")}</div>`
    : renderEmptyState("Works", "Works will appear here.");

  const printThumbs = data.featuredWorks.length
    ? `<div class="thumbnail-grid">${data.featuredWorks.map((work) => renderThumbnailCard(work)).join("")}</div>`
    : "";

  const commissionSteps = data.commissions.steps && data.commissions.steps.length
    ? `<div class="steps-grid">${data.commissions.steps.map((step) => renderStepCard(step)).join("")}</div>`
    : "";

  return `
    <section class="section">
      <div class="container hero-layout">
        <div class="hero-media">
          <img src="${escapeAttribute(data.hero.image)}" alt="${escapeAttribute(data.hero.alt)}" />
        </div>
        <div class="hero-copy">
          <p class="page-label">${escapeHtml(data.hero.label)}</p>
          <h1 class="page-title">${escapeHtml(data.hero.title)}</h1>
          ${data.hero.statement ? `<p class="hero-statement">${escapeHtml(data.hero.statement)}</p>` : ""}
          ${data.hero.description ? `<p class="hero-description">${escapeHtml(data.hero.description)}</p>` : ""}
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
        <p class="section-label">Education and career</p>
        <h2 class="section-title">Education and career</h2>
        <div class="stack-copy">
          ${(data.about.biography || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="button-row">
          <a class="button-secondary" href="about.html">About</a>
        </div>
      </div>
    </section>

    ${renderAboutExtraSections(data)}

    <section class="section">
      <div class="container">
        <h2 class="section-title">Works</h2>
        <nav class="category-nav" aria-label="Categories">
          ${data.categories
            .map(
              (category) => `
                <a href="works.html?category=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>
              `
            )
            .join("")}
        </nav>
        ${featuredMarkup}
        <div class="button-row">
          <a class="button" href="works.html">View Works</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-banner">
        <div class="split-copy">
          <p class="section-label">${escapeHtml(data.prints.label)}</p>
          <h2 class="section-title">${escapeHtml(data.prints.title)}</h2>
          <p>${escapeHtml(data.prints.description)}</p>
          ${data.prints.note ? `<p>${escapeHtml(data.prints.note)}</p>` : ""}
          <div class="button-row">
            <a class="button" href="prints.html">View Prints</a>
          </div>
        </div>
        ${printThumbs}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="section-label">${escapeHtml(data.commissions.label)}</p>
        <h2 class="section-title">${escapeHtml(data.commissions.title)}</h2>
        <p class="section-copy">${escapeHtml(data.commissions.description)}</p>
        ${commissionSteps}
        <div class="button-row">
          <a class="button" href="commissions.html">Commissions</a>
        </div>
      </div>
    </section>
  `;
}

function renderWorksPage(data) {
  const worksMarkup = data.allWorks.length
    ? data.allWorks.map((work) => renderWorkCard(work)).join("")
    : renderEmptyState("Works", "Works will appear here.");

  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">Works</p>
        <h1 class="page-title">Works</h1>
        <p class="page-copy">Browse by category.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
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
          ${worksMarkup}
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

  const inquiryButton = hasEmail(data.site.email)
    ? `<a
              class="button"
              href="${escapeAttribute(
                createMailtoUrl(
                  data.site.email,
                  `Inquiry about ${work.title}`,
                  [
                    `Artwork: ${work.title}`,
                    `Category: ${work.categoryLabel}`,
                    `Year: ${work.year}`,
                    `Medium: ${work.medium}`,
                    "",
                    "I would like to enquire about this work."
                  ]
                )
              )}"
            >
              Enquire About This Work
            </a>`
    : `<a class="button" href="contact.html">Contact for details</a>`;

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
          <div class="detail-media${work.imageFit === "contain" ? " is-contain" : ""}">
            <img src="${escapeAttribute(work.image)}" alt="${escapeAttribute(work.alt)}" />
          </div>
          <div class="detail-copy">
            ${work.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        </div>
        <aside class="detail-sidebar">
          ${work.price ? `<p class="detail-price">${escapeHtml(work.price)}</p>` : `<p class="detail-price">Contact for details</p>`}
          <div class="detail-meta">
            ${renderMetaRow("Category", work.categoryLabel)}
            ${renderMetaRow("Medium", work.medium)}
            ${renderMetaRow("Dimensions", work.dimensions)}
            ${renderMetaRow("Year", work.year)}
            ${renderMetaRow("Room", work.room)}
          </div>
          <div class="button-row">
            ${inquiryButton}
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
  const sizesMarkup = data.prints.sizes && data.prints.sizes.length
    ? `<div class="size-grid">${data.prints.sizes.map((size) => renderSizeCard(size)).join("")}</div>`
    : renderEmptyState("Prints", "Contact for details.");

  const previewMarkup = data.featuredWorks.length
    ? `<div class="thumbnail-grid">${data.featuredWorks.map((work) => renderThumbnailCard(work)).join("")}</div>`
    : "";

  const emailButton = hasEmail(data.site.email)
    ? `<a class="button" href="mailto:${escapeAttribute(data.site.email)}">Order by Email</a>`
    : "";

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
          <h2 class="section-title">Prints</h2>
          <p>${escapeHtml(data.prints.note || "Contact for details.")}</p>
          <div class="button-row">
            ${emailButton}
            <a class="button-secondary" href="contact.html">Contact</a>
          </div>
        </div>
        ${sizesMarkup}
      </div>
    </section>

    ${
      previewMarkup
        ? `
          <section class="section">
            <div class="container">
              <p class="section-label">Print Preview</p>
              <h2 class="section-title">Selected images</h2>
              ${previewMarkup}
            </div>
          </section>
        `
        : ""
    }
  `;
}

function renderCommissionsPage(data) {
  const stepsMarkup = data.commissions.steps && data.commissions.steps.length
    ? `<div class="steps-grid">${data.commissions.steps.map((step) => renderStepCard(step)).join("")}</div>`
    : "";

  const formMarkup = hasEmail(data.site.email)
    ? `
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
              <span>Size</span>
              <input type="text" name="size" data-label="Preferred size" />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Timeline</span>
              <input type="text" name="timeline" data-label="Timeline" />
            </label>
          </div>
          <div class="field">
            <label>
              <span>Description</span>
              <textarea name="description" data-label="Project description"></textarea>
            </label>
          </div>
          <p class="form-note">Submitting opens your email app with the details filled in.</p>
          <button class="button" type="submit">Send Commission Inquiry</button>
        </form>
      `
    : "";

  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">${escapeHtml(data.commissions.label)}</p>
        <h1 class="page-title">Commissions</h1>
        <p class="page-copy">${escapeHtml(data.commissions.description)}</p>
      </div>
    </section>

    ${data.commissions.images && data.commissions.images.length ? `
    <section class="section">
      <div class="container">
        <div class="thumbnail-grid">
          ${data.commissions.images.map((item) => `
            <article class="thumb-card">
              <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.alt)}" loading="lazy" />
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    ` : ""}

    ${
      stepsMarkup
        ? `
          <section class="section">
            <div class="container">
              ${stepsMarkup}
            </div>
          </section>
        `
        : ""
    }

    <section class="section">
      <div class="container contact-layout">
        <div class="contact-panel">
          <p class="section-label">Commissions</p>
          <h2 class="section-title">Inquiries</h2>
          <p>Inquiries welcome. Contact for details.</p>
        </div>
        ${formMarkup}
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
        ${data.about.statement ? `<p class="page-copy">${escapeHtml(data.about.statement)}</p>` : ""}
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <div class="portrait-frame">
          <img src="${escapeAttribute(data.about.portraitImage)}" alt="${escapeAttribute(data.about.portraitAlt)}" loading="lazy" />
        </div>
        <div class="split-copy">
          <p class="section-label">Education and career</p>
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

    ${renderAboutExtraSections(data)}
  `;
}

function renderAboutExtraSections(data) {
  const about = data.about || {};
  const groups = [
    { label: "Awards", title: "Awards", items: about.awards },
    { label: "Publications", title: "Publications", items: about.publications },
    { label: "Selected residential", title: "Selected residential", items: about.selectedResidential },
    { label: "Selected commercial", title: "Selected commercial", items: about.selectedCommercial }
  ];

  return groups
    .map((group) => {
      if (!group.items || !group.items.length) {
        return "";
      }

      return `
        <section class="section">
          <div class="container">
            <p class="section-label">${escapeHtml(group.label)}</p>
            <h2 class="section-title">${escapeHtml(group.title)}</h2>
            <div class="stack-copy">
              ${group.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
            </div>
          </div>
        </section>
      `;
    })
    .join("");
}

function renderContactPage(data) {
  const details = [];

  if (hasEmail(data.site.email)) {
    details.push(
      `<p><strong>Email:</strong> <a href="mailto:${escapeAttribute(data.site.email)}">${escapeHtml(data.site.email)}</a></p>`
    );
  }

  if (data.site.phone) {
    details.push(
      `<p><strong>Phone:</strong> <a href="tel:${escapeAttribute(data.site.phone.replace(/\s+/g, ""))}">${escapeHtml(
        data.site.phone
      )}</a></p>`
    );
  }

  if (hasPublicUrl(data.site.instagramUrl) && data.site.instagramLabel) {
    details.push(
      `<p><strong>Instagram:</strong> <a href="${escapeAttribute(data.site.instagramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
        data.site.instagramLabel
      )}</a></p>`
    );
  }

  if (hasPublicUrl(data.site.linkedInUrl) && data.site.linkedInLabel) {
    details.push(
      `<p><strong>LinkedIn:</strong> <a href="${escapeAttribute(data.site.linkedInUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
        data.site.linkedInLabel
      )}</a></p>`
    );
  }

  if (data.contact.location) {
    details.push(`<p><strong>Location:</strong> ${escapeHtml(data.contact.location)}</p>`);
  }

  const formMarkup = hasEmail(data.site.email)
    ? `
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
              <textarea name="message" data-label="Message"></textarea>
            </label>
          </div>
          <p class="form-note">Submitting opens your email app with the details filled in.</p>
          <button class="button" type="submit">Send Message</button>
        </form>
      `
    : "";

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
          <p class="section-label">Contact</p>
          <h2 class="section-title">Inquiries</h2>
          ${details.join("") || "<p>Inquiries welcome.</p>"}
        </div>
        ${formMarkup}
      </div>
    </section>
  `;
}
