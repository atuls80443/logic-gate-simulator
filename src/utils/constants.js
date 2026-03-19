/**
 * /**
 * Central constants for the simulator.
 * Use these instead of raw strings to avoid typos, enables autocomplete, and ensure consistency.
 */
 

//      Gate Types 
export const GATE_TYPES = {
  AND:   'AND',
  OR:    'OR',
  NOT:   'NOT',
  NAND:  'NAND',
  NOR:   'NOR',
  XOR:   'XOR',
  XNOR:  'XNOR',

  // Circuit I/O nodes
  INPUT:  'INPUT',
  OUTPUT: 'OUTPUT',
}

//      Gate Input Counts 
export const GATE_INPUT_COUNTS = {
  [GATE_TYPES.AND]:    2,
  [GATE_TYPES.OR]:     2,
  [GATE_TYPES.NOT]:    1,
  [GATE_TYPES.NAND]:   2,
  [GATE_TYPES.NOR]:    2,
  [GATE_TYPES.XOR]:    2,
  [GATE_TYPES.XNOR]:   2,
  [GATE_TYPES.INPUT]:  1,
  [GATE_TYPES.OUTPUT]: 1,
}

//      Signal Values 
export const SIGNAL = {
  LOW:  0,
  HIGH: 1,
}

//      Simulation Settings 
export const SIMULATION = {
  // Maximum BFS iterations before assuming oscillation
  MAX_ITERATIONS: 1000,

  // Default position for new gates placed on canvas
  DEFAULT_POSITION: { x: 100, y: 100 },

  // Position offset when multiple gates are added
  POSITION_OFFSET: 50,
}

//      Canvas Settings 
export const CANVAS = {
  MIN_ZOOM: 0.2,
  MAX_ZOOM: 2,
  DEFAULT_ZOOM: 1,
  BACKGROUND_COLOR: '#1a1a2e',
  GRID_COLOR: '#2a2a4a',
}

//      Wire Colors 
export const WIRE_COLORS = {
  HIGH: '#22c55e',   // green  — signal is 1
  LOW:  '#475569',   // gray   — signal is 0
  DEFAULT: '#475569' // default before simulation runs
}

//      Gate Categories 
export const GATE_CATEGORIES = {
  BASIC: [
    GATE_TYPES.AND,
    GATE_TYPES.OR,
    GATE_TYPES.NOT,
    GATE_TYPES.NAND,
    GATE_TYPES.NOR,
    GATE_TYPES.XOR,
    GATE_TYPES.XNOR,
  ],
  IO: [
    GATE_TYPES.INPUT,
    GATE_TYPES.OUTPUT,
  ],
}

// ─── Node Types ───────────────────────────────────────────────────────────────
// React Flow requires node type strings to match registered components.
// These map gate types to their React Flow node component names.
export const NODE_TYPES = {
  GATE:   'gateNode',
  INPUT:  'inputNode',
  OUTPUT: 'outputNode',
}