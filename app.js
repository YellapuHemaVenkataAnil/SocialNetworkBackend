require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoutes.js");

const port = process.env.PORT || 5000;
const db_url = process.env.MONGO_URL;
const app = express();

// ✅ Allow both localhost (dev) and Vercel (prod)
const allowedOrigins = [
  "http://localhost:5173",
  "https://social-network-frontend-cc8i.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

app.use(express.json());
app.use("/auth", authRouter);

mongoose
  .connect(db_url)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err.message));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
