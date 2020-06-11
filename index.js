const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const db = require('./db/db');
let io = require("./sockets/sockets");
const port = process.env.PORT || "8080";
const server = http.createServer(app);
io.listen(server);
app.use(express.json({ limit: "1gb" }));
app.use(
	express.urlencoded({
		limit: "1gb",
		extended: false,
		parameterLimit: 100000000
	})
);

app.use(express.static(path.join(__dirname, "./")));

// routes
app.get("/", function(req, res) {
	res.send("Express updated");
});

require("./routes/index.js")(app);

server.listen(port,() => {
  console.log(`App Listening on ${port}`)
})
