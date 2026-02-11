# Add a New Speaking Pair (RPG #001) — Implementation Instructions

This guide explains every file to update when adding a new pair so that UI/flow remains unchanged while content, rounds, scoring, and branching can differ per pair.

---

## 1) Create/Update Pair Registry

File: `pair-config.js`

Add a pair entry:

```js
new_pair_key: {
  pairKey: 'new_pair_key',
  label: 'Player Role vs Computer Role',
  playerRole: 'The Role Name (Character)',
  computerRole: 'The Other Role Name (Character)',
  scenes: [1, 2, 3],
  enabled: false
}
```

Notes:
- `playerRole`/`computerRole` strings must match dropdown values exactly (auto-rendered from pair config).
- Keep `enabled: false` until all assets are complete and tested.

---

## 2) Register Pair Asset Manifest

File: `pair-manifest.js`

Add scripts for each scene:

```js
new_pair_key: {
  scenes: {
    1: {
      conversationScript: 'conversations/scene1/conversation_new_pair_key.js',
      answerKeyScript: 'conversations/scene1/answer_key_new_pair_key.js'
    }
  }
}
```

Notes:
- The runtime loads these scripts dynamically; no `index.html` script-tag edits are needed.
- Each scene should include both conversation and answer key scripts.

---

## 3) Add Conversation Files

Path pattern:
- `conversations/scene{N}/conversation_{pairKey}.js`

Required shape:
1. Scene meta with title + roles
2. `window.SCENE_DATA[sceneID].conversation = [...]`
3. Pair namespace registration:

```js
if (!window.SCENE_DATA_BY_PAIR) window.SCENE_DATA_BY_PAIR = {};
if (!window.SCENE_DATA_BY_PAIR.new_pair_key) window.SCENE_DATA_BY_PAIR.new_pair_key = {};
window.SCENE_DATA_BY_PAIR.new_pair_key[sceneID] = window.SCENE_DATA[sceneID] || {};

if (!window.SCENE_META_BY_PAIR) window.SCENE_META_BY_PAIR = {};
if (!window.SCENE_META_BY_PAIR.new_pair_key) window.SCENE_META_BY_PAIR.new_pair_key = {};
window.SCENE_META_BY_PAIR.new_pair_key[sceneID] = window.SCENE_META_sceneID;
```

---

## 4) Add Answer Key Files

Path pattern:
- `conversations/scene{N}/answer_key_{pairKey}.js`

Required shape:
1. `window.SCENE_DATA[sceneID].answerKey = [...]`
2. Pair namespace registration:

```js
if (!window.SCENE_DATA_BY_PAIR) window.SCENE_DATA_BY_PAIR = {};
if (!window.SCENE_DATA_BY_PAIR.new_pair_key) window.SCENE_DATA_BY_PAIR.new_pair_key = {};
if (!window.SCENE_DATA_BY_PAIR.new_pair_key[sceneID]) window.SCENE_DATA_BY_PAIR.new_pair_key[sceneID] = window.SCENE_DATA[sceneID];
```

---

## 5) Add Decision Tree

File: `scene-decisions.js`

Add:

```js
SCENE_DECISIONS_BY_PAIR.new_pair_key = {
  scene1: {
    sceneID: 1,
    decisionCheckpoint: {
      question: '...?',
      options: [
        { optionID: 'A', optionLabel: 'Option A', optionText: '...', outcome: 2 },
        { optionID: 'B', optionLabel: 'Option B', optionText: '...', outcome: 'END_GAME' }
      ]
    }
  }
};
```

Rules:
- `outcome` can be another scene number or `END_GAME`.
- Scene IDs and outcomes must be internally consistent.

---

## 6) Configure Scene End Rounds

File: `game-logic.js`

Current system uses `SCENE_END_ROUNDS` globally. Until pair-specific rounds are introduced, new pair scenes should align with existing scene numbering/round assumptions.

When Phase 2+ introduces pair-specific round config, update here accordingly.

---

## 7) Enable Pair

After assets + decisions are complete and tested:
- Set `enabled: true` in `pair-config.js`.

---

## 8) Validation Checklist (must pass)

1. Starting modal shows both roles for the pair.
2. Role combination starts game without "not configured" errors.
3. Scene 1 loads with correct pair dialogue and answer key.
4. Each decision checkpoint appears and routes to expected scene/end.
5. No console errors for missing `SCENE_DATA` / `SCENE_META`.
6. End game export still works.

---

## 9) Quick smoke commands

```bash
node --check pair-config.js pair-manifest.js pair-runtime.js scene-decisions.js game-logic.js sceneLoader.js
node --check conversations/scene*/conversation_*.js conversations/scene*/answer_key_*.js
```
