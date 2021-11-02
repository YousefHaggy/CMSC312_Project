import Instruction from "./Instruction";

type State = "new" | "ready" | "waiting" | "running" | "terminated";
// Process & PCB class
class Process{
    id: number;
    instructions: Instruction[];
    state: State;
    currentIntruction: number = 0;
    remaingCyclesForInstruction: number = 0;
    isInCriticalSection: boolean = false;
    
    constructor(pid: number, template: Instruction[]){
        this.id = pid;
        this.state = "new";
        this.currentIntruction = 0
        this.instructions = generateInstructionsFromTemplate(template);
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