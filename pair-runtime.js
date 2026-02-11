const loadedPairScriptSet = new Set();

function loadScriptOnce(src) {
  if (loadedPairScriptSet.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[data-pair-asset="${src}"]`);
    if (existingScript) {
      loadedPairScriptSet.add(src);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;
    script.dataset.pairAsset = src;
    script.onload = () => {
      loadedPairScriptSet.add(src);
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });
}

function getPairRoleOptions() {
  if (!window.PAIR_CONFIG) return [];

  const roleSet = new Set();
  Object.values(window.PAIR_CONFIG).forEach((pair) => {
    if (pair?.playerRole) roleSet.add(pair.playerRole);
    if (pair?.computerRole) roleSet.add(pair.computerRole);
  });

  return Array.from(roleSet);
}

function renderRoleSelectOptions() {
  const playerSelect = document.getElementById('player-role');
  const computerSelect = document.getElementById('computer-role');
  if (!playerSelect || !computerSelect) return;

  const playerSelected = playerSelect.value;
  const computerSelected = computerSelect.value;
  const roleOptions = getPairRoleOptions();

  playerSelect.innerHTML = '<option value="">-- Select your role --</option>';
  computerSelect.innerHTML = '<option value="">-- Select computer\'s role --</option>';

  roleOptions.forEach((role) => {
    const playerOption = document.createElement('option');
    playerOption.value = role;
    playerOption.textContent = role;
    playerSelect.appendChild(playerOption);

    const computerOption = document.createElement('option');
    computerOption.value = role;
    computerOption.textContent = role;
    computerSelect.appendChild(computerOption);
  });

  playerSelect.value = playerSelected;
  computerSelect.value = computerSelected;
}

function getSceneAssetPathsByPair(pairKey) {
  const pairManifest = window.PAIR_CONTENT_MANIFEST?.[pairKey];
  if (!pairManifest?.scenes) return [];

  const paths = [];
  Object.values(pairManifest.scenes).forEach((sceneConfig) => {
    if (sceneConfig?.conversationScript) paths.push(sceneConfig.conversationScript);
    if (sceneConfig?.answerKeyScript) paths.push(sceneConfig.answerKeyScript);
  });

  return paths;
}

async function ensurePairAssetsLoaded(pairKey) {
  const scripts = getSceneAssetPathsByPair(pairKey);
  for (const src of scripts) {
    await loadScriptOnce(src);
  }
}

async function ensureEnabledPairsAssetsLoaded() {
  if (!window.PAIR_CONFIG) return;

  const enabledPairs = Object.values(window.PAIR_CONFIG)
    .filter((pair) => pair.enabled)
    .map((pair) => pair.pairKey);

  for (const pairKey of enabledPairs) {
    await ensurePairAssetsLoaded(pairKey);
  }
}

window.renderRoleSelectOptions = renderRoleSelectOptions;
window.ensurePairAssetsLoaded = ensurePairAssetsLoaded;
window.ensureEnabledPairsAssetsLoaded = ensureEnabledPairsAssetsLoaded;
window.getSceneAssetPathsByPair = getSceneAssetPathsByPair;
