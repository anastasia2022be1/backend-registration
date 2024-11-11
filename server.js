import express from "express";
import User from "./models/User.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

await mongoose.connect("mongodb://127.0.0.1:27017/myDB");

const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid registration' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24;

  const user = await User.create({
    email: email,
    password: hashedPassword,
    verificationToken: verificationToken,
    tokenExpiresAt: tokenExpiresAt
  })

  res.status(201).json(user);
})

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid login' });
  }

  try {
    // TODO: checke erst ob Email korrekt
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    // check ob verified ist
    if (!user.verified) {
      return res.status(403).json({ error: "Account not verified" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    res.json({
      status: "success",
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

})

app.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ verificationToken: token });

  if (user && Date.now() < user.tokenExpiresAt) {
    // Подтверждаем учетную запись
    user.verified = true;
    user.verificationToken = undefined;
    user.tokenExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: "Account successfully verified" });
  } else {
    return res.status(400).json({ "error": "Invalid or expired token " })
  }
})


app.listen("3000", () => console.log("server started on port 3000"));