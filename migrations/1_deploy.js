const TheoDoi = artifacts.require("TheoDoi");

module.exports = async function (deployer) {
  await deployer.deploy(TheoDoi);
};