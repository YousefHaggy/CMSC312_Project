import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const msPerCycle = 1000;

function mainLoop(){
  // Check current
}

useEffect(() => {
  const interval = setInterval(() => {
    mainLoop();
  }, msPerCycle);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])


function Kernel(): JSX.Element {
  return (
    <div className="App">
      <h1>test</h1>
    </div>
  );
}

export default Kernel;
