const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let user = users.filter(u=> {return u.username===username})

    if (user.length>0){
        return true
    }else{
        return false
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUser = users.filter(user=>{
        return user.username===username && user.password === password
    })
    if(validUser.length>0){
        return true
    }else{
        false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({data:password}, 'access', {expiresIn: 60*6000})
        req.session.authorization = {accessToken, username}
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let user = users.filter(u=>{return u.password === req.user.data});
    console.log(users, user, req.user)
    const review = req.body.review;
    let book = books[isbn]
    if (book) { 
      book.reviews = {
          ...book.reviews,
          [user[0].username]: review
        };
      res.send(`Book ${isbn}'s review has been updated.`);
  }
  else{
      res.send("Unable to find book!");
  }
  
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
