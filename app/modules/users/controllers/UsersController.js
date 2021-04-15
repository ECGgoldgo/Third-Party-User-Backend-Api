/** Database table schemas. */
var sequelize = require("sequelize");
var db = require("../../../../config/db");
const Op = sequelize.Op;
const TBL_USER = require("../schemas/userSchema");
const TBL_DELETED_USER = require("../schemas/deletedUserSchema");
const TBL_ROLE = require("../schemas/roleSchema");
const TBL_USER_WALLET = require("../schemas/userWalletRelationSchema");
const TBL_WALLET = require("../schemas/walletSchema");
const TBL_COUNTRY_CODES = require("../schemas/countryCodeSchema");
module.exports = {
  /**
   * get user list api
   * */
  list: async (req, res, next) => {
    console.log(req.query);
    console.log(req.query.searchKey);
    req.query.searchKey == undefined
      ? (req.query.searchKey = "%%")
      : (req.query.searchKey = "%" + req.query.searchKey + "%");

    req.query.perPage == undefined ? (req.query.perPage = 25) : "";
    req.query.page == undefined ? (req.query.page = 1) : req.query.page=parseInt(req.query.page) + 1;
    req.query.order == undefined ? (req.query.order = "DESC") : "";
    req.query.sortBy == undefined ? (req.query.sortBy = "created_at") : "";
    req.query.filterType == undefined ? "" : req.query.filterType;
    req.query.filterType1 == undefined ? "" : req.query.filterType1;
    req.query.filterType2 == undefined ? "" : req.query.filterType2;

    var where = "";
    var filterTypeArr = ["0", "1"];
    var filterTypeArr1 = ["0", "1", "2", "3"];
    var filterTypeArr2 = ["0", "1", "2", "3"];

    console.log(
      filterTypeArr.indexOf(req.query.filterType),
      "req.query.indexOf"
    );

    if (
      req.query.filterType !== "" &&
      filterTypeArr.indexOf(req.query.filterType) !== -1
    ) {
      if (filterTypeArr.indexOf(req.query.filterType) == 0) {
        where += "users.email_status='0'";
      } else {
        where += "users.email_status='1'";
      }
    }

    if (
      req.query.filterType1 !== "" &&
      filterTypeArr1.indexOf(req.query.filterType1) !== -1
    ) {
      if (filterTypeArr1.indexOf(req.query.filterType1) == 0) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='0'";
      } else if (filterTypeArr1.indexOf(req.query.filterType1) == 1) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='1'";
      } else if (filterTypeArr1.indexOf(req.query.filterType1) == 2) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='2'";
      } else {
        where == "" ? (where += " ") : (where += " AND ");
        where += "users.kyc_status ='3'";
      }
    }

    if (
      req.query.filterType2 !== "" &&
      filterTypeArr2.indexOf(req.query.filterType2) !== -1
    ) {
      if (filterTypeArr2.indexOf(req.query.filterType2) == 0) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.status='0'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 1) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.status='1'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 2) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.isSuspend='2'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 3) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.isSuspend='1'";
      }
    }
    var searchWhere = "";
    if (req.query.searchKey != undefined && req.query.searchKey != "") {
      searchWhere += `CONCAT(first_name,' ',last_name) LIKE '${req.query.searchKey}'`;
    }
    console.log("barjinder ssddddefffdfdf where con--->", where);
    console.log(req.query.searchKey);
    console.log(req.query);
    TBL_USER.findAndCountAll({
      attributes: [
        "user_id",
        "email",
        [
          sequelize.fn(
            "concat",
            sequelize.col("first_name"),
            " ",
            sequelize.col("last_name")
          ),
          "name",
        ],
        "dob",
        "address",
        "city",
        "country",
        "country_code_id",
        "zip_code",
        "mobile",
        "kyc_status",
        "email_status",
        "mobile_status",
        "kyc_status",
        "doc_image1",
        "doc_image2",
        "role",
        "status",
        ["isSuspend","isSuspend"],
        "created_at",
      ],
      where: {
        [Op.or]: [
          { email: { [Op.like]: req.query.searchKey } },
          // { name: { [Op.like]: req.query.searchKey } },
          { mobile: { [Op.like]: req.query.searchKey } },
          { country: { [Op.like]: req.query.searchKey } },
          {
            "$wallet_relation->walletData.address$": {
              [Op.like]: req.query.searchKey,
            },
          },
          sequelize.literal(searchWhere),
        ],
        [Op.and]: [sequelize.literal(where)],
      },

      include: [
        {
          model: TBL_ROLE,
          attributes: ["id", "name"],
          where: { name: { [Op.ne]: "Administrator" } },
          as: "roleData",
          required: false,
        },
        {
          model: TBL_COUNTRY_CODES,
          attributes: ["name", "phonecode"],
          as: "country_code_data",
          required: false,
        },
        {
          model: TBL_USER_WALLET,
          attributes: ["wallet_rel_id", "balance", "balance_blocked"],
          as: "wallet_relation",

          include: [
            {
              model: TBL_WALLET,
              attributes: ["wallet_id", "address"],
              as: "walletData",
              required: false,
            },
          ],
          required: false,
        },
      ],

      order: [[req.query.sortBy, req.query.order]],
      limit: parseInt(req.query.perPage),
      offset: (req.query.page - 1) * req.query.perPage,
    })
      .then(function(dbRes) {
        let returnOp = {
          status: true,
          statusCode: 200,
          message: "User list get successfully.",
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
  },

  /**
   * get deleted user list api
   * */
  deletedUserList: async (req, res, next) => {
    console.log(req.query);
    console.log(req.query.searchKey);
    req.query.searchKey == undefined
      ? (req.query.searchKey = "%%")
      : (req.query.searchKey = "%" + req.query.searchKey + "%");

    req.query.perPage == undefined ? (req.query.perPage = 25) : "";
    req.query.page == undefined ? (req.query.page = 1) : "";
    req.query.order == undefined ? (req.query.order = "DESC") : "";
    req.query.sortBy == undefined ? (req.query.sortBy = "created_at") : "";
    req.query.filterType == undefined ? "" : req.query.filterType;
    req.query.filterType1 == undefined ? "" : req.query.filterType1;
    req.query.filterType2 == undefined ? "" : req.query.filterType2;

    var where = "";
    var filterTypeArr = ["0", "1"];
    var filterTypeArr1 = ["0", "1", "2", "3"];
    var filterTypeArr2 = ["0", "1", "2", "3"];

    console.log(
      filterTypeArr.indexOf(req.query.filterType),
      "req.query.indexOf"
    );

    if (
      req.query.filterType !== "" &&
      filterTypeArr.indexOf(req.query.filterType) !== -1
    ) {
      if (filterTypeArr.indexOf(req.query.filterType) == 0) {
        where += "users.email_status='0'";
      } else {
        where += "users.email_status='1'";
      }
    }

    if (
      req.query.filterType1 !== "" &&
      filterTypeArr1.indexOf(req.query.filterType1) !== -1
    ) {
      if (filterTypeArr1.indexOf(req.query.filterType1) == 0) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='0'";
      } else if (filterTypeArr1.indexOf(req.query.filterType1) == 1) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='1'";
      } else if (filterTypeArr1.indexOf(req.query.filterType1) == 2) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.kyc_status ='2'";
      } else {
        where == "" ? (where += " ") : (where += " AND ");
        where += "users.kyc_status ='3'";
      }
    }

    if (
      req.query.filterType2 !== "" &&
      filterTypeArr2.indexOf(req.query.filterType2) !== -1
    ) {
      if (filterTypeArr2.indexOf(req.query.filterType2) == 0) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.status='0'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 1) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.status='1'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 2) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.isSuspend='2'";
      } else if (filterTypeArr2.indexOf(req.query.filterType2) == 3) {
        where == "" ? (where += "  ") : (where += " AND ");
        where += "users.isSuspend='1'";
      }
    }
    var searchWhere = "";
    if (req.query.searchKey != undefined && req.query.searchKey != "") {
      searchWhere += `CONCAT(first_name,' ',last_name) LIKE '${req.query.searchKey}'`;
    }
    console.log("where con--->", where);
    console.log(req.query.searchKey);
    console.log(req.query);
    TBL_DELETED_USER.findAndCountAll({
      attributes: [
        "user_id",
        "email",
        [
          sequelize.fn(
            "concat",
            sequelize.col("first_name"),
            " ",
            sequelize.col("last_name")
          ),
          "name",
        ],
        "dob",
        "address",
        "city",
        "country",
        "country_code_id",
        // "nationality",
        "zip_code",
        "mobile",
        "kyc_status",
        "email_status",
        "mobile_status",
        "kyc_status",
        "doc_image1",
        "doc_image2",
        "role",
        "status",
        "isSuspend",
        "created_at",
      ],
      include: [
        {
          model: TBL_COUNTRY_CODES,
          attributes: ["name", "phonecode"],
          as: "country_code_data",
          required: false,
        },
        {
          model: TBL_USER_WALLET,
          attributes: ["wallet_rel_id", "balance", "balance_blocked"],
          as: "wallet_relation",

          include: [
            {
              model: TBL_WALLET,
              attributes: ["wallet_id", "address"],
              as: "walletData",
              required: false,
            },
          ],
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          { email: { [Op.like]: req.query.searchKey } },
          { name: { [Op.like]: req.query.searchKey } },
          { mobile: { [Op.like]: req.query.searchKey } },
          { country: { [Op.like]: req.query.searchKey } },
          {
            "$wallet_relation->walletData.address$": {
              [Op.like]: req.query.searchKey,
            },
          },
          sequelize.literal(searchWhere),
        ],
        [Op.and]: [sequelize.literal(where)],
      },

      order: [[req.query.sortBy, req.query.order]],
      limit: parseInt(req.query.perPage),
      offset: (req.query.page - 1) * req.query.perPage,
    })
      .then(function(dbRes) {
        let returnOp = {
          status: true,
          statusCode: 200,
          message: "Deleted user list get successfully.",
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
        returnOP.fail(res, 500, 'Something went wrong', err);
      });
  },

  /* download users reports*/
  downloadUsers: async (req, res, next) => {
    try {
      let startDate =
        req.query.startDate != undefined ? req.query.startDate : "";
      let endDate = req.query.endDate != undefined ? req.query.endDate : "";
      var where = "";
      if (startDate != "") {
        where += ` WHERE DATE(us.created_at) >= '${startDate}'`;
      }
      if (endDate != "") {
        if (where == "") {
          where += ` WHERE DATE(us.created_at) <= '${endDate}'`;
        } else {
          where += ` AND DATE(us.created_at) <= '${endDate}'`;
        }
      }
      let userQuery = `SELECT us.email AS 'EMAIL',CONCAT(us.first_name," ",us.last_name) AS 'NAME',CONCAT(cc.phonecode,"",us.mobile) AS 'PHONE',IF(us.country IS NOT NULL,us.country,'N/A') AS 'COUNTRY',wa.address AS 'WALLET ADDRESS',IF(us.status='1','Enabled','Disabled') AS 
      'STATUS',IF(us.isSuspend='1','No','Yes') AS 'IS SUSPEND',IF(us.email_status='1','Completed','Pending') AS 'KYC VERIFIED(LEVEL 1)',IF(us.mobile_status='1','Completed','Pending') AS 'KYC VERIFIED(LEVEL 2)',CASE WHEN us.kyc_status='0' THEN 'NoDocUploaded' WHEN us.kyc_status='1' THEN 'Pending' WHEN us.kyc_status='2' THEN 'Verified' ELSE 'Unverified' END AS 'KYC STATUS',(uwr.balance-uwr.balance_blocked) AS 'TOKEN HOLDING (Gogo)',DATE_FORMAT(CONVERT_TZ(us.created_at,'+00:00','+07:00'),'%d %b %Y %H:%i') as 'Created Date(UTC +7)' FROM users AS us LEFT JOIN country_codes AS cc ON cc.id=us.country_code_id LEFT JOIN user_wallet_relation AS uwr ON uwr.user_id=us.user_id LEFT JOIN wallets AS wa ON wa.wallet_id=uwr.wallet_id ${where}`;
      var userData = await db.connection.query(userQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.xls("users.xlsx", userData);
    } catch (err) {
      return res.status(400).send({ status: false, message: `${err}` });
    }
  },
    
};
