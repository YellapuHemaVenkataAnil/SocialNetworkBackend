const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (user) {
      res.status(400).send("User already exist");
    } else {
      const hashedpass = bcrypt.hashSync(data.password, 10);
      data.password = hashedpass;
      const newUser = new User(data);
      const saveduser = await newUser.save();
      res.status(201).json(saveduser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (!user) {
      res.status(400).send("user not found");
    } else {
      const isMatch = bcrypt.compareSync(data.password, user.password);
      if (!isMatch) {
        res.status(400).send("Invalid password");
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).json(user);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;