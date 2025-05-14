import {
  createWalletClient,
  http,
  getContract,
  erc20Abi,
  parseUnits,
  maxUint256,
  publicActions,
  concat,
  numberToHex,
  size,
  createPublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, hardhat, sepolia } from "viem/chains";
import { wethAbi } from "./abi/weth-abi.js";
import {
  WALLET_SECRET,
  INFURA_URL,
  SELL_AMOUNT,
  SELL_TOKEN,
  BUY_TOKEN,
  USDC_TOKEN,
  API_KEY,
} from "./constants.js";
import { parseSwap } from "@0x/0x-parser";

// validate requirements
if (!WALLET_SECRET) throw new Error("missing WALLET_SECRET.");
if (!API_KEY) throw new Error("missing ZERO_EX_API_KEY.");
if (!INFURA_URL) throw new Error("missing TRANSPORT URL");

// fetch headers
const headers = new Headers({
  "Content-Type": "application/json",
  "0x-api-key": API_KEY,
  "0x-version": "v2",
});

// setup wallet client
const client = createWalletClient({
  account: privateKeyToAccount(`0x${WALLET_SECRET}`), // be careful if the key starts with 0x
  chain: hardhat,
  transport: http("http://127.0.0.1:8545/"),
}).extend(publicActions); // extend wallet client with publicActions for public client

const [address] = await client.getAddresses(); // wallet

// set up contracts
// const usdc = getContract({
//   address: USDC_TOKEN,
//   abi: erc20Abi,
//   client,
// });
const dai = getContract({
  address: BUY_TOKEN,
  abi: erc20Abi,
  client,
});
const weth = getContract({
  address: SELL_TOKEN,
  abi: wethAbi,
  client,
});
// 4. Fetch balances
const getTokenBalance = async (tokenAddress) => {
  return await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
};
const main = async () => {
  // specify sell amount

  const sellAmount = parseUnits(
    SELL_AMOUNT.toString(),
    await dai.read.decimals()
  );
  console.log({ sellAmount });

  // 1. fetch price
  const priceParams = new URLSearchParams({
    chainId: 42161,
    sellToken: SELL_TOKEN,
    buyToken: BUY_TOKEN,
    sellAmount: sellAmount.toString(),
    taker: client.account.address,
    slippageBps: 5,
  });
  // @TODO add slippage

  const priceResponse = await fetch(
    `https://api.0x.org/swap/permit2/price?` + priceParams.toString(),
    {
      headers,
    }
  );

  const price = await priceResponse.json();
  console.log(`Fetching price to swap ${SELL_AMOUNT} WETH for DAI`);
  console.log(
    `https://api.0x.org/swap/permit2/price?${priceParams.toString()}`
  );
  console.log("priceResponse: ", price.data);
  const balance = await client.getBalance({
    address: address,
  });
  console.log({ balance });
  console.log({ address });

  console.log(balance.toString()); // balance in wei
  // 2. check if taker needs to set an allowance for Permit2
  if (price.issues.allowance !== null) {
    try {
      const { request } = await weth.simulate.approve([
        price.issues.allowance.spender,
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        maxUint256, // !!!!!!!!!! !!!!
      ]);
      console.log("Approving Permit2 to spend WETH...", request);
      // set approval
      const hash = await weth.write.approve(request.args);
      console.log(
        "Approved Permit2 to spend WETH.",
        await client.waitForTransactionReceipt({ hash })
      );
    } catch (error) {
      console.log("Error approving Permit2:", error);
    }
  } else {
    console.log("WETH already approved for Permit2");
  }
  console.log(client.account.address, "taker");

  // 3. fetch quote
  const quoteParams = new URLSearchParams({
    chainId: 42161,
    sellToken: SELL_TOKEN,
    buyToken: BUY_TOKEN,
    sellAmount: sellAmount.toString(), // !!!!!!!!
    taker: client.account.address,
    slippageBps: 5,
  }); //@TODO add slippage
  for (const [key, value] of priceParams.entries()) {
    quoteParams.append(key, value);
  }

  const quoteResponse = await fetch(
    "https://api.0x.org/swap/permit2/quote?" + quoteParams.toString(),
    {
      headers,
    }
  );

  const quote = await quoteResponse.json();
  console.log(`Fetching quote to swap ${SELL_AMOUNT} WETH for DAI`);
  console.log("quoteResponse: ", quote);

  // 4. sign permit2.eip712 returned from quote
  let signature;
  if (quote.permit2?.eip712) {
    try {
      signature = await client.signTypedData(quote.permit2.eip712);
      console.log("Signed permit2 message from quote response");
    } catch (error) {
      console.error("Error signing permit2 coupon:", error);
    }

    // 5. append sig length and sig data to transaction.data
    if (signature && quote?.transaction?.data) {
      const signatureLengthInHex = numberToHex(size(signature), {
        signed: false,
        size: 32,
      });

      const transactionData = quote.transaction.data;
      const sigLengthHex = signatureLengthInHex;
      const sig = signature;

      quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
    } else {
      throw new Error("Failed to obtain signature or transaction data");
    }
  }
  // // 6. submit txn with permit2 signature
  if (signature && quote.transaction.data) {
    const nonce = await client.getTransactionCount({
      address: client.account.address,
    });

    const signedTransaction = await client.signTransaction({
      account: client.account,
      chain: client.chain,
      gas: !!quote?.transaction.gas
        ? BigInt(quote?.transaction.gas)
        : undefined,
      to: quote?.transaction.to,
      data: quote.transaction.data,
      value: sellAmount,
      // value: quote?.transaction.value
      //   ? BigInt(quote.transaction.value)
      //   : undefined, // value is used for native tokens
      // gasPrice: !!quote?.transaction.gasPrice
      //   ? BigInt(quote?.transaction.gasPrice)
      //   : undefined,
      gasPrice: BigInt(58703366),
      nonce: nonce,
    });
    const hash = await client.sendRawTransaction({
      serializedTransaction: signedTransaction,
    });

    const publicClient = createPublicClient({
      chain: hardhat, // replace with real network
      transport: http("http://127.0.0.1:8545/"), // replace with real RPC_URLL
    });
    const receipt = await client.getTransactionReceipt({
      hash: hash, // replace with your transaction hash
    });

    console.log(receipt);
    // const swap = await parseSwap({ publicClient, hash });
    // console.log(swap); // Logs the swap details.
  } else {
    console.error("Failed to obtain a signature, transaction not sent.");
  }

  const balance1 = await client.getBalance({
    address: address,
  });

  console.log(balance.toString()); // balance in wei
  console.log(balance1.toString()); // balance in wei
  const wethBalance = await getTokenBalance(SELL_TOKEN);
  const daiBalance = await getTokenBalance(BUY_TOKEN);

  console.log("WETH balance (raw):", wethBalance.toString());
  console.log("DAI balance (raw):", daiBalance.toString());
};
main();
