#!/bin/bash
# 周末活动占卜屋 · 每日自动发布脚本
# 流程：补活动（占卜屋） → 补遛娃方案 → 检查改动 → commit → push → 日志
#
# 由定时任务每天早上 8:00 自动调用。
# 免密前提：本机 ~/.ssh/github_ed25519 已配好，仓库 remote 为 SSH。

set -e

cd "/Users/black/Documents/workbuddy/好玩的/magic-activity-recommender"

LOG="data/auto_publish.log"
STAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "" >> "$LOG"
echo "========== [$STAMP] 开始每日自动发布 ==========" >> "$LOG"

# 1. 跑占卜屋补活动脚本
echo "[1/5] 调用 update_activities.js（占卜屋活动）..." >> "$LOG"
NO_GIT_PUSH=1 /opt/homebrew/bin/node scripts/update_activities.js >> "$LOG" 2>&1 || {
  echo "❌ update_activities.js 执行失败" >> "$LOG"
  exit 1
}

# 2. 跑溜娃神器补方案脚本
echo "[2/5] 调用 update_kids_spots.js（溜娃方案）..." >> "$LOG"
/opt/homebrew/bin/node scripts/update_kids_spots.js >> "$LOG" 2>&1 || {
  echo "⚠️ update_kids_spots.js 执行失败（不影响占卜屋继续）" >> "$LOG"
}

# 3. 检查改动（任意一个文件有变就继续）
DAILY_CHANGED=0
KIDS_CHANGED=0
git diff --quiet data/daily_activities.json || DAILY_CHANGED=1
git diff --quiet kids-spots.js || KIDS_CHANGED=1

if [ "$DAILY_CHANGED" -eq 0 ] && [ "$KIDS_CHANGED" -eq 0 ]; then
  echo "[3/5] 占卜屋和溜娃神器今日都无新增，跳过提交。" >> "$LOG"
  echo "========== 完成（无变化）==========" >> "$LOG"
  exit 0
fi

TODAY=$(date "+%Y-%m-%d")

# 解析占卜屋追加日志
DAILY_PARSED=""
if [ "$DAILY_CHANGED" -eq 1 ]; then
  LAST_LOG=$(tail -1 data/update.log 2>/dev/null || echo "")
  DAILY_PARSED=$(/opt/homebrew/bin/node -e '
    const line = process.argv[1] || "";
    const theme = (line.match(/【([^】]+)】/) || [,""])[1];
    const count = (line.match(/追加\s*(\d+)\s*条/) || [,"?"])[1];
    const total = (line.match(/总库[：:]\s*(\d+)/) || [,"?"])[1];
    console.log([theme, count, total].join("\x1f"));
  ' "$LAST_LOG")
fi

# 解析溜娃神器追加日志
KIDS_PARSED=""
if [ "$KIDS_CHANGED" -eq 1 ]; then
  LAST_KIDS=$(tail -1 data/kids_update.log 2>/dev/null || echo "")
  KIDS_PARSED=$(/opt/homebrew/bin/node -e '
    const line = process.argv[1] || "";
    const cities = (line.match(/【([^】]+)】/) || [,""])[1];
    const count = (line.match(/追加\s*(\d+)\s*条/) || [,"?"])[1];
    const total = (line.match(/总库[：:]\s*(\d+)/) || [,"?"])[1];
    console.log([cities, count, total].join("\x1f"));
  ' "$LAST_KIDS")
fi

# 拼 commit message
COMMIT_PARTS=""
if [ -n "$DAILY_PARSED" ]; then
  THEME=$(echo "$DAILY_PARSED" | awk -F $'\x1f' '{print $1}')
  COUNT=$(echo "$DAILY_PARSED" | awk -F $'\x1f' '{print $2}')
  TOTAL=$(echo "$DAILY_PARSED" | awk -F $'\x1f' '{print $3}')
  COMMIT_PARTS="占卜屋·${THEME}·+${COUNT}/总${TOTAL}"
fi
if [ -n "$KIDS_PARSED" ]; then
  CITIES=$(echo "$KIDS_PARSED" | awk -F $'\x1f' '{print $1}')
  KCOUNT=$(echo "$KIDS_PARSED" | awk -F $'\x1f' '{print $2}')
  KTOTAL=$(echo "$KIDS_PARSED" | awk -F $'\x1f' '{print $3}')
  if [ -n "$COMMIT_PARTS" ]; then
    COMMIT_PARTS="$COMMIT_PARTS · 溜娃·${CITIES}·+${KCOUNT}/总${KTOTAL}"
  else
    COMMIT_PARTS="溜娃·${CITIES}·+${KCOUNT}/总${KTOTAL}"
  fi
fi

COMMIT_MSG="chore: 每日内容更新 · $TODAY · $COMMIT_PARTS"
echo "[4/5] 准备提交：$COMMIT_MSG" >> "$LOG"

# add 相关文件
git -c user.name="blackyzhang" -c user.email="blackyzhang@users.noreply.github.com" \
  add data/daily_activities.json data/update.log kids-spots.js data/kids_update.log 2>/dev/null || true
git -c user.name="blackyzhang" -c user.email="blackyzhang@users.noreply.github.com" \
  commit -m "$COMMIT_MSG" >> "$LOG" 2>&1

echo "[5/5] 推送到远程..." >> "$LOG"
git push origin main >> "$LOG" 2>&1 && {
  echo "✅ 推送成功，GitHub Pages 将在 1-2 分钟内重新部署" >> "$LOG"
  echo "   线上地址：https://blackzhanggogogo.github.io/weekend-oracle/" >> "$LOG"
} || {
  echo "❌ 推送失败，请检查 SSH 配置或网络" >> "$LOG"
  exit 1
}

echo "========== 完成 ==========" >> "$LOG"
