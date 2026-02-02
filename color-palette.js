// ============================================
// COLOR PALETTE SYSTEM
// ============================================
// Each palette has a unique UID and can be easily swapped

const COLOR_PALETTES = {
  
  // ============================================
  // CP-001: EMBER & SPOON (Warm Restaurant Theme)
  // ============================================
  "CP-001": {
    name: "Ember & Spoon Theme",
    description: "Warm, sophisticated restaurant colors with mint accents",
    colors: {
      // Primary Colors
      primary_dark: "#2C3E3C",        // Dark sage/charcoal
      primary_mint: "#B8D4CC",        // Soft mint green
      primary_sage: "#8BA89C",        // Medium sage
      primary_cream: "#F5F1E8",       // Warm cream background
      
      // Accent Colors
      accent_coral: "#E85D4D",        // Coral/salmon for highlights
      accent_gold: "#D4A574",         // Warm gold
      accent_navy: "#2E4052",         // Deep navy blue
      
      // Text Colors
      text_primary: "#2C3E3C",        // Main text (dark sage)
      text_secondary: "#6B7C78",      // Secondary text
      text_light: "#FFFFFF",          // White text
      
      // Background Colors
      bg_primary: "#F5F1E8",          // Main background (cream)
      bg_card: "#FFFFFF",             // Card background
      bg_sidebar: "#8BA89C",          // Sidebar (sage)
      bg_header: "#B8D4CC",           // Headers (mint)
      
      // UI Elements
      button_primary: "#2C3E3C",      // Primary buttons (dark sage)
      button_secondary: "#E85D4D",    // Secondary buttons (coral)
      border_light: "#D8DDD9",        // Light borders
      border_medium: "#B8D4CC",       // Medium borders
      
      // Chart/Graph Colors
      chart_line1: "#E85D4D",         // Coral (Resource Craftsman)
      chart_line2: "#2C3E3C",         // Dark sage (System Thinker)
      chart_line3: "#6B9DB5",         // Teal blue (Experimenter)
      chart_line4: "#8BA89C",         // Medium sage (Calm Strategist)
      chart_line5: "#D4A574",         // Gold (Value Hunter)
      
      // Status Colors
      success: "#7DB386",             // Green
      warning: "#E8A84D",             // Orange
      error: "#E85D4D",               // Red/coral
      info: "#6B9DB5"                 // Blue
    }
  },

  // ============================================
  // CP-002: COOL PROFESSIONAL (Alternative)
  // ============================================
  "CP-002": {
    name: "Cool Professional",
    description: "Blue-grey professional theme",
    colors: {
      primary_dark: "#2E4052",
      primary_mint: "#A8C5D6",
      primary_sage: "#6B8EA3",
      primary_cream: "#F4F6F8",
      accent_coral: "#E76F51",
      accent_gold: "#C9A961",
      accent_navy: "#1A2930",
      text_primary: "#2E4052",
      text_secondary: "#5A6C7D",
      text_light: "#FFFFFF",
      bg_primary: "#F4F6F8",
      bg_card: "#FFFFFF",
      bg_sidebar: "#6B8EA3",
      bg_header: "#A8C5D6",
      button_primary: "#2E4052",
      button_secondary: "#E76F51",
      border_light: "#D6DFE5",
      border_medium: "#A8C5D6",
      chart_line1: "#E76F51",
      chart_line2: "#2E4052",
      chart_line3: "#6B9DB5",
      chart_line4: "#6B8EA3",
      chart_line5: "#C9A961",
      success: "#7DB386",
      warning: "#E8A84D",
      error: "#E76F51",
      info: "#6B9DB5"
    }
  }
  
};

// Active palette (change this UID to switch themes)
const ACTIVE_PALETTE = "CP-001";

// Helper function to get current colors
function getColors() {
  return COLOR_PALETTES[ACTIVE_PALETTE].colors;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COLOR_PALETTES, ACTIVE_PALETTE, getColors };
}
