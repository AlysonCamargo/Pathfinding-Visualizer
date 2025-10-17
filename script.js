// Configuração do Grid
let GRID_ROWS = 20;
let GRID_COLS = 40;
let START_NODE = { row: 10, col: 5 };
let END_NODE = { row: 10, col: 35 };

// Estado Global
let grid = [];
let isMousePressed = false;
let isVisualizationRunning = false;
let isDraggingStart = false;
let isDraggingEnd = false;
let speed = 20;

// Elementos DOM
const gridContainer = document.getElementById('grid-container');
const algorithmSelect = document.getElementById('algorithm-select');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const gridSizeSelect = document.getElementById('grid-size');
const visualizeBtn = document.getElementById('visualize-btn');
const clearPathBtn = document.getElementById('clear-path-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const generateMazeBtn = document.getElementById('generate-maze-btn');
const visitedCountEl = document.getElementById('visited-count');
const pathLengthEl = document.getElementById('path-length');
const executionTimeEl = document.getElementById('execution-time');

// Informações dos Algoritmos
const algorithmData = {
    dijkstra: {
        complexity: 'O((V + E) log V)',
        guarantee: 'Garante o caminho mais curto',
        description: 'Algoritmo clássico que explora todos os caminhos possíveis, garantindo o caminho mais curto em grafos ponderados.'
    },
    astar: {
        complexity: 'O(b^d) onde b é o fator de ramificação',
        guarantee: 'Garante o caminho mais curto com heurística admissível',
        description: 'Usa heurística (distância Manhattan) para explorar caminhos mais promissores primeiro, sendo mais eficiente que Dijkstra.'
    },
    bfs: {
        complexity: 'O(V + E)',
        guarantee: 'Garante o caminho mais curto em grafos não ponderados',
        description: 'Explora todos os vizinhos de um nó antes de avançar para o próximo nível, ideal para encontrar o caminho mais curto.'
    },
    dfs: {
        complexity: 'O(V + E)',
        guarantee: 'Não garante o caminho mais curto',
        description: 'Explora o máximo possível em uma direção antes de retroceder. Não é ideal para encontrar caminhos mais curtos.'
    },
    greedy: {
        complexity: 'O(b^d)',
        guarantee: 'Não garante o caminho mais curto',
        description: 'Segue sempre o caminho que parece mais próximo do objetivo. Rápido, mas pode não encontrar o melhor caminho.'
    }
};

// Classe Node
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = row === START_NODE.row && col === START_NODE.col;
        this.isEnd = row === END_NODE.row && col === END_NODE.col;
        this.isWall = false;
        this.isVisited = false;
        this.distance = Infinity;
        this.heuristic = 0;
        this.previousNode = null;
        this.element = null;
    }
}

// Event Listeners
speedInput.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
    speedValue.textContent = `${speed}ms`;
});

gridSizeSelect.addEventListener('change', (e) => {
    const size = e.target.value;
    if (size === 'small') {
        GRID_ROWS = 10;
        GRID_COLS = 20;
        START_NODE = { row: 5, col: 3 };
        END_NODE = { row: 5, col: 17 };
    } else if (size === 'medium') {
        GRID_ROWS = 20;
        GRID_COLS = 40;
        START_NODE = { row: 10, col: 5 };
        END_NODE = { row: 10, col: 35 };
    } else {
        GRID_ROWS = 30;
        GRID_COLS = 60;
        START_NODE = { row: 15, col: 8 };
        END_NODE = { row: 15, col: 52 };
    }
    initializeGrid();
});

visualizeBtn.addEventListener('click', visualizeAlgorithm);
clearPathBtn.addEventListener('click', clearPath);
clearAllBtn.addEventListener('click', clearAll);
generateMazeBtn.addEventListener('click', generateMaze);
algorithmSelect.addEventListener('change', updateAlgorithmInfo);

// Inicialização
function initializeGrid() {
    grid = [];
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${GRID_COLS}, 25px)`;
    gridContainer.style.gridTemplateRows = `repeat(${GRID_ROWS}, 25px)`;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COLS; col++) {
            const node = new Node(row, col);
            const nodeElement = document.createElement('div');
            nodeElement.className = 'grid-node';
            nodeElement.id = `node-${row}-${col}`;
            
            if (node.isStart) nodeElement.classList.add('start');
            if (node.isEnd) nodeElement.classList.add('end');
            
            nodeElement.addEventListener('mousedown', () => handleMouseDown(row, col));
            nodeElement.addEventListener('mouseenter', () => handleMouseEnter(row, col));
            nodeElement.addEventListener('mouseup', handleMouseUp);
            
            node.element = nodeElement;
            gridContainer.appendChild(nodeElement);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
    
    document.addEventListener('mouseup', handleMouseUp);
    resetStats();
}

function handleMouseDown(row, col) {
    if (isVisualizationRunning) return;
    
    const node = grid[row][col];
    
    if (node.isStart) {
        isDraggingStart = true;
    } else if (node.isEnd) {
        isDraggingEnd = true;
    } else {
        isMousePressed = true;
        toggleWall(row, col);
    }
}

function handleMouseEnter(row, col) {
    if (isVisualizationRunning) return;
    
    if (isDraggingStart) {
        moveStartNode(row, col);
    } else if (isDraggingEnd) {
        moveEndNode(row, col);
    } else if (isMousePressed) {
        toggleWall(row, col);
    }
}

function handleMouseUp() {
    isMousePressed = false;
    isDraggingStart = false;
    isDraggingEnd = false;
}

function toggleWall(row, col) {
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    
    node.isWall = !node.isWall;
    node.element.classList.toggle('wall');
}

function moveStartNode(row, col) {
    const oldStart = grid[START_NODE.row][START_NODE.col];
    oldStart.isStart = false;
    oldStart.element.classList.remove('start');
    
    const newStart = grid[row][col];
    if (!newStart.isWall && !newStart.isEnd) {
        START_NODE = { row, col };
        newStart.isStart = true;
        newStart.element.classList.add('start');
    }
}

function moveEndNode(row, col) {
    const oldEnd = grid[END_NODE.row][END_NODE.col];
    oldEnd.isEnd = false;
    oldEnd.element.classList.remove('end');
    
    const newEnd = grid[row][col];
    if (!newEnd.isWall && !newEnd.isStart) {
        END_NODE = { row, col };
        newEnd.isEnd = true;
        newEnd.element.classList.add('end');
    }
}

function clearPath() {
    if (isVisualizationRunning) return;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const node = grid[row][col];
            node.isVisited = false;
            node.distance = Infinity;
            node.heuristic = 0;
            node.previousNode = null;
            node.element.classList.remove('visited', 'path');
        }
    }
    resetStats();
}

function clearAll() {
    if (isVisualizationRunning) return;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const node = grid[row][col];
            if (!node.isStart && !node.isEnd) {
                node.isWall = false;
                node.element.classList.remove('wall');
            }
        }
    }
    clearPath();
}

function generateMaze() {
    if (isVisualizationRunning) return;
    
    clearAll();
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const node = grid[row][col];
            if (!node.isStart && !node.isEnd && Math.random() < 0.3) {
                node.isWall = true;
                node.element.classList.add('wall');
            }
        }
    }
}

function resetStats() {
    visitedCountEl.textContent = '0';
    pathLengthEl.textContent = '0';
    executionTimeEl.textContent = '0ms';
}

function updateAlgorithmInfo() {
    const selected = algorithmSelect.value;
    const info = algorithmData[selected];
    
    document.getElementById('complexity').textContent = info.complexity;
    document.getElementById('guarantee').textContent = info.guarantee;
    document.getElementById('algo-description').textContent = info.description;
}

async function visualizeAlgorithm() {
    if (isVisualizationRunning) return;
    
    clearPath();
    isVisualizationRunning = true;
    visualizeBtn.disabled = true;
    
    const startTime = performance.now();
    const algorithm = algorithmSelect.value;
    const startNode = grid[START_NODE.row][START_NODE.col];
    const endNode = grid[END_NODE.row][END_NODE.col];
    
    let visitedNodesInOrder = [];
    
    switch(algorithm) {
        case 'dijkstra':
            visitedNodesInOrder = dijkstra(startNode, endNode);
            break;
        case 'astar':
            visitedNodesInOrder = astar(startNode, endNode);
            break;
        case 'bfs':
            visitedNodesInOrder = bfs(startNode, endNode);
            break;
        case 'dfs':
            visitedNodesInOrder = dfs(startNode, endNode);
            break;
        case 'greedy':
            visitedNodesInOrder = greedy(startNode, endNode);
            break;
    }
    
    const endTime = performance.now();
    executionTimeEl.textContent = `${Math.round(endTime - startTime)}ms`;
    
    await animateAlgorithm(visitedNodesInOrder, endNode);
    
    isVisualizationRunning = false;
    visualizeBtn.disabled = false;
}

async function animateAlgorithm(visitedNodes, endNode) {
    for (let i = 0; i < visitedNodes.length; i++) {
        const node = visitedNodes[i];
        if (!node.isStart && !node.isEnd) {
            node.element.classList.add('visited');
        }
        visitedCountEl.textContent = i + 1;
        await sleep(speed);
    }
    
    const path = getShortestPath(endNode);
    pathLengthEl.textContent = path.length;
    
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (!node.isStart && !node.isEnd) {
            node.element.classList.add('path');
        }
        await sleep(speed * 2);
    }
}

function getShortestPath(endNode) {
    const path = [];
    let currentNode = endNode;
    
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    return path;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < GRID_ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < GRID_COLS - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isWall);
}

function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Algoritmo Dijkstra
function dijkstra(startNode, endNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes();
    
    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        
        if (closestNode === endNode) return visitedNodesInOrder;
        
        updateNeighbors(closestNode);
    }
    
    return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

function updateNeighbors(node) {
    const neighbors = getNeighbors(node);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

// Algoritmo A*
function astar(startNode, endNode) {
    const visitedNodesInOrder = [];
    const openSet = [startNode];
    startNode.distance = 0;
    startNode.heuristic = manhattanDistance(startNode, endNode);
    
    while (openSet.length > 0) {
        openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
        const currentNode = openSet.shift();
        
        if (currentNode.isWall) continue;
        if (currentNode.isVisited) continue;
        
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === endNode) return visitedNodesInOrder;
        
        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;
            
            const tentativeDistance = currentNode.distance + 1;
            
            if (tentativeDistance < neighbor.distance) {
                neighbor.distance = tentativeDistance;
                neighbor.heuristic = manhattanDistance(neighbor, endNode);
                neighbor.previousNode = currentNode;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    
    return visitedNodesInOrder;
}

// Algoritmo BFS
function bfs(startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.isVisited = true;
    
    while (queue.length > 0) {
        const currentNode = queue.shift();
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === endNode) return visitedNodesInOrder;
        
        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }
    
    return visitedNodesInOrder;
}

// Algoritmo DFS
function dfs(startNode, endNode) {
    const visitedNodesInOrder = [];
    const stack = [startNode];
    
    while (stack.length > 0) {
        const currentNode = stack.pop();
        
        if (currentNode.isWall || currentNode.isVisited) continue;
        
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === endNode) return visitedNodesInOrder;
        
        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }
    
    return visitedNodesInOrder;
}

// Algoritmo Greedy Best-First
function greedy(startNode, endNode) {
    const visitedNodesInOrder = [];
    const openSet = [startNode];
    startNode.heuristic = manhattanDistance(startNode, endNode);
    
    while (openSet.length > 0) {
        openSet.sort((a, b) => a.heuristic - b.heuristic);
        const currentNode = openSet.shift();
        
        if (currentNode.isWall || currentNode.isVisited) continue;
        
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        if (currentNode === endNode) return visitedNodesInOrder;
        
        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.heuristic = manhattanDistance(neighbor, endNode);
                neighbor.previousNode = currentNode;
                openSet.push(neighbor);
            }
        }
    }
    
    return visitedNodesInOrder;
}

function getAllNodes() {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// Inicializar aplicação
initializeGrid();
updateAlgorithmInfo();
