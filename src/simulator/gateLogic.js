
// gateLogic.js - Implements the logic for each gate type


//       AND Gate
// Output is 1 only when ALL inputs are 1
export function AND(inputs) {
  if (inputs.length < 2) return 0
  return inputs.every(input => input === 1) ? 1 : 0
}

//       OR Gate 
// Output is 1 when AT LEAST ONE input is 1
export function OR(inputs) {
  if (inputs.length < 2) return 0
  return inputs.some(input => input === 1) ? 1 : 0
}

//       NOT Gate 
// Inverts a single input: 0 becomes 1, 1 becomes 0
export function NOT(inputs) {
  if (inputs.length !== 1) return 0
  return inputs[0] === 1 ? 0 : 1
}

//       NAND Gate 
// Opposite of AND: output is 0 only when ALL inputs are 1
export function NAND(inputs) {
  if (inputs.length < 2) return 1
  return inputs.every(input => input === 1) ? 0 : 1
}

//       NOR Gate 
// Opposite of OR: output is 1 only when ALL inputs are 0
export function NOR(inputs) {
  if (inputs.length < 2) return 1
  return inputs.some(input => input === 1) ? 0 : 1
}

//       XOR Gate 
// Output is 1 when inputs are DIFFERENT
export function XOR(inputs) {
  if (inputs.length < 2) return 0
  return inputs.reduce((acc, input) => acc ^ input, 0)
}

//       XNOR Gate 
// Opposite of XOR: output is 1 when inputs are the SAME
export function XNOR(inputs) {
  if (inputs.length < 2) return 1
  return XOR(inputs) === 1 ? 0 : 1
}

//       INPUT Node 
// Represents a user-controlled switch (0 or 1)
// Simply passes its value through unchanged
export function INPUT(inputs) {
  return inputs[0] === 1 ? 1 : 0
}

//      Gate Evaluator 
// Central dispatcher: takes a gate type string and evaluates it
// This is what the simulation engine will call
export function evaluateGate(type, inputs) {
  switch (type) {
    case 'AND':   return AND(inputs)
    case 'OR':    return OR(inputs)
    case 'NOT':   return NOT(inputs)
    case 'NAND':  return NAND(inputs)
    case 'NOR':   return NOR(inputs)
    case 'XOR':   return XOR(inputs)
    case 'XNOR':  return XNOR(inputs)
    case 'INPUT': return INPUT(inputs)
    default:
      console.warn(`Unknown gate type: ${type}`)
      return 0
  }
}