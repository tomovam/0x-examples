import "dotenv/config";
import { ethers } from "ethers";
import { wethAbi } from "./abi/weth-abi.js";
import { usdcAbi } from "./abi/usdc-abi.js";
import { permit2Abi } from "./abi/permit2-abi.js";
export const rpcUrl = process.env.INFURA_HTTP_TRANSPORT_URL;
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const WALLET_SECRET = process.env.PRIVATE_KEY;
export const INFURA_URL = process.env.INFURA_HTTP_TRANSPORT_URL;
export const provider = new ethers.JsonRpcProvider(INFURA_URL);

export const wallet = new ethers.Wallet(WALLET_SECRET, provider);
export const connectedWallet = wallet.connect(provider);

export const sellToken = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"; //WETH
export const buyToken = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; //DAI Stable coin
export const usdcToken = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC
export const permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

// Now you can access your environment variables using process.env
export const chainId = parseInt(process.env.CHAIN_ID);
export const apiKey = process.env.API_KEY;

export const sellAmount = 100; // weth

export const wethContract = new ethers.Contract(sellToken, wethAbi, provider);
export const usdcContract = new ethers.Contract(usdcToken, usdcAbi, provider);
export const permit2Contract = new ethers.Contract(
  permit2Address,
  permit2Abi,
  provider
);
