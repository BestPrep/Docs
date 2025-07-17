# How to Add a New Page

Adding a new page to this site is easy! Follow these steps:

---

## Step 1: Create Your Page

All pages are written in **Markdown (.md)** and live in the `content/` folder.

- Ask [Tovin Sannes-Venhuizen](mailto:tsannes-venhuizen@bestprep.org) for GitHub access if you don’t have it.
- Create your new `.md` file inside the correct subfolder under `content/`.

Example:
```
content/mentoring/my_new_page.md
```

---

## Step 2: Add It to the Navigation

Open `mkdocs.yml` and add your page in the right spot under `nav:`. Here's an example:

```yaml
nav:
  - Home: index.md
  - Add a Page: add_page.md
  - Mentoring:
      - Overview: mentoring/mentoring.md
      - My New Page: mentoring/my_new_page.md
```

---

## Step 3: Rebuild the Site

After saving your edits, the site will automatically rebuild and publish (if GitHub Actions is set up).  
If not, notify your BestPrep Tech Admin to run:

```
mkdocs build
```
and push the result to GitHub.

---

## Markdown Quick Reference

### Headings
```markdown
# H1
## H2
### H3
```

### Emphasis
```markdown
**Bold**   *Italic*
```

### Blockquote
```markdown
> This is a quote
```

### Lists
**Ordered:**
```markdown
1. First
2. Second
```

**Unordered:**
```markdown
- Item A
- Item B
```

### Code
Inline: \`code\`  
Block:
\`\`\`
print("Hello World")
\`\`\`

### Links and Images
```markdown
[Link Title](https://example.com)
![Alt Text](/content/images/logo.jpg)
```

---

## Diagrams with Mermaid

You can add flowcharts using Mermaid like this:

```html
<div class="mermaid">
flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do it]
  B -->|No| D[Cancel]
</div>
```

### Example:

<div class="mermaid">
flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do it]
  B -->|No| X[This One is Clickable]

  class X click-step-X;
  classDef clickable stroke:#333,stroke-width:2px;
  class X clickable;
</div>

---

## Clickable Mermaid Steps with Modals

Make steps clickable and open a popup:

```html
<div class="mermaid"> 
graph TD
  A[Start Flow] --> X[Clickable Step]

  class X click-step-X;

  classDef clickable stroke:#333,stroke-width:2px;
  
  class X clickable;
</div>
```

Then at the bottom of your page, add this modal HTML:

```html
<div id="modal-step-X" class="custom-modal">
  <div class="custom-modal-content">
    <span class="custom-modal-close" onclick="closeModal('modal-step-X')">&times;</span>
    <h2>This is the modal header</h2>
    <p>This is the modal body.</p>
  </div>
</div>
```

Make sure the IDs match: `X`, `click-step-X`, and `modal-step-X`

<div id="modal-step-X" class="custom-modal">
  <div class="custom-modal-content">
    <span class="custom-modal-close" onclick="closeModal('modal-step-X')">&times;</span>
    <h2>This is the modal header</h2>
    <p>This is the modal body.</p>
  </div>
</div>