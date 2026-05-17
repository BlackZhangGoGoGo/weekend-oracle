/**
 * 看个电影 · 观影渠道按钮
 *
 * 给每部电影按"地区/类型"匹配一组「去哪看」按钮，点击跳到该平台的搜索结果页
 * （而非具体播放页 —— 因为版权状态会变，搜索页永不失效）。
 *
 * 暴露：
 *   - window.MOVIE_WATCH.getProviders(movie) → [{ id, name, emoji, url }, ...]
 *   - window.MOVIE_WATCH.guessRegion(movie)  → "cn" | "jp" | "kr" | "us" | "art"
 *   - window.MOVIE_WATCH.renderButtons(movie) → HTML 字符串
 */
(function () {
  // ---------- 平台搜索 URL 模板 ----------
  // encodeURIComponent 防止特殊字符跑偏；标题只用片名，年份不加（搜索匹配率更高）
  const PROVIDERS = {
    bili: {
      id: "bili",
      name: "B站",
      emoji: "📺",
      build: (q) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(q)}`
    },
    iqiyi: {
      id: "iqiyi",
      name: "爱奇艺",
      emoji: "🎞",
      build: (q) => `https://so.iqiyi.com/so/q_${encodeURIComponent(q)}`
    },
    qqv: {
      id: "qqv",
      name: "腾讯视频",
      emoji: "🐧",
      build: (q) => `https://v.qq.com/x/search/?q=${encodeURIComponent(q)}`
    },
    youku: {
      id: "youku",
      name: "优酷",
      emoji: "▶️",
      build: (q) => `https://so.youku.com/search_video/q_${encodeURIComponent(q)}`
    },
    douban: {
      id: "douban",
      name: "豆瓣",
      emoji: "📖",
      build: (q) => `https://www.douban.com/search?cat=1002&q=${encodeURIComponent(q)}`
    },
    letterboxd: {
      id: "letterboxd",
      name: "Letterboxd",
      emoji: "🎬",
      build: (q) => `https://letterboxd.com/search/${encodeURIComponent(q)}/`
    },
    imdb: {
      id: "imdb",
      name: "IMDb",
      emoji: "⭐",
      build: (q) => `https://www.imdb.com/find/?q=${encodeURIComponent(q)}&s=tt&ttype=ft`
    }
  };

  // ---------- 启发式判断 region ----------
  // 因为所有片名/简介都已中译，不能用「含汉字」判断华语片。
  // 只能靠 tags/desc 里的"硬线索"：导演名 / 国家标记 / 特定厂牌。
  //
  // 优先级：覆盖表 > jp / kr / cn 强线索 > us 视效大厂线索 > art > 默认 us

  // 覆盖表：靠 hints 救不回来的几部异常片，强行指定 region
  // 每加一部都要附理由，方便以后维护
  const REGION_OVERRIDE = {
    "eat-your-pancreas":  "jp", // 我想吃掉你的胰脏 - tags/desc 都没日影特征
    "spider-verse":       "us", // 蜘蛛侠：纵横宇宙 - 索尼出品
    "lord-of-the-rings":  "us", // 指环王 - 新西兰拍的好莱坞
    "amelie":             "art" // 天使爱美丽 - 法语片，更适合 Letterboxd 优先
  };

  // 强线索：日影/日漫
  const JP_HINTS = [
    "宫崎骏", "新海诚", "今敏", "细田守", "汤浅政明", "高畑勋", "押井守",
    "是枝裕和", "黑泽明", "小津安二郎", "岩井俊二", "北野武", "山田洋次",
    "园子温", "三池崇史", "深田晃司", "滨口龙介", "维姆·文德斯", "文德斯",
    "庵野秀明", "新房昭之", "山田尚子", "原惠一", "木村拓哉", "树木希林",
    "久石让", "坂本龙一",
    "吉卜力", "京阿尼", "京都动画", "东宝", "Studio Ghibli",
    "日影", "日漫", "日本动画", "日本电影", "日剧", "日系",
    "四季美食", "独居治愈", "工匠精神",
    // desc 里的地名
    "东京", "大阪", "京都", "北海道", "横滨", "镰仓", "札幌", "冲绳", "雪国",
    "日本人", "和食", "便当", "山野小村", "日本"
  ];

  // 强线索：韩影
  const KR_HINTS = [
    "奉俊昊", "朴赞郁", "李沧东", "金基德", "洪常秀", "罗泓轸", "黄东赫",
    "李濬益", "延尚昊", "金成勋", "罗宏镇", "宋康昊", "李秉宪", "全度妍",
    "韩影", "韩国电影", "韩剧", "韩国神片", "韩国",
    // desc 地名
    "首尔", "釜山", "韩国人"
  ];

  // 强线索：华语片（大陆/港/台）
  const CN_HINTS = [
    "华语经典", "国产", "国产佳作", "国产悬疑", "国产科幻", "国产动画",
    "港片", "港产", "香港电影", "台湾电影", "台片", "台湾", "金马奖",
    "周星驰", "星爷", "姜文", "李安", "陈凯歌", "张艺谋", "贾樟柯",
    "王家卫", "侯孝贤", "杨德昌", "蔡明亮", "徐克", "杜琪峰",
    "宁浩", "陈可辛", "许鞍华", "关锦鹏", "王晶", "周润发",
    "刘德华", "吴宇森", "管虎", "曹保平", "饶晓志", "胡波",
    "毕赣", "刁亦男", "魏书钧", "张律", "李睿珺", "韩延", "曾国祥",
    "万玛才旦", "文牧野", "韩寒", "陈思诚", "贾玲", "冯小刚",
    "成龙", "李连杰", "黄渤", "葛优", "巩俐", "易烊千玺", "周冬雨",
    "章子怡", "倪大红", "惠英红", "奥卡菲娜", "王子逸",
    // desc 地名
    "香港", "内地", "大陆", "北京", "上海", "深圳", "广州", "重庆", "成都",
    "广东", "四川", "湖南", "中国", "华人", "国语", "粤语", "台北", "高雄"
  ];

  // 强线索：欧美主流
  const US_HINTS = [
    "诺兰", "卡梅隆", "斯皮尔伯格", "斯科塞斯", "昆汀", "塔伦蒂诺",
    "韦斯安德森", "韦斯·安德森", "雷德利斯科特", "大卫芬奇", "保罗托马斯安德森",
    "克里斯托弗诺兰", "丹尼斯维伦纽瓦", "维伦纽瓦", "鲍姆巴赫", "葛韦格",
    "皮克斯", "迪士尼", "梦工厂", "漫威", "DC", "华纳", "环球", "A24",
    "好莱坞", "美剧", "英剧", "纽约", "洛杉矶", "巴黎", "伦敦",
    "Marvel", "Disney", "Pixar"
  ];

  // 强线索：文艺/艺术院线
  const ART_HINTS = [
    "戛纳", "金棕榈", "评审团奖", "金狮", "威尼斯主竞赛", "柏林金熊", "柏林银熊",
    "塔可夫斯基", "贝拉塔尔", "锡兰", "阿巴斯", "贝拉·塔尔",
    "影迷向", "实验电影", "作者电影"
  ];

  function hasHiraganaKatakana(s) {
    return /[\u3040-\u309f\u30a0-\u30ff]/.test(s || "");
  }
  function hasHangul(s) {
    return /[\uac00-\ud7af\u1100-\u11ff]/.test(s || "");
  }

  function blobOf(movie) {
    const tags = (movie.tags || []).join(" ");
    return `${movie.title || ""} ${movie.desc || ""} ${tags}`;
  }
  function hitAny(blob, hints) {
    return hints.some(h => blob.includes(h));
  }

  function guessRegion(movie) {
    if (!movie) return "us";

    // 1) 显式 region 字段优先（数据层手工覆盖）
    if (movie.region) return movie.region;

    // 2) 代码层覆盖表（启发式无法救回的边缘片）
    if (movie.id && REGION_OVERRIDE[movie.id]) return REGION_OVERRIDE[movie.id];

    const blob = blobOf(movie);
    const title = movie.title || "";
    const desc = movie.desc || "";

    // 3) 假名/谚文文字硬证据
    if (hasHiraganaKatakana(title) || hasHiraganaKatakana(desc)) return "jp";
    if (hasHangul(title) || hasHangul(desc)) return "kr";

    // 4) 强线索匹配（按优先级）
    if (hitAny(blob, JP_HINTS)) return "jp";
    if (hitAny(blob, KR_HINTS)) return "kr";
    if (hitAny(blob, CN_HINTS)) return "cn";
    if (hitAny(blob, US_HINTS)) return "us";

    // 5) 文艺线索
    if (hitAny(blob, ART_HINTS)) return "art";

    // 6) 兜底：默认欧美主流
    return "us";
  }

  // ---------- region → 平台组 ----------
  // 顺序代表显示顺序，前 4 个是默认显示，多了挤
  const REGION_PROVIDERS = {
    cn:  ["bili", "iqiyi", "qqv", "douban"],          // 华语
    jp:  ["bili", "iqiyi", "douban", "letterboxd"],   // 日影/日漫，B站日漫最全
    kr:  ["iqiyi", "qqv", "douban", "letterboxd"],    // 韩影
    us:  ["qqv", "iqiyi", "douban", "letterboxd"],    // 欧美主流
    art: ["letterboxd", "douban", "imdb", "bili"]     // 文艺/影迷向
  };

  function getProviders(movie) {
    const region = guessRegion(movie);
    const ids = REGION_PROVIDERS[region] || REGION_PROVIDERS.us;
    const q = movie.title || "";
    return ids
      .map(id => PROVIDERS[id])
      .filter(Boolean)
      .map(p => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        url: p.build(q)
      }));
  }

  // 安全转义
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 渲染按钮组（HTML 字符串，方便嵌进卡片模板）
  // size: "main"（大按钮，主推卡用）| "sm"（小按钮，备选/片库用）
  function renderButtons(movie, size) {
    const list = getProviders(movie);
    if (!list.length) return "";
    const cls = size === "main" ? "movie-watch-row main" : "movie-watch-row sm";
    const region = guessRegion(movie);
    const label = size === "main" ? `<span class="movie-watch-label">去哪看 ›</span>` : "";
    return `
      <div class="${cls}" data-region="${esc(region)}">
        ${label}
        ${list.map(p => `
          <a class="movie-watch-btn" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" title="去 ${esc(p.name)} 搜「${esc(movie.title)}」">
            <span class="mw-emoji">${p.emoji}</span><span class="mw-name">${esc(p.name)}</span>
          </a>
        `).join("")}
      </div>
    `;
  }

  window.MOVIE_WATCH = {
    PROVIDERS,
    REGION_PROVIDERS,
    guessRegion,
    getProviders,
    renderButtons
  };
})();
