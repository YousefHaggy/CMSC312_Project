import React, { useEffect, useState } from "react";
import Instruction from "../Classes/Instruction";
import Process from "../Classes/Process";
import OS from "../Classes/OS";

function Program(props: any): JSX.Element {
  const {
    image,
    template,
    os,
  }: { image: string; template: Instruction[]; os: OS } = props;
  const handleProgramClick = () => {
    // For simple multicore right now, no load balancing, just randomly throw it to one of the two CPUs
    let scheduler =os.CPUs[0].scheduler;
    if (Math.random() < .5){
      scheduler = os.CPUs[1].scheduler
    }
    // TODO: Prevent duplicate IDs
    const process = new Process(Math.floor(Math.random() * 10000), template, scheduler);
    scheduler.scheduleProcess(process);
  };
  return <img src={image} width="50" height="50" onClick={()=>handleProgramClick()} />;
}
export default Program;
