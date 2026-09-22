const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// REQUIRING ROUTES
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes.js");

// USING ROUTES
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;