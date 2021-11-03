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
      this.currentProcess.setState("running")
      this.currentProcess.executeInstruction();

      // TODO: Move to scheduler
    //   if (this.currentProcess.state == "terminated") {
    //     readyQueue.splice(0, 1);
    //   }
      return;
    }

    // Incremement cycle on process waiting in IO queue
    if (!!IOQueue?.length) {
      const waitingProcess: Process = IOQueue[0];
      this.currentProcess.setState("waiting")
      waitingProcess.executeInstruction();
    //   if (this.currentProcess.state == "terminated") {
    //     IOQueue.splice(0, 1);
    //   }
      return;
    }
  }

  executeInstruction(): void {}
}
export default CPU;
