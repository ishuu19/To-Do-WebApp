const addButton = document.querySelector(".add");
const textarea = document.querySelector(".note");
const section2 = document.querySelector(".section2");

addButton.addEventListener("click", () => {
    const noteText = textarea.value.trim();
    if (noteText) {
        createNoteCard(noteText);
        textarea.value = "";
        saveNotesToLocalStorage();
    }
});

function createNoteCard(noteText) {
    const card = document.createElement("div");
    card.className = "card";
    
    const currentTime = new Date();
    const timeString = getTimeAgo(currentTime);
    
    card.innerHTML = `
        <p class="note-text">${noteText}</p>
        <div class="card-footer">
            <span class="time">${timeString}</span>
            <div class="card-actions">
                <input type="checkbox" class="check" />
                <button class="edit">✏️</button>
                <button class="delete">⛌</button>
            </div>
        </div>
    `;
    
    addCardEventListeners(card);
    
    section2.appendChild(card);
}

function addCardEventListeners(card) {
    const noteText = card.querySelector(".note-text");
    const checkButton = card.querySelector(".check");
    const editButton = card.querySelector(".edit");
    const deleteButton = card.querySelector(".delete");
    const cardFooter = card.querySelector(".card-footer");
    
    checkButton.addEventListener("change", () => {
        noteText.classList.toggle("done", checkButton.checked);
    });
    
    editButton.addEventListener("click", () => {
        const originalText = noteText.textContent;
        
        cardFooter.querySelector(".check").style.display = "none";
        cardFooter.querySelector(".edit").style.display = "none";
        cardFooter.querySelector(".delete").style.display = "none";
        
        noteText.contentEditable = true;
        noteText.focus();
        
        const saveButton = document.createElement("button");
        saveButton.textContent = "✔";
        saveButton.className = "save";
        
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "⛌";
        cancelButton.className = "cancel";
        
        cardFooter.appendChild(saveButton);
        cardFooter.appendChild(cancelButton);
        
        saveButton.addEventListener("click", () => {
            noteText.contentEditable = false;
            saveNotesToLocalStorage();
            
            cardFooter.querySelector(".check").style.display = "block";
            cardFooter.querySelector(".edit").style.display = "block";
            cardFooter.querySelector(".delete").style.display = "block";
            
            saveButton.remove();
            cancelButton.remove();
        });
        
        cancelButton.addEventListener("click", () => {
            noteText.contentEditable = false;
            noteText.textContent = originalText;
            
            cardFooter.querySelector(".check").style.display = "block";
            cardFooter.querySelector(".edit").style.display = "block";
            cardFooter.querySelector(".delete").style.display = "block";
            
            saveButton.remove();
            cancelButton.remove();
        });
    });
    
    deleteButton.addEventListener("click", () => {
        card.remove();
        saveNotesToLocalStorage();
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 min ago";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
}

function saveNotesToLocalStorage() {
    const cards = document.querySelectorAll(".card");
    const notes = [];
    
    cards.forEach(card => {
        const noteText = card.querySelector(".note-text").textContent;
        const isDone = card.querySelector(".check").checked;
        const timeElement = card.querySelector(".time");
        const timeText = timeElement ? timeElement.textContent : "Just now";
        
        notes.push({
            text: noteText,
            done: isDone,
            time: timeText
        });
    });
    
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        notes.forEach(note => {
            createNoteCard(note.text);
            const lastCard = section2.lastElementChild;
            const checkButton = lastCard.querySelector(".check");
            const noteText = lastCard.querySelector(".note-text");
            
            if (note.done) {
                checkButton.checked = true;
                noteText.classList.add("done");
            }
        });
    }
}

loadNotesFromLocalStorage();


const textArea = document.querySelector(".note");
const button = document.querySelector(".add");

textArea.addEventListener("keydown", (e) => {
  if(e.key==="Enter"){
    e.preventDefault();
    button.click();
  }
})



