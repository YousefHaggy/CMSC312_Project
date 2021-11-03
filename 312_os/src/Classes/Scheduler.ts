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
        if (this.elapsedTimeForActiveProcess === this.timeQuantum){
            const timeExceededProcess = this.readyQueue[0]
            this.readyQueue.splice(0,1)
            this.readyQueue.push(timeExceededProcess)
        }
        else{
            this.elapsedTimeForActiveProcess+=1
        }
    }

    scheduleProcess(process: Process): void{
        this.readyQueue.push(process)
    }
}

export default Scheduler