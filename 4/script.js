const now = new Date();
console.log(now.toLocaleString());

const Title = document.querySelector("#title")
const content = document.querySelector("#content")
const myColor = document.querySelector("#myColor")
const button = document.querySelector("#submitButton")
const notesContainer = document.querySelector("#notes")
const pinNotesContainer = document.querySelector("#pinNotes")
let notes = []



myColor.addEventListener("change", () => {
    button.style.backgroundColor = myColor.value
    isColorTooDark(myColor.value) ? button.style.color = "white" : button.style.color = "black";
    
})

function addNoteToPage(note) {
    const noteDiv = document.createElement("div")
    noteDiv.classList.add("note")
    noteDiv.style.backgroundColor = note.color

    const noteTitleDiv = document.createElement("div")
    noteTitleDiv.classList.add("noteTitle")

    const titleHeader = document.createElement("h4")
    const titleBold = document.createElement("b")
    titleBold.textContent = note.title
    titleHeader.appendChild(titleBold)
    noteTitleDiv.appendChild(titleHeader)

    const contentParagraph = document.createElement("p")
    contentParagraph.textContent = note.content
    const dateParagraph = document.createElement("p")
    dateParagraph.textContent = note.createDate.toLocaleString()

    const closeButton = document.createElement("button")
    closeButton.textContent = "x";
    closeButton.classList.add("close-button")
    closeButton.style.backgroundColor = "red"
    closeButton.addEventListener("click", (event) => {
      event.stopPropagation()
      removeNote(note, noteDiv)
    });

    const pinButton = document.createElement("button")
    pinButton.textContent = note.pinNote ? "Unpin" : "Pin"
    pinButton.classList.add("pin-button")
    pinButton.addEventListener("click", (event) => {
        event.stopPropagation()
        togglePinNote(note, noteDiv)
    });



    noteDiv.appendChild(closeButton)
    noteDiv.appendChild(pinButton)
    noteDiv.appendChild(noteTitleDiv)
    noteDiv.appendChild(contentParagraph)
    noteDiv.appendChild(dateParagraph)

    const targetContainer = note.pinNote ? pinNotesContainer : notesContainer;
    targetContainer.appendChild(noteDiv);

    isColorTooDark(note.color) 
        ? noteDiv.style.color = "white" 
        : noteDiv.style.color = "black"

    content.value = ""
    Title.value = ""
}

function removeNote(noteToRemove, noteDiv) {
    notes = notes.filter((note) => note !== noteToRemove);
    localStorage.setItem("notes", JSON.stringify(notes));
    noteDiv.remove();
  }



  function togglePinNote(noteToToggle, noteDiv) {
    noteToToggle.pinNote = !noteToToggle.pinNote;
    localStorage.setItem("notes", JSON.stringify(notes)); // Update local storage
  
    const targetContainer = noteToToggle.pinNote ? pinNotesContainer : notesContainer;
    targetContainer.appendChild(noteDiv);
  
    const pinButton = noteDiv.querySelector(".pin-button");
    pinButton.textContent = noteToToggle.pinNote ? "Unpin" : "Pin";
  }



button.addEventListener("click", () =>{
    const newNote = {
        title: Title.value,
        content: content.value,
        color: myColor.value,
        createDate: new Date(),
        pinNote: false,
    }
    notes.push(newNote);
    addNoteToPage(newNote);

    const jsonNotes = JSON.stringify(notes);
    
    console.log(jsonNotes);

    localStorage.setItem("notes", jsonNotes);
})



const storedNotes = localStorage.getItem("notes");
if (storedNotes) {
  notes = JSON.parse(storedNotes);
  notes.forEach((note) => addNoteToPage(note));
}

// const jsonNotes = JSON.stringify(notes);
// console.log(jsonNotes);








//this function I found on internet, don't know how it works xD
function isColorTooDark(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
  
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    // Adjust the threshold as needed (0.5 is a good starting point)
    const darknessThreshold = 0.5;
  
    // Return true if the color is too dark
    return luminance < darknessThreshold;
  }