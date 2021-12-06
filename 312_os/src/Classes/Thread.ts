// OS level threads in Javascript can be implemented with Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#about_thread_safety
// Had some issues with Multithread.js, so decided to try to use Workers directly. That also didn't work too smoothly...
// I ended up just making cycle 'async' which I know doesn't use Hardware level threads, but it makes thread 'cycle' a nonblocking call that I guess is one step better than nothing at all
// TL;DR OS Threads didnt work with React, so I used an async call to simulate the nonblocking nature. Concurrency instead of true parrelelism.
import Scheduler from "./Scheduler";
import Process from "./Process";

class Thread {
  index: number;
  scheduler: Scheduler = new Scheduler();
  currentProcess: Process | undefined;
  sleepCounter: number = 0;

  constructor(index: number) {
    this.index = index;
  }
  setCurrentProcess(process: Process): void {
    this.currentProcess = process;
  }
  async cycle(): Promise<void> {
    const { readyQueue } = this.scheduler;
    if (!!readyQueue?.length && readyQueue.length > this.index) {
      this.currentProcess = readyQueue[this.index];
      
      // Sleep if instructed too
      if (!!this.sleepCounter) {
        const oldState = this.currentProcess.state;
        this.currentProcess.setState("waiting");
        await this.sleep(this.sleepCounter * 1000);
        this.currentProcess.setState(oldState);
        this.sleepCounter = 0;
      }

      // Critical section stuff:
      //    If a Process is in a critical section AND it's not on this thread AND the next code enters a critical section, lock the thread
      if (
        this.scheduler.processInCriticalSection != -1 &&
        this.scheduler.processInCriticalSection != this.currentProcess.id &&
        this.currentProcess.instructions[
          this.currentProcess.currentIntructionIndex
        ].type == "START_CRITICAL"
      ) {
        this.currentProcess.setState("waiting");
        await this.sleep(this.sleepCounter * 1000);
      }

      // If next instruction is IO, move to IO queue
      if (
        this.currentProcess.instructions[
          this.currentProcess.currentIntructionIndex
        ].type == "IO"
      ) {
        this.currentProcess.setState("waiting");
        this.scheduler.IOQueue.push(this.currentProcess);
        this.scheduler.removeProcessFromReadyQueue(readyQueue[this.index]);
      } else {
        this.currentProcess.setState("running");
        this.currentProcess.executeInstruction();
      }
    }
  }
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Thread;
