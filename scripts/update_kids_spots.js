#!/usr/bin/env node
/**
 * 溜娃神器 · 每日方案补充脚本
 * 作用：往 kids-spots.js 的 KIDS_SPOTS 数组里追加 2-4 条新方案，自动去重。
 *
 * 运行：
 *   node scripts/update_kids_spots.js
 *
 * 流程：
 *   1) require 现有 kids-spots.js，拿到 KIDS_SPOTS 已有 name 集合
 *   2) 从本地候选池（KIDS_POOL）里挑出未入库的，按"今日轮值城市"优先，配合通用兜底
 *   3) 直接修改 kids-spots.js 文件（在 KIDS_SPOTS 数组末尾插入新条目，保持注释和函数代码不动）
 *   4) 写日志：data/kids_update.log
 *
 * 不在这一步做 git，由 daily_publish.sh 统一提交。
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const SPOTS_FILE = path.join(ROOT, "kids-spots.js");
const LOG_FILE = path.join(DATA_DIR, "kids_update.log");

/* ========== 工具 ========== */
function log(msg) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  process.stdout.write(line);
}
function fingerprint(s) {
  return String(s || "").replace(/\s+/g, "").toLowerCase();
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* ========== 七天轮值：每天主推一两个城市 + 通用 ========== */
const CITY_ROTATION = [
  ["北京", "通用"],   // 周一
  ["上海", "通用"],   // 周二
  ["广州", "深圳"],   // 周三
  ["杭州", "苏州"],   // 周四
  ["成都", "重庆"],   // 周五
  ["武汉", "南京"],   // 周六
  ["西安", "通用"]    // 周日
];

/* ========== 候选池 ==========
 * 每条结构跟 kids-spots.js 里的 KIDS_SPOTS 完全一致，新增加在最后即可。
 * 已经存在主库里的同名条目会自动跳过，不用担心重复。
 */
const KIDS_POOL = [
  // ===== 北京 =====
  { name: "北京天文馆", city: "北京", type: "科技", ageMin: 5, ageMax: 14, trip: ["solo", "family", "group"], duration: "2-3小时", cost: "低", indoor: true, tags: ["星空", "球幕", "雨天必备"], desc: "球幕影院里看星辰大海，娃下来路上能跟你聊一路宇宙。", tips: "提前官网买票，球幕场次有限。" },
  { name: "北京古动物馆", city: "北京", type: "博物馆", ageMin: 4, ageMax: 12, trip: ["solo", "family"], duration: "1.5小时", cost: "免费", indoor: true, tags: ["恐龙", "免费", "小而精"], desc: "西直门附近藏着的恐龙化石小馆，不用人挤人，看得清又便宜。", tips: "周一闭馆，需现场实名预约。" },
  { name: "中国铁道博物馆 东郊馆", city: "北京", type: "博物馆", ageMin: 3, ageMax: 12, trip: ["family", "group"], duration: "2小时", cost: "低", indoor: true, tags: ["火车", "男宝最爱", "宽敞"], desc: "上百台真火车头任你看，男宝走路都飘，地方大不挤。", tips: "周末场次更多，注意官方公告临时维护。" },
  { name: "北京海洋馆（动物园内）", city: "北京", type: "动物", ageMin: 1, ageMax: 10, trip: ["family", "group"], duration: "2-3小时", cost: "中", indoor: true, tags: ["白鲸", "海豚", "全天候"], desc: "国内老牌海洋馆之一，鲨鱼隧道和白鲸表演常年人气。", tips: "动物园+海洋馆套票更划算，场馆较冷夏季也别穿太薄。" },
  { name: "国家自然博物馆", city: "北京", type: "博物馆", ageMin: 4, ageMax: 14, trip: ["solo", "family", "group"], duration: "3小时", cost: "免费", indoor: true, tags: ["免费", "恐龙", "古生物"], desc: "天坛旁的免费博物馆，恐龙厅是娃的必停留点。", tips: "提前 7 天官方预约，周一闭馆。" },

  // ===== 上海 =====
  { name: "上海科技馆", city: "上海", type: "科技", ageMin: 5, ageMax: 14, trip: ["solo", "family", "group"], duration: "一整天", cost: "低", indoor: true, tags: ["互动", "顶流", "雨天首选"], desc: "国内顶流科技馆之一，蜘蛛展厅、机器人世界足够娃嗨一天。", tips: "周一闭馆，地铁2号线直达。建议预约首场入园。" },
  { name: "上海野生动物园", city: "上海", type: "动物", ageMin: 2, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中", indoor: false, tags: ["车行区", "熊猫", "近郊"], desc: "可以坐车进车行区看狮子老虎，娃刺激爸妈安全。", tips: "夏天上午 9 点前入园动物最活跃。" },
  { name: "顾村公园 樱花林", city: "上海", type: "户外", ageMin: 1, ageMax: 10, trip: ["solo", "family", "group"], duration: "半天", cost: "低", indoor: false, tags: ["大草坪", "春季首选", "野餐"], desc: "上海最大的城市公园之一，春天樱花刷屏，平时就是溜娃绿地金牌。", tips: "1 号门附近草坪最大，带野餐垫和泡泡机。" },
  { name: "玻璃博物馆", city: "上海", type: "博物馆", ageMin: 5, ageMax: 14, trip: ["family", "group"], duration: "2-3小时", cost: "中", indoor: true, tags: ["互动", "DIY", "亲子专区"], desc: "宝山的小众博物馆，专门设了儿童体验区可以亲手做玻璃。", tips: "提前预约 DIY 环节，周一闭馆。" },
  { name: "辰山植物园", city: "上海", type: "自然", ageMin: 2, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "低", indoor: false, tags: ["儿童园", "矿坑花园", "野餐"], desc: "西区有专门的儿童园+迷宫，矿坑花园拍照杀，地方大不挤。", tips: "建议从 1 号门进，租一辆亲子电瓶车。" },

  // ===== 广州 =====
  { name: "广州正佳极地海洋世界", city: "广州", type: "动物", ageMin: 1, ageMax: 12, trip: ["family", "group"], duration: "3-4小时", cost: "中", indoor: true, tags: ["室内", "极地动物", "市中心"], desc: "市中心商场里的海洋馆，逛吃看动物一站搞定，雨天救星。", tips: "美团购票更划算，周末避开下午饭点高峰。" },
  { name: "广州塔 + 海心沙", city: "广州", type: "户外", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "中", indoor: "both", tags: ["地标", "夜景", "拍照"], desc: "白天江边吹风，傍晚看灯光秀，娃能体验「这就是城市」。", tips: "下午 4 点出发刚好接住夕阳和夜景。" },
  { name: "白云山", city: "广州", type: "自然", ageMin: 5, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "低", indoor: false, tags: ["徒步", "缆车", "市民登山"], desc: "广州人后花园，缆车上山徒步下山，强度可控适合娃。", tips: "穿运动鞋，山顶天气稍凉带件薄外套。" },

  // ===== 深圳 =====
  { name: "仙湖植物园", city: "深圳", type: "自然", ageMin: 2, ageMax: 12, trip: ["solo", "family", "group"], duration: "半天", cost: "免费", indoor: false, tags: ["大草坪", "古化石", "踩水"], desc: "免费但内容超丰富，化石森林+蝴蝶谷+大草坪一应俱全。", tips: "需提前 7 天预约，开车导航停车场提前到。" },
  { name: "莲花山公园", city: "深圳", type: "户外", ageMin: 1, ageMax: 12, trip: ["solo", "family", "group"], duration: "半天", cost: "免费", indoor: false, tags: ["放风筝", "大草坪", "市中心"], desc: "市中心免费公园天花板，山顶大草坪是放风筝圣地。", tips: "西门进山顶最近，下午风更大风筝更好放。" },
  { name: "OCT 创意文化园", city: "深圳", type: "户外", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "低", indoor: "both", tags: ["艺术", "拍照", "咖啡"], desc: "厂房改造的文创园，娃可以画涂鸦墙看小展，爸妈喝咖啡。", tips: "周末有市集，下午 3 点后人流舒服。" },
  { name: "前海石公园", city: "深圳", type: "户外", ageMin: 1, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "免费", indoor: false, tags: ["海边", "草坪", "新晋"], desc: "深圳新晋遛娃地标，超大草坪+海边风车，免费且好停车。", tips: "周末下午风大凉爽，带防晒和泡泡机。" },

  // ===== 杭州 =====
  { name: "宋城烂苹果乐园", city: "杭州", type: "游乐", ageMin: 3, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中高", indoor: "both", tags: ["主题乐园", "刺激低", "全年龄"], desc: "刺激度低、项目温和的亲子乐园，比迪士尼性价比高很多。", tips: "美团套票更划算，建议工作日避开人潮。" },
  { name: "西溪湿地", city: "杭州", type: "自然", ageMin: 2, ageMax: 10, trip: ["family", "group"], duration: "半天", cost: "中", indoor: false, tags: ["摇橹船", "观鸟", "野趣"], desc: "坐摇橹船漂游湿地，娃能看水鸟看鱼看莲，比西湖清净。", tips: "周家村入口最方便，建议预订电瓶船和摇橹船组合。" },
  { name: "杭州 LEGOLAND 探索中心", city: "杭州", type: "室内游乐", ageMin: 3, ageMax: 10, trip: ["family", "group"], duration: "3小时", cost: "中高", indoor: true, tags: ["乐高", "室内", "下雨首选"], desc: "万象城里的乐高乐园，娃拼到不想走，雨天大杀器。", tips: "工作日票价更友好，吃饭可以直接到楼上美食广场。" },

  // ===== 苏州 =====
  { name: "苏州博物馆", city: "苏州", type: "博物馆", ageMin: 6, ageMax: 14, trip: ["solo", "family", "group"], duration: "2小时", cost: "免费", indoor: true, tags: ["免费", "贝聿铭", "颜值"], desc: "贝聿铭设计的博物馆本身就是展品，娃看得不无聊还能涨知识。", tips: "需提前预约，工作日人少。" },
  { name: "苏州乐园森林世界", city: "苏州", type: "游乐", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中高", indoor: false, tags: ["主题乐园", "森林", "近郊"], desc: "森林主题游乐园，娃玩得开心爸妈也凉快。", tips: "美团购票较划算，避开正午高温。" },
  { name: "金鸡湖+月光码头", city: "苏州", type: "户外", ageMin: 2, ageMax: 10, trip: ["solo", "family", "group"], duration: "半天", cost: "免费", indoor: false, tags: ["夜景", "免费", "湖边"], desc: "晚饭后的遛娃神器，灯光秀+湖边大草坪，挺惬意。", tips: "下午 5 点后去最舒服，可以接着看灯光秀。" },

  // ===== 成都 =====
  { name: "成都博物馆", city: "成都", type: "博物馆", ageMin: 6, ageMax: 14, trip: ["solo", "family", "group"], duration: "2-3小时", cost: "免费", indoor: true, tags: ["免费", "皮影戏", "天府"], desc: "天府广场旁的免费博物馆，皮影戏厅特别适合带娃。", tips: "需官方预约，周一闭馆。" },
  { name: "成都海昌极地海洋公园", city: "成都", type: "动物", ageMin: 2, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中高", indoor: "both", tags: ["海洋", "表演", "近郊"], desc: "极地动物+海豚表演+游乐项目，娃一天玩到嗨。", tips: "美团购票更划算，建议自驾或地铁 1 号线接驳。" },
  { name: "天府艺术公园", city: "成都", type: "户外", ageMin: 1, ageMax: 10, trip: ["solo", "family", "group"], duration: "半天", cost: "免费", indoor: "both", tags: ["免费", "新晋", "草坪"], desc: "成都新晋遛娃热门，草坪+图书馆+美术馆三合一。", tips: "下午光线最好拍照，周末下午有露天市集。" },

  // ===== 重庆 =====
  { name: "重庆自然博物馆", city: "重庆", type: "博物馆", ageMin: 4, ageMax: 14, trip: ["solo", "family", "group"], duration: "2-3小时", cost: "免费", indoor: true, tags: ["免费", "恐龙", "互动"], desc: "北碚的免费自然博物馆，恐龙化石数量惊人，性价比之王。", tips: "提前预约，自驾更方便，市区过去 1 小时。" },
  { name: "重庆动物园", city: "重庆", type: "动物", ageMin: 2, ageMax: 10, trip: ["family", "group"], duration: "半天", cost: "低", indoor: false, tags: ["熊猫", "性价比", "市中心"], desc: "市内动物园里熊猫数量很可以，门票便宜还能逛半天。", tips: "建议从北门入园，先看熊猫再看其他。" },
  { name: "鹅岭二厂文创公园", city: "重庆", type: "户外", ageMin: 5, ageMax: 12, trip: ["family", "group"], duration: "3小时", cost: "免费", indoor: "both", tags: ["文创", "拍照", "复古"], desc: "工业风改造的文创园，娃画涂鸦爸妈拍照两不耽误。", tips: "周末下午人最多，建议早上去比较从容。" },

  // ===== 武汉 =====
  { name: "武汉海昌极地海洋公园", city: "武汉", type: "动物", ageMin: 2, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中高", indoor: "both", tags: ["海洋", "极地", "表演"], desc: "极地动物+海洋表演+陆地动物，能完整玩一天。", tips: "美团购票，建议自驾或地铁直达。" },
  { name: "东湖绿道", city: "武汉", type: "户外", ageMin: 2, ageMax: 12, trip: ["solo", "family", "group"], duration: "半天", cost: "低", indoor: false, tags: ["骑行", "湖景", "性价比"], desc: "武汉最适合骑行的湖边绿道，租双人亲子车很爽。", tips: "建议从听涛景区入口入园，沿湖路线最美。" },

  // ===== 南京 =====
  { name: "南京古生物博物馆", city: "南京", type: "博物馆", ageMin: 5, ageMax: 14, trip: ["solo", "family", "group"], duration: "2小时", cost: "低", indoor: true, tags: ["古生物", "互动", "小众"], desc: "鸡鸣寺旁的小众博物馆，专门讲古生物，娃听得入迷。", tips: "工作日基本没人，性价比超高。" },
  { name: "南京红山森林动物园", city: "南京", type: "动物", ageMin: 2, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "低", indoor: false, tags: ["生态友好", "良心园区", "口碑王"], desc: "国内口碑最好的动物园之一，动物福利做得相当好。", tips: "建议从北门进，避开周末 11-13 点高峰。" },
  { name: "南京博物院", city: "南京", type: "博物馆", ageMin: 6, ageMax: 14, trip: ["family", "group"], duration: "3小时", cost: "免费", indoor: true, tags: ["免费", "民国馆", "全龄"], desc: "民国馆复刻得活灵活现，娃像穿越，爸妈也上头。", tips: "需官方预约，周一闭馆。" },

  // ===== 西安 =====
  { name: "陕西历史博物馆", city: "西安", type: "博物馆", ageMin: 6, ageMax: 14, trip: ["family", "group"], duration: "3小时", cost: "免费", indoor: true, tags: ["免费", "国宝", "讲解"], desc: "国家级大馆里的免费票最难抢但最值得，记得请讲解。", tips: "免费票需提前 7 天预约，周一闭馆。" },
  { name: "西安城墙骑行", city: "西安", type: "运动", ageMin: 6, ageMax: 14, trip: ["family", "group"], duration: "半天", cost: "中", indoor: false, tags: ["骑行", "古城", "独特"], desc: "在城墙上骑双人自行车 1.5 小时绕一圈，娃记一辈子。", tips: "南门入口人最多，建议从含光门或文昌门上去。" },
  { name: "大唐芙蓉园", city: "西安", type: "户外", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "半天", cost: "中", indoor: false, tags: ["夜景", "演出", "灯光秀"], desc: "傍晚去最佳，水秀+灯光秀让娃以为穿越大唐。", tips: "下午 5 点入园最划算，水秀场次提前查。" },

  // ===== 通用补充 =====
  { name: "城市规划展览馆", city: "通用", type: "博物馆", ageMin: 5, ageMax: 12, trip: ["solo", "family", "group"], duration: "2小时", cost: "免费", indoor: true, tags: ["免费", "城市沙盘", "雨天"], desc: "几乎每个大城市都有的免费小馆，巨型沙盘和模型娃看不腻。", tips: "周末通常更热闹，工作日特别清静。" },
  { name: "本地科普海洋馆 / 水母馆", city: "通用", type: "动物", ageMin: 1, ageMax: 10, trip: ["family", "group"], duration: "2小时", cost: "中", indoor: true, tags: ["室内", "拍照", "全年龄"], desc: "近年很多城市新开的水母主题馆，颜值高、娃专注度高。", tips: "周末容易排队，建议工作日下午前往。" },
  { name: "亲子卡丁车馆", city: "通用", type: "运动", ageMin: 5, ageMax: 12, trip: ["family", "group"], duration: "1-2小时", cost: "中", indoor: true, tags: ["室内", "刺激", "男宝爱"], desc: "近年亲子卡丁车馆很多商场都进驻，娃飙车爽到飞起。", tips: "美团搜「亲子卡丁车」，体验前先量身高。" },
  { name: "蹦床公园", city: "通用", type: "运动", ageMin: 4, ageMax: 14, trip: ["family", "group"], duration: "2小时", cost: "中", indoor: true, tags: ["室内", "消耗体力", "一蹦回血"], desc: "娃跳一小时晚上秒睡，爸妈解放神器。", tips: "需穿防滑袜（场馆有售），饭前去最佳避免跳吐。" },
  { name: "小型亲子农庄一日游", city: "通用", type: "自然", ageMin: 3, ageMax: 12, trip: ["family", "group"], duration: "一整天", cost: "中", indoor: false, tags: ["喂动物", "采摘", "结伴"], desc: "近郊一两小时车程的小农庄，喂兔子骑小马采草莓，能玩一天。", tips: "美团或大众点评搜「亲子农场」，建议提前订餐。" },
  { name: "亲子绘画/油画 DIY 工作室", city: "通用", type: "手作", ageMin: 4, ageMax: 12, trip: ["solo", "family", "group"], duration: "2-3小时", cost: "中", indoor: true, tags: ["DIY", "成品带回家", "雨天"], desc: "随手就能在城市里找到，画完一幅油画带回家，仪式感满分。", tips: "提前预约，建议挑工作日下午体验。" },
  { name: "亲子木工坊", city: "通用", type: "手作", ageMin: 5, ageMax: 12, trip: ["family", "group"], duration: "2-3小时", cost: "中", indoor: true, tags: ["DIY", "锻炼专注", "男宝爱"], desc: "娃自己锯木头钉钉子做小板凳，专注力一下子被点燃。", tips: "穿耐脏衣服，提前问好工具是否儿童版。" },
  { name: "城市里的儿童剧场", city: "通用", type: "博物馆", ageMin: 3, ageMax: 10, trip: ["family", "group"], duration: "1.5小时", cost: "中", indoor: true, tags: ["互动剧", "周末专属", "雨天"], desc: "周末很多剧场都有亲子互动剧，娃看得咯咯笑爸妈也乐。", tips: "大麦/猫眼搜「亲子剧」，提前 1-2 周抢前排。" },
  { name: "亲子烘焙工作坊", city: "通用", type: "手作", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "2小时", cost: "中", indoor: true, tags: ["美食", "DIY", "女宝爱"], desc: "披萨/曲奇/蛋糕课二选一，烤完热腾腾带回家。", tips: "提前预约，避免空腹去（娃容易咬生面团）。" },
  { name: "城市暮色 Citywalk 路线", city: "通用", type: "户外", ageMin: 5, ageMax: 12, trip: ["solo", "family", "group"], duration: "2小时", cost: "免费", indoor: false, tags: ["免费", "傍晚", "亲子聊天"], desc: "选一条没走过的小巷，下午 5 点出发走到天黑，路上聊聊学校的事。", tips: "夏天涂防晒，冬天加件外套，不要走太远。" },
  { name: "夜游动物园 / 海洋馆", city: "通用", type: "动物", ageMin: 4, ageMax: 12, trip: ["family", "group"], duration: "3小时", cost: "中", indoor: "both", tags: ["夜场", "凉快", "刺激"], desc: "夏天傍晚才开放的夜场，凉快人少，看夜行动物超有意思。", tips: "夜场票需要单独购买，建议带件薄外套和驱蚊水。" },
  { name: "亲子瑜伽 / 亲子拳击体验课", city: "通用", type: "运动", ageMin: 4, ageMax: 12, trip: ["family"], duration: "1小时", cost: "中", indoor: true, tags: ["亲子互动", "运动", "新鲜感"], desc: "和娃一起上一节体验课，比起单独运动更有连接感。", tips: "穿运动服，提前 1 天大众点评预约体验课。" },
  { name: "工厂参观 / 食品观光线", city: "通用", type: "科技", ageMin: 5, ageMax: 12, trip: ["family", "group"], duration: "2-3小时", cost: "低", indoor: true, tags: ["DIY", "涨知识", "独特"], desc: "巧克力工厂/牛奶厂/茶厂等开放参观，娃看产线着迷还能试吃。", tips: "搜「亲子工厂参观」可以找到不少，需要提前预约。" }
];

/* ========== 主流程 ========== */
function loadExistingNames() {
  if (!fs.existsSync(SPOTS_FILE)) {
    log("kids-spots.js 不存在，先建一下");
    fs.writeFileSync(SPOTS_FILE, "const KIDS_SPOTS = [];\n", "utf8");
  }
  const text = fs.readFileSync(SPOTS_FILE, "utf8");
  const names = new Set();
  // 简单解析：找形如 name: "xxx" 的行
  const re = /name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    names.add(fingerprint(m[1]));
  }
  return { text, names };
}

/* 幂等保护：检查文件里是否已经有今天的「YYYY-MM-DD 自动追加」标记 */
function hasTodayMark(text) {
  return text.includes(`${todayStr()} 自动追加`);
}

function formatSpotEntry(spot) {
  // 用规范的 JSON 化方式生成对象字面量，但 JS 风格更友好
  const fields = [
    `name: ${JSON.stringify(spot.name)}`,
    `city: ${JSON.stringify(spot.city)}`,
    `type: ${JSON.stringify(spot.type)}`,
    `ageMin: ${spot.ageMin}, ageMax: ${spot.ageMax}`,
    `trip: ${JSON.stringify(spot.trip)}`,
    `duration: ${JSON.stringify(spot.duration)}`,
    `cost: ${JSON.stringify(spot.cost)}`,
    `indoor: ${typeof spot.indoor === "string" ? JSON.stringify(spot.indoor) : spot.indoor}`,
    `tags: ${JSON.stringify(spot.tags)}`,
    `desc: ${JSON.stringify(spot.desc)}`,
    `tips: ${JSON.stringify(spot.tips)}`
  ];
  return `  {\n    ${fields.join(",\n    ")}\n  }`;
}

function insertIntoFile(text, newSpots) {
  // 找 KIDS_SPOTS = [ ... ]; 的闭合 ]; 位置
  const startIdx = text.indexOf("const KIDS_SPOTS = [");
  if (startIdx < 0) {
    throw new Error("找不到 const KIDS_SPOTS = [ 起始位置");
  }
  // 从起点开始找匹配的 ]
  let depth = 0;
  let i = startIdx + "const KIDS_SPOTS =".length;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === "[") {
      depth++;
    } else if (ch === "]") {
      depth--;
      if (depth === 0) {
        // i 就是闭合 ]，在它之前插入新条目
        // 找到前面最后一个非空白字符
        let j = i - 1;
        while (j >= 0 && /\s/.test(text[j])) j--;
        const lastChar = text[j];
        const after = text.slice(i);
        const today = todayStr();
        if (lastChar === "}") {
          // 数组里已有条目，需要在 "}" 后补逗号
          const beforeInclLast = text.slice(0, j + 1);
          const block =
            `,\n  // —— ${today} 自动追加 ——\n` +
            newSpots.map(formatSpotEntry).join(",\n") +
            "\n";
          return beforeInclLast + block + after;
        } else {
          // 空数组，直接在 [ 之后插入
          const before = text.slice(0, i);
          const block =
            `\n  // —— ${today} 自动追加 ——\n` +
            newSpots.map(formatSpotEntry).join(",\n") +
            "\n";
          return before + block + after;
        }
      }
    }
  }
  throw new Error("没找到 KIDS_SPOTS 数组的闭合 ]");
}

function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const { text, names } = loadExistingNames();

  // 幂等保护：今天已经追加过就直接跳出（除非环境变量强制覆盖）
  if (hasTodayMark(text) && process.env.FORCE !== "1") {
    log(`今天（${todayStr()}）已经追加过了，跳过。设 FORCE=1 可强制再追加。`);
    return;
  }

  const dow = new Date().getDay(); // 0=周日
  const idx = dow === 0 ? 6 : dow - 1; // 映射成 0=周一
  const todayCities = CITY_ROTATION[idx];

  const addCount = 2 + Math.floor(Math.random() * 3); // 2-4 条

  // 从候选池里挑：先按今日轮值城市挑，剩下从通用兜底
  const fresh = KIDS_POOL.filter(s => !names.has(fingerprint(s.name)));
  const cityHits = fresh.filter(s => todayCities.includes(s.city));
  const fallback = fresh.filter(s => !todayCities.includes(s.city));

  const picked = [];
  const cityShuffled = shuffle(cityHits);
  const fbShuffled = shuffle(fallback);

  while (picked.length < addCount && cityShuffled.length > 0) {
    picked.push(cityShuffled.shift());
  }
  while (picked.length < addCount && fbShuffled.length > 0) {
    picked.push(fbShuffled.shift());
  }

  if (picked.length === 0) {
    log(`【${todayCities.join("/")}】候选池里没有未入库的方案了，今天先不追加。建议补充候选池。`);
    return;
  }

  const newText = insertIntoFile(text, picked);
  fs.writeFileSync(SPOTS_FILE, newText, "utf8");

  const total = names.size + picked.length;
  log(`【${todayCities.join("/")}】追加 ${picked.length} 条：` +
      picked.map(s => `${s.name}(${s.city})`).join("、") +
      ` | 总库：${total} 条`);
}

try {
  main();
} catch (e) {
  log("脚本异常：" + e.stack);
  process.exit(1);
}
