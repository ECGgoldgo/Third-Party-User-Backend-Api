var request = require("request");
var BigNumber = require("bignumber.js");
const fetch = require("node-fetch");
ReE = function (res, code, msg, error) {
  let send_data = { success: false, status: code, message: msg, error: error };
  return res.json(send_data);
};

ReS = function (res, code, msg, data, token) {
  let send_data = {
    success: true,
    status: code,
    message: msg,
    token: token,
    data: data,
  };
  return res.json(send_data);
};
returnOP = {
  success: function (response, statusCode, message, data, token) {
    console.log("return success................************");
    let returnData = { status: true, statusCode: statusCode, message: message };
    if (data != undefined || data != null) {
      returnData["data"] = data;
    }
    if (token != undefined || token != null) {
      returnData["token"] = token;
    }
    return response.json(returnData);
  },
  fail: function (response, statusCode, message, error) {
    console.log("return failed................???????");
    let returnData = {
      status: false,
      statusCode: statusCode,
      message: message,
    };
    if (error != undefined || error != null) {
      returnData["error"] = error;
    }
    return response.json(returnData);
  },
};
date_time = function () {
  var dateTime = require("node-datetime");
  var dt = dateTime.create();
  var formatted = dt.format("Y-m-d H:M:S");
  return formatted;
};

await_post_request = function (input) {
  return new Promise(function (resolve, reject) {
    request.post(input, function (err, resp, body) {
      //console.log(err, resp, body);
      console.log("In Request complete");
      if (err) {
        console.log("err", err);
        resolve({ status: false, error: err });
      } else {
        console.log("body", body);
        if (body == "Unauthorized" || body == "Unexpected token in JSON") {
          resolve({ status: false, error: body });
        } else if (body.errorMessage != undefined) {
          resolve({ status: false, error: body.errorMessage });
        } else {
          resolve({ status: true, data: body });
        }
      }
    });
  });
};
post_request = async function (url, input) {
  try {
    const response = await fetch(url, input);
    const json = await response.json();
    console.log("json", json);
    return { status: true, data: json };
  } catch (error) {
    console.log("error", error);
    return { status: false, error: error };
  }
};
isObjEmpty = function isObjEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
/**
 * This function will return 24 hours before UTC date timestamp
 */
UTCCurrentDateTime = function () {
  var globalVariables = require("./globalVariables");
  //UTC date time
  var dateCurrent = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  return dateCurrent;
};

UTC24HoursBackDate = function () {
  var globalVariables = require("./globalVariables");
  var datetime = require("node-datetime");
  //UTC date time
  var currentUTCDate = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  let dt = datetime.create(currentUTCDate);
  dt.offsetInHours(-24);
  return dt.format("Y-m-d H:M:S");
};
(UTC24HoursBackDateNew = function (currentUTCDate) {
  var globalVariables = require("./globalVariables");
  var datetime = require("node-datetime");
  let dt = datetime.create(currentUTCDate);
  dt.offsetInHours(-24);
  return dt.format("Y-m-d H:M:S");
}),
  /**
   * Custom UTC date offset in Days, Dev-S, Nov-01-2018
   */
  (UTCCustomBackDateInDays = function (currentUTCDate, limitDays) {
    var globalVariables = require("./globalVariables");
    var datetime = require("node-datetime");
    //UTC date time
    //let currentUTCDate = globalVariables.crntDate
    //var currentUTCDate=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let dt = datetime.create(currentUTCDate);
    dt.offsetInDays(-limitDays);
    return dt.format("Y-m-d H:M:S");
  }),
  (getZflCoinId = function () {
    return 6;
  });
sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

fix_precision = function (val) {
  try {
    return val.toFixed(16);
  } catch (error) {
    console.log(`Value :: ${val}`);
    console.log(error);
  }
};

doDecimalSafeMath = function (a, operation, b, precision) {
  function decimalLength(numStr) {
    var pieces = numStr.toString().split(".");
    if (!pieces[1]) return 0;
    return pieces[1].length;
  }
  // Figure out what we need to multiply by to make everything a whole number
  precision =
    precision || Math.pow(10, Math.max(decimalLength(a), decimalLength(b)));
  a = a * precision;
  b = b * precision;
  // Figure out which operation to perform.
  var operator;
  switch (operation.toLowerCase()) {
    case "-":
      operator = function (a, b) {
        return a - b;
      };
      break;
    case "+":
      operator = function (a, b) {
        return a + b;
      };
      break;
    case "*":
    case "x":
      precision = precision * precision;
      operator = function (a, b) {
        return a * b;
      };
      break;
    case "÷":
    case "/":
      precision = 1;
      operator = function (a, b) {
        return a / b;
      };
      break;
    // Let us pass in a function to perform other operations.
    default:
      operator = operation;
  }
  var result = operator(a, b);
  var result = toFixed_norounding((result / precision).toFixed(16), 16);
  return result;
};

operations = function (a, operation, b, precision) {
  a = a * 1e16;
  b = b * 1e16;
  switch (operation.toLowerCase()) {
    case "-":
      operator = function (a, b) {
        return a - b;
      };
      break;
    case "+":
      operator = function (a, b) {
        return a + b;
      };
      break;
    case "*":
    case "x":
      precision = precision * precision;
      operator = function (a, b) {
        return a * b;
      };
      break;
    case "÷":
    case "/":
      precision = 1;
      operator = function (a, b) {
        return a / b;
      };
      break;
    // Let us pass in a function to perform other operations.
    default:
      operator = operation;
  }
  var result = operator(a, b);
  return result / 1e16;
};

toFixed = function (x) {
  var result = "";
  var xStr = x.toString(10);
  var digitCount =
    xStr.indexOf("e") === -1
      ? xStr.length
      : parseInt(xStr.substr(xStr.indexOf("e") + 1)) + 1;
  for (var i = 1; i <= digitCount; i++) {
    var mod = (x % Math.pow(10, i)).toString(10);
    var exponent =
      mod.indexOf("e") === -1 ? 0 : parseInt(mod.substr(mod.indexOf("e") + 1));
    if (
      (exponent === 0 && mod.length !== i) ||
      (exponent > 0 && exponent !== i - 1)
    ) {
      result = "0" + result;
    } else {
      result = mod.charAt(0) + result;
    }
  }
  return result;
};

/**
 * Generate random string
 */
randomString = function (length) {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};
/**
 * Safe mathematical operations using bignumber library
 */
bigNumberSafeMath = function (c, operation, d, precision) {
  BigNumber.config({ DECIMAL_PLACES: 18 });
  var a = new BigNumber(parseFloat(c).toString());
  var b = new BigNumber(parseFloat(d).toString());
  var rtn;
  // Figure out which operation to perform.
  switch (operation.toLowerCase()) {
    case "-":
      rtn = a.minus(b);
      break;
    case "+":
      rtn = a.plus(b);
      break;
    case "*":
    case "x":
      rtn = a.multipliedBy(b);
      break;
    case "÷":
    case "/":
      rtn = a.dividedBy(b);
      break;
    default:
      //operator = operation;
      break;
  }
  return toFixed_norounding(rtn.toString(), 18);
};
toFixed_norounding = function (value, n) {
  value = new BigNumber(value);
  value = value.toFixed();
  x = (value.toString() + ".0").split(".");
  return parseFloat(x[0] + "." + x[1].substr(0, n));
};
/**
 * May 21, 2019, Dev-SK
 * eg1 : convert '1e-8' to 0.00000001 or
 * eg2 : convert 0.00000001 to 0.00000001 ( return same number )
 */
bigNumberSafeConversion = function (val) {
  var amount = val.toString();
  var value = new BigNumber(amount);
  return value.toFixed();
};

isEmpty = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
exponentialToDecimal = (exponential) => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes("e+")) {
    const exponentialSplitted = decimal.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)}${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
};
