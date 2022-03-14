const { notes } = require('./db/db'); // JSON data file
const express = require('express'); // 3rd-party module
const fs = require('fs'); // built-in Node.js module
const path = require('path'); // built-in Node.js module
var cuid = require('cuid'); // 3rd-party module
// import handleRenderSaveBtn from index.js
// const handleRenderSaveBtn = require('./public/assets/js/index.js')


const PORT = process.env.PORT || 3001;

const app = express();
// The express.urlencoded({extended: true}) method is
// a method built into Express.js. It takes incoming
// POST data and converts it to key/value pairings that
// can be accessed in the req.body object.
// The extended: true option set inside the method call
// informs our server that there may be sub-array data
// nested in it as well, so it needs to look as deep into
// the POST data as possible to parse all of the data correctly.
// The express.json() method we used takes incoming POST 
// data in the form of JSON and parses it into the req.body
// JavaScript object. Both of the below middleware functions
// need to be set up every time you create a server that's 
// looking to accept POST data.
// parse incoming string or array data from POST request sent by client to server
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// provide a file path to the public folder and instruct 
// the server to make these files static resources. This 
// means that all of our front-end code can now be accessed 
// without having a specific server endpoint created for it.
app.use(express.static('public'));


function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}
function createNewNote(body, notesArray) {
    // here you set the entirety of the body content to the constant note
    const note = body;
    // now you push that object to the end of the note array
    notesArray.push(note);
    // use synchronous write file method
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
        // we need to save the note array data as JSON,
        // so we use JSON.stringify() to convert it
      JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}
// ensure user has input note title and text
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    if (!note.text || typeof note.text !== 'string') {
      return false;
    }
    return true;
}


// API route GET request for all notes
app.get('/api/notes/', (req, res) => {
    res.json(notes);
});
// API route GET request for note with particular id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if(result) {
        res.json(result);
    } else{
        res.status(404).send('Sorry, we cannot find that!')
    }
});
// API route POST request to save new note to db.json file
app.post('/api/notes', (req, res) => {
    // set id by calling var cuid
    req.body.id = cuid();
    // req.body is where our incoming content will be
    console.log('Note req.body is:', req.body);
    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send('Make sure to enter a note title and note content.');
    } else {
        // add the new note to the notes array and db.json file
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});


// HTML route GET request for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// HTML route GET request for notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});