const Migrations = artifacts.require("Migrations");
const BrandName = artifacts.require("BrandName");


module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(BrandName);

};
