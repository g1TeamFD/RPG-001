// ============================================
// GOOGLE SHEETS SYNC - Background Data Logger
// This file runs independently and won't affect game logic
// ============================================

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxzKmbl37-cilSfB6txvFbLxbXMGbMbPuRYQlLfuWyOFzGVdFpPT7gUhQ5bGcFk_fA/exec";

let currentSessionId = null;

// ============================================
// HELPER: Send Data to Google Sheets
// ============================================
async function sendToGoogleSheets(action, data) {
  try {
    const payload = {
      action: action,
      ...data
    };

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log(`✅ Data sent to Google Sheets: ${action}`);
    return { success: true };
  } catch (error) {
    console.warn(`⚠️ Google Sheets sync failed (game continues normally): ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ============================================
// START SESSION - Called when game begins
// ============================================
async function syncSessionStart(playerCode, playerRole, computerRole, startDateTime) {
  try {
    const result = await sendToGoogleSheets('startSession', {
      playerCode: playerCode,
      playerRole: playerRole,
      computerRole: computerRole,
      startDateTime: startDateTime
    });

    if (result.success) {
      currentSessionId = `SESSION_${playerCode}_${Date.now()}`;
    }

    return currentSessionId;
  } catch (error) {
    console.warn('Session start sync failed (continuing game):', error);
    currentSessionId = `SESSION_${playerCode}_${Date.now()}`;
    return currentSessionId;
  }
}

// ============================================
// SAVE ROUND RESPONSE - Called after each round
// ============================================
async function syncRoundResponse(round, responses, scores, timestamp) {
  try {
    const responseText = Object.entries(responses)
      .map(([blankUID, answer]) => `${blankUID}: ${answer}`)
      .join(' | ');

    await sendToGoogleSheets('saveRoundResponse', {
      sessionId: currentSessionId || 'UNKNOWN',
      round: round,
      responseText: responseText,
      timestamp: timestamp,
      scores: {
        resourceCraftsman: scores.resourceCraftsman || 0,
        systemsThinker: scores.systemsThinker || 0,
        experimenter: scores.experimenter || 0,
        calmStrategist: scores.calmStrategist || 0,
        valueHunter: scores.valueHunter || 0
      }
    });
  } catch (error) {
    console.warn('Round response sync failed (continuing game):', error);
  }
}

// ============================================
// SAVE FINAL SCORES - Called at game end
// ============================================
async function syncFinalScores(playerCode, finalScores, endDateTime) {
  try {
    await sendToGoogleSheets('saveFinalScores', {
      playerCode: playerCode,
      finalScores: {
        resourceCraftsman: finalScores.resourceCraftsman || 0,
        systemsThinker: finalScores.systemsThinker || 0,
        experimenter: finalScores.experimenter || 0,
        calmStrategist: finalScores.calmStrategist || 0,
        valueHunter: finalScores.valueHunter || 0
      },
      endDateTime: endDateTime
    });
  } catch (error) {
    console.warn('Final scores sync failed (continuing game):', error);
  }
}

// ============================================
// SAVE QUESTION - Called from Ask Questions modal
// ============================================
async function syncQuestion(playerCode, questionText, timestamp) {
  try {
    await sendToGoogleSheets('saveQuestion', {
      playerCode: playerCode,
      questionText: questionText,
      sessionId: currentSessionId || 'UNKNOWN',
      timestamp: timestamp
    });
    return { success: true };
  } catch (error) {
    console.warn('Question sync failed:', error);
    return { success: false };
  }
}

// ============================================
// SAVE STORY COMMENTS - Called from Story modal
// ============================================
async function syncStoryComments(playerCode, commentText, timestamp) {
  try {
    await sendToGoogleSheets('saveStoryComments', {
      playerCode: playerCode,
      sessionId: currentSessionId || 'UNKNOWN',
      startDateTime: timestamp,
      commentText: commentText
    });
    return { success: true };
  } catch (error) {
    console.warn('Story comment sync failed (game continues):', error);
    return { success: false };
  }
}

// ============================================
// ASK QUESTIONS MODAL - UI Handler
// ============================================
function openAskQuestionsModal() {
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = 'Ask a Question';
  document.getElementById('modal-body').innerHTML = `
    <p class="modal-text" style="text-align: center; margin-bottom: 20px;">
      Have a question about the game, story, or mechanics? Ask away!
    </p>
    <div class="form-group">
      <label class="form-label">Your Question:</label>
      <textarea
        id="question-input"
        class="form-input"
        placeholder="Type your question here..."
        rows="4"
        style="resize: vertical; font-family: inherit;"
      ></textarea>
    </div>
    <button class="modal-btn" onclick="submitQuestion()">Send Question</button>
  `;
  modal.classList.remove('hidden');
}

async function submitQuestion() {
  const questionInput = document.getElementById('question-input');
  const questionText = questionInput.value.trim();

  if (!questionText) {
    alert('Please enter a question');
    return;
  }

  const playerCode = sessionData.playerCode || 'UNKNOWN';
  const timestamp = getSingaporeDateTime();

  const result = await syncQuestion(playerCode, questionText, timestamp);

  document.getElementById('modal-body').innerHTML = `
    <div class="success-box">
      <p>✅ Your question has been submitted!</p>
      <p style="font-size: 12px; margin-top: 8px;">We'll review it and get back to you.</p>
    </div>
  `;

  setTimeout(() => {
    closeModal();
  }, 2000);
}

// ============================================
// EXPOSE FUNCTIONS GLOBALLY
// ============================================
window.openAskQuestionsModal = openAskQuestionsModal;
window.submitQuestion = submitQuestion;
window.syncSessionStart = syncSessionStart;
window.syncRoundResponse = syncRoundResponse;
window.syncFinalScores = syncFinalScores;
window.syncStoryComments = syncStoryComments;
