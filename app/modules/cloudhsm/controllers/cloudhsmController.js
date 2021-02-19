/** Database table schemas. */
var sequelize = require("sequelize");
const tblCloudConfig = require("../schemas/cloudConfigSchema");
const config = require("../../../../config/config");

const Op = sequelize.Op;

module.exports = {
  /**
   * saved cloud config api
   * */
  saveConfig: async (req, res, next) => {
    try {
      const currentUTCDate = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      let cloudConfig = {
        exchange_id: req.user.id,
        cloud_config_name: req.body.cloud_config_name,
        service_key_name: req.body.service_key_name,
        target_address: req.body.target_address,
        azure_user_id: req.body.azure_user_id,
        azure_user_secret: req.body.azure_user_secret,
        subscription_id: req.body.subscription_id,
        tenant_id: req.body.tenant_id,
        vault_name: req.body.vault_name,
        public_address: req.body.public_address,
        created_at: currentUTCDate,
        updated_at: currentUTCDate,
      };
      let cloudConfigSave = await tblCloudConfig.create(cloudConfig);
      let cloudConfigId = cloudConfigSave.id;
      /* set environment configuration*/
      let config_url =
        "https://console-ko.kaleido.io/api/v1/consortia/k0ywdh70ab/environments/k0fs8005we/configurations";
      let bodyData = {
        type: "cloudhsm",
        name: req.body.cloud_config_name,
        membership_id: config.kaleido_membership_id,
        details: {
          provider: "azure",
          target_address: req.body.target_address,
          user_id: req.body.azure_user_id,
          user_secret: req.body.azure_user_secret,
          subscription_id: req.body.subscription_id,
          tenant_id: req.body.tenant_id,
          vault_name: req.body.vault_name,
        },
      };
      console.log("bodyData", bodyData);
      let inputPOST = {
        url: config_url,
        json: true,
        headers: {
          Authorization: config.kaleido_config_api_key,
        },
        body: bodyData,
      };
      // let inputPOST = {
      //   method: "post",
      //   body: JSON.stringify(bodyData),
      //   headers: {
      //     "Content-Type": "application/json",
      //     authorization: config.kaleido_config_api_key,
      //   },
      // };
      console.log("inputPOST", inputPOST);
      let configRes = await await_post_request(inputPOST);
      console.log("configRes", configRes);

      if (configRes.status) {
        let cloudhsm_id = configRes.data._id;
        await tblCloudConfig.update(
          { cloudhsm_id: cloudhsm_id },
          { where: { id: cloudConfigId } }
        );
        /* set service configuration */
        let service_config_url = `https://console-ko.kaleido.io/api/v1/consortia/k0ywdh70ab/environments/k0fs8005we/services`;
        let service_config = {
          name: req.body.service_key_name,
          membership_id: config.kaleido_membership_id,
          service: "cloudhsm",
          details: {
            cloudhsm_id: cloudhsm_id,
          },
        };

        let serviceInputPOST = {
          url: service_config_url,
          json: true,
          headers: {
            Authorization: config.kaleido_config_api_key,
          },
          body: service_config,
        };

        let serviceConfigRes = await await_post_request(serviceInputPOST);
        console.log("serviceConfigRes", serviceConfigRes);

        if (serviceConfigRes.status) {
          let service_id = serviceConfigRes.data._id;
          await tblCloudConfig.update(
            { service_id: service_id },
            { where: { id: cloudConfigId } }
          );

          return res.status(200).send({
            status: true,
            data: data,
            message: "Cloud hsm configuration has been saved.",
          });
        } else {
          return res
            .status(400)
            .send({ status: false, message: serviceConfigRes.error });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: configRes.error });
      }
      // });
    } catch (error) {
      return res
        .status(400)
        .send({ status: false, data: `${error}`, message: error.message });
    }
  },
};
