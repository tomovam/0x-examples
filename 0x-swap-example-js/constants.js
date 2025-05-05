import "dotenv/config";
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const WALLET_SECRET = process.env.PRIVATE_KEY;
export const INFURA_URL = process.env.INFURA_HTTP_TRANSPORT_URL;
export const API_KEY = process.env.API_KEY;

export const SELL_TOKEN = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"; //WETH
export const BUY_TOKEN = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; //DAI Stable coin
export const USDC_TOKEN = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC
export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

// Now you can access your environment variables using process.env
export const CHAIN_ID = parseInt(process.env.CHAIN_ID);

export const SELL_AMOUNT = 0.001; // weth
