/**
 * 溜娃方案库 · 扩充包 v1
 *
 * 用 IIFE 形式向 window.KIDS_SPOTS 追加，避免改动原文件。
 * 字段约束（与 kids-spots.js 一致）：
 *   name / city / type / ageMin / ageMax / trip / duration / cost / indoor / tags / desc / tips
 *
 * 字符串字面量只使用中文标点（「」/『』/，。：；），
 * 严禁在外层 "..." 字符串里再嵌 ASCII 直引号。
 */
(function () {
  if (!window.KIDS_SPOTS) {
    console.warn("[kids-spots-extra] window.KIDS_SPOTS 不存在，跳过追加");
    return;
  }

  const EXTRA = [
    // ========== 北京 补充 ==========
    {
      name: "北京天文馆",
      city: "北京",
      type: "科技",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "3小时",
      cost: "低",
      indoor: true,
      tags: ["天文", "球幕电影", "硬核知识"],
      desc: "国内顶级天文科普馆，球幕影院和宇宙剧场是娃心中的封神场景。",
      tips: "球幕影院要单独购票，提前在官网卡点抢，热门场次半小时秒空。"
    },
    {
      name: "圆明园遗址公园",
      city: "北京",
      type: "户外",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["历史", "划船", "踏青"],
      desc: "夏天荷花连片，冬天可以看遗址废墟讲历史，娃边逛边长见识。",
      tips: "园子很大，建议提前规划路线；雨季后看西洋楼遗址最有沧桑感。"
    },
    {
      name: "中国铁道博物馆 东郊馆",
      city: "北京",
      type: "博物馆",
      ageMin: 3, ageMax: 12,
      trip: ["family", "solo"],
      duration: "2小时",
      cost: "低",
      indoor: true,
      tags: ["火车", "工业", "男宝爱"],
      desc: "几十台真火车头排成长队，男宝看了走不动，免费爬车厢拍照。",
      tips: "位于酒仙桥，地铁不便，建议打车；门票不贵但需提前预约。"
    },
    {
      name: "玉渊潭公园",
      city: "北京",
      type: "户外",
      ageMin: 1, ageMax: 12,
      trip: ["solo", "family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["樱花", "划船", "野餐"],
      desc: "三月底樱花季是顶流，平时也是遛娃放风的开阔好地。",
      tips: "樱花季人山人海，建议工作日去；湖边能租脚踏船，娃巨爱。"
    },

    // ========== 上海 补充 ==========
    {
      name: "上海天文馆",
      city: "上海",
      type: "科技",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中",
      indoor: true,
      tags: ["宇宙", "网红馆", "互动"],
      desc: "全球最大单体天文馆，建筑本身就是大型艺术品，娃可以泡一整天。",
      tips: "票超难抢，提前 7 天上午 9:30 准时蹲；带水和能量棒，馆内吃饭排队。"
    },
    {
      name: "辰山植物园",
      city: "上海",
      type: "自然",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中",
      indoor: false,
      tags: ["植物", "矿坑花园", "亲子营"],
      desc: "矿坑花园像电影场景，热带温室冬天也暖洋洋，娃认识好多植物。",
      tips: "园区超大，租电瓶车更省力；雨天可以专攻温室。"
    },
    {
      name: "上海野生动物园",
      city: "上海",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中高",
      indoor: false,
      tags: ["动物", "大巴游猎", "强推荐"],
      desc: "猛兽区坐在大巴里穿越，老虎狮子直接趴车窗，娃能尖叫一整天。",
      tips: "南汇较远，自驾或地铁 16 号线接驳；早上去人少动物精神。"
    },
    {
      name: "迪士尼小镇 + 星愿公园",
      city: "上海",
      type: "户外",
      ageMin: 1, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["免费迪士尼味", "湖边", "亲子"],
      desc: "不进园也能蹭迪士尼气氛，星愿湖边喂鸭看烟花，性价比之王。",
      tips: "晚上能远眺园内烟花；周末小镇人多，工作日体验更好。"
    },

    // ========== 广州 补充 ==========
    {
      name: "广东省博物馆",
      city: "广州",
      type: "博物馆",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "3小时",
      cost: "免费",
      indoor: true,
      tags: ["免费", "历史", "瓷器"],
      desc: "粤博颜值在线，恐龙化石、自然标本、广绣广彩一站打卡。",
      tips: "需提前预约；位于花城广场，可以串联广州图书馆一起逛。"
    },
    {
      name: "长隆飞鸟乐园",
      city: "广州",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中高",
      indoor: false,
      tags: ["近距离喂鸟", "拍照", "大场地"],
      desc: "数千只鸟自由飞，娃可以伸手喂火烈鸟，朋友圈封面级体验。",
      tips: "建议早上去，太阳一晒鸟都躲起来；自带带壳坚果可投喂。"
    },
    {
      name: "广州科学中心",
      city: "广州",
      type: "科技",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: true,
      tags: ["互动", "科普", "玩到忘时间"],
      desc: "亚洲最大科普馆之一，互动展品超多，娃手贱党的天堂。",
      tips: "位于大学城，地铁可达；二三楼最好玩，留足时间。"
    },
    {
      name: "海珠湿地公园",
      city: "广州",
      type: "自然",
      ageMin: 2, ageMax: 10,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["湿地", "果园", "观鸟"],
      desc: "城中绿洲，秋天果园飘香，娃骑车看白鹭，城市里的小田园。",
      tips: "可租双人脚踏车；带望远镜观鸟体验更好。"
    },

    // ========== 深圳 补充 ==========
    {
      name: "深圳科技馆 新馆",
      city: "深圳",
      type: "科技",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: true,
      tags: ["新馆", "互动", "硬核"],
      desc: "光明区新开的科技馆，建筑炫酷，互动体验比老馆更新潮。",
      tips: "周末预约非常紧张；地铁 6 号线科学公园站直达。"
    },
    {
      name: "深圳大鹏所城 + 较场尾",
      city: "深圳",
      type: "户外",
      ageMin: 4, ageMax: 12,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中",
      indoor: false,
      tags: ["古城", "海边", "民宿"],
      desc: "上午古城讲历史，下午沙滩玩水，娃文化体力两不误。",
      tips: "夏天较场尾能住一晚再走；记得带换洗衣服和防晒。"
    },
    {
      name: "甘坑客家小镇",
      city: "深圳",
      type: "户外",
      ageMin: 3, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["客家文化", "拍照", "性价比"],
      desc: "小凉帽 IP 主题街区，娃能玩手作还能吃客家小吃，文创气氛拉满。",
      tips: "地铁 10 号线甘坑站直达；天热建议挑下午来避晒。"
    },
    {
      name: "深圳人才公园",
      city: "深圳",
      type: "户外",
      ageMin: 1, ageMax: 10,
      trip: ["solo", "family", "group"],
      duration: "2-3小时",
      cost: "免费",
      indoor: false,
      tags: ["免费", "湖景", "夜景灯光"],
      desc: "南山区颜值天花板公园，环湖跑道平整，娃骑车放风正合适。",
      tips: "晚上有灯光秀；旁边后海商圈可以连吃带玩。"
    },

    // ========== 杭州 补充 ==========
    {
      name: "良渚文化村 美丽洲公园",
      city: "杭州",
      type: "户外",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["小众", "教堂", "拍照"],
      desc: "良渚文化村里的大草坪和小木教堂超出片，娃跑跳父母拍照两全。",
      tips: "可以串联良渚博物院一起逛；夏天傍晚最舒服。"
    },
    {
      name: "杭州动物园",
      city: "杭州",
      type: "动物",
      ageMin: 2, ageMax: 10,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["性价比", "大熊猫", "经典"],
      desc: "门票便宜，动物种类全，西湖边的老牌打卡地。",
      tips: "上午动物比较活跃；带点动物园允许投喂的菜叶。"
    },
    {
      name: "西溪湿地",
      city: "杭州",
      type: "自然",
      ageMin: 3, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中",
      indoor: false,
      tags: ["坐船", "湿地", "悠闲"],
      desc: "坐摇橹船穿芦苇，娃看小动物听虫鸣，水乡氛围满分。",
      tips: "西区比东区清净；秋天芦苇花最好看。"
    },

    // ========== 成都 补充 ==========
    {
      name: "成都大熊猫繁育研究基地",
      city: "成都",
      type: "动物",
      ageMin: 2, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中",
      indoor: false,
      tags: ["熊猫", "国宝", "必打卡"],
      desc: "全球熊猫迷朝圣地，月亮产房幼崽萌得娃挪不动腿。",
      tips: "一定要 8 点前到，熊猫早上最活跃；门票实名预约。"
    },
    {
      name: "成都博物馆",
      city: "成都",
      type: "博物馆",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "3小时",
      cost: "免费",
      indoor: true,
      tags: ["免费", "历史", "皮影戏"],
      desc: "天府广场地铁直达，皮影戏厅是娃最爱，雨天好去处。",
      tips: "需预约；二楼皮影戏每天定点放映，提前查时间。"
    },
    {
      name: "东郊记忆",
      city: "成都",
      type: "户外",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["工业风", "拍照", "文创"],
      desc: "老厂房改文创园，火车头、烟囱、涂鸦墙娃拍到不想走。",
      tips: "免费进，吃饭逛店额外消费；周末有市集和小演出。"
    },

    // ========== 武汉 补充 ==========
    {
      name: "湖北省博物馆",
      city: "武汉",
      type: "博物馆",
      ageMin: 6, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: true,
      tags: ["免费", "镇馆之宝", "编钟"],
      desc: "越王勾践剑、曾侯乙编钟现场敲响，硬核历史一秒入魂。",
      tips: "需预约；编钟演奏每天 4 场，提前查时间排队。"
    },
    {
      name: "东湖绿道",
      city: "武汉",
      type: "户外",
      ageMin: 3, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["骑行", "湖景", "性价比"],
      desc: "国内最长城市绿道之一，租车骑行环湖，娃和大人一起放电。",
      tips: "湖北省博物馆就在边上，可以串联；夏天傍晚最舒服。"
    },
    {
      name: "武汉欢乐谷",
      city: "武汉",
      type: "游乐",
      ageMin: 6, ageMax: 14,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中高",
      indoor: false,
      tags: ["过山车", "刺激", "大孩子"],
      desc: "中部最强主题乐园之一，大龄娃尖叫制造机。",
      tips: "晚上灯光秀和烟花是亮点；身高要求看清楚再排队。"
    },

    // ========== 南京 ==========
    {
      name: "南京博物院",
      city: "南京",
      type: "博物馆",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: true,
      tags: ["免费", "六朝文化", "民国馆"],
      desc: "民国馆复刻一条老街，娃像穿越到旧时光，互动感拉满。",
      tips: "需预约；展厅多，可以重点逛历史馆 + 民国馆。"
    },
    {
      name: "中山陵 + 美龄宫",
      city: "南京",
      type: "户外",
      ageMin: 6, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["历史", "梧桐树", "爬台阶"],
      desc: "秋天梧桐黄了像油画，大孩子能边爬边听历史故事。",
      tips: "穿运动鞋，台阶不少；秋季最美但人也最多。"
    },
    {
      name: "南京红山森林动物园",
      city: "南京",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["性价比之王", "动物福利好", "口碑爆"],
      desc: "全国动物园圈层口碑顶流，动物状态好，场馆设计有温度。",
      tips: "园区有山有坡，体力消耗大；可坐小火车代步。"
    },

    // ========== 西安 ==========
    {
      name: "陕西历史博物馆",
      city: "西安",
      type: "博物馆",
      ageMin: 6, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: true,
      tags: ["免费", "唐三彩", "周秦汉唐"],
      desc: "国宝密度爆表，娃看一圈中国通史前传打通任督二脉。",
      tips: "免费票超级难抢，建议买唐代壁画珍品馆联票；提前研究藏品再去。"
    },
    {
      name: "大唐不夜城",
      city: "西安",
      type: "户外",
      ageMin: 3, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["夜游", "穿越", "网红"],
      desc: "晚上灯光开起来一秒回唐朝，不倒翁小姐姐 / 行为艺术连环看。",
      tips: "晚上 7-10 点最热闹；穿汉服更有沉浸感。"
    },
    {
      name: "秦始皇兵马俑博物院",
      city: "西安",
      type: "博物馆",
      ageMin: 7, ageMax: 14,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中",
      indoor: true,
      tags: ["世界遗产", "硬核", "请讲解"],
      desc: "世界第八大奇迹，娃站在一号坑前的震撼一辈子忘不了。",
      tips: "强烈建议请讲解员，不然就是看土；离市区 1 小时车程，留足时间。"
    },

    // ========== 重庆 ==========
    {
      name: "重庆动物园",
      city: "重庆",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["大熊猫", "性价比", "城中"],
      desc: "市区里就能看大熊猫，门票良心，老牌动物园老味道。",
      tips: "上午熊猫最活跃；旁边轻轨站直达。"
    },
    {
      name: "鹅岭二厂文创公园",
      city: "重庆",
      type: "户外",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["工业风", "网红打卡", "拍照"],
      desc: "废旧厂房文艺改造，山城景色露台直接出片，娃也喜欢爬上爬下。",
      tips: "免费进，店家消费要钱；傍晚灯光最好。"
    },
    {
      name: "洪崖洞 + 千厮门大桥",
      city: "重庆",
      type: "户外",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "3-4小时",
      cost: "免费",
      indoor: false,
      tags: ["夜景", "山城", "网红"],
      desc: "夜里像千与千寻汤屋，娃看一次记一辈子。",
      tips: "晚上 7-10 点最美；人巨多，紧紧拉住娃。"
    },

    // ========== 苏州 补充 ==========
    {
      name: "苏州乐园森林世界",
      city: "苏州",
      type: "游乐",
      ageMin: 4, ageMax: 12,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中高",
      indoor: false,
      tags: ["主题乐园", "亲子项目", "森林"],
      desc: "中等强度乐园，项目梯度合理，3 岁到 12 岁都能玩到。",
      tips: "比上海迪士尼便宜很多，性价比高；夏天注意防晒。"
    },
    {
      name: "金鸡湖",
      city: "苏州",
      type: "户外",
      ageMin: 2, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["夜景", "音乐喷泉", "免费"],
      desc: "环湖步道平坦，李公堤美食成排，娃骑车大人喝咖啡两不误。",
      tips: "周末晚上有音乐喷泉表演；夏天傍晚最凉快。"
    },

    // ========== 天津 ==========
    {
      name: "天津自然博物馆 北疆博物院",
      city: "天津",
      type: "博物馆",
      ageMin: 4, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: true,
      tags: ["免费", "化石", "古生物"],
      desc: "百年老馆藏品惊艳，恐龙化石和动物标本看到嗨。",
      tips: "需预约；分馆较多，建议挑主馆和北疆馆为主。"
    },
    {
      name: "天津之眼 + 古文化街",
      city: "天津",
      type: "户外",
      ageMin: 3, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["摩天轮", "古街", "性价比"],
      desc: "白天逛古文化街吃小吃，傍晚坐摩天轮看夜景，节奏刚刚好。",
      tips: "摩天轮排队较长，可提前网上买票；古文化街晚 6 点后人多。"
    },

    // ========== 青岛 ==========
    {
      name: "青岛海底世界",
      city: "青岛",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "3-4小时",
      cost: "中",
      indoor: true,
      tags: ["海洋", "海底隧道", "经典"],
      desc: "国内老牌水族馆，海底隧道穿越鲨鱼魔鬼鱼，娃尖叫制造机。",
      tips: "周末和暑期人巨多，建议工作日去；离海边栈桥很近串联走。"
    },
    {
      name: "石老人海水浴场",
      city: "青岛",
      type: "户外",
      ageMin: 1, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["海边", "玩沙", "免费"],
      desc: "免费的开阔沙滩，浪不大，娃挖沙堆城堡能玩到太阳落山。",
      tips: "带沙滩玩具和换洗衣服；夏天注意紫外线，备好防晒。"
    },
    {
      name: "中山公园",
      city: "青岛",
      type: "户外",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["免费", "樱花", "小型游乐"],
      desc: "春天樱花一条街，平时也有小游乐场，城市绿肺类型。",
      tips: "园内有付费小项目按需选；樱花季工作日去更好。"
    },

    // ========== 厦门 ==========
    {
      name: "厦门科技馆",
      city: "厦门",
      type: "科技",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: true,
      tags: ["互动", "知识", "雨天好去处"],
      desc: "互动展项丰富，娃能玩两三个小时不重样，闽南遛娃顶流。",
      tips: "建议工作日去；位于文化艺术中心片区，附近有图书馆可串联。"
    },
    {
      name: "鼓浪屿",
      city: "厦门",
      type: "户外",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中",
      indoor: false,
      tags: ["世界遗产", "海岛", "钢琴博物馆"],
      desc: "小岛上无车，娃走走停停看海听钢琴，氛围欧式又文艺。",
      tips: "船票需提前网上预订；天气热建议清晨或傍晚游玩。"
    },
    {
      name: "环岛路 + 椰风寨",
      city: "厦门",
      type: "户外",
      ageMin: 2, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["海边", "骑行", "免费"],
      desc: "沿海骑行道颜值天花板，娃放风筝、玩沙、吹海风一条龙。",
      tips: "可租双人车环线骑；夏天烈日要带遮阳伞和水。"
    },

    // ========== 长沙 ==========
    {
      name: "湖南省博物馆 湘博",
      city: "长沙",
      type: "博物馆",
      ageMin: 7, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: true,
      tags: ["免费", "马王堆", "硬核"],
      desc: "马王堆汉墓辛追夫人现场看，娃听完讲解像看了一场穿越大片。",
      tips: "免费票需提前 7 天预约；建议请讲解员或租电子讲解器。"
    },
    {
      name: "橘子洲头",
      city: "长沙",
      type: "户外",
      ageMin: 3, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "免费",
      indoor: false,
      tags: ["免费", "江景", "烟花"],
      desc: "湘江中央的大公园，平时遛娃骑车，周六晚还有焰火表演。",
      tips: "焰火秀通常周六晚 8:30，提前一小时占位置；地铁直达。"
    },
    {
      name: "长沙生态动物园",
      city: "长沙",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "全天",
      cost: "中",
      indoor: false,
      tags: ["车行区", "步行区", "亲子"],
      desc: "车行区开车看猛兽，步行区步行看可爱动物，一日两种玩法。",
      tips: "建议自驾或包车进入车行区；夏天选清晨入园。"
    },

    // ========== 通用补充（任何城市都能找到类似场所）==========
    {
      name: "城市图书馆少儿馆",
      city: "通用",
      type: "室内游乐",
      ageMin: 1, ageMax: 12,
      trip: ["solo", "family"],
      duration: "2-3小时",
      cost: "免费",
      indoor: true,
      tags: ["免费", "阅读", "雨天救星"],
      desc: "几乎每个城市都有，舒服安静还免费，下雨天的最优解。",
      tips: "提前查少儿区开放时间；带个保温杯，泡半天没问题。"
    },
    {
      name: "蹦床公园 / 室内蹦床馆",
      city: "通用",
      type: "运动",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "1.5-2小时",
      cost: "中",
      indoor: true,
      tags: ["放电", "雨天救星", "出汗"],
      desc: "下雨天放电神器，娃跳一小时回家秒睡，亲测有效。",
      tips: "需穿防滑袜（一般场馆售卖）；建议工作日傍晚或周末上午去人少。"
    },
    {
      name: "亲子陶艺工坊",
      city: "通用",
      type: "手作",
      ageMin: 3, ageMax: 12,
      trip: ["family", "solo"],
      duration: "1.5-2小时",
      cost: "中",
      indoor: true,
      tags: ["手作", "专注力", "可带走"],
      desc: "捏泥巴拉胚，做完烧制邮寄到家，娃成就感拉满。",
      tips: "提前预约；穿旧衣或带围裙；成品 2-3 周才能寄回。"
    },
    {
      name: "儿童牙医 / 视力筛查体验日",
      city: "通用",
      type: "室内游乐",
      ageMin: 3, ageMax: 12,
      trip: ["family"],
      duration: "1-2小时",
      cost: "免费",
      indoor: true,
      tags: ["健康", "免费体验", "顺手干"],
      desc: "周末顺道做次健康检查，比专门请假去医院从容得多。",
      tips: "找连锁口腔机构的免费检查日；筛查后顺便去附近吃顿好的奖励娃。"
    },
    {
      name: "亲子绘本馆 / 故事角",
      city: "通用",
      type: "室内游乐",
      ageMin: 1, ageMax: 8,
      trip: ["solo", "family"],
      duration: "1-2小时",
      cost: "低",
      indoor: true,
      tags: ["阅读", "讲故事", "安静"],
      desc: "适合 0-6 岁小宝，听故事 + 互动游戏，妈妈可以喘口气。",
      tips: "很多绘本馆周末有讲师场次，提前预约；可办次卡更划算。"
    },
    {
      name: "保龄球馆 亲子局",
      city: "通用",
      type: "运动",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "2小时",
      cost: "中",
      indoor: true,
      tags: ["室内", "全家齐上", "怀旧"],
      desc: "全家上阵，娃用辅助滑道也能 strike，爸妈秒变运动男女主。",
      tips: "工作日折扣大；穿宽松裤子，带袜子。"
    },
    {
      name: "周边菜园子 / 农场采摘",
      city: "通用",
      type: "自然",
      ageMin: 3, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中",
      indoor: false,
      tags: ["采摘", "自然教育", "应季"],
      desc: "草莓 / 蓝莓 / 葡萄 / 柑橘按季节轮换，娃边吃边学农业。",
      tips: "提前看大众点评选靠谱农场；穿运动鞋，备防晒和驱蚊。"
    },
    {
      name: "市民健身中心 游泳馆",
      city: "通用",
      type: "运动",
      ageMin: 3, ageMax: 14,
      trip: ["family", "group"],
      duration: "1.5-2小时",
      cost: "低",
      indoor: true,
      tags: ["游泳", "性价比", "全年可玩"],
      desc: "公办游泳馆性价比拉满，娃打水仗放电，夏天空调天堂。",
      tips: "需要游泳健康证（部分馆现场办）；带好泳镜泳帽和拖鞋。"
    },
    {
      name: "周末集市 / 跳蚤市场",
      city: "通用",
      type: "户外",
      ageMin: 4, ageMax: 14,
      trip: ["family", "group"],
      duration: "2-3小时",
      cost: "低",
      indoor: false,
      tags: ["逛吃", "财商启蒙", "性价比"],
      desc: "娃练讨价还价，顺便摆个小摊卖玩具，财商小白课。",
      tips: "鼓励娃自带零钱；摆摊前一晚和娃挑好不要的玩具。"
    },
    {
      name: "亲子烘焙工坊",
      city: "通用",
      type: "手作",
      ageMin: 3, ageMax: 12,
      trip: ["family", "solo"],
      duration: "2小时",
      cost: "中",
      indoor: true,
      tags: ["烘焙", "美食", "成就感"],
      desc: "饼干蛋糕娃自己做自己吃，节日还能现场做生日蛋糕。",
      tips: "提前预约课程；很多店家会准备小厨师服拍照。"
    },
    {
      name: "城市规划展览馆",
      city: "通用",
      type: "博物馆",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "1.5-2小时",
      cost: "免费",
      indoor: true,
      tags: ["免费", "城市沙盘", "知识科普"],
      desc: "几乎每个城市都有，超大沙盘 + 互动屏，娃理解城市运作。",
      tips: "通常需要预约；周末上午人少。"
    },
    {
      name: "周末早茶 / 馆子主题日",
      city: "通用",
      type: "户外",
      ageMin: 2, ageMax: 14,
      trip: ["family", "group"],
      duration: "2小时",
      cost: "中",
      indoor: true,
      tags: ["美食", "悠闲", "周末仪式感"],
      desc: "找一家有娃椅的馆子吃顿好的，比奔波打卡来得幸福。",
      tips: "提前查娃友好餐厅；点个娃喜欢的小菜降低离桌率。"
    },
    {
      name: "夜游街区 / 步行街",
      city: "通用",
      type: "户外",
      ageMin: 3, ageMax: 14,
      trip: ["family", "group"],
      duration: "2-3小时",
      cost: "低",
      indoor: false,
      tags: ["夜游", "灯光", "氛围感"],
      desc: "夏天晚饭后散步逛街，灯光街景娃也看得津津有味。",
      tips: "夏季晚 7 点后凉快；带湿巾和水。"
    },
    {
      name: "亲子飞盘 / 户外草坪局",
      city: "通用",
      type: "运动",
      ageMin: 5, ageMax: 14,
      trip: ["family", "group"],
      duration: "2小时",
      cost: "免费",
      indoor: false,
      tags: ["放电", "运动", "时髦"],
      desc: "找块大草坪，飞盘玩起来，全家人一起跑跳出汗。",
      tips: "上午或傍晚太阳不毒；记得带水和遮阳工具。"
    },
    {
      name: "亲子剧场 / 儿童音乐会",
      city: "通用",
      type: "室内游乐",
      ageMin: 3, ageMax: 12,
      trip: ["family", "group"],
      duration: "1.5小时",
      cost: "中",
      indoor: true,
      tags: ["艺术", "音乐", "仪式感"],
      desc: "周末看一场儿童剧或亲子音乐会，给娃一点艺术熏陶。",
      tips: "在大麦 / 演出票务平台搜亲子剧；提前到场让娃熟悉环境。"
    },
    {
      name: "亲子瑜伽 / 亲子运动课",
      city: "通用",
      type: "运动",
      ageMin: 3, ageMax: 10,
      trip: ["family"],
      duration: "1小时",
      cost: "低",
      indoor: true,
      tags: ["运动", "亲子互动", "周末新解"],
      desc: "母子 / 父女配合做动作，比单纯送课娃上课参与感强 100 倍。",
      tips: "穿宽松运动服；很多瑜伽馆周末有亲子专场，关注公众号。"
    },
    {
      name: "公园露营 / 草地野餐",
      city: "通用",
      type: "户外",
      ageMin: 1, ageMax: 14,
      trip: ["family", "group"],
      duration: "半天",
      cost: "低",
      indoor: false,
      tags: ["野餐", "露营", "氛围"],
      desc: "城市露营党最爱玩法，搭帐篷铺野餐布，娃疯跑大人摆烂。",
      tips: "选允许露营的公园；提前查天气，备好驱蚊和湿巾。"
    },
    {
      name: "海洋馆 / 极地馆",
      city: "通用",
      type: "动物",
      ageMin: 2, ageMax: 12,
      trip: ["family", "group"],
      duration: "半天",
      cost: "中高",
      indoor: true,
      tags: ["海洋", "雨天救星", "互动表演"],
      desc: "几乎每个大城市都有海昌或本地海洋馆，海狮表演娃看得入迷。",
      tips: "提前网购票省一半；卡表演时间，避免空跑。"
    }
  ];

  // 用 name+city 做指纹去重，避免和原库或重复 push 撞
  const existingKeys = new Set(
    window.KIDS_SPOTS.map(s => `${s.name}__${s.city}`)
  );
  let added = 0;
  EXTRA.forEach(s => {
    const key = `${s.name}__${s.city}`;
    if (!existingKeys.has(key)) {
      window.KIDS_SPOTS.push(s);
      existingKeys.add(key);
      added++;
    }
  });
  if (typeof console !== "undefined" && console.log) {
    console.log(`[kids-spots-extra] 已追加 ${added} 条，当前总数 ${window.KIDS_SPOTS.length}`);
  }
})();
