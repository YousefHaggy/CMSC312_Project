import React, { useEffect, useState } from "react";
import "./App.css";
import CPU from "./Classes/CPU";
import Process from "./Classes/Process";
import Program from "./GUI_Components/Program";
import { calculator } from "./Classes/templates";
import calculatorImage from "./images/logo.png";
import ProcessInfo from "./GUI_Components/ProcessInfo";
const msPerCycle = 200;

const cpu = new CPU();

function Simulator(): JSX.Element {
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [IOQueue, setIOQueue] = useState<Process[]>([]);

  const [totalElapsedCycles, setTotalElapsedCycles] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      cpu.cycle();
     setTotalElapsedCycles(prev=>prev+1);
    }, msPerCycle);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    console.log(cpu.scheduler.readyQueue, cpu.scheduler.IOQueue);
    // Update state variables for UI
    setReadyQueue(cpu.scheduler.readyQueue);
    setIOQueue(cpu.scheduler.IOQueue);
  }, [totalElapsedCycles]);

  return (
    <div className="App">
      <h1>Programs</h1>
      <div>
        <Program
          image={calculatorImage}
          template={calculator}
          scheduler={cpu.scheduler}
        />
      </div>
      <h1>Ready Queue</h1>
      <div style={{display:"flex"}}> 
        {readyQueue.map((process) => (
          <ProcessInfo process={process} />
        ))}
      </div>
      <h1>IO Queue</h1>
      <div style={{display:"flex"}}> 
        {IOQueue.map((process) => (
          <ProcessInfo process={process} />
        ))}
      </div>
    </div>
  );
}

export default Simulator;
