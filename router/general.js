const express = require('express');
let books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js"); // Import isValid function and users array
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  // Add new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
async function fetchBooks() {
    try {
      const response = await axios.get('https://christbeyers-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
      console.log(response.data);
      return response.data; // The list of books
    } catch (error) {
      console.error('There was an error fetching the books:', error);
    }
  }
  


// Get book details based on ISBN
async function fetchBookByISBN(isbn) {
    const baseUrl = 'https://christbeyers-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn';
    try {
      const response = await axios.get(`${baseUrl}/${isbn}`);
      console.log(response.data);
      return response.data; // The details of the book with the specified ISBN
    } catch (error) {
      console.error('There was an error fetching the book details:', error);
    }
  }

// Placeholder for getting book details based on author
async function fetchBooksByAuthor(authorName) {
    const baseUrl = 'https://christbeyers-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author';
    try {
      const response = await axios.get(`${baseUrl}/${encodeURIComponent(authorName)}`);
      console.log(response.data);
      return response.data; // The details of the books by the specified author
    } catch (error) {
      console.error('There was an error fetching the books by the author:', error);
    }
  }
  




// Placeholder for getting all books based on title
async function fetchBooksByTitle(title) {
    const baseUrl = 'https://christbeyers-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title';
    try {
      const response = await axios.get(`${baseUrl}/${encodeURIComponent(title)}`);
      console.log(response.data);
      return response.data; // The details of the books with the specified title
    } catch (error) {
      console.error('There was an error fetching the books by title:', error);
    }
  }

// Placeholder for getting book reviews
public_users.get('/review/:isbn', function (req, res) {
    // Extract the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Check if the book exists in the books object using the ISBN as a key
    if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        // Check if the book has reviews
        if (Object.keys(book.reviews).length > 0) {
            // Return the reviews for the book
            return res.status(200).json({ reviews: book.reviews });
        } else {
            // No reviews found for the book
            return res.status(404).json({ });
        }
    } else {
        // Book not found with the provided ISBN
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
