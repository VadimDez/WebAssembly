const express = require("express");
const app = express();
const PORT = 8080;

express.static.mime.define({ "application/wasm": "wasm" });
app.use(express.static("src"));

app.listen(PORT, () => console.log(`Static sever running on port: ${PORT}`));
