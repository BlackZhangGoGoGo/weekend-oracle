/**
 * 一日厨神 · 交互与渲染
 */
(function () {
  const $ = (id) => document.getElementById(id);

  const regionEl       = $("chefRegion");
  const flavorRow      = $("chefFlavorRow");
  const ingredientRow  = $("chefIngredientRow");
  const kitchenRow     = $("chefKitchenRow");
  const errorTip       = $("chefErrorTip");
  const summonBtn      = $("chefSummonBtn");
  const inputCard      = $("chefInputCard");
  const resultSec      = $("chefResult");
  const recipeList     = $("chefRecipeList");
  const resultCountEl  = $("chefResultCount");
  const resultSubEl    = $("chefResultSub");
  const againBtn       = $("chefAgainBtn");
  const resetBtn       = $("chefResetBtn");

  const OPTS = window.CHEF_OPTIONS;

  /* ====== 初始化下拉/标签 ====== */
  OPTS.regions.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.value;
    opt.textContent = r.label;
    regionEl.appendChild(opt);
  });

  OPTS.flavors.forEach((f) => {
    const chip = document.createElement("label");
    chip.className = "chef-chip";
    chip.innerHTML = `
      <input type="checkbox" value="${f.value}" />
      <span>${f.emoji} ${f.label}</span>
    `;
    flavorRow.appendChild(chip);
  });

  OPTS.ingredients.forEach((i) => {
    const chip = document.createElement("label");
    chip.className = "chef-chip slim";
    chip.innerHTML = `
      <input type="checkbox" value="${i.value}" />
      <span>${i.emoji} ${i.value}</span>
    `;
    ingredientRow.appendChild(chip);
  });

  OPTS.kitchens.forEach((k) => {
    const chip = document.createElement("label");
    chip.className = "chef-kitchen-chip";
    chip.innerHTML = `
      <input type="checkbox" value="${k.value}" />
      <span class="kitchen-emoji">${k.emoji}</span>
      <span class="kitchen-label">${k.label}</span>
      <span class="kitchen-hint">${k.hint}</span>
    `;
    kitchenRow.appendChild(chip);
  });

  /* ====== 收集输入 ====== */
  function getChecked(row) {
    return Array.from(row.querySelectorAll("input[type=checkbox]:checked")).map((i) => i.value);
  }

  function getInput() {
    return {
      region:      regionEl.value,
      flavors:     getChecked(flavorRow),
      ingredients: getChecked(ingredientRow),
      kitchens:    getChecked(kitchenRow)
    };
  }

  function validate(input) {
    if (!input.region) return "先选个家乡口味呗 🏠";
    if (!input.flavors.length) return "至少挑 1 个想吃的味儿 👅";
    if (!input.kitchens.length) return "告诉我你的厨房段位 🔪（可以选「中西合璧」让我随便发挥）";
    return "";
  }

  /* ====== 渲染 ====== */
  function difficultyText(d) {
    return d === 1 ? "⭐ 新手友好" : d === 2 ? "⭐⭐ 略费手" : "⭐⭐⭐ 进阶";
  }

  function renderRecipes(picked) {
    recipeList.innerHTML = "";
    picked.forEach(({ recipe, reasons }, i) => {
      const card = document.createElement("div");
      card.className = "card chef-recipe-card";
      card.style.animationDelay = `${i * 0.08}s`;

      const links = window.buildChefSearchLinks(recipe);
      const stepsHtml = recipe.steps.map((s, idx) => `<li><span class="step-no">${idx + 1}</span>${s}</li>`).join("");
      const reasonHtml = reasons && reasons.length
        ? `<div class="chef-recipe-reason">🎯 ${reasons.join(" · ")}</div>`
        : "";

      card.innerHTML = `
        <div class="chef-recipe-head">
          <span class="chef-recipe-emoji">${recipe.emoji}</span>
          <div class="chef-recipe-title-wrap">
            <h3 class="chef-recipe-name">${recipe.name}</h3>
            <div class="chef-recipe-tags">
              ${recipe.region.map(r => `<span class="tag region">#${r}</span>`).join("")}
              ${recipe.flavors.slice(0, 3).map(f => `<span class="tag flavor">${f}</span>`).join("")}
            </div>
          </div>
        </div>
        <p class="chef-recipe-desc">${recipe.desc}</p>
        <div class="chef-recipe-meta">
          <span class="meta-pill">⏱ ${recipe.timeMin} 分钟</span>
          <span class="meta-pill">${difficultyText(recipe.difficulty)}</span>
          <span class="meta-pill">📸 颜值 ${"🌟".repeat(recipe.looks)}</span>
        </div>
        <details class="chef-recipe-steps">
          <summary>📖 极简菜谱（${recipe.steps.length} 步）</summary>
          <ol>${stepsHtml}</ol>
          <p class="chef-tips">💡 ${recipe.tips}</p>
        </details>
        ${reasonHtml}
        <div class="chef-search-links">
          <span class="search-label">看视频学做：</span>
          ${links.map(l => `<a class="search-link" href="${l.url}" target="_blank" rel="noopener">${l.emoji} ${l.name}</a>`).join("")}
        </div>
      `;
      recipeList.appendChild(card);
    });
  }

  function buildSubText(input) {
    const regionLabel = (OPTS.regions.find((r) => r.value === input.region) || {}).label || input.region;
    const parts = [regionLabel];
    if (input.flavors.length) parts.push(input.flavors.join("+"));
    if (input.ingredients.length) parts.push("有 " + input.ingredients.join("/"));
    if (input.kitchens.length) {
      const klabels = input.kitchens.map((k) =>
        (OPTS.kitchens.find((kk) => kk.value === k) || {}).label || k
      );
      parts.push(klabels.join("+"));
    }
    return parts.join(" · ");
  }

  /* ====== 主流程 ====== */
  function run() {
    const input = getInput();
    const err = validate(input);
    if (err) {
      errorTip.textContent = err;
      errorTip.style.opacity = 1;
      return;
    }
    errorTip.textContent = "";

    const picked = window.pickChefRecipes(input);
    resultCountEl.textContent = picked.length;
    resultSubEl.textContent = buildSubText(input);
    renderRecipes(picked);

    inputCard.classList.add("hidden");
    resultSec.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  summonBtn.addEventListener("click", run);

  againBtn.addEventListener("click", () => {
    const input = getInput();
    const picked = window.pickChefRecipes(input);
    // 简单打乱前 6 后再取 4 道，避免每次都一样
    picked.sort(() => Math.random() - 0.5);
    renderRecipes(picked);
  });

  resetBtn.addEventListener("click", () => {
    resultSec.classList.add("hidden");
    inputCard.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ====== 菜谱总库（仿"魔法活动库"） ====== */
  const libBtn      = $("openChefLibrary");
  const libCount    = $("chefLibCount");
  const libModal    = $("chefLibraryModal");
  const libCloseBtn = $("closeChefLibrary");
  const libFilters  = $("chefRegionFilters");
  const libGrid     = $("chefLibraryGrid");

  // 全量菜谱数（在 extra.js 加载后再读，确保拿到最终值）
  function refreshLibCount() {
    libCount.textContent = (window.CHEF_RECIPES || []).length;
  }
  refreshLibCount();

  // 菜系标签 → 中文显示名（直接从 OPTS.regions 取，找不到就用原值）
  function regionLabel(value) {
    const item = OPTS.regions.find((r) => r.value === value);
    return item ? item.label.replace(/^[^\u4e00-\u9fa5]+/, "") : value;
  }

  // 收集所有菜谱里实际出现过的菜系（去重 + 保留 CHEF_OPTIONS 中的顺序）
  function collectRegions() {
    const set = new Set();
    (window.CHEF_RECIPES || []).forEach((r) => {
      (r.region || []).forEach((reg) => set.add(reg));
    });
    const ordered = OPTS.regions
      .map((r) => r.value)
      .filter((v) => set.has(v));
    // 兜底：如果 recipe 里有 OPTS 里没有的菜系（比如新菜系字符串），也补到末尾
    set.forEach((v) => { if (!ordered.includes(v)) ordered.push(v); });
    return ordered;
  }

  function renderLibFilters(activeRegion) {
    const regions = collectRegions();
    const all = [{ value: "all", label: "全部" }].concat(
      regions.map((v) => ({ value: v, label: regionLabel(v) }))
    );
    libFilters.innerHTML = all.map((r) =>
      `<span class="filter-chip ${r.value === activeRegion ? "active" : ""}" data-region="${r.value}">${r.label}</span>`
    ).join("");

    libFilters.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const reg = chip.dataset.region;
        renderLibFilters(reg);
        renderLibGrid(reg);
      });
    });
  }

  function renderLibGrid(activeRegion) {
    const all = window.CHEF_RECIPES || [];
    const list = activeRegion === "all"
      ? all
      : all.filter((r) => (r.region || []).includes(activeRegion));

    if (!list.length) {
      libGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:40px 0;">这个菜系下还没有菜，去试试别的吧～</div>`;
      return;
    }

    libGrid.innerHTML = list.map((r) => {
      const links = window.buildChefSearchLinks(r);
      const xiachufang = links.find((l) => /下厨房/.test(l.name)) || links[0];
      const tagHtml = (r.region || []).slice(0, 2).map((reg) =>
        `<span class="lib-item-tag">${regionLabel(reg)}</span>`
      ).join("");
      const flavorHtml = (r.flavors || []).slice(0, 2).join(" · ");
      const meta = `⏱ ${r.timeMin}min · ${"🌟".repeat(r.looks || 1)}`;
      return `
        <a class="lib-item chef-lib-item" href="${xiachufang ? xiachufang.url : "#"}" target="_blank" rel="noopener" title="点击去下厨房看做法">
          <div class="chef-lib-head">
            <span class="chef-lib-emoji">${r.emoji || "🍽️"}</span>
            <div class="chef-lib-title-wrap">
              <div class="lib-item-title">${r.name}</div>
              <div class="chef-lib-tags">${tagHtml}</div>
            </div>
          </div>
          <div class="lib-item-desc">${r.desc || ""}</div>
          <div class="chef-lib-meta">${flavorHtml}${flavorHtml ? " · " : ""}${meta}</div>
        </a>
      `;
    }).join("");
  }

  libBtn.addEventListener("click", () => {
    refreshLibCount();
    renderLibFilters("all");
    renderLibGrid("all");
    libModal.classList.remove("hidden");
  });
  libCloseBtn.addEventListener("click", () => libModal.classList.add("hidden"));
  libModal.addEventListener("click", (e) => {
    if (e.target === libModal) libModal.classList.add("hidden");
  });
})();
