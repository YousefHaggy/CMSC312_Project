// OS level threads in Javascript can be implemented with Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#about_thread_safety
// Had some issues with Multithread.js, so decided to use Workers directly
import Scheduler from "./Scheduler";
import Process from "./Process";

class Thread{
    scheduler: Scheduler = new Scheduler();
    currentProcess: Process | undefined;
    setCurrentProcess(process: Process): void{
        this.currentProcess = process;
    }
    cycle(): void {
        console.log(this.currentProcess?.id)
      // Target current process for execution
    //   if (!!this.currentProcess) {
    //     // If next instruction is IO, move to IO queue
    //     if (
    //       this.currentProcess.instructions[
    //         this.currentProcess.currentIntructionIndex
    //       ].type == "IO"
    //     ) {
    //       this.currentProcess.setState("waiting");
    //       this.scheduler.IOQueue.push(this.currentProcess);
    //       this.scheduler.removeProcessFromReadyQueue(this.currentProcess)
    //       this.currentProcess = undefined;
    //     } else {
    //       this.currentProcess.setState("running");
    //       this.currentProcess.executeInstruction();
    //     }
    //     if (this.currentProcess && this.currentProcess.state =="terminated"){
    //         this.currentProcess = undefined;
    //     }
    //   }
    const {readyQueue} = this.scheduler;
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
          this.scheduler.removeProcessFromReadyQueue(readyQueue[0])
        } else {
          this.currentProcess.setState("running");
          this.currentProcess.executeInstruction();
        }
      }
  
    }
}
export default Thread;