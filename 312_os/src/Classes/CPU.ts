import Scheduler from "./Scheduler";
import Process from "./Process";

class CPU {
  scheduler: Scheduler = new Scheduler();
  currentProcess!: Process;
  cycle(): void {
    // Update the queue
    this.scheduler.updateQueue();

    const { readyQueue, IOQueue } = this.scheduler;
    // Target first process in ready queues for CPU execution
    if (!!readyQueue?.length) {
      this.currentProcess = readyQueue[0];
      // If next instruction is IO, move to IO queue
      if (
        this.currentProcess.instructions[
          this.currentProcess.currentIntructionIndex
        ].type == "IO"
      ) {
        this.currentProcess.setState("waiting");
        this.scheduler.IOQueue.push(this.currentProcess);
        readyQueue.splice(0, 1);
      } else {
        this.currentProcess.setState("running");
        this.currentProcess.executeInstruction();
      }
    }

    // Incremement cycle on process waiting in IO queue
    if (!!IOQueue?.length) {
      const waitingProcess: Process = IOQueue[0];
      // If next instruction is CPU, move to Ready queue
      if (
        this.currentProcess.instructions[
          this.currentProcess.currentIntructionIndex
        ].type == "CPU"
      ) {
        this.currentProcess.setState("ready");
        this.scheduler.readyQueue.push(this.currentProcess);
        IOQueue.splice(0, 1);
      } else {
        this.currentProcess.setState("waiting");
        waitingProcess.executeInstruction();
      }
    }
  }

  executeInstruction(): void {}
}
export default CPU;
