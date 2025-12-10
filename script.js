// ------------------------
// MEMORY SIMULATION LOGIC
// ------------------------

const TOTAL_MEMORY = 1024; // bytes
const PAGE_SIZE = 64; // bytes per page
const TOTAL_PAGES = Math.ceil(TOTAL_MEMORY / PAGE_SIZE);

let memory = [];
let segments = [];
let stats = { allocations: 0, deallocations: 0, pageFaults: 0 };

function initializeMemory() {
    memory = [];
    for (let i = 0; i < TOTAL_PAGES; i++) {
        memory.push({ allocated: false, segmentName: null });
    }
    segments = [];
    stats = { allocations: 0, deallocations: 0, pageFaults: 0 };
}
