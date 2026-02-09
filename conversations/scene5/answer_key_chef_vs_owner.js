// ============================================
// ANSWER KEY DATA - Mindset Scoring
// Review Inventory – Rounds 1–4
// ============================================

if (!window.SCENE_DATA) window.SCENE_DATA = {};
if (!window.SCENE_DATA[5]) window.SCENE_DATA[5] = {};
window.SCENE_DATA[5].answerKey = [
  
  // =====================================================
  // B1-1 – "inventory strategy needs to be [B1-1]"
  // =====================================================
  {
    blankUID: "B1-1",
    conceptGroup: "Strategy - Just In Time",
    keywords: [
      "just in time", "JIT", "minimal holding", "lean inventory",
      "order as needed", "low stock", "tight inventory",
      "minimal buffer", "fresh focused", "small batches"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 4,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 1
    }
  },
  {
    blankUID: "B1-1",
    conceptGroup: "Strategy - Data Driven",
    keywords: [
      "data driven", "usage based", "metrics based", "track everything",
      "measurement focused", "numbers driven", "analytics based",
      "quantified", "measured carefully", "data informed"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 1
    }
  },
  {
    blankUID: "B1-1",
    conceptGroup: "Strategy - Flexible",
    keywords: [
      "flexible", "adaptive", "responsive", "agile",
      "adjust weekly", "nimble", "dynamic", "adaptable",
      "responsive to demand", "scalable"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 1,
      experimenter: 3
    }
  },

  // =====================================================
  // B1-2 – "biggest waste in our old model was [B1-2]"
  // =====================================================
  {
    blankUID: "B1-2",
    conceptGroup: "Waste - Over Ordering",
    keywords: [
      "over ordering", "ordering too much", "buying too much",
      "excess inventory", "bulk purchases", "over stocking",
      "too much at once", "ordering blindly", "guessing volumes"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 4,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B1-2",
    conceptGroup: "Waste - Spoilage",
    keywords: [
      "spoilage", "food going bad", "expired ingredients",
      "items expiring", "waste from age", "things rotting",
      "shelf life exceeded", "freshness lost", "ingredients dying"
    ],
    scoring: {
      systemsThinker: 2,
      resourceCraftsman: 4,
      calmStrategist: 1,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B1-2",
    conceptGroup: "Waste - No Tracking",
    keywords: [
      "no tracking", "not measuring", "blind ordering", "gut feel",
      "no data", "guessing", "no visibility", "no metrics",
      "flying blind", "no monitoring", "not watching"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 3,
      calmStrategist: 2,
      valueHunter: 1,
      experimenter: 0
    }
  },

  // =====================================================
  // B2-1 – "The inefficiency was in [B2-1]"
  // =====================================================
  {
    blankUID: "B2-1",
    conceptGroup: "Inefficiency - Order Timing",
    keywords: [
      "order timing", "when we ordered", "ordering schedule",
      "timing of purchases", "weekly guessing", "irregular orders",
      "poor timing", "schedule not optimized"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 3,
      calmStrategist: 2,
      valueHunter: 1,
      experimenter: 1
    }
  },
  {
    blankUID: "B2-1",
    conceptGroup: "Inefficiency - No Usage Data",
    keywords: [
      "no usage data", "not tracking usage", "no consumption metrics",
      "did not measure usage", "no usage tracking", "no burn rate",
      "did not know consumption", "usage unknown"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 3,
      calmStrategist: 1,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B2-1",
    conceptGroup: "Inefficiency - Poor Forecasting",
    keywords: [
      "forecasting", "prediction", "estimating poorly", "bad estimates",
      "could not predict", "guessing demand", "no forecast",
      "poor planning", "did not anticipate"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 1
    }
  },

  // =====================================================
  // B2-2 – "we never tracked [B2-2]"
  // =====================================================
  {
    blankUID: "B2-2",
    conceptGroup: "Tracking - Usage Rates",
    keywords: [
      "usage rates", "consumption rates", "how fast we use",
      "burn rate", "usage per dish", "consumption per item",
      "how much per day", "daily usage", "velocity"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 4,
      calmStrategist: 1,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B2-2",
    conceptGroup: "Tracking - Waste Patterns",
    keywords: [
      "waste patterns", "what spoils", "what goes bad",
      "spoilage trends", "which items waste", "waste by item",
      "loss patterns", "what expires", "spoilage rate"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 4,
      calmStrategist: 1,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B2-2",
    conceptGroup: "Tracking - Lead Times",
    keywords: [
      "lead times", "supplier timing", "delivery schedules",
      "how long to arrive", "order to delivery", "supplier speed",
      "delivery windows", "fulfillment time"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 1,
      experimenter: 0
    }
  },

  // =====================================================
  // B3-1 – "We can tolerate [B3-1] waste"
  // =====================================================
  {
    blankUID: "B3-1",
    conceptGroup: "Tolerance - 5 Percent",
    keywords: [
      "5%", "5 percent", "five percent", "industry standard",
      "normal waste", "acceptable level", "reasonable waste",
      "standard tolerance", "typical"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 3,
      calmStrategist: 3,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B3-1",
    conceptGroup: "Tolerance - Zero Waste",
    keywords: [
      "zero waste", "no waste", "0%", "zero percent",
      "zero tolerance", "aggressive target", "eliminate waste",
      "nothing wasted", "perfect efficiency"
    ],
    scoring: {
      systemsThinker: 2,
      resourceCraftsman: 4,
      calmStrategist: 2,
      valueHunter: 3,
      experimenter: 1
    }
  },
  {
    blankUID: "B3-1",
    conceptGroup: "Tolerance - 10 Percent",
    keywords: [
      "10%", "10 percent", "ten percent", "conservative",
      "safe buffer", "higher tolerance", "room for error",
      "learning curve", "initial phase"
    ],
    scoring: {
      systemsThinker: 2,
      resourceCraftsman: 2,
      calmStrategist: 4,
      valueHunter: 1,
      experimenter: 0
    }
  },

  // =====================================================
  // B3-2 – "but only if we [B3-2]"
  // =====================================================
  {
    blankUID: "B3-2",
    conceptGroup: "Condition - Track Daily",
    keywords: [
      "track daily", "monitor every day", "daily tracking",
      "watch closely", "measure daily", "daily monitoring",
      "real time tracking", "constant vigilance"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 3,
      calmStrategist: 3,
      valueHunter: 1,
      experimenter: 0
    }
  },
  {
    blankUID: "B3-2",
    conceptGroup: "Condition - Adjust Weekly",
    keywords: [
      "adjust weekly", "weekly reviews", "course correct weekly",
      "weekly adjustments", "responsive ordering", "adapt weekly",
      "weekly changes", "review and adjust"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 1,
      experimenter: 2
    }
  },
  {
    blankUID: "B3-2",
    conceptGroup: "Condition - Use Data",
    keywords: [
      "use data", "follow metrics", "data driven decisions",
      "let numbers guide", "trust analytics", "metrics based",
      "evidence based", "quantified approach"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 0
    }
  },

  // =====================================================
  // B4-1 – "Looking at the data, I see that [B4-1]"
  // =====================================================
  {
    blankUID: "B4-1",
    conceptGroup: "Pattern - Certain Items Waste",
    keywords: [
      "certain items waste", "mozzarella spoils", "basil goes bad",
      "fresh herbs expire", "specific ingredients spoil",
      "some items worse", "particular items", "perishables"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 4,
      calmStrategist: 1,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B4-1",
    conceptGroup: "Pattern - Volume Fluctuates",
    keywords: [
      "volume fluctuates", "demand varies", "weekday versus weekend",
      "inconsistent orders", "peaks and valleys", "demand changes",
      "variable volume", "uneven demand", "seasonal variation"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B4-1",
    conceptGroup: "Pattern - Catering Spikes",
    keywords: [
      "catering caused spikes", "event orders", "bulk orders",
      "irregular large orders", "special events", "one time orders",
      "catering variability", "event driven"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 2,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 0
    }
  },

  // =====================================================
  // B4-2 – "for the ghost kitchen we should [B4-2]"
  // =====================================================
  {
    blankUID: "B4-2",
    conceptGroup: "Action - Order Frequently",
    keywords: [
      "order more frequently", "smaller orders often", "frequent deliveries",
      "multiple times per week", "daily orders", "just in time",
      "fresher inventory", "reduce holding"
    ],
    scoring: {
      systemsThinker: 3,
      resourceCraftsman: 4,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 1
    }
  },
  {
    blankUID: "B4-2",
    conceptGroup: "Action - Smaller Quantities",
    keywords: [
      "smaller quantities", "less per order", "reduce volume",
      "buy less at once", "minimal stock", "tight inventory",
      "lean ordering", "lower volumes"
    ],
    scoring: {
      systemsThinker: 2,
      resourceCraftsman: 4,
      calmStrategist: 3,
      valueHunter: 2,
      experimenter: 0
    }
  },
  {
    blankUID: "B4-2",
    conceptGroup: "Action - Track Everything",
    keywords: [
      "track everything", "measure all items", "full visibility",
      "comprehensive tracking", "monitor all inventory",
      "complete metrics", "track every ingredient"
    ],
    scoring: {
      systemsThinker: 4,
      resourceCraftsman: 3,
      calmStrategist: 2,
      valueHunter: 2,
      experimenter: 0
    }
  }
];
