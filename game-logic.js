// ============================================
// GAME LOGIC - Core Mechanics and Scoring
// ============================================

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

// Initialize
window.onload = function () {
  console.log('✅ Game loaded!');
  document.getElementById('player-info-modal').classList.remove('hidden');
  initChart();
};

// Global exposure
window.startGame = startGame;
window.submitResponse = submitResponse;
window.showStoryline = showStoryline;
window.showRoles = showRoles;
window.showHint = showHint;
window.closeModal = closeModal;
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

  sessionData.playerCode = playerCode;
  sessionData.playerRole = playerRole;
  sessionData.computerRole = computerRole;
  sessionData.startDateTime = getSingaporeDateTime();

  document.getElementById('player-info-modal').classList.add('hidden');
  startRound();
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
  const turnData = CONVERSATION_DATA.find(
    (d) =>
      d.round === currentRound &&
      (currentStep === 0 ? d.speaker === 'Kenji' : d.speaker === 'Mira')
  );

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

  currentRound++;

  const maxRounds = Math.max(...CONVERSATION_DATA.map((d) => d.round));

  if (currentRound <= maxRounds) {
    setTimeout(() => startRound(), 2000);
  } else {
    setTimeout(() => showGameEnd(), 1500);
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
  document.getElementById('modal-title').textContent = 'The Story';
  document.getElementById(
    'modal-body'
  ).innerHTML = `<p class="modal-text">The rain falls softly as Ember & Spoon serves its final dinner service...</p>`;
  document.getElementById('modal').classList.remove('hidden');
}

function showRoles() {
  document.getElementById('modal-title').textContent = 'Roles';
  document.getElementById(
    'modal-body'
  ).innerHTML = `<p class="modal-text"><strong>Kenji</strong> - Owner<br><strong>Mira</strong> - Chef</p>`;
  document.getElementById('modal').classList.remove('hidden');
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

  document.getElementById('modal-title').textContent = 'Complete!';
  document.getElementById('modal-body').innerHTML = `
    <p class="modal-text"><strong>Score: ${Math.round(totalScore)}</strong></p>
    <div class="success-box"><p>✅ Data downloaded!</p></div>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function exportSessionData() {
  const jsonString = JSON.stringify(sessionData, null, 2);
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
