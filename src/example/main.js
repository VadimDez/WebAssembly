fetch('./main.wasm').then(response =>
  response.arrayBuffer()
).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
  instance = results.instance;
  let start = new Date().getTime();
  document.getElementById("container").textContent = instance.exports.main();
  console.log("Total: ", new Date().getTime() - start);
}).catch(console.error);

let start = new Date().getTime();

let a = 0;
for (let i = 0; i < 10000000; i++) {
  a++;
}
document.getElementById("result").textContent = a;
console.log("Total js: ", new Date().getTime() - start);