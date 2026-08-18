(function () {
  const rawData = window.SITE_DATA;
  const form = document.getElementById("content-editor");
  const editorRoot = document.querySelector("[data-editor-root]");

  if (!rawData || !form || !editorRoot) {
    return;
  }

  let editorState = JSON.parse(JSON.stringify(rawData));

  renderEditor();

  editorRoot.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add-work]");
    const removeButton = event.target.closest("[data-remove-work]");

    if (addButton) {
      syncStateFromForm();
      const category = addButton.getAttribute("data-add-work");
      editorState.worksByCategory[category] = editorState.worksByCategory[category] || [];
      editorState.worksByCategory[category].push(createEmptyWork());
      renderEditor();
      return;
    }

    if (removeButton) {
      syncStateFromForm();
      const category = removeButton.getAttribute("data-category");
      const index = Number(removeButton.getAttribute("data-index"));

      if (editorState.worksByCategory[category]) {
        editorState.worksByCategory[category].splice(index, 1);
        renderEditor();
      }
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncStateFromForm();
    const exportData = buildExportData(editorState);
    downloadFile("site-data.js", `window.SITE_DATA = ${JSON.stringify(exportData, null, 2)};\n`);
  });

  function renderEditor() {
    const categories = Array.isArray(editorState.categories) ? editorState.categories : [];

    editorRoot.innerHTML = `
      <div class="editor-grid">
        <section class="editor-panel">
          <p class="card-label">Site Basics</p>
          ${renderField("Artist name", "site.artistName", editorState.site.artistName)}
          ${renderField("Short name", "site.shortName", editorState.site.shortName)}
          ${renderField("Role", "site.role", editorState.site.role)}
          ${renderField("Email", "site.email", editorState.site.email)}
          ${renderField("Instagram URL", "site.instagramUrl", editorState.site.instagramUrl)}
          ${renderField("Instagram label", "site.instagramLabel", editorState.site.instagramLabel)}
          ${renderField("Footer note", "site.footerNote", editorState.site.footerNote)}
        </section>

        <section class="editor-panel">
          <p class="card-label">Hero</p>
          ${renderField("Hero image path", "hero.image", editorState.hero.image)}
          ${renderField("Hero alt text", "hero.alt", editorState.hero.alt)}
          ${renderField("Hero label", "hero.label", editorState.hero.label)}
          ${renderField("Hero title", "hero.title", editorState.hero.title)}
          ${renderTextarea("Hero statement", "hero.statement", editorState.hero.statement)}
          ${renderTextarea("Hero description", "hero.description", editorState.hero.description)}
        </section>

        <section class="editor-panel editor-panel--full">
          <p class="card-label">Artist Portrait and About</p>
          <div class="editor-grid">
            <div>
              ${renderField("Portrait image path", "about.portraitImage", editorState.about.portraitImage)}
              ${renderField("Portrait alt text", "about.portraitAlt", editorState.about.portraitAlt)}
              ${renderField("About title", "about.title", editorState.about.title)}
            </div>
            <div>
              ${renderTextarea("About statement", "about.statement", editorState.about.statement)}
              ${renderTextarea("Biography paragraphs", "about.biography", joinParagraphs(editorState.about.biography))}
            </div>
          </div>
        </section>

        ${categories.map((category) => renderCategoryPanel(category)).join("")}
      </div>
    `;
  }

  function renderCategoryPanel(category) {
    const items = Array.isArray(editorState.worksByCategory[category.slug]) ? editorState.worksByCategory[category.slug] : [];

    return `
      <section class="editor-panel editor-panel--full">
        <p class="card-label">${escapeHtml(category.label)}</p>
        ${category.room || category.atmosphere ? `<p>${escapeHtml([category.room, category.atmosphere].filter(Boolean).join(" / "))}</p>` : ""}
        <div class="editor-work-list">
          ${items.map((work, index) => renderWorkEditorCard(category, work, index)).join("")}
        </div>
        <div class="editor-panel-actions">
          <button class="muted-button" type="button" data-add-work="${escapeAttribute(category.slug)}">Add work</button>
        </div>
      </section>
    `;
  }

  function renderWorkEditorCard(category, work, index) {
    const heading = work.title || `${category.label} work ${index + 1}`;

    return `
      <article class="editor-work-card" data-work-card data-category="${escapeAttribute(category.slug)}" data-index="${index}">
        <div class="editor-work-card-header">
          <h3>${escapeHtml(heading)}</h3>
          <button
            class="muted-button"
            type="button"
            data-remove-work="true"
            data-category="${escapeAttribute(category.slug)}"
            data-index="${index}"
          >
            Remove work
          </button>
        </div>

        <div class="editor-grid">
          <div>
            ${renderWorkField("Title", "title", work.title)}
            ${renderWorkField("Image path", "image", work.image)}
            ${renderWorkField("Alt text", "alt", work.alt)}
            ${renderWorkField("Year", "year", work.year)}
          </div>
          <div>
            ${renderWorkField("Medium", "medium", work.medium)}
            ${renderWorkField("Dimensions", "dimensions", work.dimensions)}
            ${renderWorkField("Price", "price", work.price)}
            <label class="editor-checkbox">
              <input type="checkbox" data-work-field="featured" ${work.featured ? "checked" : ""} />
              Show on homepage
            </label>
          </div>
        </div>

        ${renderWorkTextarea("Description", "description", joinParagraphs(work.description))}
      </article>
    `;
  }

  function syncStateFromForm() {
    const next = JSON.parse(JSON.stringify(editorState));

    next.site.artistName = getFieldValue("site.artistName");
    next.site.shortName = getFieldValue("site.shortName");
    next.site.role = getFieldValue("site.role");
    next.site.email = getFieldValue("site.email");
    next.site.instagramUrl = getFieldValue("site.instagramUrl");
    next.site.instagramLabel = getFieldValue("site.instagramLabel");
    next.site.footerNote = getFieldValue("site.footerNote");

    next.hero.image = getFieldValue("hero.image");
    next.hero.alt = getFieldValue("hero.alt");
    next.hero.label = getFieldValue("hero.label");
    next.hero.title = getFieldValue("hero.title");
    next.hero.statement = getFieldValue("hero.statement");
    next.hero.description = getFieldValue("hero.description");

    next.about.portraitImage = getFieldValue("about.portraitImage");
    next.about.portraitAlt = getFieldValue("about.portraitAlt");
    next.about.title = getFieldValue("about.title");
    next.about.statement = getFieldValue("about.statement");
    next.about.biography = splitParagraphs(getFieldValue("about.biography"));

    next.categories.forEach((category) => {
      const cards = Array.from(editorRoot.querySelectorAll(`[data-work-card][data-category="${category.slug}"]`));

      next.worksByCategory[category.slug] = cards
        .map((card) => ({
          title: getWorkValue(card, "title"),
          image: getWorkValue(card, "image"),
          alt: getWorkValue(card, "alt"),
          year: getWorkValue(card, "year"),
          medium: getWorkValue(card, "medium"),
          dimensions: getWorkValue(card, "dimensions"),
          price: getWorkValue(card, "price"),
          featured: getWorkChecked(card, "featured"),
          description: splitParagraphs(getWorkValue(card, "description"))
        }))
        .filter((work) => work.title || work.image);
    });

    editorState = next;
  }

  function buildExportData(state) {
    const exportData = JSON.parse(JSON.stringify(state));
    const seenSlugs = new Set();

    exportData.categories.forEach((category) => {
      const works = Array.isArray(exportData.worksByCategory[category.slug]) ? exportData.worksByCategory[category.slug] : [];

      exportData.worksByCategory[category.slug] = works.map((work, index) => {
        const title = work.title || `${category.label} Work ${index + 1}`;
        let slug = slugify(title);

        if (!slug) {
          slug = `${category.slug}-${index + 1}`;
        }

        while (seenSlugs.has(slug)) {
          slug = `${slug}-${index + 1}`;
        }

        seenSlugs.add(slug);

        return {
          slug,
          title,
          image: work.image || "",
          alt: work.alt || `${title} artwork`,
          year: work.year || "",
          medium: work.medium || "",
          dimensions: work.dimensions || "",
          price: work.price || "",
          featured: Boolean(work.featured),
          description: Array.isArray(work.description) ? work.description : splitParagraphs(work.description)
        };
      });
    });

    return exportData;
  }

  function getFieldValue(fieldName) {
    const field = editorRoot.querySelector(`[data-field="${fieldName}"]`);
    return field ? field.value.trim() : "";
  }

  function getWorkValue(card, fieldName) {
    const field = card.querySelector(`[data-work-field="${fieldName}"]`);
    return field ? field.value.trim() : "";
  }

  function getWorkChecked(card, fieldName) {
    const field = card.querySelector(`[data-work-field="${fieldName}"]`);
    return Boolean(field && field.checked);
  }

  function renderField(label, fieldName, value) {
    return `
      <div class="field">
        <label>
          <span>${escapeHtml(label)}</span>
          <input type="text" data-field="${escapeAttribute(fieldName)}" value="${escapeAttribute(value || "")}" />
        </label>
      </div>
    `;
  }

  function renderTextarea(label, fieldName, value) {
    return `
      <div class="field">
        <label>
          <span>${escapeHtml(label)}</span>
          <textarea data-field="${escapeAttribute(fieldName)}">${escapeHtml(value || "")}</textarea>
        </label>
      </div>
    `;
  }

  function renderWorkField(label, fieldName, value) {
    return `
      <div class="field">
        <label>
          <span>${escapeHtml(label)}</span>
          <input type="text" data-work-field="${escapeAttribute(fieldName)}" value="${escapeAttribute(value || "")}" />
        </label>
      </div>
    `;
  }

  function renderWorkTextarea(label, fieldName, value) {
    return `
      <div class="field">
        <label>
          <span>${escapeHtml(label)}</span>
          <textarea data-work-field="${escapeAttribute(fieldName)}">${escapeHtml(value || "")}</textarea>
        </label>
      </div>
    `;
  }

  function createEmptyWork() {
    return {
      title: "",
      image: "",
      alt: "",
      year: "",
      medium: "",
      dimensions: "",
      price: "",
      featured: false,
      description: []
    };
  }

  function joinParagraphs(value) {
    if (!Array.isArray(value)) {
      return String(value || "");
    }

    return value.join("\n\n");
  }

  function splitParagraphs(value) {
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

  function downloadFile(filename, contents) {
    const blob = new Blob([contents], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
})();
