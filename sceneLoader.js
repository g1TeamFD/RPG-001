// ============================================
// SCENE LOADER (Additive)
// ============================================

async function loadScene(sceneID) {
  const gameSession = JSON.parse(sessionStorage.getItem("gameSession"));
  if (!gameSession) return;

  // Save current scene conversation before switching
  if (typeof saveCurrentSceneConversation === 'function') {
    saveCurrentSceneConversation();
  }

  // Update game session
  gameSession.currentScene = sceneID;
  if (!gameSession.sceneHistory) gameSession.sceneHistory = [];
  gameSession.sceneHistory.push(sceneID);

  // Initialize conversation history storage if not exists
  if (!gameSession.conversationHistory) {
    gameSession.conversationHistory = {};
  }

  // Initialize scene metadata storage if not exists
  if (!gameSession.sceneMetaHistory) {
    gameSession.sceneMetaHistory = {};
  }

  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));

  // Load scene-specific data into global variables
  if (window.SCENE_DATA && window.SCENE_DATA[sceneID]) {
    window.CONVERSATION_DATA = window.SCENE_DATA[sceneID].conversation;
    window.ANSWER_KEY_DATA = window.SCENE_DATA[sceneID].answerKey;
    window.SCENE_META = window[`SCENE_META_${sceneID}`];

    // Validate scene data loaded correctly
    if (!window.SCENE_META) {
      console.error(`Scene ${sceneID} metadata failed to load. SCENE_META_${sceneID} is undefined.`);
      return;
    }
    if (!window.CONVERSATION_DATA) {
      console.error(`Scene ${sceneID} conversation data failed to load. SCENE_DATA[${sceneID}] is undefined.`);
      return;
    }
    console.log(`Scene ${sceneID} loaded successfully:`, window.SCENE_META.sceneTitle);
  } else {
    console.error(`Scene ${sceneID} data not found in window.SCENE_DATA`);
    return;
  }

  // Scene 1 is already loaded via script tag at startup
  if (sceneID === 1) {
    currentRound = 1;
    startRound();
    if (typeof updateSceneTitle === 'function') {
      updateSceneTitle();
    }
    return;
  }


  // For Scene 2 and beyond: Load the appropriate conversation data
  if (sceneID === 2) {
    // Reset round counter for new scene
    currentRound = 1;
    
    // Store scene metadata for navigation
    if (window.SCENE_META) {
      gameSession.sceneMetaHistory[sceneID] = window.SCENE_META;
      sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
    }

    // Clear conversation history DOM for fresh scene start
    const conversationHistory = document.getElementById('conversation-history');
    conversationHistory.innerHTML = '';
    document.getElementById('response-input-area').style.display = 'none';

    // Update scene title header
    if (typeof updateSceneTitle === 'function') {
      updateSceneTitle();
    }

    // Start the new scene
    startRound();
    return;
  }


  console.warn(`Scene ${sceneID} is not yet configured`);
}


window.loadScene = loadScene;
