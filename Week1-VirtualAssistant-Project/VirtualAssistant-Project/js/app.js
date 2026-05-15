/* ============================================================
   AI FD – Team 2 | Application Logic (app.js)
   ============================================================
   Pure vanilla JS — no frameworks.
   Uses marked.js (loaded via CDN in index.html) if available;
   falls back to a lightweight built-in Markdown renderer.
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1. DATA — Dropdown-to-File Mapping
     ========================================================== */
  const PROFILES = {
    gaurav: {
      label:   "Gaurav C",
      image:   "image/GauravC.jpeg",
      profile: "profile/GauravCProfile.txt",
      md:      "MD files/virtual-gaurav assistant.md",
    },
    soundar: {
      label:   "Soundar V",
      image:   "image/SoundarV.jpeg",
      profile: "profile/SoundarVProfile.txt",
      md:      "MD files/virtual-soundar assistant.md",
    },
    parita: {
      label:   "Parita H",
      image:   "image/ParitaH.jpeg",
      profile: "profile/ParitaHProfile.txt",
      md:      "MD files/virtual-parita assistant.md",
    },
  };

  /* Default profile to auto-load on page init */
  const DEFAULT_KEY = "gaurav";


  /* ==========================================================
     2. CATEGORY DEFINITIONS
     ==========================================================
     Each category defines:
       key      – property name in the parsed result object
       domId    – target element ID in index.html
       patterns – array of regex patterns to match heading text
                  (case-insensitive, tested against trimmed heading)

     ORDER MATTERS — first match wins. More specific patterns
     come before broader ones.
     ========================================================== */
  const CATEGORIES = [
    {
      key:      "notes",
      domId:    "mdNotes",
      patterns: [/\bmy\s+notes\b/i, /\bnotes\b/i],
    },
    {
      key:      "links",
      domId:    "mdLinks",
      patterns: [
        /\bmy\s+links?\s*(references?|&\s*ref)?\b/i,
        /\blinks?\b/i,
        /\breferences?\b/i,
      ],
    },
    {
      key:      "network",
      domId:    "mdNetwork",
      patterns: [/\bmy\s+network\b/i, /\bnetwork\b/i],
    },
    {
      key:      "actions",
      domId:    "mdActions",
      patterns: [
        /\bmy\s+actions?\b/i,
        /\bactions?\b/i,
        /\baction\s+items?\b/i,
      ],
    },
    {
      key:      "questions",
      domId:    "mdQuestions",
      patterns: [
        /\bopen\s+questions?\b/i,
        /\bquestions?\b/i,
        /\bopen\s+items?\b/i,
      ],
    },
    {
      key:      "four33",
      domId:    "md433",
      patterns: [
        /\bmy\s+433\b/i,
        /\b4[\s\-._]*3[\s\-._]*3\b/i,
        /\b433\b/i,
      ],
    },
  ];

  /* Heading regex: matches #, ##, or ### with flexible spacing
     Captures:
       group 1 → hashes (to determine level if needed)
       group 2 → raw heading text (may contain **, __, etc.)
  */
  const HEADING_RE = /^(#{1,3})\s*(.*?)\s*$/;


  /* ==========================================================
     3. DOM REFERENCES (cached once)
     ========================================================== */
  const dom = {
    select:           document.getElementById("personSelect"),
    image:            document.getElementById("profileImage"),
    imagePlaceholder: document.getElementById("imagePlaceholder"),
    profileText:      document.getElementById("profileText"),
    tabButtons:       document.querySelectorAll(".tab-btn[data-target]"),
    mdPanels: {
      mdNotes:     document.querySelector("#mdNotes .md-body"),
      mdLinks:     document.querySelector("#mdLinks .md-body"),
      mdNetwork:   document.querySelector("#mdNetwork .md-body"),
      mdActions:   document.querySelector("#mdActions .md-body"),
      mdQuestions:  document.querySelector("#mdQuestions .md-body"),
      md433:       document.querySelector("#md433 .md-body"),
    },
  };


  /* ==========================================================
     4. UTILITY HELPERS
     ========================================================== */

  /**
   * Set innerHTML with a styled status message.
   * @param {"loading"|"error"|"empty"} type
   * @param {string} [detail] Optional detail text
   * @returns {string} HTML string
   */
  function statusHTML(type, detail) {
    const icons  = { loading: "⏳", error: "⚠️", empty: "📭" };
    const labels = {
      loading: "Loading…",
      error:   "Failed to load",
      empty:   "No content found",
    };
    const msg = detail ? `${labels[type]}: ${detail}` : labels[type];
    return `<p class="placeholder-text">${icons[type]} ${msg}</p>`;
  }

  /**
   * Escape HTML entities for safe injection.
   * @param {string} text Raw text
   * @returns {string} HTML-safe string
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /**
   * Robust fetch wrapper with timeout.
   * Returns the Response object or throws.
   * @param {string} url File path to fetch
   * @param {number} [timeoutMs=8000] Timeout in milliseconds
   * @returns {Promise<Response>}
   */
  async function safeFetch(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(encodeURI(url), { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} – ${res.statusText}`);
      }
      return res;
    } finally {
      clearTimeout(timer);
    }
  }


  /* ============================================================
   renderMarkdownLite(text)
   ============================================================
   A zero-dependency Markdown → HTML renderer for enterprise UI.

   Supported:
     ✅  Headings            # H1, ## H2, ### H3, #### H4
     ✅  Bold / Italic       **bold**, *italic*, ***both***
     ✅  Inline code         `code`
     ✅  Fenced code blocks  ```lang ... ```
     ✅  Unordered lists     - item  or  * item  (nested via indent)
     ✅  Ordered lists       1. item  2. item  (nested via indent)
     ✅  Inline links        url
     ✅  Images              !alt
     ✅  Blockquotes         > text
     ✅  Horizontal rules    --- or *** or ___
     ✅  Strikethrough       ~~text~~
     ✅  Line breaks         trailing double-space or <br>
     ✅  Paragraphs          double newline separation

   Unsupported markup is rendered as safe escaped text.
   All user content is HTML-escaped BEFORE rendering to
   prevent XSS injection.
   ============================================================ */
/* ============================================================
   renderMarkdownLite(text) — v2.0
   ============================================================
   Added: HTML table passthrough, Markdown pipe-table parsing,
   improved block-level handling.
   ============================================================ */

function renderMarkdownLite(text) {
  if (!text || typeof text !== "string") return "";

  /* ── PASS 0: Normalise line endings ── */
  var src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  /* ── PASS 1: Extract fenced code blocks ── */
  var preservedBlocks = [];

  src = src.replace(/^```(\w*)\n([\s\S]*?)^```$/gm, function (_, lang, code) {
    var idx = preservedBlocks.length;
    var escaped = escapeForHtml(code.replace(/\n$/, ""));
    var langAttr = lang ? ' class="language-' + escapeForHtml(lang) + '"' : "";
    preservedBlocks.push("<pre><code" + langAttr + ">" + escaped + "</code></pre>");
    return "\n%%PRESERVED_" + idx + "%%\n";
  });

  /* ── PASS 2: Extract HTML tables (preserve as-is) ── */
  src = src.replace(/<table[\s\S]*?<\/table>/gi, function (match) {
    var idx = preservedBlocks.length;
    preservedBlocks.push(
      '<div class="table-responsive">' + match + '</div>'
    );
    return "\n%%PRESERVED_" + idx + "%%\n";
  });

  /* ── PASS 3: Extract markdown pipe tables ── */
  src = src.replace(
    /(^\|.+\|[ \t]*\n)(^\|[\s:|\-]+\|[ \t]*\n)((?:^\|.+\|[ \t]*\n?)*)/gm,
    function (match, headerRow, separatorRow, bodyRows) {
      var idx = preservedBlocks.length;
      preservedBlocks.push(parsePipeTable(headerRow, separatorRow, bodyRows));
      return "\n%%PRESERVED_" + idx + "%%\n";
    }
  );

  /* ── PASS 4: Escape remaining HTML ── */
  src = escapeForHtml(src);

  /* ── PASS 5: Inline formatting ── */

  // Images
  src = src.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '$2r-radius:4px;" />'
  );

  // Links
  src = src.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    function (_, linkText, url, title) {
      var titleAttr = title ? ' title="' + title + '"' : "";
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer"' + titleAttr + ">" + linkText + "</a>";
    }
  );

  // Bold + Italic
  src = src.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  src = src.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");

  // Bold
  src = src.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  src = src.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  src = src.replace(/\*(.+?)\*/g, "<em>$1</em>");
  src = src.replace(/\b_(.+?)_\b/g, "<em>$1</em>");

  // Strikethrough
  src = src.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Inline code
  src = src.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Trailing double-space → <br>
  src = src.replace(/ {2,}$/gm, "<br>");

  /* ── PASS 6: Block-level elements ── */
  var lines  = src.split("\n");
  var output = [];
  var i      = 0;

  while (i < lines.length) {
    var line = lines[i];

    /* Preserved block placeholder */
    var pbMatch = line.match(/^%%PRESERVED_(\d+)%%$/);
    if (pbMatch) {
      closeParagraph(output);
      output.push(preservedBlocks[parseInt(pbMatch[1], 10)]);
      i++;
      continue;
    }

    /* Horizontal rule */
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      closeParagraph(output);
      output.push("<hr>");
      i++;
      continue;
    }

    /* Headings: # to ###### */
    var hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      closeParagraph(output);
      var level = hMatch[1].length;
      output.push("<h" + level + ">" + hMatch[2].trim() + "</h" + level + ">");
      i++;
      continue;
    }

    /* Blockquote */
    if (/^&gt;\s?/.test(line)) {
      closeParagraph(output);
      var bqLines = [];
      while (i < lines.length && /^&gt;\s?/.test(lines[i])) {
        bqLines.push(lines[i].replace(/^&gt;\s?/, ""));
        i++;
      }
      output.push("<blockquote>" + bqLines.join("<br>") + "</blockquote>");
      continue;
    }

    /* Unordered list */
    if (/^(\s*)([-*])\s+/.test(line)) {
      closeParagraph(output);
      i = parseList(lines, i, output, "ul");
      continue;
    }

    /* Ordered list */
    if (/^(\s*)\d+\.\s+/.test(line)) {
      closeParagraph(output);
      i = parseList(lines, i, output, "ol");
      continue;
    }

    /* Blank line */
    if (line.trim() === "") {
      closeParagraph(output);
      i++;
      continue;
    }

    /* Default: paragraph */
    if (!isInParagraph(output)) {
      output.push("%%P_OPEN%%");
    }
    output.push(line);
    i++;
  }

  closeParagraph(output);

  /* ── PASS 7: Finalise ── */
  var html = output.join("\n");
  html = html.replace(/%%P_OPEN%%\n?/g, "<p>");
  html = html.replace(/%%P_CLOSE%%/g, "</p>");
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html.trim();
}


/* ==============================================================
   HELPER: Parse Markdown Pipe Tables
   ============================================================== */
function parsePipeTable(headerRow, separatorRow, bodyRows) {
  var html = '<div class="table-responsive"><table>';

  /* Parse alignment from separator row */
  var separators = separatorRow.trim().split("|").filter(function (c) {
    return c.trim() !== "";
  });
  var alignments = separators.map(function (sep) {
    var s = sep.trim();
    if (s.charAt(0) === ":" && s.charAt(s.length - 1) === ":") return "center";
    if (s.charAt(s.length - 1) === ":") return "right";
    return "left";
  });

  /* Header */
  var headers = headerRow.trim().split("|").filter(function (c) {
    return c.trim() !== "";
  });
  html += "<thead><tr>";
  headers.forEach(function (cell, idx) {
    var align = alignments[idx] || "left";
    html += '<th style="text-align:' + align + '">' + cell.trim() + "</th>";
  });
  html += "</tr></thead>";

  /* Body rows */
  var rows = bodyRows.trim().split("\n").filter(function (r) {
    return r.trim() !== "";
  });
  if (rows.length > 0) {
    html += "<tbody>";
    rows.forEach(function (row) {
      var cells = row.trim().split("|").filter(function (c) {
        return c.trim() !== "";
      });
      html += "<tr>";
      cells.forEach(function (cell, idx) {
        var align = alignments[idx] || "left";
        html += '<td style="text-align:' + align + '">' + cell.trim() + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody>";
  }

  html += "</table></div>";
  return html;
}


/* ==============================================================
   HELPER: Parse nested lists
   ============================================================== */
function parseList(lines, startIndex, output, listType) {
  var itemRegex =
    listType === "ul"
      ? /^(\s*)([-*])\s+(.*)/
      : /^(\s*)\d+\.\s+(.*)/;

  var firstMatch = lines[startIndex].match(itemRegex);
  var baseIndent = firstMatch ? firstMatch[1].length : 0;

  output.push("<" + listType + ">");
  var i = startIndex;

  while (i < lines.length) {
    var line  = lines[i];
    var match = line.match(itemRegex);

    if (match) {
      var indent = match[1].length;
      if (indent > baseIndent) {
        i = parseList(lines, i, output, listType);
        continue;
      } else if (indent < baseIndent) {
        break;
      }
      var content = listType === "ul" ? match[3] : match[2];
      output.push("<li>" + content + "</li>");
      i++;
    } else if (line.trim() === "") {
      if (i + 1 < lines.length && itemRegex.test(lines[i + 1])) {
        i++;
        continue;
      }
      break;
    } else {
      break;
    }
  }

  output.push("</" + listType + ">");
  return i;
}


/* ==============================================================
   HELPER: Paragraph state tracking
   ============================================================== */
function isInParagraph(output) {
  for (var j = output.length - 1; j >= 0; j--) {
    if (output[j] === "%%P_OPEN%%") return true;
    if (output[j] === "%%P_CLOSE%%") return false;
    if (output[j].charAt(0) === "<") return false;
  }
  return false;
}

function closeParagraph(output) {
  if (isInParagraph(output)) {
    output.push("%%P_CLOSE%%");
  }
}


/* ==============================================================
   HELPER: HTML-escape (XSS prevention)
   ============================================================== */
function escapeForHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ==============================================================
   HELPER: Parse nested lists (recursive-capable)
   ==============================================================
   Handles both UL and OL with indentation-based nesting.
   Returns the new line index after the list ends.
   ============================================================== */
function parseList(lines, startIndex, output, listType) {
  var listTag   = listType;  // "ul" or "ol"
  var itemRegex =
    listType === "ul"
      ? /^(\s*)([-*])\s+(.*)/
      : /^(\s*)\d+\.\s+(.*)/;

  // Determine the base indent level from the first item
  var firstMatch  = lines[startIndex].match(itemRegex);
  var baseIndent  = firstMatch ? firstMatch[1].length : 0;

  output.push("<" + listTag + ">");

  var i = startIndex;

  while (i < lines.length) {
    var line  = lines[i];
    var match = line.match(itemRegex);

    if (match) {
      var indent = match[1].length;

      if (indent > baseIndent) {
        // Nested list — recurse
        i = parseList(lines, i, output, listType);
        continue;
      } else if (indent < baseIndent) {
        // De-dented — end this list level
        break;
      }

      // Same level — new <li>
      var content = listType === "ul" ? match[3] : match[2];
      output.push("<li>" + content + "</li>");
      i++;
    } else if (line.trim() === "") {
      // Blank line inside list — check if list continues
      if (i + 1 < lines.length && itemRegex.test(lines[i + 1])) {
        i++;
        continue;
      }
      break;
    } else {
      // Non-list line — end list
      break;
    }
  }

  output.push("</" + listTag + ">");
  return i;
}


/* ==============================================================
   HELPER: Paragraph state tracking
   ============================================================== */
function isInParagraph(output) {
  for (var j = output.length - 1; j >= 0; j--) {
    if (output[j] === "%%P_OPEN%%")  return true;
    if (output[j] === "%%P_CLOSE%%") return false;
    if (output[j].charAt(0) === "<") return false;
  }
  return false;
}

function closeParagraph(output) {
  if (isInParagraph(output)) {
    output.push("%%P_CLOSE%%");
  }
}


/* ==============================================================
   HELPER: HTML-escape (XSS prevention)
   ============================================================== */
function escapeForHtml(text) {
  return text
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}


  /* ==========================================================
     5. MARKDOWN SECTION PARSER
     ========================================================== */

  /**
   * Strip inline markdown formatting from heading text so
   * pattern matching is cleaner.
   * "**My Notes**" → "My Notes"
   * @param {string} text Raw heading text
   * @returns {string} Cleaned text
   */
  function stripInlineMarkdown(text) {
    return text
      .replace(/\*{1,2}(.*?)\*{1,2}/g, "$1")   // *italic* / **bold**
      .replace(/_{1,2}(.*?)_{1,2}/g,   "$1")    // _italic_ / __bold__
      .replace(/~~(.*?)~~/g,           "$1")     // ~~strike~~
      .replace(/`(.*?)`/g,             "$1")     // `code`
      .trim();
  }

  /**
   * Match a heading string to one of the known category keys.
   * @param {string} heading Cleaned heading text
   * @returns {string|null} Category key or null if unrecognised
   */
  function identifyCategory(heading) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      for (var j = 0; j < cat.patterns.length; j++) {
        if (cat.patterns[j].test(heading)) return cat.key;
      }
    }
    return null;
  }

  /**
   * Parse a Markdown string into 6 named sections.
   *
   * Handles:
   *  - #, ##, ### headings with flexible spacing
   *  - Bold/italic/code in heading text
   *  - Duplicate headings (content appended)
   *  - Missing categories (null in result)
   *  - Preamble content (before first heading → prepended to notes)
   *  - Unrecognised headings (collected in _unmapped[])
   *
   * @param  {string} mdText  Raw markdown content
   * @return {Object} {
   *   notes:     string|null,
   *   links:     string|null,
   *   network:   string|null,
   *   actions:   string|null,
   *   questions: string|null,
   *   four33:    string|null,
   *   _preamble: string|null,
   *   _unmapped: Array<{heading: string, body: string}>
   * }
   *
   *   null  = category heading was never found → "No content available"
   *   ""    = heading found but body was empty
   *   "..." = raw markdown content (NOT yet rendered to HTML)
   */
  function parseMdSections(mdText) {
    /* Initialise result with null for every category */
    var result = {};
    CATEGORIES.forEach(function (cat) {
      result[cat.key] = null;
    });
    result._preamble = null;
    result._unmapped = [];

    if (!mdText || typeof mdText !== "string") return result;

    var lines         = mdText.split("\n");
    var currentKey    = null;     // matched category key or "__unmapped:<heading>"
    var currentLines  = [];       // accumulator for the current section
    var preambleLines = [];       // lines before the first heading

    /**
     * Flush accumulated lines into the correct result slot.
     */
    function flush() {
      var body = currentLines.join("\n").trim();

      if (currentKey === null) {
        // Content before any recognised heading → preamble
        if (body) preambleLines.push(body);
        return;
      }

      if (currentKey.indexOf("__unmapped:") === 0) {
        var heading = currentKey.replace("__unmapped:", "");
        if (body) result._unmapped.push({ heading: heading, body: body });
        return;
      }

      // Known category — append (handles duplicate headings gracefully)
      if (result[currentKey] === null) {
        result[currentKey] = body;
      } else {
        result[currentKey] += "\n\n" + body;
      }
    }

    // Walk through every line
    lines.forEach(function (line) {
      var match = line.match(HEADING_RE);

      if (match) {
        // Flush previous section before starting a new one
        flush();
        currentLines = [];

        var rawHeading = stripInlineMarkdown(match[2]);
        var catKey     = identifyCategory(rawHeading);

        currentKey = catKey || ("__unmapped:" + rawHeading);
      } else {
        currentLines.push(line);
      }
    });

    // Flush the last section
    flush();

    // Preamble → prepend to notes (most logical home)
    var preamble = preambleLines.join("\n").trim();
    if (preamble) {
      result._preamble = preamble;
      if (result.notes === null) {
        result.notes = preamble;
      } else {
        result.notes = preamble + "\n\n" + result.notes;
      }
    }

    return result;
  }


  /* ==========================================================
     6. CORE LOADERS
     ========================================================== */

  /* ---- 6a. Load Image ---- */
function loadImage(profileData) {
    var img = dom.image;
    var ph  = dom.imagePlaceholder;
    var desc = document.getElementById("profileImageDesc");  // ← NEW

    img.classList.add("hidden");
    if (ph) {
      ph.textContent = "Loading photo…";
      ph.classList.remove("hidden");
    }

    img.onload = function () {
      img.classList.remove("hidden");
      if (ph) ph.classList.add("hidden");
      /* ── NEW: Update ARIA description ── */
      //if (desc) desc.textContent = "Profile photo of " + profileData.label;
    };

    img.onerror = function () {
      img.classList.add("hidden");
      if (ph) {
        ph.textContent = "⚠️ Photo not available for " + profileData.label;
        ph.classList.remove("hidden");
      }
      /* ── NEW: Update ARIA description on error ── */
      if (desc) desc.textContent = "Photo not available for " + profileData.label;
    };

    /* ── NEW: Descriptive alt text ── */
    img.alt = "Profile photo of " + profileData.label + ", " +
              profileData.label.split(" ")[0] + "'s professional headshot";
    img.src = profileData.image;
  }

  /* ---- 6b. Load Profile Text ---- */
 /* ---- 6b. Load Profile Text ---- */
  async function loadProfile(profileData) {
    var container = dom.profileText;
    container.innerHTML = statusHTML("loading");

    try {
      var res  = await safeFetch(profileData.profile);
      var text = await res.text();

      if (!text.trim()) {
        container.innerHTML = statusHTML("empty", "profile is blank");
        return;
      }

      container.innerHTML = renderProfileText(text);
    } catch (err) {
      console.error("[Profile]", err);
      container.innerHTML = statusHTML("error", err.message);
    }
  }

  /**
   * Parse structured profile .txt into styled HTML cards.
   * Supports:
   *   [SECTION] Title        → section header
   *   Key     | Value        → key-value row
   *   - Bullet text          → list item
   *     • Sub-bullet text    → nested list item
   *   Plain text             → paragraph
   */
function renderProfileText(text) {
    var lines = text.split("\n");
    var html  = "";
    var inList = false;
    var inSubList = false;
    var sectionStarted = false;

    lines.forEach(function (rawLine) {
      var line = rawLine.trimEnd();

      if (line.trim() === "") {
        if (inSubList) { html += "</ul>"; inSubList = false; }
        if (inList) { html += "</ul>"; inList = false; }
        return;
      }

      /* ── [SECTION] Header ── */
      var sectionMatch = line.match(/^\[SECTION\]\s*(.+)$/);
      if (sectionMatch) {
        if (inSubList) { html += "</ul>"; inSubList = false; }
        if (inList) { html += "</ul>"; inList = false; }

        /* ── ADD DIVIDER between sections ── */
        if (sectionStarted) {
          html += '<div class="profile-section-divider"></div>';
        }
        sectionStarted = true;

        html += '<div class="profile-section-header">' +
                  escapeForHtml(sectionMatch[1].trim()) +
                '</div>';
        return;
      }

      /* ── Key | Value row ── */
      var kvMatch = line.match(/^([A-Za-z\s/&().]+?)\s*\|\s*(.+)$/);
      if (kvMatch && !inList) {
        if (inSubList) { html += "</ul>"; inSubList = false; }
        if (inList) { html += "</ul>"; inList = false; }
        html += '<div class="profile-kv-row">' +
                  '<span class="profile-key">' + escapeForHtml(kvMatch[1].trim()) + ':</span>' +
                  ' ' +
                  '<span class="profile-value">' + escapeForHtml(kvMatch[2].trim()) + '</span>' +
                '</div>';
        return;
      }

      /* ── Sub-bullet: • or indented ── */
      var subMatch = line.match(/^\s+[•·]\s+(.+)$/);
      if (subMatch) {
        if (!inSubList) {
          html += '<ul class="profile-sublist">';
          inSubList = true;
        }
        html += "<li>" + escapeForHtml(subMatch[1].trim()) + "</li>";
        return;
      }

      /* ── Bullet: - text ── */
      var bulletMatch = line.match(/^-\s+(.+)$/);
      if (bulletMatch) {
        if (inSubList) { html += "</ul>"; inSubList = false; }
        if (!inList) {
          html += '<ul class="profile-list">';
          inList = true;
        }
        html += "<li>" + escapeForHtml(bulletMatch[1].trim()) + "</li>";
        return;
      }

      /* ── Label line (e.g., "Deliverables:") ── */
      var labelMatch = line.match(/^([A-Za-z\s]+):\s*$/);
      if (labelMatch) {
        if (inSubList) { html += "</ul>"; inSubList = false; }
        if (inList) { html += "</ul>"; inList = false; }
        html += '<div class="profile-label">' +
                  escapeForHtml(labelMatch[1].trim()) + ':' +
                '</div>';
        return;
      }

      /* ── Plain text fallback ── */
      if (inSubList) { html += "</ul>"; inSubList = false; }
      if (inList) { html += "</ul>"; inList = false; }
      html += '<p class="profile-text-line">' + escapeForHtml(line.trim()) + '</p>';
    });

    if (inSubList) html += "</ul>";
    if (inList) html += "</ul>";

    return '<div class="profile-formatted">' + html + '</div>';
  }
  /* ---- 6c. Load & Parse Markdown ---- */
  async function loadMarkdown(profileData) {
    var NO_CONTENT    = '<p class="placeholder-text">📭 No content available for this section.</p>';
    var EMPTY_SECTION = '<p class="placeholder-text">📄 Section exists but is empty.</p>';

    // Show loading in all panels
    Object.values(dom.mdPanels).forEach(function (el) {
      if (el) el.innerHTML = statusHTML("loading");
    });

    try {
      var res    = await safeFetch(profileData.md);
      var mdText = await res.text();

      if (!mdText.trim()) {
        Object.values(dom.mdPanels).forEach(function (el) {
          if (el) el.innerHTML = statusHTML("empty");
        });
        return;
      }

      /* ---- Parse into 6 sections ---- */
      var sections = parseMdSections(mdText);

      /* ---- Render each category into its DOM panel ---- */
      CATEGORIES.forEach(function (cat) {
        var panel = dom.mdPanels[cat.domId];
        if (!panel) return;

        var rawMd = sections[cat.key];

        if (rawMd === null || rawMd === undefined) {
          // Heading never appeared in the MD file
          panel.innerHTML = NO_CONTENT;
        } else if (rawMd.trim() === "") {
          // Heading existed but had no content beneath it
          panel.innerHTML = EMPTY_SECTION;
        } else {
          // Render markdown → HTML
          panel.innerHTML = renderMarkdownLite(rawMd);
        }
      });

      /* ---- Surface unmapped sections in Notes panel ---- */
      if (sections._unmapped.length > 0 && dom.mdPanels.mdNotes) {
        var extra = sections._unmapped
          .map(function (s) {
            return (
              '<details class="unmapped-section">' +
                '<summary>📎 ' + escapeHtml(s.heading) + "</summary>" +
                "<div>" + renderMarkdownLite(s.body) + "</div>" +
              "</details>"
            );
          })
          .join("");

        dom.mdPanels.mdNotes.innerHTML +=
          "<hr><h4>Additional Sections</h4>" + extra;
      }
    } catch (err) {
      console.error("[Markdown]", err);
      Object.values(dom.mdPanels).forEach(function (el) {
        if (el) el.innerHTML = statusHTML("error", err.message);
      });
    }
  }


  /* ==========================================================
     7. TAB SWITCHING
     ========================================================== */
  function initTabs() {
    var tabList = document.querySelector('[role="tablist"]');
    var tabs    = Array.from(dom.tabButtons);

    /* ── Click handler ── */
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activateTab(this, tabs);
      });
    });

    /* ── Keyboard handler (Arrow keys + Home/End) ── */
    if (tabList) {
      tabList.addEventListener("keydown", function (e) {
        var currentIndex = tabs.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        var newIndex = currentIndex;

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            newIndex = (currentIndex + 1) % tabs.length;
            break;

          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;

          case "Home":
            e.preventDefault();
            newIndex = 0;
            break;

          case "End":
            e.preventDefault();
            newIndex = tabs.length - 1;
            break;

          default:
            return;
        }

        tabs[newIndex].focus();
        activateTab(tabs[newIndex], tabs);
      });
    }
  }

  /**
   * Activate a tab and its corresponding panel.
   * Updates ARIA attributes for screen readers.
   * @param {HTMLElement} selectedTab  The tab button to activate
   * @param {Array}       allTabs      All tab button elements
   */
  function activateTab(selectedTab, allTabs) {
    var targetId = selectedTab.getAttribute("data-target");
    if (!targetId) return;

    /* Deactivate all tabs */
    allTabs.forEach(function (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");
    });

    /* Deactivate all panels */
    document.querySelectorAll(".md-panel").forEach(function (p) {
      p.classList.remove("active");
    });

    /* Activate selected tab */
    selectedTab.classList.add("active");
    selectedTab.setAttribute("aria-selected", "true");
    selectedTab.setAttribute("tabindex", "0");

    /* Activate corresponding panel */
    var panel = document.getElementById(targetId);
    if (panel) panel.classList.add("active");
  }

  /** Programmatically activate the first tab (Notes). */

  function activateFirstTab() {
    var tabs = Array.from(dom.tabButtons);
    if (tabs.length === 0) return;
    activateTab(tabs[0], tabs);
  }



  /* ==========================================================
     8. MAIN ORCHESTRATOR
     ========================================================== */

  /**
   * Load all sections for a given profile key.
   * Runs image, profile, and markdown fetches in parallel.
   * @param {string} key Profile key from PROFILES map
   */
  async function loadPerson(key) {
    var data = PROFILES[key];
    if (!data) {
      console.warn('[AI FD] Unknown profile key: "' + key + '"');
      return;
    }

    console.log("[AI FD] Loading profile: " + data.label);

    /* ── NEW: Announce to screen readers ── */
    //announceToScreenReader("Loading profile for " + data.label);

    loadImage(data);
    await Promise.allSettled([
      loadProfile(data),
      loadMarkdown(data),
    ]);

    activateFirstTab();

    /* ── NEW: Announce completion ── */
    //announceToScreenReader(data.label + " profile loaded successfully");
  }

  /**
   * Inject a temporary live-region announcement for screen readers.
   * @param {string} message Text to announce
   */
  function announceToScreenReader(message) {
    var el = document.getElementById("sr-announcer");

    if (!el) {
      el = document.createElement("div");
      el.id = "sr-announcer";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      document.body.appendChild(el);
    }

    // Clear → pause → set (ensures re-read by screen reader)
    el.textContent = "";
    setTimeout(function () {
      el.textContent = message;
    }, 100);
  }

  /* ==========================================================
     9. INITIALISATION
     ========================================================== */
  function init() {
    console.log("[AI FD] App initializing…");

    // Wire up tab buttons
    initTabs();

    // Wire up dropdown change event
    dom.select.addEventListener("change", function () {
      var key = this.value;
      if (key && PROFILES[key]) {
        loadPerson(key);
      }
    });

    // Auto-select and load the default profile
    if (dom.select && PROFILES[DEFAULT_KEY]) {
      dom.select.value = DEFAULT_KEY;
      loadPerson(DEFAULT_KEY);
    }

    console.log("[AI FD] App ready ✅");
  }

  // Kick off
  init();

})();