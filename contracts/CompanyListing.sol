pragma solidity ^0.5.0;

contract CompanyListing {
	uint public listingCount = 0;
	// addresses of banks
	address[] public bankAddresses = [0x32bAe766f067E46ccF08560C47cCf25C4C214065,
								 	 0x935Bb1908AF1E5c3CEcE5248336277873E106159,
								 	 0x989e12AA643CcA35156E47A38C6Ae95c6c4c9c2d];

	struct Listing {
		uint listingId;
		bool approved;
		bool dbApproved;
		bool ecbApproved;
		bool nlbApproved;

		// basic company information
		string companyName;
		string companyAddress;
		string country;

		// basic company financials
		uint earnings;
		uint netIncome;

		// basic IPO information
		uint stockPrice;
		uint numShares;
	}

	mapping(uint => Listing) public listings;

	constructor() public {
		// bootstrap with seed data
		createListing("Google", "1600 Amphitheatre Parkway; Mountain View, California", "America", 5000000, 4000000, 137, 5000);
		createListing("Amazon", "Inc 410 Terry Ave N; Seattle, Washington", "America", 8200454, 4300976, 88, 12000);
	}

	function createListing(string memory _companyName, string memory _companyAddress, string memory _country, uint _earnings,
		uint _netIncome, uint _stockPrice, uint _numShares) public {
		listingCount ++;


		// create new listing
		listings[listingCount] = Listing(listingCount, false, false, false, false, _companyName, _companyAddress, _country, _earnings, _netIncome, _stockPrice,
			_numShares);
	}

	function approveListing(uint listingId) {
		
	}
}