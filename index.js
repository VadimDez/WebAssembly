const express = require("express");
const app = express();

express.static.mime.define({ "application/wasm": "wasm" });
app.use(express.static("src"));

app.listen(8081, () => console.log("Static sever running on port: 8081"));
