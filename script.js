const Books = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "Books_APPS";
function generateId() {
  const temp = new Date();
  return temp.getTime();
}
function generateBooksObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
function findTitle(Title) {
  const arr = [];
  for (BookItem of Books) {
    if (BookItem.title === Title) {
      arr.push(BookItem);
    }
  }
  return arr;
}
function findBook(BookId) {
  for (BookItem of Books) {
    if (BookItem.id === BookId) {
      return BookItem;
    }
  }
  return null;
}
function findTodoIndex(BookId) {
  for (index in Books) {
    if (Books[index].id === BookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(BooksObject) {
  const { id, title, author, year, isCompleted } = BooksObject;
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const image = document.createElement("img");
  image.setAttribute('src','./book.png')
  

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${year}`;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item",'FlexBox2');
  container.append(textTitle, textAuthor, textYear, buttonContainer);
  container.setAttribute("id", `todo-${id}`);

  const flexContainer = document.createElement("div");
  flexContainer.classList.add('FlexContainer');
  flexContainer.append(image,container);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum selesai dibaca";
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });

    buttonContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "selesai dibaca";
    checkButton.classList.add("green");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });
    buttonContainer.append(checkButton, trashButton);
  }

  return flexContainer;
}

function bookSearch() {
  const textTitle = document.getElementById("searchBookTitle").value;
  const gotTitle = findTitle(textTitle);
  clearInput();
  if (gotTitle.length !== 0) {
    for (x of gotTitle) {
      console.log(x);
      const { title, author, year } = x;

      const textTitle = document.createElement("td");
      textTitle.innerText = title;

      const textAuthor = document.createElement("td");
      textAuthor.innerText = author;

      const textYear = document.createElement("td");
      textYear.innerText = year;

      const container = document.createElement("tr");
      container.classList.add("isiListSearch");

      container.append(textTitle, textAuthor, textYear);

      const articleContainer = document.getElementById("searchList");
      articleContainer.removeAttribute("hidden");
      articleContainer.append(container);
    }
  } else {
    clearInput();
    window.alert(`${textTitle} tidak ada`);
  }
  return null;
}

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const BookIsComplete = document.getElementById("inputBookIsComplete").checked;
  console.log(BookIsComplete);

  const generatedID = generateId();
  const BooksObject = generateBooksObject(
    generatedID,
    textTitle,
    author,
    year,
    BookIsComplete
  );
  Books.push(BooksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(BookId) {
  const BookTarget = findBook(BookId);
  if (BookTarget == null) return;
  BookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(BookId) {
  const BookTarget = findTodoIndex(BookId);
  if (BookTarget === -1) return;
  Books.splice(BookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(BookId) {
  const BookTarget = findBook(BookId);
  if (BookTarget == null) return;

  BookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    bookSearch();
    
  });
});

function clearInput() {
  const inputTextAll = document.querySelectorAll("input");
  const elem = document.querySelectorAll(".isiListSearch");

  for (x of elem) {
    x.remove();
  }

  for (input of inputTextAll) {
    document.getElementById(input.id).value = "";
  }
}
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(Books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      Books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
document.addEventListener("DOMContentLoaded", function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKSList = document.getElementById(
    "incompleteBookshelfList"
  );
  const BooksList = document.getElementById("completeBookshelfList");
  const articleContainer = document.getElementById("searchList");
  uncompletedBOOKSList.innerHTML = "";
  BooksList.innerHTML = "";

  clearInput();

  articleContainer.setAttribute("hidden", true);

  for (BookItem of Books) {
    const BookElement = makeBook(BookItem);
    if (BookItem.isCompleted) {
      BooksList.append(BookElement);
    } else {
      uncompletedBOOKSList.append(BookElement);
    }
  }
});
