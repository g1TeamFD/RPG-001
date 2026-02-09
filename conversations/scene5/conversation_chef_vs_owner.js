// Scene metadata (non-breaking, additive)
let SCENE_META_5 = {
  sceneID: 5,
  sceneTitle: 'Review Inventory',
  playerRole: 'Chef',
  computerRole: 'The Restaurant Owner',
};
window.SCENE_META_5 = SCENE_META_5;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[5] = {
  conversation: [

    {
      round: 1,
      uid: 'R1-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'The next morning. You and Kenji stand in the Kallang commercial kitchen they will share with three other ghost kitchens. It is industrial, sterile, efficient. Four reach-in fridges. Two freezers. Dry storage shelves. No soul, but plenty of space. Kenji holds a clipboard. You hold the last three months of Ember & Spoon inventory records.',
      dialogue: 'For a pizza-focused ghost kitchen, our inventory strategy needs to be [B1-1], because the biggest waste in our old model, i think, was [B1-2].',
      blanks: ['B1-1', 'B1-2']
    },
    {
      round: 2,
      uid: 'R2-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji flips through the old inventory logs. Bags of flour. Wheels of mozzarella. San Marzano tomatoes. Fresh basil. Pepperoni. Salami. Mushrooms. Dates scribbled in fading ink. Some circled in red — spoilage.',
      resource: 'click <a href="https://docs.google.com/spreadsheets/d/1DVgfLcdypLZJOlZYUvKNiRJETk9x6Wpq9QLyRIRRyGY/edit?usp=sharing" target="_blank" rel="noopener">here</a> to download dataset',
      resource_guideline: 'Work on the dataset to understand the restaurant s inventory, how much was wasted and how much to order, then resume here to continue',
      dialogue: 'At Ember & Spoon, we were ordering weekly based on gut feel, not data. I see spoilage here — we over-ordered for a catering event that got cancelled. Basil going bad because we could not move it fast enough. Where in our daily workflow was the inefficiency?'
    },
    {
      round: 2,
      uid: 'R2-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The inefficiency was in [B2-1], and we lost money because we did not track [B2-2].',
      blanks: ['B2-1', 'B2-2']
    },
    {
      round: 3,
      uid: 'R3-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      dialogue: 'Okay. Let us build this properly. For a pizza ghost kitchen hitting 50 orders a day — call it 350 pizzas a week — we need roughly 40kg of flour, 25kg of mozzarella, 15 litres of tomato sauce, plus toppings. Shelf life varies. Flour lasts months. Mozzarella lasts two weeks. Fresh toppings last days. How much waste can we realistically tolerate?'
    },
    {
      round: 3,
      uid: 'R3-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'We can tolerate [B3-1] waste, but only if we [B3-2].',
      blanks: ['B3-1', 'B3-2']
    },
    {
      round: 4,
      uid: 'R4-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'You walk to the reach-in fridges. Open one. Empty. Cold. Waiting. You imagine it full — stacked with dough balls, mozzarella blocks, prepped toppings in cambro containers. The question is not what fits. It is what sells.',
      dialogue: 'Looking at the data from Ember & Spoon, I see that [B4-1], which means for the ghost kitchen we should [B4-2].',
      blanks: ['B4-1', 'B4-2']
    }
]   // Close the conversation array
};

