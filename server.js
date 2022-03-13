
const { notes } = require('./db/db');
const express = require('express');
var cuid = require('cuid');

const PORT = process.env.PORT || 3001;

const app = express();


function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// HTTP GET request for all notes
app.get('/api/notes/', (req, res) => {
    res.json(notes);
});

// HTTP GET request for note with particular id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    console.log(req.params);
    if(result) {
        res.json(result);
    } else{
        res.status(404).send('Sorry, we cannot find that!')
    }
});


// HTTP POST request to save new note to db.json file
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    res.json(req.body);
  });

// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});