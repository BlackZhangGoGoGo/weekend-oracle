/**
 * 看个电影 · 推荐打分 + 渲染
 *
 * 打分维度（每项满分见各函数注释，最终归一化到 0-100，再换算 5 星推荐指数）：
 *   时长 / 心情 / 天气 / 环境 / 时段 / 人数 / 年龄 / 星座 / 类型多样性 / 基础口碑
 */
(function () {
  const $ = (id) => document.getElementById(id);

  const ageEl = $("movieAge");
  const zodiacEl = $("movieZodiac");
  const errorTip = $("movieErrorTip");
  const summonBtn = $("movieSummonBtn");
  const inputCard = $("movieInputCard");
  const resultSec = $("movieResult");
  const mainCardWrap = $("movieMainCard");
  const altListWrap = $("movieAltList");
  const resultSubEl = $("movieResultSub");
  const againBtn = $("movieAgainBtn");
  const resetBtn = $("movieResetBtn");

  // 上一次推荐过的 id，"换一部" 时尽量避开
  let lastRecommendedIds = [];

  function readRadio(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }

  function getInput() {
    return {
      duration: readRadio("duration") || "any",
      mood:     readRadio("mood") || "calm",
      weather:  readRadio("weather") || "cloudy",
      env:      readRadio("env") || "dim",
      time:     readRadio("time") || "evening",
      people:   parseInt(readRadio("people") || "1", 10),
      age:      parseInt(ageEl.value, 10),
      zodiac:   zodiacEl.value || ""
    };
  }

  function validate(input) {
    if (!input.mood) return "选一下心情吧～";
    if (isNaN(input.age) || input.age < 3 || input.age > 99) return "年龄填一下，3-99 岁都行";
    return "";
  }

  // ============ 打分 ============

  // 时长契合度（0-15）
  function scoreDuration(movie, input) {
    const d = movie.duration;
    switch (input.duration) {
      case "short":  return d <= 95  ? 15 : d <= 110 ? 8 : d <= 130 ? 2 : 0;
      case "medium": return d >= 95 && d <= 135 ? 15 : Math.abs(d - 115) < 25 ? 8 : 3;
      case "long":   return d >= 130 ? 15 : d >= 110 ? 7 : 2;
      case "any":    return 10;
      default:       return 8;
    }
  }

  // 心情匹配（0-25，主权重）
  function scoreMood(movie, input) {
    if (!input.mood) return 10;
    if (movie.moods.includes(input.mood)) return 25;
    // 互补：丧了看喜剧也是治愈；压力大看动作爽片也行
    const complement = {
      down: ["happy", "calm"],
      stressed: ["happy", "excited", "calm"],
      lonely: ["calm", "romantic", "happy"],
      excited: ["happy"],
      happy: ["excited", "romantic"],
      curious: ["calm"],
      romantic: ["calm", "happy"],
      calm: ["curious"]
    };
    const alt = complement[input.mood] || [];
    if (alt.some((m) => movie.moods.includes(m))) return 14;
    return 4;
  }

  // 天气契合（0-10）
  function scoreWeather(movie, input) {
    if (!input.weather) return 5;
    if (movie.weather.includes("any")) return 7;
    if (movie.weather.includes(input.weather)) return 10;
    return 3;
  }

  // 环境契合（0-12）
  function scoreEnv(movie, input) {
    if (movie.env.includes("any")) return 8;
    if (movie.env.includes(input.env)) return 12;
    // 冲突惩罚：明亮选了文艺/恐怖反差大
    if (input.env === "bright" && (movie.genres.includes("恐怖") || movie.genres.includes("文艺"))) return 2;
    return 5;
  }

  // 时段契合（0-10）
  function scoreTime(movie, input) {
    if (movie.time.includes("any")) return 6;
    if (movie.time.includes(input.time)) return 10;
    return 3;
  }

  // 人数契合（0-12）
  function scorePeople(movie, input) {
    if (movie.people.includes(9)) return 8;
    if (movie.people.includes(input.people)) return 12;
    // 全家想看，但片子只标 1/2 → 不太合适
    if (input.people === 4 && !movie.people.includes(4)) return 3;
    return 6;
  }

  // 年龄契合（0-12）—— 不合适的年龄段直接重罚
  function scoreAge(movie, input) {
    if (input.age < movie.ageMin) return -20;       // 低于推荐下限：基本不推
    if (input.age > movie.ageMax) return 2;         // 高于上限：不至于排斥
    // 在合理区间内
    return 12;
  }

  // 星座加成（0-8）
  function scoreZodiac(movie, input) {
    if (!input.zodiac || !movie.zodiac) return 0;
    return movie.zodiac.includes(input.zodiac) ? 8 : 0;
  }

  // 基础口碑（0-10）
  function scoreRating(movie) {
    return Math.max(0, Math.min(10, (movie.rating - 7) * 5)); // 7 分=0，9 分=10
  }

  function scoreMovie(movie, input) {
    const breakdown = {
      duration: scoreDuration(movie, input),
      mood:     scoreMood(movie, input),
      weather:  scoreWeather(movie, input),
      env:      scoreEnv(movie, input),
      time:     scoreTime(movie, input),
      people:   scorePeople(movie, input),
      age:      scoreAge(movie, input),
      zodiac:   scoreZodiac(movie, input),
      rating:   scoreRating(movie)
    };
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
    return { total, breakdown };
  }

  // 推荐指数：满分理论上 ~104（不算 zodiac），归一化到 5 星
  function toStars(score) {
    const norm = Math.max(0, Math.min(100, (score / 104) * 100));
    const stars = Math.max(2.5, Math.min(5, 2.5 + (norm / 100) * 2.5));
    return Math.round(stars * 2) / 2; // 保留 0.5 步进
  }

  function buildReason(movie, input, breakdown) {
    const reasons = [];
    if (breakdown.mood >= 25) reasons.push(`正合你"${MOVIE_META.moodMap[input.mood] || input.mood}"的心情`);
    else if (breakdown.mood >= 14) reasons.push("看完情绪能拐个弯");
    if (breakdown.duration >= 15) reasons.push("时长正好");
    if (breakdown.env >= 12) reasons.push(`${MOVIE_META.envMap[input.env]}的环境刚刚好`);
    if (breakdown.weather >= 10) reasons.push(`配${MOVIE_META.weatherMap[input.weather] || input.weather}的天太对了`);
    if (breakdown.time >= 10) reasons.push(`${MOVIE_META.timeMap[input.time]}观感最佳`);
    if (breakdown.people >= 12) {
      const pmap = { 1: "独自", 2: "两人", 3: "好友", 4: "全家" };
      reasons.push(`${pmap[input.people] || ""}观影名单常客`);
    }
    if (breakdown.zodiac > 0) reasons.push(`${input.zodiac}的电波专属频道`);
    if (breakdown.rating >= 8) reasons.push("口碑硬通货");
    return reasons.slice(0, 4);
  }

  // ============ 渲染 ============

  function starString(stars) {
    const full = Math.floor(stars);
    const half = stars - full >= 0.5;
    let s = "★".repeat(full);
    if (half) s += "✬";
    s += "☆".repeat(5 - full - (half ? 1 : 0));
    return s;
  }

  function renderMain(movie, score, stars, reasons) {
    const card = document.createElement("div");
    card.className = "card movie-main-card";
    card.innerHTML = `
      <div class="movie-main-info">
        <div class="movie-title-row">
          <h3 class="movie-title">${movie.title}</h3>
          <span class="movie-year">${movie.year}</span>
        </div>
        <div class="movie-genres">
          ${movie.genres.map(g => `<span class="movie-genre">${g}</span>`).join("")}
        </div>
        <div class="movie-stars-row">
          <span class="movie-stars">${starString(stars)}</span>
          <span class="movie-stars-num">${stars.toFixed(1)} / 5.0</span>
          <span class="movie-rating-pill">🍅 ${movie.rating.toFixed(1)}</span>
        </div>
        <div class="movie-meta">
          <span class="meta-pill">⏱ ${movie.duration} 分钟</span>
          <span class="meta-pill">👥 ${movie.ageMin}-${movie.ageMax === 99 ? "成年" : movie.ageMax} 岁</span>
        </div>
        <p class="movie-desc">${movie.desc}</p>
        <div class="movie-tags">
          ${movie.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
        </div>
        ${reasons.length ? `<div class="movie-reason">🎯 推荐理由：${reasons.join(" · ")}</div>` : ""}
      </div>
    `;
    mainCardWrap.innerHTML = "";
    mainCardWrap.appendChild(card);
  }

  function renderAlts(list) {
    altListWrap.innerHTML = "";
    list.forEach(({ movie, stars }, i) => {
      const item = document.createElement("div");
      item.className = "card movie-alt-card";
      item.style.animationDelay = `${i * 0.08}s`;
      item.innerHTML = `
        <div class="movie-alt-info">
          <div class="movie-alt-title-row">
            <span class="movie-alt-name">${movie.title}</span>
            <span class="movie-alt-year">${movie.year}</span>
          </div>
          <div class="movie-alt-stars">${starString(stars)} <em>${stars.toFixed(1)}</em></div>
          <div class="movie-alt-desc">${movie.desc}</div>
          <div class="movie-alt-meta">
            <span>⏱ ${movie.duration}min</span>
            <span>·</span>
            <span>${movie.genres.slice(0, 2).join(" · ")}</span>
          </div>
        </div>
      `;
      altListWrap.appendChild(item);
    });
  }

  function buildSubText(input) {
    const moodTxt = MOVIE_META.moodMap[input.mood] || "";
    const envTxt  = MOVIE_META.envMap[input.env] || "";
    const timeTxt = MOVIE_META.timeMap[input.time] || "";
    const pMap    = { 1: "1 人", 2: "2 人", 3: "几个朋友", 4: "全家" };
    return `${moodTxt} · ${envTxt} · ${timeTxt} · ${pMap[input.people]} · ${input.age} 岁${input.zodiac ? " · " + input.zodiac : ""}`;
  }

  // ============ 主流程 ============

  function pickAndRender(skipIds = []) {
    const input = getInput();
    const err = validate(input);
    if (err) {
      errorTip.textContent = err;
      return;
    }
    errorTip.textContent = "";

    const scored = window.MOVIES.map((m) => {
      const { total, breakdown } = scoreMovie(m, input);
      return { movie: m, score: total, stars: toStars(total), breakdown };
    });

    // 排除明显年龄不合适的
    let pool = scored.filter((x) => x.breakdown.age >= 0);

    // 第一轮：尽量避开上次推荐过的
    let candidates = pool.filter((x) => !skipIds.includes(x.movie.id));
    if (candidates.length < 3) candidates = pool;

    candidates.sort((a, b) => b.score - a.score);

    if (candidates.length === 0) {
      errorTip.textContent = "片库里暂时没有特别合适的，换个组合试试～";
      return;
    }

    const top = candidates[0];
    const reasons = buildReason(top.movie, input, top.breakdown);

    renderMain(top.movie, top.score, top.stars, reasons);
    renderAlts(candidates.slice(1, 3));

    resultSubEl.textContent = buildSubText(input);
    resultSec.classList.remove("hidden");
    inputCard.classList.add("hidden");

    lastRecommendedIds = candidates.slice(0, 3).map((x) => x.movie.id);

    // 滚到结果
    setTimeout(() => resultSec.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  // ============ 事件 ============
  summonBtn.addEventListener("click", () => pickAndRender([]));

  againBtn.addEventListener("click", () => pickAndRender(lastRecommendedIds));

  resetBtn.addEventListener("click", () => {
    resultSec.classList.add("hidden");
    inputCard.classList.remove("hidden");
    lastRecommendedIds = [];
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 回车提交
  ageEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") pickAndRender([]);
  });
})();
