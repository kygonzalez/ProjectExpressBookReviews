const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //validate if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({message: "User already exists"});
  }

  //validate if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("Book data is not available"));
        }
      }, 50); 
    });

    const fetchedBooks = await getBooks;
    res.status(200).json({ message: "Books retrieved successfully", books: fetchedBooks });

  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to retrieve books" });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBook = new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn]; 
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found for ISBN: " + isbn)); 
        }
      }, 50);
    });

    const fetchedBook = await getBook;
    res.status(200).json(fetchedBook);

  } catch (error) {
        console.error("Error fetching book by ISBN:", error);
        res.status(500).json({ message: "Failed to retrieve book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author; 
  try {
    const getBookByAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = Object.values(books).filter(book => book.author === author); // Filter books by author
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("Book not found for author: " + author)); 
        }
      }, 50);
    });

    const fetchedBookByAuthor = await getBookByAuthor;
    res.status(200).json(fetchedBookByAuthor);

  } catch (error) {
        console.error("Error fetching books by author: " + author, error);
        res.status(500).json({ message: "Failed to retrieve book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title; 
  try {
    const getBookByTitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByTitle = Object.values(books).filter(book => book.title === title); // Filter books by title
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("Book not found for title: " + title)); 
        }
      }, 50);
    });

    const fetchedBookByTitle = await getBookByTitle;
    res.status(200).json(fetchedBookByTitle);

  } catch (error) {
        console.error("Error fetching books by title: " + title, error);
        res.status(500).json({ message: "Failed to retrieve book details" });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

module.exports.general = public_users;
