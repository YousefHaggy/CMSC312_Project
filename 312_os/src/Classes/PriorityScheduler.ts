import Process from "./Process";
import OS from "./OS";
import Scheduler from "./Scheduler";

class PriorityScheduler extends Scheduler{  
  
    // Index of process in critical section, -1 if no processes are in critical section
    processInCriticalSection: number = -1;
  
    // Reference to OS objects
    public OS: OS;
  
    constructor(OS: OS){
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
      if (this.readyQueue.length > this.OS.threadsPerCPU){
        const sortedQueuePortion = this.readyQueue.slice(4);
        sortedQueuePortion.sort((a: Process, b: Process) => a.priority - b.priority)
        this.readyQueue = this.readyQueue.slice(0,4).concat(sortedQueuePortion);
      }
    }

    // TODO: Some duplicate logic, perhaps revisit and simplify
    scheduleProcess(process: Process): void {
        
      const totalUsedMemory = this.readyQueue.reduce(
        (sum, process) => sum + process.size,
        0
      );
      if (this.OS.maxMemoryInMB - totalUsedMemory >= process.size) {
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
}

export default PriorityScheduler