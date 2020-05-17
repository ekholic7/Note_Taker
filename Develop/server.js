const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;
const mainDirectory = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDirectory, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let notesSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(notesSave[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDirectory, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let notesSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (notesSave.length).toString();
    newNote.id = uniqueID;
    notesSave.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(notesSave));
    console.log("Note saved. Content: ", newNote);
    res.json(notesSave);
})

app.delete("/api/notes/:id", function(req, res) {
    let notesSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    notesSave = notesSave.filter(currentNote => {
        return currentNote.id != noteID;
    })
    
    for (currentNote of notesSave) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(notesSave));
    res.json(notesSave);
})

app.listen(port, function() {
    console.log(`Now listening to port ${port}.`);
})