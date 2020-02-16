# *eth-deutsche-boerse*
ETH-Deutsche-Boerse is a blockchain application that utilizes the Ethereum smart contracts to automate and assert rules on listing companies on the stock exchange. The frontend is javascript, persistence is done using the ETH network, and the architecture is based on the Truffle framework.

ETH-Deutsche-Boerse is meant to be run on a local ETH network as the parties are known and trusted. Trusted banks can submit company listings with informations about the company, company financials, and IPO information. Once submited, other banks can view this information and choose to approve the listing. Once all banks approve, the listing is officially approved.

Time spent: **13** hours spent in total

## User Stories

The following **required** user stories are complete:

- [x] Only verified banks of a certain address can add company listings
- [x] Only verified banks can approve their respective approval boolean
- [x] Users can view the list of approved and unapproved listings
- [ ] Data validation for company listing (currently only checks for empty)

## Application Screenshots

### Home page
<img src="https://imgur.com/2JEP1ZQ" width=250>

### Add listing page
<img src="https://imgur.com/YzDQYtW" width=250>"

## Notes

- Project was conceived as a project for WHU's Intro to Blockchain course.
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
