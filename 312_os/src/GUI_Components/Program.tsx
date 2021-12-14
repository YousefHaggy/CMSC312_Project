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
    // TODO: If I have time revist to load balance
    let scheduler =os.CPUs[0].scheduler;
    if (Math.random() < .5){
      scheduler = os.CPUs[1].scheduler
    }
    // TODO: Prevent duplicate IDs
    const priority = Math.floor(5*Math.random()  + 1)
    const process = new Process(Math.floor(Math.random() * 10000), priority, template, scheduler);
    scheduler.scheduleProcess(process);
  };
  return <img src={image} width="50" height="50" onClick={()=>handleProgramClick()} />;
}
export default Program;
