// ============================================
// GAME LOGIC - Core Mechanics and Scoring
// ============================================

// === SCENE CONFIG (SAFE v1) ===
const SCENE_END_ROUNDS = {
  1: 10, // Scene 1 ends at round 10
  2:9 // Scene 2 ends at round 9
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

// Story Comments (Session-scoped, in-memory)
let storyComments = [];
let sceneConversations = {};
window.sceneConversations = sceneConversations;
let currentExpandedChapter = null;

// Initialize
window.onload = function () {
  console.log('✅ Game loaded!');
  document.getElementById('player-info-modal').classList.remove('hidden');
  initChart();
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

function startGame() {
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

  // Existing assignments (KEEP)
  sessionData.playerCode = playerCode;
  sessionData.playerRole = playerRole;
  sessionData.computerRole = computerRole;
  sessionData.startDateTime = getSingaporeDateTime();

  // === GAME SESSION INIT (Non-breaking, CORRECT PLACE) ===
  const gameSession = {
    playerRole: playerRole,
    computerRole: computerRole,
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
    playerDecisions: {}
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
  if (window.SCENE_DATA && window.SCENE_DATA[1]) {
    window.CONVERSATION_DATA = window.SCENE_DATA[1].conversation;
    window.ANSWER_KEY_DATA = window.SCENE_DATA[1].answerKey;
    window.SCENE_META = window.SCENE_META_1;
    // Store Scene 1 metadata in sceneMetaHistory for navigation
if (!gameSession.sceneMetaHistory) {
  gameSession.sceneMetaHistory = {};
}
gameSession.sceneMetaHistory[1] = window.SCENE_META;
sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  } else {
    // Show error message if no conversation available
    alert('Please come back later or select another roles');
    document.getElementById('player-info-modal').classList.remove('hidden');
    return;
  }
  
  startRound();
  // Update scene title header for Scene 1
updateSceneTitle();

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
  displayCurrentTurn();
}

function displayCurrentTurn() {
  // Validate CONVERSATION_DATA exists
  if (!CONVERSATION_DATA) {
    console.error('CONVERSATION_DATA is undefined. Scene may not have loaded properly.');
    return;
  }
  
  // Get all turns for the current round, then use currentStep as an index
  const roundTurns = CONVERSATION_DATA.filter(d => d.round === currentRound);
  const turnData = roundTurns[currentStep];

  if (!turnData) return;


  const conversationHistory = document.getElementById('conversation-history');

  if (turnData.narrative && turnData.narrative.trim()) {
    const narrativeEl = document.createElement('div');
    narrativeEl.className = 'narrative-box';
    conversationHistory.appendChild(narrativeEl);
    typeText(narrativeEl, turnData.narrative, 15);

    setTimeout(() => {
      turnData.speaker === 'Kenji'
        ? displayComputerDialogue(turnData)
        : displayPlayerResponse(turnData);
    }, turnData.narrative.length * 15 + 500);
  } else {
    turnData.speaker === 'Kenji'
      ? displayComputerDialogue(turnData)
      : displayPlayerResponse(turnData);
  }
}

function displayComputerDialogue(turnData) {
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

  setTimeout(() => {
    currentStep = 1;
    displayCurrentTurn();
  }, turnData.dialogue.length * 20 + 3000);
}

function displayPlayerResponse(turnData) {
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
  startResponseTimer();
  scrollToBottom();
}

function submitResponse() {
  if (responseTimer) clearInterval(responseTimer);

  const currentData = CONVERSATION_DATA.find(
    (d) => d.round === currentRound && d.speaker === 'Mira'
  );
  if (!currentData || !currentData.blanks) return;

  const responses = {};
  const responseDetails = {
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
  scrollToBottom();

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

  currentRound++;

  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
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
function startResponseTimer() {
  responseSeconds = 120;
  updateResponseTimerText();

  if (responseTimer) clearInterval(responseTimer);

  responseTimer = setInterval(() => {
    responseSeconds--;
    updateResponseTimerText();

    if (responseSeconds <= 0) {
      clearInterval(responseTimer);
      submitResponse(); // Auto-submit, no penalty
    }
  }, 1000);
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

  const entry = sessionData.responses.find((r) => r.round === round);
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
  ).innerHTML = `<p class="modal-text">Think about systems thinking, resourcefulness, and calm leadership</p>`;
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
    
    const decisions = window.SCENE_DECISIONS;
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
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  document.getElementById("decision-checkpoint-modal").classList.add("hidden");

  if (option.outcome === "END_GAME") {
    showGameEnd();
  } else {
    loadScene(option.outcome);
  }
}

// ============================================
// SCENE NAVIGATION & CONVERSATION HISTORY
// ============================================

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
  if (!gameSession) return;

  const conversationHistory = document.getElementById('conversation-history');
  
  if (gameSession.conversationHistory && gameSession.conversationHistory[sceneID]) {
    conversationHistory.innerHTML = gameSession.conversationHistory[sceneID];
    
    // Hide the response input area when viewing history
    document.getElementById('response-input-area').style.display = 'none';
    
    scrollToBottom();
    console.log(`✅ Loaded conversation history for scene ${sceneID}`);
  } else {
    console.warn(`No conversation history found for scene ${sceneID}`);
  }
}

function navigatePreviousScene() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) return;

  const currentScene = gameSession.currentScene;
  const previousScene = currentScene - 1;

  if (previousScene < 1) {
    console.warn('No previous scene available');
    return;
  }

  // Save current scene conversation before switching
  saveCurrentSceneConversation();

  // Load previous scene conversation
  loadSceneConversation(previousScene);
  
  // Update header to show previous scene title
  const previousSceneTitle = gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[previousScene]
    ? gameSession.sceneMetaHistory[previousScene].sceneTitle
    : `Scene ${previousScene}`;
  
  const titleElement = document.getElementById('scene-title');
  if (titleElement) {
    titleElement.textContent = previousSceneTitle;
  }
}

function navigateNextScene() {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) return;

  const currentScene = gameSession.currentScene;
  const nextScene = currentScene + 1;

  // Check if next scene has been played
  if (!gameSession.conversationHistory || !gameSession.conversationHistory[nextScene]) {
    console.warn('Next scene has not been played yet');
    return;
  }

  // Save current scene conversation before switching
  saveCurrentSceneConversation();

  // Load next scene conversation
  loadSceneConversation(nextScene);
  
  // Update header to show next scene title
  const nextSceneTitle = gameSession.sceneMetaHistory && gameSession.sceneMetaHistory[nextScene]
    ? gameSession.sceneMetaHistory[nextScene].sceneTitle
    : `Scene ${nextScene}`;
  
  const titleElement = document.getElementById('scene-title');
  if (titleElement) {
    titleElement.textContent = nextSceneTitle;
  }
}

window.updateSceneTitle = updateSceneTitle;
window.navigatePreviousScene = navigatePreviousScene;
window.navigateNextScene = navigateNextScene;
window.saveCurrentSceneConversation = saveCurrentSceneConversation;
window.loadSceneConversation = loadSceneConversation;


window.showDecisionCheckpoint = showDecisionCheckpoint;
