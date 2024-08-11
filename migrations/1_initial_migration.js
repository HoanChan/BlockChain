const TheoDoi = artifacts.require("TheoDoi");

module.exports = function(deployer) {
  deployer.deploy(TheoDoi);
};

// const TheoDoiSanPham = artifacts.require("TheoDoiSanPham");

// module.exports = function(deployer) {
//   deployer.deploy(TheoDoiSanPham);
// };