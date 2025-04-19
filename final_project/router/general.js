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
public_users.get('/',function (req, res) {
  // Send books data
  res.status(200).json({ message: "Books retrieved successfully", books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]; // Find the book in the books object using the key

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; 
  const booksByAuthor = Object.values(books).filter(book => book.author === author); // Filter books by author

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);  
  } else {
    res.status(404).json({ message: "No books found for author: " + author });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; 
  const booksByTitle = Object.values(books).filter(book => book.title === title); // Filter books by title

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found for title: " + title });
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
