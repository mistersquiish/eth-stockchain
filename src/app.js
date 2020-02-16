App = {
	loading: false,
	contracts: {},

	load: async() => {
		// Library to communicate with the Eth blockchain
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
	loadWeb3: async () => {
		if (typeof web3 !== 'undefined') {
		    App.web3Provider = web3.currentProvider
		    web3 = new Web3(web3.currentProvider)
		} else {
	    	window.alert("Please connect to Metamask.")
	    }
		// Modern dapp browsers...
	 	if (window.ethereum) {
	    	window.web3 = new Web3(ethereum)
	    	try {
	     		// Request account access if needed
	     		await ethereum.enable()
	    		// Acccounts now exposed
	    		web3.eth.sendTransaction({/* ... */})
	    	} catch (error) {
	        // User denied account access...
	    	}
	    }
	    // Legacy dapp browsers...
	    else if (window.web3) {
	    	App.web3Provider = web3.currentProvider
	    	window.web3 = new Web3(web3.currentProvider)
	    	// Acccounts always exposed
	    	web3.eth.sendTransaction({/* ... */})
		}
	    // Non-dapp browsers...
	    else {
	    	console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
	    }
	},

	loadAccount: async () => {
		App.account = web3.eth.accounts[0]
	},

	loadContract: async () => {
		const companyListing = await $.getJSON('CompanyListing.json')
		App.contracts.CompanyListing = TruffleContract(companyListing)
   		App.contracts.CompanyListing.setProvider(App.web3Provider)

   		// Hydrate the smart contract with values from the blockchain
    	App.companyListing = await App.contracts.CompanyListing.deployed()
	},

	render: async() => {
		// Prevent double render
	    if (App.loading) {
	      return
	    }

	    App.setLoading(true)

	    // Render Account
	    $('#account').html(App.account)

	    // Render Bank Information
	    await App.renderBanks()

	    // Render Authorization
	    await App.renderAuthorization()

	    // Render Tasks
	    await App.renderListings()

	    // Update loading state
	    App.setLoading(false)
	},

	renderBanks: async () => {
		// Load the total bank count from the blockchain
	    const bankCount = await App.companyListing.bankCount()
	    var banks = {}
	    // Render out each bank
	    for (var i = 1; i <= bankCount; i++) {
	    	const bank = await App.companyListing.banks(i)
	    	const bankId = bank[0].toNumber()
	    	const bankAddress = bank[1]
	    	const bankName = bank[2]

	    	banks[bankAddress] = bankName
	    }
	    App.banks = banks
	    
	},

	renderAuthorization: async() => {
		if (App.account in App.banks) {
	    	App.authorized = true
	    	document.querySelector('#welcome-message').textContent = "Welcome " + App.banks[App.account] + "! These listings require your attention."
	    } else {
	    	App.authorized = false
	    }
	},

	renderListings: async () => {
	    // Load the total company listing count from the blockchain
	    const listingCount = await App.companyListing.listingCount()

	    // create html elements to programatically add them to index.html
	    var approvedHTML = document.createElement("i")
	    approvedHTML.classList.add('fas');
	    approvedHTML.classList.add('fa-check');

	    var unapprovedHTML = document.createElement("i")
	    unapprovedHTML.classList.add('fas');
	    unapprovedHTML.classList.add('fa-times');

	    var approveButton = document.createElement("BUTTON");
	    approveButton.classList.add('btn-approveCompanyListing');
	    approveButton.classList.add('btn');
	    approveButton.classList.add('btn-primary');
	    approveButton.innerHTML = "Approve Company";

	    // Render out each company listing with a new company listing template
	    for (var i = 1; i <= listingCount; i++) {
    		// Fetch the company listing data from the blockchain
	    	const listing = await App.companyListing.listings(i)
	     	const listingId = listing[0].toNumber()
	   		const approved = listing[1]
	   		const dbApproved = listing[2]
	   		const ecbApproved = listing[3]
	   		const nlApproved = listing[4]
	      	const companyName = listing[5]
	      	const companyMailingAddress = listing[6]
	      	const country = listing[7]
	      	const earnings = listing[8]
	      	const income = listing[9]
	      	const stockPrice = listing[10]
	      	const numShares = listing[11]

			
		    // Clone the new row and populate with data from blockchain
		    var rowTemplate = document.querySelector('#companyListingRow');
		    var clone = rowTemplate.content.cloneNode(true);
		    var td = clone.querySelectorAll("td");

		    // if verified bank and hasn't approved yet, add approval buttons
		    if (App.authorized === true) {
		    	if ((App.banks[App.account] === "Deutsche Bank" && dbApproved === false) ||
		    		(App.banks[App.account] === "European Central Bank" && ecbApproved === false) ||
		    		(App.banks[App.account] === "Norddeutsche Landesbank" && nlApproved === false)) {
		    			// set id for approveListing button
					    //var newApproveButton = "";
					    var newApproveButton = approveButton.cloneNode(true);
					    newApproveButton.setAttribute("id", "btn-company-" + listingId);
					    td[0].append(newApproveButton);
		    	   } else {
		    	   		td[0].textContent = "You already approved"
		    	   }
		    	
		    }

		    // fill rest of the template with information we got from the blockchain
		    td[1].textContent = (approved === true) ? "Approved" : "Not Approved";
		    (dbApproved === true) ? td[2].append(approvedHTML.cloneNode()) : td[2].append(unapprovedHTML.cloneNode());
		    (ecbApproved === true) ? td[3].append(approvedHTML.cloneNode()) : td[3].append(unapprovedHTML.cloneNode());
		    (nlApproved === true) ? td[4].append(approvedHTML.cloneNode()) : td[4].append(unapprovedHTML.cloneNode());
		    td[5].textContent = companyName;
		    td[6].textContent = companyMailingAddress;
		    td[7].textContent = country;
		    td[8].textContent = "$" + earnings;
		    td[9].textContent = "$" + income;
		    td[10].textContent = "$" + stockPrice;
		    td[11].textContent = numShares;

		    // add the listing to the correct table (approved or unapproved)
		    var tbody;
		    if (approved === true) {
		    	tbody = document.querySelector("#approvedTBody");
		    } else {
		    	tbody = document.querySelector("#unapprovedTBody");
		    }
		    tbody.appendChild(clone);
		    
	    }
  	},

  	// loading indicator effect
	setLoading: (boolean) => {
	    App.loading = boolean
	    const loader = $('#loader')
	    const content = $('#content')
	    if (boolean) {
	      loader.show()
	      content.hide()
	    } else {
	      loader.hide()
	      content.show()
	    }
  	}

}

// approve company listing
$(document).on("click", ".btn-approveCompanyListing", async function() {
	App.setLoading(true)
	const companyListingId = this.id.split("-")[2]
	console.log(companyListingId)
    await App.companyListing.approveListing(companyListingId)
    window.location.reload()
	console.log(this.id);
});

$(() => {
	$(window).load(() => {
		App.load()
	})
})