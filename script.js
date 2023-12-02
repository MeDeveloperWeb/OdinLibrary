const book_form = document.querySelector("form.add-book-form");
const shelf = document.querySelector(".book-cont");
const book_shelves = document.querySelector(".shelf-cont");

const form_viewer = document.querySelector("button.get-form");

const book_viewer = document.querySelector(".book-viewer");

// Color for books
const bookColor = [
    "brown",
    "green",
    "yellow",
    "blue"
]

let curr_book_color;

let book_in_preview;

form_viewer.addEventListener("click", () => {
    book_form.style.visibility = "visible";
    form_viewer.style.visibility = "hidden";
})

book_form.onsubmit = (e) => {
    e.preventDefault();
    book_form.style.visibility = "hidden";
    form_viewer.style.visibility = "visible";

    // Form Data
    let data = book_form.querySelectorAll("input:not([type='submit'])");
    data = formatFormData(data);

    let book = addBookToLibrary(data);

    if (book) addBookOnUI(book);
    // If book not added
    else alert("Full")
}

book_shelves.addEventListener("click", (e) => {
    // If clicked on a book in shelf
    if (e.target.classList.contains("book")) {
        // If another book is already being viewed
        if (book_in_preview) {
            // Show previous book in shelf
            document.getElementById(book_in_preview).style.visibility = "visible";
        }
        // Show the book-viewer
        book_viewer.style.visibility = "visible";
        // Hide current book from Shelf
        e.target.style.visibility = "hidden";
        book_in_preview = e.target.id
        // Show book in preview
        previewBook(myLibrary[+book_in_preview]);
    }
});

// If user changes Read status 
document.querySelector("#have-read").addEventListener("change", (e) => {
    myLibrary[book_in_preview].read = e.target.checked;
    document.getElementById(book_in_preview).setAttribute("is-read", e.target.checked ? "✓" : "");
})

document.querySelector(".book-viewer button.return").addEventListener("click", () => {
    document.getElementById(book_in_preview).style.visibility = "visible";
    book_viewer.style.visibility = "hidden";
});

document.querySelector(".book-viewer button.remove").addEventListener("click", () => {
    removeBookFromLibrary(book_in_preview);
    book_in_preview = "";
    book_viewer.style.visibility = "hidden";
    showChangesOnUI();
});

window.onresize = () => showChangesOnUI();

/**
 * 
 * @param {NodeList} nodeList List of input elements
 * @returns {Object} Form data in form of Dictionary
 */
function formatFormData(nodeList) {

    let data = {};
    for (const each of nodeList) {
        if (each.name === "read") data[each.name] = each.checked;

        else {
            data[each.name] = each.value;
            each.value = "";
        }
        
    }
    return data;
}

/**
 * Delete all existing books from UI.
 * Creates all the books in the UI
 */
function showChangesOnUI() {
    let col_size = getComputedStyle(shelf).getPropertyValue("grid-template-columns").split(" ").length;

    document.querySelectorAll(".book-cont").forEach(el => el.replaceChildren());

    myLibrary.forEach((book, i) => {
        let new_book = document.createElement("div");
        new_book.className = "book " + book.color;
        new_book.id = i;
        if (book.read) new_book.setAttribute("is-read", "✓");
        new_book.innerText = book.name;

        let row_num = Math.floor(i / col_size) + 1;

        let row_id = `#shelf${row_num < 10 ? '0' + row_num : row_num}`;

        const row = document.querySelector(row_id);
        if (row) row.appendChild(new_book);  
        
    });
}

/**
 * Adds book to the Shelf
 * @param {Book} book Book data to be added
 */
function addBookOnUI(book) {
    const id = myLibrary.length;
    const col_size = getComputedStyle(shelf).getPropertyValue("grid-template-columns").split(" ").length;

    // Book HTML element
    let new_book = document.createElement("div");
    new_book.className = "book " + book.color;
    new_book.id = id;
    new_book.innerText = book.name;
    if (book.read) new_book.setAttribute("is-read", "✓");

    // Shelf row
    let row_num = Math.floor(id / col_size) + 1;

    let row_id = `#shelf${row_num < 10 ? '0' + row_num : row_num}`;

    // Append Book
    document.querySelector(row_id).appendChild(new_book);

}

/**
 * @returns {String} Random Color from bookColor
 */
function getRandomColor() {
    let n;
    do {
        n = Math.floor(Math.random() * 4);
    }
    // Prevent same color as previous book
    while (n === curr_book_color);
    curr_book_color = n;

    return bookColor[n];
}

/**
 * Shows book preview on UI
 * @param {Book} book 
 */
function previewBook(book) {
    const book_cont = document.querySelector(".book-viewer");

    for (prop in book) {
        if (prop === "read") book_cont.querySelector("."+prop).checked = book[prop];
        else if (prop === "color") book_cont.querySelector(".book-preview").className = "book-preview " + book[prop];
        else book_cont.querySelector("."+prop).innerText = book[prop];
    }
}

const myLibrary = [];

function Book(name, author, pages, read) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.color = getRandomColor();
}

function addBookToLibrary({name, author, pages, read}) {
    let size = getComputedStyle(shelf).getPropertyValue("grid-template-columns").split(" ").length * 12;

    if (myLibrary.length >= size) return null;
    let book = new Book(name, author, pages, read);
    myLibrary.push(book);
    return book;
}

function removeBookFromLibrary(id) {
    let book = myLibrary[id];
    myLibrary.splice(+id, 1);
    return book;
}

/*************************************************************************************************************************************************************** */

//Testing purposes

// Function to generate a random book name
function generateRandomName() {
    const adjectives = ['Amazing', 'Fantastic', 'Incredible', 'Mysterious', 'Enchanting'];
    const nouns = ['Adventure', 'Mystery', 'Journey', 'Discovery', 'Quest'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} Book`;
}

// Function to generate a random author name
function generateRandomAuthor() {
    const firstNames = ['John', 'Emma', 'Daniel', 'Sophia', 'Michael'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Function to create a random book object
function createRandomBook() {
    const name = generateRandomName();
    const author = generateRandomAuthor();
    const pages = Math.floor(Math.random() * 300) + 100; // Random number of pages between 100 and 399
    const read = Math.random() < 0.5; // Randomly set read status to true or false
    return new Book(name, author, pages, read);
}

// Create 20 random book objects and add them to the library
for (let i = 0; i < 50; i++) {
    const randomBook = createRandomBook();
    myLibrary.push(randomBook);
}

showChangesOnUI();
