import Process from "./Process";
import OS from "./OS";
abstract class Scheduler {
  public readyQueue: Process[] = [];
  public IOQueue: Process[] = [];

  // Index of process in critical section, -1 if no processes are in critical section
  processInCriticalSection: number = -1;

  // Reference to OS objects
  public OS: OS;

  // Values stored for statistic compariosn of performance
  private numOfProcessesWithResponse = 0;
  private numOfCompletedProcesses = 0;

  private totalResponseTime = 0;
  private totalTurnAroundTime = 0;

  // Backup Queue for multilevel feedback
  FCFSQueue: Process[] = [];

  constructor(OS: OS) {
    this.OS = OS;
  }

  abstract updateQueue(): void;

  removeProcessFromReadyQueue(process: Process): void {
    this.readyQueue = this.readyQueue.filter((proc) => proc.id != process.id);
    // Free up frames uses by process pages!
    process.framesInUseByIndex.forEach((frameIndex) => {
      this.OS.freeFrameIndexes.add(frameIndex);
    });
    process.framesInUseByIndex = [];
    // If there are jobs waiting to be placed in memory, check if there is memory to place them
    if (!!this.OS.waitingQueue.length) {

      this.scheduleProcess(this.OS.waitingQueue[0]);
    }
  }

  addToIOQueue(process: Process): void {
    const ids = new Set(this.IOQueue.map((proc) => proc.id));
    if (!ids.has(process.id)) {
      this.IOQueue.push(process);
    }
  }
  // TODO: Some duplicate logic, perhaps revisit and simplify
  scheduleProcess(process: Process): void {
    if (this.OS.freeFrameIndexes.size >= process.numOfPages) {
      // Assign pages to frames
      for (let i = 0; i < process.numOfPages; i++) {
        const frame = this.OS.freeFrameIndexes.values().next().value;
        process.framesInUseByIndex.push(frame);
        // Remove from free frame  from free frame list list
        this.OS.freeFrameIndexes.delete(frame)
      }
      process.setState("ready");
      // If it's already in queue skip
      if (this.readyQueue.find((proc) => proc.id == process.id)) return;
      // Remove it from the jobQeue if it exists:
      this.OS.waitingQueue = this.OS.waitingQueue.filter(
        (proc) => proc.id != process.id
      );
      this.readyQueue.push(process);
    } else {
      process.setState("waiting");
      // If it's already in queue skip
      if (this.OS.waitingQueue.find((proc) => proc.id == process.id)) return;
      // Remove it from the readyQueue if it exists:
      this.readyQueue = this.readyQueue.filter((proc) => proc.id != process.id);
      this.OS.waitingQueue.push(process);
    }
  }
  addTurnAroundTime(time: number) {
    this.numOfCompletedProcesses += 1;
    this.totalTurnAroundTime += time;
  }

  addResponseTime(time: number) {
    this.numOfProcessesWithResponse += 1;
    this.totalResponseTime += time;
  }

  getAvgResponseTime(): number {
    return this.totalResponseTime / this.numOfProcessesWithResponse;
  }

  getAvgTurnAroudnTime(): number {
    return this.totalTurnAroundTime / this.numOfCompletedProcesses;
  }
}

export default Scheduler;
