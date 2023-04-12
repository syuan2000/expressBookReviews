const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn?',function (req, res) {
    const isbn = parseInt(req.params.isbn,10);
    if ( isNaN(isbn) || isbn<1 || isbn>Object.keys(books).length){
        return res.status(401).json({message: "Invalid isbn number"})
    }else{
        res.send(books[isbn])
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author.trim(); // trim whitespace from author parameter

    let book = [];

    for (const b in books) {
        const bookAuthor = decodeURI(books[b]["author"]).trim(); // trim whitespace from book author
        if (bookAuthor === author) {
            book.push(books[b]);
        }        
    }

    if (book.length > 0) {
        res.json(book);
    } else {
        res.status(401).json({ message: `Can not find any books by ${author}` });
    }
});

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    const title = decodeURI(req.params.title).trim();
    for (const b in books) {
        const bookTitle = decodeURI(books[b]["title"]).trim();
        if (bookTitle === title) {
            return res.json(books[b]);
        }
    }
    return res.status(404).json({ message: `Could not find the book titled ${title}` });
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn, 10); // convert string to number with radix of 10

    if (isNaN(isbn) || isbn < 1 || isbn > Object.keys(books).length){
        return res.status(401).json({message: "Invalid isbn number"})
    } else {
        if (typeof books[isbn] === 'undefined' || typeof books[isbn].reviews === 'undefined') {
            return res.status(401).json({message: "Book not found or no reviews"})
        } else {
            return res.json(books[isbn].reviews)
        }
    }
});



module.exports.general = public_users;
