// find a note with a particular id and return the note object
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// get the index of a note with a particular id and return the index
function getNoteIndex(id, notesArray) {
    const noteIndex = notesArray.findIndex(note => note.id === id);
    return noteIndex;
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

module.exports = {
    findById,
    getNoteIndex,
    validateNote
};