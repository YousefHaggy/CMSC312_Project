import Scheduler from "./Scheduler";
import Process from "./Process";
import Thread from "./Thread";
import OS from "./OS";
import RoundRobinScheduler from "./RoundRobinScheduler";
import PriorityScheduler from "./PriorityScheduler";

class CPU {
  scheduler: Scheduler;
  threads: any[] = [];
  currentProcess!: Process;

  // TODO: Variable for # of thread
  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this.startThreads();
  }
  async startThreads(): Promise<void> {
    for (let i = 0; i < 4; i++) {
      const thread = new Thread(i, this.scheduler);
      this.threads.push(thread);
    }
  }
  async cycle(): Promise<void> {
    // Update the queue
    this.scheduler.updateQueue();


    const { readyQueue, IOQueue } = this.scheduler;

    // Loop through each thread
    this.threads.forEach((thread) => {
      thread.cycle();
    });

    // Randomly generated IO interrupts
    // Approach: Pick a random active process and then have it sleep a random duration
    // This will force any process into the waiting state and then have regular operation resume afterwards
    if (Math.random() < .1 && readyQueue.length > 0) {
      const index = Math.floor(Math.random()*Math.min(4, readyQueue.length))
      // Sleep thread randomly for 0-5 seconds
      this.threads[index].sleepCounter = Math.random() * 5;
    }

    // Incremement cycle on process waiting in IO queue
    if (!!IOQueue?.length) {
      const waitingProcess: Process = IOQueue[0];
      // If next instruction is CPU, move to Ready queue
      if (
        waitingProcess.instructions[waitingProcess.currentIntructionIndex]
          .type == "CPU"
      ) {
        waitingProcess.setState("ready");
        this.scheduler.scheduleProcess(waitingProcess);
        IOQueue.splice(0, 1);
      } else {
        waitingProcess.setState("waiting");
        waitingProcess.executeInstruction();
      }
    }
  }

  executeInstruction(): void {}
}
export default CPU;
