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
  concat,
  numberToHex,
  size,
  publicActions,
} from "viem";
import { arbitrum } from "viem/chains"; // Import the Arbitrum chain definition
import { privateKeyToAccount } from "viem/accounts";
import qs from "qs";

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

  //   3. Fetch a Firm Quote
  //   !IMPORTANT
  //   Use /quote only when ready to fill the response; excessive unfilled requests may lead to a ban.
  //  /quote indicates a soft commitment, prompting Market Makers to commit assets.
  // If browsing for prices, use /price instead.
  const params = {
    sellToken: sellToken, //WETH
    buyToken: buyToken, //DAI
    sellAmount: 0.000000001, // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    taker: WALLET_ADDRESS, //Address that will make the trade
    chainId: chainId,
  };

  const quoteResponse = await fetch(
    `https://api.0x.org/swap/permit2/quote?${qs.stringify(params)}`,
    { headers }
  );
  const quote = await quoteResponse.json();

  // setup wallet client
  const client = createWalletClient({
    account: privateKeyToAccount(`0x${WALLET_SECRET}`),
    chain: arbitrum,
    transport: http(rpcUrl),
  }).extend(publicActions); // extend wallet client with publicActions for public client

  //   4. 4. Sign the Permit2 EIP-712 Message

  //   Now that we have our quote, the next step is to sign and append the necessary data before submitting the order to the blockchain.

  //   First, sign the permit2.eip712 object that we received from the quote response.
  let signature;
  signature = await client.signTypedData(quote.permit2?.eip712);
  //   5. Append signature length and signature data to transaction.data

  // Next, append the signature length and signature data to transaction.data. The format should be <sig len><sig data>, where:

  //     <sig len>: 32-byte unsigned big-endian integer representing the length of the signature
  //     <sig data>: The actual signature data

  //   import { concat, numberToHex, size } from "viem";

  if (quote.permit2?.eip712) {
    const signature = await client.signTypedData(quote.permit2?.eip712);
    const signatureLengthInHex = numberToHex(size(signature), {
      signed: false,
      size: 32,
    });
    const transactionData = quote.transaction.data;
    const sigLengthHex = signatureLengthInHex;
    const sig = signature;

    quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
  }
  // 6. submit txn with permit2 signature
  if (signature && quote.transaction.data) {
    const nonce = await client.getTransactionCount({
      address: client.account.address,
    });
    console.log({ client });
    // const signedTransaction = await client.signTransaction({
    //   account: client.account,
    //   chain: client.chain,
    //   gas: !!quote?.transaction.gas
    //     ? BigInt(quote?.transaction.gas)
    //     : undefined,
    //   to: quote?.transaction.to,
    //   data: quote.transaction.data,
    //   value: quote?.transaction.value
    //     ? BigInt(quote.transaction.value)
    //     : undefined, // value is used for native tokens
    //   gasPrice: !!quote?.transaction.gasPrice
    //     ? BigInt(quote?.transaction.gasPrice)
    //     : undefined,
    //   nonce: nonce,
    // });
    // const hash = await client.sendRawTransaction({
    //   serializedTransaction: signedTransaction,
    // });

    // console.log("Transaction hash:", hash);

    // console.log(`See tx details at https://basescan.org/tx/${hash}`);
  } else {
    console.error("Failed to obtain a signature, transaction not sent.");
  }
};

main();
