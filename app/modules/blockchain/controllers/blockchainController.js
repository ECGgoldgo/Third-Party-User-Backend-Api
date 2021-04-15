/** Database table schemas. */
var sequelize = require("sequelize");
var config = require("../../../../config/config");
const Op = sequelize.Op;
var ETH = require("../../../helpers/eth");
let eth = new ETH(config.ERC20_TOKEN_ABI, config.TOKEN_CONTRACT);
const dbHelper =require("../../../helpers/dbhelper");
var axios = require('axios');
module.exports = {
  getBlocks:async(req,res,next) => {
    try {
      console.log(req.user)
      let start=req.query.start == undefined ? "" : req.query.start;
      let limit= req.query.limit == undefined ? "" : req.query.limit;
      let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/blocks`;
      let params={};
      if(start!=""){
        params = {"start":start};
      }
      if(limit!=""){
        params.limit=limit;
      }
      if(Object.keys(params).length > 0)
        params = params ? "?" + new URLSearchParams(params).toString() : "";
        url=`${url}${params}`;

      console.log('url url url',url);
      var axios_config = {
        method: 'get',
        url: url,
        headers: { 
          'Authorization': req.user.authtoken
        }
      };
      
      axios(axios_config)
      .then(function (response) {
        //console.log('response',response);
       // console.log(JSON.stringify(response.data));
        let returnOp = {
          status: true,
          statusCode: 200,
          message: "Data get successfully.",
          data:response.data
        };
        return res.json(returnOp);
      })
      .catch(function (error) {
        console.log(error);
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
      })

      
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getBlock:async(req,res,next) => {
    try {
      let blocknumber=req.params.blocknumber;
      console.log(req.user)
      //https://console-ko.kaleido.io/api/v1/ledger/{consortia_id}/{environment_id}/blocks/{block_number}
      var url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/blocks/${blocknumber}`;
      console.log('url url url',url);
      var axios_config = {
        method: 'get',
        url: url,
        headers: { 
          'Authorization': req.user.authtoken
        }
      };
      
      axios(axios_config)
      .then(function (response) {
        //console.log('response',response);
       console.log(JSON.stringify(response.data));
        let returnOp = {
          status: true,
          statusCode: 200,
          message: "Data get successfully.",
          data:response.data
        };
        return res.json(returnOp);
      })
      .catch(function (error) {
        console.log(error);
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
      })

      
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getTransactions:async(req,res,next) => {
    try {
      console.log(req.user)
      let start=req.query.start == undefined ? "" : req.query.start;
      let limit= req.query.limit == undefined ? "" : req.query.limit;
      let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/transactions`;
      let params={};
      if(start!=""){
        params = {"start":start};
      }
      if(limit!=""){
        params.limit=limit;
      }
      if(Object.keys(params).length > 0)
        params = params ? "?" + new URLSearchParams(params).toString() : "";
        url=`${url}${params}`;

      console.log('url url url',url);
      var axios_config = {
        method: 'get',
        url: url,
        headers: { 
          'Authorization': req.user.authtoken
        }
      };
      
      axios(axios_config)
      .then(function (response) {
        //console.log('response',response);
       // console.log(JSON.stringify(response.data));
        let returnOp = {
          status: true,
          statusCode: 200,
          message: "Data get successfully.",
          data:response.data
        };
        return res.json(returnOp);
      })
      .catch(function (error) {
        console.log(error);
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
      })

      
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getTransaction:async(req,res,next) => {
    try {
        console.log(req.user)
        
        let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/transactions/${req.params.hash}`;
        console.log('url url url',url);
        var axios_config = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': req.user.authtoken
          }
        };
        
        axios(axios_config)
        .then(function (response) {
          //console.log('response',response);
         // console.log(JSON.stringify(response.data));
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Data get successfully.",
            data:response.data
          };
          return res.json(returnOp);
        })
        .catch(function (error) {
          console.log(error);
          return res
          .status(400)
          .send({ status: false, data: `${error}`, message: error.message });
        })
  
        
    } catch (error) {
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getLastChainActivity:async(req,res,next) =>{
    try {
        console.log(req.user)
        let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/activity`;
        console.log('url url url',url);
        var axios_config = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': req.user.authtoken
          }
        };
        
        axios(axios_config)
        .then(function (response) {
          //console.log('response',response);
         // console.log(JSON.stringify(response.data));
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Data get successfully.",
            data:response.data
          };
          return res.json(returnOp);
        })
        .catch(function (error) {
          console.log(error);
          return res
          .status(400)
          .send({ status: false, data: `${error}`, message: error.message });
        })
  
        
    } catch (error) {
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getLedgerStats:async(req,res,next) =>{
    try {
        console.log(req.user)
        //https://console-ko.kaleido.io/api/v1/ledger/{consortia_id}/{environment_id}/stats/{since}
        let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/stats/${req.params.since}`;
        console.log('url url url',url);
        var axios_config = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': req.user.authtoken
          }
        };
        
        axios(axios_config)
        .then(function (response) {
          //console.log('response',response);
         // console.log(JSON.stringify(response.data));
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Data get successfully.",
            data:response.data
          };
          return res.json(returnOp);
        })
        .catch(function (error) {
          console.log(error);
          return res
          .status(400)
          .send({ status: false, data: `${error}`, message: error.message });
        })
  
        
    } catch (error) {
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getContracts:async(req,res,next) => {
    try {
        console.log(req.user)
        //https://console-ko.kaleido.io/api/v1/ledger/{consortia_id}/{environment_id}/contracts
        let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/contracts`;
        console.log('url url url',url);
        var axios_config = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': req.user.authtoken
          }
        };
        
        axios(axios_config)
        .then(function (response) {
          //console.log('response',response);
         // console.log(JSON.stringify(response.data));
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Data get successfully.",
            data:response.data
          };
          return res.json(returnOp);
        })
        .catch(function (error) {
          console.log(error);
          return res
          .status(400)
          .send({ status: false, data: `${error}`, message: error.message });
        })
  
        
    } catch (error) {
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
  getTransfersByTokens:async(req,res,next) => {
    try {
        console.log(req.user)
        console.log(req.user)
      let start=req.query.start == undefined ? "" : req.query.start;
      let limit= req.query.limit == undefined ? "" : req.query.limit;
      let url=`${config.kaleido_rest_api_url}${config.consortia_id}/${config.environment_id}/tokens/contracts/${req.params.address}/transfers`;

      let params={};
      if(start!=""){
        params = {"start":start};
      }
      if(limit!=""){
        params.limit=limit;
      }
      if(Object.keys(params).length > 0)
        params = params ? "?" + new URLSearchParams(params).toString() : "";
        url=`${url}${params}`;
        
        console.log('url url url',url);
        var axios_config = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': req.user.authtoken
          }
        };
        
        axios(axios_config)
        .then(function (response) {
          //console.log('response',response);
         // console.log(JSON.stringify(response.data));
          let returnOp = {
            status: true,
            statusCode: 200,
            message: "Data get successfully.",
            data:response.data
          };
          return res.json(returnOp);
        })
        .catch(function (error) {
          console.log(error);
          return res
          .status(400)
          .send({ status: false, data: `${error}`, message: error.message });
        })
  
        
    } catch (error) {
        return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  }
};
