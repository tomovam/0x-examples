// swap.js
// const { ethers } = require("ethers");
// const axios = require("axios");
// const { WALLET_SECRET } = require("./constants");
import { ethers } from "ethers";
import axios from "axios";
import { API_KEY, WALLET_SECRET } from "./constants.js";

const SEPOLIA_SWAP_API = "https://sepolia.api.0x.org/swap/v1/quote";

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/c616a0840d4b4a8ebc088f29d56fefe1"
);
const wallet = new ethers.Wallet(WALLET_SECRET, provider);

const main = async () => {
  const sellAmount = ethers.parseEther("0.01"); // 0.01 ETH
  const sellToken = "ETH";
  const buyToken = "USDC"; // or any ERC20 supported by 0x on Sepolia
  try {
    // 1. Get a swap quote
    const quote = await axios.get(SEPOLIA_SWAP_API, {
      params: {
        sellToken,
        buyToken,
        sellAmount: sellAmount.toString(),
        takerAddress: wallet.address,
      },
      headers: {
        "0x-api-key": API_KEY,
        // "0x-version": "v2",
      },
    });

    console.log("Quote:", quote);
  } catch (error) {
    console.log(error);
  }

  //   // 2. Send the transaction to perform the swap
  //   const tx = await wallet.sendTransaction({
  //     to: quote.to,
  //     data: quote.data,
  //     value: quote.value,
  //     gasLimit: ethers.utils.hexlify(500000),
  //   });

  //   console.log(`Transaction sent: ${tx.hash}`);
  //   await tx.wait();
  //   console.log("Swap complete.");
};

main().catch(console.error);

curl "https://sepolia.api.0x.org/swap/v1/quote?sellToken=WETH&buyToken=WETH&sellAmount=10000000000000000&takerAddress=0xYourAddress" \
  -H "0x-api-key: 4aafad8f-90f5-45a5-8bf2-6408cc7727db"