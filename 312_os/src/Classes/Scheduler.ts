import Process from './Process';
class Scheduler {
    //TODO: once we have memory mangagement, have a job queue

    public readyQueue: Process[] = [];
    public IOQueue: Process[] = [];

    // Trackers for Round Robin Scheduling
    timeQuantum = 10;
    elapsedTimeForActiveProcess: number = 0;

    updateQueue(): void {
        if (this.readyQueue.length === 0 )
        {
            return
        }
        else if(this.readyQueue[0].state ==="terminated"){
            this.readyQueue.splice(0,1)
            this.elapsedTimeForActiveProcess = 0 ;
        }
        // Single threaded Critical Section Resolving Scheme: The second condition here ensures that the RR scheduler will not
        // remove a process that is currently in it's critical section. This ensures that at most one process is in a critical section at all times
        if (this.elapsedTimeForActiveProcess === this.timeQuantum && !this.readyQueue[0].isInCriticalSection){
            const timeExceededProcess = this.readyQueue[0]
            // Change from running to ready
            timeExceededProcess.setState("ready")
            this.readyQueue.splice(0,1)
            this.scheduleProcess(timeExceededProcess)
            this.elapsedTimeForActiveProcess = 0 ;
        }
        else{
            this.elapsedTimeForActiveProcess+=1
        }
    }

    scheduleProcess(process: Process): void{
        // If it's already in queue skip
        if (this.readyQueue.find((proc)=> proc.id == process.id))
            return
        this.readyQueue.push(process)
    }
}

export default Scheduler