import {
  apiKey,
  buyToken,
  chainId,
  permit2Address,
  WALLET_SECRET,
  WALLET_ADDRESS,
  sellAmount,
  sellToken,
  usdcToken,
  rpcUrl,
  usdcContract,
  provider,
  wallet,
} from "./constants.js";
import { ethers } from "ethers";
import { usdcAbi } from "./abi/usdc-abi.js";
import {
  createWalletClient,
  http,
  getContract,
  maxUint256,
  createPublicClient,
  erc20Abi,
} from "viem";
import { arbitrum } from "viem/chains"; // Import the Arbitrum chain definition

const main = async () => {
  // 1. Get an Indicative Price
  const priceParams = new URLSearchParams({
    chainId: chainId, // / Ethereum mainnet. See the 0x Cheat Sheet for all supported endpoints: https://0x.org/docs/introduction/0x-cheat-sheet
    sellToken: sellToken, //WETH
    buyToken: buyToken, //DAI Stable coin
    sellAmount: sellAmount, // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    taker: WALLET_ADDRESS, //Address that will make the trade
  });

  const headers = {
    "0x-api-key": apiKey, // Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
    "0x-version": "v2",
  };

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
    { headers }
  );
  const priceResponseParsed = await priceResponse.json();
  const usdcContract = new ethers.Contract(usdcToken, usdcAbi, provider);
  //
  // 2. Check allowance is enough for Permit2 to spend sellToken

  const allowance = await usdcContract.allowance(
    WALLET_ADDRESS,
    permit2Address
  );

  function getUsdcContractWithWallet(wallet) {
    const usdcContractWithSigner = new ethers.Contract(
      usdcToken,
      usdcAbi,
      wallet
    );
    return usdcContractWithSigner;
  }

  const amountToApprove = ethers.parseUnits("100", 6); // Approve 100 USDC (assuming 6 decimals)
  if (sellAmount > allowance) {
    const usdcContractWithWallet = getUsdcContractWithWallet(wallet);
    async function sendApproveTransaction() {
      try {
        const approveTx = await usdcContractWithWallet.approve(
          permit2Address,
          amountToApprove
        );

        console.log("Approve transaction sent:", approveTx.hash);

        // Wait for the transaction to be confirmed
        const receipt = await approveTx.wait();
        console.log("Approve transaction confirmed:", receipt);

        return receipt;
      } catch (error) {
        console.error("Error sending approve transaction:", error);
        return null;
      }
    }
    try {
      sendApproveTransaction();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("USDC already approved for Permit2");
  }
};

main();
