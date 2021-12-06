import Process from "./Process";
const numThreads = 4;
class Scheduler {
  public maxMemoryInMB = 1024;
  // Waiting queue is a queue of jobs that are "waiting" for memory to be free in the ready queue
  public waitingQueue: Process[] = [];
  public readyQueue: Process[] = [];
  public IOQueue: Process[] = [];

  // Trackers for Round Robin Scheduling
  timeQuantum = 10;
  elapsedTimeForActiveProcess: number = 0;
  elapsedTimeForActiveProcesses: number[] = [];

  // Index of process in critical section, -1 if no processes are in critical section
  processInCriticalSection: number = -1;
  updateQueue(): void {
    for (let i = 0; i < numThreads; i++) {
      if (this.readyQueue.length <= i) {
        return;
      }

      if (this.readyQueue[i].state === "terminated") {
        this.removeProcessFromReadyQueue(this.readyQueue[i]);
        this.elapsedTimeForActiveProcesses[i] = 0;
      }
      // Part of Critical Section Resolving Scheme: The second condition here ensures that the RR scheduler will not
      // remove a process that is currently in it's critical section. This ensures that at most one process is in a critical section at all times
      if (
        this.elapsedTimeForActiveProcesses[i] === this.timeQuantum &&
        !this.readyQueue[i].isInCriticalSection
      ) {
        const timeExceededProcess = this.readyQueue[i];
        // Change from running to ready
        timeExceededProcess.setState("ready");
        this.removeProcessFromReadyQueue(this.readyQueue[i]);
        this.scheduleProcess(timeExceededProcess);
        this.elapsedTimeForActiveProcesses[i] = 0;
      } else {
        this.elapsedTimeForActiveProcesses[i] += 1;
      }
    }
  }
  removeProcessFromReadyQueue(process: Process): void {
    this.readyQueue = this.readyQueue.filter((proc) => proc.id != process.id);
    // If there are jobs waiting to be placed in memory, check if there is memory to place them
    if (!!this.waitingQueue.length) {
      this.scheduleProcess(this.waitingQueue[0]);
    }
  }
  // TODO: Some duplicate logic, perhaps revisit and simplify
  scheduleProcess(process: Process): void {
      
    const totalUsedMemory = this.readyQueue.reduce(
      (sum, process) => sum + process.size,
      0
    );
    if (this.maxMemoryInMB - totalUsedMemory >= process.size) {
      process.setState("ready");
      // If it's already in queue skip
      if (this.readyQueue.find((proc) => proc.id == process.id)) return;
      // Remove it from the jobQeue if it exists:
      this.waitingQueue = this.waitingQueue.filter(
        (proc) => proc.id != process.id
      );
      this.readyQueue.push(process);
    } else {
      process.setState("waiting");
      // If it's already in queue skip
      if (this.waitingQueue.find((proc) => proc.id == process.id)) return;
      // Remove it from the readyQueue if it exists:
      this.readyQueue = this.readyQueue.filter((proc) => proc.id != process.id);
      this.waitingQueue.push(process);
    }
  }
}

export default Scheduler;
