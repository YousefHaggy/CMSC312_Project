import Process from './Process';
class Scheduler {
    //TODO: once we have memory mangagement, have a job queue

    public readyQueue: Process[] = [];
    public IOQueue: Process[] = [];

    // Trackers for Round Robin Scheduling
    // TODO
    timeQuantum = 10;
    elapsedTimeForActiveProcess: number = 0;

    updateQueue(): void {

    }

    scheduleProcess(process: Process): void{
        this.readyQueue.push(process)
    }
}

export default Scheduler