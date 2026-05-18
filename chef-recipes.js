/**
 * 一日厨神 · 菜谱库
 *
 * 字段说明：
 *  - id          唯一 ID
 *  - name        菜名
 *  - emoji       小图标
 *  - region      菜系/家乡归属 ['川渝','江浙','粤港','西北','东北','湘鄂','云贵','北方家常','西餐','日韩','东南亚','通用']
 *  - flavors     口味标签 ['麻辣','香辣','酸辣','咸鲜','清淡','甜口','酸甜','鲜香','浓油赤酱','烟熏','奶香','焦香']
 *  - ingredients 主料关键字（用于"我有什么"匹配）
 *  - kitchen     可用的餐厨条件 ['电磁炉','明火灶','烤箱','空气炸锅','微波炉','电饭煲','料理棒','一口锅','无油烟']
 *  - difficulty  难度 1-3
 *  - timeMin     大致耗时（分钟）
 *  - looks       颜值分 1-5（越高越上镜）
 *  - desc        亮点描述（俏皮一句话）
 *  - steps       3-5 步极简流程
 *  - tips        一句小贴士
 *  - searchKey   全网搜索时使用的关键词
 */
window.CHEF_RECIPES = [
  // ============ 川渝 ============
  {
    id: "mapo-tofu",
    name: "麻婆豆腐",
    emoji: "🌶️",
    region: ["川渝"],
    flavors: ["麻辣", "鲜香"],
    ingredients: ["豆腐", "猪肉末", "豆瓣酱", "花椒"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 4,
    desc: "麻、辣、烫、嫩、鲜，五个字打天下，10 块钱出一道下饭神器。",
    steps: [
      "豆腐切块用淡盐水泡 5 分钟去豆腥",
      "热油爆香豆瓣酱、姜末，下肉末炒散",
      "加水煮开后下豆腐，小火咕嘟 5 分钟",
      "勾两次薄芡，出锅撒花椒粉和小葱"
    ],
    tips: "豆瓣酱一定要剁碎再下锅，红油才能出得彻底。",
    searchKey: "麻婆豆腐 快手 家常"
  },
  {
    id: "yuxiang-rousi",
    name: "鱼香肉丝",
    emoji: "🥢",
    region: ["川渝"],
    flavors: ["酸甜", "香辣", "鲜香"],
    ingredients: ["猪里脊", "木耳", "胡萝卜", "青笋", "泡椒"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 2,
    timeMin: 25,
    looks: 4,
    desc: "鱼香没鱼，但下饭比鱼香。酸甜辣咸一勺端走。",
    steps: [
      "肉丝上浆：盐+料酒+淀粉+一勺水抓匀",
      "鱼香汁先调好：3 醋 2 糖 2 生抽 1 老抽 5 水 + 淀粉",
      "热油滑肉丝变色盛出",
      "爆香泡椒、姜蒜末，下配菜炒断生",
      "回锅肉丝，淋鱼香汁翻匀收汁"
    ],
    tips: "鱼香汁的灵魂是先调好，下锅秒裹住，火太大也不慌。",
    searchKey: "鱼香肉丝 家常做法"
  },
  {
    id: "shuizhu-rou",
    name: "水煮肉片",
    emoji: "♨️",
    region: ["川渝"],
    flavors: ["麻辣", "鲜香"],
    ingredients: ["猪里脊", "豆芽", "生菜", "豆瓣酱", "干辣椒"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 2,
    timeMin: 30,
    looks: 5,
    desc: "红汪汪一大盆，端上桌自带 BGM 的那种，宴客绝活。",
    steps: [
      "肉片用蛋清、淀粉、料酒上浆腌 10 分钟",
      "底菜豆芽生菜烫熟铺碗底",
      "热油爆豆瓣酱出红油，加水煮开",
      "肉片下锅烫到变色，连汤倒入碗中",
      "面上铺辣椒花椒，热油浇上去——刺啦一声！"
    ],
    tips: "最后那勺热油，是这道菜的灵魂，温度一定要烧到冒烟。",
    searchKey: "水煮肉片 简单做法"
  },

  // ============ 江浙 ============
  {
    id: "hongshao-rou",
    name: "红烧肉",
    emoji: "🍖",
    region: ["江浙"],
    flavors: ["甜口", "浓油赤酱", "鲜香"],
    ingredients: ["五花肉", "冰糖", "老抽", "葱姜"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 60,
    looks: 5,
    desc: "颤巍巍油亮亮，咬一口糖香裹着肉香，朋友圈杀手锏。",
    steps: [
      "五花肉冷水下锅焯水，洗净切麻将块",
      "锅里少油，冰糖小火炒成琥珀色糖色",
      "下肉块翻匀挂色，烹料酒",
      "加水没过肉，葱姜八角老抽适量，大火烧开转小火 40 分钟",
      "开盖大火收汁到油亮"
    ],
    tips: "想省时间用高压锅压 20 分钟再开盖收汁，效果几乎一样。",
    searchKey: "红烧肉 简单零失败"
  },
  {
    id: "longjing-xiaren",
    name: "龙井虾仁",
    emoji: "🦐",
    region: ["江浙"],
    flavors: ["清淡", "鲜香"],
    ingredients: ["虾仁", "龙井茶", "鸡蛋清"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 2,
    timeMin: 15,
    looks: 5,
    desc: "茶香虾鲜，白底嫩绿，是那种摆盘随手拍都好看的小清新。",
    steps: [
      "虾仁挑虾线，用蛋清和淀粉抓上浆",
      "龙井用 80℃ 水泡 30 秒取茶汤+茶叶",
      "热油滑虾仁 30 秒到变红盛出",
      "原锅下茶汤茶叶，回虾仁翻两下，盐调味即可"
    ],
    tips: "虾仁滑油时间一定要短，超过 1 分钟就老了。",
    searchKey: "龙井虾仁 家常版"
  },
  {
    id: "ximei-paigu",
    name: "话梅蒸排骨",
    emoji: "🍑",
    region: ["江浙", "粤港"],
    flavors: ["酸甜", "鲜香"],
    ingredients: ["排骨", "话梅", "冰糖"],
    kitchen: ["电磁炉", "明火灶", "电饭煲", "无油烟"],
    difficulty: 1,
    timeMin: 35,
    looks: 4,
    desc: "全程不开火都行，一口微酸开胃，懒人版宴客菜。",
    steps: [
      "排骨冷水焯净血沫",
      "和话梅、冰糖、生抽、姜片一起拌匀",
      "上锅大火蒸 25 分钟",
      "出锅撒小葱即可"
    ],
    tips: "没有蒸锅就用电饭煲蒸架，盖盖按煮饭键。",
    searchKey: "话梅蒸排骨 懒人版"
  },

  // ============ 粤港 ============
  {
    id: "baiqie-ji",
    name: "白切鸡",
    emoji: "🍗",
    region: ["粤港"],
    flavors: ["清淡", "鲜香"],
    ingredients: ["三黄鸡", "姜", "葱"],
    kitchen: ["电磁炉", "明火灶", "一口锅", "无油烟"],
    difficulty: 1,
    timeMin: 40,
    looks: 5,
    desc: "什么都不放，就吃个鸡本身的鲜。蘸料才是隐藏 boss。",
    steps: [
      "整鸡冷水下锅，加姜葱料酒",
      "水将开未开时小火慢煮 25 分钟",
      "捞出立刻浸冰水 10 分钟（皮才会脆）",
      "斩件摆盘，配姜葱蓉蘸料"
    ],
    tips: "蘸料：姜末葱花一勺，热油泼香，加少许盐生抽。",
    searchKey: "白切鸡 简单做法"
  },
  {
    id: "boluo-gulu",
    name: "菠萝咕咾肉",
    emoji: "🍍",
    region: ["粤港"],
    flavors: ["酸甜", "焦香"],
    ingredients: ["猪里脊", "菠萝", "彩椒", "番茄酱"],
    kitchen: ["电磁炉", "明火灶", "空气炸锅"],
    difficulty: 2,
    timeMin: 30,
    looks: 5,
    desc: "金黄酥脆 + 菠萝的酸甜，颜值天花板，娃和大人通杀。",
    steps: [
      "里脊切大块腌料酒生抽 10 分钟",
      "裹蛋液+干淀粉，下油炸到金黄（空气炸锅 200℃ 12 分钟）",
      "调汁：番茄酱 4 勺 + 糖 2 + 白醋 2 + 水 3 + 淀粉少许",
      "热锅炒香彩椒菠萝，倒汁烧开",
      "下肉块快速翻匀挂汁出锅"
    ],
    tips: "肉块一定要复炸一次才会一直脆。",
    searchKey: "菠萝咕咾肉 家常"
  },

  // ============ 西北 ============
  {
    id: "rou-jiamo",
    name: "腊汁肉夹馍",
    emoji: "🥯",
    region: ["西北"],
    flavors: ["咸鲜", "浓油赤酱"],
    ingredients: ["五花肉", "白吉馍", "青椒", "香料"],
    kitchen: ["电磁炉", "明火灶"],
    difficulty: 2,
    timeMin: 90,
    looks: 4,
    desc: "肉香从厨房一路飘到客厅，名字叫肉夹馍，其实是馍夹肉。",
    steps: [
      "五花肉切大块焯水，加八角桂皮香叶生抽老抽冰糖",
      "小火炖 1 小时直到酥烂",
      "出锅剁碎拌青椒末",
      "白吉馍中间切开夹满肉"
    ],
    tips: "懒人版直接买现成白吉馍，肉酱可以一次多做冻起来。",
    searchKey: "肉夹馍 家常做法"
  },
  {
    id: "xinjiang-dapanji",
    name: "新疆大盘鸡",
    emoji: "🍲",
    region: ["西北"],
    flavors: ["香辣", "鲜香"],
    ingredients: ["三黄鸡", "土豆", "青椒", "皮带面"],
    kitchen: ["明火灶", "电磁炉", "一口锅"],
    difficulty: 2,
    timeMin: 50,
    looks: 5,
    desc: "一锅顶仨菜：肉、菜、面全到位，多人聚餐扛把子。",
    steps: [
      "鸡块焯水沥干",
      "冰糖炒糖色，下鸡块上色",
      "下姜蒜豆瓣酱、干辣椒、八角炒香",
      "加啤酒+水没过鸡块，炖 25 分钟",
      "下土豆块再炖 10 分钟，最后下青椒"
    ],
    tips: "上桌前甩两根煮好的皮带面进去拌，是新疆人的灵魂吃法。",
    searchKey: "大盘鸡 家常版"
  },

  // ============ 东北 ============
  {
    id: "guobaorou",
    name: "锅包肉",
    emoji: "🥩",
    region: ["东北"],
    flavors: ["酸甜", "焦香"],
    ingredients: ["猪里脊", "胡萝卜丝", "白醋", "白糖"],
    kitchen: ["电磁炉", "明火灶"],
    difficulty: 2,
    timeMin: 30,
    looks: 5,
    desc: "外焦里嫩、酸甜带劲，咬下去那一声咔嚓最治愈。",
    steps: [
      "里脊切大片，盐料酒抓匀",
      "土豆淀粉+水调成厚糊（要能挂得住筷子）",
      "肉片裹糊下油炸到金黄定型",
      "复炸一次到酥脆",
      "调糖醋汁烧开，下肉、姜葱丝快速翻匀"
    ],
    tips: "醋糖比例 1:1，糖也别少，少了不挂汁。",
    searchKey: "锅包肉 家常做法"
  },
  {
    id: "diasanxian",
    name: "地三鲜",
    emoji: "🍆",
    region: ["东北"],
    flavors: ["咸鲜", "浓油赤酱"],
    ingredients: ["茄子", "土豆", "青椒"],
    kitchen: ["电磁炉", "明火灶", "空气炸锅"],
    difficulty: 1,
    timeMin: 25,
    looks: 4,
    desc: "三个朴素食材的封神之作，米饭杀手没跑。",
    steps: [
      "茄子土豆切滚刀块",
      "空气炸锅 200℃ 烤 10 分钟（或者过油炸）",
      "锅里少油爆香蒜末",
      "下青椒，加生抽蚝油糖少许水",
      "回锅茄子土豆翻匀收汁"
    ],
    tips: "空气炸锅版能省一半油，茄子还不发黑。",
    searchKey: "地三鲜 少油版"
  },

  // ============ 湘鄂 ============
  {
    id: "duojiao-yutou",
    name: "剁椒鱼头",
    emoji: "🐟",
    region: ["湘鄂"],
    flavors: ["香辣", "鲜香"],
    ingredients: ["胖头鱼头", "剁椒", "蒜末"],
    kitchen: ["电磁炉", "明火灶", "无油烟"],
    difficulty: 2,
    timeMin: 30,
    looks: 5,
    desc: "红得发亮，辣得过瘾，宴客撑场子的颜值担当。",
    steps: [
      "鱼头剖开洗净，料酒姜片腌 10 分钟",
      "盘底铺姜片，鱼头平铺",
      "上面铺满剁椒和蒜末，淋一勺生抽",
      "大火蒸 12 分钟",
      "热油泼蒜末葱花浇面，刺啦上桌"
    ],
    tips: "蒸时间不要超过 15 分钟，否则鱼肉发柴。",
    searchKey: "剁椒鱼头 简单做法"
  },
  {
    id: "xiangchang-chao",
    name: "湘味腊肠炒蒜苗",
    emoji: "🌿",
    region: ["湘鄂"],
    flavors: ["烟熏", "香辣"],
    ingredients: ["腊肠", "蒜苗", "干辣椒"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 15,
    looks: 4,
    desc: "腊味一炒，整层楼都是过年的味道。",
    steps: [
      "腊肠斜切薄片",
      "蒜苗切段（蒜白蒜叶分开）",
      "腊肠冷油下锅煸到出油变透",
      "下蒜白和干辣椒炒香",
      "下蒜叶大火翻两下出锅，少许生抽提味"
    ],
    tips: "腊肠咸香足，全程基本不用加盐。",
    searchKey: "腊肠炒蒜苗"
  },

  // ============ 云贵 ============
  {
    id: "qiguo-ji",
    name: "汽锅鸡",
    emoji: "🐔",
    region: ["云贵"],
    flavors: ["清淡", "鲜香"],
    ingredients: ["三黄鸡", "枸杞", "姜片"],
    kitchen: ["电磁炉", "明火灶", "无油烟"],
    difficulty: 1,
    timeMin: 90,
    looks: 4,
    desc: "无水蒸汽自己滴出来的汤，鲜得能喝三碗。",
    steps: [
      "鸡块焯水洗净",
      "码入汽锅，加姜片、枸杞、少许盐",
      "底锅加水，盖盖大火转小火蒸 90 分钟",
      "出锅原汤原汁，撒葱花"
    ],
    tips: "没有汽锅就用炖盅+砂锅隔水炖，效果接近。",
    searchKey: "云南汽锅鸡 家常"
  },
  {
    id: "guoqiao-mixian",
    name: "过桥米线（简化版）",
    emoji: "🍜",
    region: ["云贵"],
    flavors: ["鲜香", "清淡"],
    ingredients: ["米线", "鸡汤", "肉片", "鹌鹑蛋", "豆芽"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 5,
    desc: "一碗热油滚汤压住所有食材，仪式感拉满。",
    steps: [
      "提前熬鸡汤或用浓汤宝兑热水",
      "米线开水煮 2 分钟过冷水备用",
      "肉片切薄到能透光",
      "汤大火烧到滚烫倒入深碗，依次下肉片、鹌鹑蛋、豆芽、米线",
      "盖盖闷 1 分钟即可"
    ],
    tips: "汤温度必须够烫，肉片越薄越好烫熟。",
    searchKey: "过桥米线 家常简易"
  },

  // ============ 北方家常 ============
  {
    id: "fanqie-jidan",
    name: "西红柿炒蛋",
    emoji: "🍅",
    region: ["北方家常", "通用"],
    flavors: ["酸甜", "鲜香"],
    ingredients: ["西红柿", "鸡蛋"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 10,
    looks: 3,
    desc: "国民下饭菜，三步出锅，闭眼也能做。",
    steps: [
      "鸡蛋打散，西红柿切块",
      "热油炒蛋盛出",
      "原锅炒西红柿出汁，加糖和少许盐",
      "回锅蛋翻匀，撒葱花"
    ],
    tips: "想要番茄出汁更快，可以开盖加一小勺水。",
    searchKey: "西红柿炒蛋"
  },
  {
    id: "jiangbing-roumo",
    name: "肉末茄子盖饭",
    emoji: "🍱",
    region: ["北方家常"],
    flavors: ["咸鲜", "浓油赤酱"],
    ingredients: ["茄子", "猪肉末", "大葱"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 4,
    desc: "肉香裹茄子，一勺浇饭直接两碗起步。",
    steps: [
      "茄子切条用盐腌 5 分钟挤水",
      "热油炒肉末到金黄",
      "下葱姜蒜豆瓣酱炒香",
      "下茄子翻炒到软塌",
      "生抽糖少量水烧开收汁"
    ],
    tips: "茄子先腌出水，下锅不吸油不发黑。",
    searchKey: "肉末茄子 盖饭"
  },

  // ============ 西餐 ============
  {
    id: "tomato-pasta",
    name: "番茄培根意面",
    emoji: "🍝",
    region: ["西餐"],
    flavors: ["酸甜", "咸鲜"],
    ingredients: ["意面", "番茄", "培根", "洋葱"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 5,
    desc: "周末早午餐顶配，自带 ins 滤镜。",
    steps: [
      "意面盐水煮 8-9 分钟捞出",
      "培根切丁煸出油",
      "下洋葱蒜末炒香",
      "下番茄丁炒成酱，加一勺意面水",
      "下意面翻匀，撒黑胡椒和帕玛森"
    ],
    tips: "煮面水留一杯，调酱汁比加清水香 10 倍。",
    searchKey: "番茄培根意面"
  },
  {
    id: "kao-jichi",
    name: "蜜汁烤鸡翅",
    emoji: "🍗",
    region: ["西餐", "通用"],
    flavors: ["甜口", "焦香"],
    ingredients: ["鸡翅", "蜂蜜", "生抽", "黑胡椒"],
    kitchen: ["烤箱", "空气炸锅"],
    difficulty: 1,
    timeMin: 35,
    looks: 5,
    desc: "烤箱/空气炸锅党的封神快手菜，30 分钟搞定一锅。",
    steps: [
      "鸡翅划两刀方便入味",
      "腌料：生抽 2 + 蜂蜜 1 + 黑胡椒 + 蒜末 + 料酒，腌 20 分钟",
      "空气炸锅 200℃ 烤 15 分钟",
      "中途翻面再刷一次蜂蜜，再烤 5 分钟"
    ],
    tips: "鸡翅划口子是关键，否则不入味。",
    searchKey: "蜜汁烤鸡翅 空气炸锅"
  },
  {
    id: "ru-you-tu-si",
    name: "厚乳吐司",
    emoji: "🍞",
    region: ["西餐", "通用"],
    flavors: ["奶香", "甜口"],
    ingredients: ["吐司", "黄油", "炼乳", "厚乳"],
    kitchen: ["烤箱", "空气炸锅", "微波炉"],
    difficulty: 1,
    timeMin: 10,
    looks: 5,
    desc: "10 分钟搞出网红早餐，咖啡一起喝绝配。",
    steps: [
      "黄油室温软化，和炼乳搅匀刷面",
      "吐司刷酱，撒少许海盐",
      "空气炸锅 180℃ 5 分钟到金黄",
      "出炉淋一圈厚乳"
    ],
    tips: "用全麦吐司更解腻，海盐是灵魂别省。",
    searchKey: "厚乳吐司 网红做法"
  },

  // ============ 日韩 ============
  {
    id: "shouhuo-niuda",
    name: "寿喜烧",
    emoji: "🍲",
    region: ["日韩"],
    flavors: ["甜口", "咸鲜"],
    ingredients: ["肥牛", "金针菇", "豆腐", "白菜", "鸡蛋"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 5,
    desc: "一锅炖完直接上桌，仪式感+省事=完美周末晚餐。",
    steps: [
      "调汁：生抽 4 + 味淋 3 + 糖 1 + 清酒 1 + 水 5",
      "锅里少油先煎几片肥牛激香",
      "下大白菜豆腐金针菇，倒入汁",
      "煮开转小火 10 分钟",
      "蘸生鸡蛋液吃"
    ],
    tips: "没有味淋用蜂蜜+米酒代替也行。",
    searchKey: "寿喜烧 家常版"
  },
  {
    id: "han-shi-pao-cai-jian-bing",
    name: "韩式泡菜煎饼",
    emoji: "🥞",
    region: ["日韩"],
    flavors: ["酸辣", "焦香"],
    ingredients: ["泡菜", "面粉", "鸡蛋"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 15,
    looks: 4,
    desc: "冰箱有一罐泡菜就能开吃，外焦里香，下酒一绝。",
    steps: [
      "泡菜切碎挤掉部分汁",
      "和面粉鸡蛋拌成浓稠面糊",
      "平底锅刷油摊薄",
      "两面煎到金黄"
    ],
    tips: "面糊别太稠，能流动才能煎出脆边。",
    searchKey: "韩式泡菜饼"
  },

  // ============ 东南亚 ============
  {
    id: "dongyin-gong",
    name: "冬阴功汤",
    emoji: "🦐",
    region: ["东南亚"],
    flavors: ["酸辣", "鲜香"],
    ingredients: ["虾", "蘑菇", "椰浆", "冬阴功酱"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 5,
    desc: "酸辣鲜一锅端，一勺下去眼睛都亮了。",
    steps: [
      "水烧开，加冬阴功酱 2 勺",
      "下虾、蘑菇、番茄煮 3 分钟",
      "倒入椰浆 100ml 煮开",
      "出锅挤柠檬汁，撒香菜"
    ],
    tips: "现成酱包是新手友好关键，不需要去找香茅南姜。",
    searchKey: "冬阴功汤 家常版"
  },

  // ============ 通用快手 / 懒人 ============
  {
    id: "kao-shuguo",
    name: "烤蔬菜全家福",
    emoji: "🥗",
    region: ["西餐", "通用"],
    flavors: ["焦香", "咸鲜"],
    ingredients: ["土豆", "胡萝卜", "西兰花", "彩椒", "玉米笋"],
    kitchen: ["烤箱", "空气炸锅"],
    difficulty: 1,
    timeMin: 30,
    looks: 5,
    desc: "一盘色彩斑斓的健康担当，朋友圈最佳道具菜。",
    steps: [
      "蔬菜切大块",
      "淋橄榄油、海盐、黑胡椒、迷迭香拌匀",
      "180℃ 烤 25 分钟",
      "出炉挤柠檬汁"
    ],
    tips: "土豆胡萝卜先单独烤 10 分钟再加其他菜，熟度才一致。",
    searchKey: "烤蔬菜 健康简餐"
  },
  {
    id: "dianfanguo-baofan",
    name: "电饭煲腊肠煲仔饭",
    emoji: "🍚",
    region: ["粤港", "通用"],
    flavors: ["咸鲜", "烟熏"],
    ingredients: ["大米", "腊肠", "青菜", "鸡蛋"],
    kitchen: ["电饭煲", "无油烟"],
    difficulty: 1,
    timeMin: 35,
    looks: 5,
    desc: "厨房小白也能装一波懂吃，一锅出锅巴香到邻居。",
    steps: [
      "大米淘洗后按平时水量略少加水",
      "码上腊肠片",
      "按煮饭键",
      "跳保温后打个鸡蛋，焖 5 分钟",
      "淋一勺生抽+一勺香油+葱花拌开"
    ],
    tips: "想吃锅巴，跳保温后再按一次煮饭键加热 3 分钟。",
    searchKey: "电饭煲煲仔饭"
  },
  {
    id: "weibo-zhengdan",
    name: "微波炉水蒸蛋",
    emoji: "🥚",
    region: ["通用"],
    flavors: ["清淡", "鲜香"],
    ingredients: ["鸡蛋", "温水"],
    kitchen: ["微波炉", "无油烟"],
    difficulty: 1,
    timeMin: 8,
    looks: 4,
    desc: "8 分钟搞定一碗布丁般顺滑的蒸蛋，老人小孩通吃。",
    steps: [
      "2 个鸡蛋打散，加 1.5 倍温水",
      "过滤一遍倒入碗中",
      "盖保鲜膜戳几个孔",
      "微波炉中火 4 分钟",
      "淋少许生抽和香油"
    ],
    tips: "保鲜膜戳孔是关键，否则会炸。",
    searchKey: "微波炉蒸蛋"
  },
  {
    id: "yi-guo-mian",
    name: "番茄牛肉一锅面",
    emoji: "🍜",
    region: ["通用"],
    flavors: ["酸甜", "鲜香"],
    ingredients: ["挂面", "牛肉", "番茄", "鸡蛋"],
    kitchen: ["电磁炉", "明火灶", "一口锅"],
    difficulty: 1,
    timeMin: 20,
    looks: 4,
    desc: "一口锅搞定主食+菜+汤，独居/加班自救必备。",
    steps: [
      "牛肉切片用淀粉抓匀",
      "番茄炒出沙加水煮开",
      "下牛肉煮到变色",
      "下挂面煮 4 分钟",
      "打入鸡蛋，盐生抽调味"
    ],
    tips: "懒得切牛肉，买现成的肥牛卷直接涮。",
    searchKey: "番茄牛肉面"
  }
];

/**
 * 选项数据 —— 供 chef.html 渲染下拉/标签使用
 */
window.CHEF_OPTIONS = {
  regions: [
    { value: "川渝",    label: "🌶️ 川渝（四川/重庆）" },
    { value: "江浙",    label: "🌸 江浙沪" },
    { value: "粤港",    label: "🥢 粤港澳" },
    { value: "西北",    label: "🐪 西北（陕甘宁青疆）" },
    { value: "东北",    label: "❄️ 东北" },
    { value: "湘鄂",    label: "🌾 湘鄂（湖南/湖北）" },
    { value: "云贵",    label: "🍄 云贵" },
    { value: "北方家常", label: "🥟 北方家常" },
    { value: "西餐",    label: "🍝 西餐口味" },
    { value: "日韩",    label: "🍣 日韩口味" },
    { value: "东南亚",  label: "🌶️ 东南亚" },
    { value: "通用",    label: "🌍 都可以，看心情" }
  ],
  flavors: [
    { value: "麻辣",       emoji: "🔥", label: "麻辣" },
    { value: "香辣",       emoji: "🌶️", label: "香辣" },
    { value: "酸辣",       emoji: "🍋", label: "酸辣" },
    { value: "咸鲜",       emoji: "🧂", label: "咸鲜" },
    { value: "清淡",       emoji: "🍃", label: "清淡" },
    { value: "甜口",       emoji: "🍯", label: "甜口" },
    { value: "酸甜",       emoji: "🍅", label: "酸甜" },
    { value: "鲜香",       emoji: "🍲", label: "鲜香" },
    { value: "浓油赤酱",   emoji: "🥣", label: "浓油赤酱" },
    { value: "烟熏",       emoji: "🪵", label: "烟熏" },
    { value: "奶香",       emoji: "🥛", label: "奶香" },
    { value: "焦香",       emoji: "🔥", label: "焦香" }
  ],
  ingredients: [
    { value: "猪肉",   emoji: "🐷" },
    { value: "牛肉",   emoji: "🐮" },
    { value: "鸡",     emoji: "🐔" },
    { value: "鸡翅",   emoji: "🍗" },
    { value: "鱼",     emoji: "🐟" },
    { value: "虾",     emoji: "🦐" },
    { value: "鸡蛋",   emoji: "🥚" },
    { value: "豆腐",   emoji: "🧈" },
    { value: "茄子",   emoji: "🍆" },
    { value: "土豆",   emoji: "🥔" },
    { value: "西红柿", emoji: "🍅" },
    { value: "面",     emoji: "🍜" },
    { value: "米",     emoji: "🍚" },
    { value: "青菜",   emoji: "🥬" },
    { value: "腊肠",   emoji: "🌭" }
  ],
  // 餐厨条件 —— 俏皮短词
  kitchens: [
    { value: "电磁炉",   emoji: "⚡",  label: "电磁炉王",       hint: "只有一块电磁炉的小户型选这里" },
    { value: "明火灶",   emoji: "🔥",  label: "明厨亮灶",       hint: "大火爆炒一锅出锅气" },
    { value: "烤箱",     emoji: "🥧",  label: "烤箱党",         hint: "进烤箱就不管我了" },
    { value: "空气炸锅", emoji: "🍟",  label: "空气炸锅 yyds", hint: "少油也想吃脆的" },
    { value: "微波炉",   emoji: "📡",  label: "微波速成",       hint: "3-8 分钟出餐的极限操作" },
    { value: "电饭煲",   emoji: "🍚",  label: "电饭煲一招鲜",   hint: "一锅炖什么都香" },
    { value: "一口锅",   emoji: "🍳",  label: "一口锅走天下",   hint: "宿舍/出租屋友好" },
    { value: "无油烟",   emoji: "🌬️", label: "无油烟优雅做饭", hint: "蒸/煮/烤，不想擦油渍" },
    { value: "中西合璧", emoji: "🥢",  label: "中西合璧",       hint: "啥都行，给我惊喜" }
  ]
};

/**
 * 推荐逻辑：根据用户输入打分排序
 * 评分规则：
 *  - 家乡命中  +5
 *  - 口味命中（任一）+3
 *  - 食材命中（任一）+2（用户没选食材则不参与扣分）
 *  - 餐厨条件命中（任一）+4；"中西合璧"= 任意菜都+2
 *  - 颜值分 + looks * 0.4（确保好看的菜更靠前）
 *  - 难度低加分（1星 +1.5，2星 +0.5，3星 0）
 *  - 时间 ≤30 分钟 + 1（快手菜优先）
 *  - 至少需要拿到 4 分才入选，避免完全不沾边
 */
window.pickChefRecipes = function (input) {
  const { region, flavors = [], ingredients = [], kitchens = [] } = input;
  const wantAnyKitchen = kitchens.includes("中西合璧") || kitchens.length === 0;

  const scored = window.CHEF_RECIPES.map((r) => {
    let score = 0;
    const reasons = [];

    if (region && (r.region.includes(region) || region === "通用" || r.region.includes("通用"))) {
      if (r.region.includes(region)) {
        score += 5;
        reasons.push(`正宗${region}`);
      } else if (region === "通用") {
        score += 1;
      } else {
        score += 1;
      }
    }

    const flavorHit = flavors.filter((f) => r.flavors.includes(f));
    if (flavorHit.length) {
      score += 3 * Math.min(flavorHit.length, 2);
      reasons.push(`${flavorHit.join("/")}口`);
    }

    if (ingredients.length) {
      const ingHit = ingredients.filter((i) =>
        r.ingredients.some((ri) => ri.includes(i) || i.includes(ri))
      );
      if (ingHit.length) {
        score += 2 * Math.min(ingHit.length, 3);
        reasons.push(`用得上${ingHit.join("/")}`);
      }
    }

    if (wantAnyKitchen) {
      score += 2; // 不挑厨房的轻微加成
    } else {
      const kitchenHit = kitchens.filter((k) => r.kitchen.includes(k));
      if (kitchenHit.length) {
        score += 4;
        reasons.push(`${kitchenHit[0]}就能做`);
      } else {
        score -= 2; // 厨房完全不匹配则降权
      }
    }

    score += r.looks * 0.4;
    if (r.difficulty === 1) score += 1.5;
    else if (r.difficulty === 2) score += 0.5;
    if (r.timeMin <= 30) score += 1;

    return { recipe: r, score, reasons };
  });

  const filtered = scored.filter((s) => s.score >= 4);
  filtered.sort((a, b) => b.score - a.score);

  // 取前 4 道，且保证菜系不要太集中（同菜系最多 2 道）
  const picked = [];
  const regionCount = {};
  for (const s of filtered) {
    const mainRegion = s.recipe.region[0];
    regionCount[mainRegion] = regionCount[mainRegion] || 0;
    if (regionCount[mainRegion] >= 2 && picked.length >= 3) continue;
    picked.push(s);
    regionCount[mainRegion]++;
    if (picked.length >= 4) break;
  }

  // 兜底：如果一条都没匹配上，就回退给评分前 3 的快手菜
  if (picked.length === 0) {
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }

  return picked;
};

/**
 * 构造全网搜索链接（下厨房 + 哔哩哔哩）
 * 注：小红书 PC 站对未登录用户只显示空壳；用「百度 site:xiaohongshu.com」绕路
 *     实测百度对小红书收录极稀疏，"未找到相关结果"是常态，所以直接去掉小红书入口。
 */
window.buildChefSearchLinks = function (recipe) {
  const q = encodeURIComponent(recipe.searchKey || recipe.name);
  return [
    { name: "下厨房", emoji: "👩‍🍳", url: `https://www.xiachufang.com/search/?keyword=${q}` },
    { name: "B 站",   emoji: "📺",   url: `https://search.bilibili.com/all?keyword=${q}` }
  ];
};
