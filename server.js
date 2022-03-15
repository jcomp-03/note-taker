const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const express = require('express'); // 3rd-party module
const path = require('path'); // built-in Node.js module

const PORT = process.env.PORT || 3001;

const app = express();
// The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming
// POST data and converts it to key/value pairings that can be accessed in the req.body object.
// The extended: true option set inside the method call informs our server that there may be sub-array data
// nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
// The express.json() method we used takes incoming POST  data in the form of JSON and parses it into the req.body
// JavaScript object.
// Both of the below middleware functions need to be set up every time you create a server that's 
// looking to accept POST data. parse incoming string or array data from POST request sent by client to server
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// provide a file path to the public folder and instruct the server to make these files static resources.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now listening on port ${PORT}!`);
});