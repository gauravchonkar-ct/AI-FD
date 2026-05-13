/* ═══════════════════════════════════════════════════════════
   AI Agent Cost & ROI Calculator — app.js
   Vanilla JS — no frameworks, no dependencies
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── Helpers ────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }
function num(id) {
  var v = parseFloat($(id).value);
  return isNaN(v) ? 0 : v;
}
function fmt(n, d) {
  if (d === undefined) d = 2;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: d, maximumFractionDigits: d
  });
}
function fmtD(n) { return "$" + fmt(n); }

function showToast(msg, ms) {
  if (!ms) ms = 2200;
  var t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, ms);
}

/* ── Default Values ─────────────────────────────────────── */
var DEFAULTS = {
  units_of_work: 1000, queries_per_unit: 5,
  pct_simple: 50, pct_medium: 30, pct_complex: 20,
  tokens_simple: 500, tokens_medium: 1500, tokens_complex: 4000,
  mult_1shot: 1.0, mult_2shot: 1.8, mult_3shot: 2.5,
  selected_shot: "1",
  token_price_per_1k: 0.015,
  engg_labor: 60000, maint_labor: 12000,
  devqa_infra: 5000, prod_infra: 8000,
  build_license: 2000, prod_license: 6000,
  build_token_count: 500000,
  manual_cost_per_unit: 45, manual_labor_rate: 55,
  manual_minutes_per_unit: 50,
  htil_hourly_rate: 45, htil_minutes_per_unit: 10
};

function resetDefaults() {
  var keys = Object.keys(DEFAULTS);
  for (var i = 0; i < keys.length; i++) {
    var el = $(keys[i]);
    if (!el) continue;
    el.value = DEFAULTS[keys[i]];
  }
  $("selected_shot").value = "1";
  document.querySelector(
    'input[name="manual_mode"][value="cpu"]').checked = true;
  document.querySelector(
    'input[name="roi_method"][value="roi"]').checked = true;
  toggleManualMode();
  compute();
  showToast("\u2713 Defaults restored");
}

/* ── Toggle Manual Baseline Mode ────────────────────────── */
function toggleManualMode() {
  var mode = document.querySelector(
    'input[name="manual_mode"]:checked').value;
  $("manualCpuFields").style.display =
    mode === "cpu" ? "block" : "none";
  $("manualLaborFields").style.display =
    mode === "labor" ? "flex" : "none";
  compute();
}

/* ── Validation ─────────────────────────────────────────── */
function validateInputs() {
  var valid = true;
  var inputs = document.querySelectorAll(
    '.inputs-panel input[type="number"]');
  for (var i = 0; i < inputs.length; i++) {
    if (parseFloat(inputs[i].value) < 0) {
      inputs[i].classList.add("error"); valid = false;
    } else {
      inputs[i].classList.remove("error");
    }
  }
  var sum = num("pct_simple") + num("pct_medium") + num("pct_complex");
  var badge = $("mixBadge");
  if (Math.abs(sum - 100) > 0.01) {
    badge.className = "warning-badge";
    badge.textContent = "\u26A0 " + fmt(sum, 1) + "%";
  } else {
    badge.className = "ok-badge";
    badge.textContent = "\u2713 100%";
  }
  return valid;
}

/* ═══════════════════════════════════════════════════════════
   CORE COMPUTATION FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

function getShotMultiplier() {
  var s = $("selected_shot").value;
  if (s === "1") return num("mult_1shot");
  if (s === "2") return num("mult_2shot");
  return num("mult_3shot");
}

/**
 * computeBlendedTokens()
 * Weighted avg of token counts by complexity mix × shot multiplier.
 */
function computeBlendedTokens() {
  var ps = num("pct_simple") / 100;
  var pm = num("pct_medium") / 100;
  var pc = num("pct_complex") / 100;
  var ts = num("tokens_simple");
  var tm = num("tokens_medium");
  var tc = num("tokens_complex");
  var shot = getShotMultiplier();
  return (ps * ts + pm * tm + pc * tc) * shot;
}

/**
 * computeTokenCost()
 * total_tokens = blended × queries_per_unit × units_of_work
 * cost = (total_tokens / 1000) × price_per_1k
 */
function computeTokenCost(blendedTokens, queriesPerUnit,
                          unitsOfWork, pricePerK) {
  var totalTokens = blendedTokens * queriesPerUnit * unitsOfWork;
  var cost = (totalTokens / 1000) * pricePerK;
  return { totalTokens: totalTokens, cost: cost };
}

/**
 * computeBuildTokensCost()
 * Token cost incurred during dev/testing phase.
 */
function computeBuildTokensCost() {
  return (num("build_token_count") / 1000) * num("token_price_per_1k");
}

/**
 * computeBuildCost()
 * build_cost = engg_labor + devqa_infra + build_license +
 *              build_tokens_cost
 */
function computeBuildCost(buildTokensCost) {
  return num("engg_labor") + num("devqa_infra") +
         num("build_license") + buildTokensCost;
}

/**
 * computeRunCost()
 * run_cost = prod_license + maint_labor + prod_tokens_cost + prod_infra
 */
function computeRunCost(prodTokensCost) {
  return num("prod_license") + num("maint_labor") +
         prodTokensCost + num("prod_infra");
}

/**
 * computeHTILCost()
 * htil_cost = (hourly_rate × (mins_per_unit / 60)) × units_of_work
 */
function computeHTILCost() {
  return (num("htil_hourly_rate") *
         (num("htil_minutes_per_unit") / 60)) *
         num("units_of_work");
}

/**
 * getManualTotalCost()
 * Manual baseline: either cost_per_unit × units,
 * or (rate × mins/60) × units.
 */
function getManualTotalCost() {
  var mode = document.querySelector(
    'input[name="manual_mode"]:checked').value;
  var units = num("units_of_work");
  if (mode === "cpu") {
    return num("manual_cost_per_unit") * units;
  } else {
    return (num("manual_labor_rate") *
           (num("manual_minutes_per_unit") / 60)) * units;
  }
}

/**
 * computeROI()
 * Option 1 (roi):     ((manual - scenario) / scenario) × 100
 * Option 2 (savings): ((manual - scenario) / manual)   × 100
 */
function computeROI(scenarioTotal, manualTotal) {
  var method = document.querySelector(
    'input[name="roi_method"]:checked').value;
  if (method === "roi") {
    return scenarioTotal === 0 ? 0 :
      ((manualTotal - scenarioTotal) / scenarioTotal) * 100;
  } else {
    return manualTotal === 0 ? 0 :
      ((manualTotal - scenarioTotal) / manualTotal) * 100;
  }
}

/**
 * computeScenarioCosts()
 * Master function — computes all intermediate and final values.
 */
function computeScenarioCosts() {
  var blended     = computeBlendedTokens();
  var units       = num("units_of_work");
  var qpu         = num("queries_per_unit");
  var priceK      = num("token_price_per_1k");
  var prodTok     = computeTokenCost(blended, qpu, units, priceK);
  var buildTokCost = computeBuildTokensCost();
  var build       = computeBuildCost(buildTokCost);
  var run         = computeRunCost(prodTok.cost);
  var totalAuto   = build + run;
  var cpuAuto     = units === 0 ? 0 : totalAuto / units;
  var htil        = computeHTILCost();
  var totalSemi   = totalAuto + htil;
  var cpuSemi     = units === 0 ? 0 : totalSemi / units;
  var manualTotal = getManualTotalCost();
  var roiAuto     = computeROI(totalAuto, manualTotal);
  var roiSemi     = computeROI(totalSemi, manualTotal);

  return {
    blended: blended, prodTok: prodTok,
    buildTokCost: buildTokCost,
    build: build, run: run,
    totalAuto: totalAuto, cpuAuto: cpuAuto,
    htil: htil, totalSemi: totalSemi, cpuSemi: cpuSemi,
    manualTotal: manualTotal,
    roiAuto: roiAuto, roiSemi: roiSemi,
    engg_labor: num("engg_labor"),
    devqa_infra: num("devqa_infra"),
    build_license: num("build_license"),
    prod_license: num("prod_license"),
    maint_labor: num("maint_labor"),
    prod_infra: num("prod_infra"),
    build_token_count: num("build_token_count"),
    units: units, qpu: qpu, priceK: priceK,
    shotMultiplier: getShotMultiplier(),
    roiMethod: document.querySelector(
      'input[name="roi_method"]:checked').value
  };
}

/* ═══════════════════════════════════════════════════════════
   RENDER FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

/** renderResults() — Side-by-side result cards. */
function renderResults(d) {
  var method = d.roiMethod;
  var roiLabel = method === "roi" ? "ROI %" : "Savings %";
  var rcA = d.roiAuto >= 0 ? "green" : "red";
  var rcS = d.roiSemi >= 0 ? "green" : "red";

  $("resultsGrid").innerHTML =
    // ── Autonomous Card ──
    '<div class="result-card autonomous">' +
    '<h3><span class="dot"></span>Fully Autonomous Agent</h3>' +
    m("Engineering Labor", fmtD(d.engg_labor)) +
    m("Dev/QA Infrastructure", fmtD(d.devqa_infra)) +
    m("Build License", fmtD(d.build_license)) +
    m("Build Token Cost", fmtD(d.buildTokCost)) +
    mb("Build Cost", fmtD(d.build), "blue") +
    '<div style="height:.55rem"></div>' +
    m("Production License", fmtD(d.prod_license)) +
    m("Maintenance Labor", fmtD(d.maint_labor)) +
    m("Prod Token Cost", fmtD(d.prodTok.cost)) +
    m("Prod Infrastructure", fmtD(d.prod_infra)) +
    mb("Run Cost", fmtD(d.run), "blue") +
    mh("Total Cost", fmtD(d.totalAuto), "blue", "") +
    mh("Cost per Unit", fmtD(d.cpuAuto), "green", "-green") +
    mh(roiLabel, fmt(d.roiAuto, 1) + "%", rcA, "-green") +
    '</div>' +
    // ── Semi-Autonomous Card ──
    '<div class="result-card semi">' +
    '<h3><span class="dot"></span>Semi-Autonomous (HTIL)</h3>' +
    m("Engineering Labor", fmtD(d.engg_labor)) +
    m("Dev/QA Infrastructure", fmtD(d.devqa_infra)) +
    m("Build License", fmtD(d.build_license)) +
    m("Build Token Cost", fmtD(d.buildTokCost)) +
    mb("Build Cost", fmtD(d.build), "purple") +
    '<div style="height:.55rem"></div>' +
    m("Production License", fmtD(d.prod_license)) +
    m("Maintenance Labor", fmtD(d.maint_labor)) +
    m("Prod Token Cost", fmtD(d.prodTok.cost)) +
    m("Prod Infrastructure", fmtD(d.prod_infra)) +
    mb("Run Cost", fmtD(d.run), "purple") +
    '<div style="height:.55rem"></div>' +
    m("HTIL Human Cost", fmtD(d.htil), "purple") +
    mh("Total Cost", fmtD(d.totalSemi), "purple", "-purple") +
    mh("Cost per Unit", fmtD(d.cpuSemi), "green", "-green") +
    mh(roiLabel, fmt(d.roiSemi, 1) + "%", rcS, "-green") +
    '</div>';
}
// Helper builders for metric rows
function m(label, val, color) {
  var c = color ? " " + color : "";
  return '<div class="metric">';
}