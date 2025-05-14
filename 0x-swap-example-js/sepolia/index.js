import { ethers } from "ethers";
import { API_KEY, WALLET_SECRET } from "./constants.js";
const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/c616a0840d4b4a8ebc088f29d56fefe1"
);
const privateKey = WALLET_SECRET;
const wallet = new ethers.Wallet(privateKey, provider);

const DAI_ADDRESS = "0x..."; // Replace with testnet DAI token address on Sepolia
const USDC_ADDRESS = "0x..."; // Replace with testnet USDC token address on Sepolia
export const SELL_TOKEN = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; //WETH
export const BUY_TOKEN = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //UNI Stable coin
const ZEROX_EXCHANGE_PROXY = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF"; // 0x Exchange Proxy

async function approveERC20(tokenAddress, spender, amount) {
  const abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
  ];
  const token = new ethers.Contract(tokenAddress, abi, wallet);
  const tx = await token.approve(spender, amount);
  await tx.wait();
  console.log(`Approved ${amount} tokens for 0x exchange proxy`);
}

async function getQuote() {
  const sellAmount = ethers.parseUnits("1.0", 18).toString(); // 1 DAI
  const takerAddress = wallet.address;

  const url = `https://sepolia.api.0x.org/swap/v1/quote?sellToken=${DAI_ADDRESS}&buyToken=${USDC_ADDRESS}&sellAmount=${sellAmount}&takerAddress=${takerAddress}`;

  const response = await fetch(url, {
    headers: {
      "0x-api-key": API_KEY,
    },
  });
  const quote = await response.json();

  console.log("Received quote:", quote);
  return quote;
}

async function executeSwap(quote) {
  const tx = await wallet.sendTransaction({
    to: quote.to,
    data: quote.data,
    gasLimit: ethers.BigNumber.from(quote.gas),
    value: ethers.BigNumber.from(quote.value || "0"),
  });

  console.log(`Swap submitted. Tx hash: ${tx.hash}`);
  await tx.wait();
  console.log("Swap executed.");
}

(async () => {
  const quote = await getQuote();

  // Approve 0x to spend DAI
  await approveERC20(DAI_ADDRESS, ZEROX_EXCHANGE_PROXY, quote.sellAmount);

  // Execute swap
  await executeSwap(quote);
})();
