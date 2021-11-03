import Instruction from "./Instruction";
import Scheduler from "./Scheduler";

type State = "new" | "ready" | "waiting" | "running" | "terminated";
// Process & PCB class
class Process {
  id: number;
  instructions: Instruction[];
  state: State;
  currentIntructionIndex: number = 0;
  remaingCyclesForInstruction: number = 0;
  isInCriticalSection: boolean = false;

  // Pointer to scheduler
  scheduler: Scheduler;
  constructor(pid: number, template: Instruction[], scheduler: Scheduler) {
    this.scheduler = scheduler;
    this.id = pid;
    // TODO: Once we introduce memory management and a long term Job Queue, state should start as "new"
    this.state = "ready";
    this.currentIntructionIndex = 0;
    this.instructions = generateInstructionsFromTemplate(template);
    this.remaingCyclesForInstruction = this.instructions[0].numCycles || 0;
  }
  public setState(state: State) {
    this.state = state;
  }
  nextInstruction() {
    if (this.currentIntructionIndex == this.instructions.length - 1) {
      this.state = "terminated";
      return;
    }
    this.currentIntructionIndex += 1;
    this.remaingCyclesForInstruction =
      this.instructions[this.currentIntructionIndex].numCycles || 0;

    const currentInstruction = this.instructions[this.currentIntructionIndex];
  }
  executeInstruction(): void {
    // If instruction is just marking critical section, move to next instruction
    switch (this.instructions[this.currentIntructionIndex].type) {
      case "START_CRITICAL":
        this.isInCriticalSection = true;
        this.nextInstruction();
        break;
      case "END_CRITICAL":
        this.isInCriticalSection = false;
        this.nextInstruction();
        break;

    }

    this.remaingCyclesForInstruction -= 1;

    // TODO: EXECUTE STUFF
    if (this.remaingCyclesForInstruction == 0) {
      this.nextInstruction();
    }
  }
}
// Utility function: This Function takes a templates and returns a copy with a random cycle count between min and max count
const generateInstructionsFromTemplate = (
  template: Instruction[]
): Instruction[] => {
  return template.map((instruction) => {
    const { maxCycles, minCycles } = instruction;
    const randomNumCycles = Math.floor(
      Math.random() * (maxCycles - minCycles + 1) + minCycles
    );
    return {
      ...instruction,
      numCycles: randomNumCycles,
    };
  });
};

export default Process;
