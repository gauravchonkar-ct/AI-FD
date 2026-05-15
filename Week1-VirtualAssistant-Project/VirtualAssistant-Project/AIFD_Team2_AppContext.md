# AIFD Team 2 — Application Context for AI Agents
> **Single source of truth** for any AI agent (Copilot, ChatGPT, Claude, Gemini, custom) working on this codebase.
> Read this file **before** generating, modifying, or reviewing any code.

---

| Field | Value |
|---|---|
| **Application** | AI FD – Team 2 Virtual Assistant Dashboard |
| **Version** | 1.0 |
| **Date** | 14-May-2026 |
| **Owner** | Gaurav Chonkar, AVP-II – Delivery Lead |
| **Organization** | CitiusTech Healthcare Technology |
| **Related Docs** | AIFD-FRS-001 (FRS), AIFD-TDD-001 (TDD), AIFD-TP-001 (Test Plan) |

---

## 1. PROJECT IDENTITY

**One-line description:** A lightweight, static HTML/CSS/JS single-page dashboard that loads team member profiles (image, structured text, categorized markdown knowledge base) from local files based on a dropdown selection.

**Purpose:** Serve as a personal knowledge base viewer for the AI-First Delivery (AIFD) program, enabling delivery team members to quickly access structured profiles, notes, links, network contacts, action items, open questions, and 4-3-3 framework content.

**Users:** Gaurav Chonkar (owner), Bhooshan Sapre, Swarup Dutta, Vikram Rajagopal, Mayuresh Mhatre.  
**Manager:** Narayanan MK | **Skip Manager:** Vaishali Nambiar

---

## 2. ARCHITECTURE OVERVIEW

### 2.1 Three-Tier Client-Side Architecture

```
+--------------------------------------------------------------+
|                      BROWSER (Client)                        |
|  +----------------------------------------------------------+
|  | PRESENTATION TIER                                        |
|  |   index.html (semantic HTML5)                            |
|  |   css/styles.css (CSS3 Grid + Custom Properties)         |
|  |   calculator.html (placeholder page)                     |
|  +----------------------------------------------------------+
|  | LOGIC TIER                                               |
|  |   js/app.js (Vanilla JavaScript ES6+ wrapped in IIFE)   |
|  |   - Custom markdown renderer (renderMarkdownLite)        |
|  |   - Custom profile parser (renderProfileText)            |
|  |   - Custom section splitter (parseMdSections)            |
|  +----------------------------------------------------------+
|  | DATA TIER (Static Flat Files on HTTP Server)             |
|  |   /image/*.jpg    (profile photos)                       |
|  |   /profile/*.txt  (structured profile text)              |
|  |   /MD files/*.md  (markdown knowledge bases)             |
|  +----------------------------------------------------------+
+--------------------------------------------------------------+
```

### 2.2 Architecture Principles

| Principle | Rule |
|---|---|
| Zero Dependencies | No external libraries, frameworks, or CDN at runtime |
| Client-Side Only | No backend, no API server, no database |
| Separation of Concerns | HTML = structure, CSS = style, JS = behavior (3 files) |
| Progressive Enhancement | Semantic HTML works without JS; CSS enhances layout |
| Fail Gracefully | Every container shows loading/content/error/empty — never blank |
| Accessibility First | WCAG 2.1 AA compliance in every component |
| Defense-in-Depth | Multiple XSS prevention layers |

---

## 3. FILE STRUCTURE

```
project-root/
├── index.html                  # Single-page app entry point
├── calculator.html              # VSM Calculator placeholder page
├── css/
│   └── styles.css              # Complete design system + responsive styles
├── js/
│   └── app.js                  # All application logic (IIFE-wrapped)
├── image/
│   ├── GauravC.jpg             # Gaurav's profile photo
│   ├── SoundarV.jpg            # Soundar's profile photo
│   └── PartiaH.jpg             # Partia's profile photo
├── profile/
│   ├── GauravCProfile.txt      # Gaurav's structured profile text
│   ├── SoundarVProfile.txt     # Soundar's structured profile text
│   └── PartiaHProfile.txt      # Partia's structured profile text
├── MD files/
│   ├── virtual-gaurav assistant.md
│   ├── virtual-soundar assistant.md
│   └── virtual-partita assistant.md
└── docs/
    ├── AIFD_Team2_FRS_v1.0.docx
    ├── AIFD_Team2_TDD_v1.0.docx
    └── AIFD_Team2_TestPlan_v1.0.docx
```

> **NOTE:** The folder `MD files/` has a space in the name. `safeFetch()` handles this via `encodeURI()`.

---

## 4. HARD CONSTRAINTS (MUST NEVER VIOLATE)

These constraints are **non-negotiable**. Any AI agent generating code for this project **MUST** respect all of them:

| # | Constraint | Rationale |
|---|---|---|
| HC-01 | **No external libraries or frameworks** at runtime (no React, Vue, Angular, Bootstrap, Tailwind, jQuery, marked.js, etc.) | Zero-dependency architecture |
| HC-02 | **No `eval()`, no `Function()` constructor, no dynamic script injection** | XSS prevention |
| HC-03 | **All user content MUST be escaped** via `escapeForHtml()` before `innerHTML` injection | XSS prevention |
| HC-04 | **HTML `<table>` tags are the ONLY exception** to escaping (whitelisted passthrough in PASS 2) | Tables must render as HTML |
| HC-05 | **`<script>` tags are NEVER whitelisted** — always escaped to `&lt;script&gt;` | Critical security rule |
| HC-06 | **All external links MUST have** `rel="noopener noreferrer"` and `target="_blank"` | Prevents opener access |
| HC-07 | **All JS code MUST be inside the IIFE** in `app.js` — no global scope pollution | Module isolation |
| HC-08 | **All CSS values MUST use custom properties** (`--var-name`) defined on `:root` | Design system consistency |
| HC-09 | **All DOM queries MUST use cached references** from the `dom` object — no repeated `getElementById` | Performance |
| HC-10 | **`Promise.allSettled()` MUST be used** (not `Promise.all()`) for parallel fetches | One failure must not block others |
| HC-11 | **`safeFetch()` MUST be used** for all network requests (includes 8s `AbortController` timeout) | Timeout and error handling |
| HC-12 | **WCAG 2.1 AA compliance is mandatory** — every interactive element needs keyboard access + ARIA | Accessibility |
| HC-13 | **No `file://` protocol** — app must be served via HTTP server (CORS restriction on `fetch()`) | Browser security |
| HC-14 | **No emoji characters in python-docx** Word document generation — causes `UnicodeEncodeError` with surrogate pairs | Known python-docx limitation |

---

## 5. DATA FORMAT SPECIFICATIONS

### 5.1 Profile Text Format (.txt)

Profile files use a line-by-line format parsed by `renderProfileText()`:

| Pattern | Regex/Match | Renders As |
|---|---|---|
| `[SECTION] Title` | `/^\[SECTION\]\s*(.+)$/` | Styled section header with blue left border |
| `Key \| Value` | `/^([A-Za-z\s/&().]+?)\s*\|\s*(.+)$/` | `KEY: Value` formatted pair |
| `- Bullet text` | `/^-\s+(.+)$/` | List item with `›` accent marker |
| `  • Sub-bullet` | `/^\s+[•·]\s+(.+)$/` | Nested sub-bullet with `•` marker |
| `Label:` | `/^([A-Za-z\s]+):\s*$/` | Uppercase label line |
| `Plain text` | (fallback) | Paragraph text |

**Example Profile File:**
```
[SECTION] About
Name | Gaurav Chonkar
Title | Assistant Vice President (AVP-II) – Delivery Lead
Company | CitiusTech Healthcare Technology
Experience | 18+ years in technology
Location | Navi Mumbai, Maharashtra

[SECTION] Delivery and Leadership
- Lead delivery for 2 strategic healthcare accounts
  • Radiology Partners (US-based diagnostic imaging)
  • Arcadia Healthcare Solutions
- Manage cross-functional teams of 15+ engineers
- Drive AI-first delivery transformation program

[SECTION] Skills and Focus Areas
- Cloud: AWS, Azure, GCP
- Data Engineering: Spark, Databricks, Snowflake
- AI/ML: LLM integration, RAG pipelines, prompt engineering
- Healthcare: FHIR, HL7, clinical workflows
```

### 5.2 Markdown Knowledge Base Format (.md)

Markdown files are split into 6 categories by `parseMdSections()` using heading detection:

| Category | DOM Target | Heading Patterns (Regex) |
|---|---|---|
| `notes` | `#mdNotes` | `/\bmy\s+notes\b/i`, `/\bnotes\b/i` |
| `links` | `#mdLinks` | `/\bmy\s+links?\s*(references?)?\b/i`, `/\blinks?\b/i` |
| `network` | `#mdNetwork` | `/\bmy\s+network\b/i`, `/\bnetwork\b/i` |
| `actions` | `#mdActions` | `/\bmy\s+actions?\b/i`, `/\bactions?\b/i` |
| `questions` | `#mdQuestions` | `/\bopen\s+questions?\b/i`, `/\bquestions?\b/i` |
| `four33` | `#md433` | `/\bmy\s+433\b/i`, `/\b4[\s\-._]*3[\s\-._]*3\b/i` |

**Example MD File Structure:**
```markdown
## My Notes

### Project Status
- Radiology Partners: Phase 2 in progress
- Azure migration on track for Q3

<table>
<tr><th>Metric</th><th>Target</th><th>Actual</th></tr>
<tr><td>Sprint Velocity</td><td>42</td><td>45</td></tr>
</table>

## My Links References

- [Azure DevOps Board](https://dev.azure.com/...)
- [Confluence Wiki](https://wiki.citiustech.com/...)

## My Network

### AACE Framework
| Tier | Name | Role |
|---|---|---|
| Alpha | Narayanan MK | Manager |
| Charlie | Swarup Dutta | Technical Lead |

## My Actions

- [ ] Complete sprint review deck by Friday
- [ ] Schedule architecture review with Vikram

## Open Questions

1. Should we migrate to Azure Functions or Container Apps?
2. Timeline for FHIR R5 adoption?

## My 433

### 4 Key Priorities
1. Deliver Radiology Partners Phase 2
2. Complete Azure migration
3. Upskill team on AI/ML
4. Improve DORA metrics
```

**Markdown Rendering Support Matrix:**

| Feature | Syntax | Supported |
|---|---|---|
| Headings 1-6 | `# through ######` | YES |
| Bold | `**text**` or `__text__` | YES |
| Italic | `*text*` or `_text_` | YES |
| Strikethrough | `~~text~~` | YES |
| Inline Code | `` `code` `` | YES |
| Fenced Code Block | ` ```lang ... ``` ` | YES |
| Unordered List | `- item` or `* item` | YES (nested) |
| Ordered List | `1. item` | YES (nested) |
| Links | `[text](url)` | YES (noopener) |
| Images | `![alt](src)` | YES |
| Blockquotes | `> text` | YES |
| Horizontal Rules | `---` or `***` | YES |
| HTML Tables | `<table>...</table>` | YES (passthrough) |
| Pipe Tables | `\| col \| col \|` | YES (parsed) |
| Task Lists | `- [ ] task` | NO |
| Footnotes | `[^1]` | NO |
| Math/LaTeX | `$ formula $` | NO |

### 5.3 Image Files

| Property | Specification |
|---|---|
| Format | JPEG (.jpg) |
| Location | `image/{Name}.jpg` |
| Naming | PascalCase: `GauravC.jpg`, `SoundarV.jpg`, `PartiaH.jpg` |
| Display | `object-fit: contain`, `max-height: 160px` |
| Error | `onerror` handler shows placeholder text |

---

## 6. JAVASCRIPT MODULE REFERENCE

### 6.1 Configuration Constants

```javascript
// Profile data mapping
var PROFILES = {
  gaurav:  { label: "Gaurav C",  img: "image/GauravC.jpg",  profile: "profile/GauravCProfile.txt",  md: "MD files/virtual-gaurav assistant.md" },
  soundar: { label: "Soundar V", img: "image/SoundarV.jpg", profile: "profile/SoundarVProfile.txt", md: "MD files/virtual-soundar assistant.md" },
  partia:  { label: "Partia H",  img: "image/PartiaH.jpg",  profile: "profile/PartiaHProfile.txt",  md: "MD files/virtual-partita assistant.md" }
};

// Category definitions with regex patterns
var CATEGORIES = {
  notes:     { el: "mdNotes",     patterns: [/\bmy\s+notes\b/i, /\bnotes\b/i] },
  links:     { el: "mdLinks",     patterns: [/\bmy\s+links?\s*(references?)?\b/i, /\blinks?\b/i] },
  network:   { el: "mdNetwork",   patterns: [/\bmy\s+network\b/i, /\bnetwork\b/i] },
  actions:   { el: "mdActions",   patterns: [/\bmy\s+actions?\b/i, /\bactions?\b/i] },
  questions: { el: "mdQuestions", patterns: [/\bopen\s+questions?\b/i, /\bquestions?\b/i] },
  four33:    { el: "md433",       patterns: [/\bmy\s+433\b/i, /\b4[\s\-._]*3[\s\-._]*3\b/i] }
};

var HEADING_RE = /^(#{1,6})\s+(.*)$/;
var DEFAULT_KEY = "gaurav";
```

### 6.2 DOM Cache Reference

```javascript
var dom = {
  select:         document.getElementById("personSelect"),
  img:            document.getElementById("profileImage"),
  imgPlaceholder: document.getElementById("imagePlaceholder"),
  imgDesc:        document.getElementById("profileImageDesc"),
  profileText:    document.getElementById("profileText"),
  mdNotes:        document.getElementById("mdNotes"),
  mdLinks:        document.getElementById("mdLinks"),
  mdNetwork:      document.getElementById("mdNetwork"),
  mdActions:      document.getElementById("mdActions"),
  mdQuestions:     document.getElementById("mdQuestions"),
  md433:          document.getElementById("md433"),
  srAnnouncer:    document.getElementById("sr-announcer"),
  signInBtn:      document.getElementById("signInBtn"),
  signInStatus:   document.getElementById("signInStatus")
};
```

### 6.3 Function Catalog (All 21 Functions)

| Function | Parameters | Returns | Purpose |
|---|---|---|---|
| `init()` | none | void | Entry point: inits tabs, events, loads default profile |
| `initTabs()` | none | void | Attaches click + keyboard handlers to all tab buttons |
| `activateTab()` | selectedTab, allTabs | void | Sets aria-selected, tabindex, shows panel |
| `activateFirstTab()` | none | void | Programmatically activates Notes tab |
| `loadPerson(key)` | key: string | Promise | Orchestrator: parallel loads image + profile + markdown |
| `loadImage(data)` | data: object | void | Sets img.src; handles onload/onerror |
| `loadProfile(data)` | data: object | Promise | Fetches .txt, parses, injects into #profileText |
| `loadMarkdown(data)` | data: object | Promise | Fetches .md, splits by category, renders per tab |
| `renderProfileText(text)` | text: string | string (HTML) | Parses [SECTION]/Key\|Value/Bullet format |
| `renderMarkdownLite(text)` | text: string | string (HTML) | Multi-pass markdown-to-HTML renderer |
| `parseMdSections(mdText)` | mdText: string | object | Splits MD by ## headings into 6 categories |
| `parsePipeTable(h, s, b)` | 3 strings | string (HTML) | Converts pipe table to styled `<table>` |
| `parseList(lines, i, out, type)` | 4 args | number | Recursively parses nested lists |
| `identifyCategory(heading)` | heading: string | string/null | Matches heading text to category key |
| `stripInlineMarkdown(text)` | text: string | string | Removes \*\*,\_\_,\~\~,\` from heading text |
| `safeFetch(url, timeout)` | url, ms | Promise | Fetch with 8s AbortController timeout |
| `statusHTML(type, detail)` | type, detail | string (HTML) | Generates loading/error/empty status message |
| `escapeForHtml(text)` | text: string | string | Escapes `& < > " '` to HTML entities |
| `isInParagraph(output)` | output: array | boolean | Checks if paragraph tag is currently open |
| `closeParagraph(output)` | output: array | void | Closes open `<p>` in render output |
| `announceToScreenReader(msg)` | msg: string | void | Injects aria-live announcement |

### 6.4 Key Algorithms

#### parseMdSections() Algorithm:
```
1. Initialize result object with null for each category key
2. Initialize _unmapped = [] and _preamble = ""
3. Split markdown text by lines
4. For each line:
   a. Check if it matches HEADING_RE (#{1,6} followed by text)
   b. If heading found:
      - Strip inline markdown from heading text
      - Call identifyCategory(strippedText)
      - If category found: set currentCategory = category key
      - If not found: add to _unmapped as collapsible <details>
   c. If not heading:
      - Append line to currentCategory's content
      - If no currentCategory yet, append to _preamble
5. Prepend _preamble to notes category
6. Append _unmapped items to notes category
7. Return result object
```

#### renderMarkdownLite() Multi-Pass Algorithm:
```
PASS 1: Extract fenced code blocks (```...```) → store in preserved[]
PASS 2: Extract HTML <table>...</table> blocks → store in preserved[]
PASS 3: Escape ALL remaining HTML via escapeForHtml()
PASS 4: Process markdown syntax line-by-line:
  - Headings (# through ######)
  - Horizontal rules (---, ***, ___)
  - Blockquotes (> text)
  - Pipe tables (| col | col |)
  - Unordered lists (- item, * item) with nesting
  - Ordered lists (1. item) with nesting
  - Inline: bold, italic, strikethrough, code, links, images
PASS 5: Restore preserved blocks (code + tables) from preserved[]
```

#### renderProfileText() Algorithm:
```
For each line in text:
  1. Skip blank lines (close any open list)
  2. Match [SECTION] → render section header + divider
  3. Match Key | Value → render KEY: Value pair
  4. Match indented • → render sub-bullet
  5. Match - text → render bullet with › marker
  6. Match Label: → render uppercase label
  7. Fallback → render as paragraph text
```

---

## 7. CSS DESIGN SYSTEM

### 7.1 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#1B3A5C` | Header, title bars, footer |
| `--color-primary-light` | `#24507A` | Gradient end, hover states |
| `--color-primary-dark` | `#112840` | Active/pressed states |
| `--color-accent` | `#0078D4` | Active tab, links, focus ring |
| `--color-accent-hover` | `#106EBE` | Link hover state |
| `--color-bg` | `#F3F5F7` | Page background |
| `--color-surface` | `#FFFFFF` | Card backgrounds |
| `--color-surface-alt` | `#F9FAFB` | Alternate surfaces |
| `--color-border` | `#D1D9E0` | Card borders, dividers |
| `--color-border-light` | `#E8ECF0` | Light dividers |
| `--color-text` | `#1E293B` | Primary body text |
| `--color-text-secondary` | `#64748B` | Labels, captions |
| `--color-text-inverse` | `#FFFFFF` | Text on dark backgrounds |

### 7.2 Typography Tokens

| Token | Value | Usage |
|---|---|---|
| `--font-family` | `Segoe UI, system-ui, sans-serif` | All body text |
| `--font-mono` | `Cascadia Code, Consolas, monospace` | Code blocks |
| `--fs-xs` | `0.75rem (12px)` | Section headers, labels |
| `--fs-sm` | `0.8125rem (13px)` | Table cells |
| `--fs-base` | `0.875rem (14px)` | Body text default |
| `--fs-md` | `1rem (16px)` | Sub-headings |
| `--fs-lg` | `1.125rem (18px)` | Section headings |
| `--fs-xl` | `1.375rem (22px)` | Page title |
| `--fw-normal` | `400` | Body text |
| `--fw-medium` | `500` | Labels, dropdown |
| `--fw-semi` | `600` | Headings |
| `--fw-bold` | `700` | Strong emphasis |

### 7.3 Spacing and Layout Tokens

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `0.25rem (4px)` | Tight gaps |
| `--space-sm` | `0.5rem (8px)` | Small gaps |
| `--space-md` | `0.75rem (12px)` | Medium padding |
| `--space-base` | `1rem (16px)` | Standard spacing |
| `--space-lg` | `1.5rem (24px)` | Section gaps |
| `--header-height` | `56px` | Header bar fixed height |
| `--left-col-width` | `300px` | Left column grid width |
| `--radius-sm / md / lg` | `4px / 8px / 12px` | Border radius scale |
| `--shadow-card` | subtle drop shadow | Card elevation |
| `--transition` | `0.2s ease` | All hover/focus transitions |

---

## 8. ACCESSIBILITY REQUIREMENTS

### 8.1 Required Semantic Landmarks

```html
<header>      <!-- App header with dropdown -->
<main>        <!-- Primary content grid -->
  <aside>     <!-- Left column: image + profile -->
  <section>   <!-- Center: knowledge base with tabs -->
<footer>      <!-- Calculator link + copyright -->
```

### 8.2 ARIA Attributes Catalog

| Element | Attribute | Value | Purpose |
|---|---|---|---|
| `<select>` | `aria-label` | `"Select a team member profile"` | Announces purpose |
| `<select>` | `aria-controls` | `"profileImage profileText ..."` | Identifies targets |
| `<nav>` | `role` | `"tablist"` | Tab container |
| Tab `<button>` | `role` | `"tab"` | Tab button |
| Tab `<button>` | `aria-selected` | `"true"/"false"` | Active state |
| Tab `<button>` | `aria-controls` | `"mdNotes"` etc. | Links to panel |
| Tab `<button>` | `tabindex` | `"0"/"-1"` | Roving tabindex |
| `<article>` | `role` | `"tabpanel"` | Panel container |
| `<article>` | `aria-labelledby` | `"tab-mdNotes"` etc. | Panel label |
| `#profileText` | `aria-live` | `"polite"` | Auto-announce changes |
| `#sr-announcer` | `role` | `"status"` | Dynamic announcements |

### 8.3 Keyboard Navigation Map

| Key | Context | Action |
|---|---|---|
| `Tab` | Anywhere | Move between: dropdown > tabs > panel content > footer |
| `Arrow Right/Down` | Tab focused | Move to next tab + activate |
| `Arrow Left/Up` | Tab focused | Move to previous tab + activate |
| `Home` | Tab focused | Jump to first tab (Notes) |
| `End` | Tab focused | Jump to last tab (4-3-3) |
| `Enter/Space` | Skip link | Jump to target section |

### 8.4 Screen Reader Announcement Pattern

```javascript
// Call on profile load start:
announceToScreenReader("Loading profile for " + profileLabel);

// Call on profile load complete:
announceToScreenReader(profileLabel + " profile loaded successfully");

// Implementation: injects text into #sr-announcer (aria-live="polite")
// Text is cleared after 3 seconds via setTimeout
```

---

## 9. ERROR HANDLING PATTERNS

### 9.1 statusHTML() Usage

```javascript
// Loading state (shown immediately before fetch):
container.innerHTML = statusHTML("loading", "Loading profile...");

// Error state (shown in catch block):
container.innerHTML = statusHTML("error", "Failed to load: " + err.message);

// Empty state (shown when file is blank):
container.innerHTML = statusHTML("empty", "No content found");
```

### 9.2 safeFetch() Pattern

```javascript
async function safeFetch(url, timeout) {
  timeout = timeout || 8000;
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, timeout);
  try {
    var res = await fetch(encodeURI(url), { signal: controller.signal });
    if (!res.ok) throw new Error("HTTP " + res.status + " - " + res.statusText);
    return res;
  } finally {
    clearTimeout(timer);
  }
}
```

### 9.3 Promise.allSettled() Pattern

```javascript
// In loadPerson():
loadImage(data);  // Synchronous (sets img.src)
await Promise.allSettled([
  loadProfile(data),   // If this fails...
  loadMarkdown(data)   // ...this still completes
]);
activateFirstTab();
```

### 9.4 Image Error Pattern

```javascript
dom.img.onload = function() {
  dom.img.classList.remove("hidden");
  dom.imgPlaceholder.classList.add("hidden");
};
dom.img.onerror = function() {
  dom.img.classList.add("hidden");
  dom.imgPlaceholder.classList.remove("hidden");
  dom.imgPlaceholder.textContent = "Photo not available for " + label;
};
```

---

## 10. RESPONSIVE DESIGN RULES

| Breakpoint | Width | Layout | Key Changes |
|---|---|---|---|
| Desktop | > 1024px | 2-column grid (300px + 1fr) | Full layout, all features |
| Tablet | <= 1024px | 2-column (260px + 1fr) | Narrower left column |
| Mobile | <= 768px | Single column, stacked | Image+profile side-by-side, scrollable tabs, page scroll enabled |
| Phone | <= 480px | Single column, full stack | Image and profile cards full-width stacked |

**Print Styles:** `@media print` — hide header, footer, tab bar; show all panel content.

**High Contrast:** `@media (forced-colors: active)` — ensure focus rings and tab indicators visible.

**Reduced Motion:** `@media (prefers-reduced-motion: reduce)` — disable all transitions/animations.

---

## 11. SECURITY RULES

### 11.1 escapeForHtml() — What It Escapes

```javascript
function escapeForHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

**When to use:** ALWAYS, before injecting any user content via `innerHTML`. This includes:
- Profile text content (in `renderProfileText`)
- Markdown content (in `renderMarkdownLite`, PASS 3)
- Any dynamically constructed HTML strings

### 11.2 HTML Table Passthrough

HTML `<table>...</table>` blocks in markdown are extracted in PASS 2 BEFORE escaping, stored in a `preserved[]` array, replaced with placeholders, and restored in PASS 5. This allows tables to render as HTML. **`<script>` tags are deliberately NOT in the preservation list** — they will be escaped by PASS 3.

### 11.3 Link Security

```html
<!-- CORRECT: -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>

<!-- WRONG (never do this): -->
<a href="https://example.com">Link</a>
```

---

## 12. PROMPT EXAMPLES FOR AI AGENTS

### Example 1: "Add a new team member to the dropdown"

**Correct approach:**
1. Add entry to `PROFILES` constant in `app.js`:
   ```javascript
   newmember: { label: "New M", img: "image/NewM.jpg", profile: "profile/NewMProfile.txt", md: "MD files/virtual-newmember assistant.md" }
   ```
2. Add `<option value="newmember">New M</option>` in `index.html` dropdown
3. Create 3 content files: `image/NewM.jpg`, `profile/NewMProfile.txt`, `MD files/virtual-newmember assistant.md`

### Example 2: "Add a new tab category (e.g., 'Decisions')"

**Correct approach:**
1. Add to `CATEGORIES` in `app.js`:
   ```javascript
   decisions: { el: "mdDecisions", patterns: [/\bdecisions?\b/i, /\bmy\s+decisions?\b/i] }
   ```
2. Add tab button in `index.html`:
   ```html
   <button role="tab" id="tab-mdDecisions" aria-controls="mdDecisions" class="tab-btn">Decisions</button>
   ```
3. Add panel in `index.html`:
   ```html
   <article role="tabpanel" id="mdDecisions" aria-labelledby="tab-mdDecisions" hidden></article>
   ```
4. Add `mdDecisions: document.getElementById("mdDecisions")` to `dom` cache

### Example 3: "Fix a CSS styling issue"

**Correct approach:**
- Use CSS custom properties (e.g., `color: var(--color-accent)`) — NEVER hardcode hex values
- Check all 4 responsive breakpoints
- Verify the fix doesn't break other components
- Test in Chrome + at least one other browser

### Example 4: "Add search functionality"

**Correct approach:**
- Must be client-side only (no backend)
- Options: `lunr.js` (acceptable as dev dependency) or custom regex search
- Search across all MD content currently loaded
- Display results with highlighted matches
- Add search input to header bar
- Maintain keyboard accessibility for search results

### Example 5: "Profile text is not rendering correctly"

**Correct approach:**
1. Verify `.txt` file follows exact format: `[SECTION]`, `Key | Value`, `- Bullet`
2. Check `renderProfileText()` regex patterns match the content
3. Verify `escapeForHtml()` isn't escaping pipe `|` characters incorrectly
4. Check section divider logic in the rendering function

### Example 6: "Add dark mode"

**Correct approach:**
```css
/* Add to :root */
:root[data-theme="dark"] {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-text: #e0e0e0;
  /* ... override all color tokens */
}

/* Support OS preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark overrides */ }
}
```
- Add toggle button in header
- Store preference in `localStorage`
- Use ONLY CSS custom property overrides — no JS color manipulation

### Example 7: "Make the app work with OneDrive"

**Two approaches:**
1. **Symlink (no code change):**
   ```powershell
   New-Item -ItemType SymbolicLink -Path "MD files" -Target "C:\Users\...\OneDrive\AIFD"
   ```
2. **MSAL.js + Graph API (code change):**
   - Register Azure AD app
   - Add `msal-browser` library
   - Fetch MD files via Microsoft Graph API endpoint
   - Requires authentication flow

### Example 8: "Add task list support to markdown"

**Correct approach:**
- Modify `renderMarkdownLite()` PASS 4
- Add regex: `/^(\s*)- \[([ x])\] (.+)$/`
- Render as: `<label><input type="checkbox" disabled checked> text</label>`
- Check existing content for `- [ ]` patterns
- Test with existing MD files to verify no regression

### Example 9: "Fix accessibility issue"

**Correct approach:**
1. Run Lighthouse accessibility audit — identify specific failures
2. Check ARIA attributes against catalog in Section 8.2
3. Test keyboard navigation: Tab through entire page
4. Test with NVDA/VoiceOver: verify all announcements
5. Check focus management: visible focus ring on all interactive elements
6. Verify semantic HTML landmarks are correct

### Example 10: "Generate a Word document for this project"

**Correct approach:**
- Use `python-docx` library with template: `Document("/app/scripts/word_blank.docx")`
- **NEVER use emoji characters** — causes `UnicodeEncodeError: surrogates not allowed`
- Use plain text markers: `[WARN]`, `[OK]`, `Yes/No`, `N/A`
- Use navy blue `#1B3A5C` for header row shading
- Use alternating row color `#F9FAFB`
- Use Calibri font throughout

---

## 13. ANTI-PATTERNS (WHAT NOT TO DO)

| # | Anti-Pattern | Why It's Wrong | Correct Approach |
|---|---|---|---|
| AP-01 | Adding CDN links (`<script src="https://cdn...">`) | Violates zero-dependency constraint | Write custom code or use bundled library |
| AP-02 | Using `document.getElementById()` directly in functions | Redundant DOM queries; already cached | Use `dom.elementName` from the cache |
| AP-03 | Using `innerHTML` with unescaped user content | XSS vulnerability | Always pass through `escapeForHtml()` first |
| AP-04 | Using `Promise.all()` for parallel fetches | One failure rejects ALL promises | Use `Promise.allSettled()` |
| AP-05 | Declaring variables outside the IIFE | Global scope pollution | Keep everything inside `(function() { ... })()` |
| AP-06 | Hardcoding color hex values in CSS | Breaks design system consistency | Use `var(--color-name)` custom properties |
| AP-07 | Click-only event handlers (no keyboard) | Accessibility violation (WCAG) | Add keydown handler for Enter/Space/Arrow |
| AP-08 | Using `fetch()` without `safeFetch()` | No timeout; no error handling | Always use `safeFetch(url, 8000)` |
| AP-09 | Using emoji in python-docx content | UnicodeEncodeError with surrogates | Use plain text: `[WARN]`, `[OK]`, `Yes/No` |
| AP-10 | Opening `index.html` via `file://` | CORS blocks `fetch()` calls | Serve via HTTP: Live Server, Python, Node |
| AP-11 | Using `marked.js` or `showdown` for markdown | External dependency violation | Use custom `renderMarkdownLite()` |
| AP-12 | Skipping `rel="noopener noreferrer"` on links | Security: opener window accessible | Always add both attributes |

---

## 14. TESTING EXPECTATIONS

| Metric | Target |
|---|---|
| Total Test Cases | 94 (per AIFD-TP-001) |
| Positive Tests | 56 |
| Negative Tests | 24 |
| NFR Tests | 14 |
| P0 Pass Rate | **100%** (mandatory for release) |
| P1 Pass Rate | **>= 95%** |
| Lighthouse Accessibility | **>= 90** |
| Cross-Browser | Chrome, Edge, Firefox, Safari |
| Viewports Tested | 1920px, 1024px, 768px, 480px, 375px |

---

## 15. KNOWN LIMITATIONS

| ID | Limitation | Impact | Workaround |
|---|---|---|---|
| LIM-01 | No backend / API server | Read-only; no save capability | OneDrive sync for content updates |
| LIM-02 | No search functionality | Manual tab browsing only | Future: lunr.js client-side search |
| LIM-03 | No real-time updates | Manual refresh needed after file edits | Live Server auto-refreshes on save |
| LIM-04 | No authentication | Open access on localhost | Add MSAL.js for production deployment |
| LIM-05 | Single-user design | No multi-tenancy | Adequate for team of <10 |
| LIM-06 | Requires HTTP server | Cannot use file:// protocol | VS Code Live Server / Python / Node |
| LIM-07 | Limited markdown support | No task lists, footnotes, math | Covers 90% of common markdown |
| LIM-08 | No image optimization | Relies on pre-sized source files | Manually resize before adding |
| LIM-09 | Folder name with spaces | "MD files/" needs URL encoding | safeFetch() uses encodeURI() |
| LIM-10 | Max 3 profiles hardcoded | Adding members = code change | Future: config.json for dynamic profiles |
| LIM-11 | No automated testing | Manual testing only | Future: Jest + Playwright |
| LIM-12 | No offline-first / PWA | Requires running HTTP server | Future: Service Worker |

---

## 16. CHANGE LOG

| Date | Author | Change Description |
|---|---|---|
| 14-May-2026 | Gaurav Chonkar | Initial version — complete application context |
| | | |
| | | |
| | | |

---

*End of Application Context — AIFD-AppContext v1.0*
*This file should be included in every AI agent's context window when working on this project.*
