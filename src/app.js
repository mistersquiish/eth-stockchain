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

	    // Render Tasks
	    await App.renderTasks()

	    // Update loading state
	    App.setLoading(false)
	},

	renderTasks: async () => {
	    // Load the total company listing count from the blockchain
	    const listingCount = await App.companyListing.listingCount()
	    const $companyListingTemplate = $('.companyListingTemplate')

	    // approved and unapproved symbols
	    var approvedHTML = document.createElement("i")
	    approvedHTML.classList.add('fas');
	    approvedHTML.classList.add('fa-check');

	    var unapprovedHTML = document.createElement("i")
	    unapprovedHTML.classList.add('fas');
	    unapprovedHTML.classList.add('fa-times');

	    // Render out each company listing with a new company listing template
	    for (var i = 1; i <= listingCount; i++) {
    		// Fetch the company listing data from the blockchain
	    	const listing = await App.companyListing.listings(i)
	     	const listingId = listing[0].toNumber()
	   		const approved = listing[1]
	   		const dbApproved = listing[2]
	   		const ecbApproved = listing[3]
	   		const nlbApproved = listing[4]
	      	const companyName = listing[5]
	      	const companyAddress = listing[6]
	      	const country = listing[7]
	      	const earnings = listing[8]
	      	const income = listing[9]
	      	const stockPrice = listing[10]
	      	const numShares = listing[11]

			var template = document.querySelector('#companyListingRow');
		    // Clone the new row and insert it into the table
		    var tbody = document.querySelector("tbody");
		    var clone = template.content.cloneNode(true);
		    var td = clone.querySelectorAll("td");
		    td[0].textContent = (approved === true) ? "Approved" : "Not Approved";
		    (dbApproved === true) ? td[1].append(approvedHTML.cloneNode()) : td[1].append(unapprovedHTML.cloneNode());
		    (ecbApproved === true) ? td[2].append(approvedHTML.cloneNode()) : td[2].append(unapprovedHTML.cloneNode());
		    (nlbApproved === true) ? td[3].append(approvedHTML.cloneNode()) : td[3].append(unapprovedHTML.cloneNode());
		    td[4].textContent = companyName;
		    td[5].textContent = companyAddress;
		    td[6].textContent = country;
		    td[7].textContent = earnings;
		    td[8].textContent = income;
		    td[9].textContent = stockPrice;
		    td[10].textContent = numShares;
		    tbody.appendChild(clone);


	      // Show the company listing
	      //$newCompanyListingTemplate.show()
	    }
  	},

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

$(document).ready(function() {
		$('input[type="checkbox"]').click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
	});

$(() => {
	$(window).load(() => {
		App.load()
	})
})