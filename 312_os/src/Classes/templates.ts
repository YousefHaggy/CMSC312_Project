
// Contains all templates
import Instruction from "./Instruction";

const calculator: Instruction[] = [
  { type: "CPU", minCycles: 10, maxCycles: 20 },
  { type: "START_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "CPU", minCycles: 10, maxCycles: 20 },
  { type: "END_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "IO", minCycles: 5, maxCycles: 10 },
  { type: "CPU", minCycles: 10, maxCycles: 20 },
];
const browser: Instruction[] = [
  { type: "START_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "CPU", minCycles: 10, maxCycles: 20 },
  { type: "END_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "IO", minCycles: 5, maxCycles: 10 },
  { type: "CPU", minCycles: 10, maxCycles: 20 },
];
const printer: Instruction[] = [
  { type: "CPU", minCycles: 10, maxCycles: 20 },
  { type: "START_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "CPU", minCycles: 10, maxCycles: 20 },
  { type: "END_CRITICAL", minCycles: 0, maxCycles: 0 },
  { type: "IO", minCycles: 10, maxCycles: 20 },
  { type: "IO", minCycles: 10, maxCycles: 20 },
  { type: "IO", minCycles: 10, maxCycles: 20 },
];

export { browser, printer, calculator };
