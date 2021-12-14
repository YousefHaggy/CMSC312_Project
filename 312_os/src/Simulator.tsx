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
const cpu = os.CPUs[1];
function Simulator(): JSX.Element {
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);
  const [IOQueue, setIOQueue] = useState<Process[]>([]);
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
    console.log(cpu.scheduler.readyQueue, cpu.scheduler.IOQueue);
    // Update state variables for UI
    setReadyQueue(cpu.scheduler.readyQueue);
    setIOQueue(cpu.scheduler.IOQueue);
    setWaitingQueue(os.waitingQueue);
  }, [totalElapsedCycles]);

  return (
    <div className="App">
      <h4>
        Memory in use:{" "}
        {readyQueue.reduce((sum, proc) => sum + proc.size, 0).toFixed(0)} / 1024
        MB
      </h4>
      <h2>Programs</h2>
      <div>
        <Program
          image={calculatorImage}
          template={calculator}
          scheduler={cpu.scheduler}
        />
        <Program
          image={browserImage}
          template={browser}
          scheduler={cpu.scheduler}
        />{" "}
        <Program
          image={printerImage}
          template={printer}
          scheduler={cpu.scheduler}
        />
      </div>
      <h2>Ready Queue</h2>
      <div style={{ display: "flex" }}>
        {readyQueue.map((process) => (
          <ProcessInfo process={process} />
        ))}
      </div>
      <h2>IO Queue</h2>
      <div style={{ display: "flex" }}>
        {IOQueue.map((process) => (
          <ProcessInfo process={process} />
        ))}
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
