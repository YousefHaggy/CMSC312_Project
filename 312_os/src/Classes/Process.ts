type State = "new" | "ready" | "waiting" | "running" | "terminated";
class Process{
    instructions: any;
    state: State;
    currentIntruction: number = 0;
    remaingCyclesForInstruction: number = 0;
    isInCriticalSection: boolean = false;
    
    constructor(){
        this.state = "new";
        this.currentIntruction = 0
    }
}

export default Process;