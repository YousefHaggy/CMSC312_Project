interface Instruction{
    type: 'CPU' | 'IO' | 'START_CRITICAL' | 'END_CRITICAL';
    numCycles?: number;
    maxCycles: number;
    minCycles: number;
}
export default Instruction