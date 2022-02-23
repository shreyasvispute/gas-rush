# Gas-Rush

Gas-Rush provides necessary gas prices to get insights on current gas prices which are required to run the Ethereum Blockchain.

## Motivation

Crypto exchanges constantly interact with Ethereum blockchain to carry out various activities like withdraws, dApp Interactions, etc. Everytime exchanges make an interaction a transaction fee is charged: Gas used by the transaction \* Gas Price. Gas-Rush provides crucial APIs to get Gas Prices and utilize the chain in a cost effective manner. Gas-Rush uses publicly available gas price data-feeds from Etherscan which gives gas prices in Gwei.

## Configuration

To run the application we need to set environment variables, edit example.env to .env

- Etherscan API Key to get gas prices from data-feed
  `Create an account to get the API key` - [Etherscan](https://docs.etherscan.io/getting-started/creating-an-account)
- Set variables
  `PORT` - Specifies which port server should run on
  `MONGODB_URL` - Set the connection string of MongoDB
  `MONGODB_DB`- Set your DB name here
  `POLLTIME`- Polling time in ms
  `APIKEY` - Enter your API key here
  `APIURL` - Etherscan API URL here

you can find starter variables given except for the Etherscan API KEY in example.env

## Installing

A step by step set of commands that tell you how to get project running on local environment

To run the project:

```
npm install
npm start
```

To run the Docker Image run:

```
docker build -t ethgasstation-api .
docker run -p 3000:3000 gas-rush
```

## Running the tests

To run the tests:

```
npm test
```

## Technicals

- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)

## Authors

- **Shreyas Vispute** - [ShreyasVispute](https://github.com/shreyasvispute/)
