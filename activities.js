/**
 * 活动库加载器
 * 数据源：
 *   - data/base_activities.json    → 初始库
 *   - data/daily_activities.json   → 每天脚本追加的新活动
 * 两份数据在前端合并，按 id 去重（daily 优先），暴露到 window.ACTIVITY_LIBRARY。
 *
 * 同时保留元数据：window.ZODIAC_ELEMENT / ELEMENT_DESC / CATEGORY_NAME
 */

// 星座元素映射
window.ZODIAC_ELEMENT = {
  "白羊座": "fire", "狮子座": "fire", "射手座": "fire",
  "金牛座": "earth", "处女座": "earth", "摩羯座": "earth",
  "双子座": "air", "天秤座": "air", "水瓶座": "air",
  "巨蟹座": "water", "天蝎座": "water", "双鱼座": "water"
};

// 元素气质描述
window.ELEMENT_DESC = {
  "fire": { name: "火象", trait: "热情、冲动、爱冒险" },
  "earth": { name: "土象", trait: "务实、踏实、手作控" },
  "air": { name: "风象", trait: "好奇、善变、脑洞大" },
  "water": { name: "水象", trait: "敏感、细腻、重情绪" }
};

// 分类中文名
window.CATEGORY_NAME = {
  outdoor: "户外", indoor: "室内", social: "社交", solo: "独处",
  creative: "创意", sport: "运动", healing: "治愈",
  adventure: "冒险", food: "美食", cultural: "文化"
};

// 占位：数据异步加载，加载完后派发事件让 app.js 初始化
window.ACTIVITY_LIBRARY = [];
window.LIBRARY_META = { version: "-", updated_at: "-", baseCount: 0, dailyCount: 0 };

(async function loadActivities() {
  const sources = [
    "./data/base_activities.json",
    "./data/daily_activities.json"
  ];

  const results = await Promise.all(sources.map(async (url) => {
    try {
      // 加时间戳避免缓存
      const r = await fetch(url + "?t=" + Date.now());
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      console.warn("[activities] 加载失败：" + url, e);
      return { activities: [] };
    }
  }));

  const [base, daily] = results;
  const byId = new Map();

  (base.activities || []).forEach(a => byId.set(a.id, a));
  // daily 的 id 如果和 base 冲突，以 daily 为准（便于热修复）
  (daily.activities || []).forEach(a => byId.set(a.id, a));

  window.ACTIVITY_LIBRARY = Array.from(byId.values());
  window.LIBRARY_META = {
    version: daily.version || base.version || "1.0.0",
    updated_at: daily.updated_at || base.updated_at || "-",
    baseCount: (base.activities || []).length,
    dailyCount: (daily.activities || []).length
  };

  document.dispatchEvent(new CustomEvent("activities:ready", {
    detail: { total: window.ACTIVITY_LIBRARY.length, meta: window.LIBRARY_META }
  }));
})();
