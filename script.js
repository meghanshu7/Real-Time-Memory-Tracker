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

// ------------------------
// VISUALIZATION FUNCTIONS
// ------------------------

function drawMemory() {
    const container = document.getElementById('memoryContainer');
    container.innerHTML = '';
    memory.forEach((p, idx) => {
        const div = document.createElement('div');
        div.className = 'page';
        div.style.backgroundColor = p.allocated ? '#FF4136' : '#2ECC40';
        div.title = p.segmentName ? p.segmentName : 'Free';
        div.innerText = idx;

        // Add animation class when allocated
        if (p.allocated) {
            div.classList.add('allocated');
        }

        container.appendChild(div);
    });
    drawSegmentTable();
    drawPageTable();
    drawStats();
}

function drawSegmentTable() {
    const tbody = document.querySelector('#segmentTable tbody');
    tbody.innerHTML = '';
    segments.forEach(seg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${seg.name}</td><td>${seg.size}</td><td>${seg.pages.length}</td>`;
        tbody.appendChild(tr);
    });
}

function drawPageTable() {
    const tbody = document.querySelector('#pageTable tbody');
    tbody.innerHTML = '';
    memory.forEach((p, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx}</td><td>${p.allocated ? 'Allocated' : 'Free'}</td><td>${p.segmentName ? p.segmentName : '-'}</td>`;
        tbody.appendChild(tr);
    });
}

function drawStats() {
    let statsDiv = document.getElementById('stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'stats';
        document.body.appendChild(statsDiv);
    }
    statsDiv.innerHTML = `
        <h2>📊 Statistics</h2>
        <p>Total Allocations: ${stats.allocations}</p>
        <p>Total Deallocations: ${stats.deallocations}</p>
        <p>Page Faults: ${stats.pageFaults}</p>
        <p>Internal Fragmentation: ${calculateInternalFrag()} bytes</p>
        <p>External Fragmentation: ${calculateExternalFrag()} bytes</p>
    `;
}

// ------------------------
// MEMORY MANAGEMENT
// ------------------------

function allocateSegment() {
    const name = document.getElementById('segmentName').value.trim();
    const size = parseInt(document.getElementById('segmentSize').value);

    if (!name || isNaN(size) || size <= 0) {
        alert('Enter valid segment name and size');
        return;
    }

    const pagesNeeded = Math.ceil(size / PAGE_SIZE);
    const freePages = memory.filter(p => !p.allocated);

    if (freePages.length < pagesNeeded) {
        alert('Not enough memory!');
        stats.pageFaults++;
        drawStats();
        return;
    }

    let allocatedPages = [];
    let count = 0;
    for (let i = 0; i < memory.length && count < pagesNeeded; i++) {
        if (!memory[i].allocated) {
            memory[i].allocated = true;
            memory[i].segmentName = name;
            allocatedPages.push(i);
            count++;
        }
    }

    segments.push({ name: name, size: size, pages: allocatedPages });
    stats.allocations++;
    drawMemory();
}

function deallocateSegment() {
    const name = document.getElementById('segmentName').value.trim();
    if (!name) {
        alert('Enter segment name to deallocate');
        return;
    }

    segments = segments.filter(seg => seg.name !== name);
    memory.forEach(p => {
        if (p.segmentName === name) {
            p.allocated = false;
            p.segmentName = null;
        }
    });
    stats.deallocations++;
    drawMemory();
}

function resetMemory() {
    initializeMemory();
    drawMemory();
}

// ------------------------
// EXTRA FEATURES
// ------------------------

function accessAddress(addr) {
    const pageIndex = Math.floor(addr / PAGE_SIZE);
    const page = memory[pageIndex];
    if (!page.allocated) {
        stats.pageFaults++;
        alert(`Page fault! Address ${addr} not allocated.`);
    } else {
        alert(`Access successful! Address ${addr} belongs to segment ${page.segmentName}.`);
        // Highlight accessed page
        const container = document.getElementById('memoryContainer');
        container.children[pageIndex].style.backgroundColor = '#FFD700';
        setTimeout(() => {
            container.children[pageIndex].style.backgroundColor = '#FF4136';
        }, 1000);
    }
    drawStats();
}

function compactMemory() {
    let allocated = memory.filter(p => p.allocated);
    let freeCount = TOTAL_PAGES - allocated.length;

    memory = [];
    for (let i = 0; i < allocated.length; i++) {
        memory.push(allocated[i]);
    }
    for (let i = 0; i < freeCount; i++) {
        memory.push({ allocated: false, segmentName: null });
    }
    alert('Memory compacted!');
    drawMemory();
}

// ------------------------
// FRAGMENTATION CALCULATIONS
// ------------------------

function calculateInternalFrag() {
    let frag = 0;
    segments.forEach(seg => {
        frag += (PAGE_SIZE * seg.pages.length) - seg.size;
    });
    return frag;
}

function calculateExternalFrag() {
    let freeBlocks = 0;
    let currentBlock = 0;
    memory.forEach(p => {
        if (!p.allocated) {
            currentBlock++;
        } else {
            if (currentBlock > 0) {
                freeBlocks += currentBlock;
                currentBlock = 0;
            }
        }
    });
    if (currentBlock > 0) freeBlocks += currentBlock;
    return freeBlocks * PAGE_SIZE;
}

// ------------------------
// INITIALIZE
// ------------------------
initializeMemory();
drawMemory();

