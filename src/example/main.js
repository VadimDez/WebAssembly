// One way of loading wasm modules

// const memory = new WebAssembly.Memory({ initial: 128, maximum: 128 });
// const importObject = {
//   env: {
//     abortStackOverflow: () => {
//       throw new Error("overflow");
//     },
//     table: new WebAssembly.Table({
//       initial: 2,
//       // maximum: 0,
//       element: "anyfunc"
//     }),
//     tableBase: 0,
//     memory: memory,
//     memoryBase: 512,
//     STACKTOP: 0,
//     STACK_MAX: memory.buffer.byteLength,
//     emscripten_resize_heap: () => {},
//     __lock: () => {},
//     __unlock: () => {},
//     __handle_stack_overflow: () => {}
//   }
// };

// WebAssembly.instantiateStreaming(fetch("main.wasm"), importObject)
//   .then(results => {
//     wsLoop(results.instance.exports.main);
//     jsLoop();
//   })
//   .catch(console.error);

// Different way of loading wasm modules

fetch("./main.wasm")
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(results => {
    wsLoop(results.instance.exports.main);
    jsLoop();
  })
  .catch(console.error);

const number = 10_000_000;

function wsLoop(fn) {
  const start = performance.now();
  document.getElementById("container").textContent = fn(number);
  const end = performance.now();
  console.log("Total WebAssembly: ", end - start);
}

function jsLoop() {
  const start = performance.now();

  let a = 0;
  for (let i = 0; i < number; i++) {
    a++;
  }
  document.getElementById("result").textContent = a;
  const end = performance.now();
  console.log("Total JS: ", end - start);
}
