pragma solidity ^0.5.0;

/*
	The purpose of this contract is to automate the approval process of company listing for a stock exchange.
	Created on 2/14/2020 by Henry Vuong

	Made for the WHU course Intro to Blockchain

	Run using the Truffle framework, Ganache, and MetaMask
*/

contract CompanyListing {
	// indexes for mappings
	uint public bankCount = 0;
	uint public listingCount = 0;
	mapping(uint => Listing) public listings;
	mapping(address => Bank) public banks;

	// addresses and names of banks
	address[] public bankAddresses = [0x32bAe766f067E46ccF08560C47cCf25C4C214065,
								 	 0x935Bb1908AF1E5c3CEcE5248336277873E106159,
								 	 0x989e12AA643CcA35156E47A38C6Ae95c6c4c9c2d];
	string[] public bankNames = ["Deutsche Bank", "European Central Bank", "Norddeutsche Landesbank"];

	struct Bank {
		uint bankId;
		address bankAddress;
		string bankName;
	}

	// represents a company listing
	struct Listing {
		uint listingId;
		bool approved;
		bool dbApproved;
		bool ecbApproved;
		bool nlApproved;

		// basic company information
		string companyName;
		string companyMailingAddress;
		string country;

		// basic company financials
		uint earnings;
		uint netIncome;

		// basic IPO information
		uint stockPrice;
		uint numShares;
	}

	event bankApprovalComplete(
	    uint companyId,
	    string companyName,
	    bool completed,
	    string bankName,
	    address bankAddress
  	);

  	event listingApprovalComplete(
  		uint companyId,
	    string companyName,
	    bool completed
  	);

  	event listingAddedComplete(
  		uint companyId,
	    string companyName,
	    string bankUnderwriter
  	);

	constructor() public {
		// set bank mapping
		for (uint i = 0; i < bankAddresses.length; i++) {
			bankCount ++;
			banks[bankAddresses[i]] = Bank(bankCount, bankAddresses[i], bankNames[i]);
		}

		// bootstrap with seed data
		createListing("Google", "1600 Amphitheatre Parkway; Mountain View, California", "United States", 5000000, 4000000, 137, 5000);
		createListing("Amazon", "Inc 410 Terry Ave N; Seattle, Washington", "United States", 8200454, 4300976, 88, 12000);
		createListing("Microsoft", "15010 NE 36th, St.; Redmond, WA", "United States", 90200454, 2338271, 182, 20000);
		createListing("Facebook", "1 Hacker Way; Menlo Park", "United States", 724002, 66093, 203, 10000);
	}

	function createListing(string memory _companyName, string memory _companyMailingAddress, string memory _country, int _earnings,
		int _netIncome, int _stockPrice, int _numShares) public {
		// require that the bank is a verified bank
		require(isVerified() == true);

		// require none of the fields to be blank
		bytes memory companyNameBytes = bytes(_companyName);
		bytes memory companyMailingAddressBytes = bytes(_companyMailingAddress);
		bytes memory countryBytes = bytes(_country);

		require(companyNameBytes.length != 0);
		require(companyMailingAddressBytes.length != 0);
		require(countryBytes.length != 0);
		require(_earnings > 0);
		require(_netIncome > 0);
		require(_stockPrice > 0);
		require(_numShares > 0);

		// create new listing
		listingCount ++;
		listings[listingCount] = Listing(listingCount, false, false, false, false, _companyName, _companyMailingAddress, _country,
										uint(_earnings), uint(_netIncome), uint(_stockPrice), uint(_numShares));

		emit listingAddedComplete(listingCount, _companyName, banks[msg.sender].bankName);
	}

	function approveListing(uint _companyId) public {
		// require that the bank is a verified bank while also 
		require(isVerified() == true);

		// get the company listing based on given Id
		Listing memory _listing = listings[_companyId];

		// change the approval to true on the bank
		if (msg.sender == bankAddresses[0]) { _listing.dbApproved = true; } else
		if (msg.sender == bankAddresses[1]) { _listing.ecbApproved = true; } else
		{ _listing.nlApproved = true; }

		// check if all banks have approved, if yes then the listing is approved completely
		if (_listing.dbApproved == true && _listing.ecbApproved == true && _listing.nlApproved == true) {
			_listing.approved = true;
			emit listingApprovalComplete(_companyId, _listing.companyName, _listing.approved);
		}
	    
	    // save listing to blockchain
	    listings[_companyId] = _listing;
	    emit bankApprovalComplete(_companyId, _listing.companyName, _listing.dbApproved, banks[msg.sender].bankName, msg.sender);
	}

	function isVerified() public returns(bool) {
		bool isVerifiedBool = false;
		if (banks[msg.sender].bankId != 0) {
			isVerifiedBool = true;
		}
		return isVerifiedBool;
	}
}





