/** Database table schemas. */
var sequelize = require("sequelize");
var db = require("../../../../config/db");
var config = require("../../../../config/config");

const tblThirdParty = require("../schemas/thirdPartySchema");
const tblCloudUserWallets = require("../schemas/cloudUserWalletSchema");


var jwt = require("jsonwebtoken");
const Op = sequelize.Op;
var ETH = require("../../../helpers/eth");
let eth = new ETH(config.ERC20_TOKEN_ABI, config.TOKEN_CONTRACT);
var emailValidator = require("email-validator");
var bcrypt = require("bcryptjs");
module.exports = {
  /**
   * Register
   * */
  registerLogin: async (req, res, next) => {
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

      var checkEmailExist = await tblThirdParty.findOne({
        attributes: ["id","verification_code", "username", "email","created_at","status"],
        where: { email: email },
      });

      if (checkEmailExist) {
        if(checkEmailExist.status == "0"){
          if(email_verified){
            await tblThirdParty.update(
              {status:"1"},
              {
                where: { id: checkEmailExist.id },
              }
            );
          }
        }
        delete checkEmailExist.dataValues.id;

        return res.status(200).send({
          status: true,
          data: checkEmailExist,
          message: "Your account detail get successsfully.",
        });
      }else{
        // let result = await sequelize.transaction(async (t) => {
        // let encryptPass = await bcrypt.hash(password, 10);
        let verification_code = await jwt.sign({ email: email }, db.secret);
        let saveData={
          username: name,
          email: email,
          //password: encryptPass,
          verification_code: verification_code,
          created_at: currentUTCDate,
          updated_at: currentUTCDate,
        };
        if(email_verified){
          saveData.status="1";
        }
        var userData = await tblThirdParty.create(saveData);
        
        var userDetail = await tblThirdParty.findOne({
          attributes: ["verification_code", "username", "email","created_at"],
          where: { id: userData.id },
        });
        return res.status(200).send({
          status: true,
          data: userDetail,
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
  /* get balance by address*/
  balance: async (req, res, next) => {
    try {
      console.log("res", req.user);
      var regex = /^0x[a-fA-F0-9]{40}$/;
      if (!req.params.address.match(regex) && req.params.address !== "") {
        return res
        .status(400)
        .send({ status: false,  message: "Invalid address" });
      }
      // let exchangeConfigData = await tblCloudConfig.findOne({
      //   attributes: ["id", "public_address"],
      //   where: { exchange_id: req.user.id },
      // });
      // if (exchangeConfigData.public_address == req.params.address) {
      let balance = await eth.getUserERC20TokenBalance(req.params.address);
      return res.status(200).send({
        status: true,
        data: balance,
        message: "Balance get successsfully.",
      });
      // } else {
      //   return res.status(400).send({
      //     status: false,
      //     message: "Your address not valid.",
      //   });
      // }
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  /* save wallet detail*/
  saveWallet:async(req,res,next)=>{
    try {
      const currentUTCDate = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      var address = req.body.address;
      var wallet_name = req.body.wallet_name;
      let user_id=req.user.id;
      var checkAddressExist = await tblCloudUserWallets.findOne({
        attributes: ["id"],
        where: { address: address },
      });
      if (checkAddressExist) {
        return res.status(400).send({
          status: false,
          message: "This address already exist.",
        });
      }else{
        let addressData={
          user_id:user_id,
          name:wallet_name,
          address:address,
          created_at:currentUTCDate,
          updated_at:currentUTCDate
        }
        await tblCloudUserWallets.create(addressData);
        return res.status(200).send({
          status: true,
          message: "Your wallet detail saved successfully.",
        });
      }
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  /* get wallet list*/
  walletList:async(req,res,next)=>{
    try {
      let user_id=req.user.id;
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
      tblCloudUserWallets.findAndCountAll({
        where: { user_id: user_id },
        order: [[req.query.sortBy, req.query.order]],
        limit: parseInt(req.query.perPage),
        offset: (req.query.page - 1) * req.query.perPage,
      })
        .then(function(dbRes) {
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Wallet List get successfully.",
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
  /* change wallet address*/
  changeWallet:async(req,res,next)=>{
    try {
      const currentUTCDate = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      var user_id = req.user.id;
      var id = req.params.id;
      var checkAddressExist = await tblCloudUserWallets.findOne({
        attributes: ["id"],
        where: { id: id },
      });
      if (!checkAddressExist) {
        return res.status(400).send({
          status: false,
          message: "This wallet address doesn't exist.",
        });
      }else{
        await tblCloudUserWallets.update({status:"0"},{where:{user_id:user_id}});
        await tblCloudUserWallets.update({status:"1",updated_at:currentUTCDate},{where:{id:id}});
        return res.status(200).send({
          status: true,
          message: "Your wallet address changed successfully.",
        });
      }
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
};
