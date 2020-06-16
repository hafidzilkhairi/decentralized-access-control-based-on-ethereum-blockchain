const ControlAccessManagement = artifacts.require("ControlAccessManagement.sol");

module.exports = function (deployer) {
  deployer.deploy(ControlAccessManagement);
};
