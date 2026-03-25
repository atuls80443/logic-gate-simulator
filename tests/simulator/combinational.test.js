// Full truth table verification for all combinational circuits.

import { describe, it, expect } from 'vitest'
import {
  halfAdder,
  fullAdder,
  mux2to1,
  decoder2to4,
  rippleCarryAdder4bit,
} from '../../src/simulator/combinational'

//      Half Adder Tests 
describe('Half Adder', () => {
  it('0 + 0 = sum:0 carry:0', () => {
    expect(halfAdder(0, 0)).toEqual({ sum: 0, carry: 0 })
  })
  it('0 + 1 = sum:1 carry:0', () => {
    expect(halfAdder(0, 1)).toEqual({ sum: 1, carry: 0 })
  })
  it('1 + 0 = sum:1 carry:0', () => {
    expect(halfAdder(1, 0)).toEqual({ sum: 1, carry: 0 })
  })
  it('1 + 1 = sum:0 carry:1', () => {
    expect(halfAdder(1, 1)).toEqual({ sum: 0, carry: 1 })
  })
})

//      Full Adder Tests 
describe('Full Adder', () => {
  it('0+0+0 = sum:0 cout:0', () => {
    expect(fullAdder(0, 0, 0)).toEqual({ sum: 0, cout: 0 })
  })
  it('0+0+1 = sum:1 cout:0', () => {
    expect(fullAdder(0, 0, 1)).toEqual({ sum: 1, cout: 0 })
  })
  it('0+1+0 = sum:1 cout:0', () => {
    expect(fullAdder(0, 1, 0)).toEqual({ sum: 1, cout: 0 })
  })
  it('0+1+1 = sum:0 cout:1', () => {
    expect(fullAdder(0, 1, 1)).toEqual({ sum: 0, cout: 1 })
  })
  it('1+0+0 = sum:1 cout:0', () => {
    expect(fullAdder(1, 0, 0)).toEqual({ sum: 1, cout: 0 })
  })
  it('1+0+1 = sum:0 cout:1', () => {
    expect(fullAdder(1, 0, 1)).toEqual({ sum: 0, cout: 1 })
  })
  it('1+1+0 = sum:0 cout:1', () => {
    expect(fullAdder(1, 1, 0)).toEqual({ sum: 0, cout: 1 })
  })
  it('1+1+1 = sum:1 cout:1', () => {
    expect(fullAdder(1, 1, 1)).toEqual({ sum: 1, cout: 1 })
  })
})

//      2-to-1 Multiplexer Tests 
describe('2-to-1 Multiplexer', () => {
  it('S=0 selects D0=0', () => {
    expect(mux2to1(0, 1, 0).output).toBe(0)
  })
  it('S=0 selects D0=1', () => {
    expect(mux2to1(1, 0, 0).output).toBe(1)
  })
  it('S=1 selects D1=0', () => {
    expect(mux2to1(1, 0, 1).output).toBe(0)
  })
  it('S=1 selects D1=1', () => {
    expect(mux2to1(0, 1, 1).output).toBe(1)
  })
})

//      2-to-4 Decoder Tests 
describe('2-to-4 Decoder', () => {
  it('A=0,B=0 → Y0 HIGH only', () => {
    expect(decoder2to4(0, 0)).toEqual({ y0:1, y1:0, y2:0, y3:0 })
  })
  it('A=0,B=1 → Y1 HIGH only', () => {
    expect(decoder2to4(0, 1)).toEqual({ y0:0, y1:1, y2:0, y3:0 })
  })
  it('A=1,B=0 → Y2 HIGH only', () => {
    expect(decoder2to4(1, 0)).toEqual({ y0:0, y1:0, y2:1, y3:0 })
  })
  it('A=1,B=1 → Y3 HIGH only', () => {
    expect(decoder2to4(1, 1)).toEqual({ y0:0, y1:0, y2:0, y3:1 })
  })
})

