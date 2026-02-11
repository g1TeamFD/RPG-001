// ============================================
// GAME LOGIC - Core Mechanics and Scoring
// ============================================

// === SCENE CONFIG (SAFE v1) ===
const SCENE_END_ROUNDS = {
  1: 10, // Scene 1 ends at round 10
  2:9, // Scene 2 ends at round 9
  3:7, // Scene 3 ends at round 7
  4:8, // Scene 4 ends at round 8
  5:4, // Scene 5 ends at round 4
  6:9 // Scene 6 ends at round 9
};


// Game State
let currentRound = 1;
let currentStep = 0;
let mindsetScores = {
  systemsThinker: 0,
  resourceCraftsman: 0,
  calmStrategist: 0,
  valueHunter: 0,
  experimenter: 0,
};
let totalScore = 0;

// === NEW: ROUND-LEVEL SCORE HISTORY (for chart mapping) ===
let roundHistory = [];
window.roundHistory = roundHistory;

// Response timer
let responseTimer = null;
let responseSeconds = 120;

// === NEW SCORING TRACKERS ===
let wordCountScore = 0;
let questionBonus = 0;
let blankPenalty = 0;

// Session Data
let sessionData = {
  playerCode: '',
  playerRole: '',
  computerRole: '',
  startDateTime: '',
  timezone: 'Asia/Singapore',
  responses: [],
  finalScores: {},
};

// === NEW: CONVERSATION STATE TRACKING (for navigation pause/resume) ===
let actualCurrentScene = 1;          // The scene where conversation is actively progressing
let isViewingHistoricalScene = false; // Flag: true when viewing past scenes (read-only)
let pausedConversationState = null;   // Stores paused conversation state for resume
let manualPauseState = {
  isPaused: false,
  pausedAt: null,
  remainingSeconds: null
};   // Tracks manual pause/play state

// True only when the current turn is actively awaiting player input.
let isResponseInputActive = false;

// Guard async render callbacks so stale timeouts from pre-navigation state
// cannot append out-of-order/duplicate dialogue blocks.
let conversationRenderToken = 0;

function bumpConversationRenderToken() {
  conversationRenderToken += 1;
  return conversationRenderToken;
}

window.actualCurrentScene = actualCurrentScene;
window.isViewingHistoricalScene = isViewingHistoricalScene;
window.manualPauseState = manualPauseState;


// Story Comments (Session-scoped, in-memory)
let storyComments = [];
let sceneConversations = {};
window.sceneConversations = sceneConversations;
let currentExpandedChapter = null;

// Initialize
window.onload = async function () {
  console.log('✅ Game loaded!');

  try {
    if (typeof ensureEnabledPairsAssetsLoaded === 'function') {
      await ensureEnabledPairsAssetsLoaded();
    }
  } catch (error) {
    console.error('Failed to preload pair assets:', error);
    alert('Some game assets failed to load. Please refresh and try again.');
  }

  if (typeof renderRoleSelectOptions === 'function') {
    renderRoleSelectOptions();
  }

  document.getElementById('player-info-modal').classList.remove('hidden');
  
  // Initialize state management
  syncSessionStateToGlobal();
  applyManualPauseUI();

  initChart();
  
  // Optional: Enable state monitoring for debugging
  // startStateValidationMonitor();
};


// Global data references (populated by sceneLoader)
window.CONVERSATION_DATA = [];
window.ANSWER_KEY_DATA = [];
window.SCENE_META = {};


// Global exposure
window.startGame = startGame;
window.submitResponse = submitResponse;
window.showStoryline = showStoryline;
window.showRoles = showRoles;
window.showHint = showHint;
window.closeModal = closeModal;
window.closeStoryModal = closeStoryModal;
window.toggleChapter = toggleChapter;
window.sendComment = sendComment;
window.editBlank = editBlank;
window.saveBlank = saveBlank;

function getDecisionTreeForActivePair() {
  const pairKey = typeof getActivePairKey === 'function' ? getActivePairKey() : 'chef_vs_owner';
  if (window.SCENE_DECISIONS_BY_PAIR && window.SCENE_DECISIONS_BY_PAIR[pairKey]) {
    return window.SCENE_DECISIONS_BY_PAIR[pairKey];
  }
  return window.SCENE_DECISIONS;
}

function getSceneBundleForActivePair(sceneID) {
  const pairKey = typeof getActivePairKey === 'function' ? getActivePairKey() : 'chef_vs_owner';
  if (window.SCENE_DATA_BY_PAIR && window.SCENE_DATA_BY_PAIR[pairKey]?.[sceneID]) {
    return {
      pairKey,
      sceneData: window.SCENE_DATA_BY_PAIR[pairKey][sceneID],
      sceneMeta: window.SCENE_META_BY_PAIR?.[pairKey]?.[sceneID] || window[`SCENE_META_${sceneID}`]
    };
  }
  if (window.SCENE_DATA?.[sceneID]) {
    return {
      pairKey: 'chef_vs_owner',
      sceneData: window.SCENE_DATA[sceneID],
      sceneMeta: window[`SCENE_META_${sceneID}`]
    };
  }
  return null;
}

async function startGame() {
  const playerCode = document.getElementById('player-code').value.trim();
  const playerRole = document.getElementById('player-role').value;
  const computerRole = document.getElementById('computer-role').value;
  const errorDiv = document.getElementById('player-info-error');

  if (!playerCode || !playerRole || !computerRole) {
    errorDiv.textContent = 'Please fill all fields';
    errorDiv.classList.remove('hidden');
    return;
  }

  if (playerRole === computerRole) {
    errorDiv.textContent = 'Roles must be different';
    errorDiv.classList.remove('hidden');
    return;
  }

  const pairKey = typeof resolvePairKey === 'function' ? resolvePairKey(playerRole, computerRole) : null;
  if (!pairKey || !window.PAIR_CONFIG?.[pairKey]) {
    errorDiv.textContent = 'This role pair is not configured yet.';
    errorDiv.classList.remove('hidden');
    return;
  }

  if (window.PAIR_CONFIG[pairKey].enabled === false) {
    errorDiv.textContent = 'This role pair exists but scenes are not published yet.';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    if (typeof ensurePairAssetsLoaded === 'function') {
      await ensurePairAssetsLoaded(pairKey);
    }
  } catch (error) {
    console.error('Failed to load pair assets for startGame:', error);
    errorDiv.textContent = 'Unable to load selected role-pair assets. Please refresh and retry.';
    errorDiv.classList.remove('hidden');
    return;
  }

  // Existing assignments (KEEP)
  sessionData.playerCode = playerCode;
  sessionData.playerRole = playerRole;
  sessionData.computerRole = computerRole;
  sessionData.startDateTime = getSingaporeDateTime();
  sessionData.responses = [];
  sessionData.finalScores = {};

  // === GAME SESSION INIT (Non-breaking, CORRECT PLACE) ===
  const gameSession = {
    playerRole: playerRole,
    computerRole: computerRole,
    pairKey: pairKey,
    currentScene: 1,
    scoreState: {
      systemsThinker: 0,
      resourceCraftsman: 0,
      calmStrategist: 0,
      valueHunter: 0,
      experimenter: 0,
    },
    totalScore: 0,
    sceneHistory: [],
    playerDecisions: {},
    responses: [],
    // === NEW: INITIALIZE CONVERSATION STATE ===
    actualCurrentScene: 1,
    isViewingHistoricalScene: false,
    pausedConversationState: null,
    manualPauseState: {
      isPaused: false,
      pausedAt: null,
      remainingSeconds: null
    }
  };



  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  // GOOGLE SHEETS SYNC (unchanged)
  if (typeof syncSessionStart === 'function') {
    syncSessionStart(
      playerCode,
      playerRole,
      computerRole,
      sessionData.startDateTime
    ).catch(err => {
      console.warn('Session sync failed (game continues):', err);
    });
  }

  document.getElementById('player-info-modal').classList.add('hidden');
  
  // Initialize Scene 1 conversation data
  const sceneOneBundle = getSceneBundleForActivePair(1);
  if (sceneOneBundle) {
    window.CONVERSATION_DATA = sceneOneBundle.sceneData.conversation;
    window.ANSWER_KEY_DATA = sceneOneBundle.sceneData.answerKey;
    window.SCENE_META = sceneOneBundle.sceneMeta;

    // Store Scene 1 metadata in sceneMetaHistory for navigation
    if (!gameSession.sceneMetaHistory) {
      gameSession.sceneMetaHistory = {};
    }
    gameSession.sceneMetaHistory[1] = window.SCENE_META;
    sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

    ensureSceneRenderState(1);

  // Add Scene 1 to sceneHistory to track the starting scene in navigation
  gameSession.sceneHistory.push(1);
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  } else {

    // Show error message if no conversation available
    alert('Please come back later or select another roles');
    document.getElementById('player-info-modal').classList.remove('hidden');
    return;
  }
 
  // === NEW: INITIALIZE GLOBAL CONVERSATION STATE VARIABLES ===
  actualCurrentScene = 1;
  isViewingHistoricalScene = false;
  pausedConversationState = null;  
  manualPauseState = {
    isPaused: false,
    pausedAt: null,
    remainingSeconds: null
  };
  
  // Expose to window for debugging
  window.actualCurrentScene = actualCurrentScene;
  window.isViewingHistoricalScene = isViewingHistoricalScene;
  window.manualPauseState = manualPauseState;


  startRound();
  // Update scene title header for Scene 1
  updateSceneTitle();
  updatePausePlayButtonState();
}



function getSingaporeDateTime() {
  const now = new Date();
  const sgTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
  );
  return `${sgTime.getFullYear()}-${String(sgTime.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(sgTime.getDate()).padStart(2, '0')} ${String(
    sgTime.getHours()
  ).padStart(2, '0')}:${String(sgTime.getMinutes()).padStart(2, '0')}:${String(
    sgTime.getSeconds()
  ).padStart(2, '0')}`;
}

function startRound() {
  currentStep = 0;
  isResponseInputActive = false;

  // Ensure response input visibility is correct for current scene state
  updateResponseInputAreaVisibility();
  updateResponseTimerVisibility();
  
  displayCurrentTurn();
}



function normalizeRoleLabel(value) {
  return (value || '')
    .replace(/\s*\([^)]*\)\s*/g, '')
    .trim()
    .toLowerCase();
}

function isPlayerTurn(turnData) {
  if (!turnData) return false;
  if (typeof turnData.is_player === 'boolean') return turnData.is_player;

  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  const playerRole = normalizeRoleLabel(gameSession.playerRole || sessionData.playerRole || '');
  const turnRole = normalizeRoleLabel(turnData.role || '');

  if (playerRole && turnRole) {
    return playerRole === turnRole;
  }

  return false;
}

function getTurnAtState(round, step) {
  const roundTurns = CONVERSATION_DATA.filter((d) => d.round === round);
  return roundTurns[step] || null;
}

function ensureNavigationPauseState() {
  if (!manualPauseState?.isPaused) {
    manualPauseState = {
      isPaused: true,
      pausedAt: getSingaporeDateTime(),
      remainingSeconds: responseSeconds
    };
    window.manualPauseState = manualPauseState;
  }
}


function ensureSceneRenderState(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  if (!gameSession.sceneRenderState) gameSession.sceneRenderState = {};
  if (!gameSession.sceneRenderState[sceneID]) {
    gameSession.sceneRenderState[sceneID] = {
      completedTurnUIDs: [],
      draftInputs: {}
    };
  }
  sessionStorage.setItem('gameSession', JSON.stringify(gameSession));
  return gameSession.sceneRenderState[sceneID];
}

function markTurnCompleted(sceneID, turnUID) {
  if (!turnUID) return;
  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  if (!gameSession.sceneRenderState) gameSession.sceneRenderState = {};
  if (!gameSession.sceneRenderState[sceneID]) {
    gameSession.sceneRenderState[sceneID] = { completedTurnUIDs: [], draftInputs: {} };
  }

  const list = gameSession.sceneRenderState[sceneID].completedTurnUIDs;
  if (!list.includes(turnUID)) {
    list.push(turnUID);
  }

  sessionStorage.setItem('gameSession', JSON.stringify(gameSession));
}

function saveDraftInputsForScene(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  if (!gameSession.sceneRenderState) gameSession.sceneRenderState = {};
  if (!gameSession.sceneRenderState[sceneID]) {
    gameSession.sceneRenderState[sceneID] = { completedTurnUIDs: [], draftInputs: {} };
  }

  const draftInputs = {};
  document.querySelectorAll('#current-player-input .blank-input').forEach((input) => {
    draftInputs[input.id] = input.value || '';
  });

  gameSession.sceneRenderState[sceneID].draftInputs = draftInputs;
  sessionStorage.setItem('gameSession', JSON.stringify(gameSession));
  return draftInputs;
}

function findTurnByUID(turnUID) {
  if (!turnUID) return null;
  return CONVERSATION_DATA.find((turn) => turn.uid === turnUID) || null;
}

function getResponseEntryForRound(round, sceneID = null) {
  const targetSceneID = sceneID ?? JSON.parse(sessionStorage.getItem('gameSession') || '{}')?.currentScene;
  for (let i = sessionData.responses.length - 1; i >= 0; i -= 1) {
    const entry = sessionData.responses[i];
    if (entry.round !== round) continue;
    if (targetSceneID == null) return entry;
    if (entry.sceneID === targetSceneID) return entry;
  }

  // backward compatibility for legacy entries stored before sceneID existed
  return sessionData.responses.find((entry) => entry.round === round && entry.sceneID === undefined) || null;
}

function buildPlayerDialogueHTMLFromSavedResponses(turnData) {
  if (!turnData?.dialogue) return '';

  let dialogueHTML = turnData.dialogue;
  if (!Array.isArray(turnData.blanks) || turnData.blanks.length === 0) {
    return dialogueHTML;
  }

  const currentSceneID = JSON.parse(sessionStorage.getItem('gameSession') || '{}')?.currentScene;
  const entry = getResponseEntryForRound(turnData.round, currentSceneID);
  const values = entry?.blanks || {};

  turnData.blanks.forEach((blankUID) => {
    const value = (values[blankUID] || '').trim() || '...';
    dialogueHTML = dialogueHTML.replace(
      `[${blankUID}]`,
      `<span class="editable-blank" data-uid="${blankUID}" data-round="${turnData.round}">[<strong>${value}</strong>]<span class="edit-icon" onclick="editBlank('${blankUID}', ${turnData.round})">✏️</span></span>`
    );
  });

  return dialogueHTML;
}

function appendStaticTurnToHistory(turnData) {
  if (!turnData) return;
  const conversationHistory = document.getElementById('conversation-history');
  if (!conversationHistory) return;

  if (turnData.narrative && turnData.narrative.trim()) {
    const narrativeEl = document.createElement('div');
    narrativeEl.className = 'narrative-box';
    narrativeEl.textContent = turnData.narrative;
    conversationHistory.appendChild(narrativeEl);
  }

  if (turnData.resource || turnData.resource_guideline) {
    const resourceBlock = createResourceBlock(turnData);
    if (resourceBlock) conversationHistory.appendChild(resourceBlock);
  }

  const isPlayer = isPlayerTurn(turnData);
  const turnClass = isPlayer ? 'dialogue-turn mira' : 'dialogue-turn kenji';
  const avatar = isPlayer ? '👨‍🍳' : '👨‍💼';
  const avatarStyle = isPlayer ? ' style="background:#E85D4D;"' : '';
  const dialogueText = isPlayer
    ? buildPlayerDialogueHTMLFromSavedResponses(turnData)
    : (turnData.dialogue || '');

  const dialogueEl = document.createElement('div');
  dialogueEl.className = turnClass;
  dialogueEl.innerHTML = `
    <div class="speaker-info">
      <div class="speaker-avatar"${avatarStyle}>${avatar}</div>
      <div>
        <div class="speaker-name">${turnData.speaker}</div>
        <div class="speaker-role">${turnData.role}</div>
      </div>
    </div>
    <div class="dialogue-bubble"><div class="dialogue-text">${dialogueText}</div></div>
  `;
  conversationHistory.appendChild(dialogueEl);
}

function rebuildConversationFromState(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  const conversationHistory = document.getElementById('conversation-history');
  if (!conversationHistory) return;

  conversationHistory.innerHTML = '';
  const completed = gameSession?.sceneRenderState?.[sceneID]?.completedTurnUIDs || [];
  completed.forEach((uid) => {
    const turnData = findTurnByUID(uid);
    appendStaticTurnToHistory(turnData);
  });

  scrollToBottom();
}

function restoreDraftInputsForCurrentTurn(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem('gameSession') || '{}');
  const drafts = gameSession?.sceneRenderState?.[sceneID]?.draftInputs || {};
  Object.entries(drafts).forEach(([blankUID, value]) => {
    const input = document.getElementById(blankUID);
    if (input) input.value = value;
  });
}

function rebuildConversationToPosition(sceneID, targetRound, targetStep) {
  const conversationHistory = document.getElementById('conversation-history');
  if (!conversationHistory || !Array.isArray(CONVERSATION_DATA)) return;

  conversationHistory.innerHTML = '';

  const rounds = [...new Set(CONVERSATION_DATA.map((turn) => turn.round))].sort((a, b) => a - b);
  rounds.forEach((roundNumber) => {
    const roundTurns = CONVERSATION_DATA.filter((turn) => turn.round === roundNumber);
    if (roundNumber < targetRound) {
      roundTurns.forEach((turn) => appendStaticTurnToHistory(turn));
      return;
    }

    if (roundNumber === targetRound) {
      for (let i = 0; i < Math.min(targetStep, roundTurns.length); i += 1) {
        appendStaticTurnToHistory(roundTurns[i]);
      }
    }
  });

  scrollToBottom();
}

function appendPendingPlayerTurnContext(turnData) {
  if (!turnData) return;

  const conversationHistory = document.getElementById('conversation-history');
  if (!conversationHistory) return;

  if (turnData.narrative && turnData.narrative.trim()) {
    const narrativeEl = document.createElement('div');
    narrativeEl.className = 'narrative-box';
    narrativeEl.textContent = turnData.narrative;
    conversationHistory.appendChild(narrativeEl);
  }

  if (turnData.resource || turnData.resource_guideline) {
    const resourceBlock = createResourceBlock(turnData);
    if (resourceBlock) conversationHistory.appendChild(resourceBlock);
  }

  scrollToBottom();
}

function displayCurrentTurn() {
  // Validate CONVERSATION_DATA exists
  if (!CONVERSATION_DATA) {
    console.error('CONVERSATION_DATA is undefined. Scene may not have loaded properly.');
    return;
  }

  const renderToken = conversationRenderToken;

  // Get all turns for the current round, then use currentStep as an index
  const roundTurns = CONVERSATION_DATA.filter(d => d.round === currentRound);
  const turnData = roundTurns[currentStep];

  if (!turnData) return;

  const conversationHistory = document.getElementById('conversation-history');

  const continueToDialogue = () => {
    if (renderToken !== conversationRenderToken) return;
    isPlayerTurn(turnData)
      ? displayPlayerResponse(turnData)
      : displayComputerDialogue(turnData, renderToken);
  };

  const appendResourceThenContinue = () => {
    if (renderToken !== conversationRenderToken) return;
    if (turnData.resource || turnData.resource_guideline) {
      const resourceBlock = createResourceBlock(turnData);
      if (resourceBlock) {
        conversationHistory.appendChild(resourceBlock);
        scrollToBottom();
      }
      setTimeout(() => {
        if (renderToken !== conversationRenderToken) return;
        continueToDialogue();
      }, 400);
      return;
    }
    continueToDialogue();
  };

  if (turnData.narrative && turnData.narrative.trim()) {
    const narrativeEl = document.createElement('div');
    narrativeEl.className = 'narrative-box';
    conversationHistory.appendChild(narrativeEl);
    typeText(narrativeEl, turnData.narrative, 15);

    const narrativeDelay = turnData.narrative.length * 15 + 500;
    setTimeout(() => {
      if (renderToken !== conversationRenderToken) return;
      appendResourceThenContinue();
    }, narrativeDelay);
    return;
  }

  appendResourceThenContinue();
}

function displayComputerDialogue(turnData, renderToken = conversationRenderToken) {
  if (renderToken !== conversationRenderToken) return;

  const conversationHistory = document.getElementById('conversation-history');

  const dialogueEl = document.createElement('div');
  dialogueEl.className = 'dialogue-turn kenji';
  dialogueEl.innerHTML = `
    <div class="speaker-info">
      <div class="speaker-avatar">👨‍💼</div>
      <div>
        <div class="speaker-name">${turnData.speaker}</div>
        <div class="speaker-role">${turnData.role}</div>
      </div>
    </div>
    <div class="dialogue-bubble">
      <div class="dialogue-text"></div>
    </div>
  `;

  conversationHistory.appendChild(dialogueEl);

  const textEl = dialogueEl.querySelector('.dialogue-text');
  typeText(textEl, turnData.dialogue, 20);

  scrollToBottom();
  document.getElementById('response-input-area').style.display = 'none';

  // Calculate base delay for dialogue completion
  const dialogueDelay = turnData.dialogue.length * 20 + 3000;

  setTimeout(() => {
    if (renderToken !== conversationRenderToken) return;
    const gs = JSON.parse(sessionStorage.getItem("gameSession") || '{}');
    markTurnCompleted(gs.currentScene, turnData.uid);
    currentStep = 1;
    displayCurrentTurn();
  }, dialogueDelay);
  
  // Ensure timer is managed correctly after computer dialogue
  manageTimerForSceneState();

}


function createResourceBlock(turnData) {
  if (!turnData.resource && !turnData.resource_guideline) {
    return null;
  }

  const resourceBlock = document.createElement('div');
  resourceBlock.className = 'resource-block';

  let resourceHTML = '';

  if (turnData.resource && turnData.resource.trim()) {
    resourceHTML += `
      <div class="resource-text">
        <span class="resource-icon">📎</span>
        ${turnData.resource}
      </div>
    `;
  }

  if (turnData.resource_guideline && turnData.resource_guideline.trim()) {
    resourceHTML += `
      <div class="resource-guideline">
        ${turnData.resource_guideline}
      </div>
    `;
  }

  resourceBlock.innerHTML = resourceHTML;
  return resourceBlock;
}


function displayPlayerResponse(turnData) {
  // === NEW: ONLY SHOW INPUT IF ON ACTUAL CURRENT SCENE ===
  if (isViewingHistoricalScene) {
    console.log('Blocking response input - viewing historical scene');
    return; // Don't display input for past scenes
  }

  isResponseInputActive = true;
  
  let dialogueHTML = turnData.dialogue;

  if (turnData.blanks) {
    turnData.blanks.forEach((blankUID) => {
      dialogueHTML = dialogueHTML.replace(
        `[${blankUID}]`,
        `<input type="text" class="blank-input" id="${blankUID}" placeholder="type here...">`
      );
    });
  }

  const inputArea = document.getElementById('current-player-input');
  inputArea.innerHTML = `
    <div class="player-input-bubble">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div class="speaker-avatar" style="background:#E85D4D;width:40px;height:40px;font-size:20px;">👨‍🍳</div>
        <div>
          <div class="speaker-name">Your Response</div>
          <div class="speaker-role">${turnData.role}</div>
        </div>
      </div>
      <div class="dialogue-text">${dialogueHTML}</div>
    </div>

    <button class="send-btn" onclick="submitResponse()">Send Response</button>
    <div id="response-timer" class="response-timer-text"></div>
  `;

  document.getElementById('response-input-area').style.display = 'block';
  if (!manualPauseState?.isPaused) {
    startResponseTimer();
  }
  scrollToBottom();
  
  // Update visibility management
  updateResponseInputAreaVisibility();
  updateResponseTimerVisibility();
  manageTimerForSceneState();
}


function submitResponse() {
  // === VALIDATION: BLOCK SUBMISSION IF VIEWING HISTORICAL SCENE ===
  if (isViewingHistoricalScene) {
    console.warn('Submission blocked: Viewing historical scene');
    const notification = document.getElementById('historical-view-notification');
    if (notification) {
      notification.style.backgroundColor = '#ffcccc';
      notification.textContent = 'Return to the current scene to continue the conversation';
    } else {
      alert('You are viewing a past scene. Return to the current scene to continue.');
    }
    return;
  }

  // VALIDATION: Check if on actual current scene
  let gameSession = JSON.parse(sessionStorage.getItem("gameSession"));

  if (gameSession?.currentScene !== actualCurrentScene) {
    console.warn('Submission blocked: Not on actual current scene');
    alert('Please return to the current scene to continue.');
    return;
  }

  // VALIDATION: Check if response input area is disabled
  const inputArea = document.getElementById('response-input-area');
  if (inputArea?.classList.contains('disabled-overlay')) {
    console.warn('Submission blocked: Input area is disabled');
    alert('Response input is currently disabled. Please return to the current scene.');
    return;
  }


  if (responseTimer) clearInterval(responseTimer);

  const currentData = CONVERSATION_DATA.find(
    (d) => d.round === currentRound && isPlayerTurn(d)
  );
  if (!currentData || !currentData.blanks) return;


  const responses = {};
  const responseDetails = {
    sceneID: gameSession?.currentScene || actualCurrentScene,
    round: currentRound,
    timestamp: getSingaporeDateTime(),
    blanks: {},
    firstSubmission: {},
  };

  currentData.blanks.forEach((blankUID) => {
    const input = document.getElementById(blankUID);
    const value = input ? input.value.trim() : '';

    responses[blankUID] = value;
    responseDetails.blanks[blankUID] = value;
    responseDetails.firstSubmission[blankUID] = value;
  });

  let completedText = currentData.dialogue;

  currentData.blanks.forEach((blankUID) => {
    const raw = responses[blankUID];
    const finalText = raw && raw.trim() !== '' ? raw : '...';

    completedText = completedText.replace(
      `[${blankUID}]`,
      `<span class="editable-blank" data-uid="${blankUID}" data-round="${currentRound}">
        [<strong>${finalText}</strong>]
        <span class="edit-icon" onclick="editBlank('${blankUID}', ${currentRound})">✏️</span>
      </span>`
    );
  });

  const conversationHistory = document.getElementById('conversation-history');
  const playerResponseEl = document.createElement('div');
  playerResponseEl.className = 'dialogue-turn mira';
  playerResponseEl.innerHTML = `
    <div class="speaker-info">
      <div class="speaker-avatar" style="background:#E85D4D;">👨‍🍳</div>
      <div>
        <div class="speaker-name">${currentData.speaker}</div>
        <div class="speaker-role">${currentData.role}</div>
      </div>
    </div>
    <div class="dialogue-bubble"><div class="dialogue-text">${completedText}</div></div>
  `;
  conversationHistory.appendChild(playerResponseEl);

  document.getElementById('response-input-area').style.display = 'none';
  isResponseInputActive = false;
  scrollToBottom();

  markTurnCompleted(gameSession?.currentScene || 1, currentData.uid);

  sessionData.responses.push(responseDetails);

  // 1) MINDSET scoring (existing)
  const roundScores = scoreRound(responses);

  // === NEW: store per-round scores for chart ===
  roundHistory[currentRound] = {
    round: currentRound,
    scores: { ...roundScores },
  };

  // keep cumulative totals unchanged
  Object.keys(roundScores).forEach(
    (mindset) => (mindsetScores[mindset] += roundScores[mindset])
  );

  // 2) NEW SCORING
  scoreWordCountAndQuestions(responseDetails.firstSubmission);

  // 3) UPDATE TOTAL SCORE
  totalScore =
    Object.values(mindsetScores).reduce((a, b) => a + b, 0) +
    wordCountScore +
    questionBonus -
    blankPenalty;

  updateScoreDisplay();

  // === Persist cumulative score to session (Non-breaking) ===
  const savedSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (savedSession) {
    savedSession.scoreState = { ...mindsetScores };
    savedSession.totalScore = totalScore;
    sessionStorage.setItem("gameSession", JSON.stringify(savedSession));
  }



  // GOOGLE SHEETS SYNC: Save round response (runs in background)
  if (typeof syncRoundResponse === 'function') {
    syncRoundResponse(currentRound, responses, roundScores, responseDetails.timestamp).catch(err => {
      console.warn('Round sync failed (game continues):', err);
    });
  }

  // === ROUND COMPLETE: SAVE CONVERSATION SNAPSHOT ===
  saveCurrentSceneConversation();
  
  currentRound++;

  gameSession = JSON.parse(sessionStorage.getItem("gameSession"));

  const sceneID = gameSession?.currentScene || 1;

  // fallback to legacy behavior if scene config missing
  const sceneEndRound =
    SCENE_END_ROUNDS[sceneID] ??
    Math.max(...CONVERSATION_DATA.map(d => d.round));

  if (currentRound <= sceneEndRound) {
    setTimeout(() => startRound(), 2000);
  } else {
    setTimeout(() => {
      if (typeof showDecisionCheckpoint === 'function') {
        showDecisionCheckpoint(sceneID);
      } else {
        showGameEnd();
      }
    }, 1500);
  }

  
}

// (everything below is unchanged)

// Timer logic
function startResponseTimer(initialSeconds = null) {
  // VALIDATION: Only start timer if on active scene
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (gameSession?.currentScene !== actualCurrentScene || isViewingHistoricalScene) {
    console.warn('Timer not started: Not on active scene');
    return;
  }

  if (typeof initialSeconds === 'number' && Number.isFinite(initialSeconds)) {
    responseSeconds = Math.max(0, Math.floor(initialSeconds));
  } else {
    responseSeconds = 120;
  }
  updateResponseTimerText();

  if (responseTimer) clearInterval(responseTimer);

  responseTimer = setInterval(() => {
    responseSeconds--;
    updateResponseTimerText();

    if (responseSeconds <= 0) {
      clearInterval(responseTimer);
      responseTimer = null;
      console.log('Timer expired, auto-submitting');
      submitResponse();
    }
  }, 1000);

  console.log('✅ Response timer started');
}


function updateResponseTimerText() {
  const el = document.getElementById('response-timer');
  if (el) el.textContent = `(${responseSeconds} seconds remaining)`;
}

// Editable blanks
function editBlank(blankUID, round) {
  const span = document.querySelector(
    `.editable-blank[data-uid="${blankUID}"][data-round="${round}"]`
  );
  if (!span) return;

  const current = span.querySelector('strong')?.textContent || '...';

  span.innerHTML = `
    <input type="text" id="edit-${blankUID}-${round}" 
           value="${current === '...' ? '' : current}" 
           style="padding:3px 6px;font-size:14px;width:160px;">
    <button onclick="saveBlank('${blankUID}', ${round})"
            style="margin-left:6px;padding:2px 8px;font-size:12px;">Save</button>
  `;
}

function saveBlank(blankUID, round) {
  const input = document.getElementById(`edit-${blankUID}-${round}`);
  const newValue = input.value.trim() !== '' ? input.value.trim() : '...';

  const currentSceneID = JSON.parse(sessionStorage.getItem('gameSession') || '{}')?.currentScene;
  const entry = getResponseEntryForRound(round, currentSceneID);
  if (entry) entry.blanks[blankUID] = newValue;

  const span = document.querySelector(
    `.editable-blank[data-uid="${blankUID}"][data-round="${round}"]`
  );
  span.innerHTML = `
    [<strong>${newValue}</strong>]
    <span class="edit-icon" onclick="editBlank('${blankUID}', ${round})">✏️</span>
  `;
}

// NEW scoring
function scoreWordCountAndQuestions(firstSubmission) {
  Object.keys(firstSubmission).forEach((blankUID) => {
    const text = firstSubmission[blankUID].trim();

    if (text === '') {
      blankPenalty += 3;
      return;
    }

    const words = text.split(/\s+/).filter(Boolean);
    wordCountScore += words.length;

    const qMarks = (text.match(/\?/g) || []).length;
    questionBonus += qMarks * 3;
  });
}

// Mindset scoring
function scoreRound(responses) {
  const scores = {
    systemsThinker: 0,
    resourceCraftsman: 0,
    calmStrategist: 0,
    valueHunter: 0,
    experimenter: 0,
  };

  Object.keys(responses).forEach((blankUID) => {
    const playerInput = responses[blankUID].toLowerCase();
    const wordCount = playerInput.split(/\s+/).length;

    ANSWER_KEY_DATA.filter((ak) => ak.blankUID === blankUID).forEach(
      (answerKey) => {
        let matchCount = 0;

        answerKey.keywords.forEach((keyword) => {
          if (playerInput.includes(keyword.toLowerCase())) matchCount++;
        });

        if (matchCount >= 1) {
          Object.keys(answerKey.scoring).forEach((mindset) => {
            scores[mindset] += answerKey.scoring[mindset];
          });
        }        
      }
    );
  });

  return scores;
}

function updateScoreDisplay() {
  document.getElementById('total-score').textContent = Math.round(totalScore);
  updateChart();
}

function typeText(element, text, speed = 30) {
  let i = 0;
  element.innerHTML = '';
  (function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i++);
      setTimeout(typing, speed);
    }
  })();
}

function scrollToBottom() {
  const container = document.getElementById('conversation-history');
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 100);
}

function showStoryline() {
  try {
    const storyData = window.STORY_DATA;

    if (!storyData || storyData.length === 0) {
      console.error('No story data found');
      return;
    }

    const businessUID = storyData[0]['Business UID'] || 'Story';
    const chapterMap = {};

    storyData.forEach(item => {
      const chapterName = item.Chapter;
      if (!chapterMap[chapterName]) {
        chapterMap[chapterName] = [];
      }
      chapterMap[chapterName].push(item);
    });

    document.getElementById('story-modal-title').textContent = businessUID;

    const storyContentArea = document.getElementById('story-content-area');
    storyContentArea.innerHTML = '';

    Object.keys(chapterMap).forEach((chapterName, index) => {
      const chapterDiv = document.createElement('div');
      chapterDiv.className = 'story-chapter';

      const chapterHeader = document.createElement('div');
      chapterHeader.className = 'story-chapter-header';
      chapterHeader.onclick = () => toggleChapter(index);
      chapterHeader.innerHTML = `
        <span class="chapter-arrow" id="chapter-arrow-${index}">▶</span>
        <span class="chapter-title">${chapterName}</span>
      `;

      const chapterBody = document.createElement('div');
      chapterBody.className = 'story-chapter-body hidden';
      chapterBody.id = `chapter-body-${index}`;

      const items = chapterMap[chapterName];
      items.forEach(item => {
        if (item.Header && item.Header.trim()) {
          const headerEl = document.createElement('div');
          headerEl.className = 'story-item-header';
          headerEl.textContent = item.Header;
          chapterBody.appendChild(headerEl);
        }

        if (item.Text && item.Text.trim()) {
          const textEl = document.createElement('div');
          textEl.className = 'story-item-text';
          textEl.textContent = item.Text;
          chapterBody.appendChild(textEl);
        }
      });

      chapterDiv.appendChild(chapterHeader);
      chapterDiv.appendChild(chapterBody);
      storyContentArea.appendChild(chapterDiv);
    });

    renderComments();

    document.getElementById('story-modal').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading story:', error);
  }
}

function toggleChapter(index) {
  const chapterBody = document.getElementById(`chapter-body-${index}`);
  const arrow = document.getElementById(`chapter-arrow-${index}`);

  if (currentExpandedChapter !== null && currentExpandedChapter !== index) {
    const prevBody = document.getElementById(`chapter-body-${currentExpandedChapter}`);
    const prevArrow = document.getElementById(`chapter-arrow-${currentExpandedChapter}`);
    if (prevBody) prevBody.classList.add('hidden');
    if (prevArrow) prevArrow.textContent = '▶';
  }

  if (chapterBody.classList.contains('hidden')) {
    chapterBody.classList.remove('hidden');
    arrow.textContent = '▼';
    currentExpandedChapter = index;
  } else {
    chapterBody.classList.add('hidden');
    arrow.textContent = '▶';
    currentExpandedChapter = null;
  }
}

function sendComment() {
  const input = document.getElementById('comment-input');
  const commentText = input.value.trim();

  if (commentText === '') return;

  const timestamp = getSingaporeDateTime();

  storyComments.push({
    text: commentText,
    timestamp: timestamp
  });

  input.value = '';
  renderComments();

  // GOOGLE SHEETS SYNC: Save story comment (runs in background)
  if (typeof syncStoryComments === 'function') {
    const playerCode = sessionData.playerCode || 'UNKNOWN';
    syncStoryComments(playerCode, commentText, timestamp).catch(err => {
      console.warn('Story comment sync failed (game continues):', err);
    });
  }
}

function renderComments() {
  const commentsDisplay = document.getElementById('comments-display');
  commentsDisplay.innerHTML = '';

  storyComments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.innerHTML = `
      <div class="comment-time">${comment.timestamp}</div>
      <div class="comment-text">${comment.text}</div>
    `;
    commentsDisplay.appendChild(commentDiv);
  });

  commentsDisplay.scrollTop = commentsDisplay.scrollHeight;
}

function closeStoryModal() {
  document.getElementById('story-modal').classList.add('hidden');
}

function showRoles() {
  try {
    const rolesData = window.ROLES_DATA;

    if (!rolesData || rolesData.length === 0) {
      console.error('No roles data found');
      return;
    }

    document.getElementById('modal-title').textContent = 'All Roles';

    let rolesHTML = '';

    rolesData.forEach(role => {
      const responsibilities = role.RESPONSIBILITIES
        .split('\n\n')
        .filter(line => line.trim())
        .join(', ');

      const mindsetsTested = [
        role.Mindset_Tested_1,
        role.Mindset_Tested_2,
        role.Mindset_Tested_3,
        role.Mindset_Tested_4,
        role.Mindset_Tested_5
      ]
        .filter(mindset => mindset && mindset.trim())
        .join(', ');

      const detailsText = mindsetsTested
        ? `${responsibilities}. Mindset Tested: ${mindsetsTested}`
        : responsibilities;

      rolesHTML += `
        <div style="margin-bottom: 12px; padding: 10px; background: rgba(255, 255, 255, 0.5); border-radius: 6px; border-left: 3px solid #8ba89c;">
          <div style="font-size: 13px; color: #2c3e3c; margin-bottom: 4px;">
            <strong>${role['# Number']} — ${role.ROLES} (${role.NAME})</strong>
          </div>
          <div style="font-size: 12px; color: #6b7c78; line-height: 1.4;">${detailsText}</div>
        </div>
      `;
    });

    document.getElementById('modal-body').innerHTML = rolesHTML;
    document.getElementById('modal').classList.remove('hidden');
  } catch (error) {
    console.error('Error loading roles:', error);
  }
}

function showHint() {
  document.getElementById('modal-title').textContent = 'Hint';
  document.getElementById(
    'modal-body'
    ).innerHTML = `
    <p class="modal-text">
      <strong>Total Score</strong>: Earn more by 
      <br>+ Engage (Fill in all blanks with details within Time allowance)
      <br>+ Type in your thought & questions as well
      <br>+ Demonstrated the right mindset at the right time
      <br>
      <strong>Note</strong>: Each speaking round or scene tests a different mindset to varying degrees.
    </p>
    `;    
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function showGameEnd() {
  sessionData.finalScores = {
    total: Math.round(totalScore),
    systemsThinker: Math.round(mindsetScores.systemsThinker),
    resourceCraftsman: Math.round(mindsetScores.resourceCraftsman),
    calmStrategist: Math.round(mindsetScores.calmStrategist),
    valueHunter: Math.round(mindsetScores.valueHunter),
    experimenter: Math.round(mindsetScores.experimenter),
    wordCountScore,
    questionBonus,
    blankPenalty,
  };

  sessionData.endDateTime = getSingaporeDateTime();
  exportSessionData();

  // GOOGLE SHEETS SYNC: Save final scores (runs in background)
  if (typeof syncFinalScores === 'function') {
    syncFinalScores(sessionData.playerCode, sessionData.finalScores, sessionData.endDateTime).catch(err => {
      console.warn('Final scores sync failed (game continues):', err);
    });
  }

  document.getElementById('modal-title').textContent = 'Complete!';
  document.getElementById('modal-body').innerHTML = `
    <p class="modal-text"><strong>Score: ${Math.round(totalScore)}</strong></p>
    <div class="success-box"><p>✅ Data downloaded!</p></div>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function exportSessionData() {
  const exportData = {
    ...sessionData,
    storyComments: storyComments
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `session_${sessionData.playerCode}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function showDecisionCheckpoint(sceneID) {
  try {
    console.log('DEBUG: showDecisionCheckpoint called with sceneID:', sceneID);
    
    const decisions = getDecisionTreeForActivePair();
    console.log('DEBUG: Decisions loaded:', decisions);
    
    const scene = decisions[`scene${sceneID}`];
    if (!scene) {
      console.error(`Scene ${sceneID} not found in decisions data`);
      showGameEnd();
      return;
    }

    console.log('DEBUG: Scene data found:', scene);

    document.getElementById("decision-question").innerText =
      scene.decisionCheckpoint.question;

    const optionsContainer = document.getElementById("decision-options");
    optionsContainer.innerHTML = "";

    scene.decisionCheckpoint.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "modal-btn decision-option-btn";
      btn.innerText = `${opt.optionLabel}: ${opt.optionText}`;
      btn.onclick = () => handleDecision(sceneID, opt);
      optionsContainer.appendChild(btn);
      console.log('DEBUG: Option button created:', index + 1, opt.optionLabel);
    });

    document.getElementById("decision-checkpoint-modal").classList.remove("hidden");
    console.log('DEBUG: Decision checkpoint modal displayed');
  } catch (error) {
    console.error('ERROR in showDecisionCheckpoint:', error);
    alert(`Error loading decision checkpoint: ${error.message}`);
    showGameEnd();
  }
}



function handleDecision(sceneID, option) {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  gameSession.playerDecisions[`scene${sceneID}`] = option.optionID;
  
  // STORE THE DECISION FOR BARRIER
  gameSession.sceneDecisions = gameSession.sceneDecisions || {};
  gameSession.sceneDecisions[sceneID] = {
    question: getDecisionTreeForActivePair()[`scene${sceneID}`].decisionCheckpoint.question,
    selectedOption: option
  };
  
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  document.getElementById("decision-checkpoint-modal").classList.add("hidden");

  if (option.outcome === "END_GAME") {
    showGameEnd();
  } else {
    loadScene(option.outcome);
  }
}


// === NEW: LOAD AND DISPLAY DECISION CHECKPOINT BARRIER ===
function loadDecisionCheckpointBarrier(sceneID) {
  try {
    console.log('DEBUG: Loading decision checkpoint barrier for scene:', sceneID);
    
    const decisions = getDecisionTreeForActivePair();
    if (!decisions) {
      console.error('SCENE_DECISIONS not loaded');
      return;
    }

    const scene = decisions[`scene${sceneID}`];
    if (!scene || !scene.decisionCheckpoint) {
      console.log(`No decision checkpoint for scene ${sceneID}`);
      return;
    }

    // Check if player has already made this decision
    const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
    const playerDecision = gameSession?.playerDecisions?.[`scene${sceneID}`];

    if (!playerDecision) {
      const isHistorical = sceneID !== actualCurrentScene;
      const message = `No decision made for scene ${sceneID} yet`;
      if (isHistorical) {
        console.error(`Invariant violation: ${message}`);
      } else {
        console.log(message);
      }
      return;
    }

    // Find the selected option
    const selectedOption = scene.decisionCheckpoint.options.find(
      opt => opt.optionID === playerDecision
    );

    if (!selectedOption) {
      console.error('Selected option not found');
      return;
    }

    console.log('DEBUG: Creating read-only decision checkpoint barrier');

    // Create a read-only barrier as inline text block
    const barrierHTML = `
      <div id="checkpoint-barrier-overlay" style="margin: 30px 0 0 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #8ba89c; border-radius: 4px;">
        <div style="font-size: 12px; color: #999; margin-bottom: 8px;">Scene ${sceneID} - Decision Checkpoint</div>
        <div style="font-size: 13px; color: #2c3e3c; margin-bottom: 6px;">
          <strong>Question:</strong> ${scene.decisionCheckpoint.question}
        </div>
        <div style="font-size: 14px; color: #2c3e3c; font-weight: 500;">
          <strong>Selected:</strong> ${selectedOption.optionLabel}: ${selectedOption.optionText}
        </div>
      </div>
    `;


    // Check if barrier already exists and remove it
    const existingBarrier = document.getElementById('checkpoint-barrier-overlay');
    if (existingBarrier) {
      existingBarrier.remove();
    }

    // Inject barrier into conversation history area
    const conversationHistory = document.getElementById('conversation-history');
    if (conversationHistory) {
      conversationHistory.insertAdjacentHTML('beforeend', barrierHTML);
      console.log('✅ Decision checkpoint barrier displayed');
    }

  } catch (error) {
    console.error('ERROR in loadDecisionCheckpointBarrier:', error);
  }
}

window.loadDecisionCheckpointBarrier = loadDecisionCheckpointBarrier;


// ============================================
// SCENE NAVIGATION & CONVERSATION HISTORY
// ============================================

function getCurrentSceneHistoryIndex(gameSession) {
  const history = gameSession?.sceneHistory;
  if (!Array.isArray(history) || history.length === 0) return -1;

  const storedIndex = gameSession?.currentSceneHistoryIndex;
  if (Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < history.length) {
    return storedIndex;
  }

  return history.lastIndexOf(gameSession.currentScene);
}

function updateSceneTitle() {
  const sceneTitle = window.SCENE_META?.sceneTitle || 'THE CONVERSATION';
  const titleElement = document.getElementById('scene-title');
  if (titleElement) {
    titleElement.textContent = sceneTitle;
  }
}

function saveCurrentSceneConversation() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) return;

  const conversationHistory = document.getElementById('conversation-history');
  const conversationHTML = conversationHistory.innerHTML;

  if (!gameSession.conversationHistory) {
    gameSession.conversationHistory = {};
  }

  gameSession.conversationHistory[gameSession.currentScene] = conversationHTML;
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
  
  console.log(`✅ Saved conversation history for scene ${gameSession.currentScene}`);
}

function loadSceneConversation(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  
  const conversationHistory = document.getElementById('conversation-history');
  
  if (gameSession.conversationHistory && Object.prototype.hasOwnProperty.call(gameSession.conversationHistory, sceneID)) {
    ensureSceneRenderState(sceneID);
    conversationHistory.innerHTML = gameSession.conversationHistory[sceneID] || '';
    
    // AFTER LOADING CONVERSATION, CHECK IF DECISION CHECKPOINT BARRIER SHOULD BE SHOWN
    setTimeout(() => {
      loadDecisionCheckpointBarrier(sceneID);
    }, 100);
    
    return true;
  }
  
  return false;
}



function navigatePreviousScene() {
  // Validate state before navigation
  const stateCheck = validateGameState();
  if (stateCheck.warnings.length > 0) {
    console.warn('State warnings before navigation:', stateCheck.warnings);
  }

  console.log('=== NAVIGATING PREVIOUS SCENE ===');
  
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) {
    console.warn('Game session not found');
    return;
  }

  // VALIDATION: Check scene history
  if (!gameSession.sceneHistory || !Array.isArray(gameSession.sceneHistory) || gameSession.sceneHistory.length === 0) {
    console.warn('Scene history not available');
    return;
  }

  // Find current position in scene history
  const currentSceneInHistory = getCurrentSceneHistoryIndex(gameSession);
  
  // Check if we can go to previous scene
  if (currentSceneInHistory <= 0) {
    console.warn('No previous scene available');
    return;
  }

  // Get the previous scene from history array
  const previousSceneIndex = currentSceneInHistory - 1;
  const previousScene = gameSession.sceneHistory[previousSceneIndex];

  // Verify previous scene conversation exists
  if (!gameSession.conversationHistory || !Object.prototype.hasOwnProperty.call(gameSession.conversationHistory, previousScene)) {
    console.warn(`Conversation history for scene ${previousScene} not found`);
    console.warn(`Auto-recover: loading Scene ${previousScene} from start.`);
    loadScene(previousScene);
    return;
  }

  // STEP 1: PAUSE IF LEAVING ACTUAL CURRENT SCENE
  if (gameSession.currentScene === actualCurrentScene) {
    console.log('Pausing active conversation before navigation');
    pauseActiveConversation();
  }

  // STEP 2: SAVE CURRENT SCENE CONVERSATION
  saveCurrentSceneConversation();
  bumpConversationRenderToken();

  // STEP 3: LOAD PREVIOUS SCENE CONVERSATION
  const loaded = loadSceneConversation(previousScene);
  if (!loaded) {
    console.log('Conversation not in history, loading fresh');
    loadScene(previousScene);
    return;
  }

  // STEP 4: DETERMINE IF VIEWING HISTORICAL SCENE
  isViewingHistoricalScene = (previousScene !== actualCurrentScene);
  console.log(`isViewingHistoricalScene set to: ${isViewingHistoricalScene}`);

  // STEP 5: DISABLE INPUT FOR HISTORICAL VIEW (NO HISTORICAL BANNER)
  if (isViewingHistoricalScene) {
    hideHistoricalViewBanner();
    const inputArea = document.getElementById('response-input-area');
    if (inputArea) {
      inputArea.style.display = 'none';
      inputArea.classList.add('disabled-overlay');
    }
  } else {
    hideHistoricalViewBanner();
  }

  // STEP 6: UPDATE SESSION STATE
  gameSession.currentScene = previousScene;
  gameSession.currentSceneHistoryIndex = previousSceneIndex;
  gameSession.isViewingHistoricalScene = isViewingHistoricalScene;
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
  syncGlobalStateToSession();
  applyManualPauseUI();


  // STEP 7: UPDATE SCENE METADATA
  if (gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[previousScene]) {
    window.SCENE_META = gameSession.sceneMetaHistory[previousScene];
  }

  // STEP 8: UPDATE UI TITLE
  const previousSceneTitle = gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[previousScene]
    ? gameSession.sceneMetaHistory[previousScene].sceneTitle
    : `Scene ${previousScene}`;

  const titleElement = document.getElementById('scene-title');
  if (titleElement) {
    titleElement.textContent = previousSceneTitle;
  }

  console.log(`Navigated to previous scene: ${previousScene}, isHistorical: ${isViewingHistoricalScene}`);
  console.log('=== PREVIOUS SCENE NAVIGATION COMPLETE ===');
}




function navigateNextScene() {
  // Validate state before navigation
  const stateCheck = validateGameState();
  if (stateCheck.warnings.length > 0) {
    console.warn('State warnings before navigation:', stateCheck.warnings);
  }

  console.log('=== NAVIGATING NEXT SCENE ===');
  
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) {
    console.warn('Game session not found');
    return;
  }

  // VALIDATION: Check scene history
  if (!gameSession.sceneHistory || !Array.isArray(gameSession.sceneHistory) || gameSession.sceneHistory.length === 0) {
    console.warn('Scene history not available');
    return;
  }

  // Find current position in scene history
  const currentSceneInHistory = getCurrentSceneHistoryIndex(gameSession);
  
  // Check if we can go to next scene
  if (currentSceneInHistory < 0 || currentSceneInHistory >= gameSession.sceneHistory.length - 1) {
    console.warn('No next scene available');
    return;
  }

  // Get the next scene from history array
  const nextSceneIndex = currentSceneInHistory + 1;
  const nextScene = gameSession.sceneHistory[nextSceneIndex];

  // Verify next scene conversation exists
  if (!gameSession.conversationHistory || !Object.prototype.hasOwnProperty.call(gameSession.conversationHistory, nextScene)) {
    console.warn(`Conversation history for scene ${nextScene} not found`);
    console.warn(`Auto-recover: loading Scene ${nextScene} from start.`);
    loadScene(nextScene);
    return;
  }

  // STEP 1: PAUSE IF LEAVING ACTUAL CURRENT SCENE
  if (gameSession.currentScene === actualCurrentScene) {
    console.log('Pausing active conversation before navigation');
    pauseActiveConversation();
  }

  // STEP 2: SAVE CURRENT SCENE CONVERSATION
  saveCurrentSceneConversation();
  bumpConversationRenderToken();

  // STEP 3: LOAD NEXT SCENE CONVERSATION
  const loaded = loadSceneConversation(nextScene);
  if (!loaded) {
    console.log('Conversation not in history, loading fresh');
    loadScene(nextScene);
    return;
  }

  // STEP 4: DETERMINE IF RETURNING TO ACTUAL CURRENT SCENE
  if (nextScene === actualCurrentScene) {
    console.log('Returning to actual current scene in paused mode, waiting for Play');
    isViewingHistoricalScene = false;
    actualCurrentScene = nextScene;
    window.actualCurrentScene = actualCurrentScene;

    gameSession.currentScene = nextScene;
    gameSession.currentSceneHistoryIndex = nextSceneIndex;
    gameSession.isViewingHistoricalScene = false;

    ensureNavigationPauseState();
    hideHistoricalViewBanner();

    const pausedState = gameSession.pausedConversationState || pausedConversationState;
    if (pausedState) {
      currentRound = pausedState.currentRound;
      currentStep = pausedState.currentStep;
      responseSeconds = pausedState.responseSeconds;
      const activeTurn = getTurnAtState(currentRound, currentStep);
      isResponseInputActive = isPlayerTurn(activeTurn);
    }

    sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
    syncSessionStateToGlobal();

    rebuildConversationToPosition(nextScene, currentRound, currentStep);

    const activeTurn = getTurnAtState(currentRound, currentStep);
    if (activeTurn && isPlayerTurn(activeTurn)) {
      appendPendingPlayerTurnContext(activeTurn);
      displayPlayerResponse(activeTurn);
      restoreDraftInputsForCurrentTurn(nextScene);
      updateResponseInputAreaVisibility();
    } else {
      const inputRoot = document.getElementById('current-player-input');
      if (inputRoot) inputRoot.innerHTML = '';
      updateResponseInputAreaVisibility();
    }

    applyManualPauseUI();
  } else {
    console.log('Navigating to another historical scene');
    isViewingHistoricalScene = true;
    hideHistoricalViewBanner();

    const inputArea = document.getElementById('response-input-area');
    if (inputArea) {
      inputArea.style.display = 'none';
      inputArea.classList.add('disabled-overlay');
    }

    applyManualPauseUI();
  }

  // STEP 5: UPDATE SESSION STATE
  gameSession.currentScene = nextScene;
  gameSession.currentSceneHistoryIndex = nextSceneIndex;
  gameSession.isViewingHistoricalScene = isViewingHistoricalScene;
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
  syncGlobalStateToSession();


  // STEP 6: UPDATE SCENE METADATA
  if (gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[nextScene]) {
    window.SCENE_META = gameSession.sceneMetaHistory[nextScene];
  }

  // STEP 7: UPDATE UI TITLE
  const nextSceneTitle = gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[nextScene]
    ? gameSession.sceneMetaHistory[nextScene].sceneTitle
    : `Scene ${nextScene}`;

  const titleElement = document.getElementById('scene-title');
  if (titleElement) {
    titleElement.textContent = nextSceneTitle;
  }

  console.log(`Navigated to next scene: ${nextScene}, isHistorical: ${isViewingHistoricalScene}`);
  console.log('=== NEXT SCENE NAVIGATION COMPLETE ===');
}



// === NEW: PAUSE/RESUME CONVERSATION FUNCTIONS ===

function updatePausePlayButtonState() {
  const button = document.getElementById('pause-play-btn');
  if (!button) return;

  const isPaused = manualPauseState?.isPaused;
  button.disabled = isViewingHistoricalScene;
  button.classList.toggle('is-paused', Boolean(isPaused));
  button.setAttribute('aria-pressed', String(Boolean(isPaused)));

  if (isPaused) {
    button.textContent = '▶ Play';
  } else {
    button.textContent = '⏸ Pause';
  }
}

function applyManualPauseUI() {
  const inputArea = document.getElementById('response-input-area');
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession") || '{}');
  const isPaused = manualPauseState?.isPaused;
  const shouldShowPauseOverlay = Boolean(
    isPaused &&
    gameSession?.currentScene === actualCurrentScene &&
    !isViewingHistoricalScene
  );

  if (inputArea) {
    inputArea.classList.toggle('manual-paused', Boolean(isPaused));

    if (shouldShowPauseOverlay) {
      inputArea.style.display = 'block';
      inputArea.classList.add('disabled-overlay');
    } else if (!isResponseInputActive) {
      inputArea.classList.remove('disabled-overlay');
    }
  }

  updatePausePlayButtonState();
  updateResponseTimerVisibility();
}

function pauseManually() {
  if (isViewingHistoricalScene) {
    console.warn('Manual pause blocked: viewing historical scene');
    return;
  }

  console.log('=== MANUAL PAUSE ===');

  if (responseTimer) {
    clearInterval(responseTimer);
    responseTimer = null;
  }

  manualPauseState = {
    isPaused: true,
    pausedAt: getSingaporeDateTime(),
    remainingSeconds: responseSeconds
  };

  window.manualPauseState = manualPauseState;
  applyManualPauseUI();
  syncGlobalStateToSession();
}

function resumeManualPause() {
  console.log('=== MANUAL RESUME ===');

  const remainingSeconds = manualPauseState?.remainingSeconds;
  manualPauseState = {
    isPaused: false,
    pausedAt: null,
    remainingSeconds: remainingSeconds ?? responseSeconds
  };

  window.manualPauseState = manualPauseState;

  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));

  if (gameSession?.pausedConversationState) {
    resumeActiveConversation();
    return;
  }

  applyManualPauseUI();

  const shouldResumeTimer = (gameSession?.currentScene === actualCurrentScene) &&
    !isViewingHistoricalScene &&
    isResponseInputActive &&
    typeof remainingSeconds === 'number';

  if (shouldResumeTimer) {
    startResponseTimer(remainingSeconds);
  }

  syncGlobalStateToSession();
}

function toggleManualPause() {
  if (manualPauseState?.isPaused) {
    resumeManualPause();
  } else {
    pauseManually();
  }
}

function pauseActiveConversation() {
  console.log('=== PAUSING CONVERSATION ===');
  const wasTimerActive = responseTimer !== null;

  // 1) STOP THE RESPONSE TIMER
  if (responseTimer) {
    clearInterval(responseTimer);
    responseTimer = null;
    console.log('✅ Timer cleared');
  }

  // 2) STORE THE PAUSED STATE
  pausedConversationState = {
    currentRound: currentRound,
    currentStep: currentStep,
    responseSeconds: responseSeconds,
    isTimerActive: wasTimerActive
  };
  console.log('✅ Paused state stored:', pausedConversationState);

  // 3) HIDE AND DISABLE THE RESPONSE INPUT AREA
  const inputArea = document.getElementById('response-input-area');
  if (inputArea) {
    inputArea.style.display = 'none';
    inputArea.classList.add('disabled-overlay');
    console.log('✅ Response input area hidden and disabled');
  }

  // 4) PRESERVE CURRENT PLAYER INPUT CONTENT
  // Keep any in-progress typed draft when navigating away so returning + Play can resume
  // the same waiting-for-player state instead of silently auto-submitting empty blanks.
  const currentSession = JSON.parse(sessionStorage.getItem("gameSession") || '{}');
  if (currentSession?.currentScene !== undefined) {
    const draftInputs = saveDraftInputsForScene(currentSession.currentScene);
    if (pausedConversationState) {
      pausedConversationState.draftInputs = draftInputs;
    }
  }

  // 5) KEEP TURN OWNERSHIP STATE FOR RESUME
  const activeTurn = getTurnAtState(currentRound, currentStep);
  isResponseInputActive = isPlayerTurn(activeTurn);

  // 6) ALIGN AUTO-PAUSE WITH MANUAL PAUSE UX
  // Navigation pause always requires explicit Play to continue.
  ensureNavigationPauseState();
  console.log('✅ Navigation pause converted to manual-style paused state');

  // 7) PERSIST PAUSED STATE TO SESSION
  bumpConversationRenderToken();
  syncGlobalStateToSession();
  
  console.log(`✅ Conversation paused at Round ${currentRound}, Step ${currentStep}`);
  console.log('=== PAUSE COMPLETE ===');
}


function resumeActiveConversation() {
  console.log('=== RESUMING CONVERSATION ===');

  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  let state = null;

  if (gameSession && gameSession.pausedConversationState) {
    state = gameSession.pausedConversationState;
    currentRound = state.currentRound;
    currentStep = state.currentStep;
    responseSeconds = state.responseSeconds;

    const activeTurn = getTurnAtState(currentRound, currentStep);
    isResponseInputActive = isPlayerTurn(activeTurn);
    console.log(`✅ Restored Round ${currentRound}, Step ${currentStep}`);
  }

  pausedConversationState = null;
  console.log('✅ Paused state cleared');

  isViewingHistoricalScene = false;
  console.log('✅ Historical view flag reset');

  const activeTurn = getTurnAtState(currentRound, currentStep);
  const activePlayerTurn = isPlayerTurn(activeTurn);
  isResponseInputActive = activePlayerTurn;

  // Continue pipeline for computer turns; keep player turns waiting for input.
  if (activeTurn && !activePlayerTurn) {
    console.log('⏯ Resuming from computer turn, continuing pipeline');
    bumpConversationRenderToken();
    displayCurrentTurn();
  } else {
    updateResponseInputAreaVisibility();
    console.log('✅ Response input area visibility refreshed');
  }

  if (state && state.isTimerActive && !manualPauseState?.isPaused && activePlayerTurn) {
    startResponseTimer(state.responseSeconds);
    console.log('✅ Timer restarted');
  }

  syncGlobalStateToSession();
  applyManualPauseUI();

  console.log(`✅ Conversation resumed at Round ${currentRound}, Step ${currentStep}`);
  console.log('=== RESUME COMPLETE ===');

  const validation = validateGameState();
  if (validation.warnings.length > 0) {
    console.warn('State warnings after resume:', validation.warnings);
    autoFixGameState();
  }
}


function isOnActualCurrentScene() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  return gameSession && gameSession.currentScene === actualCurrentScene;
}

function showHistoricalViewBanner() {
  // Historical banner is deprecated for navigation flow. Keep hidden.
  const banner = document.getElementById('historical-view-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
  updatePausePlayButtonState();
  console.log('Historical view banner suppressed (deprecated)');
}

function hideHistoricalViewBanner() {
  const banner = document.getElementById('historical-view-banner');
  const inputArea = document.getElementById('response-input-area');
  
  if (banner) {
    banner.classList.add('hidden');
  }
  
  if (inputArea) {
    inputArea.classList.remove('disabled-overlay');
  }
  
  updatePausePlayButtonState();
  console.log('Historical view banner hidden');
}



window.updateSceneTitle = updateSceneTitle;
window.navigatePreviousScene = navigatePreviousScene;
window.navigateNextScene = navigateNextScene;
window.saveCurrentSceneConversation = saveCurrentSceneConversation;
window.loadSceneConversation = loadSceneConversation;


window.showDecisionCheckpoint = showDecisionCheckpoint;
// === NEW: EXPOSE CONVERSATION STATE & FUNCTIONS TO WINDOW ===
window.pauseActiveConversation = pauseActiveConversation;
window.resumeActiveConversation = resumeActiveConversation;
window.isOnActualCurrentScene = isOnActualCurrentScene;
window.showHistoricalViewBanner = showHistoricalViewBanner;
window.hideHistoricalViewBanner = hideHistoricalViewBanner;
window.toggleManualPause = toggleManualPause;
window.updatePausePlayButtonState = updatePausePlayButtonState;
window.applyManualPauseUI = applyManualPauseUI;

// === NEW: DEBUG FUNCTION (optional - for troubleshooting) ===
function debugConversationState() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  console.log('=== CONVERSATION STATE DEBUG ===');
  console.log('actualCurrentScene:', actualCurrentScene);
  console.log('isViewingHistoricalScene:', isViewingHistoricalScene);
  console.log('currentRound:', currentRound);
  console.log('currentStep:', currentStep);
  console.log('gameSession.currentScene:', gameSession?.currentScene);
  console.log('pausedConversationState:', pausedConversationState);
  console.log('responseTimer:', responseTimer);
  console.log('==============================');
}

// === NEW: CENTRALIZED RESPONSE INPUT AREA MANAGEMENT ===

function updateResponseInputAreaVisibility() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  const inputArea = document.getElementById('response-input-area');
  
  if (!inputArea) return;

  // SHOW ONLY IF: on actual current scene AND not viewing historical scene
  const shouldShow = (gameSession?.currentScene === actualCurrentScene) && 
                     !isViewingHistoricalScene &&
                     isResponseInputActive && 
                     gameSession?.currentScene !== undefined;

  if (shouldShow) {
    inputArea.style.display = 'block';
    inputArea.classList.remove('disabled-overlay');
    if (manualPauseState?.isPaused) {
      inputArea.classList.add('manual-paused');
    } else {
      inputArea.classList.remove('manual-paused');
    }
    console.log('✅ Response input area ENABLED');
  } else {
    inputArea.style.display = 'none';
    inputArea.classList.add('disabled-overlay');
    inputArea.classList.remove('manual-paused');
    console.log('✅ Response input area DISABLED');
  }
  
  updatePausePlayButtonState();
}

function updateResponseTimerVisibility() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  const timerElement = document.getElementById('response-timer');
  
  if (!timerElement) return;

  // SHOW ONLY IF: on actual current scene AND not viewing historical scene
  const shouldShow = (gameSession?.currentScene === actualCurrentScene) && 
                      !isViewingHistoricalScene &&
                      isResponseInputActive &&
                      !manualPauseState?.isPaused &&
                     gameSession?.currentScene !== undefined;

  if (shouldShow) {
    timerElement.style.display = 'inline';
    console.log('✅ Response timer VISIBLE');
  } else {
    timerElement.style.display = 'none';
    console.log('✅ Response timer HIDDEN');
  }
}

function manageTimerForSceneState() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  const isOnActiveScene = (gameSession?.currentScene === actualCurrentScene) && 
                          !isViewingHistoricalScene &&
                          !manualPauseState?.isPaused;

  if (isOnActiveScene) {
    // Timer should run - ensure it's active
    if (!responseTimer) {
      console.log('Starting timer for active scene');
      startResponseTimer();
    }
  } else {
    // Timer should NOT run - pause it
    if (responseTimer) {
      clearInterval(responseTimer);
      responseTimer = null;
      console.log('Stopping timer for non-active scene');
    }
  }
}

// === NEW: COMPREHENSIVE STATE VALIDATION ===


function enforceSceneProgressionInvariant(gameSession) {
  if (!gameSession || !Array.isArray(gameSession.sceneHistory) || gameSession.sceneHistory.length === 0) {
    return { corrected: false, notes: [] };
  }

  const notes = [];
  let corrected = false;
  const lastHistoricalScene = gameSession.sceneHistory[gameSession.sceneHistory.length - 1];

  if (gameSession.actualCurrentScene !== lastHistoricalScene) {
    notes.push(`actualCurrentScene corrected ${gameSession.actualCurrentScene} -> ${lastHistoricalScene}`);
    gameSession.actualCurrentScene = lastHistoricalScene;
    actualCurrentScene = lastHistoricalScene;
    window.actualCurrentScene = actualCurrentScene;
    corrected = true;
  }

  if (gameSession.currentScene === gameSession.actualCurrentScene) {
    if (gameSession.isViewingHistoricalScene) {
      gameSession.isViewingHistoricalScene = false;
      isViewingHistoricalScene = false;
      window.isViewingHistoricalScene = false;
      notes.push('isViewingHistoricalScene reset to false on active scene');
      corrected = true;
    }
  } else if (!gameSession.isViewingHistoricalScene) {
    gameSession.isViewingHistoricalScene = true;
    isViewingHistoricalScene = true;
    window.isViewingHistoricalScene = true;
    notes.push('isViewingHistoricalScene corrected to true on historical scene');
    corrected = true;
  }

  const decisions = getDecisionTreeForActivePair() || {};
  const sceneDecisions = gameSession.playerDecisions || {};
  const historicalScenes = gameSession.sceneHistory.slice(0, -1);
  historicalScenes.forEach((sceneID) => {
    if (decisions[`scene${sceneID}`] && !sceneDecisions[`scene${sceneID}`]) {
      notes.push(`missing decision for historical scene ${sceneID}`);
    }
  });

  if (corrected) {
    sessionStorage.setItem('gameSession', JSON.stringify(gameSession));
  }

  return { corrected, notes };
}

function validateGameState() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  const errors = [];
  const warnings = [];

  // VALIDATION 1: Check if actualCurrentScene matches gameSession
  if (actualCurrentScene !== gameSession?.actualCurrentScene) {
    warnings.push(`Global actualCurrentScene (${actualCurrentScene}) ≠ Session actualCurrentScene (${gameSession?.actualCurrentScene})`);
  }

  // VALIDATION 2: Check if isViewingHistoricalScene matches gameSession
  if (isViewingHistoricalScene !== gameSession?.isViewingHistoricalScene) {
    warnings.push(`Global isViewingHistoricalScene (${isViewingHistoricalScene}) ≠ Session isViewingHistoricalScene (${gameSession?.isViewingHistoricalScene})`);
  }

  // VALIDATION 3: Check if currentScene is in sceneHistory
  if (gameSession?.sceneHistory && !gameSession.sceneHistory.includes(gameSession.currentScene)) {
    errors.push(`Current scene ${gameSession.currentScene} not in sceneHistory`);
  }

  // VALIDATION 4: Check if conversation history exists for current scene
  if (!gameSession?.conversationHistory || !Object.prototype.hasOwnProperty.call(gameSession.conversationHistory, gameSession?.currentScene)) {
    warnings.push(`No conversation history for scene ${gameSession?.currentScene}`);
  }

  // VALIDATION 5: Check if response input area state matches expected state
  const inputArea = document.getElementById('response-input-area');
  const expectedDisabled = (gameSession?.currentScene !== actualCurrentScene) ||
    isViewingHistoricalScene ||
    manualPauseState?.isPaused;
  const actualDisabled = inputArea?.classList.contains('disabled-overlay') ||
    inputArea?.classList.contains('manual-paused') ||
    inputArea?.style.display === 'none';
  
  if (expectedDisabled !== actualDisabled) {
    warnings.push(`Response input area state mismatch: Expected disabled=${expectedDisabled}, Actual disabled=${actualDisabled}`);
  }

  // VALIDATION 6: Check timer state consistency
  const timerActive = responseTimer !== null;
  const shouldBeActive = (gameSession?.currentScene === actualCurrentScene) &&
    !isViewingHistoricalScene &&
    !manualPauseState?.isPaused;
  
  if (timerActive !== shouldBeActive) {
    warnings.push(`Timer state mismatch: Timer active=${timerActive}, Should be active=${shouldBeActive}`);
  }

  // VALIDATION 7: actualCurrentScene should always be the last scene in history
  if (Array.isArray(gameSession?.sceneHistory) && gameSession.sceneHistory.length > 0) {
    const lastScene = gameSession.sceneHistory[gameSession.sceneHistory.length - 1];
    if (actualCurrentScene !== lastScene) {
      warnings.push(`actualCurrentScene (${actualCurrentScene}) should equal last sceneHistory entry (${lastScene})`);
    }

    const decisions = getDecisionTreeForActivePair() || {};
    const historicalScenes = gameSession.sceneHistory.slice(0, -1);
    historicalScenes.forEach((sceneID) => {
      if (decisions[`scene${sceneID}`] && !gameSession?.playerDecisions?.[`scene${sceneID}`]) {
        errors.push(`Historical scene ${sceneID} is missing saved decision`);
      }
    });
  }

  // VALIDATION 8: Check if pausedConversationState is set when needed
  if (gameSession?.currentScene !== actualCurrentScene && isViewingHistoricalScene && !pausedConversationState) {
    warnings.push('On inactive scene but no pausedConversationState stored');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    snapshot: {
      actualCurrentScene,
      isViewingHistoricalScene,
      currentRound,
      currentStep,
      responseTimer: responseTimer !== null,
      responseSeconds,
      pausedConversationState,
      gameSessionCurrentScene: gameSession?.currentScene,
      gameSessionActualCurrentScene: gameSession?.actualCurrentScene
    }
  };
}

function autoFixGameState() {
  console.log('=== AUTO-FIXING GAME STATE ===');
  
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  let fixesApplied = [];

  const invariantResult = enforceSceneProgressionInvariant(gameSession);
  if (invariantResult.corrected) {
    fixesApplied.push(...invariantResult.notes);
  }

  // FIX 1: Sync actualCurrentScene
  if (actualCurrentScene !== gameSession?.actualCurrentScene) {
    console.log(`Fixing: actualCurrentScene ${actualCurrentScene} → ${gameSession?.actualCurrentScene}`);
    actualCurrentScene = gameSession?.actualCurrentScene || actualCurrentScene;
    window.actualCurrentScene = actualCurrentScene;
    fixesApplied.push('actualCurrentScene synced');
  }

  // FIX 2: Sync isViewingHistoricalScene
  if (isViewingHistoricalScene !== gameSession?.isViewingHistoricalScene) {
    console.log(`Fixing: isViewingHistoricalScene ${isViewingHistoricalScene} → ${gameSession?.isViewingHistoricalScene}`);
    isViewingHistoricalScene = gameSession?.isViewingHistoricalScene || false;
    window.isViewingHistoricalScene = isViewingHistoricalScene;
    fixesApplied.push('isViewingHistoricalScene synced');
  }

  // FIX 3: Update response input area visibility
  updateResponseInputAreaVisibility();
  fixesApplied.push('Response input area visibility updated');

  // FIX 4: Manage timer state
  manageTimerForSceneState();
  fixesApplied.push('Timer state corrected');

  // FIX 5: Update banner visibility
  if (isViewingHistoricalScene) {
    hideHistoricalViewBanner();
    fixesApplied.push('Historical view banner suppressed');
  } else {
    hideHistoricalViewBanner();
    fixesApplied.push('Historical view banner hidden');
  }

  console.log('✅ Auto-fixes applied:', fixesApplied);
  console.log('=== AUTO-FIX COMPLETE ===');
  
  return fixesApplied;
}

function logGameState(label = 'GAME STATE') {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  const validation = validateGameState();
  
  console.group(`=== ${label} ===`);
  console.log('Global State:', {
    actualCurrentScene,
    isViewingHistoricalScene,
    currentRound,
    currentStep,
    responseTimer: responseTimer !== null,
    responseSeconds,
    pausedConversationState
  });
  console.log('Session State:', {
    currentScene: gameSession?.currentScene,
    actualCurrentScene: gameSession?.actualCurrentScene,
    isViewingHistoricalScene: gameSession?.isViewingHistoricalScene,
    sceneHistory: gameSession?.sceneHistory,
    playerDecisions: gameSession?.playerDecisions
  });
  console.log('Validation:', {
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings
  });
  console.groupEnd();
}

window.validateGameState = validateGameState;
window.autoFixGameState = autoFixGameState;
window.logGameState = logGameState;



window.updateResponseInputAreaVisibility = updateResponseInputAreaVisibility;
window.updateResponseTimerVisibility = updateResponseTimerVisibility;
window.manageTimerForSceneState = manageTimerForSceneState;


window.debugConversationState = debugConversationState;
// === NEW: UNIFIED STATE SYNC FUNCTION ===
function syncGlobalStateToSession() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (gameSession) {
    gameSession.actualCurrentScene = actualCurrentScene;
    gameSession.isViewingHistoricalScene = isViewingHistoricalScene;
    gameSession.pausedConversationState = pausedConversationState;
    gameSession.manualPauseState = manualPauseState;
    gameSession.responses = sessionData.responses;
    sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
  }
}

function syncSessionStateToGlobal() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (gameSession) {
    actualCurrentScene = gameSession.actualCurrentScene || actualCurrentScene;
    isViewingHistoricalScene = Boolean(gameSession.isViewingHistoricalScene);
    pausedConversationState = gameSession.pausedConversationState || null;
    manualPauseState = gameSession.manualPauseState || {
      isPaused: false,
      pausedAt: null,
      remainingSeconds: null
    };

    if (Array.isArray(gameSession.responses)) {
      sessionData.responses = gameSession.responses;
    }

    window.actualCurrentScene = actualCurrentScene;
    window.isViewingHistoricalScene = isViewingHistoricalScene;
    window.manualPauseState = manualPauseState;
  }
}

window.syncGlobalStateToSession = syncGlobalStateToSession;
window.syncSessionStateToGlobal = syncSessionStateToGlobal;

// === NEW: PERIODIC STATE VALIDATION MONITOR ===

let stateValidationInterval = null;

function startStateValidationMonitor() {
  // Only run in development/debug mode - check every 10 seconds
  if (stateValidationInterval) return; // Already running
  
  stateValidationInterval = setInterval(() => {
    const validation = validateGameState();
    
    if (!validation.isValid || validation.errors.length > 0) {
      console.error('CRITICAL STATE ERRORS:', validation.errors);
      autoFixGameState();
    } else if (validation.warnings.length > 1) {
      // Only log if multiple warnings
      console.warn('State has', validation.warnings.length, 'warnings');
    }
  }, 10000);
  
  console.log('✅ State validation monitor started');
}

function stopStateValidationMonitor() {
  if (stateValidationInterval) {
    clearInterval(stateValidationInterval);
    stateValidationInterval = null;
    console.log('✅ State validation monitor stopped');
  }
}

window.startStateValidationMonitor = startStateValidationMonitor;
window.stopStateValidationMonitor = stopStateValidationMonitor;

// AUTO-START: Uncomment to enable automatic state monitoring
// setTimeout(() => startStateValidationMonitor(), 2000);
