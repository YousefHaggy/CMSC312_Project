import Process from "./Process";
import OS from "./OS";
import Scheduler from "./Scheduler";

class PriorityScheduler extends Scheduler {
  // Index of process in critical section, -1 if no processes are in critical section
  processInCriticalSection: number = -1;

  // Reference to OS objects
  public OS: OS;

  constructor(OS: OS) {
    super(OS);
    this.OS = OS;
  }
  updateQueue(): void {
    for (let i = 0; i < this.OS.threadsPerCPU; i++) {
      if (this.readyQueue.length <= i) {
        return;
      }

      if (this.readyQueue[i].state === "terminated") {
        this.removeProcessFromReadyQueue(this.readyQueue[i]);
      }
    }
    // If there are more processes than number of threads N, sort the ready queue from N to the end (processes not currently executing)
    // Sorting based on priority, lower is higher
    if (this.readyQueue.length > this.OS.threadsPerCPU) {
      const sortedQueuePortion = this.readyQueue.slice(4);
      sortedQueuePortion.sort(
        (a: Process, b: Process) => a.priority - b.priority
      );
      this.readyQueue = this.readyQueue.slice(0, 4).concat(sortedQueuePortion);
    }
  }
}

export default PriorityScheduler;
