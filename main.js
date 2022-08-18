//1. Menambahkan Data Buku
 
const inputBooks = [];
const RENDER_BOOK_SUBMIT_EVENT = 'render-book-submit-event';
 
// Submit Input Form
document.addEventListener('DOMContentLoaded', function () {
    const submitInputBook = document.getElementById('inputBook');
    submitInputBook.addEventListener('submit', function (event) {
      event.preventDefault();
      inputBook();
    });
  });
 
//function inputBook
 
 
function inputBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
 
    const generatedIDBook = generateIDBook();
    const inputBookObject = generateinputBookObject(generatedIDBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    inputBooks.push(inputBookObject);
 
    document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  };
 
  function generateIDBook() {
    return +new Date();
  }
 
  function generateinputBookObject(generatedIDBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
    return {
        generatedIDBook,
        inputBookTitle,
        inputBookAuthor,
        inputBookYear, 
        inputBookIsComplete
    }
  }
 
  //2. Memiliki dua Rak Buku
 
  function rakBelumSelesaiDibaca(inputBookObject) {
 
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = "Judul:" + inputBookObject.inputBookTitle;
 
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + inputBookObject.inputBookAuthor;
 
    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + inputBookObject.inputBookYear;
 
    const bookItem = document.createElement('article');
    const action = document.createElement('div');
 
    bookItem.classList.add('book_item');
    action.classList.add('action');
 
    bookItem.append(bookTitle, bookAuthor, bookYear, action);
    bookItem.setAttribute('generateIDBook', 'inputBook-$(inputBookObject.generatedIDBook')
 
    if (!inputBookObject.inputBookIsComplete) {
 
      const uncompletedButton = document.createElement('button');
      uncompletedButton.classList.add('green');
      uncompletedButton.innerText = "Sudah Selesai Dibaca?";
 
      uncompletedButton.addEventListener('click', function () {
        undoBookFromCompleted(inputBookObject.generateIDBook);
      });
 
      const eraseButton = document.createElement('button');
      eraseButton.classList.add('red');
      eraseButton.innerText = "Hapus";
 
      eraseButton.addEventListener('click', function () {
        eraseBookFromCompleted(inputBookObject.generateIDBook);
      });
 
      action.append(uncompletedButton, eraseButton);
    }
 
    else {
 
      const checkBookButton = document.createElement('button');
      checkBookButton.classList.add('green');
 
      checkBookButton.addEventListener('click', function () {
        addBookToCompleted(inputBookObject.generateIDBook);
      });
 
      bookItem.append(checkBookButton);
 
    }
 
    return bookItem;
  }
 
  function rakSudahSelesaiDibaca(inputBookObject) {
 
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = "Judul:" + inputBookObject.inputBookTitle;
 
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + inputBookObject.inputBookAuthor;
 
    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + inputBookObject.inputBookYear;
 
    const bookItem = document.createElement('article');
    const action = document.createElement('div');

    bookItem.classList.add('book_item');
    bookItem.append(bookTitle, bookAuthor, bookYear, action);
    bookItem.setAttribute('generateIDBook', 'inputBook-$(inputBookObject.generatedIDBook')
 
    if (inputBookObject.inputBookIsComplete) {
 
      const uncompletedButton = document.createElement('button');
      uncompletedButton.classList.add('green');
      uncompletedButton.innerText = "Belum Selesai Dibaca";
 
      uncompletedButton.addEventListener('click', function () {
        undoBookFromCompleted(inputBookObject.generateIDBook);
      });
 
      const eraseButton = document.createElement('button');
      eraseButton.classList.add('red');
      eraseButton.innerText = "Hapus Buku";
 
      eraseButton.addEventListener('click', function () {
        eraseBookFromCompleted(inputBookObject.generateIDBook);
      });
 
      action.append(uncompletedButton, eraseButton);
    }
 
    else {
 
      const checkBookButton = document.createElement('button');
      checkBookButton.classList.add('check-button', 'action', 'green');
 
      checkBookButton.addEventListener('click', function () {
        addBookToCompleted(inputBookObject.generateIDBook);
      });
 
      bookItem.append(checkBookButton);
 
    }
 
    return bookItem;
  }
 
  function addBookToCompleted(bookId) {
    const bookTarget = findBooks(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.inputBookIsComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK_SUBMIT_EVENT));
  }
 
  function findBooks(bookId) {
 
    for (const booksItem of inputBooks) {
      if (booksItem.generateIDBook === bookId) {
        return booksItem;
      }
    }
    return null;
  }
 
  document.addEventListener(RENDER_BOOK_SUBMIT_EVENT, function () {
    const incompletedBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
 
    const completedBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
 
    for (const bookItem of inputBooks) {
      const incompleteBookElement = rakBelumSelesaiDibaca(bookItem);
      const completeBookElement = rakSudahSelesaiDibaca(bookItem);
 
      if (!bookItem.inputBookIsComplete) {
        incompletedBookshelfList.append(incompleteBookElement);
      } else{
        completedBookshelfList.append(completeBookElement);
      }
    }
  });