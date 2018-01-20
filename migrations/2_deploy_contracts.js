var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Factory = artifacts.require("./Factory.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Factory);
};
