# Puck orchestration replay

Source for the videos in `public/reports/puck-orchestration/`. `site/replay.js` draws every frame on a canvas from `site/replay-data.js`, a timeline derived from the Claude Code and Codex session logs of the 6–7 Oct 2026 run (times, roles and token counts only, no transcript text).

Scenes: `main` (the full replay), `tree` (fan-out and loops), `task` (R1-02's review loop), `fanout` (serial vs four builders).

```sh
node render.mjs frames main 40,70 /tmp/frames          # PNG stills to check
node render.mjs video main ../../../../public/reports/puck-orchestration/replay.mp4 30 --crf 23
node render.mjs video tree ../../../../public/reports/puck-orchestration/tree.mp4 30 --crf 23
node render.mjs video task ../../../../public/reports/puck-orchestration/loop-task.mp4 30 --crf 24 --scale 1280:720
node render.mjs video fanout ../../../../public/reports/puck-orchestration/loop-fanout.mp4 30 --crf 24 --scale 1280:720
```

Needs Node 22+, Google Chrome and ffmpeg with libx264. Fonts are Geist and Fragment Mono (OFL), copied from `node_modules/@fontsource*`.
