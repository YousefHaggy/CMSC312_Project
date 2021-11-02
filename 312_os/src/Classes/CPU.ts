import Scheduler from "./Scheduler"
import Process from "./Process";

class CPU{
    scheduler: Scheduler = new Scheduler();
    currentProcess!: Process;
    cycle(): void{
        // Update the queue
        this.scheduler.updateQueue();

        const {readyQueue, IOQueue} = this.scheduler;
        // Target first process in ready queues for CPU execution
        if (!!readyQueue?.length){
            this.currentProcess = readyQueue[0];
            this.currentProcess.setState("running");
            // currentProcess.in
            return
        }

        // Incremement cycle on process waiting in IO queue
        if (!!IOQueue?.length){
            const waitingProcess: Process = readyQueue[0];
            // currentProcess.in
            return
        }
    }

    executeInstruction(): void{
        
    }
}
export default CPU