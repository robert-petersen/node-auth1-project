const express = require("express");
const router = express.Router();
const User = require("./../users/users-model");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const { username, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)
  User.add({ username, password: hashed })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  try {
    const allegedUser = await User.findBy({ username }).first()
    if (allegedUser && bcrypt.compareSync(password, allegedUser.password)) {
      req.session.user = allegedUser 
      res.json("Signed In :)")
    } else {
      res.status(401).json("Invalid Credentials >:]")
    }
  } catch (err) {
    res.status(500).json(err.message)
  }
});

router.get("/logout", (req, res) => {
  if(req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json("Couldn't Sign Out :o")
      } else {
        res.json("Signed Out. Bye :'(")
      }
    })
  } else {
    res.end()
  }
});

module.exports = router;