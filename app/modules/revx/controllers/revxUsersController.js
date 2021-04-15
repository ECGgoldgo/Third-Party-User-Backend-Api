/** Database table schemas. */
var sequelize = require("sequelize");
var db = require("../../../../config/db");
var config = require("../../../../config/config");

const tblRevxUser = require("../schemas/revxUsersSchema");
const tblContracts= require("../schemas/contractsSchema");
var jwt = require("jsonwebtoken");
const Op = sequelize.Op;
var emailValidator = require("email-validator");

module.exports = {
  /**
   * Register
   * */
  login: async (req, res, next) => {
    try {
      const currentUTCDate = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      var name = req.body.name;
      var email = req.body.email.toLowerCase();
      var email_verified= req.body.email_verified;
      //var password = req.body.password;

      var validateUserEmail = await emailValidator.validate(email);
      console.log("validateUserEmail:", validateUserEmail);
      if (!validateUserEmail) {
        return res.status(400).send({
          status: false,
          message: "Invalid email address.",
        });
      }

      var checkEmailExist = await tblRevxUser.findOne({
        attributes: ["id", "username", "email","created_at","status"],
        where: { email: email },
      });

      if (checkEmailExist) {
        if(checkEmailExist.status == "0"){
          if(email_verified){
            await tblRevxUser.update(
              {status:"1"},
              {
                where: { id: checkEmailExist.id },
              }
            );
          }
        }
        let verification_code = await jwt.sign({ id:checkEmailExist.dataValues.id,email: email }, db.secret);
        delete checkEmailExist.dataValues.id;
        let token='JWT '+verification_code;
        return res.status(200).send({
          status: true,
          data: checkEmailExist,
          token:token,
          message: "Your account detail get successsfully.",
        });
      }else{
        // let result = await sequelize.transaction(async (t) => {
        // let encryptPass = await bcrypt.hash(password, 10);
        let verification_code = await jwt.sign({ email: email }, db.secret);
        let saveData={
          username: name,
          email: email,
          created_at: currentUTCDate,
          updated_at: currentUTCDate,
        };
        if(email_verified){
          saveData.status="1";
        }
        var userData = await tblRevxUser.create(saveData);
        
        var userDetail = await tblRevxUser.findOne({
          attributes: ["username", "email","created_at"],
          where: { id: userData.id },
        });
        let token='JWT '+verification_code;
        return res.status(200).send({
          status: true,
          data: userDetail,
          token:token,
          message: "Your account created successsfully.",
        });
    }
      // });
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  /**
   * get contracts
   */
  getContracts: async (req, res, next) => {
    try {
      let userId=req.user.id;
      console.log(req.query);
      console.log(req.query.searchKey);
      req.query.searchKey == undefined
        ? (req.query.searchKey = "%%")
        : (req.query.searchKey = "%" + req.query.searchKey + "%");

      req.query.perPage == undefined ? (req.query.perPage = 25) : "";
      req.query.page == undefined ? (req.query.page = 1) : "";
      req.query.order == undefined ? (req.query.order = "DESC") : "";
      req.query.sortBy == undefined ? (req.query.sortBy = "created_at") : "";
      console.log(req.query.searchKey);
      console.log(req.query);
       
      tblContracts.findAndCountAll({
        attributes:['id','name','content','redirect_url','image_url','price','industry','status','created_at'],
        where:{status:"1"},
        order: [[req.query.sortBy, req.query.order]],
        limit: parseInt(req.query.perPage),
        offset: (req.query.page - 1) * req.query.perPage,
      })
        .then(function(dbRes) {
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Contract List get successfully.",
            data: dbRes.rows,
            meta: {
              field: req.query.sortBy,
              page: req.query.page,
              pages: Math.ceil(dbRes.count / req.query.perPage),
              perPage: req.query.perPage,
              sort: req.query.order,
              total: dbRes.count,
            },
          };
          return res.json(returnOp);
        })
        .catch((err) => {
          console.log(err);
          returnOP.fail(res, 500, "Something went wrong", err);
        });
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  
};
