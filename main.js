const inputBooks = [];
const RENDER_BOOK_SUBMIT_EVENT = 'render-book-submit-event';
const SAVED_BOOK_EVENT = 'save-book-submit-event';
const STORAGE_BOOK_KEY = 'BOOKSHELF-APPS';

function inputBook() {
  const inputBookTitle = document.getElementById('inputBookTitle').value;
  const inputBookAuthor = document.getElementById('inputBookAuthor').value;
  const inputBookYear = document.getElementById('inputBookYear').value;
  const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
  const generatedIDBook = generateIDBook();
  const inputBookObject = generateinputBookObject(generatedIDBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
  inputBooks.push(inputBookObject);
  document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  saveBook()
}
function generateIDBook() {
  return +new Date();
}
function generateinputBookObject(generatedIDBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
  return {
    generatedIDBook,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete,
  };
}
// Ubah menjadi makeBook dan hapus salah satu function
function makeBook(inputBookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = 'Judul:' + inputBookObject.inputBookTitle;
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + inputBookObject.inputBookAuthor;
  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun: ' + inputBookObject.inputBookYear;
  const bookItem = document.createElement('article');
  // hapus element div
  bookItem.classList.add('book_item');
  bookItem.append(bookTitle, bookAuthor, bookYear);
  bookItem.setAttribute('generatedIDBook', `${inputBookObject.generatedIDBook}`); // Ubah set attributes menjadi seperti ini
  // Pindahkan completedButton keluar dari if-else
  const completedButton = document.createElement('button');
  completedButton.classList.add('green');
  if (inputBookObject.inputBookIsComplete) {
    // Ketika buku bernilai true artinya selesai dibaca
    completedButton.innerText = 'Belum Selesai Dibaca';
    completedButton.addEventListener('click', function () {
      undoBookFromCompleted(inputBookObject.generatedIDBook); //Panggil undo untuk mengubah state ke belum dibaca

    });
  } else {
    // Ketika buku bernilai false artinya belum selesai dibaca
    completedButton.innerText = 'Selesai Dibaca';
    completedButton.addEventListener('click', function () {
      addBookToCompleted(inputBookObject.generatedIDBook); //Panggil add untuk mengubah state ke sudah dibaca
    });
  }
  // Keluarkan element erase dari if-else
  const eraseButton = document.createElement('button');
  eraseButton.classList.add('red');
  eraseButton.innerText = 'Hapus';
  eraseButton.addEventListener('click', function () {
    eraseBookFromCompleted(inputBookObject.generatedIDBook); 

  });
  // Button container juga dikeluarkan
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  buttonContainer.append(completedButton, eraseButton);
  bookItem.append(buttonContainer);
  return bookItem;
}
function findBooks(bookId) {
  for (const booksItem of inputBooks) {
    // Typo seharusnya generatedIDBook
    if (booksItem.generatedIDBook === bookId) {
      return booksItem;
    }
  }
  // hapus return null
}
function addBookToCompleted(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget == null) return;
  bookTarget.inputBookIsComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  saveBook();
}
function undoBookFromCompleted(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget == null) return;
  bookTarget.inputBookIsComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  saveBook();
}
function eraseBookFromCompleted(bookId) {
  const bookTarget = findBooks(bookId);
  if (bookTarget === -1) return;
  inputBooks.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  saveBook();
}
// Submit Input Form
// Pindahkan ke sebelum RENDER_BOOK_SUBMIT_EVENT
document.addEventListener('DOMContentLoaded', function () {
  const submitInputBook = document.getElementById('inputBook');
  submitInputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    inputBook();
  });
  if (bookStorageExist()) {
    loadBookFromStorage();
  }
});

document.addEventListener(RENDER_BOOK_SUBMIT_EVENT, function () {
  const incompletedBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';
  const completedBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
  for (const bookItem of inputBooks) {
    const bookElement = makeBook(bookItem); // Cukup gunakan salah satu dan panggil makeBook()
    if (!bookItem.inputBookIsComplete) incompletedBookshelfList.append(bookElement);
    else completedBookshelfList.append(bookElement);
  }
});

// 5. local storage

//function check storage
function saveBook() {
  if (bookStorageExist()) {
    const parsed = JSON.stringify(inputBooks);
    localStorage.setItem(STORAGE_BOOK_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK_EVENT));
  }
}

function bookStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_BOOK_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_BOOK_KEY));
});

function loadBookFromStorage() {
  const bookData = localStorage.getItem(STORAGE_BOOK_KEY);
  let data = JSON.parse(bookData);
 
  if (data !== null) {
    for (const book of data) {
      inputBooks.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
}
