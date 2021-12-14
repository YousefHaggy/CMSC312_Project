import Process from "./Process";
import OS from "./OS";
import Scheduler from "./Scheduler";

// Note: Multilevel has FCFS queue for slow processes
class RoundRobinScheduler extends Scheduler {
  // Trackers for Round Robin Scheduling
  timeQuantum = 10;
  elapsedTimeForActiveProcess: number = 0;
  elapsedTimeForActiveProcesses: number[] = [];

  // Index of process in critical section, -1 if no processes are in critical section
  processInCriticalSection: number = -1;

  // For Multilevel Feedback Queue:
  // FCFS queue that gets priority of CPU Time
  // When ready queue empty, add first entry of FCFS to ready queue
  // Or when age of process exceeds 100
  // If exceeds its allocated time quantum N times, it is added to the FCFS queue (n=1 for demonstration rn)

  FCFSQueue: Process[] = [];
  // Hashtable tracking the stuff mentioned above
  exceededQuantumCount: any = {};
ageOnFCFS: any = {};
  // Reference to OS objects
  public OS: OS;

  constructor(OS: OS) {
    super(OS);
    this.OS = OS;
  }
  updateQueue(): void {

    // For multilevel feedback queue, to prevent starvation move old entries bcak to RR
    this.FCFSQueue.forEach((proc, index, array)=>{
        this.ageOnFCFS[proc.id] = this.ageOnFCFS[proc.id] + 1 || 1;
        if (this.ageOnFCFS[proc.id] >= 100) {
            this.scheduleProcess(proc);
            this.ageOnFCFS[proc.id] = 0;
            array.splice(index, 1)
        }
    })
    // Or if Ready Queue empty, promote 1 process from FCFS to be processed
    if (this.readyQueue.length == 0) {
        const procToPromote = this.FCFSQueue.shift()
        if (!!procToPromote){
            this.scheduleProcess(procToPromote);
            this.ageOnFCFS[procToPromote.id] = 0;

        }
    }

    for (let i = 0; i < this.OS.threadsPerCPU; i++) {
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
        this.exceededQuantumCount[timeExceededProcess.id] =
          this.exceededQuantumCount[timeExceededProcess.id] + 1 || 1;
        // Change from running to ready
        timeExceededProcess.setState("ready");
        this.removeProcessFromReadyQueue(this.readyQueue[i]);

        // Move to slower queue if repeat offender!
        if (this.exceededQuantumCount[timeExceededProcess.id]  >= 1) {
        timeExceededProcess.setState("waiting")
          this.FCFSQueue.push(timeExceededProcess);
          this.exceededQuantumCount[timeExceededProcess.id] = 0
        } else this.scheduleProcess(timeExceededProcess);

        this.elapsedTimeForActiveProcesses[i] = 0;
      } else {
        this.elapsedTimeForActiveProcesses[i] += 1;
      }
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

export default RoundRobinScheduler;
