const express = require("express");
const path = require("path");
const app = express();

// Khai báo thư mục public
app.use(express.static(path.join(__dirname, '/src/static/')));
app.use(express.static(path.join(__dirname, '/build/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/main.html"));
})

const server = app.listen(5000);
const portNumber = server.address().port;
console.log(`port is open on ${portNumber}`);