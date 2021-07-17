const Web3 = require("web3");
// const abiDecoder = require("abi-decoder");

// let web3 = new Web3("https://rpc-mainnet.matic.network");
let web3 = new Web3("http://127.0.0.1:8545");

const factoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "PairCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allPairs",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "allPairsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "createPair",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToSetter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "setFeeToSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const swapAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const pairAbi = [];

const swapAddr = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
const factoryAddr = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";

const inTokenAddr = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
const outTokenAddr = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

const myAddr = "0xd8aBbc1AAC264f84d3aae1e6E501fe8EC3EB99d1";

const yourPrivateKey = "";

async function main() {
  const factory = new web3.eth.Contract(factoryAbi, factoryAddr);
  const swap = new web3.eth.Contract(swapAbi, swapAddr);

  while (true) {
    const pairAddr = await factory.methods
      .getPair(inTokenAddr, outTokenAddr)
      .call();
    console.log(pairAddr);
    if (pairAddr != "0x0000000000000000000000000000000000000000") {
      const swapTx = await swap.methods.swapExactTokensForTokens(
        10000,
        0,
        [
          inTokenAddr,
          outTokenAddr,
        ],
        myAddr,
        // currentBlock + 10
        99999999999
      );

      const swapSigned = await web3.eth.accounts.signTransaction(
        {
          to: swapAddr,
          data: swapTx.encodeABI(),
          gas: "5000000",
          gasPrice: "50000000000",
        },
        yourPrivateKey
      );

      const swapResponse = await web3.eth.sendSignedTransaction(
        swapSigned.rawTransaction
      );

      console.log(swapResponse)
      break

    }
  }
}

main();
