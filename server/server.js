const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const userDatabase = require("../db/modal");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const client_home = "http://localhost:5500/public";

app.get("/users", async (req, res) => {
  try {
    const users = await userDatabase.find();
    res.json(users);
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
});

app.post("/login-user", async (req, res) => {
  let user;
  try {
    user = await userDatabase.findOne({ username: req.body.name }).exec();
    console.log(user.buckets);
    if (user === null) {
      return res.status(400).send("Cannot find user.");
    }

    try {
      const password = req.body.password;
      if (password !== user.password) {
        throw new Error();
      } else {
        // set cookies.
        res.cookie("username", user.username);
        res.status(500).redirect(client_home);
      }
    } catch (error) {
      res
        .status(400)
        .send("Sorry wrong password !\n{message:" + error.message + "}");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/register-user", async (req, res) => {
  const user = new userDatabase({
    username: req.body.name,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.status(201);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/logout", (req, res) => {
  try {
    const cookie_array = req.headers.cookie.split("; ");
    cookie_array.forEach((element) => {
      if (element.split("=")[0] === "username") {
        res.clearCookie("username");
        res.status(500).redirect(client_home);
        return;
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message }).send("Unable to logout");
  }
});

app.post("/submit-bucket", async (req, res) => {
  const bucket = {
    bucketname: req.body.bucketname,
    bucketdata: req.body.bucketdata,
  };
  try {
    const cookie_array = req.headers.cookie.split("; ");
    console.log(cookie_array);
    let user;
    cookie_array.forEach(async (element) => {
      if (element.split("=")[0] === "username") {
        user = await userDatabase.findOne({ username: element.split("=")[1] }).exec();
        var current_buckets = await user.buckets;
        current_buckets.push(bucket)
        console.log(user);
        try {
          userDatabase.findOneAndUpdate(
            { username: element.split("=")[1] },
            { buckets: current_buckets },
            (err) => {
              if (err) {
                throw err;
              } else {
                res.status(500).send("Bucket updated");
              }
            }
          );
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Running");
});
