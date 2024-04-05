const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username) => {
    // Example validation: non-empty and longer than 3 characters
    return typeof username === 'string' && username.length > 3;
  };


// Utility function: Validates if a username is unique
const isUniqueUsername = (username) => {
    return !users.some(user => user.username === username);
  };
  
  // Utility function: Validates username and password (Basic example, expand as needed)
  const isValidCredentials = (username, password) => {
    return typeof username === 'string' && username.length > 3 && typeof password === 'string';
  };

// Utility function: Authenticates user credentials
const authenticateUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
  };
  

//only registered users can login
// Login endpoint
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (authenticateUser(username, password)) {
        // Set username in session
        req.session.username = username;
        return res.status(200).json({ message: "Customer logged in successfully" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});
  

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.username; // Assuming this is how you're accessing the logged-in user's name

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    if (!isValid(review)) { // Ensure you have a validation logic for `isValid`
        return res.status(400).json({ message: "Invalid review format" });
    }

    const book = books[isbn]; // Directly access the book using ISBN as the key
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Determine if this is a new review or updating an existing one
    let responseMessage = "";
    if (book.reviews && book.reviews[username]) {
        // User has already reviewed, update the review
        book.reviews[username] = review;
        responseMessage = `The Review for the book with ISBN ${isbn} has been updated.`;
    } else {
        // Add a new review
        if (!book.reviews) {
            book.reviews = {}; // Initialize reviews object if it doesn't exist
        }
        book.reviews[username] = review; // Add the new review
        responseMessage = `The Review for the book with ISBN ${isbn} has been added.`;
    }

    return res.status(200).json({ message: responseMessage });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.username; // Assuming session management is properly set up

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has reviewed the book
    if (book.reviews && book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} by ${username} has been deleted.` });
    } else {
        // The user hasn't reviewed the book
        return res.status(404).json({ message: "Review not found or you haven't reviewed this book." });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
