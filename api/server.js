const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cors = require("cors");
const KnexSessionStore = require("connect-session-knex")(session)

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(session({
  name: "monkey", 
  secret: "keep it secret, keep it safe!", 
  cookie: {
    maxAge: 1000 * 60 * 60, 
    secure: false, 
    httpOnly: true, 
  },
  resave: false, 
  saveUninitialized: false, 

  // // let's persist sessions in the db so sessions don't die on server restarts
  // store: new KnexSessionStore({
  //   knex: require('../database/connection.js'), // configured instance of knex
  //   tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
  //   sidfieldname: 'sid', // column that will hold the session id, name it anything you want
  //   createtable: true, // if the table does not exist, it will create it automatically
  //   clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  // }),
}))

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;