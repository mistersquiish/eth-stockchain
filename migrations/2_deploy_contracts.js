const CompanyListing = artifacts.require("CompanyListing");

module.exports = function(deployer) {
  deployer.deploy(CompanyListing);
};
