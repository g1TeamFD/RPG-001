// Scene metadata (non-breaking, additive)
let SCENE_META = {
  sceneID: 1,
  sceneTitle: "In the kitchen...",
  playerRole: "Chef",
  computerRole: "The Restaurant Owner"
};
window.SCENE_META_1 = SCENE_META;
// Store scene-specific data in window namespace
if (!window.SCENE_DATA) window.SCENE_DATA = {};
window.SCENE_DATA[1] = {
  conversation: [


  {
    "round": 1,
    "uid": "R1-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "It's 11:04 PM on the final night. The last diners left an hour ago. The dining room is dark, chairs stacked on tables. In the kitchen, Kenji expected silence—but instead, he finds Mira still there, sleeves rolled up, organizing mise en place containers that will never be used again, quietly directing two remaining line cooks on how to properly store the last of the ingredients. Normally, Mira leaves by 9 PM, right after the last order fires. But tonight, she stayed. Kenji stands at the kitchen entrance, jacket half-on, briefcase in hand, watching her work with the same precision she's always had—even now, even here, at the end. The fluorescent lights hum. The weight of three years crashes into this moment. He doesn't know how to start, so he just says her name.",
    "dialogue": "Mira... you're still here. I thought you'd already gone home. You didn't have to stay."
  },
  {
    "round": 1,
    "uid": "R1-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I stayed because someone needed to [B1-1], and I wanted to make sure we [B1-2].",
    "blanks": ["B1-1", "B1-2"]
  },
  {
    "round": 2,
    "uid": "R2-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "Kenji looks at the neatly labeled containers, the spotless stations—everything in its place, as if the kitchen might open again tomorrow.",
    "dialogue": "You know what's strange? I kept telling myself this was a business decision. Just numbers. Cash flow. Rent. Suppliers. All very... logical. But standing here now, watching you do this... I don't think I ever really accepted it was ending. Does that make sense?"
  },
  {
    "round": 2,
    "uid": "R2-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "It makes sense because [B2-1], but the reality is [B2-2].",
    "blanks": ["B2-1", "B2-2"]
  },
  {
    "round": 3,
    "uid": "R3-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "He picks up one of the containers—premium miso paste, barely used. The supplier invoice flashes in his memory: +40% price increase, three months ago.",
    "dialogue": "The rent increase. The salmon going bad. Arif leaving. The no-shows. Each thing felt... manageable at the time, you know? Like we could absorb it. When did you realize we weren't going to make it?"
  },
  {
    "round": 3,
    "uid": "R3-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I realized when [B3-1], because it revealed that our [B3-2] was [B3-3].",
    "blanks": ["B3-1", "B3-2", "B3-3"]
  },
  {
    "round": 4,
    "uid": "R4-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "dialogue": "I could tell. There were moments you'd look at me during service—like you were waiting for me to say something. To change something. Why didn't you push me harder? On the menu changes. On cutting costs. On... any of it."
  },
  {
    "round": 4,
    "uid": "R4-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I [B4-1] because [B4-2], and I thought [B4-3].",
    "blanks": ["B4-1", "B4-2", "B4-3"]
  },
  {
    "round": 5,
    "uid": "R5-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "A line cook drops a pot in the back. They both glance over, then back to each other. The silence feels heavier now.",
    "dialogue": "Three months ago, when Johns started prioritizing retail over us, when Shila's trucks came late, when our salmon quality dropped—you adapted. You changed dishes. You made it work. But Mira... was that the right call? Should we have been adapting, or should we have been fighting back? Switching suppliers. Renegotiating. Making noise."
  },
  {
    "round": 5,
    "uid": "R5-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "We should have [B5-1] because [B5-2] was more important than [B5-3] in that moment.",
    "blanks": ["B5-1", "B5-2", "B5-3"]
  },
  {
    "round": 6,
    "uid": "R6-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "This is the first real tension. Kenji isn't blaming—he's questioning. Questioning himself, questioning the strategy, questioning if quiet excellence was enough.",
    "dialogue": "But that's the thing, isn't it? We kept solving the problems in front of us. You made magic with worse ingredients. Aiden covered for no-shows. I stretched payments. We became so good at surviving... we never stopped to ask if we should have been doing something completely different. What would you have done, if you were me? If you owned this place?"
  },
  {
    "round": 6,
    "uid": "R6-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I would have [B6-1] the [B6-2] by [B6-3] because that's where the real [B6-4] was.",
    "blanks": ["B6-1", "B6-2", "B6-3", "B6-4"]
  },
  {
    "round": 7,
    "uid": "R7-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "narrative": "There must be strategy he might have missed. He reaches into his jacket pocket and pulls out a folded letter. Places it on the counter between them.",
    "dialogue": "A week ago, I got this. An investor group. They want to buy the brand. Reopen in a smaller space. Different model—ghost kitchen, maybe. Delivery-focused. They asked if you'd be interested in staying on. As head of culinary. I didn't mention it because... honestly, I didn't think you'd want it. Was I wrong?"
  },
  {
    "round": 7,
    "uid": "R7-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "[B7-1] because [B7-2], but I need to understand [B7-3] before I can commit.",
    "blanks": ["B7-1", "B7-2", "B7-3"]
  },
  {
    "round": 8,
    "uid": "R8-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "dialogue": "I haven't decided yet. Part of me thinks it's just delaying the inevitable. Another part thinks... maybe we were playing the wrong game. Maybe sit-down dining with our cost structure was never going to survive what's coming. But ghost kitchen? That's not why we started this. What made you stay in this industry, Mira? After all the chaos, the hours, the pressure—why are you still here, tonight, cleaning a kitchen that's closing?"
  },
  {
    "round": 8,
    "uid": "R8-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I stay because [B8-1], and [B8-2] matters more to me than [B8-3].",
    "blanks": ["B8-1", "B8-2", "B8-3"]
  },
  {
    "round": 9,
    "uid": "R9-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "dialogue": "Yeah. Yeah, I think that's the part I lost somewhere in the spreadsheets. The reason we do this. It stopped being about the food, the people, the moment—and became about survival. Just... keeping the doors open one more month. If we had six months to rewind, knowing what we know now—and I gave you full authority over the menu, the suppliers, the pricing—what's the *one* thing you would have changed first? Not ten. One."
  },
  {
    "round": 9,
    "uid": "R9-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "I would have changed our [B9-1] by [B9-2] because that would [B9-3] the [B9-4] problem.",
    "blanks": ["B9-1", "B9-2", "B9-3", "B9-4"]
  },
  {
    "round": 10,
    "uid": "R10-K1",
    "speaker": "Kenji",
    "role": "The Restaurant Owner",
    "dialogue": "You know what? You should have been my partner, not just my chef. Control, ego, whatever—I kept the big decisions to myself. And maybe that's why we're here. The investor meeting is Thursday. If you want in, let me know by Wednesday. If you don't... I'll understand. Either way, Mira—thank you. For tonight. For all of it. Lock up when you're done?"
  },
  {
    "round": 10,
    "uid": "R10-M1",
    "speaker": "Mira",
    "role": "The Chef",
    "is_player": true,
    "dialogue": "[B10-1], but before that happens, [B10-2] because [B10-3].",
    "blanks": ["B10-1", "B10-2", "B10-3"]
  }
]  // Close the conversation array
};

// Expose SCENE_META
window.SCENE_META_1 = SCENE_META;

if (!window.SCENE_DATA_BY_PAIR) window.SCENE_DATA_BY_PAIR = {};
if (!window.SCENE_DATA_BY_PAIR.chef_vs_owner) window.SCENE_DATA_BY_PAIR.chef_vs_owner = {};
window.SCENE_DATA_BY_PAIR.chef_vs_owner[1] = window.SCENE_DATA[1] || {};
if (!window.SCENE_META_BY_PAIR) window.SCENE_META_BY_PAIR = {};
if (!window.SCENE_META_BY_PAIR.chef_vs_owner) window.SCENE_META_BY_PAIR.chef_vs_owner = {};
window.SCENE_META_BY_PAIR.chef_vs_owner[1] = window.SCENE_META_1;
