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
	    	document.querySelector('#welcome-message').textContent = "Welcome " + App.banks[App.account] + "! Add a company listing"
	    } else {
	    	App.authorized = false
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