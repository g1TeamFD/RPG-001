// Scene metadata (non-breaking, additive)
let SCENE_META_6 = {
  sceneID: 6,
  sceneTitle: 'Scout Other Businesses in Town',
  playerRole: 'Chef',
  computerRole: 'The Restaurant Owner',
};
window.SCENE_META_6 = SCENE_META_6;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[6] = {
  conversation: [

    {
      round: 1,
      uid: 'R1-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'That late afternoon. You and Kenji walk through Tiny Town, notebooks in hand. The city hums with quiet tension — a place caught between ambition and uncertainty. New buildings rise next to old shophouses. Tech startups share walls with family-run eateries. AI-driven logistics hubs operate across from traditional wet markets. The transformation is visible, but so is the fatigue.',
      resource: 'click <a href="https://teamfd.substack.com/p/chapter-18-a-dream-for-tiny-town" target="_blank" rel="noopener">here</a> to visit the town',
      resource_guideline: 'Read about Tiny Town then resume here to continue',
      dialogue: 'Sarah said the ghost kitchen needs to serve a real market need, not just replicate what is already here. So we need to understand what Tiny Town actually wants right now. What is the first thing you notice as we walk?.'
    },
    {
      round: 1,
      uid: 'R1-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The first thing I notice is [B1-1], and it tells me that people here are [B1-2].',
      blanks: ['B1-1', 'B1-2']
    },
    {
      round: 2,
      uid: 'R2-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'You pass a struggling café. The owner is outside, stacking chairs. A "For Lease" sign leans against the window. (Click <a href="https://projectinfinity8.substack.com/p/s1c90-tell-me-why-wala-wala-cafe" target="_blank" rel="noopener">here</a> to know more about the cafe). Two doors down, a new bubble tea shop has a line of young workers — early twenties, phones out, waiting. Kenji stops.',
      dialogue: 'That café closed because [B2-1], but that bubble tea shop is thriving because [B2-2].',
      blanks: ['B2-1', 'B2-2']
    },
    {
      round: 3,
      uid: 'R3-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'You walk further. Past a biotech lab where researchers eat packed dinner at their desks. Past a logistics warehouse where drivers grab instant noodles from a vending machine. Past an education center where evening classes are starting — adult learners, retraining, looking tired. Kenji takes notes.',
      dialogue: 'I am seeing a pattern. There are three kinds of people here: the young tech workers who want speed and novelty, the shift workers who need fuel and value, and the mid-career professionals who are stressed and time-starved. Each group has money, but they are spending it differently. Which group should we focus on?'
    },
    {
      round: 3,
      uid: 'R3-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'We should focus on [B3-1], because that group needs [B3-2].',
      blanks: ['B3-1', 'B3-2']
    },
    {
      round: 4,
      uid: 'R4-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'You stop at a corner. Three food businesses within sight: a traditional hawker stall (cheap, slow, authentic), a fast-casual salad chain (healthy, expensive, Instagram-ready), and a meal-prep vending machine (convenient, soulless, algorithmic). All three are surviving, but none are thriving. Kenji turns to you.',
      dialogue: 'Here is what I am thinking. We have three possible opportunities. Opportunity One: Partner with corporate offices and tech hubs for bulk lunch delivery — high volume, low margin, predictable. Opportunity Two: Create premium weekend meal kits targeting stressed professionals who want quality at home but have no time to cook. Opportunity Three: Build a late-night ghost kitchen serving shift workers and night-economy staff — less competition, underserved market. What is your instinct?'
    },
    {
      round: 4,
      uid: 'R4-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'My instinct says [B4-1], but I am concerned about [B4-2].',
      blanks: ['B4-1', 'B4-2']
    },
    {
      round: 5,
      uid: 'R5-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'You walk toward the tech district. Glass buildings. Co-working spaces. A rooftop café that closed at 3pm because there is no dinner demand here. A delivery rider parks his bike, checks his phone, rides off in 30 seconds. The efficiency is brutal.',
      dialogue: 'Let/s think about Opportunity One — corporate bulk delivery. The benefit would be [B5-1], but the cost trade-off is [B5-2].',
      blanks: ['B5-1', 'B5-2']
    },
    {
      round: 6,
      uid: 'R6-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji pulls out his phone. Opens a notes app. Starts sketching a rough financial model. Revenue per meal. Volume required. Delivery logistics. Competitive pressure. He looks up.',
      dialogue: 'Opportunity Two — premium meal kits. I ran the numbers in my head. Benefit: higher margin, brand-building, less delivery frequency. Cost: requires upfront investment in packaging, more complex logistics, uncertain demand. Needs marketing to educated customers. What do you think — is this sustainable or just trendy?'
    },
    {
      round: 6,
      uid: 'R6-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'I think it is sustainable if [B6-1], but it will fail if [B6-2].',
      blanks: ['B6-1', 'B6-2']
    },
    {
      round: 7,
      uid: 'R7-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'The sun is setting. The city shifts. Day workers leave. Night workers arrive. Delivery riders multiply. The streets glow under streetlights. You walk past the logistics hub — now buzzing. The biotech lab — still lit. The warehouse — 24-hour operation. Kenji stops at a bus interchange where workers wait, scrolling phones, looking exhausted.',
      dialogue: 'Opportunity Three — late-night ghost kitchen for shift workers. Benefit: underserved market, less competition, consistent demand from essential workers. Cost: we operate when everyone else is sleeping, requires night staffing, smaller volume but potentially loyal customer base. Tiny Town is becoming a 24-hour city whether people admit it or not. Is this the gap we should fill?'
    },
    {
      round: 7,
      uid: 'R7-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The gap we should fill is [B7-1], because the real opportunity in Tiny Town right now is [B7-2].',
      blanks: ['B7-1', 'B7-2']
    },
    {
      round: 8,
      uid: 'R8-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'You stop walking. Stand at the center of Tiny Town. The old shophouse district behind you. The new glass towers ahead. The city is a contradiction — tradition and disruption, survival and ambition, exhaustion and hunger. And somewhere in that contradiction is the answer.',
      dialogue: 'After walking through Tiny Town and seeing everything, I believe the opportunity we should implement is [B8-1], and here is why: [B8-2].',
      blanks: ['B8-1', 'B8-2']
    },
    {
      round: 9,
      uid: 'R9-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji closes his notebook. Looks at the city one more time. Then looks at you. There is something different now — not certainty, but clarity. A direction.',
      dialogue: 'Alright. Let/s do this. I have a tool for Cost & Benefit Analysis. Let/s put all of these 3 scenarioes in number and we decide. Ready?',
      resource: 'click <a href="https://docs.google.com/spreadsheets/d/17UhInB1j6hMX_y7Y2Nu4-MhtgLZJFW-iJYaHkoOZFEw/edit?usp=sharing" target="_blank" rel="noopener">here</a> to download dataset',
      resource_guideline: 'Use the CBA template to make a final decision then resume here to continue'
    },
    {
      round: 9,
      uid: 'R9-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'I am ready.',
      blanks: []
    }
]   // Close the conversation array
};

