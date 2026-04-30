/**
 * 溜娃神器 · 交互与渲染
 */
(function () {
  const $ = (id) => document.getElementById(id);

  const cityEl = $("kidsCity");
  const ageEl = $("kidsAge");
  const boyCountEl = $("boyCount");
  const girlCountEl = $("girlCount");
  const errorTip = $("kidsErrorTip");
  const summonBtn = $("kidsSummonBtn");
  const inputCard = $("kidsInputCard");
  const resultSec = $("kidsResult");
  const spotList = $("kidsSpotList");
  const tipsList = $("kidsTipsList");
  const resultCountEl = $("kidsResultCount");
  const resultSubEl = $("kidsResultSub");
  const againBtn = $("kidsAgainBtn");
  const resetBtn = $("kidsResetBtn");

  // 数量加减
  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepper = btn.closest(".count-stepper");
      const target = $(stepper.dataset.target);
      const step = parseInt(btn.dataset.step, 10);
      let val = parseInt(target.textContent, 10) || 0;
      val = Math.max(0, Math.min(6, val + step));
      target.textContent = val;
    });
  });

  // 年龄快捷标签
  document.querySelectorAll(".age-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      document.querySelectorAll(".age-tag").forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");
      ageEl.value = tag.dataset.age;
    });
  });

  function getInput() {
    const city = cityEl.value;
    const trip = document.querySelector('input[name="trip"]:checked')?.value || "family";
    const age = parseInt(ageEl.value, 10);
    const boyCount = parseInt(boyCountEl.textContent, 10) || 0;
    const girlCount = parseInt(girlCountEl.textContent, 10) || 0;
    return { city, trip, age, boyCount, girlCount };
  }

  function validate(input) {
    if (!input.city) return "请选择城市～";
    if (isNaN(input.age) || input.age < 0 || input.age > 16) return "宝宝年龄请填 0-16 之间的数字";
    if (input.boyCount + input.girlCount <= 0) return "至少要有 1 个宝宝哦 👶";
    return "";
  }

  function renderSpots(picked) {
    spotList.innerHTML = "";
    picked.forEach(({ spot, reasons }, i) => {
      const card = document.createElement("div");
      card.className = "card kids-spot-card";
      card.style.animationDelay = `${i * 0.08}s`;

      const indoorLabel =
        spot.indoor === true ? "🏠 室内" :
        spot.indoor === false ? "🌳 户外" : "🌤️ 半室内外";

      card.innerHTML = `
        <div class="kids-spot-head">
          <span class="kids-spot-type">${spot.type}</span>
          <h3 class="kids-spot-name">${spot.name}</h3>
        </div>
        <p class="kids-spot-desc">${spot.desc}</p>
        <div class="kids-spot-meta">
          <span class="meta-pill">👶 ${spot.ageMin}-${spot.ageMax} 岁</span>
          <span class="meta-pill">⏱ ${spot.duration}</span>
          <span class="meta-pill">💰 ${spot.cost}</span>
          <span class="meta-pill">${indoorLabel}</span>
        </div>
        <div class="kids-spot-tags">
          ${spot.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
        </div>
        <div class="kids-spot-tips">💡 ${spot.tips}</div>
        ${reasons.length ? `<div class="kids-spot-reason">🎯 推荐理由：${reasons.join(" · ")}</div>` : ""}
      `;
      spotList.appendChild(card);
    });
  }

  function renderTips(tips) {
    tipsList.innerHTML = tips.map(t => `<li>${t}</li>`).join("");
  }

  function buildSubText(input) {
    const tripMap = { solo: "独自带娃", family: "家庭出行", group: "结伴出行" };
    const total = input.boyCount + input.girlCount;
    const kidsDesc = [];
    if (input.boyCount) kidsDesc.push(`${input.boyCount} 个男宝`);
    if (input.girlCount) kidsDesc.push(`${input.girlCount} 个女宝`);
    return `${input.city} · ${tripMap[input.trip]} · ${kidsDesc.join("+")} · 最小娃 ${input.age} 岁`;
  }

  function run() {
    const input = getInput();
    const err = validate(input);
    if (err) {
      errorTip.textContent = err;
      errorTip.style.opacity = 1;
      return;
    }
    errorTip.textContent = "";

    const picked = window.pickKidsSpots(input);
    const tips = window.buildKidsTips(input);

    resultCountEl.textContent = picked.length;
    resultSubEl.textContent = buildSubText(input);
    renderSpots(picked);
    renderTips(tips);

    inputCard.classList.add("hidden");
    resultSec.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  summonBtn.addEventListener("click", run);

  againBtn.addEventListener("click", () => {
    const input = getInput();
    const picked = window.pickKidsSpots(input);
    renderSpots(picked);
  });

  resetBtn.addEventListener("click", () => {
    resultSec.classList.add("hidden");
    inputCard.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
