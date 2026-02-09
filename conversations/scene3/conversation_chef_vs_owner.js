// Scene metadata (non-breaking, additive)
let SCENE_META_3 = {
  sceneID: 3,
  sceneTitle: 'The Day After - Lunch Review',
  playerRole: 'Chef',
  computerRole: 'The Restaurant Owner',
};
window.SCENE_META_3 = SCENE_META_3;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[3] = {
  conversation: [

    {
      round: 1,
      uid: 'R1-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Two days after signing with Sarah. You and Kenji sit at a plastic table under the shade of a hawker center in Tiong Bahru. The lunch crowd hums around you. He stirs his kopi, not drinking it. The contract is real now. So is the weight.',
      dialogue: 'I have not slept well since we signed. Keep running scenarios in my head. How are you feeling about all this?'
    },
    {
      round: 1,
      uid: 'R1-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'I feel [B1-1], but also [B1-2].',
      blanks: ['B1-1', 'B1-2']
    },
    {
      round: 2,
      uid: 'R2-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'Kenji nods slowly. A hawker uncle delivers char kway teow to the next table. The smell of wok hei fills the air. Kenji looks at it, then back at you.',
      dialogue: 'The ghost kitchen model is [B2-1], but our biggest challenge will be [B2-2].',
      blanks: ['B2-1', 'B2-2']
    },
    {
      round: 3,
      uid: 'R3-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'He finally takes a sip of his coffee. Sets it down carefully.',
      dialogue: 'Sarah wants us in the Kallang kitchen in 10 days. The clock is already ticking. We have $25,000, a one-month runway, and a target of $45,000 revenue. That is 150 orders a day average. Do you think that is realistic?'
    },
    {
      round: 3,
      uid: 'R3-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'It is realistic if [B3-1], but we will struggle if [B3-2].',
      blanks: ['B3-1', 'B3-2']
    },
    {
      round: 4,
      uid: 'R4-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'He pushes his coffee aside and pulls out a notebook. Flips it open. Blank pages.',
      dialogue: 'I promised you this would be different. Real partnership. So I want to ask—what worries you most about the next 30 days? Not what worries me. What worries you?'
    },
    {
      round: 4,
      uid: 'R4-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'I worry most about [B4-1], and whether we can [B4-2].',
      blanks: ['B4-1', 'B4-2']
    },
    {
      round: 5,
      uid: 'R5-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'Kenji writes something in the notebook. Underlines it twice. He looks up.',
      dialogue: 'If we only had resources to focus on one thing right now, I would focus on [B5-1], because that is what will [B5-2].',
      blanks: ['B5-1', 'B5-2']
    },
    {
      round: 6,
      uid: 'R6-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'He closes the notebook. Leans back. The hawker center noise fades into background static. This question matters.',
      dialogue: 'Alright. We have 10 days before we move into Kallang. We need a plan. Not Sarah/s plan—our plan. I am putting the question to you, Mira, because you see the operational reality better than I do. What would you propose we start with? What is the very first action we take tomorrow morning?'
    },
    {
      round: 6,
      uid: 'R6-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The first thing we do is [B6-1], so that we can [B6-2].',
      blanks: ['B6-1', 'B6-2']
    },
    {
      round: 7,
      uid: 'R7-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji writes it down. First action. Underlined. He looks at you with something that might be respect, might be relief.',
      dialogue: 'Good. That is good. I will handle platform setup and marketing. You lead kitchen operations and menu design. We meet every evening to sync. No surprises. No unilateral decisions. Partners. Are we aligned on that?'
    },
    {
      round: 7,
      uid: 'R7-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'We are aligned if [B7-1], and I need you to commit to [B7-2].',
      blanks: ['B7-1', 'B7-2']
    }
]   // Close the conversation array
};

