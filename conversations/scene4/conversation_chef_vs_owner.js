// Scene metadata (non-breaking, additive)
let SCENE_META_4 = {
  sceneID: 4,
  sceneTitle: 'Review PnL',
  playerRole: 'Chef',
  computerRole: 'The Restaurant Owner',
};
window.SCENE_META_4 = SCENE_META_4;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[4] = {
  conversation: [

    {
      round: 1,
      uid: 'R1-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Later that afternoon. You are back at the closed Ember & Spoon, sitting at the bar with Kenji. His laptop is open, surrounded by folders — three years of invoices, receipts, and records. The silence of the empty dining room feels heavier now. He exhales slowly.',
      dialogue: 'Alright. We are doing this. Full financial autopsy. No hiding. Before we can fix the ghost kitchen model, we need to understand what killed the original one. Where should we start gathering data?'
    },
    {
      round: 1,
      uid: 'R1-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'We should start by gathering [B1-1], and then we need to pull [B1-2].',
      blanks: ['B1-1', 'B1-2']
    },
    {
      round: 2,
      uid: 'R2-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji starts pulling files from folders, organizing them into piles. Bank statements, supplier invoices, payroll records, utility bills. A year of data spread across the bar.',
      resource: 'click <a href="https://docs.google.com/spreadsheets/d/1Yyvtzwt5ix7KqOea_zQ_SSy5ZjByufuw_Fd13YcAQeI/edit?usp=drive_link" target="_blank" rel="noopener">here</a> to download dataset',
      resource_guideline: 'Work on the dataset to understand the restaurant s PnL then resume here to continue',
      dialogue: 'Okay. I have revenue data from the POS system — every table, every dish sold. I have supplier invoices going back 18 months. Payroll is complete. Rent, utilities, licenses, insurance — all here. What is the fastest way to consolidate this into something we can actually read?'
    },
    {
      round: 2,
      uid: 'R2-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'We should organize it by [B2-1], and focus on tracking [B2-2].',
      blanks: ['B2-1', 'B2-2']
    },
    {
      round: 3,
      uid: 'R3-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'Two hours pass. Coffee goes cold. The spreadsheet grows. Line items stack into categories. Revenue. Cost of Goods Sold. Labour. Rent. Utilities. Marketing. Miscellaneous. Finally, the PnL takes shape. Kenji leans back, staring at the screen. His face is unreadable.',
      dialogue: 'Looking at this PnL now, the pattern I see is [B3-1], and it tells me that our real problem was [B3-2].',
      blanks: ['B3-1', 'B3-2']
    },
    {
      round: 4,
      uid: 'R4-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji scrolls through the rows slowly. His finger hovers over one section, then another. He stops.',
      dialogue: 'Revenue averaged .... Not bad. But COGS — Cost of Goods Sold — was running at almost 50%. Labour.... Rent was fixed. Utilities, insurance, licenses.... That is... 70% COGS plus labour, plus fixed costs. We were operating on a very low net margin in a good month. One bad week and we were underwater.'
    },
    {
      round: 4,
      uid: 'R4-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The number that worries me most is [B4-1], because it means [B4-2].',
      blanks: ['B4-1', 'B4-2']
    },
    {
      round: 5,
      uid: 'R5-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji highlights a column. The monthly breakdown. January, February, March... the numbers tell a story. Revenue drops. COGS stays high. Labour barely flexes. Fixed costs never move.',
      dialogue: 'Here is what kills me. When revenue dropped 15% in March because of no-shows and bad weather, our costs barely adjusted. We were still buying the same volume of ingredients, still fully staffed, still paying full rent. We did not have the agility to scale down fast enough. By the time we reacted, we had already bled cash for two months.'
    },
    {
      round: 5,
      uid: 'R5-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'That is because our cost structure was [B5-1], and we never built in [B5-2].',
      blanks: ['B5-1', 'B5-2']
    },
    {
      round: 6,
      uid: 'R6-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      narrative: 'The room is quiet except for the hum of the laptop fan. Outside, the evening street noise filters through. Kenji closes his eyes for a moment, then opens them.',
      dialogue: 'For the ghost kitchen model, we need to completely rethink this. The biggest cost we need to control first is [B6-1], because if we do not fix that, [B6-2].',
      blanks: ['B6-1', 'B6-2']
    },
    {
      round: 7,
      uid: 'R7-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji opens a new tab. Ghost kitchen projections. He starts typing. Rent: $3,200 (Kallang shared space). No front-of-house labour. COGS target: 32%. He looks up.',
      dialogue: 'If we cut rent by 60%, eliminate front-of-house entirely, and drop COGS to 32% through tighter menu control, we could operate on a 20% net margin instead of 10%. That gives us breathing room. But it only works if we are disciplined. Mira, what is the one cost control measure you think we must implement from day one?'
    },
    {
      round: 7,
      uid: 'R7-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'The one thing we must do from day one is [B7-1], so that we can [B7-2].',
      blanks: ['B7-1', 'B7-2']
    },
    {
      round: 8,
      uid: 'R8-K1',
      speaker: 'Kenji',
      role: 'The Restaurant Owner',
      narrative: 'Kenji writes it down in the notebook from the hawker center. First action: PnL review. Biggest cost to control. Day-one discipline. He closes the laptop slowly.',
      dialogue: 'Okay. I see it now. The old model was built for a world where rent was affordable and customers were predictable. That world is gone. The ghost kitchen model forces us to be leaner, faster, and more intentional. We know what broke us. Now we build something that cannot break the same way. Are you ready to move on this?'
    },
    {
      round: 8,
      uid: 'R8-M1',
      speaker: 'Mira',
      role: 'The Chef',
      is_player: true,
      dialogue: 'I am ready if [B8-1], and I commit to [B8-2].',
      blanks: ['B8-1', 'B8-2']
    }
]   // Close the conversation array
};

