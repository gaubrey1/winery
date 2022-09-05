<!-- ABOUT THE PROJECT -->
# <h1 align="center">Winery</h1>
```
```
## About The Project
Winery is an NFT marketplace for minting, buying and selling wines(vintage wine as well). It is a marketplace for users to showcase their love of wine as well as exchange minted wine NFTs. Users are able to
1. Mint a wine NFT
2. Buy minted wine NFT
3. Gift minted wine NFT to other users using their wallet address

[Live demo](https://gaubrey1.github.io/winery/)

## :man_technologist: Languages/tools used for this project includes

* [React.js](https://reactjs.org/)
* [Hardhat](https://hardhat.org/getting-started/)
* [Solidity](https://docs.soliditylang.org/en/v0.8.11/)
* [Openzeppelin](https://openzeppelin.com/)
* [Bootstrap](https://getbootstrap.com)
* [Celo-tools](https://docs.celo.org/learn/developer-tools)


## :point_down: Getting Started

### Prerequisites

You will need node and yarn installed.

### Installation

Step-by-step guide to running this NFT minter locally;

1. Clone the repo
   ```sh
   git clone https://github.com/gaubrey1/winery.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

3. Run your application
   ```sh
   npm start
   ```
   
### Smart-Contract-Deployment

Compile the smart contract
   ```sh
   npx hardhat compile
   ```
Run tests on smart contract
   ```sh
   npx hardhat test
   ```
Update env file

* Create a file in the root directory called ".env"
* Create a key called MNEMONIC and paste in your mnemonic key. e.g
     ```
   MNEMONIC="xxxx xxxx xxxx xxxx xxxx xxxx"
   ```
You can get your MNEMONIC from Metamask Recovery security phrase in settings

Deploy the smart contract
   ```sh
    npx hardhat run scripts/deploy.js
   ```
Run the project
   ```sh
    npm start
   ```
   
<!-- CONTRIBUTING -->

## :writing_hand: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your new feature branch (`git checkout -b feature/newfeature`)
3. Commit your changes (`git commit -m 'added a/some new feature(s)'`)
4. Push to the branch (`git push origin feature/newfeature`)
5. Open a pull request


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

#  Thank you
