
const { notes } = require('./db/db');
const express = require('express');
var cuid = require('cuid');

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



function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

function createNewNote(body, notesArray) {
    // here you set the entirety of the body content to the constant animal
    const animal = body;
    // now you push that object to the end of the animal array
    notesArray.push(animal);
    // we need to save the Javascript array data as JSON,
    // so we use JSON.stringify() to convert it
    fs.writeFileSync(
      path.join(__dirname, '../data/animals.json'),
      JSON.stringify({ animals: notesArray }, null, 2)
    );
  
    return animal;
}

// HTTP GET request for all notes
app.get('/api/notes/', (req, res) => {
    res.json(notes);
});

// HTTP GET request for note with particular id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);

    if(result) {
        res.json(result);
    } else{
        res.status(404).send('Sorry, we cannot find that!')
    }
});

// HTTP POST request to save new note to db.json file
app.post('/api/notes', (req, res) => {
    // set id by calling var cuid
    req.body.id = cuid();
    // req.body is where our incoming content will be
    console.log('req.body is:', req.body);
    res.json(req.body);
  });



// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});