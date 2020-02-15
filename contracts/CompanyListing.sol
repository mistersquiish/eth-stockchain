pragma solidity ^0.5.0;

contract CompanyListing {
	uint public listingCount = 0;

	struct Listing {
		uint id;
		bool approved;

		// basic company information
		string companyName;
		// string address;
		// string country;

		// basic company financials

		// basic IPO information
		// uint stockPrice;
		// uint sharesNum;
	}

	mapping(uint => Listing) public listings;

	constructor() public {
		createListing("Google");
	}

	function createListing(string memory _companyName) public {
		listingCount ++;
		listings[listingCount] = Listing(listingCount, false, _companyName);
	}
}