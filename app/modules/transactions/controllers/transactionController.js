/** Database table schemas. */
var sequelize = require("sequelize");
var config = require("../../../../config/config");
const Op = sequelize.Op;
var ETH = require("../../../helpers/eth");
let eth = new ETH(config.ERC20_TOKEN_ABI, config.TOKEN_CONTRACT);
const tblTransactions= require("../schemas/restApiTransactionSchema");
const dbHelper =require("../../../helpers/dbhelper");
module.exports = {
  transactions: async (req, res, next) => {
    try {
      let params = {};
      let filter = {};
      if (req.body._from != "" && req.body._from != null) {
        filter = {
          filter: { from: req.body._from },
        };
      }
      if (req.body._to != "" && req.body._to != null) {
        to_filter = { to: req.body._to };
        Object.assign(filter.filter, to_filter);
      }
      console.log("filter", filter);
      if (Object.keys(filter).length > 0) {
        params = Object.assign(params, filter);
      }
      console.log("params filter", params);

      /* add from block and to block*/
      let fromBlockObject = {
        fromBlock: 0 
      };
      if (req.body._fromblock != "" && req.body._fromblock != null) {
        fromBlockObject = {
          fromBlock: req.body._fromblock 
        };
        
      }  
      params = Object.assign(params, fromBlockObject);
      let toBlockObject={
        toBlock: "latest"
      }
      if (req.body._toblock != "" && req.body._toblock != null) {
        toBlockObject={
          toBlock: req.body._toblock,
        }
      } 
      params = Object.assign(params, toBlockObject);

      console.log("params arugments", params);

      let eventRes = await eth.getEventData("Transfer", params);
      if (eventRes.status) {
        return res.status(200).send({
          status: true,
          data: eventRes.events,
          message: "Transactions detail get successsfully.",
        });
      } else {
        return res.status(400).send({
          status: false,
          data: `${eventRes.error}`,
          message: eventRes.error,
        });
      }
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  /**
   * save transaction
   * */
  save: async (req, res, next) => {
    try {
        const currentUTCDate = new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
        var transactionHash = req.body.transactionHash;
        var req_type = req.body.req_type;
        var to_address = req.body.to_address;
        var from_address= req.body.from_address;
        var block_id= req.body.block_id;
        var block_hash= req.body.block_hash;
        var amount= req.body.amount;
        var fee= req.body.fee;
        var from_id=0;
        if(req.user.id!=undefined){
          from_id=req.user.id;
        }
        let userId= await dbHelper.getUserIdByAddress(to_address);
        /* REST API USER ADDRESS*/
        let toId= await dbHelper.getToUserIdByAddress(to_address);
        
        var goldPrice = await dbHelper.getDailyGoldPrice();
        var daily_gold_price= goldPrice.daily_gold_price;

        var checkTransactionExist = await tblTransactions.findOne({
          attributes: ["id","user_id","to_id","req_type","tx_id","block_hash","block_id"],
          where: { tx_id: transactionHash },
        });

        if (checkTransactionExist) {
          let transactionData={
            updated_at:currentUTCDate,
          }
          if(from_id!=0){
            transactionData.from_id=from_id;
          }
          if(userId!=0 && checkTransactionExist.user_id!=userId){
            transactionData.user_id=userId;
          }
          if(toId!=0 && checkTransactionExist.to_id!=toId){
            transactionData.to_id=toId;
          }
          if(checkTransactionExist.req_type!=req_type){
            transactionData.req_type=req_type;
          }
          if(checkTransactionExist.tx_id!=transactionHash){
            transactionData.tx_id=transactionHash;
          }
          if(checkTransactionExist.block_hash!=block_hash){
            transactionData.block_hash=block_hash;
          }
          if(checkTransactionExist.block_id!=block_id){
            transactionData.block_id=block_id;
          }
          await tblTransactions.update(transactionData,{where:{id:checkTransactionExist.id}});

          return res.status(200).send({
            status: true,
            message: "Transaction has been saved.",
          });
        }else{
          let transactionData={
            req_type:req_type,
            tx_id:transactionHash,
            to_adrs:to_address,
            from_adrs:from_address,
            amount:amount,
            block_id:	block_id,
            block_hash:block_hash,
            status:"complete",
            thai_baht_token_price:daily_gold_price,
            created_at:currentUTCDate,
            updated_at:currentUTCDate,
          }
          if(from_id!=0){
            transactionData.from_id=from_id;
          }
          if(userId!=0){
            transactionData.user_id=userId;
          }
          if(toId!=0){
            transactionData.to_id=toId;
          }
          if(fee){
            transactionData.fee=fee;
          }
          await tblTransactions.create(transactionData);
          return res.status(200).send({
            status: true,
            message: "Transaction has been saved.",
          });
        }
       
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
   /** 
     * Get Transactions
     *  */
  list: async (req, res, next) => {
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
      let where=`(from_id=${userId} OR to_id=${userId} OR from_adrs IN (SELECT address from cloud_user_wallets where user_id=1) OR to_adrs IN (SELECT address from cloud_user_wallets where user_id=1))`;
      tblTransactions.findAndCountAll({
        where:sequelize.literal(where),
        order: [[req.query.sortBy, req.query.order]],
        limit: parseInt(req.query.perPage),
        offset: (req.query.page - 1) * req.query.perPage,
      })
        .then(function(dbRes) {
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Transaction List get successfully.",
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
  /** 
   * Get Data
  *  */
  getData:async(req,res,next) => {
    try {
      console.log('user data',req.user);
      let user_id=req.user.id;
      let where=`(from_id=${user_id} OR from_adrs LIKE '%${req.params.address}%')`;
      let sendTokens= await tblTransactions.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
        ],
        where:{	[Op.and]: [sequelize.literal(where)],blockchain_status:"confirmed",	status:"complete"}
      });
      // console.log('sendTokensddd',sendTokens[0].dataValues);
      sendTokens=sendTokens[0].dataValues.total_amount!=null ? sendTokens[0].dataValues.total_amount :0;

      let received_where=`(to_id=${user_id} OR to_adrs LIKE '%${req.params.address}%')`;
      let  receivedTokens= await tblTransactions.findAll({
        attributes: [
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
        ],
        where:{	[Op.and]: [sequelize.literal(received_where)],blockchain_status:"confirmed",	status:"complete"}
      });
      //console.log('receivedTokens',receivedTokens);
      receivedTokens=receivedTokens[0].dataValues.total_amount!=null ? receivedTokens[0].dataValues.total_amount :0;

      let returnOp = {
        status: true,
        statusCode: 200,
        message: "Data get successfully.",
        data:{sendTokens: sendTokens, receivedTokens:receivedTokens}
      };
      return res.json(returnOp);
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  }
};
