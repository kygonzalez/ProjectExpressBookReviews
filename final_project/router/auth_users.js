const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if the user exists and the password is correct
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }

  // Generate JWT token
  const token = jwt.sign({username: username}, "access", {expiresIn: "1h"});

  // Store token in session
  req.session.authorization = {
    accessToken: token
  };

  return res.status(200).json({message: "Login successful", token: token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username; // Get username from session/token

  if (!isbn || !review) {
    return res.status(400).json({message: "ISBN and review are required"});
  }
  
  // Check if the book exists using the isbn as the key in the object
  const book = books[isbn]; 
  if (!book) { // If the key doesn't exist, book will be undefined
    return res.status(404).json({message: "Book not found"});
  }

     // Add or update review keyed by username
     book.reviews[username] = review;
     return res.status(200).json({message: "Review added/updated successfully for user " + username});
   
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
