const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

const users = [
  {
    username: "JD",
    password: "123",
  },
  {
    username: "JDS",
    password: "1234",
  },
];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !!username;
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  return users.find((user) => username === user.username)?.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const user = req.body;

  if (!isValid(user.username) || !isValid(user.password)) {
    res.status(400).json({ message: "Username and password are required" });
  } else if (authenticatedUser(user.username, user.password)) {
    const accessToken = jwt.sign({ data: user }, "access", {
      expiresIn: 3600,
    });

    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User logged in successfully", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;
  const username = jwt.decode(req.session.authorization.accessToken).data.username;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews[username] = review;

  return res.status(200).json({ book });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = jwt.decode(req.session.authorization.accessToken).data.username;
  const book = books[isbn];
  const review = book.reviews[username];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete book.reviews[username];
  return res.status(200).json({ book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
