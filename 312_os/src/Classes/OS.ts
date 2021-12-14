import CPU from "./CPU";
import Process from "./Process";


class OS{
    threadsPerCPU = 4;
    maxMemoryInMB = 1024;
    // Waiting queue is a queue of jobs that are "waiting" for memory to be free in the ready queue
    waitingQueue: Process[] = [];
    // List of CPUs / cores
    CPUs: CPU[] = [];

    constructor(){
        const CPU1 = new CPU(this);
        const CPU2 = new CPU(this)
        this.CPUs =[CPU1, CPU2]
    }
}

export default OS