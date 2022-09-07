// Calling on the top-level express object's Router() method
// to create a new router object
const router = require('express').Router();
const { findById, getNoteIndex, validateNote } = require('../../lib/noteFunctions.js');
const fs = require('fs');
var cuid = require('cuid'); // 3rd-party module
const path = require('path'); // built-in Node.js module

// API route GET request for all notes
router.get('/notes/', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, jsonData) => {
        if(err) throw err;
        const { notes } = JSON.parse(jsonData); // notes is now an array of note objects
        res.json(notes);
    });
});

// API route GET request for note with particular id
router.get('/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, jsonData) => {
        if(err) throw err;
        const { notes } = JSON.parse(jsonData); // notes is now an array of note objects
        const result = findById(req.params.id, notes);
        if(result) {
            res.json(result);
        } else{
            res.status(404).send('Sorry, we cannot find that note id!')
        }
    });
});

// API route POST request to save new note to db.json file
router.post('/notes/', (req, res) => {
    // set id by calling var cuid
    req.body.id = cuid();
    // req.body is where our incoming content will be
    console.log('Note req.body is:', req.body);
    // if title or note text is missing, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send('Make sure to enter a note title and note content.');
    } else {
        // destructure req.body properties into the corresponding variables
        const { title, text, id } = req.body;
        // note object we'll save to db.json in a moment
        const newNote = {
            title: title,
            text: text,
            id: id
        };
        // read the db.json file and assign parsed contents to constant notes
        // constant notes becomes an array of note objects after file read
        fs.readFile('./db/db.json', 'utf8', (err, jsonData) => {
            if (err) throw err;
            const { notes } = JSON.parse(jsonData);
            // push newNote to notes
            notes.push(newNote);
            // finally write back to the file db.json the notes array, stringified...
            const stringifiedData = JSON.stringify({ notes: notes }, null, 2);
            fs.writeFile('./db/db.json', stringifiedData, (err) => {
                if (err) throw err;
                // send back json response to HTTP request
                res.json(notes);
            });
        });
    }
});

// API route DELETE request to delete note with particular id
router.delete('/notes/:id', (req, res) => {
    // store the request object's property id in const noteId
    const noteId = req.params.id;
    // use synchronous readFile method
    const jsonData = fs.readFileSync('./db/db.json', 'utf8');
    // console.log('jsonData is', jsonData);
    const {notes} = JSON.parse(jsonData);
    // console.log('notes is', notes);
    // run getNoteIndex function to find the index in the notes array
    // of the note we want to delete 
    const unwantedNoteIndex = getNoteIndex(noteId, notes);
    // update notes array, removing the note element with
    // the index we just found in the line above
    notes.splice(unwantedNoteIndex, 1);
    console.log('After deletion, notes array now looks like', notes);
    res.json(notes);
    // use synchronous writeFile method
    fs.writeFileSync(
        path.join(__dirname, '../../db/db.json'),
        // we need to save the note array data as JSON,
        // so we use JSON.stringify() to convert it to
        // JSON format
        JSON.stringify({ notes: notes }, null, 2)
    );
});

module.exports = router;