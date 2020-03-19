let $grid;
let board;
let newBoard;
let gameProcess;

let jsInstance;
let waInstance;

window.onload = function() {
  const rows = 10;
  const columns = 10;
  $grid = document.getElementsByClassName("grid")[0];

  jsInstance = new JS(rows, columns);

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
    waInstance = new WA(results.instance.exports);
  }
);

class JS {
  constructor(rows, columns) {
    this.addEventsToGrid();
    this.renderGrid(rows, columns);
  }

  renderGrid(rows, columns) {
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

  countNeighbors(row, col) {
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

  getNewValue(row, col) {
    const neighbors = this.countNeighbors(row, col);

    if (board[row][col]) {
      if (neighbors <= 1 || neighbors >= 4) {
        return 0;
      }
    } else if (neighbors === 3) {
      return 1;
    }

    return board[row][col];
  }

  next() {
    console.log("Next pure JS....");
    const t0 = performance.now();
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        newBoard[row][col] = this.getNewValue(row, col);
      }
    }

    board = JSON.parse(JSON.stringify(newBoard));
    this.render();
    const t1 = performance.now();
    console.log("Call to next took " + (t1 - t0) + " milliseconds.");
  }

  start() {
    if (gameProcess) {
      return;
    }

    console.log("Starting pure JS...");

    gameProcess = setInterval(() => {
      this.next();
    }, 500);
  }

  stop() {
    console.log("Stopping...");
    clearInterval(gameProcess);
    gameProcess = undefined;
  }

  render() {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const fn = board[row][col] ? "add" : "remove";
        $grid
          .getElementsByClassName(`row-${row} col-${col}`)[0]
          .classList[fn]("live");
      }
    }
  }

  addEventsToGrid() {
    $grid.addEventListener("click", e => {
      e.stopPropagation();

      if (e.target.classList.contains("cell")) {
        const row = e.target.getAttribute("data-row");
        const col = e.target.getAttribute("data-col");

        const value = 1 - board[row][col];
        board[row][col] = value;
        waInstance.setValue(row, col, value);

        this.render();
      }
    });
  }
}

class WA {
  constructor({ setValue, updateBoard, getValue, countNeighbors }) {
    this.setValue = setValue;
    this.updateBoard = updateBoard;
    this.getValue = getValue;
    this.countNeighbors = countNeighbors;
  }

  start() {
    if (gameProcess) {
      return;
    }

    console.log("Starting with WebAssembly...");

    gameProcess = setInterval(() => {
      this.next();
    }, 500);
  }

  next() {
    console.log("'Next' with WebAssembly...");

    var t0 = performance.now();
    this.updateBoard();
    this.render();
    var t1 = performance.now();
    console.log("Call to Next WA took " + (t1 - t0) + " milliseconds.");
  }

  render() {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const fn = this.getValue(row, col) ? "add" : "remove";
        $grid
          .getElementsByClassName(`row-${row} col-${col}`)[0]
          .classList[fn]("live");
      }
    }
  }
}
