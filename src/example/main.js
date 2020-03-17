fetch("./main2.wasm")
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(results => {
    instance = results.instance;
    const start = performance.now();
    document.getElementById("container").textContent = instance.exports.main();
    const end = performance.now();
    console.log("Total WebAssembly: ", end - start);

    jsLoop();
  })
  .catch(console.error);

function jsLoop() {
  const start = performance.now();

  let a = 0;
  for (let i = 0; i < 10000000; i++) {
    a++;
  }
  document.getElementById("result").textContent = a;
  const end = performance.now();
  console.log("Total JS: ", end - start);
}
