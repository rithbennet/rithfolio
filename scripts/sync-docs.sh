#!/bin/sh
# Mirror the working reference docs (bio, design notes, shot list, blog guide) to a Google Drive folder,
# so they can be read from Claude on a phone. One-way: the repo is the source of truth.
# The Drive path is machine-specific, so it comes from $RITHFOLIO_DRIVE_DIR or a gitignored .drive-dir file.
set -e
cd "$(git rev-parse --show-toplevel)"
DEST="${RITHFOLIO_DRIVE_DIR:-$(cat .drive-dir 2>/dev/null || true)}"
[ -n "$DEST" ] && [ -d "$(dirname "$DEST")" ] || exit 0

mkdir -p "$DEST/design"
cp docs/bio.md "$DEST/bio.md"
cp BLOG_GUIDE.md "$DEST/blog-guide.md"
cp docs/design/DESIGN-EXTRACTION.md docs/design/shot-list.md docs/design/tokens.css "$DEST/design/"
cat > "$DEST/README.md" <<NOTE
# rith.dev working docs (mirror)

Copied from the rithfolio repo (docs/ and BLOG_GUIDE.md) after every commit or pull on Harith's Mac.
Edit the repo copies, not these: this folder is overwritten.

Last synced: $(date '+%Y-%m-%d %H:%M') from commit $(git rev-parse --short HEAD)
NOTE
echo "Synced docs to $DEST"
