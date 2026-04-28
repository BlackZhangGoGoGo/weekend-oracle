// 本地快速验证 generateReason 和 getWeekendInfo 的独立脚本（不经过浏览器）
// 通过把 app.js 里的核心函数抽出来复制一遍来跑。

function getSeason(m) {
  if (m >= 3 && m <= 5) return "春";
  if (m >= 6 && m <= 8) return "夏";
  if (m >= 9 && m <= 11) return "秋";
  return "冬";
}

function getWeekendInfo(now) {
  const day = now.getDay();
  let sat, sun;
  if (day === 0) {
    sun = new Date(now);
    sat = new Date(now);
    sat.setDate(now.getDate() - 1);
  } else if (day === 6) {
    sat = new Date(now);
    sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
  } else {
    sat = new Date(now);
    sat.setDate(now.getDate() + (6 - day));
    sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
  }
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

const samples = [
  new Date("2026-04-27T10:00:00"), // 周一
  new Date("2026-04-28T14:30:00"), // 周二（今天）
  new Date("2026-05-01T20:00:00"), // 周五
  new Date("2026-05-02T09:00:00"), // 周六
  new Date("2026-05-03T18:00:00"), // 周日
  new Date("2026-12-24T12:00:00"), // 周四冬天
];

console.log("=== 周末推算测试 ===");
samples.forEach(d => {
  const info = getWeekendInfo(d);
  console.log(
    `${d.toISOString().slice(0,10)} ${info.weekdayName}  ->  周六${info.satLabel} / 周日${info.sunLabel}  距周末${info.daysUntilWeekend}天  季节=${info.season}  今在周末=${info.isWeekend}`
  );
});

// 测试 200 字保护
function fakeGenerate() {
  // 造一段一定会超的
  const base = "X".repeat(260);
  let text = base;
  if ([...text].length > 200) text = [...text].slice(0, 198).join("") + "…";
  return text;
}
const sample = fakeGenerate();
console.log(`\n200字截断测试: 长度=${[...sample].length}, 尾部="${sample.slice(-6)}"`);
