const SCENE_DECISIONS = {
  "scene1": {
    "sceneID": 1,
    "decisionCheckpoint": {
      "question": "Would you decide to join the Restaurant Owner in the Investor meeting?",
      "options": [
        {
          "optionID": "A",
          "optionLabel": "Option A",
          "optionText": "Yes",
          "outcome": 2
        },
        {
          "optionID": "B",
          "optionLabel": "Option B",
          "optionText": "No",
          "outcome": "END_GAME"
        }
      ]
    }
  },
  "scene2": {
    "sceneID": 2,
    "decisionCheckpoint": {
      "question": "Would you join the Restaurant Owner to run the business for another 3 months?",
      "options": [
        {
          "optionID": "A",
          "optionLabel": "Option A",
          "optionText": "Yes",
          "outcome": 3
        },
        {
          "optionID": "B",
          "optionLabel": "Option B",
          "optionText": "No",
          "outcome": "END_GAME"
        }
      ]
    }
  },
  "scene3": {
    "sceneID": 3,
    "decisionCheckpoint": {
      "question": "What would you propose to do first?",
      "options": [
        {
          "optionID": "A",
          "optionLabel": "Option A",
          "optionText": "Review the PnL to investigate where the money goes",
          "outcome": 4
        },
        {
          "optionID": "B",
          "optionLabel": "Option B",
          "optionText": "Check Inventory to plan How much to order for the next 3 months",
          "outcome": 5
        },
        {
          "optionID": "C",
          "optionLabel": "Option C",
          "optionText": "Scout other restaurants in town to find recent trend, market demand and hidden opportunities",
          "outcome": 6
        },
        {
          "optionID": "D",
          "optionLabel": "Option D",
          "optionText": "Feel Overwhelmed and Decide to Withdraw",
          "outcome": "END_GAME"
        }
      ]
    }
  }
};

window.SCENE_DECISIONS = SCENE_DECISIONS;
