import React, { useEffect, useState } from "react";
import "./App.css";
import CPU from "./Classes/CPU";
import Process from "./Classes/Process";
import Program from "./GUI_Components/Program";
import { calculator, browser, printer } from "./Classes/templates";
import calculatorImage from "./images/calc.png";
import browserImage from "./images/browser.png";
import printerImage from "./images/printer.png";

import ProcessInfo from "./GUI_Components/ProcessInfo";
import OS from "./Classes/OS";
const msPerCycle = 200;
const os = new OS();
const cpu1 = os.CPUs[0];
const cpu2 = os.CPUs[1];

function Simulator(): JSX.Element {
  const [readyQueue1, setReadyQueue1] = useState<Process[]>([]);
  const [readyQueue2, setReadyQueue2] = useState<Process[]>([]);

  const [IOQueue1, setIOQueue1] = useState<Process[]>([]);
  const [IOQueue2, setIOQueue2] = useState<Process[]>([]);

  const [waitingQueue, setWaitingQueue] = useState<Process[]>([]);

  const [totalElapsedCycles, setTotalElapsedCycles] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      os.CPUs.forEach((cpu) => cpu.cycle());
      setTotalElapsedCycles((prev) => prev + 1);
    }, msPerCycle);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    console.log(cpu1.scheduler.readyQueue, cpu1.scheduler.IOQueue);
    // Update state variables for UI
    setReadyQueue1(cpu1.scheduler.readyQueue);
    setIOQueue1(cpu1.scheduler.IOQueue);
    setReadyQueue2(cpu2.scheduler.readyQueue);
    setIOQueue2(cpu2.scheduler.IOQueue);

    setWaitingQueue(os.waitingQueue);
  }, [totalElapsedCycles]);

  return (
    <div className="App">
      <h4>
        Memory in use:{" "}
        {(readyQueue1.reduce((sum, proc) => sum + proc.size, 0) + readyQueue2.reduce((sum, proc) => sum + proc.size, 0)).toFixed(0)} / 1024
        MB
      </h4>
      <h2>Programs</h2>
      <div>
        <Program image={calculatorImage} template={calculator} os={os} />
        <Program image={browserImage} template={browser} os={os} />{" "}
        <Program image={printerImage} template={printer} os={os} />
      </div>
      <div style={{ display: "flex", flex: 1, width:"100vw",  flexDirection: "row" }}>
        <div style={{ display: "flex", flex: 0.5, flexShrink:0.5, backgroundColor:"lightgrey", margin:15, flexDirection:"column" }}>
          <h2>Ready Queue</h2>
          <div style={{ display: "flex" }}>
            {readyQueue1.map((process) => (
              <ProcessInfo process={process} />
            ))}
          </div>
          <h2>IO Queue</h2>
          <div style={{ display: "flex" }}>
            {IOQueue1.map((process) => (
              <ProcessInfo process={process} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flex: 0.5, flexShrink:0.5, backgroundColor:"lightgrey", margin:15,flexDirection:"column" }}>
          <h2>Ready Queue</h2>
          <div style={{ display: "flex" }}>
            {readyQueue2.map((process) => (
              <ProcessInfo process={process} />
            ))}
          </div>
          <h2>IO Queue</h2>
          <div style={{ display: "flex" }}>
            {IOQueue2.map((process) => (
              <ProcessInfo process={process} />
            ))}
          </div>
        </div>
      </div>

      <h2>Waiting Queue</h2>
      <div style={{ display: "flex" }}>
        {waitingQueue.map((process) => (
          <ProcessInfo process={process} />
        ))}
      </div>
    </div>
  );
}

export default Simulator;
