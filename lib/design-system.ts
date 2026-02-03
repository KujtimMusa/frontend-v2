/**
 * Vlerafy Design System - Color Palette
 * ONLY Slate/Gray/Black/White + Status Colors
 * NO BLUE/INDIGO/PURPLE!
 */

export const colors = {
  // Base (Backgrounds)
  bg: {
    primary: 'bg-slate-950',      // Main background
    secondary: 'bg-slate-900',    // Cards
    tertiary: 'bg-slate-800',     // Hover/Active
    elevated: 'bg-slate-900/70',  // Elevated cards
    modal: 'bg-slate-900/95',     // Modals
  },
  
  // Text
  text: {
    primary: 'text-slate-100',    // Main text
    secondary: 'text-slate-400',   // Muted text
    tertiary: 'text-slate-500',    // Disabled
    inverse: 'text-slate-900',    // Text on light bg
  },
  
  // Borders
  border: {
    default: 'border-slate-800',
    hover: 'border-slate-700',
    active: 'border-slate-600',
    accent: 'border-slate-300',   // For active states
  },
  
  // Actions (Buttons)
  action: {
    primary: 'bg-slate-100 hover:bg-white text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
    outline: 'border border-slate-700 hover:bg-slate-800 text-slate-100',
    ghost: 'hover:bg-slate-800 text-slate-300',
    danger: 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800',
  },
  
  // Status (Only these colors allowed!)
  status: {
    success: {
      bg: 'bg-emerald-900/30',
      text: 'text-emerald-400',
      border: 'border-emerald-800',
      badge: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
    },
    warning: {
      bg: 'bg-amber-900/30',
      text: 'text-amber-400',
      border: 'border-amber-800',
      badge: 'bg-amber-900/30 text-amber-400 border-amber-800',
    },
    error: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-800',
      badge: 'bg-red-900/30 text-red-400 border-red-800',
    },
    neutral: {
      bg: 'bg-slate-800',
      text: 'text-slate-400',
      border: 'border-slate-700',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
    },
  },
  
  // Charts
  chart: {
    primary: 'stroke-slate-300',      // Own price (lighter, thicker)
    secondary: 'stroke-slate-500',    // Competitor prices (darker)
    grid: 'stroke-slate-800',
    background: 'fill-slate-900',
  },
};

// Export als Utility Functions
export const getButtonClass = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary') => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  return `${base} ${colors.action[variant]}`;
};

export const getBadgeClass = (variant: 'success' | 'warning' | 'error' | 'neutral' = 'neutral') => {
  const s = colors.status[variant];
  return `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text} ${s.border} border`;
};

export const getCardClass = (elevated: boolean = false) => {
  const base = 'rounded-xl border transition-all duration-300';
  const bg = elevated ? colors.bg.elevated : colors.bg.secondary;
  return `${base} ${bg} ${colors.border.default} hover:${colors.border.hover}`;
};

export const getSidebarActiveClass = () => {
  return `bg-slate-800 text-slate-100 border-l-3 border-slate-300`;
};
