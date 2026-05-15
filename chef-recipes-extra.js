/**
 * 周末厨神 · 菜谱扩展库（v2 扩容）
 * 在 chef-recipes.js 之后加载，向 CHEF_RECIPES 追加菜谱，
 * 并补全 CHEF_OPTIONS.regions（鲁/闽/徽/京津/中原/海南/广西/江西/草原）。
 *
 * 严格约束：字符串内只用中文标点，不出现 ASCII 直引号包裹的内容。
 */
(function () {
  if (!window.CHEF_RECIPES || !window.CHEF_OPTIONS) return;

  /* ------ 补充家乡菜系下拉项 ------ */
  const extraRegions = [
    { value: "鲁菜",   label: "🌊 鲁菜（山东）" },
    { value: "闽菜",   label: "🍤 闽菜（福建）" },
    { value: "徽菜",   label: "🏞️ 徽菜（安徽）" },
    { value: "京津",   label: "🏯 京津（北京/天津）" },
    { value: "中原",   label: "🌾 中原（豫晋冀）" },
    { value: "海南",   label: "🌴 海南" },
    { value: "广西",   label: "🍃 广西" },
    { value: "江西",   label: "🎋 江西" },
    { value: "草原",   label: "🐎 草原（内蒙/青海）" }
  ];
  // 在"通用"之前插入
  const idx = window.CHEF_OPTIONS.regions.findIndex(r => r.value === "通用");
  if (idx >= 0) {
    window.CHEF_OPTIONS.regions.splice(idx, 0, ...extraRegions);
  } else {
    window.CHEF_OPTIONS.regions.push(...extraRegions);
  }

  /* ------ 追加菜谱（第一批：川渝补/江浙补/粤港补/鲁/闽/徽） ------ */
  const more = [
    /* ===== 川渝补 ===== */
    { id: "huiguo-rou", name: "回锅肉", emoji: "🥓",
      region: ["川渝"], flavors: ["香辣","浓油赤酱"],
      ingredients: ["五花肉","蒜苗","青椒","豆瓣酱","豆豉"],
      kitchen: ["明火灶","电磁炉","一口锅"],
      difficulty: 2, timeMin: 30, looks: 4,
      desc: "肥而不腻、辣得过瘾，川菜镇桌之宝。",
      steps: ["五花肉冷水加姜葱料酒煮 20 分钟到 8 分熟","切薄片","热锅少油煸肉片到出油卷边","下豆瓣酱豆豉炒红油","下青椒蒜苗大火爆炒，淋少许生抽糖"],
      tips: "肉煮完冷藏 10 分钟再切，片得又薄又齐整。",
      searchKey: "回锅肉 家常" },

    { id: "gongbao-jiding", name: "宫保鸡丁", emoji: "🥜",
      region: ["川渝"], flavors: ["麻辣","酸甜","焦香"],
      ingredients: ["鸡腿肉","花生米","干辣椒","花椒"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 2, timeMin: 20, looks: 5,
      desc: "甜咸辣酸一勺到位，国民下饭菜里的国宝级选手。",
      steps: ["鸡腿肉切丁加盐料酒淀粉抓匀","调汁醋糖生抽淀粉水拌匀","热油爆干辣椒花椒香","下鸡丁炒变色","下花生米葱段淋汁翻匀"],
      tips: "花生米最好生的炸熟，比熟花生香。",
      searchKey: "宫保鸡丁 家常" },

    { id: "fuqi-feipian", name: "夫妻肺片", emoji: "🍛",
      region: ["川渝"], flavors: ["麻辣","鲜香"],
      ingredients: ["牛肉","牛肚","卤汁","花椒"],
      kitchen: ["电磁炉","明火灶"],
      difficulty: 2, timeMin: 60, looks: 5,
      desc: "凉拌界 C 位，红油亮汪汪、芝麻香盖天。",
      steps: ["牛肉牛肚卤熟切片","调红油辣子辣椒面花椒粉热油泼香","加蒜末生抽香醋糖芝麻花生碎","和肉片拌匀","撒香菜芹菜末"],
      tips: "懒人版直接买现成卤牛肉，省 1 小时。",
      searchKey: "夫妻肺片 家常做法" },

    { id: "maoxue-wang", name: "毛血旺", emoji: "🥘",
      region: ["川渝"], flavors: ["麻辣","鲜香"],
      ingredients: ["鸭血","毛肚","午餐肉","豆芽"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 2, timeMin: 30, looks: 5,
      desc: "一锅红油吞万物，火锅瘾犯了就做它。",
      steps: ["豆芽烫熟铺碗底","爆豆瓣酱火锅底料加水煮开","下鸭血毛肚午餐肉烫熟","连汤倒入碗中","面上撒辣椒花椒，热油浇香"],
      tips: "鸭血提前冷水加盐泡 10 分钟去腥。",
      searchKey: "毛血旺 家常版" },

    { id: "suancai-yu", name: "酸菜鱼", emoji: "🐟",
      region: ["川渝"], flavors: ["酸辣","鲜香"],
      ingredients: ["黑鱼","酸菜","泡椒","白胡椒"],
      kitchen: ["明火灶","电磁炉","一口锅"],
      difficulty: 2, timeMin: 35, looks: 5,
      desc: "酸得开胃辣得过瘾，鱼片滑嫩到能 Q 弹。",
      steps: ["鱼片用蛋清淀粉白胡椒腌 10 分钟","酸菜泡椒爆香","加水煮开下鱼骨熬 5 分钟","下鱼片烫 1 分钟即关火","泼热油加蒜末"],
      tips: "买现成酸菜鱼调料包更稳，新手友好。",
      searchKey: "酸菜鱼 家常做法" },

    { id: "lazi-ji", name: "辣子鸡", emoji: "🐔",
      region: ["川渝"], flavors: ["麻辣","焦香"],
      ingredients: ["鸡腿","干辣椒","花椒","蒜"],
      kitchen: ["明火灶","电磁炉","一口锅"],
      difficulty: 2, timeMin: 30, looks: 5,
      desc: "在一堆辣椒里找鸡块，吃的就是这股仪式感。",
      steps: ["鸡腿切小块腌料酒生抽","裹淀粉炸到金黄","干辣椒花椒小火慢煸出香","回锅鸡块翻匀","撒白芝麻熟花生"],
      tips: "鸡块炸两次更脆，不会一拌就软。",
      searchKey: "辣子鸡 家常" },

    { id: "chongqing-xiaomian", name: "重庆小面", emoji: "🍜",
      region: ["川渝"], flavors: ["麻辣","鲜香"],
      ingredients: ["面条","花生","榨菜","辣椒油"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 15, looks: 4,
      desc: "一勺红油定乾坤，15 分钟搞定重庆早餐。",
      steps: ["碗底放辣椒油两勺、花椒粉、生抽、蒜水、榨菜、花生碎","面条煮熟连面汤盛入碗","撒小葱","拌匀开吃"],
      tips: "蒜水即蒜末加温水泡 5 分钟，是灵魂。",
      searchKey: "重庆小面 配方" },

    /* ===== 江浙补 ===== */
    { id: "tangcu-xiaopai", name: "无锡糖醋小排", emoji: "🍖",
      region: ["江浙"], flavors: ["甜口","酸甜","浓油赤酱"],
      ingredients: ["小排骨","冰糖","香醋","老抽"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 50, looks: 5,
      desc: "甜润酱亮的无锡小骨头，啃骨头啃到忘记说话。",
      steps: ["小排焯水洗净","冰糖小火炒糖色","下排骨翻匀上色","加香醋老抽生抽料酒水没过，小火炖 30 分钟","大火收汁加白醋点亮"],
      tips: "白醋最后才放，保持酸香不挥发。",
      searchKey: "无锡糖醋小排" },

    { id: "songshu-yu", name: "松鼠桂鱼（家常版）", emoji: "🐟",
      region: ["江浙"], flavors: ["酸甜","焦香"],
      ingredients: ["桂鱼","番茄酱","面粉","淀粉"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 3, timeMin: 50, looks: 5,
      desc: "炸成松鼠形、淋上糖醋汁，国宴菜的家常照搬版。",
      steps: ["桂鱼去骨切花刀","拍干淀粉下油炸定型","复炸到金黄","调糖醋汁番茄酱4糖3醋2水5淀粉少许","汁烧开淋鱼身撒松仁"],
      tips: "新手可以用龙利鱼柳切条代替。",
      searchKey: "松鼠桂鱼 家常做法" },

    { id: "youmen-daxia", name: "油焖大虾", emoji: "🦞",
      region: ["江浙"], flavors: ["甜口","浓油赤酱","鲜香"],
      ingredients: ["大虾","葱姜","料酒"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 20, looks: 5,
      desc: "壳里入味、肉里弹牙，一锅虾全家围抢。",
      steps: ["大虾挑虾线开背","热油爆姜葱","下虾煎到两面变红","加料酒生抽糖少许水","盖盖焖 3 分钟大火收汁"],
      tips: "虾背开一刀，更入味也更上相。",
      searchKey: "油焖大虾 家常" },

    { id: "yan-duxian", name: "腌笃鲜", emoji: "🍲",
      region: ["江浙"], flavors: ["清淡","鲜香"],
      ingredients: ["咸肉","春笋","百叶结","鲜五花"],
      kitchen: ["电磁炉","明火灶","无油烟"],
      difficulty: 1, timeMin: 70, looks: 4,
      desc: "春天的味道，咸鲜各一勺，喝汤喝到见底。",
      steps: ["咸肉切块焯水","鲜五花切块焯水","和春笋一起加水炖 1 小时","下百叶结再炖 10 分钟","不用加盐"],
      tips: "咸肉自带咸味，全程都不需要加盐。",
      searchKey: "腌笃鲜 上海做法" },

    { id: "congyou-banmian", name: "葱油拌面", emoji: "🥢",
      region: ["江浙"], flavors: ["咸鲜","焦香"],
      ingredients: ["面条","小葱","生抽","老抽"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 20, looks: 4,
      desc: "小葱熬出金黄油香，三勺拌一碗治愈夜宵。",
      steps: ["小葱切段一半葱白一半葱叶","冷油下葱白小火慢熬到金黄","下葱叶熬到焦干","调味汁生抽4老抽1糖1","拌入煮好的面"],
      tips: "葱一定要小火慢熬，急火一变黑就苦。",
      searchKey: "葱油拌面 上海家常" },

    /* ===== 粤港补 ===== */
    { id: "lan-er-xia-jiao", name: "懒人版虾饺", emoji: "🥟",
      region: ["粤港"], flavors: ["鲜香","清淡"],
      ingredients: ["虾仁","澄面","马蹄"],
      kitchen: ["电磁炉","明火灶","无油烟"],
      difficulty: 3, timeMin: 50, looks: 5,
      desc: "晶莹剔透的早茶 C 位，自己包一笼仪式感爆棚。",
      steps: ["澄面加少许淀粉用沸水烫成团","虾仁切大粒加马蹄碎盐糖香油","面团擀薄包入虾馅","上汽蒸 6 分钟"],
      tips: "澄面必须用刚烧开的水烫，皮才会透。",
      searchKey: "广式虾饺 家常做法" },

    { id: "baizhuo-caixin", name: "白灼菜心", emoji: "🥬",
      region: ["粤港"], flavors: ["清淡","咸鲜"],
      ingredients: ["菜心","蒜","蒸鱼豉油"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 10, looks: 4,
      desc: "粤菜最简也最考刀的一道，10 分钟出片清爽小绿洲。",
      steps: ["水烧开加盐和一勺油","菜心烫 1 分钟捞出码盘","淋蒸鱼豉油","蒜末葱花热油爆香浇上"],
      tips: "焯水时加点油，菜色翠绿不发黄。",
      searchKey: "白灼菜心 家常" },

    { id: "chizhi-paigu", name: "豉汁蒸排骨", emoji: "🍖",
      region: ["粤港"], flavors: ["咸鲜","鲜香"],
      ingredients: ["排骨","豆豉","蒜","姜"],
      kitchen: ["电磁炉","明火灶","无油烟"],
      difficulty: 1, timeMin: 25, looks: 4,
      desc: "茶楼经典一笼，肉嫩骨香，配米饭神级搭子。",
      steps: ["排骨洗净加生抽蚝油糖淀粉腌 15 分钟","拌入豆豉和蒜姜","平铺盘里","大火蒸 15 分钟","出锅撒小葱"],
      tips: "排骨切小段更入味，蒸的时间也短。",
      searchKey: "豉汁蒸排骨 家常" },

    /* ===== 鲁菜（山东） ===== */
    { id: "tangcu-liyu", name: "糖醋鲤鱼（家常版）", emoji: "🐠",
      region: ["鲁菜"], flavors: ["酸甜","焦香"],
      ingredients: ["鲤鱼","番茄酱","白醋","白糖"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 3, timeMin: 50, looks: 5,
      desc: "山东宴客头牌，金黄酥脆加酸甜亮汁，霸气。",
      steps: ["鲤鱼去骨打花刀","裹淀粉糊下油炸定型","复炸到金黄","调糖醋汁番茄酱醋糖水淀粉","汁烧开浇鱼身"],
      tips: "新手用龙利鱼柳分两段炸，更好操作。",
      searchKey: "糖醋鲤鱼 家常做法" },

    { id: "congshao-haishen", name: "葱烧海参（懒人版）", emoji: "🍢",
      region: ["鲁菜"], flavors: ["浓油赤酱","鲜香"],
      ingredients: ["即食海参","大葱","老抽"],
      kitchen: ["电磁炉","明火灶"],
      difficulty: 2, timeMin: 25, looks: 5,
      desc: "鲁菜代表作，懒人版直接用即食海参，30 分钟出宴客大菜。",
      steps: ["大葱切段炸到金黄成葱油","调汁老抽生抽糖蚝油水淀粉","下海参翻匀挂汁","摆盘淋葱油"],
      tips: "海参冷藏化冻别用热水，肉质才弹。",
      searchKey: "葱烧海参 家常" },

    { id: "dacong-jidan", name: "山东大葱炒鸡蛋", emoji: "🥚",
      region: ["鲁菜"], flavors: ["咸鲜","焦香"],
      ingredients: ["章丘大葱","鸡蛋"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 10, looks: 3,
      desc: "山东人离家乡最近的味道，5 分钟一盘。",
      steps: ["大葱斜切片","鸡蛋打散加盐","热油炒蛋盛出","原锅炒葱白到微焦","回锅蛋翻匀加葱叶"],
      tips: "大葱辛辣别太久，断生即可。",
      searchKey: "大葱炒鸡蛋" },

    { id: "jiu-zhuan-dachang", name: "九转大肠（懒人版）", emoji: "🌀",
      region: ["鲁菜"], flavors: ["酸甜","浓油赤酱"],
      ingredients: ["猪大肠","醋","糖","八角"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 3, timeMin: 90, looks: 5,
      desc: "九味交响曲，酸甜苦辣咸鲜香麻俱全，老饕级。",
      steps: ["大肠清洗冷水煮 30 分钟切段","糖色炒匀挂色","加生抽老抽醋糖香料炖 30 分钟","收汁","撒香菜末"],
      tips: "懒人买现成卤大肠，直接最后两步收汁。",
      searchKey: "九转大肠 家常做法" },

    /* ===== 闽菜（福建） ===== */
    { id: "fotiao-qiang-jian", name: "佛跳墙（家常版）", emoji: "🍲",
      region: ["闽菜"], flavors: ["浓油赤酱","鲜香"],
      ingredients: ["鲍鱼","海参","花胶","干贝","鸽子蛋"],
      kitchen: ["电磁炉","明火灶","电饭煲"],
      difficulty: 3, timeMin: 120, looks: 5,
      desc: "宴客级福建名菜，懒人版用即食食材也能压场。",
      steps: ["各种海味提前泡发","鸡汤打底","所有食材分层码入炖盅","加少许花雕酒","隔水蒸 2 小时"],
      tips: "用现成佛跳墙料包加鸡汤，时间可砍到 40 分钟。",
      searchKey: "佛跳墙 家常版" },

    { id: "shacha-mian", name: "厦门沙茶面", emoji: "🍜",
      region: ["闽菜"], flavors: ["鲜香","咸鲜"],
      ingredients: ["碱面","沙茶酱","虾","鱿鱼","豆芽"],
      kitchen: ["电磁炉","明火灶","一口锅"],
      difficulty: 1, timeMin: 20, looks: 5,
      desc: "厦门街边味，一勺沙茶酱直通灵魂。",
      steps: ["沙茶酱用油炒香","加高汤煮开","下海鲜豆芽烫熟","下煮好的面","撒葱花香菜"],
      tips: "沙茶酱买福建本地品牌更对味。",
      searchKey: "厦门沙茶面" },

    { id: "lurou-fan", name: "卤肉饭", emoji: "🍱",
      region: ["闽菜"], flavors: ["甜口","浓油赤酱"],
      ingredients: ["五花肉","八角","冰糖","卤蛋"],
      kitchen: ["电磁炉","明火灶","电饭煲"],
      difficulty: 1, timeMin: 60, looks: 5,
      desc: "台式家常之光，肉碎一勺浇饭加卤蛋，停不下来。",
      steps: ["五花肉剁碎或切丁","少油炒香红葱酥","下肉炒到出油","加生抽老抽冰糖五香粉八角水","小火炖 40 分钟"],
      tips: "红葱酥是关键，能让肉香翻倍。",
      searchKey: "台式卤肉饭 家常" },

    { id: "jiangmu-ya", name: "姜母鸭", emoji: "🦆",
      region: ["闽菜"], flavors: ["鲜香","焦香"],
      ingredients: ["鸭子","老姜","米酒","麻油"],
      kitchen: ["明火灶","电磁炉","一口锅"],
      difficulty: 2, timeMin: 70, looks: 4,
      desc: "冬日驱寒一锅暖，姜越老越香、酒越烧越醇。",
      steps: ["老姜切片麻油煸到焦黄","下鸭块翻炒上色","加米酒和生抽老抽","小火炖 50 分钟","收汁出锅"],
      tips: "米酒尽量多放点，去腥提鲜效果好。",
      searchKey: "姜母鸭 家常做法" },

    /* ===== 徽菜（安徽） ===== */
    { id: "chou-guiyu", name: "臭鳜鱼（懒人版）", emoji: "🐟",
      region: ["徽菜"], flavors: ["浓油赤酱","鲜香"],
      ingredients: ["腌制臭鳜鱼","姜","蒜","笋丁"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 2, timeMin: 40, looks: 4,
      desc: "闻起来臭吃起来香的徽州神奇之物。",
      steps: ["臭鳜鱼洗净两面煎到金黄","下姜蒜笋丁炒香","加生抽老抽糖少许水","小火炖 15 分钟收汁","撒蒜苗"],
      tips: "用现成腌好的臭鳜鱼最方便。",
      searchKey: "徽州臭鳜鱼" },

    { id: "huizhou-maodoufu", name: "毛豆腐（懒人版）", emoji: "🧀",
      region: ["徽菜"], flavors: ["咸鲜","鲜香"],
      ingredients: ["毛豆腐","小米椒","蒜末"],
      kitchen: ["电磁炉","明火灶"],
      difficulty: 2, timeMin: 25, looks: 4,
      desc: "舌尖上的中国捧红的徽州奇味。",
      steps: ["毛豆腐两面煎到金黄","盘里淋少许生抽老抽糖","撒蒜末小米椒","热油泼香","撒小葱"],
      tips: "煎的时候要有耐心，外壳金黄才不腥。",
      searchKey: "毛豆腐 徽州" },

    { id: "huotui-jiayu", name: "火腿炖甲鱼（家常版）", emoji: "🍲",
      region: ["徽菜"], flavors: ["鲜香","清淡"],
      ingredients: ["甲鱼","金华火腿","姜片"],
      kitchen: ["明火灶","电磁炉"],
      difficulty: 3, timeMin: 90, looks: 4,
      desc: "徽菜山珍代表，鲜得能让人沉默 3 秒。",
      steps: ["甲鱼焯水去黑膜","火腿切片","加葱姜入砂锅","水开转小火炖 80 分钟","出锅加盐"],
      tips: "金华火腿自带咸鲜，盐要最后再加。",
      searchKey: "火腿炖甲鱼 徽州" }
  ];

  window.CHEF_RECIPES.push(...more);
})();
