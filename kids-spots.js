/**
 * 溜娃方案库（初版）
 *
 * 字段说明：
 * - name：方案名
 * - city：适用城市（"通用" 代表任何城市都能找到类似场所）
 * - type：场景类型（户外/自然/博物馆/游乐/科技/水上/手作/动物/运动/室内游乐）
 * - ageMin / ageMax：适合年龄区间
 * - trip：适合的出行方式数组（solo 独带 / family 家庭 / group 结伴）
 * - duration：建议停留时长
 * - cost：预算（免费 / 低 / 中 / 中高 / 高）
 * - indoor：是否室内（true 室内，false 户外，"both" 半室内半户外）
 * - tags：标签数组（显示用）
 * - desc：一两句话介绍
 * - tips：实用建议
 */
const KIDS_SPOTS = [
  // ========== 北京 ==========
  {
    name: "奥林匹克森林公园",
    city: "北京",
    type: "户外",
    ageMin: 2, ageMax: 12,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["自然", "野餐", "遛娃友好"],
    desc: "北京最大的城市森林公园，草坪开阔、骑行道平缓，娃放风筝撒野最合适。",
    tips: "带滑板车/平衡车效果翻倍，南园更热闹北园更清净。"
  },
  {
    name: "中国科学技术馆",
    city: "北京",
    type: "科技",
    ageMin: 4, ageMax: 14,
    trip: ["family", "group"],
    duration: "3-4小时",
    cost: "低",
    indoor: true,
    tags: ["科普", "互动", "涨知识"],
    desc: "儿童科学乐园+主展厅能玩一整天，互动展项多到娃不想走。",
    tips: "官网提前预约，工作日比周末舒服太多。"
  },
  {
    name: "北京动物园+海洋馆",
    city: "北京",
    type: "动物",
    ageMin: 2, ageMax: 10,
    trip: ["family", "group"],
    duration: "大半天",
    cost: "中",
    indoor: "both",
    tags: ["熊猫", "海豚", "老牌"],
    desc: "熊猫馆和海洋馆基本是娃的必去清单，老牌经典但确实好用。",
    tips: "海洋馆夏天凉快冬天暖和，动物园记得先看熊猫再看其他。"
  },
  {
    name: "北京汽车博物馆",
    city: "北京",
    type: "博物馆",
    ageMin: 3, ageMax: 12,
    trip: ["solo", "family", "group"],
    duration: "2-3小时",
    cost: "低",
    indoor: true,
    tags: ["车迷", "互动", "男宝最爱"],
    desc: "男宝圣地，真车+模拟驾驶+未来汽车，雨天备选神器。",
    tips: "周一闭馆，提前官网预约免费票。"
  },

  // ========== 上海 ==========
  {
    name: "上海自然博物馆",
    city: "上海",
    type: "博物馆",
    ageMin: 3, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "3-4小时",
    cost: "低",
    indoor: true,
    tags: ["恐龙", "自然", "雨天必备"],
    desc: "恐龙化石+动物标本+互动展项，娃能看三小时不带重样的。",
    tips: "必须官方预约，工作日人少，地铁13号线自然博物馆站直达。"
  },
  {
    name: "上海迪士尼乐园",
    city: "上海",
    type: "游乐",
    ageMin: 3, ageMax: 14,
    trip: ["family", "group"],
    duration: "一整天",
    cost: "高",
    indoor: false,
    tags: ["顶流", "拍照", "仪式感"],
    desc: "娃的梦想之地，也是爸妈钱包的试炼场。",
    tips: "买早享卡或尊享卡能省一半排队时间，夏季下午准备雨衣。"
  },
  {
    name: "世纪公园 / 共青森林公园",
    city: "上海",
    type: "户外",
    ageMin: 1, ageMax: 10,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["草坪", "野餐", "骑行"],
    desc: "市区遛娃金牌公园组合，野餐垫+泡泡机+滑板车一条龙。",
    tips: "世纪公园现在免费开放，建议七号门附近大草坪扎营。"
  },
  {
    name: "上海海昌海洋公园",
    city: "上海",
    type: "动物",
    ageMin: 2, ageMax: 12,
    trip: ["family", "group"],
    duration: "一整天",
    cost: "中高",
    indoor: "both",
    tags: ["海洋", "表演", "近郊"],
    desc: "海洋馆+游乐园二合一，虎鲸表演是记忆点。",
    tips: "地铁16号线直达，门票提前一天美团买。"
  },

  // ========== 广州 ==========
  {
    name: "广州长隆野生动物世界",
    city: "广州",
    type: "动物",
    ageMin: 2, ageMax: 12,
    trip: ["family", "group"],
    duration: "一整天",
    cost: "中高",
    indoor: false,
    tags: ["国内顶级", "考拉", "熊猫三胞胎"],
    desc: "国内最能打的动物园没有之一，考拉和熊猫三胞胎是王牌。",
    tips: "一定坐小火车+缆车，夏天早上9点入园才不晒崩。"
  },
  {
    name: "广东省博物馆",
    city: "广州",
    type: "博物馆",
    ageMin: 5, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "2-3小时",
    cost: "免费",
    indoor: true,
    tags: ["免费", "恐龙厅", "自然"],
    desc: "免费的省级博物馆，恐龙厅和海洋厅对小朋友友好到极致。",
    tips: "周一闭馆，官方预约。带娃避开历史厅直奔自然展区。"
  },
  {
    name: "海珠湿地公园",
    city: "广州",
    type: "自然",
    ageMin: 2, ageMax: 10,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["观鸟", "骑行", "溜娃平价"],
    desc: "广州最大的城市湿地，骑行观鸟都很能打。",
    tips: "建议租双人自行车从1期进，带水和驱蚊水。"
  },

  // ========== 深圳 ==========
  {
    name: "深圳湾公园",
    city: "深圳",
    type: "户外",
    ageMin: 1, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["海边", "观鸟", "骑行"],
    desc: "一边是海一边是城市天际线，黄昏去拍照也带娃两不误。",
    tips: "下午4点后风大凉爽，东段适合跑跳，西段观鸟最佳。"
  },
  {
    name: "深圳欢乐海岸盒子乐园",
    city: "深圳",
    type: "室内游乐",
    ageMin: 1, ageMax: 8,
    trip: ["solo", "family"],
    duration: "2-3小时",
    cost: "中",
    indoor: true,
    tags: ["下雨神器", "家长躺平", "室内"],
    desc: "超大室内亲子乐园，爸妈能找到座位娃能自己嗨。",
    tips: "穿防滑袜（必须），周末最好下午3点后去避开高峰。"
  },
  {
    name: "深圳野生动物园",
    city: "深圳",
    type: "动物",
    ageMin: 2, ageMax: 10,
    trip: ["family", "group"],
    duration: "一整天",
    cost: "中",
    indoor: false,
    tags: ["老牌", "海洋天地", "全家适配"],
    desc: "深圳溜娃老牌顶流，动物+海洋表演一天搞定。",
    tips: "建议反向游览避开大部队，带伞既遮阳又挡雨。"
  },
  {
    name: "少年宫 · 科学馆",
    city: "深圳",
    type: "科技",
    ageMin: 4, ageMax: 12,
    trip: ["solo", "family", "group"],
    duration: "2-3小时",
    cost: "免费",
    indoor: true,
    tags: ["免费", "科普", "市中心"],
    desc: "地铁直达的免费科技馆，雨天/炎夏的救命稻草。",
    tips: "公众号提前预约，周末人多建议早上开馆就去。"
  },

  // ========== 杭州 ==========
  {
    name: "杭州动物园 + 虎跑",
    city: "杭州",
    type: "动物",
    ageMin: 2, ageMax: 10,
    trip: ["family", "group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["老牌", "性价比", "树林"],
    desc: "西湖南线玩法组合，动物园平价又好逛。",
    tips: "带水打虎跑泉，动物园下午3点后光线温柔好拍照。"
  },
  {
    name: "浙江省自然博物院杭州馆",
    city: "杭州",
    type: "博物馆",
    ageMin: 3, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "2-3小时",
    cost: "免费",
    indoor: true,
    tags: ["免费", "恐龙", "互动"],
    desc: "免费但满配，地球馆和生命馆对小朋友极其友好。",
    tips: "官方预约，工作日很清静。"
  },

  // ========== 成都 ==========
  {
    name: "大熊猫繁育研究基地",
    city: "成都",
    type: "动物",
    ageMin: 2, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["熊猫", "顶流", "必去"],
    desc: "来成都带娃不看熊猫说不过去，早上看最活跃。",
    tips: "8:00前入园，10点后熊猫全部开始躺平。"
  },
  {
    name: "成都浣花溪公园",
    city: "成都",
    type: "户外",
    ageMin: 1, ageMax: 10,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["草坪", "骑行", "野餐"],
    desc: "市中心最适合野餐放风的公园，河边草坪超大。",
    tips: "租儿童电动车40元/小时，带野餐垫和泡泡机。"
  },

  // ========== 武汉 ==========
  {
    name: "武汉园博园",
    city: "武汉",
    type: "户外",
    ageMin: 2, ageMax: 12,
    trip: ["family", "group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["大草坪", "园林", "骑行"],
    desc: "大到能骑车的公园，春秋季遛娃天花板。",
    tips: "建议从北门进，必租亲子电瓶车。"
  },
  {
    name: "湖北省博物馆",
    city: "武汉",
    type: "博物馆",
    ageMin: 6, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "2-3小时",
    cost: "免费",
    indoor: true,
    tags: ["免费", "编钟", "文物控"],
    desc: "免费但含金量超高，稍大点的娃能看得津津有味。",
    tips: "必约票，编钟表演记得查当天场次。"
  },

  // ========== 通用（任何城市都找得到类似场所）==========
  {
    name: "城市图书馆少儿区",
    city: "通用",
    type: "室内游乐",
    ageMin: 1, ageMax: 10,
    trip: ["solo", "family", "group"],
    duration: "2小时",
    cost: "免费",
    indoor: true,
    tags: ["免费", "安静", "雨天必备"],
    desc: "几乎每个城市都有，免费凉爽还能借绘本回家，独带娃性价比拉满。",
    tips: "带个保温杯，有的图书馆禁食，先查好开放时间。"
  },
  {
    name: "本地商场亲子乐园",
    city: "通用",
    type: "室内游乐",
    ageMin: 1, ageMax: 8,
    trip: ["solo", "family"],
    duration: "2-3小时",
    cost: "中",
    indoor: true,
    tags: ["下雨神器", "吃喝一体", "爸妈友好"],
    desc: "奈尔宝/玩具反斗城/Meland这种室内娃场，爸妈能歇娃能嗨。",
    tips: "工作日会便宜一半，周末最好避开11-14点饭点高峰。"
  },
  {
    name: "市属植物园 / 花卉公园",
    city: "通用",
    type: "自然",
    ageMin: 1, ageMax: 10,
    trip: ["solo", "family", "group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["花草", "散步", "拍照"],
    desc: "每个城市都有的神器：树荫+草坪+小桥流水，娃跑爸妈躺。",
    tips: "春秋最佳，记得涂防晒和驱蚊。"
  },
  {
    name: "城市近郊农家乐/采摘园",
    city: "通用",
    type: "自然",
    ageMin: 3, ageMax: 12,
    trip: ["family", "group"],
    duration: "大半天",
    cost: "中",
    indoor: false,
    tags: ["采摘", "农家菜", "周末专属"],
    desc: "草莓/蓝莓/葡萄/柿子按季节来，娃边摘边吃最治愈。",
    tips: "当季才好玩，建议出发前电话确认开放和价格。"
  },
  {
    name: "城市运动中心/亲子游泳馆",
    city: "通用",
    type: "运动",
    ageMin: 3, ageMax: 14,
    trip: ["family", "group"],
    duration: "2小时",
    cost: "中",
    indoor: true,
    tags: ["消耗体力", "室内", "天气无关"],
    desc: "消耗娃体力的硬通货，游完泳吃个饭回家睡两小时。",
    tips: "带两条大毛巾，娃3岁以下建议选专门的亲子戏水池。"
  },
  {
    name: "绘本馆 / 儿童书店",
    city: "通用",
    type: "手作",
    ageMin: 1, ageMax: 8,
    trip: ["solo", "family"],
    duration: "2小时",
    cost: "低",
    indoor: true,
    tags: ["安静", "亲子阅读", "独带友好"],
    desc: "独带娃救星，娃自己看书爸妈能喘口气。",
    tips: "多数绘本馆支持按月办卡比单次划算。"
  },
  {
    name: "陶艺/烘焙 DIY 手作馆",
    city: "通用",
    type: "手作",
    ageMin: 3, ageMax: 12,
    trip: ["family", "group"],
    duration: "2-3小时",
    cost: "中",
    indoor: true,
    tags: ["DIY", "有成品", "朋友圈素材"],
    desc: "做个陶碗烤个饼干，带回家能吹一周的仪式感。",
    tips: "大众点评搜'亲子DIY'，提前一天预约。"
  },
  {
    name: "城市天文馆 / 科技馆",
    city: "通用",
    type: "科技",
    ageMin: 4, ageMax: 14,
    trip: ["solo", "family", "group"],
    duration: "3小时",
    cost: "低",
    indoor: true,
    tags: ["涨知识", "互动", "雨天首选"],
    desc: "大部分城市都有，互动展项能让娃一直嘎嘎叫。",
    tips: "球幕电影/天象厅场次有限，买票时一起订。"
  },
  {
    name: "本地水上乐园（夏季）",
    city: "通用",
    type: "水上",
    ageMin: 3, ageMax: 12,
    trip: ["family", "group"],
    duration: "一整天",
    cost: "中高",
    indoor: false,
    tags: ["夏日专属", "消暑", "体力消耗"],
    desc: "夏天独一档的遛娃王牌，娃玩一天晚上秒睡。",
    tips: "一定穿防晒泳衣，下午4点后光线温柔最舒服。"
  },
  {
    name: "本地农场/马场/亲子牧场",
    city: "通用",
    type: "动物",
    ageMin: 2, ageMax: 10,
    trip: ["family", "group"],
    duration: "半天",
    cost: "中",
    indoor: false,
    tags: ["喂动物", "骑小马", "结伴友好"],
    desc: "喂羊驼骑矮脚马，小朋友抱团玩超出预期。",
    tips: "大众点评搜'亲子牧场'，周末最好提前订。"
  },
  {
    name: "海洋馆/水族馆",
    city: "通用",
    type: "动物",
    ageMin: 1, ageMax: 12,
    trip: ["solo", "family", "group"],
    duration: "3小时",
    cost: "中",
    indoor: true,
    tags: ["室内", "适合各年龄", "爆款"],
    desc: "不挑天气的溜娃稳妥之选，2岁以下也能看看灯光。",
    tips: "官方/小程序票比现场便宜30%，避开周末中午场。"
  }
,
  // —— 2026-05-11 自动追加 ——
  {
    name: "亲子木工坊",
    city: "通用",
    type: "手作",
    ageMin: 5, ageMax: 12,
    trip: ["family","group"],
    duration: "2-3小时",
    cost: "中",
    indoor: true,
    tags: ["DIY","锻炼专注","男宝爱"],
    desc: "娃自己锯木头钉钉子做小板凳，专注力一下子被点燃。",
    tips: "穿耐脏衣服，提前问好工具是否儿童版。"
  },
  {
    name: "城市里的儿童剧场",
    city: "通用",
    type: "博物馆",
    ageMin: 3, ageMax: 10,
    trip: ["family","group"],
    duration: "1.5小时",
    cost: "中",
    indoor: true,
    tags: ["互动剧","周末专属","雨天"],
    desc: "周末很多剧场都有亲子互动剧，娃看得咯咯笑爸妈也乐。",
    tips: "大麦/猫眼搜「亲子剧」，提前 1-2 周抢前排。"
  },
  {
    name: "北京古动物馆",
    city: "北京",
    type: "博物馆",
    ageMin: 4, ageMax: 12,
    trip: ["solo","family"],
    duration: "1.5小时",
    cost: "免费",
    indoor: true,
    tags: ["恐龙","免费","小而精"],
    desc: "西直门附近藏着的恐龙化石小馆，不用人挤人，看得清又便宜。",
    tips: "周一闭馆，需现场实名预约。"
  },
  // —— 2026-05-12 自动追加 ——
  {
    name: "亲子绘画/油画 DIY 工作室",
    city: "通用",
    type: "手作",
    ageMin: 4, ageMax: 12,
    trip: ["solo","family","group"],
    duration: "2-3小时",
    cost: "中",
    indoor: true,
    tags: ["DIY","成品带回家","雨天"],
    desc: "随手就能在城市里找到，画完一幅油画带回家，仪式感满分。",
    tips: "提前预约，建议挑工作日下午体验。"
  },
  {
    name: "蹦床公园",
    city: "通用",
    type: "运动",
    ageMin: 4, ageMax: 14,
    trip: ["family","group"],
    duration: "2小时",
    cost: "中",
    indoor: true,
    tags: ["室内","消耗体力","一蹦回血"],
    desc: "娃跳一小时晚上秒睡，爸妈解放神器。",
    tips: "需穿防滑袜（场馆有售），饭前去最佳避免跳吐。"
  },
  {
    name: "城市暮色 Citywalk 路线",
    city: "通用",
    type: "户外",
    ageMin: 5, ageMax: 12,
    trip: ["solo","family","group"],
    duration: "2小时",
    cost: "免费",
    indoor: false,
    tags: ["免费","傍晚","亲子聊天"],
    desc: "选一条没走过的小巷，下午 5 点出发走到天黑，路上聊聊学校的事。",
    tips: "夏天涂防晒，冬天加件外套，不要走太远。"
  },
  // —— 2026-05-13 自动追加 ——
  {
    name: "前海石公园",
    city: "深圳",
    type: "户外",
    ageMin: 1, ageMax: 12,
    trip: ["family","group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["海边","草坪","新晋"],
    desc: "深圳新晋遛娃地标，超大草坪+海边风车，免费且好停车。",
    tips: "周末下午风大凉爽，带防晒和泡泡机。"
  },
  {
    name: "白云山",
    city: "广州",
    type: "自然",
    ageMin: 5, ageMax: 12,
    trip: ["family","group"],
    duration: "半天",
    cost: "低",
    indoor: false,
    tags: ["徒步","缆车","市民登山"],
    desc: "广州人后花园，缆车上山徒步下山，强度可控适合娃。",
    tips: "穿运动鞋，山顶天气稍凉带件薄外套。"
  },
  {
    name: "OCT 创意文化园",
    city: "深圳",
    type: "户外",
    ageMin: 4, ageMax: 12,
    trip: ["family","group"],
    duration: "半天",
    cost: "低",
    indoor: "both",
    tags: ["艺术","拍照","咖啡"],
    desc: "厂房改造的文创园，娃可以画涂鸦墙看小展，爸妈喝咖啡。",
    tips: "周末有市集，下午 3 点后人流舒服。"
  },
  // —— 2026-05-13 自动追加 ——
  {
    name: "广州正佳极地海洋世界",
    city: "广州",
    type: "动物",
    ageMin: 1, ageMax: 12,
    trip: ["family","group"],
    duration: "3-4小时",
    cost: "中",
    indoor: true,
    tags: ["室内","极地动物","市中心"],
    desc: "市中心商场里的海洋馆，逛吃看动物一站搞定，雨天救星。",
    tips: "美团购票更划算，周末避开下午饭点高峰。"
  },
  {
    name: "仙湖植物园",
    city: "深圳",
    type: "自然",
    ageMin: 2, ageMax: 12,
    trip: ["solo","family","group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["大草坪","古化石","踩水"],
    desc: "免费但内容超丰富，化石森林+蝴蝶谷+大草坪一应俱全。",
    tips: "需提前 7 天预约，开车导航停车场提前到。"
  },
  {
    name: "广州塔 + 海心沙",
    city: "广州",
    type: "户外",
    ageMin: 4, ageMax: 12,
    trip: ["family","group"],
    duration: "半天",
    cost: "中",
    indoor: "both",
    tags: ["地标","夜景","拍照"],
    desc: "白天江边吹风，傍晚看灯光秀，娃能体验「这就是城市」。",
    tips: "下午 4 点出发刚好接住夕阳和夜景。"
  },
  {
    name: "莲花山公园",
    city: "深圳",
    type: "户外",
    ageMin: 1, ageMax: 12,
    trip: ["solo","family","group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["放风筝","大草坪","市中心"],
    desc: "市中心免费公园天花板，山顶大草坪是放风筝圣地。",
    tips: "西门进山顶最近，下午风更大风筝更好放。"
  },
  // —— 2026-05-14 自动追加 ——
  {
    name: "西溪湿地",
    city: "杭州",
    type: "自然",
    ageMin: 2, ageMax: 10,
    trip: ["family","group"],
    duration: "半天",
    cost: "中",
    indoor: false,
    tags: ["摇橹船","观鸟","野趣"],
    desc: "坐摇橹船漂游湿地，娃能看水鸟看鱼看莲，比西湖清净。",
    tips: "周家村入口最方便，建议预订电瓶船和摇橹船组合。"
  },
  {
    name: "金鸡湖+月光码头",
    city: "苏州",
    type: "户外",
    ageMin: 2, ageMax: 10,
    trip: ["solo","family","group"],
    duration: "半天",
    cost: "免费",
    indoor: false,
    tags: ["夜景","免费","湖边"],
    desc: "晚饭后的遛娃神器，灯光秀+湖边大草坪，挺惬意。",
    tips: "下午 5 点后去最舒服，可以接着看灯光秀。"
  },
  {
    name: "苏州博物馆",
    city: "苏州",
    type: "博物馆",
    ageMin: 6, ageMax: 14,
    trip: ["solo","family","group"],
    duration: "2小时",
    cost: "免费",
    indoor: true,
    tags: ["免费","贝聿铭","颜值"],
    desc: "贝聿铭设计的博物馆本身就是展品，娃看得不无聊还能涨知识。",
    tips: "需提前预约，工作日人少。"
  },
  {
    name: "苏州乐园森林世界",
    city: "苏州",
    type: "游乐",
    ageMin: 4, ageMax: 12,
    trip: ["family","group"],
    duration: "一整天",
    cost: "中高",
    indoor: false,
    tags: ["主题乐园","森林","近郊"],
    desc: "森林主题游乐园，娃玩得开心爸妈也凉快。",
    tips: "美团购票较划算，避开正午高温。"
  },
  // —— 2026-05-16 自动追加 ——
  {
    name: "南京古生物博物馆",
    city: "南京",
    type: "博物馆",
    ageMin: 5, ageMax: 14,
    trip: ["solo","family","group"],
    duration: "2小时",
    cost: "低",
    indoor: true,
    tags: ["古生物","互动","小众"],
    desc: "鸡鸣寺旁的小众博物馆，专门讲古生物，娃听得入迷。",
    tips: "工作日基本没人，性价比超高。"
  },
  {
    name: "武汉海昌极地海洋公园",
    city: "武汉",
    type: "动物",
    ageMin: 2, ageMax: 12,
    trip: ["family","group"],
    duration: "一整天",
    cost: "中高",
    indoor: "both",
    tags: ["海洋","极地","表演"],
    desc: "极地动物+海洋表演+陆地动物，能完整玩一天。",
    tips: "美团购票，建议自驾或地铁直达。"
  },
  {
    name: "本地科普海洋馆 / 水母馆",
    city: "通用",
    type: "动物",
    ageMin: 1, ageMax: 10,
    trip: ["family","group"],
    duration: "2小时",
    cost: "中",
    indoor: true,
    tags: ["室内","拍照","全年龄"],
    desc: "近年很多城市新开的水母主题馆，颜值高、娃专注度高。",
    tips: "周末容易排队，建议工作日下午前往。"
  },
  {
    name: "亲子卡丁车馆",
    city: "通用",
    type: "运动",
    ageMin: 5, ageMax: 12,
    trip: ["family","group"],
    duration: "1-2小时",
    cost: "中",
    indoor: true,
    tags: ["室内","刺激","男宝爱"],
    desc: "近年亲子卡丁车馆很多商场都进驻，娃飙车爽到飞起。",
    tips: "美团搜「亲子卡丁车」，体验前先量身高。"
  },
  // —— 2026-05-17 自动追加 ——
  {
    name: "西安城墙骑行",
    city: "西安",
    type: "运动",
    ageMin: 6, ageMax: 14,
    trip: ["family","group"],
    duration: "半天",
    cost: "中",
    indoor: false,
    tags: ["骑行","古城","独特"],
    desc: "在城墙上骑双人自行车 1.5 小时绕一圈，娃记一辈子。",
    tips: "南门入口人最多，建议从含光门或文昌门上去。"
  },
  {
    name: "亲子瑜伽 / 亲子拳击体验课",
    city: "通用",
    type: "运动",
    ageMin: 4, ageMax: 12,
    trip: ["family"],
    duration: "1小时",
    cost: "中",
    indoor: true,
    tags: ["亲子互动","运动","新鲜感"],
    desc: "和娃一起上一节体验课，比起单独运动更有连接感。",
    tips: "穿运动服，提前 1 天大众点评预约体验课。"
  },
  {
    name: "小型亲子农庄一日游",
    city: "通用",
    type: "自然",
    ageMin: 3, ageMax: 12,
    trip: ["family","group"],
    duration: "一整天",
    cost: "中",
    indoor: false,
    tags: ["喂动物","采摘","结伴"],
    desc: "近郊一两小时车程的小农庄，喂兔子骑小马采草莓，能玩一天。",
    tips: "美团或大众点评搜「亲子农场」，建议提前订餐。"
  },
  {
    name: "亲子烘焙工作坊",
    city: "通用",
    type: "手作",
    ageMin: 4, ageMax: 12,
    trip: ["family","group"],
    duration: "2小时",
    cost: "中",
    indoor: true,
    tags: ["美食","DIY","女宝爱"],
    desc: "披萨/曲奇/蛋糕课二选一，烤完热腾腾带回家。",
    tips: "提前预约，避免空腹去（娃容易咬生面团）。"
  },
  // —— 2026-05-18 自动追加 ——
  {
    name: "夜游动物园 / 海洋馆",
    city: "通用",
    type: "动物",
    ageMin: 4, ageMax: 12,
    trip: ["family","group"],
    duration: "3小时",
    cost: "中",
    indoor: "both",
    tags: ["夜场","凉快","刺激"],
    desc: "夏天傍晚才开放的夜场，凉快人少，看夜行动物超有意思。",
    tips: "夜场票需要单独购买，建议带件薄外套和驱蚊水。"
  },
  {
    name: "工厂参观 / 食品观光线",
    city: "通用",
    type: "科技",
    ageMin: 5, ageMax: 12,
    trip: ["family","group"],
    duration: "2-3小时",
    cost: "低",
    indoor: true,
    tags: ["DIY","涨知识","独特"],
    desc: "巧克力工厂/牛奶厂/茶厂等开放参观，娃看产线着迷还能试吃。",
    tips: "搜「亲子工厂参观」可以找到不少，需要提前预约。"
  }
];

/**
 * 按条件筛选 + 打分
 */
function pickKidsSpots(input) {
  const { city, trip, age, boyCount, girlCount } = input;
  const totalKids = boyCount + girlCount;

  const scored = KIDS_SPOTS.map(spot => {
    let score = 0;
    let reasons = [];

    // 城市匹配
    if (spot.city === city) { score += 50; reasons.push("本地专属"); }
    else if (spot.city === "通用") { score += 20; }
    else { score -= 10; } // 其他城市的推荐降权（但不完全排除）

    // 年龄匹配
    if (age >= spot.ageMin && age <= spot.ageMax) {
      score += 30;
      reasons.push(`适合 ${spot.ageMin}-${spot.ageMax} 岁`);
    } else {
      const offset = age < spot.ageMin ? spot.ageMin - age : age - spot.ageMax;
      score -= offset * 8;
    }

    // 出行方式匹配
    if (spot.trip.includes(trip)) { score += 20; }
    else { score -= 15; }

    // 独带娃：加分给"家长省力"的（室内 + 预算可控 + 独带适配）
    if (trip === "solo") {
      if (spot.indoor === true) { score += 10; reasons.push("室内好照看"); }
      if (spot.cost === "免费" || spot.cost === "低") { score += 5; }
      if (totalKids >= 2) {
        // 独带多娃：更偏向封闭/室内场所
        if (spot.indoor === true) score += 8;
        else if (spot.indoor === false) score -= 8;
      }
    }

    // 结伴出行：加分给"开阔场地+娃多能一起玩"的
    if (trip === "group") {
      if (spot.indoor === false || spot.indoor === "both") { score += 8; reasons.push("人多放得开"); }
      if (["户外", "自然", "动物", "游乐", "水上"].includes(spot.type)) score += 6;
    }

    // 家庭出行：中规中矩，轻微偏好综合型
    if (trip === "family") {
      if (["游乐", "动物", "自然", "博物馆"].includes(spot.type)) score += 4;
    }

    // 娃数量：2个及以上更偏爱场地大的
    if (totalKids >= 2 && (spot.indoor === false || spot.indoor === "both")) score += 4;

    // 男宝女宝比例微调
    if (boyCount > girlCount && ["科技", "博物馆", "运动"].includes(spot.type)) score += 3;
    if (girlCount > boyCount && ["手作", "自然", "动物"].includes(spot.type)) score += 3;

    return { spot, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  // 取前 6 个，再从里面随机挑 3 个，避免每次都一样
  const top = scored.slice(0, Math.min(6, scored.length));
  const picked = [];
  const pool = [...top];
  while (picked.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

/**
 * 根据条件生成出门前的小贴士
 */
function buildKidsTips(input) {
  const { trip, age, boyCount, girlCount } = input;
  const totalKids = boyCount + girlCount;
  const tips = [];

  if (trip === "solo") {
    tips.push("独带娃首选室内/封闭场地，别选需要同时盯多个方向的地方。");
    tips.push("背包清单：湿巾、备用衣服、小零食、创可贴、一个能当水杯的保温杯。");
    if (totalKids >= 2) tips.push("两个娃以上独带，强烈建议用牵引绳/腕带，别心软。");
  }
  if (trip === "family") {
    tips.push("一家人出行可以分工：一人主攻娃、一人负责后勤，轮岗不崩溃。");
    tips.push("午饭时间提前半小时出发，避开餐厅高峰和娃发脾气的临界点。");
  }
  if (trip === "group") {
    tips.push("结伴出行提前拉群约地点，娃能一起玩的场所大家都解放。");
    tips.push("建议 AA 某个家庭负责订餐/订票，分工清晰才不乱。");
  }

  if (age <= 2) {
    tips.push("2 岁以内：首选推车能进的场所，避开太晒/太吵/光线刺激的地方。");
    tips.push("奶瓶/尿布/湿巾备双份，路上堵车比想象长。");
  } else if (age <= 5) {
    tips.push("3-5 岁：每 1.5 小时安排一次休息+零食补给，不然临门崩溃。");
    tips.push("带一件玩具/绘本当备用，排队时救命。");
  } else if (age <= 12) {
    tips.push("6-12 岁：可以让娃提前参与决策（看哪个展、吃什么），参与感降低耍赖概率。");
    tips.push("带水、防晒、简单药品（晕车药/创可贴/退烧贴）。");
  } else {
    tips.push("13 岁+：把部分决定权交给娃，爸妈负责后勤和氛围组。");
  }

  tips.push("出门前 10 分钟让娃先上次厕所，能省下一半找卫生间的时间。");
  return tips;
}

// 暴露到全局，方便 kids.js 使用
window.KIDS_SPOTS = KIDS_SPOTS;
window.pickKidsSpots = pickKidsSpots;
window.buildKidsTips = buildKidsTips;
