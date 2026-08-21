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
          Use this form to send site updates, including artwork images. Very large batches can still be emailed if they hit a size limit (Gmail/FormSubmit about 10–25MB).
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
          enctype="multipart/form-data"
          data-update-form
        >
          <input type="hidden" name="_subject" value="IvoK studio update" />
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
                  <option value="Prices">Prices</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Artist and site name</legend>
            <div class="field">
              <label>
                <span>Artist display name</span>
                <input type="text" name="artist_display_name" placeholder="Ivo Koytchev" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Header / site name</span>
                <input type="text" name="header_site_name" placeholder="Ivo Koytchev" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Role / tagline (optional)</span>
                <input type="text" name="role_tagline" />
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>About</legend>
            <div class="field">
              <label>
                <span>About / bio</span>
                <textarea name="about_bio"></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Education / career</span>
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
            <legend>Homepage</legend>
            <div class="field">
              <label>
                <span>Hero title</span>
                <input type="text" name="hero_title" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Hero statement</span>
                <textarea name="hero_statement"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Commissions</legend>
            <div class="field">
              <label>
                <span>Commission notes</span>
                <textarea name="commission_notes"></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Commission prices</span>
                <textarea name="commission_prices"></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                <span>Commission process notes</span>
                <textarea name="commission_process"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Prints</legend>
            <div class="field">
              <label>
                <span>Print notes</span>
                <textarea name="print_notes"></textarea>
              </label>
            </div>
            <div class="print-size-block">
              <p>Print sizes and prices (leave blank if none)</p>
              <div class="form-row-3">
                <div class="field">
                  <label>
                    <span>Size 1 name</span>
                    <input type="text" name="print_size_1_name" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 1 dimensions</span>
                    <input type="text" name="print_size_1_dimensions" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 1 price</span>
                    <input type="text" name="print_size_1_price" />
                  </label>
                </div>
              </div>
              <div class="form-row-3">
                <div class="field">
                  <label>
                    <span>Size 2 name</span>
                    <input type="text" name="print_size_2_name" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 2 dimensions</span>
                    <input type="text" name="print_size_2_dimensions" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 2 price</span>
                    <input type="text" name="print_size_2_price" />
                  </label>
                </div>
              </div>
              <div class="form-row-3">
                <div class="field">
                  <label>
                    <span>Size 3 name</span>
                    <input type="text" name="print_size_3_name" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 3 dimensions</span>
                    <input type="text" name="print_size_3_dimensions" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    <span>Size 3 price</span>
                    <input type="text" name="print_size_3_price" />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Artwork update</legend>
            <div class="field">
              <label>
                <span>Upload artwork images (JPG, PNG, WebP, HEIC, GIF, TIFF). More than one file is fine.</span>
                <input
                  type="file"
                  name="attachment"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/gif,image/tiff,.jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.tif,.tiff"
                  multiple
                />
              </label>
              <ul class="attachment-preview" data-attachment-preview hidden></ul>
            </div>
            <p class="form-note">Very large batches can still be emailed if they hit a size limit (Gmail/FormSubmit about 10–25MB).</p>
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
                <span>Price</span>
                <input type="text" name="artwork_price" />
              </label>
            </div>
            <div class="field">
              <label>
                <span>Description</span>
                <textarea name="artwork_description"></textarea>
              </label>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend>Prices</legend>
            <div class="field">
              <label>
                <span>Remove / do not show prices</span>
                <textarea name="remove_prices_note" placeholder="Write if prices should be hidden or removed from the site."></textarea>
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
