#!/usr/bin/env bash
# Install the zenbu-theme-author Claude Code skill to ~/.claude/skills/
# Usage:
#   curl -o- https://raw.githubusercontent.com/zenbuapps/zenbu-themes/main/install-skill.sh | bash

set -e

SKILL_DIR="${HOME}/.claude/skills/zenbu-theme-author"
SOURCE_URL="https://raw.githubusercontent.com/zenbuapps/zenbu-themes/main/skill/SKILL.md"

mkdir -p "${SKILL_DIR}"
echo "→ Installing zenbu-theme-author skill to ${SKILL_DIR}/SKILL.md"
curl -fsSL -o "${SKILL_DIR}/SKILL.md" "${SOURCE_URL}"

echo ""
echo "✓ Installed."
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code (if running)."
echo "  2. In any Claude Code session, type /zenbu-theme-author to invoke."
echo "  3. Paste your HTML / TSX / CSS + describe what you want to turn it into."
