
let grid = createGrid();
let htmlElements = [];
let play = false;
let speed = 50;

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value / 100; // Display the default slider value

let T = slider.value / 100;

let belowButton = document.querySelector(".below-button");
belowButton.addEventListener("click", function() {
    // set slider, text, T to certain value;
    output.innerHTML = 0;
    slider.value = 0 * 100;
    T = 0;
});

let justButton = document.querySelector(".just-button");
justButton.addEventListener("click", function() {
    // set slider, text, T to certain value;
    output.innerHTML = 2.269;
    slider.value = 2.269 * 100;
    T = 2.269
});

let aboveButton = document.querySelector(".above-button");
aboveButton.addEventListener("click", function() {
    // set slider, text, T to certain value;
    output.innerHTML = 4;
    slider.value = 4 * 100;
    T = 4;
});

let playButton = document.querySelector(".play-button");
playButton.addEventListener("click", function() {
    play = !play;
    if (play) {
        playButton.textContent = "Pause";
    } else {
        playButton.textContent = "Play";
    }
});

function setRandomGrid() {
    // set current grid into 1/0 by random
    let newGrid = createGrid()
    const N = newGrid.length;
    const M = newGrid[0].length;

    for (let j = 0; j < N; j++) { // vertical
        for (let i = 0; i < M; i++) { // horizontal
            if (Math.random() > 0.5) {
                newGrid[j][i] = 1
            } else {
                newGrid[j][i] = -1
            }
        }
    }
    grid = newGrid;
}

function createGrid(n=100, m=100) {
    // return a array of array
    let rows = [];
    for (let j = 1; j <= n; j++) { // vertical
        let row = [];
        for (let i = 1; i <= m; i++) {
            row.push(false) // horizontal
        }
        rows.push(row);
    }
    return rows;
}

function bc(n) {
    const N = grid.length;
    if (n > N-1) {
        return 0
    } else if (n < 0) {
        return N-1 // last cell
    } else {
        return n
    }
}

function calculateNeighborEnergy(x, y, flip=false) {
    const N = grid.length;
    const M = grid[0].length;

    let top = grid[bc(y-1)][x];
    let bottom = grid[bc(y+1)][x];
    let left = grid[y][bc(x-1)];
    let right = grid[y][bc(x+1)];

    let energy = -1 * grid[y][x] * (top + bottom + left + right);
    if (flip) {
        energy = -1 * energy;
    }
    return energy
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextGrid() {
    // given current state
    // return next state
    let newGrid = grid.slice(); // deep copy
    const N = newGrid.length;
    const M = newGrid[0].length;

    // randomly select a cell, y, x
    let y = getRandomInt(0, N-1);
    let x = getRandomInt(0, M-1);

    let currentEnergy = calculateNeighborEnergy(x, y, false)
    let newEnergy = calculateNeighborEnergy(x, y, true)
    let energyDiff = newEnergy - currentEnergy;
    if (energyDiff <= 0) {
        grid[y][x] = - 1 * grid[y][x]
    } else {
        let prob = Math.exp(-energyDiff/T);
        if (Math.random() <= prob) {
            grid[y][x] = - 1 * grid[y][x]
        }
    }
    return newGrid
}

function drawTable() {
    // given 2D array, create table in HTML accordingly 
    const N = grid.length;
    const M = grid[0].length;
    var table = document.getElementById('board');
    
    for (let j = 0; j < N; j++) {
        var tr = document.createElement('tr');
        var tdElements = []
        for (let i = 0; i < M; i++) {
            var td = document.createElement('td');
            td.setAttribute('class', 'cell empty')
            td.setAttribute('y', j)
            td.setAttribute('x', i)
            tdElements.push(td);
            tr.appendChild(td);
        }
        htmlElements.push(tdElements);
        table.appendChild(tr);
    }
}

function updateTable() {
    // given new 2D array, update the table color accordingly
    const N = grid.length;
    const M = grid[0].length;
    for (let j = 0; j < N; j++) {
        for (let i = 0; i < M; i++) {
            if (grid[j][i] == 1) {
                htmlElements[j][i].setAttribute('class', 'cell up')
            } else {
                htmlElements[j][i].setAttribute('class', 'cell down')
            }
            
        }
    }
}
function newGeneration() {
    if (play) {
        for (let d = 0; d <= 200; d++) {``
            grid = nextGrid();
        }
        updateTable()
    }
    window.setTimeout(newGeneration, 10);
}
drawTable()
setRandomGrid();
updateTable();


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value / 100;
  T = this.value / 100
}

newGeneration();