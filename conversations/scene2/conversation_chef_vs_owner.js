// Scene metadata (non-breaking, additive)
let SCENE_META_2 = {
  sceneID: 2,
  sceneTitle: 'At The Investor Meeting',
  playerRole: 'Chef',
  computerRole: 'The Restaurant Owner',
};
window.SCENE_META_2 = SCENE_META_2;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[2] = {
  conversation: [

  {
    round: 1,
    uid: 'R1-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    narrative: 'You and Kenji sit across from Sarah Chen, a sharp-eyed investor in her early 40s. She has already reviewed the financials. The office is minimalist—glass, steel, a single orchid. She does not waste time. She said: "I will be direct. Ember & Spoon is bleeding money. But the food is excellent, customer reviews are strong, and you have brand equity. The problem is not what you are serving—it is how you are serving it. Have you considered pivoting to a ghost kitchen model?"',
    dialogue: 'A ghost kitchen would mean [B1-1], but we would lose [B1-2].',
    blanks: ['B1-1', 'B1-2']
  },
  {
    round: 2,
    uid: 'R2-K1',
    speaker: 'Kenji',
    role: 'The Restaurant Owner',
    narrative: 'Sarah leans forward, fingers steepled, testing whether you understand the trade-offs. She said: "Correct. No front-of-house, no ambiance, no dine-in experience. But you would also cut rent by 70%, eliminate servers, and reach 10x more customers via delivery platforms. Kenji, what is your take?"',
    dialogue: 'I have been so focused on saving the restaurant as it is that I never considered whether we should. Mira knows the kitchen better than anyone—what do you think? Could we maintain quality in a ghost kitchen setup?'
  },
  {
    round: 2,
    uid: 'R2-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    dialogue: 'Quality depends on [B2-1], and we would need to [B2-2].',
    blanks: ['B2-1', 'B2-2']
  },
  {
    round: 3,
    uid: 'R3-K1',
    speaker: 'Kenji',
    role: 'The Restaurant Owner',
    narrative: 'Sarah pulls out a tablet, showing delivery platform data—numbers, graphs, customer density heat maps. She said: "Here is what I am proposing: A one-month pilot. I fund the ghost kitchen setup—industrial space, equipment rental, platform fees. You two run operations. If you hit $45,000 in revenue with 15% margins, I invest $200K for a proper launch. If not, we part ways. But here is the catch—you have to decide tonight if you are in."',
    dialogue: 'Sarah, if we do this... what happens to the Ember & Spoon brand? The space? The memories?'
  },
  {
    round: 3,
    uid: 'R3-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    dialogue: 'That is [B3-1], but the bigger question is [B3-2].',
    blanks: ['B3-1', 'B3-2']
  },
  {
    round: 4,
    uid: 'R4-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    narrative: 'Sarah\'s expression softens slightly. She has done this before. She said: "The brand evolves. The space closes. The memories stay with you and your customers. Look—I am not asking you to erase the last 5 years. I am asking if you are willing to carry what worked forward into a new model. Mira, you have been quiet. What is your gut telling you?"',
    dialogue: 'My gut says [B4-1], but my head says [B4-2].',
    blanks: ['B4-1', 'B4-2']
  },
  {
    round: 5,
    uid: 'R5-K1',
    speaker: 'Kenji',
    role: 'The Restaurant Owner',
    narrative: 'Sarah nods, appreciating the honesty. She opens a contract on her tablet and said: "Fair. Here is what the one-month trial looks like: You will operate out of a shared commercial kitchen in Kallang. Menu limited to your top 12 dishes—nothing fancy, just what travels well. Target: 150 orders per day average. I need both of you on this. Kenji handles platform partnerships, pricing, marketing. Mira, you run the kitchen and manage the cooks. Questions?"',
    dialogue: 'Mira... I cannot do this without you. Not just because you are a great chef, but because you see things I miss. If you are in, I am in. If you are not... I will understand.'
  },
  {
    round: 5,
    uid: 'R5-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    dialogue: 'The biggest risk is [B5-1], and we need to solve [B5-2].',
    blanks: ['B5-1', 'B5-2']
  },
  {
    round: 6,
    uid: 'R6-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    narrative: 'Sarah watches the exchange closely. She is evaluating the partnership, not just the business. She said: "Let me add something. If this works, Mira, I want you as an equity partner. Not just an employee. 20% stake, vested over two years. You have earned the right to share in the upside. But that only matters if you say yes tonight."',
    dialogue: 'That changes [B6-1], but I need to know [B6-2].',
    blanks: ['B6-1', 'B6-2']
  },
  {
    round: 7,
    uid: 'R7-K1',
    speaker: 'Kenji',
    role: 'The Restaurant Owner',
    narrative: 'Sarah slides a one-page term sheet across the table. Simple, clear. She said: "Here is the deal: $25,000 initial capital for setup. I take 40% equity. Kenji keeps 40%, Mira gets 20%. If we hit targets, I invest another $200K at the same valuation. We get three months to prove the model. After that, we either scale or shut down cleanly. No lawsuits, no hard feelings. Sound fair?"',
    dialogue: 'Mira, I know I have made mistakes. I know I should have listened more, shared more, partnered more. But if you give me—give us—one more shot... I promise it will be different this time.'
  },
  {
    round: 7,
    uid: 'R7-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    dialogue: 'It is fair if [B7-1], but what happens when [B7-2]?',
    blanks: ['B7-1', 'B7-2']
  },
  {
    round: 8,
    uid: 'R8-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    narrative: 'Sarah checks her watch. It is late. Decision time. She said: "I need an answer. Right now. Are you both in, or do we shake hands and walk away?"',
    dialogue: 'I need you to commit to [B8-1], and I need to understand [B8-2].',
    blanks: ['B8-1', 'B8-2']
  },
  {
    round: 9,
    uid: 'R9-K1',
    speaker: 'Kenji',
    role: 'The Restaurant Owner',
    narrative: 'Kenji looks at you one final time. His eyes say: Please.',
    dialogue: 'Mira... what do you say?'
  },
  {
    round: 9,
    uid: 'R9-M1',
    speaker: 'Mira',
    role: 'The Chef',
    is_player: true,
    narrative: 'This is the moment. Everything hinges on this.',
    dialogue: 'I say [B9-1], and here is why: [B9-2].',
    blanks: ['B9-1', 'B9-2']
  }
]   // Close the conversation array
};

