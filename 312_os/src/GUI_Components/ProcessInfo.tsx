import React, { useEffect, useState } from "react";
import Instruction from "../Classes/Instruction";
import Process from "../Classes/Process";
import Scheduler from "../Classes/Scheduler";

function ProcessInfo(props: any): JSX.Element {
  const { process, isActive }: { process: Process; isActive: boolean } = props;

  return (
    <div style={{ backgroundColor: "lightblue", margin:10, padding:5 }}>
      <h5>ID: {process.id}</h5>
      <h5>State: {process.state}</h5>
      <h5>IN CRITICAL SECTION? {String(process.isInCriticalSection)}</h5>
      <h5>Current Instruction Index: {process.currentIntructionIndex}</h5>
      <h5>
        Remaing Cycles for Instruction: {process.remaingCyclesForInstruction}
      </h5>
      <h5>Instructions:</h5>
      {process.instructions.map(({type, numCycles})=>(<p>{type} {numCycles}</p>))}
    </div>
  );
}
export default ProcessInfo;
