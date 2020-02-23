let $grid;
let board;
let newBoard;
let gameProcess;

function renderGrid(rows, columns) {
  for (let row = 0; row < rows; row++) {
    let $row = document.createElement("div");

    $row.classList.add("row");
    for (let col = 0; col < columns; col++) {
      let $cell = document.createElement("span");
      $cell.classList.add("cell");
      $row.appendChild($cell);
    }
    $grid.appendChild($row);
  }
}

function renderGrid(rows, columns) {
  for (let row = 0; row < rows; row++) {
    let $row = document.createElement("div");

    $row.classList.add("row");
    for (let col = 0; col < columns; col++) {
      let $cell = document.createElement("span");
      $cell.classList.add("cell", `row-${row}`, `col-${col}`);
      $cell.setAttribute("data-row", row);
      $cell.setAttribute("data-col", col);
      $row.appendChild($cell);
    }
    $grid.appendChild($row);
  }
}

function countNeighbors(row, col) {
  let neighbors = 0;
  if (board[row - 1]) {
    neighbors +=
      (board[row - 1][col - 1] || 0) +
      (board[row - 1][col] || 0) +
      (board[row - 1][col + 1] || 0);
  }

  if (board[row + 1]) {
    neighbors +=
      (board[row + 1][col - 1] || 0) +
      (board[row + 1][col] || 0) +
      (board[row + 1][col + 1] || 0);
  }

  return neighbors + (board[row][col - 1] || 0) + (board[row][col + 1] || 0);
}

function getNewValue(row, col) {
  const neighbors = countNeighbors(row, col);

  if (board[row][col]) {
    if (neighbors <= 1 || neighbors >= 4) {
      return 0;
    }
  } else if (neighbors === 3) {
    return 1;
  }

  return board[row][col];
}

function next() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      newBoard[row][col] = getNewValue(row, col);
    }
  }

  board = JSON.parse(JSON.stringify(newBoard));
  render();
}

function start() {
  if (gameProcess) {
    return;
  }

  gameProcess = setInterval(() => {
    var t0 = performance.now();
    next();
    var t1 = performance.now();
    console.log("Call to next took " + (t1 - t0) + " milliseconds.");
  }, 500);
}

function stop() {
  clearInterval(gameProcess);
  gameProcess = undefined;
}

function render() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const fn = board[row][col] ? "add" : "remove";
      $grid
        .getElementsByClassName(`row-${row} col-${col}`)[0]
        .classList[fn]("live");
    }
  }
}

function addEventsToGrid() {
  $grid.addEventListener("click", e => {
    e.stopPropagation();

    if (e.target.classList.contains("cell")) {
      const row = e.target.getAttribute("data-row");
      const col = e.target.getAttribute("data-col");

      const value = 1 - board[row][col];
      board[row][col] = value;
      setValue(row, col, value);

      render();
    }
  });
}

window.onload = function() {
  const rows = 100;
  const columns = 100;
  $grid = document.getElementsByClassName("grid")[0];

  addEventsToGrid();
  renderGrid(rows, columns);

  board = Array.from({ length: rows }, e => Array(columns).fill(0));
  newBoard = JSON.parse(JSON.stringify(board));
};

const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
const importObject = {
  env: {
    abortStackOverflow: () => {
      throw new Error("overflow");
    },
    table: new WebAssembly.Table({
      initial: 2,
      // maximum: 0,
      element: "anyfunc"
    }),
    tableBase: 0,
    memory: memory,
    memoryBase: 1024,
    STACKTOP: 0,
    STACK_MAX: memory.buffer.byteLength,
    emscripten_resize_heap: () => {},
    __lock: () => {},
    __unlock: () => {},
    __handle_stack_overflow: () => {}
  }
};

WebAssembly.instantiateStreaming(fetch("game-of-life.wasm"), importObject).then(
  results => {
    // Do something with the results!
    console.log(results.instance.exports);

    setValue = results.instance.exports.setValue;
    updateBoard = results.instance.exports.updateBoard;
    getValueWA = results.instance.exports.getValue;
    countNeighborsWA = results.instance.exports.countNeighbors;
  }
);

function startWA() {
  if (gameProcess) {
    return;
  }

  gameProcess = setInterval(() => {
    var t0 = performance.now();
    nextWA();
    var t1 = performance.now();
    console.log("WA: Call to next took " + (t1 - t0) + " milliseconds.");
  }, 500);
}

function nextWA() {
  updateBoard();
  renderWA();
}

function renderWA() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const fn = getValueWA(row, col) ? "add" : "remove";
      $grid
        .getElementsByClassName(`row-${row} col-${col}`)[0]
        .classList[fn]("live");
    }
  }
}
