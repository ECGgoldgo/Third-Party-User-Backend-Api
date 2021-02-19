const config = require("../config/config");

const jwt = require("jsonwebtoken");
var db = require("../config/db");

const tblThirdParty = require("../app/modules/third_party/schemas/thirdPartySchema");
var authMiddleware = {
  checkAuth: async (req, res, next) => {
    console.log("headers:", req.headers);
    if (
      req.headers.authorization != undefined &&
      req.headers.authorization != ""
    ) {
      let data = req.headers.authorization;
      return await jwt.verify(data, db.secret, async function (err, decoded) {
        if (!err) {
          console.log("decoded", decoded);
          if (decoded != undefined && Object.keys(decoded).length > 0) {
            var email = decoded.email;
            var userData = await tblThirdParty.findOne({
              attributes: ["id", "email"],
              where: { verification_code: data, email: email },
            });

            if (userData != null) {
              req.user = userData.dataValues;
              next();
            } else {
              return res.status(401).send({
                status: false,
                message: "Unauthorized",
              });
            }
          }
        } else {
          return res
            .status(401)
            .send({ status: false, message: "Unauthorized" });
        }
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Please provide verification code" });
    }
  },
};
module.exports = authMiddleware;
