function renderUpdatePage(data) {
  const categoryOptions = data.categories
    .map((category) => `<option value="${escapeAttribute(category.label)}">${escapeHtml(category.label)}</option>`)
    .join("");

  return `
    <section class="page-hero">
      <div class="container">
        <p class="page-label">Studio update</p>
        <h1 class="page-title">Studio update</h1>
        <p class="page-copy">
          Use this form to send site updates. Artwork photographs should be emailed separately.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="thank-you" data-update-thanks hidden>
          <p class="page-label">Received</p>
          <h2 class="section-title">Thank you</h2>
          <p>The team will apply the update.</p>
        </div>

        <form
          class="contact-panel form-grid update-form"
          action="https://formsubmit.co/nsdatalabs.bots@gmail.com"
          method="POST"
          data-update-form
        >
          <input type="hidden" name="_subject" value="Ivo Koytchev studio update" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="" />
          <input type="text" name="_honey" class="honey-field" tabindex="-1" autocomplete="off" />

          <fieldset class="form-fieldset">
            <legend>Submitter</legend>
            <div class="field">
              <label>
                <span>Name</span>
                <input type="text" name="submitter_name" required />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Role</span>
                <select name="submitter_role" required>
                  <option value="">Select</option>
                  <option value="CEO">CEO</option>
                  <option value="Artist">Artist</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Section</span>
                <select name="section" required>
                  <option value="">Select</option>
                  <option value="About">About</option>
                  <option value="Contact">Contact</option>
                  <option value="Homepage">Homepage</option>
                  <option value="Category/Works">Category/Works</option>
                  <option value="Commissions">Commissions</option>
                  <option value="Prints">Prints</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Artist and about</legend>
            <div class="field">
              <label>
                <span>Artist display name</span>
                <input type="text" name="artist_display_name" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Short tagline</span>
                <input type="text" name="short_tagline" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>About / bio</span>
                <textarea name="about_bio"></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Education / career notes</span>
                <textarea name="education_career"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Contact</legend>
            <div class="field">
              <label>
                <span>Contact email</span>
                <input type="email" name="contact_email" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Phone</span>
                <input type="text" name="phone" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Location</span>
                <input type="text" name="location" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Instagram or other socials</span>
                <textarea name="socials"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Commissions and prints</legend>
            <div class="field">
              <label>
                <span>Commission notes</span>
                <textarea name="commission_notes"></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Print notes</span>
                <textarea name="print_notes"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Artwork update</legend>
            <p class="form-note">Photographs should still be emailed separately.</p>
            <div class="field">
              <label>
                <span>Category</span>
                <select name="artwork_category">
                  <option value="">Select</option>
                  ${categoryOptions}
                </select>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Title</span>
                <input type="text" name="artwork_title" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Year</span>
                <input type="text" name="artwork_year" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Medium</span>
                <input type="text" name="artwork_medium" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Dimensions</span>
                <input type="text" name="artwork_dimensions" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Short description</span>
                <textarea name="artwork_description"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Anything else</legend>
            <div class="field">
              <label>
                <span>Free text</span>
                <textarea name="anything_else"></textarea>
              </label>
            </div>
          </fieldset>

          <button class="button" type="submit">Send update</button>
        </form>
      </div>
    </section>
  `;
}
