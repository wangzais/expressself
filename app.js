var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var proxy = require("express-http-proxy");
var router = express.Router();
const HOST = "http://10.0.0.132:9810";
var app = express();
var options = {
  target: "http://10.0.0.132:9810",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "http://10.0.0.132:9810",
  },
  preserveHostHdr: true,
  reqAsBuffer: true,
  //转发之前触发该方法
  // proxyReqPathResolver: function (req, res) {
  //   console.log(req);
  //   return `${req.url}`;
  // },
};
router.post("/", function (req, res, next) {
  var path = req.originalUrl;
  var content = req.body;
  console.log(path, content);
});
var optionss = {
  target: "http://10.0.0.132:9810",
  changeOrigin: true,
  pathRewrite: {
    "^/": "http://10.0.0.132:9810",
  },
  preserveHostHdr: true,
  reqAsBuffer: true,
  // //转发之前触发该方法
  // proxyReqPathResolver: function (req, res) {
  //   return `/api${req.url}`;
  // },
};
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use('/', proxy(HOST, options));
app.use("/api", proxy(HOST, options));
app.use("/", proxy(HOST, optionss));
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
