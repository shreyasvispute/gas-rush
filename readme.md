# Gas-Rush

Gas-Rush provides necessary gas prices to get insights on current gas prices which are required to run the Ethereum Blockchain.

## Motivation

Crypto exchanges constantly interact with Ethereum blockchain to carry out various activities like withdraws, dApp Interactions, etc. Everytime exchanges make an interaction a transaction fee is charged: Gas used by the transaction \* Gas Price. Gas-Rush provides crucial APIs to get Gas Prices and utilize the chain in a cost effective manner. Gas-Rush uses publicly available gas price data-feeds from Etherscan which gives gas prices in Gwei.

## Configuration

To run the application we need to set environment variables, edit example.env to .env

- Etherscan API Key to get gas prices from data-feed

  1. `Create an account to get the API key` - [Etherscan](https://docs.etherscan.io/getting-started/creating-an-account)

- Set variables

1. `PORT` - Specifies which port server should run on
2. `MONGODB_URL` - Set the connection string of MongoDB
3. `MONGODB_DB`- Set your DB name here
4. `POLLTIME`- Polling time in ms
5. `APIKEY` - Enter your API key here
6. `APIURL` - Etherscan API URL here

You can find starter variables given except for the Etherscan API KEY in example.env

## Installing

A step by step set of commands that tell you how to get project running on local environment

To run the project:

```
npm install
npm start
```

A Dockerfile is included in the deployment, To run it:

```
docker-compose build
docker-compose up
```

## Running the tests

To run the tests:

```
npm test
```

## Technicals

Technologies used:

- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)

### Fundamentals

- Application uses REST API which polls Etherscan API every POLLTIME ms that gets the data and stores it in MongoDB with fast, low and average prices.
Application architecture could further be imporved by adding websockets which could handle the data in real-time, we can use socket.io or any other library for that purpose.
- UI in application can further be insightful by adding charts that prove comphrensible by including the historical data that is stored in the application. We can use Angular or React.js to build the frontend components.
Data from Etherscan and EthGasStation and other publicly available APIs can be integrated to further improve insights. We have used Etherscan for ingesting gas prices into the DB.
- We can use Firebase or Kafka to get and store real time data from the APIs and use the data into the application. A full-fledge application can be built by integrating login system where user can subscribe to the prices and get real time updates on the gas prices.

## API Usage Docs

1. `GET /gas`- gets the latest gas prices from the Etherscan

   - `fast` - provides the fastest gas price in gwei
   - `slow` - provides the safeLow gas price in gwei
   - `average` - fast, provides the average between fastest, fast, and safeLow gas price in gwei
   - `blockNum` - latest ethereum block number

```

{
    "error":false,
    "message":{
        "fast":216,
        "slow":214,
        "average":214,
        "blockNum":14266328
        }
}

```

2. `GET /average` - This API takes in the fromTime and toTime as inputs to and provide the average gas price of the data

   - `averageGasPrice` - provides the average gas prices from the gas price in DB in gwei
   - `fromTime` - ouptuts the UNIX timestamp from time
   - `toTime` - outputs the UNIX timestamp to time

```

{
    "error":false,
    "message":{
        "averageGasPrice":176,
        "fromTime":1645466857,
        "toTime":1645466874
        }
}

```

## Authors

- **Shreyas Vispute** - [ShreyasVispute](https://github.com/shreyasvispute/)
