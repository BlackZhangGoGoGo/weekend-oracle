#!/bin/bash
# 周末活动占卜屋 · 每日自动发布脚本
# 流程：补活动 → 检查改动 → commit → push → 日志
#
# 由定时任务每天早上 8:00 自动调用。
# 免密前提：本机 ~/.ssh/github_ed25519 已配好，仓库 remote 为 SSH。

set -e

cd "/Users/black/Documents/workbuddy/好玩的/magic-activity-recommender"

LOG="data/auto_publish.log"
STAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "" >> "$LOG"
echo "========== [$STAMP] 开始每日自动发布 ==========" >> "$LOG"

# 1. 跑补活动脚本
echo "[1/4] 调用 update_activities.js ..." >> "$LOG"
/opt/homebrew/bin/node scripts/update_activities.js >> "$LOG" 2>&1 || {
  echo "❌ update_activities.js 执行失败" >> "$LOG"
  exit 1
}

# 2. 有改动才继续（daily_activities.json 是唯一预期变动）
if git diff --quiet data/daily_activities.json; then
  echo "[2/4] 无新增活动（可能主题下所有候选都已在库中），跳过提交。" >> "$LOG"
  echo "========== 完成（无变化）==========" >> "$LOG"
  exit 0
fi

# 3. 读取今天的追加条数（从 update.log 尾行解析）用于 commit 信息
TODAY=$(date "+%Y-%m-%d")
# update.log 尾行格式：[时间] 【主题】追加 N 条：A、B、C  | 总库：X 条
LAST_LOG=$(tail -1 data/update.log 2>/dev/null || echo "")
COUNT=$(echo "$LAST_LOG" | grep -oE "追加 [0-9]+ 条" | grep -oE "[0-9]+" || echo "?")
THEME=$(echo "$LAST_LOG" | grep -oE "【[^】]+】" | tr -d '【】' || echo "")
TITLES=$(echo "$LAST_LOG" | sed -E 's/.*追加 [0-9]+ 条：([^|]+)\|.*/\1/' | xargs)
TOTAL=$(echo "$LAST_LOG" | grep -oE "总库：[0-9]+" | grep -oE "[0-9]+" || echo "?")

COMMIT_MSG="chore: 每日补活动 · $TODAY · ${THEME} · +${COUNT} 条 · 总库 ${TOTAL}"
echo "[3/4] 准备提交：$COMMIT_MSG" >> "$LOG"
echo "      新增：$TITLES" >> "$LOG"

# 4. commit + push
git -c user.name="blackyzhang" -c user.email="blackyzhang@users.noreply.github.com" \
  add data/daily_activities.json data/update.log 2>/dev/null || true
git -c user.name="blackyzhang" -c user.email="blackyzhang@users.noreply.github.com" \
  commit -m "$COMMIT_MSG" >> "$LOG" 2>&1

echo "[4/4] 推送到远程..." >> "$LOG"
git push origin main >> "$LOG" 2>&1 && {
  echo "✅ 推送成功，GitHub Pages 将在 1-2 分钟内重新部署" >> "$LOG"
  echo "   线上地址：https://blackzhanggogogo.github.io/weekend-oracle/" >> "$LOG"
} || {
  echo "❌ 推送失败，请检查 SSH 配置或网络" >> "$LOG"
  exit 1
}

echo "========== 完成 ==========" >> "$LOG"
