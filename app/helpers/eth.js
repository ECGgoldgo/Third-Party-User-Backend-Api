/** Web3 connection and their utilities. */

var Web3 = require("web3");
var config = require("../../config/config");
require("../../globalfunctions");

module.exports = class ETH {
  constructor(abi = "", contractAddress = "") {
    var provider = new Web3.providers.HttpProvider(config.ETH_NODE);
    this.web3 = new Web3(provider);
    this.abi = abi != "" ? abi : "";
    this.token_address = contractAddress != "" ? contractAddress : "";
  }

  async getBlockNumber() {
    let blocks = await new this.web3.eth.getBlockNumber();
    return { status: 1, resData: blocks };
  }

  //Convert wei to ETH
  async convertWeiToEth(value) {
    var valueInEth = this.web3.utils.fromWei(value.toString(), "ether");
    return valueInEth;
  }

  async addAdmin(tokenAbi, tokenAddress) {
    let contract = await new this.web3.eth.Contract(
      JSON.parse(tokenAbi),
      tokenAddress
    );
    let accounts = await this.web3.eth.getAccounts();
    console.log("accounts", accounts);
    return await new Promise(async function (resolve, reject) {
      await contract.methods
        .setAcctTypeWithRoot(
          ["0xc48Fbc7018240127859F3983Ff10DA7A0CFE2620"],
          "OPERATOR"
        )
        .send({ from: accounts[0] }, function (error, result) {
          if (error) {
            console.log("error", error);
            resolve({ status: 0, resData: error });
          } else {
            console.log("result ondemand", result);
            resolve({ status: 1, resData: result });
          }
        });
    });
  }
  /** Creating new wallet adderss */
  async get_address() {
    var passphrase = this.web3.utils.randomHex(32);
    var new_acc = this.web3.eth.accounts.create(passphrase);
    return {
      address: new_acc.address,
      private_key: new_acc.privateKey,
      passphrase: passphrase,
    };
  }

  /** Get Wallet balance -old */
  async getBalance(walletAddress) {
    return await new Promise(async function (resolve, reject) {
      var balance = await web3.eth.getBalance(walletAddress);
      if (balance.toNumber()) {
        var ethWei = {
          wei: balance.toNumber(),
          ether: web3.fromWei(balance.toNumber(), "ether"),
        };
        return resolve(ethWei);
      } else {
        return resolve({ wei: 0, ether: 0 });
      }
    });
  }

  /** Get Wallet Toekn balance */
  async getUserERC20TokenBalance(walletAddress) {
    let _this = this;
    return await new Promise(async function (resolve, reject) {
      let contract = await new _this.web3.eth.Contract(
        JSON.parse(_this.abi),
        _this.token_address
      );
      // console.log('contract:',contract)
      var balance = await contract.methods.balanceOf(walletAddress).call();
      console.log("balance:", balance);
      var decimals = await contract.methods.decimals().call();
      console.log("Token decimals: ", Math.pow(10, decimals));
      console.log("Token balance: ", balance);
      // console.log('Token balanceWei: ',await bigNumberSafeMath(balance,'/',Math.pow(10, decimals)));
      var tokenBalance = await bigNumberSafeMath(
        balance,
        "/",
        Math.pow(10, decimals)
      );
      if (tokenBalance) {
        resolve(tokenBalance);
      } else {
        resolve(0);
      }
    });
  }
  async getEventData(eventName, params) {
    let _this = this;
    return await new Promise(async function (resolve, reject) {
      var tokenAbi = JSON.parse(_this.abi);
      var contract = await new _this.web3.eth.Contract(
        tokenAbi,
        _this.token_address
      );
      contract.getPastEvents(eventName, params, async (error, events) => {
        if (error) {
          console.log("error", error);
          return resolve({ status: false, error: error });
        } else {
          //console.log("events", events);
          return resolve({ status: true, events: events });
        }
      });
    });
  }
  /** Get ERC20 Toekn details */
  async getERC20TokenData() {
    var data = {};
    let contract = await new this.web3.eth.Contract(
      this.abi,
      this.token_address
    );
    data.name = await contract.methods.name().call();
    data.symbol = await contract.methods.symbol().call();
    data.decimals = await contract.methods.decimals().call();
    if (data) {
      return data;
    } else {
      return false;
    }
  }

  async getUserEthBalance(wallet, inEth) {
    var balanceInWei = await this.web3.eth.getBalance(wallet);
    if (inEth == true) {
      var balanceInEth = await this.web3.utils.fromWei(balanceInWei, "ether");
      return balanceInEth;
    }
    return balanceInWei;
  }

  async signTransactions(req, res, next) {
    var from = req.body.from_address;
    var to = req.body.to_address;
    var gasPrice = req.body.gas_price;
    var gasLimit = 21000;

    var getNonce = web3.eth.getTransactionCount(from) + 1;
    var amount = req.body.amount;
    amount = web3.toWei(amount, "ether");
    var value = web3.toHex(amount);
    var Tx = require("ethereumjs-tx");
    var rawTx = {
      nonce: web3.toHex(getNonce),
      gasLimit: web3.toHex(gasLimit),
      gasPrice: web3.toHex(gasPrice),
      from: from,
      to: to,
      value: value,
    };
    return rawTx;
  }

  /** Get gas estimation on transaction -old */
  async getGasEstimation(req) {
    var fromAddress = req.body.from_address;
    try {
      //Estimaion for ETH transfer
      if (req.coininfo.is_token == false && req.coininfo.coin_symbol == "eth") {
        var amount = await this.getUserEthBalance(fromAddress, true);
        var amountWei = await this.web3.utils.toWei(amount.toString(), "ether");
        //var estimateGas = await this.getGasEstimation(toAddress, amountWei);
        try {
          var gasEstimate = await this.web3.eth.estimateGas({
            to: req.body.to,
            value: this.web3.utils.toHex(amountWei),
          });
          if (gasEstimate) {
            console.log("ETH gasEstimate:", gasEstimate);
            return {
              status: true,
              gas_estimate: gasEstimate,
              gas_price_gwei: config.ETH_GAS_PRICE,
            };
          } else {
            return { status: false, gas_estimate: 0 };
          }
        } catch (error) {
          return { status: false, gas_estimate: 0 };
        }
      }
      //Gas estimation for ERC20 tokens transfer
      else if (req.coininfo.is_token == true) {
        var userBalance = await this.getUserERC20TokenBalance(
          req.coininfo.token_address,
          JSON.parse(config.ERC20_TOKEN_ABI),
          fromAddress
        );
        req.body.amount = userBalance;
        console.log(
          "-------------------gas estimate ---------------------------"
        );
        console.log(req.body.amount, "*", req.coininfo.decimals);
        var finalTokenAmount = await bigNumberSafeMath(
          req.body.amount,
          "*",
          req.coininfo.decimals
        );
        finalTokenAmount = await exponentialToDecimal(finalTokenAmount);
        console.log("finalTokenAmount:", finalTokenAmount);
        var gasPriceGwei = config.ERC20_GAS_PRICE;
        var gas = await this.getErc20TokenTransferGasEstimationCost(
          req.body.to,
          fromAddress,
          finalTokenAmount
        );
        gas = gas + config.ERC20_TX_GAS_BUFFER;
        var dubleGasFee = await bigNumberSafeMath(gas, "*", 2);
        return {
          status: true,
          gas_estimate: dubleGasFee,
          gas_price_gwei: gasPriceGwei,
        };
      } else {
        return {
          status: false,
          gas_estimate: 0,
          message: "Invalid coin request.",
        };
      }
    } catch (error) {
      console.log("catch error token gas estimation : ", error);
      return {
        status: false,
        gas_estimate: 0,
        message:
          "Unable to estimate erc20 token transfer gas fee, Please try again.",
      };
    }
  }

  /**
   * Calculate estimation gas for tokens transfer, Dev-SK
   */
  async getTokensTransferGasEstimation(
    contract,
    address,
    gasPriceGwei,
    to,
    value
  ) {
    return new Promise(function (resolve, reject) {
      contract.methods.transfer(to, value).estimateGas(
        {
          from: address,
          gasPrice: gasPriceGwei,
        },
        function (error, estimatedGas) {
          if (error) {
            reject(estimatedGas);
          } else {
            resolve(estimatedGas);
          }
        }
      );
    });
  }

  //Dev-SK
  async broadcastEthRawTx(rawTx, cb) {
    var rawTx = rawTx.toString("hex");
    var sendRawRes = await this.web3.eth
      .sendSignedTransaction("0x" + rawTx)
      .on("transactionHash", (txHash) => {
        cb(null, txHash);
      })
      .on("error", (err) => {
        console.log("err:: ", err);
        cb(err, null);
      });
  }

  /**
   * ETH, Raw transaction for testing purpose only
   */
  async getRawTrnxForTest(nonceVal) {
    //Generate Raw transaction
    const Tx = require("ethereumjs-tx");
    const privateKey = new Buffer(
      "0A37A09282FF2C4DE1F31517259737B0D0BD5BC711D6DFD124F3E352A094DE68",
      "hex"
    );
    var from_address = "0x72d5E9c7C277Dbb30EaEA6bacfDCC67d5e854c61";
    var value = await this.web3.utils.toHex(0.01 * 1000000000000000000);
    var liveNonce = await this.web3.eth.getTransactionCount(
      from_address,
      "pending"
    );
    //var nonce = this.web3.utils.toHex(liveNonce);
    var nonce = nonceVal;
    console.log("liveNonce: ", nonce);

    var gasPrice = this.web3.utils.toHex(10000000000); //10 gwei
    var estimateGas = this.web3.utils.toHex(21000); // eth gas
    var to = "0x3314bf4B1286F495B1fe8908F7d0f05D8818b168";
    const rawTx = {
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: estimateGas,
      to: to,
      value: value,
      from: from_address,
    };
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    console.log("serializedTx: ", serializedTx);
    return serializedTx;
  }

  /**
   *ERC20, Raw transaction for testing purpose only
   */
  async getRawTrnxForERC20Test(nonceVal, decimals) {
    console.log("fun- getRawTrnxForERC20Test");

    //Generate Raw transaction
    const Tx = require("ethereumjs-tx");
    const privateKey = new Buffer(
      "0A37A09282FF2C4DE1F31517259737B0D0BD5BC711D6DFD124F3E352A094DE68",
      "hex"
    );
    var from_address = "0x72d5E9c7C277Dbb30EaEA6bacfDCC67d5e854c61";
    var to = "0x3314bf4B1286F495B1fe8908F7d0f05D8818b168";
    var amount = 10;
    //var liveNonce = await this.web3.eth.getTransactionCount(from_address, 'pending');
    var nonce = nonceVal;
    console.log("liveNonce: ", nonce);
    var gasPriceTokens = this.web3.utils.toHex(config.ERC20_GAS_PRICE); //10 gwei
    let contract = new this.web3.eth.Contract(this.abi, this.token_address, {
      from: from_address,
    });

    //Get estimated gas
    var finalTokenAmount = await bigNumberSafeMath(amount, "*", decimals);
    //var gasPriceGwei = config.ERC20_GAS_PRICE;
    var gas = await this.getErc20TokenTransferGasEstimationCost(
      to,
      from_address,
      finalTokenAmount
    );

    var estimateGas = gas + config.ERC20_TX_GAS_BUFFER;
    console.log("gas: ", gas, "EstimatedBufferGas: ", estimateGas);
    estimateGas = this.web3.utils.toHex(estimateGas); // eth gas

    var rawTx = {
      from: from_address,
      to: to,
      gasPrice: gasPriceTokens,
      gasLimit: estimateGas,
      value: finalTokenAmount,
      data: contract.methods.transfer(to, finalTokenAmount).encodeABI(),
      nonce: this.web3.utils.toHex(nonce),
    };

    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    console.log("serializedTx: ", serializedTx);
    return serializedTx;
  }

  /**
   * Get wallet nonce + pending status
   */
  async getWalletNonce(wallet) {
    return await this.web3.eth.getTransactionCount(wallet, "pending");
  }

  /**
   *  Check if eth wallet is valid
   */
  async ethValidateWallet(address) {
    return await this.web3.utils.isAddress(address);
  }
  //Get estimation gas fees cost in 'wei' for ERC20 token transfer, Dev-SK, 19-march, 2019
  async getErc20TokenTransferGasEstimationCost(
    toAddress,
    fromAdress,
    tokenValue
  ) {
    let contract = new this.web3.eth.Contract(this.abi, this.token_address);
    var newTokenAmount = Math.round(tokenValue);
    newTokenAmount = await exponentialToDecimal(newTokenAmount);
    console.log("Math.round newTokenAmount:", newTokenAmount);
    // newTokenAmount = this.web3.utils.toBN(newTokenAmount)
    let value_new = this.web3.utils.toHex(newTokenAmount);
    console.log("web3.utils.toHex:", value_new);
    let gasPriceGwei = config.ERC20_GAS_PRICE;

    return new Promise(function (resolve, reject) {
      contract.methods.transfer(toAddress, value_new).estimateGas(
        {
          from: fromAdress,
          gasPrice: gasPriceGwei,
        },
        function (error, estimatedGas) {
          if (error) {
            console.log("Error in estimation gas: ", error);
            reject(estimatedGas);
          } else {
            resolve(estimatedGas);
          }
        }
      );
    });
  }
};
