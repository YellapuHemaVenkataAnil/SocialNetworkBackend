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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // remove password before sending back
    const { password: _, ...userData } = user._doc;

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
