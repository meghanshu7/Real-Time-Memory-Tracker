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
