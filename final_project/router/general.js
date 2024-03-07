const express = require("express");
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const user = req.body;

  if (users.some(({ username }) => username === user.username)) {
    return res.status(400).json({ message: "Username already exists" });
  } else if (!isValid(user.username)) {
    return res.status(400).json({ message: "Username is not provided" });
  } else if (!isValid(user.password)) {
    return res.status(400).json({ message: "Password is not provided" });
  } else {
    users.push(user);
    return res.status(200).json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 500);
  });

  return res.status(200).json(result);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[req.params.isbn]);
    }, 500);
  });

  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(books).filter(({ author }) => author === req.params.author));
    }, 500);
  });

  if (!!result?.length) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(books).filter(({ title }) => title === req.params.title));
    }, 500);
  });

  if (!!result?.length) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const reviews = books[req.params.isbn]?.reviews;

  if (reviews) {
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found" });
  }
});

module.exports.general = public_users;
