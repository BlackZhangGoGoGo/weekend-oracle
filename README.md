# 🧙 周末活动占卜屋

> 输入星座 × 年龄 × 性别 × 3 个幸运数字，戴魔法帽子的像素小人掐指一算，给你推荐一个有意思的活动。

一个纯静态 Web App，无后端依赖，可直接部署到 GitHub Pages / Cloudflare Pages / Vercel。

## ✨ 功能

- 🎩 像素风魔法小人（纯 CSS 绘制，带施法动画）
- 🔮 多维度推荐算法（星座元素 + 年龄段偏好 + 数字气质 + 性别微调）
- 📚 50+ 条分类活动库（10 大类：户外/室内/社交/独处/创意/运动/治愈/冒险/美食/文化）
- 📜 每次推荐自带一句契合气质的金句（诗词 / 名言 / 台词 / 热梗 混搭）
- 📱 移动端适配（字号流式缩放、安全区、触控区 ≥44px）
- 🤖 活动库每日自动扩充（Node 脚本按主题轮换追加）

## 📂 目录结构

```
.
├── index.html               # 统一入口主页（周末占卜 + 遛娃神器 两个入口卡片）
├── oracle.html              # 周末活动占卜屋页面
├── kids.html                # 遛娃神器页面
├── style.css                # 所有样式（含像素小人、动画、移动端适配、主页卡片）
├── app.js                   # 占卜屋：推荐算法 + 动画 + 金句池
├── kids.js                  # 遛娃神器：城市/年龄/出行方式推荐逻辑
├── activities.js            # 活动库加载器（异步 fetch 两个 JSON 合并去重）
├── kids-spots.js            # 遛娃神器地点库
├── data/
│   ├── base_activities.json # 基础库（45 条原始活动）
│   └── daily_activities.json# 每日追加的增量库
└── scripts/
    └── update_activities.js # 每日自动补活动的 Node 脚本（种子池轮换 7 主题）
```

## 🚀 本地运行

```bash
cd magic-activity-recommender
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765/index.html
```

## 🌐 部署

**Cloudflare Pages（推荐）**：
- 构建命令：留空
- 输出目录：`./`（项目根）
- 无需环境变量

**GitHub Pages**：
- 仓库 Settings → Pages → Source: `main` 分支 / 根目录

## 📝 每日自动补活动

```bash
node scripts/update_activities.js
```

脚本会按当天星期几挑选对应主题，往 `data/daily_activities.json` 追加 3-5 条新活动，按标题指纹去重。

## 🎨 技术栈

纯 HTML + CSS + JavaScript，无构建步骤，无框架依赖。
