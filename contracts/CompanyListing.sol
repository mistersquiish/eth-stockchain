pragma solidity ^0.5.0;

contract CompanyListing {
	uint public listingCount = 0;
	uint public bankCount = 0;
	// addresses and names of banks
	address[] public bankAddresses = [0x32bAe766f067E46ccF08560C47cCf25C4C214065,
								 	 0x935Bb1908AF1E5c3CEcE5248336277873E106159,
								 	 0x989e12AA643CcA35156E47A38C6Ae95c6c4c9c2d];
	string[] public bankNames = ["Deutsche Bank", "European Central Bank", "Norddeutsche Landesbank"];
	mapping(uint => Bank) public banks;

	mapping(uint => Listing) public listings;

	struct Bank {
		uint bankId;
		address bankAddress;
		string bankName;
	}

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

	constructor() public {
		// set bank mapping
		for (uint i = 0; i < bankAddresses.length; i++) {
			bankCount ++;
			banks[bankCount] = Bank(bankCount, bankAddresses[i], bankNames[i]);
		}

		// bootstrap with seed data
		createListing("Google", "1600 Amphitheatre Parkway; Mountain View, California", "America", 5000000, 4000000, 137, 5000);
		createListing("Amazon", "Inc 410 Terry Ave N; Seattle, Washington", "America", 8200454, 4300976, 88, 12000);
	}

	function createListing(string memory _companyName, string memory _companyMailingAddress, string memory _country, uint _earnings,
		uint _netIncome, uint _stockPrice, uint _numShares) public {
		listingCount ++;


		// create new listing
		listings[listingCount] = Listing(listingCount, false, false, false, false, _companyName, _companyMailingAddress, _country, _earnings, _netIncome, _stockPrice,
			_numShares);
	}

	function approveListing(uint _companyId) public {
		
		bool isVerified = false;
		uint indexBankAddress = 0;
		for (uint i = 0; i < bankAddresses.length; i++) {
			if (bankAddresses[i] == msg.sender) {
				isVerified = true;
				indexBankAddress = i;
			}
		}
		require(isVerified == true);

		Listing memory _listing = listings[_companyId];

		// change the boolean on the correct bank
		if (indexBankAddress == 0) { _listing.dbApproved = true; } else
		if (indexBankAddress == 1) { _listing.ecbApproved = true; } else
		{ _listing.nlApproved = true; }

		if (_listing.dbApproved == true && _listing.ecbApproved == true && _listing.nlApproved == true) {
			_listing.approved = true;
			emit listingApprovalComplete(_companyId, _listing.companyName, _listing.approved);
		}
	    
	    listings[_companyId] = _listing;
	    emit bankApprovalComplete(_companyId, _listing.companyName, _listing.dbApproved, bankNames[indexBankAddress], bankAddresses[indexBankAddress]);
	}
}





