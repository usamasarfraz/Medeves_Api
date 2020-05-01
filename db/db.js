const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/medeves", { useNewUrlParser: true });

mongoose.connection.once("open", () => console.log("Mongoose Database Connected Successfully.")).on("error", (error) => {
    console.log("Database Error: ",error)
});

module.exports = mongoose;