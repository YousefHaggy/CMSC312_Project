import CPU from "./CPU";
import Process from "./Process";
import RoundRobinScheduler from "./RoundRobinScheduler";
import PriorityScheduler from "./PriorityScheduler";
import EventEmitter from "events";

class OS {
  msPerCycle = 200;
  threadsPerCPU = 4;
  maxMemoryInMB = 1024;
  frameSize = 8;

  frames: number[] = [];
  freeFrameIndexes: number[] = [];

  // Waiting queue is a queue of jobs that are "waiting" for memory to be free in the ready queue
  waitingQueue: Process[] = [];
  // List of CPUs / cores
  CPUs: CPU[] = [];

  // Interprocess Communication Method: A message passing approach
  messageQueue: string[] = [];

  // Second IPC Method: DIRECT COMMUNICATION using event listener to mimic send/receive
  // For convenience, direct communication will only occur between parent and child
  messageEmmiter: EventEmitter = new EventEmitter();
  constructor() {
    const CPU1 = new CPU(new RoundRobinScheduler(this));
    const CPU2 = new CPU(new PriorityScheduler(this));
    this.CPUs = [CPU1, CPU2];
    
    for(let i =0;i < this.maxMemoryInMB/this.frameSize; i++){
        this.frames.push(-1)
        this.freeFrameIndexes.push(i)
    }
  }
}

export default OS;
