import "dotenv/config";
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const WALLET_SECRET = process.env.PRIVATE_KEY;
export const INFURA_URL = process.env.INFURA_HTTP_TRANSPORT_URL;
export const SEPOLIA_0x = process.env.SEPOLIA_0x;
export const API_KEY = process.env.API_KEY;

export const SELL_TOKEN = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; //WETH
export const BUY_TOKEN = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //UNI Stable coin
export const LINK_TOKEN = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // LINK
export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

// Now you can access your environment variables using process.env
export const CHAIN_ID = parseInt(process.env.CHAIN_ID);

export const SELL_AMOUNT = 1000000; // weth
