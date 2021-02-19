const https = require("http");

const express = require("express");

const bodyparser = require("body-parser");

const cors = require("cors"); // by using this can access from any server
const path = require("path");
// const passport = require("passport");
const expressValidator = require("express-validator");

const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./api/swagger/swagger.yaml");
const swaggerGogoDocument = YAML.load("./api/swagger/swagger_goldgo.yaml");

// var fs = require("fs");
var fileUpload = require("express-fileupload");

var app = express();
// Remove the X-Powered-By headers.
app.disable("x-powered-by");

var thirdPartyRoute = require("./app/modules/third_party/thirdPartyRoute");
var priceRoute = require("./app/modules/prices/priceRoute");
var transactionRoute = require("./app/modules/transactions/transactionRoute");
var cloudHsmRoute = require("./app/modules/cloudhsm/cloudHsmRoute");

const PORT = process.env.PORT || 8081;
var server = require("http").createServer(app);
app.use(cors());
app.use("/api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/rest-api-swagger", swaggerUi.serve, swaggerUi.setup(swaggerGogoDocument));

app.use(fileUpload());

app.use(bodyparser.json({ limit: "1mb" }));

//for parsing application/xwww-
app.use(
  bodyparser.urlencoded({ limit: "1mb", extended: true, parameterLimit: 50000 })
);

app.use(async (err, req, res, next) => {
  console.log("req err :", err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // do your own thing here 👍
    return res.status(400).send({ status: false, message: "bad request" });
  }
  next();
});
/**
 * Data sentization and disallow url in iframes
 *  */
app.use(expressValidator());

//routes
//app.use("/api/v1", appRoute);
app.use("/api/v1/users", thirdPartyRoute);
app.use("/api/v1/price", priceRoute);
app.use("/api/v1/transaction", transactionRoute);
app.use("/api/v1/cloudhsm", cloudHsmRoute);

app.use("/api/v1/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("Goldgo third party api backend started.");
});

server.listen(PORT, () => {
  console.log("server has been started at port: " + PORT);
});

module.exports.app = express;
