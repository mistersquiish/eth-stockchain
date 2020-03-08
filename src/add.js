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

	    // Get Bank Info
	    await App.getBankInfo()

	    // Get Authorization
	    await App.getAuthorization()

	    // Render Account based on authorization
	    if (App.authorized) {
	    	$('#account').html("(" + App.bankInfo[2] + ") " + App.account)
	    	$('#account').css('color', '#73ff4d');
	    } else {
	    	$('#account').html(App.account)
	    }

	    // Update loading state
	    App.setLoading(false)
	},

	getBankInfo: async() => {
    	App.bankInfo = await App.companyListing.banks(App.account);
	},

	getAuthorization: async() => {
		App.authorized = getAuthorization(App.bankInfo)
		return App.authorized
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

// creating listing
$("form").submit(async function() {
	// validate inputs
	event.preventDefault()
	await App.companyListing.createListing($("#companyName").val(), $("#companyMailingAddress").val(), $("#country").val(), 
											parseInt($("#earnings").val(), 10), parseInt($("#netIncome").val(), 10), 
											parseInt($("#stockPrice").val(), 10), parseInt($("#numShares").val(), 10));

	window.location.reload()
	window.alert("Successfully submited company listing.")
});

$(() => {
	$(window).load(() => {
		App.load()
	})
})

// get dependency scripts 
$.getScript('js/contractHelper.js', function()
{ });