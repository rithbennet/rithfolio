---
title: "Revise the loop: the Claude weekly limit, not the 5-hour one, sets the Puck builder's pace"
date: 2026-10-07
kind: Findings + replay
model: Claude Opus 5.5
readingTime: 19 min read
summary: "A Fable 5.1 orchestrator ran Opus and Sonnet builders and two GPT-6 reviewers overnight on DagangNow's Puck store builder, and merged 3 of 31 tasks. A replay of the night, opening with a fan-out tree, shows where the tokens and the hours went: Claude and Codex never worked at the same time."
highlights:
  - "3 of 31 tasks merged"
  - "2.21M Claude output tokens"
  - "0 min builder/reviewer overlap"
  - "2-min replay + fan-out tree"
tags: [agents, orchestration, dagangnow]
---

<!-- The report is public/reports/puck-orchestration/index.html, built from docs/reports/puck-orchestration/body.html with the /report skill.
     Videos are rendered from docs/reports/puck-orchestration/replay/. -->
