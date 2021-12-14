import React, { useEffect, useState } from "react";
import Instruction from "../Classes/Instruction";
import Process from "../Classes/Process";
import Scheduler from "../Classes/Scheduler";

function ProcessInfo(props: any): JSX.Element {
  const { process, isActive }: { process: Process; isActive: boolean } = props;

  return (
    <div style={{ backgroundColor: process.state == "running" ? "lightgreen": "lightblue", margin:10, padding:5 }}>
      <h6 style={{margin:2}}>ID: {process.id}</h6>
      <h6 style={{margin:2}}>Parent ID: {process.parent?.id}</h6>
      <h6 style={{margin:2}}>Priority: {process.priority}</h6>
      <h6 style={{margin:2}}>Size: {process.size.toFixed(0)} MB, {process.numOfPages} pages</h6>
      <h6 style={{margin:2}}>State: {process.state}</h6>
      <h6 style={{margin:2}}>IN CRITICAL SECTION? {String(process.isInCriticalSection)}</h6>
      <h6 style={{margin:2}}>Current Instruction Index: {process.currentIntructionIndex}</h6>
      <h6 style={{margin:2}}>
        Remaing Cycles for Instruction: {process.remaingCyclesForInstruction}
      </h6>
      <h6 style={{margin:2}}>Instructions:</h6>
      {process.instructions.map(({type, numCycles})=>(<p style={{fontSize:"10px", margin:0}}>{type} {numCycles}</p>))}
    </div>
  );
}
export default ProcessInfo;
