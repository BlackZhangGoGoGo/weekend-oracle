(() => {
  const $ = (id) => document.getElementById(id);
  const zodiacEl = $("zodiac");
  const ageEl = $("age");
  const numInputs = document.querySelectorAll(".num-input");
  const summonBtn = $("summonBtn");
  const errorTip = $("errorTip");
  const wizard = $("wizard");
  const sparkles = $("sparkles");

  // 新：全屏施法覆盖层
  const castingOverlay = $("castingOverlay");
  const castingSparkles = $("castingSparkles");
  const castingPhase = $("castingPhase");

  const inputCard = $("inputCard");
  const resultCard = $("resultCard");

  const resultCategory = $("resultCategory");
  const resultTitle = $("resultTitle");
  const resultDesc = $("resultDesc");
  const resultDifficulty = $("resultDifficulty");
  const resultPeople = $("resultPeople");
  const resultPlace = $("resultPlace");
  const resultDuration = $("resultDuration");
  const resultReason = $("resultReason");
  const resultQuote = $("resultQuote");

  const againBtn = $("againBtn");
  const resetBtn = $("resetBtn");

  const libCount = $("libCount");
  const openLibrary = $("openLibrary");
  const closeLibrary = $("closeLibrary");
  const libraryModal = $("libraryModal");
  const libraryGrid = $("libraryGrid");
  const categoryFilters = $("categoryFilters");

  let lastInput = null;
  let lastRecommendedId = null;
  // 最近 N 次推荐过的 id 队列（用于"再来一个"时避免重复，保证 5 次内不重样）
  const RECENT_QUEUE_SIZE = 5;
  let recentRecommendedIds = [];
  // "再来一个"点击计数器，用于每次点击时轮换 pickIndex（打破同输入下的定值）
  let againClickCount = 0;

  // 初始化库计数（数据异步加载完成后再刷新）
  function refreshLibCount() {
    libCount.textContent = window.ACTIVITY_LIBRARY.length;
  }
  refreshLibCount();
  document.addEventListener("activities:ready", (e) => {
    refreshLibCount();
    // 展示最近一次更新日期（如果有）
    const meta = e.detail && e.detail.meta;
    if (meta && meta.updated_at && meta.updated_at !== "-") {
      const tip = document.createElement("span");
      tip.style.cssText = "margin-left:8px;color:#c8b7ff;font-size:11px;";
      tip.textContent = `· 最近更新 ${meta.updated_at}`;
      openLibrary.appendChild(tip);
    }
  });

  // ============ 活动库弹层 ============
  function renderLibrary(filterCategory = "all") {
    const list = filterCategory === "all"
      ? window.ACTIVITY_LIBRARY
      : window.ACTIVITY_LIBRARY.filter(a => a.category === filterCategory);

    libraryGrid.innerHTML = list.map(a => `
      <div class="lib-item">
        <span class="lib-item-tag">${window.CATEGORY_NAME[a.category] || a.category}</span>
        <div class="lib-item-title">${a.title}</div>
        <div class="lib-item-desc">${a.desc}</div>
      </div>
    `).join("");
  }

  function renderFilters() {
    const categories = ["all", ...Object.keys(window.CATEGORY_NAME)];
    categoryFilters.innerHTML = categories.map((c, i) => {
      const label = c === "all" ? "全部" : window.CATEGORY_NAME[c];
      return `<span class="filter-chip ${i === 0 ? "active" : ""}" data-cat="${c}">${label}</span>`;
    }).join("");

    categoryFilters.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        categoryFilters.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderLibrary(chip.dataset.cat);
      });
    });
  }

  openLibrary.addEventListener("click", () => {
    renderFilters();
    renderLibrary("all");
    libraryModal.classList.remove("hidden");
  });
  closeLibrary.addEventListener("click", () => libraryModal.classList.add("hidden"));
  libraryModal.addEventListener("click", (e) => {
    if (e.target === libraryModal) libraryModal.classList.add("hidden");
  });

  // ============ 输入校验 ============
  function validateInput() {
    const age = parseInt(ageEl.value, 10);
    if (!age || age < 1 || age > 120) {
      return { ok: false, msg: "年龄填一下呗，1-120 之间" };
    }
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const gender = genderEl ? genderEl.value : "neutral";

    const nums = [];
    for (const input of numInputs) {
      const v = parseInt(input.value, 10);
      if (!v || v < 1 || v > 99) {
        return { ok: false, msg: "三个数字都要填，1-99 之间" };
      }
      nums.push(v);
    }
    return {
      ok: true,
      data: {
        zodiac: zodiacEl.value,
        age,
        gender,
        numbers: nums
      }
    };
  }

  // ============ 推荐算法 ============
  /**
   * 打分规则：
   *  1. 星座元素匹配（tags 包含对应 element）：+30
   *  2. 年龄匹配：年龄越接近活动推荐区间中心，得分越高（连续分数，不是门槛）
   *     + 年龄段气质偏好（不同年龄偏爱不同风格的活动）
   *  3. 三个数字影响"气质"偏好
   *  4. 性别做轻微偏好调整
   *  5. 避免重复上一次推荐
   *  6. 数字+年龄共同做扰动，让任何一个变量改变都会影响最终结果
   */
  const MOOD_BY_REMAINDER = [
    ["热闹", "社交"],        // 0
    ["治愈", "安静"],        // 1
    ["刺激", "挑战"],        // 2
    ["脑洞", "独特"],        // 3
    ["手作", "创意"],        // 4
    ["独处", "安静"],        // 5
    ["健康", "运动"],        // 6
  ];

  // 按年龄段的气质偏好（参考用户研究里的典型倾向，权重不高，仅做"推一下"）
  //   [tagSet, bonusScore]
  function getAgeMoodBonus(age) {
    if (age <= 12)      return { tags: ["创意", "脑洞", "手作", "社交"], detract: ["刺激", "独处"] };
    if (age <= 17)      return { tags: ["社交", "热闹", "脑洞", "独特"], detract: [] };
    if (age <= 25)      return { tags: ["刺激", "挑战", "社交", "独特", "脑洞"], detract: [] };
    if (age <= 35)      return { tags: ["热闹", "社交", "创意", "健康", "手作"], detract: [] };
    if (age <= 45)      return { tags: ["治愈", "健康", "手作", "安静", "创意"], detract: ["刺激"] };
    if (age <= 60)      return { tags: ["治愈", "安静", "独处", "健康", "手作"], detract: ["刺激", "挑战"] };
    return                     { tags: ["治愈", "安静", "独处", "健康"], detract: ["刺激", "挑战", "热闹"] };
  }

  function computeMoodTags(numbers) {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const primary = MOOD_BY_REMAINDER[sum % MOOD_BY_REMAINDER.length];

    // 每个数字的二级气质
    const secondary = [];
    numbers.forEach(n => {
      const m = MOOD_BY_REMAINDER[n % MOOD_BY_REMAINDER.length];
      secondary.push(...m);
    });

    return { primary, secondary, sum };
  }

  // ============ 周末日期推算 ============
  /**
   * 规则：
   *   - 用户点击"召唤"当下 new Date()，推出"本周末"的周六、周日具体日期
   *   - 周一~周四：本周六/周日（即将到来的）
   *   - 周五：明天就是周六
   *   - 周六：今天就是周六，明天周日
   *   - 周日：今天周日，"周六"回看昨天（仍保留周末完整区间）
   *   - 额外返回：与周末的"距离"（0-3 天）、是否处于周末中、季节
   */
  function getWeekendInfo(now = new Date()) {
    const day = now.getDay(); // 0=Sun 1=Mon ... 6=Sat
    let sat, sun;
    if (day === 0) {
      // 今天周日：周日就是 now，周六回看昨天
      sun = new Date(now);
      sat = new Date(now);
      sat.setDate(now.getDate() - 1);
    } else if (day === 6) {
      // 今天周六：周六就是 now，周日 = sat + 1
      sat = new Date(now);
      sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
    } else {
      // 周一至周五：推到最近的周六，再 +1 天得周日（用 sat 克隆，保证跨月正确）
      sat = new Date(now);
      sat.setDate(now.getDate() + (6 - day));
      sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
    }
    // 距离周末的天数（周一=5，周五=1，周六/周日=0）
    let daysUntilWeekend;
    if (day === 0 || day === 6) daysUntilWeekend = 0;
    else daysUntilWeekend = 6 - day;

    const season = getSeason(now.getMonth() + 1);
    const fmt = (d) => `${d.getMonth() + 1}月${d.getDate()}日`;

    return {
      today: now,
      saturday: sat,
      sunday: sun,
      satLabel: fmt(sat),
      sunLabel: fmt(sun),
      isWeekend: day === 0 || day === 6,
      isSaturday: day === 6,
      isSunday: day === 0,
      daysUntilWeekend,
      weekdayName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day],
      month: now.getMonth() + 1,
      season
    };
  }

  function getSeason(month) {
    if (month >= 3 && month <= 5) return "春";
    if (month >= 6 && month <= 8) return "夏";
    if (month >= 9 && month <= 11) return "秋";
    return "冬";
  }

  // 周末气质偏好：周六偏外放，周日偏收心，工作日心向周末
  function getWeekendMoodBonus(info) {
    // 返回 { tags: [...], detract: [...] }
    if (info.isSaturday) {
      return { tags: ["热闹", "社交", "刺激", "挑战", "运动", "脑洞"], detract: [] };
    }
    if (info.isSunday) {
      return { tags: ["治愈", "安静", "独处", "手作", "健康", "创意"], detract: ["刺激"] };
    }
    // 工作日：越临近周末越躁，离得远就偏期待型
    if (info.daysUntilWeekend <= 2) {
      return { tags: ["热闹", "社交", "脑洞", "创意"], detract: [] };
    }
    return { tags: ["创意", "脑洞", "手作"], detract: [] };
  }

  // 季节偏好：春夏推户外，秋治愈，冬室内
  function getSeasonMoodBonus(season) {
    switch (season) {
      case "春": return { tags: ["户外", "运动", "创意", "治愈"], detract: [] };
      case "夏": return { tags: ["户外", "运动", "刺激", "社交"], detract: [] };
      case "秋": return { tags: ["治愈", "手作", "创意", "独处"], detract: [] };
      case "冬": return { tags: ["手作", "治愈", "安静", "热闹"], detract: ["户外"] };
      default:   return { tags: [], detract: [] };
    }
  }

  function scoreActivity(activity, input) {
    let score = 0;
    const element = window.ZODIAC_ELEMENT[input.zodiac];
    const { primary, secondary, sum } = computeMoodTags(input.numbers);
    const weekendInfo = input.weekendInfo;

    // 1. 星座元素匹配
    if (activity.tags.includes(element)) score += 30;

    // 2. 年龄匹配（连续分数：越靠近区间中心，得分越高）
    const [minAge, maxAge] = activity.ageRange;
    const center = (minAge + maxAge) / 2;
    const halfSpan = (maxAge - minAge) / 2;
    if (input.age >= minAge && input.age <= maxAge) {
      // 正常区间：中心满分 25，往边缘线性衰减到 8
      const distRatio = halfSpan > 0 ? Math.abs(input.age - center) / halfSpan : 0;
      score += Math.round(25 - distRatio * 17);
    } else {
      // 超出区间：按距离衰减并扣分（防止给小孩推蹦极）
      const dist = input.age < minAge ? (minAge - input.age) : (input.age - maxAge);
      if (dist <= 3) score += 5;
      else if (dist <= 8) score -= 10;
      else score -= 30;
    }

    // 2b. 年龄段气质偏好（让 20 岁和 40 岁即使都在同个区间，也会偏向不同活动）
    const ageBonus = getAgeMoodBonus(input.age);
    ageBonus.tags.forEach(t => {
      if (activity.tags.includes(t)) score += 8;
    });
    ageBonus.detract.forEach(t => {
      if (activity.tags.includes(t)) score -= 10;
    });

    // 3. 主要气质匹配
    primary.forEach(tag => {
      if (activity.tags.includes(tag)) score += 18;
    });

    // 4. 次要气质匹配（弱权重）
    secondary.forEach(tag => {
      if (activity.tags.includes(tag)) score += 4;
    });

    // 5. 性别的轻微偏好调整
    if (input.gender === "female") {
      if (activity.tags.includes("手作") || activity.tags.includes("治愈")) score += 5;
    } else if (input.gender === "male") {
      if (activity.tags.includes("刺激") || activity.tags.includes("挑战")) score += 5;
    }

    // 5b. 周末时节权重（新增）——让点击的日期直接影响结果
    if (weekendInfo) {
      const weekendBonus = getWeekendMoodBonus(weekendInfo);
      weekendBonus.tags.forEach(t => {
        if (activity.tags.includes(t)) score += 10;
      });
      weekendBonus.detract.forEach(t => {
        if (activity.tags.includes(t)) score -= 8;
      });
      // 季节权重
      const seasonBonus = getSeasonMoodBonus(weekendInfo.season);
      seasonBonus.tags.forEach(t => {
        if (activity.tags.includes(t) || activity.category === t) score += 6;
      });
      seasonBonus.detract.forEach(t => {
        if (activity.category === t) score -= 8;
      });
    }

    // 6. 避免最近 N 次推荐过的（让"再来一个"也能涌出新面孔，但只是降权，不强制踢出 top）
    if (recentRecommendedIds.includes(activity.id)) {
      // 越近的扣得越多
      const recencyIndex = recentRecommendedIds.lastIndexOf(activity.id);
      const recency = recentRecommendedIds.length - recencyIndex; // 1 = 最近一次
      score -= 12 * recency;
    }

    // 7. 数字 + 年龄 + 日期共同做扰动——任何一个输入变了都会重排序
    const dayStamp = weekendInfo
      ? weekendInfo.today.getDate() + weekendInfo.month * 31
      : 0;
    const jitter = (input.numbers[0] * input.numbers[1] * input.numbers[2]
                    + activity.id * 7
                    + input.age * 3
                    + dayStamp) % 11;
    score += jitter;

    return score;
  }

  function recommend(input) {
    const scored = window.ACTIVITY_LIBRARY.map(a => ({
      activity: a,
      score: scoreActivity(a, input)
    })).sort((x, y) => y.score - x.score);

    // 取前 8 名做候选池（之前是 5，扩大让"再来一个"有更多花样）
    const POOL_SIZE = 8;
    const top = scored.slice(0, Math.min(POOL_SIZE, scored.length));

    const dayStamp = input.weekendInfo
      ? input.weekendInfo.today.getDate()
      : 0;
    // 基准索引：保证首次召唤时输入不同结果不同
    const baseIndex = (input.numbers[0] + input.numbers[2] + input.age + dayStamp) % top.length;

    // "再来一个"轮换：每次点击后 againClickCount 自增，让 pickIndex 跨步前进
    // 步长用一个和 top.length 互素的常数（3），避免回到原点
    const stride = 3;
    const startIdx = (baseIndex + againClickCount * stride) % top.length;

    // 从 startIdx 顺序往后找：跳过最近 N 次出过的 id；如果整圈都被跳过，就允许重复
    for (let i = 0; i < top.length; i++) {
      const idx = (startIdx + i) % top.length;
      const candidate = top[idx].activity;
      if (!recentRecommendedIds.includes(candidate.id)) {
        return candidate;
      }
    }
    // 兜底：全队都重了，直接返回起点（顺便清空队列重新开始）
    recentRecommendedIds = [];
    return top[startIdx].activity;
  }

  // 把刚推荐的 id 推进最近队列
  function pushRecent(id) {
    recentRecommendedIds.push(id);
    if (recentRecommendedIds.length > RECENT_QUEUE_SIZE) {
      recentRecommendedIds.shift();
    }
  }

  // ============ 金句池 ============
  // 按"气质"分组，每组混搭：诗词 / 名言 / 经典台词 / 热梗
  // source 用来标注出处，让用户知道这话是哪儿来的
  const QUOTE_POOL = {
    "热闹": [
      { text: "人生得意须尽欢，莫使金樽空对月。", source: "李白《将进酒》" },
      { text: "如果开心是一种选择，那今天请你务必多选一点。", source: "网络热梗" },
      { text: "有故事的人，总是热闹里最安静的那个——但今晚，我们都去当热闹里最响的那个。", source: "员工A 原创" },
      { text: "来都来了。", source: "当代四大哲学之一" },
      { text: "Life is a party, dress like it.", source: "Audrey Hepburn（传）" }
    ],
    "治愈": [
      { text: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。", source: "苏轼《定风波》" },
      { text: "愿你一生清澈明朗，从此再无风雨。", source: "网络金句" },
      { text: "我不期待人生一帆风顺，只希望能在风浪里，抓住一根浮木好好歇一歇。", source: "《请回答1988》" },
      { text: "不是日子过得慢了，是你终于愿意慢下来陪自己。", source: "员工A 原创" },
      { text: "Take a deep breath. You're doing better than you think.", source: "匿名" }
    ],
    "刺激": [
      { text: "大鹏一日同风起，扶摇直上九万里。", source: "李白《上李邕》" },
      { text: "要么庸俗，要么孤独。", source: "叔本华" },
      { text: "人固有一死，或重于泰山，或轻过弹簧——反正都得跳一下。", source: "网络改编" },
      { text: "你不疯狂一次，你都不知道自己能到哪儿。", source: "《飞驰人生》" },
      { text: "Fortune favors the bold.", source: "拉丁谚语" }
    ],
    "挑战": [
      { text: "千磨万击还坚劲，任尔东西南北风。", source: "郑板桥《竹石》" },
      { text: "我命由我不由天。", source: "《哪吒之魔童降世》" },
      { text: "你可以永远相信自己——只要你肯试一下。", source: "员工A 原创" },
      { text: "打工人，打工魂，打工都是人上人——今天换个方式卷自己。", source: "网络热梗" },
      { text: "The comfort zone is a beautiful place, but nothing ever grows there.", source: "匿名" }
    ],
    "脑洞": [
      { text: "不疯魔，不成活。", source: "《霸王别姬》" },
      { text: "想象力比知识更重要。", source: "爱因斯坦" },
      { text: "正经人谁写日记啊。", source: "《邪不压正》" },
      { text: "人类的悲欢并不相通，我只觉得他们吵闹——但这次的吵闹，我想加入。", source: "鲁迅+原创" },
      { text: "Stay hungry, stay foolish.", source: "Steve Jobs" }
    ],
    "独特": [
      { text: "天生我材必有用。", source: "李白《将进酒》" },
      { text: "世界上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。", source: "罗曼·罗兰" },
      { text: "要做一件怪事，怪到别人都记得你。", source: "员工A 原创" },
      { text: "我不是针对谁，我是说在座的各位……今天都该去干点不一样的。", source: "《破坏之王》化用" },
      { text: "Be yourself; everyone else is already taken.", source: "Oscar Wilde" }
    ],
    "手作": [
      { text: "慢工出细活，细活养心神。", source: "民间俗语" },
      { text: "真正的奢侈，是用双手做出只属于自己的那一件。", source: "员工A 原创" },
      { text: "一花一世界，一叶一菩提。", source: "《华严经》" },
      { text: "生活不是等待风暴过去，而是学会在雨中跳舞——顺便自己搭个舞台。", source: "改编谚语" },
      { text: "Craft is what we can do. Art is what happens when we stop trying.", source: "匿名" }
    ],
    "创意": [
      { text: "山重水复疑无路，柳暗花明又一村。", source: "陆游《游山西村》" },
      { text: "Creativity is intelligence having fun.", source: "Albert Einstein（传）" },
      { text: "所有伟大的想法，都始于一个荒谬的念头。", source: "员工A 原创" },
      { text: "我只是想看看我有没有这种可能。", source: "《喜剧之王》周星驰" },
      { text: "不要温和地走进那个良夜。", source: "狄兰·托马斯" }
    ],
    "独处": [
      { text: "独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。", source: "王维《竹里馆》" },
      { text: "孤独是一个人的狂欢。", source: "刘同" },
      { text: "我喜欢独处，这是我与这个世界温柔相处的方式。", source: "网络金句" },
      { text: "一个人吃火锅，一个人去旅行，一个人听歌——其实你也没那么可怜。", source: "员工A 原创" },
      { text: "The best thing about being alone is hearing yourself think again.", source: "匿名" }
    ],
    "安静": [
      { text: "行到水穷处，坐看云起时。", source: "王维《终南别业》" },
      { text: "宁静以致远，淡泊以明志。", source: "诸葛亮《诫子书》" },
      { text: "世界那么吵，你不必什么都回应。", source: "网络金句" },
      { text: "不是所有的答案都要立刻有，有些事慢慢想比较好。", source: "员工A 原创" },
      { text: "In the silence, we find what we didn't know we were looking for.", source: "匿名" }
    ],
    "社交": [
      { text: "有朋自远方来，不亦乐乎？", source: "《论语》" },
      { text: "你的朋友圈决定你的人生高度。", source: "流行管理学" },
      { text: "世间所有的相遇都是久别重逢。", source: "《一代宗师》" },
      { text: "社交电量又满格了，今天放开了聊吧！", source: "网络热梗" },
      { text: "We're all just walking each other home.", source: "Ram Dass" }
    ],
    "健康": [
      { text: "流水不腐，户枢不蠹。", source: "《吕氏春秋》" },
      { text: "照顾好身体，它是你抵达一切远方的船。", source: "员工A 原创" },
      { text: "今天不运动的你，明天会被体检报告运动。", source: "员工A 原创" },
      { text: "三分练，七分吃——但今天主要是练。", source: "健身圈名言" },
      { text: "Take care of your body. It's the only place you have to live.", source: "Jim Rohn" }
    ],
    "运动": [
      { text: "天行健，君子以自强不息。", source: "《周易》" },
      { text: "Just do it.", source: "Nike" },
      { text: "跑步使人冷静，跳绳使人清醒，撸铁使人自信——挑一个。", source: "员工A 原创" },
      { text: "你汗水的咸度，是明天对自己满意度的甜度。", source: "改编网络金句" },
      { text: "Pain is temporary, pride is forever.", source: "Lance Armstrong" }
    ],
    "沙雕": [
      { text: "生而为人，抱歉要这么快乐。", source: "网络改编《人间失格》" },
      { text: "你今天不疯一下，明天人家都在疯了你还在背单词。", source: "员工A 原创" },
      { text: "宇宙的尽头是编制，但今晚的尽头是快乐。", source: "网络热梗" },
      { text: "干啥啥不行，整活第一名。", source: "网络热梗" },
      { text: "没事，就当交学费了——学的是快乐。", source: "中国人生哲学" }
    ]
  };

  // 兜底池（任何气质都能配）
  const QUOTE_DEFAULT = [
    { text: "世事洞明皆学问，人情练达即文章——但今天不学习，就玩。", source: "《红楼梦》+改" },
    { text: "生活本来就没有答案，做自己觉得对的事就好。", source: "员工A 原创" },
    { text: "如果你不能改变方向，至少可以改变心情。", source: "匿名" },
    { text: "好好生活，慢慢相遇。", source: "网络金句" },
    { text: "Do more things that make you forget to check your phone.", source: "匿名" }
  ];

  function pickQuote(input, activity) {
    const { primary, secondary, sum } = computeMoodTags(input.numbers);
    // 收集所有可用池：主气质 > 次气质 > 活动 tags > 兜底
    const pools = [];
    primary.forEach(t => { if (QUOTE_POOL[t]) pools.push(QUOTE_POOL[t]); });
    secondary.forEach(t => { if (QUOTE_POOL[t]) pools.push(QUOTE_POOL[t]); });
    activity.tags.forEach(t => { if (QUOTE_POOL[t]) pools.push(QUOTE_POOL[t]); });
    if (pools.length === 0) pools.push(QUOTE_DEFAULT);

    // 用数字和活动 id 做稳定选择——同一套输入出同一句金句
    const poolIdx = (sum + activity.id) % pools.length;
    const pool = pools[poolIdx];
    const quoteIdx = (input.numbers[0] * 3 + input.numbers[1] + activity.id) % pool.length;
    return pool[quoteIdx];
  }

  // ============ 解读文案 ============
  /**
   * 丰富版解读：
   *   - 周末日期前置（"本周六 X月X日"）
   *   - 星座元素 + 年龄段气质 + 数字节奏 + 季节宜忌 融合
   *   - 总长度控制在 ≤200 字（中文字符计）
   */
  // 数字 1~9 的小性格标签（用来给输入数字做解读）
  const DIGIT_TRAIT = {
    1: "独行",
    2: "双人同频",
    3: "灵感炸开",
    4: "稳稳的踏实",
    5: "说走就走",
    6: "温柔",
    7: "神秘感",
    8: "顺风顺水",
    9: "圆满收束"
  };

  // 数字总和（3~27）的节奏段位
  function numberSumVibe(sum) {
    if (sum <= 8)  return "慢节奏，今天适合把步子放小一点";
    if (sum <= 14) return "中等热度，起伏刚刚好";
    if (sum <= 20) return "能量在线，适合给自己加一点戏";
    return "高能量，今天不折腾一下白过";
  }

  // 拼一句"数字解读"——三个数字 + 总和节奏，带轻微轮换，不至于每次都一模一样
  function buildNumberLine(numbers) {
    const [a, b, c] = numbers;
    const ta = DIGIT_TRAIT[a] || "";
    const tb = DIGIT_TRAIT[b] || "";
    const tc = DIGIT_TRAIT[c] || "";
    const sum = a + b + c;
    const vibe = numberSumVibe(sum);

    const templates = [
      `你挑的 ${a}·${b}·${c}——一个管"${ta}"、一个管"${tb}"、一个管"${tc}"，凑成 ${sum}，${vibe}。`,
      `${a}·${b}·${c} 三个数字（"${ta}"+"${tb}"+"${tc}"）加起来 ${sum}，${vibe}。`,
      `数字 ${a}、${b}、${c} 分别指向"${ta}""${tb}""${tc}"，总和 ${sum}，${vibe}。`
    ];
    return templates[sum % templates.length];
  }

  function generateReason(input, activity) {
    const element = window.ZODIAC_ELEMENT[input.zodiac];
    const elName = window.ELEMENT_DESC[element].name;
    const elTrait = window.ELEMENT_DESC[element].trait;
    const { primary, sum } = computeMoodTags(input.numbers);
    const numStr = input.numbers.join("·");
    const info = input.weekendInfo;

    const callMap = {
      female: "小姐姐",
      male: "小哥",
      neutral: "朋友"
    };
    const call = callMap[input.gender] || callMap.neutral;

    // 年龄段简短气质描述
    const ageTone = (() => {
      if (input.age <= 17) return "正年轻，专属精力值拉满";
      if (input.age <= 25) return "年轻气盛，适合折腾点大的";
      if (input.age <= 35) return "正是浪得起也稳得住的时候";
      if (input.age <= 45) return "该给自己一点心安的节奏了";
      if (input.age <= 60) return "舒坦，比热闹重要";
      return "松弛，比什么都值钱";
    })();

    // 数字解读（新增）
    const numberLine = buildNumberLine(input.numbers);

    // 周末引子（根据今天是工作日/周六/周日，以及和周末的距离）
    let weekendLead;
    if (!info) {
      weekendLead = `${input.zodiac}·${input.age}岁的${call}，`;
    } else if (info.isSaturday) {
      weekendLead = `今天就是周六（${info.satLabel}），${input.zodiac}的${call}，`;
    } else if (info.isSunday) {
      weekendLead = `周日（${info.sunLabel}）到了，${input.zodiac}的${call}，`;
    } else if (info.daysUntilWeekend === 1) {
      weekendLead = `再撑一天就是周六（${info.satLabel}），${input.zodiac}的${call}先把这事定下：`;
    } else {
      weekendLead = `本周末（${info.satLabel} 周六 / ${info.sunLabel} 周日）还有 ${info.daysUntilWeekend} 天，${input.zodiac}的${call}，`;
    }

    // 季节宜句
    const seasonLine = info
      ? ({
          "春": "眼下春风正好，户外比室内多三分活。",
          "夏": "正值盛夏，太阳底下也有人替你撑腰。",
          "秋": "秋意渐浓，适合把心思往回收一点。",
          "冬": "天冷归天冷，屋里也能热热闹闹。"
        })[info.season] || ""
      : "";

    // 周末宜忌（和推荐气质挂钩）
    const weekendVibe = info
      ? (info.isSunday
          ? `周日的你宜"${primary[0]}"，忌把行程排太满。`
          : info.isSaturday
            ? `周六的你宜"${primary[0]}·${primary[1]}"，放开了整。`
            : `到了周末，你属"${primary[0]}·${primary[1]}"的频率。`)
      : `你的数字 ${numStr}（总和 ${sum}）落在"${primary[0]}"这一格。`;

    // 核心句
    const core = `${element ? elName + "座的灵魂" : "你"}本就${elTrait}，${ageTone}。`;

    // 落到活动上
    const landing = `魔法棒一挥，${activity.title}——就是为这份心情写的剧本。`;

    // 组装：周末引子 + 核心 + 数字解读 + 周末宜忌 + 季节 + 落地
    let text = `${weekendLead}${core}${numberLine}${weekendVibe}${seasonLine}${landing}`;

    // 200 字保护（中文按字符数）。超了就逐段砍最容易牺牲的
    if ([...text].length > 200) {
      // 先去掉季节句
      text = `${weekendLead}${core}${numberLine}${weekendVibe}${landing}`;
    }
    if ([...text].length > 200) {
      // 再去掉核心句（保留数字解读，因为这是本轮新增的重点）
      text = `${weekendLead}${numberLine}${weekendVibe}${landing}`;
    }
    if ([...text].length > 200) {
      // 再砍周末宜忌
      text = `${weekendLead}${numberLine}${landing}`;
    }
    if ([...text].length > 200) {
      // 实在超就硬截
      text = [...text].slice(0, 198).join("") + "…";
    }
    return text;
  }

  // ============ 施法动画 ============
  // ============ 施法动画 ============
  // 施法过程中轮播的提示文案，营造"真的在占卜"的节奏感
  const CASTING_PHASES = [
    "魔法小人正在占卜中",
    "正在解读星座能量",
    "数字在水晶球里排列",
    "活动正在从宇宙浮现"
  ];

  // ============ 魔法音效（Web Audio 合成，零资源） ============
  // 设计思路：
  //  - 低频"嗡嗡"持续垫底：营造魔法阵蓄能的氛围
  //  - 中高频"风铃"叮咚：每隔一小段时间随机叮一下，像水晶球里的光点
  //  - 结束时一段"叮~✨"上升音阶：揭晓时刻的仪式感
  //  - 全部用振荡器 + 包络合成，不引入任何音频文件
  const SOUND_KEY = "weekendOracle:soundEnabled";
  const soundToggleBtn = $("soundToggle");
  let soundEnabled = localStorage.getItem(SOUND_KEY) !== "0"; // 默认开
  let audioCtx = null;
  let castingNodes = null; // 当前施法中的节点，便于中途停掉

  function syncSoundUI() {
    if (!soundToggleBtn) return;
    soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
    soundToggleBtn.classList.toggle("muted", !soundEnabled);
    soundToggleBtn.setAttribute(
      "title",
      soundEnabled ? "施法音效：开（点一下关闭）" : "施法音效：关（点一下开启）"
    );
  }
  syncSoundUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem(SOUND_KEY, soundEnabled ? "1" : "0");
      syncSoundUI();
      // 如果关闭时正在播放，立刻停掉
      if (!soundEnabled && castingNodes) {
        stopCastingSound(0);
      }
    });
  }

  function ensureAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    // 某些浏览器 ctx 初始挂起，需要 resume（用户点击后调用没问题）
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // 启动施法背景音：一个低频的嗡嗡垫底 + 随机"叮"
  function startCastingSound() {
    if (!soundEnabled) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.25, now + 0.15);
    master.connect(ctx.destination);

    // 1) 低频嗡嗡：两个略有偏差的正弦做成厚一点的 pad
    const pad1 = ctx.createOscillator();
    const pad2 = ctx.createOscillator();
    pad1.type = "sine";
    pad2.type = "sine";
    pad1.frequency.value = 110;   // A2
    pad2.frequency.value = 110 * 1.01; // 轻微失谐更有"魔法感"
    const padGain = ctx.createGain();
    padGain.gain.value = 0.35;
    pad1.connect(padGain);
    pad2.connect(padGain);

    // 低通滤波，让嗡嗡更柔和
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    padGain.connect(lp);
    lp.connect(master);

    pad1.start(now);
    pad2.start(now);

    // 2) 随机"叮咚"：每隔 180~340ms 来一下，音高在五声音阶里挑
    const scale = [523.25, 587.33, 659.25, 783.99, 880]; // C5 D5 E5 G5 A5
    let dingTimeout;
    function scheduleDing() {
      if (!soundEnabled || !castingNodes) return;
      const f = scale[Math.floor(Math.random() * scale.length)];
      playBell(ctx, master, f, 0.12);
      dingTimeout = setTimeout(scheduleDing, 180 + Math.random() * 160);
    }
    dingTimeout = setTimeout(scheduleDing, 200);

    castingNodes = {
      ctx,
      master,
      pad1,
      pad2,
      stopDing: () => clearTimeout(dingTimeout)
    };
  }

  // 停止施法背景音（fadeOut 秒内淡出）
  function stopCastingSound(fadeOut = 0.25) {
    if (!castingNodes) return;
    const { ctx, master, pad1, pad2, stopDing } = castingNodes;
    stopDing();
    const now = ctx.currentTime;
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + fadeOut);
      pad1.stop(now + fadeOut + 0.02);
      pad2.stop(now + fadeOut + 0.02);
    } catch (e) { /* ignore */ }
    castingNodes = null;
  }

  // 一次"叮"：三角波 + 快速包络模拟铃声
  function playBell(ctx, destination, freq, duration) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(g);
    g.connect(destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // 揭晓时的上升音阶"叮~✨"
  function playRevealChime() {
    if (!soundEnabled) return;
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    const notes = [659.25, 783.99, 987.77, 1318.51]; // E5 G5 B5 E6
    notes.forEach((f, i) => {
      setTimeout(() => playBell(ctx, master, f, 0.45), i * 90);
    });
    // 80ms 的软"whoosh"——用短促的白噪声模拟
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.15;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1200;
    noise.connect(hp); hp.connect(nGain); nGain.connect(master);
    noise.start();
  }

  function startCasting() {
    // 老位置的小人也继续动（页面滚回去也能看到）
    wizard.classList.remove("idle");
    wizard.classList.add("casting");

    // 显示全屏覆盖层
    castingOverlay.classList.remove("hidden");
    castingOverlay.setAttribute("aria-hidden", "false");

    // 启动魔法音效
    startCastingSound();

    // 阶段文案轮播
    let phaseIdx = 0;
    if (castingPhase) castingPhase.textContent = CASTING_PHASES[0];
    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % CASTING_PHASES.length;
      if (castingPhase) castingPhase.textContent = CASTING_PHASES[phaseIdx];
    }, 600);

    // 粒子：两处同时喷，但覆盖层那边的更密更大
    const particleInterval = setInterval(() => {
      spawnSparkle(sparkles, { small: true });
      // 覆盖层里每次出 2 颗，更有节日感
      spawnSparkle(castingSparkles, { small: false });
      spawnSparkle(castingSparkles, { small: false });
    }, 70);

    return () => {
      clearInterval(particleInterval);
      clearInterval(phaseInterval);
      wizard.classList.remove("casting");
      wizard.classList.add("idle");
      // 淡出覆盖层
      castingOverlay.classList.add("hidden");
      castingOverlay.setAttribute("aria-hidden", "true");

      // 音效：先停背景嗡嗡，再叠加一段揭晓音阶
      stopCastingSound(0.2);
      playRevealChime();
    };
  }

  function spawnSparkle(container, { small }) {
    if (!container) return;
    const s = document.createElement("div");
    s.className = "sparkle";
    if (small) {
      // 老容器里的小粒子（视觉一致）
      const startX = 50 + (Math.random() - 0.5) * 20;
      const startY = 50 + (Math.random() - 0.5) * 20;
      s.style.left = startX + "%";
      s.style.top = startY + "%";
      s.style.setProperty("--dx", ((Math.random() - 0.5) * 120) + "px");
      s.style.setProperty("--dy", (-80 - Math.random() * 60) + "px");
    } else {
      // 覆盖层中央向四周喷射
      s.style.left = "50%";
      s.style.top = "50%";
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    }
    const colors = ["#ffd86b", "#ff7ae6", "#8b5cf6", "#fff"];
    const c = colors[Math.floor(Math.random() * colors.length)];
    s.style.background = c;
    s.style.color = c;
    container.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }

  // ============ 渲染结果 ============
  const DIFFICULTY_STAR = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  function renderWeekendBadge(info) {
    // 在结果卡标题上方插一条"这个周末"徽标；若已存在则更新
    if (!info) return;
    const header = document.querySelector("#resultCard .result-header");
    if (!header) return;
    let badge = document.getElementById("weekendBadge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "weekendBadge";
      badge.className = "weekend-badge";
      header.parentNode.insertBefore(badge, header);
    }
    let label;
    if (info.isSaturday) {
      label = `今天就是周六 · ${info.satLabel}`;
    } else if (info.isSunday) {
      label = `今天就是周日 · ${info.sunLabel}`;
    } else {
      label = `这个周末 · ${info.satLabel} 周六 / ${info.sunLabel} 周日`;
    }
    badge.innerHTML = `<span class="wb-icon">📅</span><span class="wb-text">${label}</span>`;
  }

  function showResult(activity, input) {
    renderWeekendBadge(input.weekendInfo);
    resultCategory.textContent = window.CATEGORY_NAME[activity.category] || activity.category;
    resultTitle.textContent = activity.title;
    resultDesc.textContent = activity.desc;
    resultDifficulty.textContent = DIFFICULTY_STAR(activity.difficulty);
    resultPeople.textContent = activity.people;
    resultPlace.textContent = activity.place;
    resultDuration.textContent = activity.duration;

    // 先放金句，再放解读
    const quote = pickQuote(input, activity);
    resultQuote.innerHTML = `${quote.text}<span class="quote-source">—— ${quote.source}</span>`;
    resultReason.textContent = generateReason(input, activity);

    inputCard.classList.add("hidden");
    resultCard.classList.remove("hidden");
    lastRecommendedId = activity.id;
    pushRecent(activity.id);

    // 手机上结果出来后滚回页面顶部，让用户看到魔法小人 + 结果卡
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ============ 主流程 ============
  function handleSummon() {
    if (!window.ACTIVITY_LIBRARY || window.ACTIVITY_LIBRARY.length === 0) {
      errorTip.textContent = "活动库还在加载中，稍等一下再召唤～";
      return;
    }
    const v = validateInput();
    if (!v.ok) {
      errorTip.textContent = v.msg;
      return;
    }
    errorTip.textContent = "";
    // 推算"这个周末"——按点击召唤的当下时刻算
    v.data.weekendInfo = getWeekendInfo(new Date());
    lastInput = v.data;
    // 重新召唤：清空最近队列和"再来一个"计数，让体验像全新的一次
    recentRecommendedIds = [];
    againClickCount = 0;

    summonBtn.disabled = true;
    summonBtn.querySelector("span").textContent = "✨ 占卜中...";

    const stopCasting = startCasting();

    // 施法 2 秒
    setTimeout(() => {
      stopCasting();
      const picked = recommend(lastInput);
      showResult(picked, lastInput);

      summonBtn.disabled = false;
      summonBtn.querySelector("span").textContent = "🪄 召唤活动";
    }, 2000);
  }

  summonBtn.addEventListener("click", handleSummon);

  // "再来一个"——换一个推荐（沿用上次的 weekendInfo，确保仍是给这个周末的）
  againBtn.addEventListener("click", () => {
    if (!lastInput) return;
    againClickCount++; // 每点一次都推进轮换步长
    resultCard.classList.add("hidden");
    const stopCasting = startCasting();
    setTimeout(() => {
      stopCasting();
      const picked = recommend(lastInput);
      showResult(picked, lastInput);
    }, 1200);
  });

  // 重新填
  resetBtn.addEventListener("click", () => {
    resultCard.classList.add("hidden");
    inputCard.classList.remove("hidden");
    numInputs.forEach(i => i.value = "");
    ageEl.value = "";
    lastRecommendedId = null;
  });

  // 回车键提交
  [ageEl, ...numInputs].forEach(el => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSummon();
    });
  });
})();
