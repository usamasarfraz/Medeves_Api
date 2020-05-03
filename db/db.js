const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://usama:erpNmPOYBN7wQtHy@cluster0-8ltz9.mongodb.net/medeves?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => console.log("Mongoose Database Connected Successfully.")).on("error", (error) => {
    console.log("Database Error: ",error)
});

module.exports = mongoose;