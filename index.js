const express = require("express");
const path = require("path");
const app = express();
const db = require('./db/db');
const port = process.env.PORT || "8080";

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
	res.send("Express 1");
});

require("./routes/index.js")(app);

app.listen(port,() => {
  console.log(`App Listening on ${port}`)
})
