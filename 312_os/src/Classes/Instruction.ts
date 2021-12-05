interface Instruction{
    type: 'CPU' | 'IO' | 'FORK' | 'START_CRITICAL' | 'END_CRITICAL';
    numCycles?: number;
    maxCycles: number;
    minCycles: number;
}
export default Instruction