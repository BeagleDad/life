var rows = 60;
var cols = 60;

// Keep track of state of game
var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionMS = 100;

function initilizeGrids() {
    for(var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
            
        }
        
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
            
        }
        
    }
}



function initialize() {
    createTable();
    initilizeGrids();
    resetGrids();
    setupControlButtons();
}

function createTable() {
    var gridContainer = document.getElementById("gridContainer");
    if(!gridContainer) {
        // throw error if not found
        //console.error("Problem: no div for the grid table!");
    }
    var table = document.createElement("table");

    for(var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);

}

function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    
    var classes = this.getAttribute("class");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }

}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "_" + j);
            if (grid[i][j] === 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons()
{
    var startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    var clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;

    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

// clear button click handler
function startButtonHandler() {
    if(playing) {
        //console.log("Pause the game");
        playing = false;
        this.innerHTML = "continue";
        clearTimeout(timer);
    } else {
        //console.log("Continue the game");
        playing = true;
        this.innerHTML = "pause";
        play();
    }
    
}

function clearButtonHandler() {
    //console.log("Clear the game: stop playing and clear the grid");
    playing = false;
    var startButton = document.getElementById("start");
    startButton.innerHTML = "start";
    clearTimeout(timer);

    let cellsList = document.getElementsByClassName("live");
    let cells = [];
    
    for (let i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
        
    }

    cells.forEach(element => {
        element.setAttribute("class", "dead");
    });

    resetGrids();
}

function randomButtonHandler() {
    if(!playing) {
        clearButtonHandler();

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.round(Math.random());
                
            }
        }
        updateView();

    }
}

function play() {
    //console.log("Play the game");
    computeNextGen();

    if(playing) {
        timer = setTimeout(play, reproductionMS);
    }

}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
       for (let j = 0; j < cols; j++) {
          // applyRules(i, j);
          applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    // Original
    if (grid[row][col] === 1) {
        // this is a live cell, so 3 rules apply
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors === 2 || numNeighbors === 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] === 0) {
        if (numNeighbors === 3) {
            nextGrid[row][col] = 1;
        }
    }

    // Walled City
    // if (grid[row][col] == 1) {
    //     if (numNeighbors > 3 && numNeighbors < 9) {
    //     nextGrid[row][col] = 1;
    //     } else {
    //     nextGrid[row][col] = 0;
    //     }
    //     } else {
    //     if (numNeighbors > 1 && numNeighbors < 6) {
    //     nextGrid[row][col] = 1;
    //     }
    //     }
}


function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

window.onload = initialize;

