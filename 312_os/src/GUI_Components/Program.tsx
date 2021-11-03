import React, { useEffect, useState } from "react";
import Instruction from "../Classes/Instruction";
import Process from "../Classes/Process";
import Scheduler from "../Classes/Scheduler";

function Program(props: any): JSX.Element {
  const {
    image,
    template,
    scheduler,
  }: { image: string; template: Instruction[]; scheduler: Scheduler } = props;
  const handleProgramClick = () => {
    // TODO: Prevent duplicate IDs
    const process = new Process(Math.floor(Math.random() * 10000), template, scheduler);
    scheduler.scheduleProcess(process);
  };
  return <img src={image} onClick={()=>handleProgramClick()} />;
}
export default Program;
