#!/usr/bin/env node
/**
 * 每日活动补充脚本
 * 作用：给 data/daily_activities.json 追加 3-5 条新活动，并自动去重
 *
 * 运行：
 *   node scripts/update_activities.js
 *
 * 两种生成模式（优先级从高到低）：
 *   1) 配置了环境变量 OPENAI_API_KEY → 调用 LLM 生成今日主题下的活动
 *   2) 否则走本地种子池（每周 7 套主题，每次随机挑 3-5 条未入库的）
 *
 * 去重：以"标题去空格+小写"为指纹，新活动和现有库冲突会跳过
 * id：自动分配（基于现有最大 id + 1）
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const BASE_FILE = path.join(DATA_DIR, "base_activities.json");
const DAILY_FILE = path.join(DATA_DIR, "daily_activities.json");
const LOG_FILE = path.join(DATA_DIR, "update.log");

/* ========== 工具 ========== */
function readJSON(file) {
  if (!fs.existsSync(file)) return { activities: [] };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), "utf8");
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  process.stdout.write(line);
}
function fingerprint(title) {
  return String(title || "").replace(/\s+/g, "").toLowerCase();
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========== 七日主题轮换 ========== */
const WEEK_THEMES = [
  { name: "周一·治愈充电",   tags: ["water", "治愈", "安静"] },
  { name: "周二·脑洞探险",   tags: ["air", "脑洞", "独特"] },
  { name: "周三·动起来",     tags: ["fire", "健康", "运动"] },
  { name: "周四·手作时刻",   tags: ["earth", "手作", "创意"] },
  { name: "周五·社交放电",   tags: ["fire", "热闹", "社交"] },
  { name: "周六·深度体验",   tags: ["earth", "挑战", "独特"] },
  { name: "周日·独处修复",   tags: ["water", "独处", "治愈"] }
];

/* ========== 本地种子池（AI 不可用时的兜底） ==========
 * 这里列了 60+ 条候选，每次跑从未入库的里面随机挑 3-5 条。
 * 可以持续往这里追加，或者接入 AI 后让 AI 扩写。
 */
const SEED_POOL = [
  { title: "去老城菜市场逛早市",     category: "cultural", tags: ["earth", "water", "治愈", "独特"], ageRange: [10, 80], people: "1-2 人", place: "菜市场", duration: "1-2 小时", difficulty: 1, desc: "六点起床去一趟本地菜市场，听摊主吆喝，闻鲜鱼和刚出炉包子的味，买一把花五块钱插家里。" },
  { title: "天台看夕阳套餐",         category: "healing", tags: ["water", "air", "治愈", "安静"], ageRange: [12, 80], people: "1-3 人", place: "楼顶/天台", duration: "1 小时", difficulty: 1, desc: "带一罐汽水、一副耳机、一条薄毯。太阳往下掉的那 30 分钟，足够治愈大半个星期。" },
  { title: "盲盒式城市探店",         category: "food", tags: ["air", "fire", "美食", "脑洞"], ageRange: [16, 55], people: "1-3 人", place: "城市街区", duration: "半天", difficulty: 2, desc: "打开地图随机戳一家评分 4.5 以上但没去过的小店，直接冲。踩雷或惊艳都是今天的故事。" },
  { title: "录一条给自己的播客",     category: "solo", tags: ["air", "手作", "独处"], ageRange: [14, 70], people: "1 人", place: "家里", duration: "1 小时", difficulty: 2, desc: "手机打开录音，自言自语 20 分钟——今天发生了啥、想了啥、怕了啥。一年后听会很上头。" },
  { title: "图书馆蹲一下午",         category: "solo", tags: ["air", "water", "安静", "独处"], ageRange: [8, 90], people: "1 人", place: "图书馆", duration: "3-4 小时", difficulty: 1, desc: "挑一个陌生领域的书架，随机抽三本翻。没有 WiFi 的安静里，脑子会长出一点新东西。" },
  { title: "家庭电影 + 爆米花夜",    category: "social", tags: ["fire", "热闹", "治愈"], ageRange: [5, 80], people: "2-5 人", place: "家里", duration: "2-3 小时", difficulty: 1, desc: "窗帘拉严，灯关了，微波炉爆米花，投影打到墙上。看什么不重要，一起坐着才重要。" },
  { title: "陶土手捏小动物",         category: "creative", tags: ["earth", "手作", "治愈"], ageRange: [6, 65], people: "1-3 人", place: "工作室/家里", duration: "2 小时", difficulty: 1, desc: "买一包软陶，不用拉坯机也能捏。目标：做一个丑得可爱的小动物。越歪越上头。" },
  { title: "一个人去吃会转的寿司",   category: "solo", tags: ["water", "独处", "美食"], ageRange: [14, 70], people: "1 人", place: "回转寿司店", duration: "1 小时", difficulty: 1, desc: "坐在传送带前，挑喜欢的就拿。没人跟你说话的那一小时，是属于你的小仪式。" },
  { title: "爬一座没名字的小山",     category: "outdoor", tags: ["earth", "fire", "健康", "独特"], ageRange: [14, 55], people: "1-4 人", place: "近郊山地", duration: "半天", difficulty: 3, desc: "地图上那种没名字的绿点，往往最好玩。带水带干粮，能走多远走多远。" },
  { title: "城市跑酷式 Citywalk",    category: "sport", tags: ["fire", "air", "挑战", "健康"], ageRange: [14, 45], people: "1-3 人", place: "老城区", duration: "3-4 小时", difficulty: 3, desc: "从你家一路走到市中心，规则：每条街都要拐一下。结束时看地图会被自己路线逗笑。" },
  { title: "写一份自我简历（非求职版）", category: "solo", tags: ["air", "脑洞", "独处"], ageRange: [18, 70], people: "1 人", place: "任何地方", duration: "1 小时", difficulty: 2, desc: "不写工作，写你这辈子干过的所有奇怪爱好、半途而废的项目、遇到的神人。写完会很感动。" },
  { title: "24 小时独处挑战",        category: "healing", tags: ["water", "独处", "挑战"], ageRange: [18, 60], people: "1 人", place: "家里", duration: "一天", difficulty: 3, desc: "一天不和任何人说话、不打电话、不发消息。看你能跟自己相处多久不尴尬。" },
  { title: "把衣柜整理成 ins 风",    category: "indoor", tags: ["earth", "手作", "治愈"], ageRange: [14, 60], people: "1 人", place: "家里", duration: "半天", difficulty: 2, desc: "衣服按色系分、包按大小排、配饰单独立牌。整完像开了个小店，心里也变干净。" },
  { title: "录一段 ASMR 发给朋友",   category: "creative", tags: ["water", "air", "脑洞", "治愈"], ageRange: [14, 45], people: "1 人", place: "家里", duration: "30 分钟", difficulty: 1, desc: "用手机对着咖啡滤纸、键盘、翻书，录 2 分钟发给最容易失眠的朋友。救人于水火。" },
  { title: "老电影 + 老唱片之夜",    category: "cultural", tags: ["earth", "water", "治愈", "安静"], ageRange: [16, 80], people: "1-3 人", place: "家里", duration: "3 小时", difficulty: 1, desc: "挑一部 90 年代前的电影，放一张老 CD 当 BGM。时间在房间里慢下来了。" },
  { title: "给家里加一盏颜色暖灯",   category: "healing", tags: ["water", "治愈", "手作"], ageRange: [16, 70], people: "1 人", place: "家里", duration: "1 小时", difficulty: 1, desc: "换一盏 2700K 的灯泡或者加一盏落地灯。冷光变暖光那一下，整个房间都在叹气说谢谢。" },
  { title: "去陌生街区吃早餐",       category: "food", tags: ["water", "air", "治愈", "独特"], ageRange: [14, 70], people: "1-2 人", place: "城市另一头", duration: "2 小时", difficulty: 1, desc: "坐地铁去完全陌生的区，在居民楼下找一家没招牌的早餐铺，吃一碗本地人才排的那种。" },
  { title: "给喜欢的店留一张手写卡", category: "social", tags: ["water", "earth", "治愈", "手作"], ageRange: [12, 60], people: "1 人", place: "小店", duration: "1 小时", difficulty: 1, desc: "认真写一张「谢谢你存在」的卡片留在你最爱的小店柜台。老板可能会哭给你看。" },
  { title: "一整天只说谢谢挑战",   category: "solo", tags: ["water", "脑洞", "沙雕"], ageRange: [14, 50], people: "1 人", place: "任何地方", duration: "一天", difficulty: 3, desc: "除了日常必要表达，回复全用「谢谢」。你会发现很多对话其实真的只用「谢谢」就够了。" },
  { title: "在家开一场 one-man 演唱会", category: "solo", tags: ["fire", "air", "沙雕", "放纵"], ageRange: [14, 60], people: "1 人", place: "家里", duration: "1 小时", difficulty: 1, desc: "把客厅当舞台，拿扫把当话筒，顺序来十首歌。最后谢幕要鞠躬。录下来不发给任何人。" },
  { title: "逆向走熟悉的路回家",     category: "solo", tags: ["air", "脑洞", "独特"], ageRange: [10, 70], people: "1 人", place: "家附近", duration: "1 小时", difficulty: 1, desc: "下班或放学后，走一条你从没走过的路回家。哪怕只多绕 5 分钟，也会看见一个不一样的街区。" },
  { title: "清空冰箱挑战",           category: "food", tags: ["fire", "earth", "脑洞", "手作"], ageRange: [16, 60], people: "1-3 人", place: "家里", duration: "2 小时", difficulty: 2, desc: "不许出门买菜，把冰箱剩下的所有食材做成一桌菜。黑暗料理也算数。" },
  { title: "漂流瓶式寄明信片",       category: "cultural", tags: ["air", "water", "治愈", "独特"], ageRange: [14, 70], people: "1 人", place: "邮局", duration: "1 小时", difficulty: 1, desc: "写一张明信片，地址写「邮局随机投递」。现在有服务可以帮你发给全国另一个陌生人。" },
  { title: "录一段 10 年后打开的自拍视频", category: "solo", tags: ["air", "水", "独处", "记录"], ageRange: [10, 80], people: "1 人", place: "家里", duration: "30 分钟", difficulty: 1, desc: "对着镜头讲一段给 10 年后的自己，说现在有多累、在期待什么。标记好日期存进云盘。" },
  { title: "玩一下午小时候的老游戏", category: "healing", tags: ["earth", "治愈", "独处"], ageRange: [12, 50], people: "1-3 人", place: "家里", duration: "3 小时", difficulty: 1, desc: "找出那款你小时候玩爆了的游戏，从头再打一遍。会突然明白当年为什么那么上头。" },
  { title: "盲选咖啡豆 + 手冲自学",  category: "food", tags: ["earth", "water", "手作", "治愈"], ageRange: [18, 60], people: "1-2 人", place: "家里", duration: "1 小时", difficulty: 2, desc: "随机挑一款没喝过产地的豆子，跟着视频手冲一次。闻香那一下会觉得自己很酷。" },
  { title: "给一首老歌重填词",       category: "creative", tags: ["air", "脑洞", "手作"], ageRange: [14, 60], people: "1-2 人", place: "任何地方", duration: "1-2 小时", difficulty: 2, desc: "挑一首小学就会唱的歌，把歌词改成你最近一周的日常。唱给室友或朋友听，笑到打滚。" },
  { title: "只带 50 块出门过一天",   category: "adventure", tags: ["fire", "earth", "挑战", "脑洞"], ageRange: [18, 40], people: "1-2 人", place: "城市", duration: "一天", difficulty: 3, desc: "不许网购、不许扫脸支付，就揣 50 块出门。你会发现这个城市其实很便宜也很贵。" },
  { title: "和陌生猫咪交朋友",       category: "healing", tags: ["water", "earth", "治愈", "独处"], ageRange: [6, 80], people: "1 人", place: "小区/街巷", duration: "1 小时", difficulty: 2, desc: "带点冻干蹲在小区角落，有耐心的话一只都能处成朋友。被舔手的那一下，一周都值了。" },
  { title: "老照片数字化小项目",     category: "indoor", tags: ["earth", "手作", "治愈"], ageRange: [18, 70], people: "1 人", place: "家里", duration: "3 小时", difficulty: 2, desc: "找出家里的老相册，一张张拍下来存云盘，顺手记上时间地点。翻到小时候会突然想哭。" },
  { title: "做一张自己的年度歌单",   category: "creative", tags: ["air", "water", "独处", "手作"], ageRange: [12, 60], people: "1 人", place: "家里", duration: "2 小时", difficulty: 1, desc: "从今年听过的里面挑 20 首，按心情排序。封面自己拍一张。发给闺蜜/兄弟。" },
  { title: "去看一场儿童剧",         category: "cultural", tags: ["air", "治愈", "独特"], ageRange: [18, 60], people: "1-3 人", place: "剧场", duration: "2 小时", difficulty: 1, desc: "一个成年人独自/结伴去看儿童剧，特别解压。出来会笑着说：小孩真幸福。" },
  { title: "手账一周挑战",           category: "creative", tags: ["earth", "water", "手作", "记录"], ageRange: [10, 60], people: "1 人", place: "家里", duration: "每天 20 分钟", difficulty: 2, desc: "连续 7 天在本子上画 + 写今天的一件小事。一周后回看，你会发现生活没你想的那么无聊。" },
  { title: "去一次专业美发换造型",   category: "healing", tags: ["fire", "air", "独特", "挑战"], ageRange: [16, 55], people: "1 人", place: "理发店", duration: "2-3 小时", difficulty: 2, desc: "剪一个你从来没敢试的发型，染一个平时绝不会选的颜色。照镜子那一下，感觉换了个灵魂。" },
  { title: "给自己办一场退休预演",   category: "solo", tags: ["water", "脑洞", "独处"], ageRange: [22, 60], people: "1 人", place: "家里", duration: "一天", difficulty: 2, desc: "把手机静音塞抽屉，安排一整天做你退休后想干的事（发呆、钓鱼、看云）。提前过过瘾。" },
  { title: "拍一个家人的纪录片",     category: "creative", tags: ["earth", "water", "治愈", "手作"], ageRange: [16, 60], people: "1-2 人", place: "家里", duration: "半天", difficulty: 2, desc: "用手机拍一段 3 分钟的家人做家务/做饭的视频，配一段简单旁白。五年后再看是宝。" },
  { title: "去博物馆只看一件展品",   category: "cultural", tags: ["air", "earth", "安静", "独特"], ageRange: [12, 80], people: "1-2 人", place: "博物馆", duration: "2 小时", difficulty: 1, desc: "挑定一件展品，绕着它看 40 分钟，查它的前世今生。然后你就拥有了一个亲切的朋友。" },
  { title: "去菜场学做一道当地菜",   category: "food", tags: ["earth", "手作", "独特"], ageRange: [16, 70], people: "1-2 人", place: "菜市场/家里", duration: "半天", difficulty: 3, desc: "问摊主这菜怎么做，回家照着做。可能会翻车但过程特别鲜活。" },
  { title: "把房间挪成新布局",       category: "indoor", tags: ["earth", "air", "手作", "脑洞"], ageRange: [16, 55], people: "1-2 人", place: "家里", duration: "半天", difficulty: 3, desc: "床换个方向，桌子挪一下。新视角会骗过大脑，让你觉得搬了新家。" },
  { title: "去跑一个 5 公里",        category: "sport", tags: ["fire", "health", "健康", "挑战"], ageRange: [14, 55], people: "1-3 人", place: "公园/跑道", duration: "1 小时", difficulty: 2, desc: "不求快，求完整跑完。跑完靠在栏杆上呼吸的那一下，是今天最清澈的三分钟。" },
  { title: "和老朋友来一场视频夜聊", category: "social", tags: ["water", "air", "治愈", "热闹"], ageRange: [16, 80], people: "2-5 人", place: "家里", duration: "2-3 小时", difficulty: 1, desc: "约上三年没正经聊过的老友视频，规则：不聊工作不聊对象，只聊那些「还记不记得当年」。" },
  { title: "跟着 YouTube 学一支舞", category: "creative", tags: ["fire", "air", "手作", "沙雕"], ageRange: [10, 45], people: "1-2 人", place: "家里", duration: "1-2 小时", difficulty: 2, desc: "挑一支你一直觉得很酷但没勇气跳的舞，关门练一下午。最后录一段发给自己。" },
  { title: "去农贸市场买一次生鲜",   category: "food", tags: ["earth", "健康", "独特"], ageRange: [16, 70], people: "1-2 人", place: "农贸市场", duration: "2 小时", difficulty: 2, desc: "离开超市的塑料袋，去真正的市场选一次鱼、肉、菜。砍价也是一种运动。" },
  { title: "读一本跟你职业无关的书", category: "solo", tags: ["air", "脑洞", "独处"], ageRange: [18, 80], people: "1 人", place: "任何地方", duration: "数天", difficulty: 2, desc: "选一本你完全不懂的领域（天文、园艺、考古），硬啃一周。大脑会长出你没见过的枝。" },
  { title: "拜访一家独立书店到闭店", category: "cultural", tags: ["air", "water", "治愈", "独处"], ageRange: [14, 80], people: "1-2 人", place: "独立书店", duration: "3-4 小时", difficulty: 1, desc: "赖在一家独立书店直到店主温柔地提醒你要关门。买一本店主推荐的书，当做今天的纪念品。" },
  { title: "做一顿老家的家常菜",     category: "food", tags: ["earth", "water", "治愈", "手作"], ageRange: [18, 70], people: "1-3 人", place: "家里", duration: "3 小时", difficulty: 3, desc: "打电话问妈妈/奶奶做法，一边抄一边做。失败也好吃——毕竟多了一个跟家人说话的理由。" },
  { title: "办一场 3 人小型展",      category: "creative", tags: ["air", "fire", "脑洞", "手作"], ageRange: [18, 45], people: "3-5 人", place: "家里/咖啡店", duration: "一下午", difficulty: 3, desc: "和两个朋友各出 5 张照片/画作，在一面墙上布置成小展。朋友圈发招待通知，邀请大家来喝酒。" },
  { title: "独自坐一次长途火车",     category: "adventure", tags: ["water", "air", "独处", "独特"], ageRange: [18, 65], people: "1 人", place: "火车", duration: "一整天", difficulty: 2, desc: "硬座 8 小时起步。窗外的风景和车厢里的陌生人会组成今年最密的一段记忆。" },
  { title: "一天不照镜子挑战",       category: "healing", tags: ["water", "脑洞", "挑战"], ageRange: [14, 60], people: "1 人", place: "任何地方", duration: "一天", difficulty: 2, desc: "早上起床不照镜子，出门不整理头发。你会发现，注意力从外貌挪开后，世界变大了一圈。" },
  { title: "和朋友来一场「讲秘密夜」", category: "social", tags: ["water", "fire", "独特", "热闹"], ageRange: [18, 60], people: "2-4 人", place: "家里/咖啡馆", duration: "3 小时", difficulty: 2, desc: "关灯点蜡烛，每人讲一个从没说过的小秘密。不准评价、不准笑。讲完那晚你们会变得不一样。" },
  { title: "做一次蒙眼晚餐",         category: "food", tags: ["water", "earth", "独特", "脑洞"], ageRange: [18, 60], people: "2 人", place: "家里", duration: "1 小时", difficulty: 2, desc: "眼罩戴上吃一顿饭，让味觉和嗅觉当主角。会突然意识到，自己从来没好好'吃过'一顿饭。" },
  { title: "去当一次临时义工",       category: "social", tags: ["earth", "water", "治愈", "独特"], ageRange: [16, 70], people: "1-3 人", place: "公益组织/救助站", duration: "半天", difficulty: 2, desc: "流浪动物救助、敬老院、环境清洁——选一个能当天报名的，半天给你的感动顶半年。" },
  { title: "给老板/同事偷偷发一封表扬信", category: "social", tags: ["water", "air", "治愈", "沙雕"], ageRange: [22, 55], people: "1 人", place: "家里", duration: "30 分钟", difficulty: 1, desc: "正经写一封「你真的很棒」的匿名邮件。对方会愣一下，然后一整天脚步都变轻。" },
  { title: "挑战一整天不坐下",       category: "sport", tags: ["fire", "挑战", "沙雕"], ageRange: [18, 45], people: "1 人", place: "任何地方", duration: "一天", difficulty: 4, desc: "除了上厕所和睡觉，站着工作站着吃饭站着看电影。第二天腿很酸但人很清醒。" },
  { title: "做一组家庭光影照片",     category: "creative", tags: ["earth", "water", "手作", "治愈"], ageRange: [14, 55], people: "1-3 人", place: "家里", duration: "2 小时", difficulty: 2, desc: "关灯，只留一盏台灯或一支蜡烛，给家里人拍几张侧脸。修一下发家族群，长辈会立刻来问怎么拍。" },
  { title: "去一家寺庙待一下午",     category: "healing", tags: ["earth", "water", "治愈", "安静"], ageRange: [12, 90], people: "1-2 人", place: "寺庙", duration: "3 小时", difficulty: 1, desc: "不一定要拜，就坐在大殿旁的台阶上听钟、闻香、看檐角。出来时心里的噪音少了一半。" },
  { title: "跟着天气 App 的建议出门", category: "outdoor", tags: ["air", "脑洞", "沙雕"], ageRange: [14, 60], people: "1 人", place: "户外", duration: "2 小时", difficulty: 1, desc: "打开天气 App，看看它推荐你今天适合干嘛，强制执行。意外地经常是个好主意。" },
  { title: "给自己写一份明年心愿清单", category: "solo", tags: ["water", "air", "独处", "记录"], ageRange: [14, 80], people: "1 人", place: "家里", duration: "1 小时", difficulty: 1, desc: "写 20 条你希望明年完成的事，大到小、现实到幻想都行。封存到信封里，明年这天开。" },
  { title: "做一次「家门口」旅行",     category: "adventure", tags: ["earth", "air", "独特", "脑洞"], ageRange: [10, 70], people: "1-4 人", place: "家附近 3km", duration: "半天", difficulty: 1, desc: "假装自己是来本地旅游的游客。用游客视角走一遍你熟悉的街区，会发现很多东西你从没看见过。" },
  { title: "去郊区露营过一夜",       category: "adventure", tags: ["earth", "挑战", "独特"], ageRange: [16, 55], people: "2-4 人", place: "郊区营地", duration: "一整晚", difficulty: 3, desc: "开车 1 小时到山脚下，搭个帐篷、烧堆小火。半夜出去撒尿那一下的星空，城里十年都看不到。" },
  { title: "骑行 50 公里挑战",       category: "sport", tags: ["fire", "earth", "挑战", "独特"], ageRange: [18, 50], people: "1-3 人", place: "城市外环/郊区", duration: "一整天", difficulty: 4, desc: "借一辆公路车，规划一条 50km 的单程路线，中途只在一家路边店吃饭。回家腿像别人的，但人超爽。" },
  { title: "一个人开车去看海",       category: "adventure", tags: ["water", "earth", "独特", "独处"], ageRange: [20, 60], people: "1 人", place: "最近的海边", duration: "一整天", difficulty: 3, desc: "不订酒店、不做攻略，单程 300 公里内的海边都行。到了就在防波堤上坐两小时，再一个人开回来。" },
  { title: "深夜城市徒步 10 公里",   category: "outdoor", tags: ["fire", "air", "挑战", "独特"], ageRange: [18, 45], people: "1-3 人", place: "城市街道", duration: "3 小时", difficulty: 3, desc: "凌晨 0 点从家出发，走到地图上 10km 外的某个地标再打车回来。没人的城市是另一个城市。" },
  { title: "连续 24 小时看日出 + 日落",category: "adventure", tags: ["earth", "air", "挑战", "独特"], ageRange: [16, 55], people: "1-3 人", place: "看得到地平线的地方", duration: "一整天", difficulty: 3, desc: "5 点爬起来等日出，晚上再爬到高处等日落。一天之内头尾接起来，会有种这一天特别长的错觉。" },
  { title: "去一个没听过的小镇住一晚", category: "adventure", tags: ["earth", "water", "独特", "挑战"], ageRange: [18, 60], people: "1-3 人", place: "2 小时车程外的小镇", duration: "一整天", difficulty: 3, desc: "高铁或大巴 2 小时内的无名小镇，订最便宜的民宿住一晚。吃镇上最热闹的那家馆子，第二天早起再溜达一圈回来。" },
  { title: "深夜便利店马拉松",        category: "adventure", tags: ["fire", "earth", "挑战", "沙雕"], ageRange: [18, 40], people: "1-2 人", place: "城市各区便利店", duration: "5 小时", difficulty: 3, desc: "定一个规则：一晚上打卡 10 家不同品牌的 24 小时便利店，每家买一样东西。凌晨 3 点的城市和收银员都格外温柔。" },
  { title: "泡一壶茶发 2 小时呆",     category: "healing", tags: ["water", "治愈", "安静", "独处"], ageRange: [16, 80], people: "1 人", place: "家里/阳台", duration: "2 小时", difficulty: 1, desc: "烧一壶水，挑一款你最喜欢的茶，关掉所有屏幕。就看茶叶慢慢舒展。两小时后你会觉得被重新格式化。" },
  { title: "睡前泡脚 + 精油按摩",     category: "healing", tags: ["water", "治愈", "安静"], ageRange: [18, 80], people: "1 人", place: "家里", duration: "40 分钟", difficulty: 1, desc: "热水加一点姜片或艾草，泡 20 分钟，再用身体乳自己按摩小腿。周一晚这一下，整个下半夜睡得像被按了复位键。" },
  { title: "去公园长椅上睡一觉",       category: "healing", tags: ["water", "air", "治愈", "独处"], ageRange: [14, 70], people: "1 人", place: "公园", duration: "1 小时", difficulty: 1, desc: "带一本书假装看，实际上闭眼听风和鸟叫。阳光晒着，没人认识你，比床上还好睡。" },
  { title: "写一封给自己的治愈信",     category: "solo", tags: ["water", "治愈", "独处", "记录"], ageRange: [14, 80], people: "1 人", place: "家里", duration: "40 分钟", difficulty: 1, desc: "拿纸笔，写一封信给正处在低谷的那个自己。允许抱怨，允许哭，最后一句一定要写「没关系」。写完封起来。" },
  { title: "一小时正念散步",           category: "healing", tags: ["water", "air", "治愈", "安静"], ageRange: [14, 80], people: "1 人", place: "小区/公园", duration: "1 小时", difficulty: 1, desc: "走路时只留意脚底的触感、风、气味，手机调到勿扰。走完会有种轻轻的、被洗过的感觉。" },
  { title: "整理一周的乱摊子",         category: "indoor", tags: ["earth", "治愈", "手作"], ageRange: [14, 70], people: "1 人", place: "家里", duration: "2 小时", difficulty: 2, desc: "把上周堆在椅子上的衣服、桌上的杯子、包里的小票都收一下。周一把空间清空，本周的脑子也跟着清空。" },
  { title: "只开一盏灯看一部老片",     category: "healing", tags: ["water", "治愈", "独处"], ageRange: [16, 80], people: "1 人", place: "家里", duration: "2 小时", difficulty: 1, desc: "关掉顶灯，留一盏暖色落地灯。挑一部你看过三遍以上的老电影再看一次。熟悉的台词是这个世界上最便宜的拥抱。" },
  { title: "一杯热牛奶 + 10 分钟冥想", category: "healing", tags: ["water", "治愈", "安静"], ageRange: [12, 90], people: "1 人", place: "家里", duration: "30 分钟", difficulty: 1, desc: "微波炉热一杯牛奶，加一点蜂蜜。喝完闭眼做 10 分钟呼吸练习，其它啥也不干。周一晚上能这么过一次，就不算亏。" },

  /* —— 周二·脑洞探险 候选补充 —— */
  { title: "随机坐一辆公交到终点站",   category: "adventure", tags: ["air", "脑洞", "独特"], ageRange: [14, 60], people: "1-2 人", place: "公交线", duration: "半天", difficulty: 2, desc: "在站台前闭眼指一辆公交，上去坐到底。终点站往往是这个城市最被忽略的地方，你会捡到一段意外的故事。" },
  { title: "一天用左手生活挑战",       category: "solo", tags: ["air", "脑洞", "挑战", "沙雕"], ageRange: [10, 60], people: "1 人", place: "任何地方", duration: "一天", difficulty: 3, desc: "从刷牙到吃饭到打字，全部换成左手（如果你是左撇子那就反过来）。大脑会以为自己被换了一个壳。" },
  { title: "造一个假身份过一下午",     category: "solo", tags: ["air", "脑洞", "独特"], ageRange: [16, 50], people: "1 人", place: "陌生街区", duration: "3-4 小时", difficulty: 2, desc: "去一个没人认识你的咖啡馆，给自己起个假名字、假职业、假家乡。和店员/邻座搭一下话。今天你是另一个人。" },
  { title: "把午饭的食材随机抽签",     category: "food", tags: ["earth", "脑洞", "沙雕"], ageRange: [12, 60], people: "1-3 人", place: "家里", duration: "2 小时", difficulty: 2, desc: "写 10 张食材纸条扔进碗里，闭眼抽 4 张，必须把它们做成一道能下咽的菜。黑暗料理也是创作。" },
  { title: "用 AI 帮你做一天决定",     category: "solo", tags: ["air", "脑洞", "独特"], ageRange: [16, 55], people: "1 人", place: "任何地方", duration: "一天", difficulty: 2, desc: "今天所有「中午吃啥/穿哪件/走哪条路」都丢给 AI 决定，自己只负责执行。会发现「不用选」其实很轻松。" },
  { title: "给一件无聊的物品写说明书", category: "creative", tags: ["air", "脑洞", "手作"], ageRange: [10, 60], people: "1 人", place: "家里", duration: "1 小时", difficulty: 2, desc: "挑一支你的牙刷、一只袜子、一把指甲剪，给它写一份煞有介事的产品说明书：起源、用法、禁忌。越正经越好笑。" },
  { title: "10 分钟解释会 = 你的小课",  category: "social", tags: ["air", "脑洞", "热闹"], ageRange: [14, 55], people: "2-4 人", place: "家里/咖啡馆", duration: "1 小时", difficulty: 2, desc: "约朋友每人讲一个 10 分钟的迷你课，主题随便：怎么挑西瓜、为什么猫怕黄瓜、量子力学入门 30 秒版。讲完会上瘾。" },
  { title: "倒着写一天的日记",         category: "solo", tags: ["air", "脑洞", "独处", "记录"], ageRange: [12, 70], people: "1 人", place: "家里", duration: "30 分钟", difficulty: 1, desc: "把今天发生的事按从晚到早的顺序写下来。视角一倒，平凡的一天会变得像一部短片。" },

  /* —— 周四·手作时刻 候选补充 —— */
  { title: "亲手缝一个小布包",         category: "creative", tags: ["earth", "手作", "治愈"], ageRange: [10, 65], people: "1 人", place: "家里", duration: "2-3 小时", difficulty: 2, desc: "买一块棉麻布、一根针、一轴线，照着 B 站的视频缝一个不规则小布包。针脚歪了也没关系，能装钥匙就算毕业。" },
  { title: "给植物做一个迷你支架",     category: "creative", tags: ["earth", "手作", "独特"], ageRange: [12, 60], people: "1 人", place: "家里", duration: "1-2 小时", difficulty: 2, desc: "用麻绳、废筷子或铁丝给你家蔫了的那盆绿植搭一个小支架。植物挺起来那一下，你会有点想哭。" },
  { title: "手冲一支属于自己的香水",   category: "creative", tags: ["earth", "water", "手作", "独特"], ageRange: [18, 55], people: "1-2 人", place: "家里", duration: "2 小时", difficulty: 3, desc: "买一套新手调香套装，按心情挑前中后调比例。瓶身贴一张手写标签，写上这个味道叫什么。独一份，卖断货也没人有。" },
  { title: "用旧 T 恤改一条抹布",      category: "indoor", tags: ["earth", "手作", "治愈"], ageRange: [10, 70], people: "1 人", place: "家里", duration: "40 分钟", difficulty: 1, desc: "衣柜里那几件再也不会穿的 T 恤，一刀剪开缝成方形抹布。物尽其用那一下，有种把时间抚平的感觉。" },
  { title: "捏一个专属冰箱贴",         category: "creative", tags: ["earth", "手作", "脑洞"], ageRange: [6, 60], people: "1-3 人", place: "家里", duration: "2 小时", difficulty: 1, desc: "软陶 + 烤箱就能搞定，捏你家猫、你最爱的早餐、今天的情绪脸。烤完粘上磁铁，厨房立刻有了故事。" },
  { title: "自制一本 mini 手工书",     category: "creative", tags: ["earth", "air", "手作", "记录"], ageRange: [10, 65], people: "1 人", place: "家里", duration: "2-3 小时", difficulty: 2, desc: "A4 纸折 8 页小书，封面手绘，里面写三件这周让你笑出声的小事。做完塞进抽屉，一年后会是宝。" },
  { title: "做一组手写明信片",         category: "creative", tags: ["earth", "water", "手作", "治愈"], ageRange: [12, 80], people: "1 人", place: "家里", duration: "2 小时", difficulty: 1, desc: "买一沓空白明信片，挑 5 个想念但没联系的人，每张写一段不发朋友圈才会说的话。贴邮票寄出，世界会慢一点。" },
  { title: "给旧家具刷一次新漆",       category: "indoor", tags: ["earth", "手作", "挑战"], ageRange: [18, 60], people: "1-2 人", place: "家里/阳台", duration: "半天", difficulty: 3, desc: "挑家里那个看腻的小边几或椅子，买一罐水性漆，刷一个你一直心动的颜色。干了之后看一整天都觉得自己很牛。" },

  /* —— 周六·深度体验 候选补充 —— */
  { title: "一日学徒体验",             category: "adventure", tags: ["earth", "挑战", "独特"], ageRange: [16, 55], people: "1 人", place: "面包房/花店/陶艺工作室", duration: "一整天", difficulty: 3, desc: "联系一家小店说想当一天义务学徒，从早开店跟到晚关门。你会发现每个行业都有外人看不懂的细节和上瘾点。" },
  { title: "24 小时不用手机挑战",       category: "adventure", tags: ["water", "air", "挑战", "独特"], ageRange: [16, 60], people: "1 人", place: "任何地方", duration: "一天", difficulty: 4, desc: "手机锁进抽屉 24 小时，纸笔当备忘录，面基靠约好的时间点。你会重新意识到——原来一天这么长。" },
  { title: "独自去一个从没去过的城市 overnight", category: "adventure", tags: ["earth", "air", "挑战", "独特"], ageRange: [18, 55], people: "1 人", place: "2-3 小时高铁圈", duration: "一天一夜", difficulty: 4, desc: "早班高铁出去，订一间最便宜的民宿住一晚，第二天最晚那班回来。不做攻略，走到哪算哪。" },
  { title: "跟渔民出海半天",           category: "adventure", tags: ["water", "earth", "挑战", "独特"], ageRange: [16, 60], people: "1-2 人", place: "沿海渔港", duration: "半天", difficulty: 4, desc: "提前打听能不能跟船，清晨五点上船，看渔民怎么撒网收网。晕船也值——这不是景区能给你的东西。" },
  { title: "徒步穿越一条真山野路线",    category: "outdoor", tags: ["earth", "fire", "挑战", "健康"], ageRange: [18, 50], people: "2-4 人", place: "成熟徒步线路", duration: "一整天", difficulty: 4, desc: "挑一条 8-15km 有起伏的经典徒步路线，不是公园那种。带够水和干粮，走完腿软心爽。" },
  { title: "无目的地的公路旅行一天",    category: "adventure", tags: ["air", "fire", "独特", "脑洞"], ageRange: [20, 55], people: "1-4 人", place: "城市外环+周边", duration: "一整天", difficulty: 3, desc: "早上出发，每到一个岔路口扔硬币决定左右。天黑前按导航回家。一天下来你会路过一堆没人推荐的怪地方。" },
  { title: "连续 6 小时极客式深度工作",  category: "solo", tags: ["air", "挑战", "独处"], ageRange: [20, 55], people: "1 人", place: "家里/图书馆", duration: "6 小时", difficulty: 4, desc: "挑一个你一直想做但从没完整做的项目（写长文/做一个小工具），关全部通知干 6 小时。出来时有种被重启的感觉。" },
  { title: "体验一次小众运动",          category: "sport", tags: ["fire", "earth", "挑战", "独特"], ageRange: [16, 45], people: "1-3 人", place: "俱乐部/场馆", duration: "3 小时", difficulty: 3, desc: "攀岩/皮划艇/飞盘/街舞/击剑——挑一个你从没碰过的，报一节体验课。身体从没用过的姿势会解锁新的快乐。" },
  /* —— 周日·独处修复 补充池 2026-05-10 —— */
  { title: "赖床两小时不愧疚计划",      category: "healing", tags: ["water", "治愈", "独处"], ageRange: [10, 70], people: "1 人", place: "自家被窝", duration: "2 小时", difficulty: 1, desc: "周日早晨闹钟全关，允许自己无目的在床上发呆、翻手机、看天花板。不愧疚就是今天最大的任务。" },
  { title: "一个人去公园长椅坐满一小时", category: "solo", tags: ["water", "air", "安静", "独处"], ageRange: [12, 80], people: "1 人", place: "街心公园", duration: "1 小时", difficulty: 1, desc: "不带耳机、不刷手机，就坐在长椅上看人来人往。一小时过去你会发现脑子里吵架的人都走了。" },
  { title: "给身体办一场小型 SPA 日",   category: "healing", tags: ["water", "治愈", "独处"], ageRange: [16, 65], people: "1 人", place: "家里", duration: "3 小时", difficulty: 1, desc: "泡澡+去角质+敷面膜+涂身体乳，配上轻音乐和一杯花茶。一个人住的浴室今天就是顶奢 SPA。" },
  { title: "手写一封信给三年前的自己",  category: "solo", tags: ["water", "air", "治愈", "独处"], ageRange: [14, 70], people: "1 人", place: "家里", duration: "1 小时", difficulty: 2, desc: "用纸和笔，写一封长信给三年前那个自己。你会发现走到今天，比当时想象的远多了。" },
  { title: "一个人去看早场电影",        category: "cultural", tags: ["air", "独处", "治愈"], ageRange: [14, 70], people: "1 人", place: "电影院", duration: "2-3 小时", difficulty: 1, desc: "挑周日上午第一场，全场可能就你一个人。银幕那么大却安静得像私人影院，独处的爽感拉满。" },
  { title: "做一顿只给自己的精致饭",    category: "food", tags: ["earth", "手作", "治愈", "独处"], ageRange: [16, 70], people: "1 人", place: "家里", duration: "2 小时", difficulty: 2, desc: "不凑合、不外卖，为自己做一道平时嫌麻烦的菜，摆盘拍照。一个人吃饭也可以是隆重的。" },
  { title: "删 100 条无用消息和联系人", category: "solo", tags: ["air", "治愈", "独处"], ageRange: [16, 60], people: "1 人", place: "家里", duration: "1 小时", difficulty: 1, desc: "把微信里沉寂三年的群、再也不会聊的好友、看过就忘的公众号清一清。手机轻了，心也轻了。" },
  { title: "把周末还没做完的小事逐个划掉", category: "indoor", tags: ["earth", "水", "治愈", "独处"], ageRange: [14, 70], people: "1 人", place: "家里", duration: "2 小时", difficulty: 1, desc: "列出那些拖了两周的小事（换灯泡、退快递、改简历、回那条微信），一口气干完。周一会感谢今天的你。" }
];

/* ========== AI 生成（可选，预留接口）==========
 * 如果设置了 OPENAI_API_KEY，会调 OpenAI 让它按今日主题生成活动。
 * 如果没配置，直接返回空数组，走本地种子池。
 */
async function generateWithAI(theme, existingTitles, count) {
  if (!process.env.OPENAI_API_KEY) return [];
  try {
    const prompt = `你是一个生活方式策划师。请生成 ${count} 条"${theme.name}"主题的有趣活动，返回严格 JSON 数组。
每条格式：{"title":"不超过12字","category":"下列之一: outdoor/indoor/social/solo/creative/sport/healing/adventure/food/cultural","tags":["从 fire/earth/air/water 中选 1 个，再加 2-3 个气质词如 治愈/脑洞/手作/刺激/热闹/独处/独特/挑战/健康"],"ageRange":[最小年龄,最大年龄],"people":"像'1-3 人'","place":"活动地点","duration":"时长描述","difficulty":1到5,"desc":"50 字左右的活动介绍，口吻要自然不 AI"}
主题标签参考：${theme.tags.join("、")}
避免和以下已有活动重复：${existingTitles.slice(0, 30).join("、")}
只返回 JSON 数组，不要其他解释。`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      })
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || "[]";
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    log("AI 生成失败，降级到本地种子池：" + e.message);
    return [];
  }
}

/* ========== 主流程 ========== */
async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const base = readJSON(BASE_FILE);
  const daily = readJSON(DAILY_FILE);
  if (!Array.isArray(daily.activities)) daily.activities = [];

  const existing = [...(base.activities || []), ...(daily.activities || [])];
  const existingFps = new Set(existing.map(a => fingerprint(a.title)));
  const existingTitles = existing.map(a => a.title);
  const maxId = existing.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0);

  const dow = new Date().getDay(); // 0=周日
  const theme = WEEK_THEMES[(dow === 0 ? 6 : dow - 1)]; // 映射到 0=周一

  const addCount = 3 + Math.floor(Math.random() * 3); // 3-5

  // 先尝试 AI 生成
  let generated = await generateWithAI(theme, existingTitles, addCount);

  // 不够就从种子池补
  if (generated.length < addCount) {
    const need = addCount - generated.length;
    const pool = SEED_POOL.filter(s => !existingFps.has(fingerprint(s.title)));
    const picked = shuffle(pool).slice(0, need);
    generated = generated.concat(picked);
  }

  // 去重 + 补齐 id
  let nextId = maxId + 1;
  const newActivities = [];
  for (const a of generated) {
    if (!a || !a.title) continue;
    const fp = fingerprint(a.title);
    if (existingFps.has(fp)) continue;
    existingFps.add(fp);
    newActivities.push({ id: nextId++, ...a });
    if (newActivities.length >= addCount) break;
  }

  if (newActivities.length === 0) {
    log(`【${theme.name}】种子池和已有库完全重合，今天先不追加。`);
    return;
  }

  daily.activities = (daily.activities || []).concat(newActivities);
  daily.updated_at = todayStr();
  daily.version = daily.version || "1.0.0";

  writeJSON(DAILY_FILE, daily);
  log(`【${theme.name}】追加 ${newActivities.length} 条：` +
      newActivities.map(a => a.title).join("、") +
      `  | 总库：${base.activities.length + daily.activities.length} 条`);

  // 自动提交并推送到远端（可通过 NO_GIT_PUSH=1 跳过）
  autoCommitAndPush(theme, newActivities, base.activities.length + daily.activities.length);
}

/* ========== 自动提交 & 推送 ==========
 * 失败不抛异常，只记录日志，避免打断定时任务
 */
function autoCommitAndPush(theme, newActivities, totalCount) {
  if (process.env.NO_GIT_PUSH === "1") {
    log("已跳过 git 推送（NO_GIT_PUSH=1）");
    return;
  }
  try {
    const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

    // 只 add 当前变更的数据文件，避免把未知文件意外带上
    run(`git add "${path.relative(ROOT, DAILY_FILE)}"`);

    // 没有实际可提交变更就退出
    const staged = run(`git diff --cached --name-only`);
    if (!staged) {
      log("git: 没有待提交变更，跳过。");
      return;
    }

    const titles = newActivities.map(a => a.title).join("、");
    const msg = `chore: 每日补活动 ${theme.name} +${newActivities.length} 总库${totalCount} [${titles}]`;
    run(`git commit -m ${JSON.stringify(msg)}`);
    run(`git push origin HEAD`);
    log(`git: 已提交并推送 —— ${msg}`);
  } catch (e) {
    const stderr = (e.stderr && e.stderr.toString && e.stderr.toString()) || "";
    log("git 推送失败（不影响数据落盘）：" + (e.message || "") + " " + stderr);
  }
}

main().catch(err => {
  log("脚本异常：" + err.stack);
  process.exit(1);
});
