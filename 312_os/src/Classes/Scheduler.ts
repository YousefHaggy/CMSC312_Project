import Process from "./Process";
import OS from "./OS";
abstract class Scheduler {
  public readyQueue: Process[] = [];
  public IOQueue: Process[] = [];

  // Index of process in critical section, -1 if no processes are in critical section
  processInCriticalSection: number = -1;

  // Reference to OS objects
  public OS: OS;

  constructor(OS: OS){
    this.OS = OS;
  }

  abstract updateQueue(): void;

  removeProcessFromReadyQueue(process: Process): void {
    this.readyQueue = this.readyQueue.filter((proc) => proc.id != process.id);
    // If there are jobs waiting to be placed in memory, check if there is memory to place them
    if (!!this.OS.waitingQueue.length) {
      this.scheduleProcess(this.OS.waitingQueue[0]);
    }
  }
  abstract scheduleProcess(process: Process): void;
}

export default Scheduler;
