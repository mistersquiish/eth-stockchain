# *Stockchain*
Stockchain is a blockchain application that utilizes the Ethereum network and smart contracts to automate and assert rules on listing companies on the stock exchange. The frontend is javascript, persistence is done using the ETH network, and the architecture is based on the Truffle framework.

Stockchain is meant to be run on a local ETH network as the parties are known and trusted. Trusted banks can submit company listings with informations about the company, company financials, and IPO information. Once submited, other banks can view this information and choose to approve the listing. Once all banks approve, the listing is officially approved.

Time spent: **16** hours spent in total

## User Stories

The following **required** user stories are complete:

- [x] Only verified banks of a certain address can add company listings
- [x] Only verified banks can approve their respective approval boolean
- [x] Users can view the list of approved and unapproved listings
- [ ] Data validation for company listing (currently only checks for empty)

## Running the Application

1. Install Ganache for local ETH network and download MetaMask for browser interaction.
2. Once Ganache is running, copy the public keys from any three addresses and update the CompanyListing.sol file with your address values (need a better way to update the values). (https://github.com/mistersquiish/eth-deutsche-boerse/blob/master/contracts/CompanyListing.sol#L20)
3. In the eth-stockchain directory,

migrate the contract
```
$ truffle migrate
```
And start the application
```
$ npm run dev
```

## Application Screenshots

### Home page
<img src="" width=750>

### Listings page
<img src="" width=750>

### Add listing page
<img src="" width=750>

## Notes

- Project was conceived during my Germany exchange program at WHU's Intro to Blockchain course.
- First time using solidity and significantly improved my web development understanding (html, css, javascript, jquery, DOM)
- Run using Ganache for local ETH network and MetaMask for internet browser interaction
- Was a bit confused on how mappings were done and confused about the solidity programming language in general. Therefore, significant refractoring would greatly simplify the smart contract

## License

Copyright [2020] [Henry Vuong]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
