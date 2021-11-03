import React, {useEffect, useState} from 'react';
import './App.css';
import CPU from './Classes/CPU';
import Process from './Classes/Process';
import Program from './GUI_Components/Program';
import { calculator } from './Classes/templates';
import calculatorImage from './images/logo.png'
const msPerCycle = 1000;

const cpu = new CPU();


function Simulator(): JSX.Element {
  const [readyQueue, setReadyQueue] = useState<Process[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      cpu.cycle();
      console.log(cpu.scheduler.readyQueue);
      // Update state variables for UI
      setReadyQueue(cpu.scheduler.readyQueue);
    }, msPerCycle);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])
  
  return (
    <div className="App">
      <h1>Programs</h1>
      <div>
        <Program image={calculatorImage} template={calculator} scheduler={cpu.scheduler} />
      </div>
      <h1>Ready Queue</h1>
      <h1>IO Queue</h1>

    </div>
  );
}

export default Simulator;
