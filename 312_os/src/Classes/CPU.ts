import Scheduler from "./Scheduler";
import Process from "./Process";
import Thread from "./Thread"
class CPU {
  scheduler: Scheduler = new Scheduler();
  threads: Thread[] = []
  currentProcess!: Process;

  // TODO: Variable for # of thread
  constructor(){
    for(let i =0; i < 4; i ++){
      const thread = new Thread();
      thread.scheduler = this.scheduler;
      this.threads.push(thread)
    }
  }
  
  cycle(): void {
    // Update the queue
    this.scheduler.updateQueue();

    const { readyQueue, IOQueue } = this.scheduler;

    if (!this.threads[0].currentProcess)
    this.threads[0].currentProcess = readyQueue[0];

    // TODO: loop through threads
    this.threads.forEach((thread)=>{
      thread.cycle();
    })
    console.log(this.scheduler.elapsedTimeForActiveProcess)
    // Incremement cycle on process waiting in IO queue
    if (!!IOQueue?.length) {
      const waitingProcess: Process = IOQueue[0];
      // If next instruction is CPU, move to Ready queue
      if (
        waitingProcess.instructions[
          waitingProcess.currentIntructionIndex
        ].type == "CPU"
      ) {
        waitingProcess.setState("ready");
        this.scheduler.scheduleProcess(waitingProcess);
        IOQueue.splice(0, 1)
      } else {
        waitingProcess.setState("waiting");
        waitingProcess.executeInstruction();
      }
    }
  }

  executeInstruction(): void {}
}
export default CPU;
