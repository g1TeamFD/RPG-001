# RPG #001 Pair Architecture and Scene Decision Tree

## 1) Current Runtime Flow (What happens today)

1. `index.html` preloads scene conversation and answer-key scripts (currently chef vs owner only).
2. `startGame()` in `game-logic.js` validates player code and role picks.
3. The selected `playerRole + computerRole` is mapped to a `pairKey` via `resolvePairKey()` in `pair-config.js`.
4. Pair-aware scene bootstrap loads Scene 1 from `SCENE_DATA_BY_PAIR[pairKey][1]` (with backward fallback).
5. Each round renders narrative/resource/dialogue from `CONVERSATION_DATA`.
6. Player fills blanks, submits response, and scoring maps keywords to mindset scores from `ANSWER_KEY_DATA`.
7. At scene end round (`SCENE_END_ROUNDS`), the app opens a decision checkpoint.
8. Decision options route to next scene or `END_GAME`, based on the active pair's decision tree.
9. `sceneLoader.js` updates session state, scene history, scene title, and starts the next scene.

---

## 2) Pair-Aware Data Model (new structure)

### 2.1 Pair registry
`pair-config.js` defines which speaking pairs are available and whether they are live.

```js
PAIR_CONFIG[pairKey] = {
  playerRole,
  computerRole,
  scenes,
  enabled
}
```

### 2.2 Scene content namespace
Conversation and answer keys are now accessible in:

```js
window.SCENE_DATA_BY_PAIR[pairKey][sceneID] = {
  conversation,
  answerKey
}
```

Metadata is stored as:

```js
window.SCENE_META_BY_PAIR[pairKey][sceneID]
```

Backward compatibility remains via `window.SCENE_DATA` and `window.SCENE_META_<sceneID>`.

### 2.3 Decision tree namespace
Decision checkpoint routing is now keyed by pair:

```js
window.SCENE_DECISIONS_BY_PAIR[pairKey].scene<sceneID>
```

Backward compatibility remains via `window.SCENE_DECISIONS` (mapped to `chef_vs_owner`).

---

## 3) Pair-specific decision tree status (RPG #001)

## Pair A: `chef_vs_owner` (LIVE)
- Scene 1 -> A: Scene 2 | B: End
- Scene 2 -> A: Scene 3 | B: End
- Scene 3 -> A: Scene 4 | B: Scene 5 | C: Scene 6 | D: End
- Scene 4 -> A/B/C/D: End
- Scene 5 -> A/B/C: End
- Scene 6 -> A/B/C: End

## Pair B: `owner_vs_floor_manager` (PLACEHOLDER)
- Pair registered, currently disabled (`enabled: false`).
- Needs:
  - conversation + answer keys by scene
  - decision tree by scene
  - round-length config per scene (if scene count differs)

## Pair C: `floor_manager_vs_supplier` (PLACEHOLDER)
- Pair registered, currently disabled (`enabled: false`).
- Needs same assets as Pair B.

---

## 4) File responsibilities

- `pair-config.js`: canonical pair mapping and activation flags.
- `sceneLoader.js`: pair-aware scene loading and state transitions.
- `game-logic.js`: game loop, scoring, decision handling, session persistence.
- `scene-decisions.js`: pair-specific decision checkpoints and outcomes.
- `conversations/scene*/conversation_*.js`: pair-scene dialogue rounds.
- `conversations/scene*/answer_key_*.js`: blank keyword scoring per mindset.
- `view-roles.js`: role definitions and mindset focus metadata for role cards.

---

## 5) Scaling checklist for each new pair

1. Add pair entry in `PAIR_CONFIG`.
2. Set `enabled: false` while drafting content.
3. Add conversation and answer key files for each scene.
4. Register scene content into `SCENE_DATA_BY_PAIR[newPairKey][sceneID]`.
5. Add metadata to `SCENE_META_BY_PAIR[newPairKey][sceneID]`.
6. Add decision routes in `SCENE_DECISIONS_BY_PAIR[newPairKey]`.
7. Configure scene-end rounds in `SCENE_END_ROUNDS` (or migrate to pair-specific round config if scene counts differ).
8. Flip `enabled: true` only when all required scenes and checkpoints are complete.

---

## 6) Important architecture note before content expansion

`SCENE_END_ROUNDS` is currently global (shared across all pairs). If Pair B/C have different round counts per scene, move to:

```js
SCENE_END_ROUNDS_BY_PAIR[pairKey][sceneID]
```

Then update scene-end checks to read from active pair.

---

## 7) Open product decisions to confirm

1. Can a pair have fewer or more scenes than Pair A (1-6), or should all pairs keep the same scene IDs?
2. Should all pairs share one storyline title and cover image, or should left-panel story metadata be pair-specific?
3. Should role dropdowns hide disabled pairs automatically, or keep visible and show "not published" message?
4. For scoring dashboards, should mindset bars adapt to the selected role's focused mindsets only, or keep all five universal bars?
5. Do you want pair-specific CSV/JSON export naming (e.g., include `pairKey` in filename)?
