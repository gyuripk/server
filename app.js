const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");

// added for connection to database
const options = require("./db");
const knex = require("knex")(options);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const notesRouter = require("./routes/notes");
const swaggerRouter = require("./routes/swagger"); // Swagger 라우터 추가

const { log } = require("console");

var app = express();

//보안 및 cros 설정 (위치...어딘지 모르겠음)
app.use(logger("common"));
app.use(helmet());
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter); // 추가
app.use(swaggerRouter); // Swagger 라우터 사용

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
