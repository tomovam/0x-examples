const { ethers, network } = require("hardhat");

const SELL_AMMOUNT = 1000000000000000; // 0.0001 WETH
const MINIMAL_ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function deposit() public payable", // deposit ETH to wrap it into WETH
  "function transfer(address to, uint256 amount) public returns (bool)", // transfer WETH
  "function balanceOf(address account) public view returns (uint256)", // check WETH
];
const wethAbi = require("./abi/weth-abi.js");
const API_KEY = "4aafad8f-90f5-45a5-8bf2-6408cc7727db";
const takerAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // The address you're trying to impersonate
const permit2Abi = require("./abi/permit2-abi.js");
const main = async () => {
  // Quote parameters
  const sellToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
  //   const buyToken = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI
  const buyToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
  const permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

  const sellAmount = SELL_AMMOUNT; // 1 ETH in base units

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [takerAddress],
  });

  const signer = await ethers.getSigner(takerAddress); // Signer will now correspond to the impersonated account
  console.log(`Signer Address: ${signer.address}`); // Confirm signer address
  //   const balance = await signer.getBalance();
  //   console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  // Headers for 0x API request
  const headers = {
    "Content-Type": "application/json",
    "0x-api-key": API_KEY,
    "0x-version": "v2",
  };

  // 1. Fetch price for the swap
  const priceParams = new URLSearchParams({
    chainId: "1",
    sellToken: sellToken,
    buyToken: buyToken,
    sellAmount: sellAmount.toString(),
    taker: takerAddress,
  });

  try {
    const priceResponse = await fetch(
      "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
      { headers }
    );

    // Check for errors in price response
    if (!priceResponse.ok) {
      const body = await priceResponse.text();
      throw new Error(`Price request failed: ${body}`);
    }

    const price = await priceResponse.json();
    console.log(`Fetching price to swap ${sellAmount} WETH for USDC`);
    console.log("Price:", price);
  } catch (error) {
    console.error("Error fetching price:", error);
    return;
  }

  // 2. Fetch the quote
  const quoteParams = new URLSearchParams(priceParams);
  let quote;
  try {
    const quoteResponse = await fetch(
      "https://api.0x.org/swap/permit2/quote?" + quoteParams.toString(),
      { headers }
    );

    // Check for errors in quote response
    if (!quoteResponse.ok) {
      const body = await quoteResponse.text();
      throw new Error(`Quote request failed: ${body}`);
    }

    quote = await quoteResponse.json();
    console.log("Quote:", quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return;
  }

  const usdc = new ethers.Contract(buyToken, MINIMAL_ERC20_ABI, signer);

  const weth = new ethers.Contract(sellToken, wethAbi.wethAbi, signer);
  const permit2 = new ethers.Contract(
    permit2Address,
    permit2Abi.permit2Abi,
    signer
  );
  const allowance = await weth.allowance(takerAddress, permit2Address);
  console.log({ allowance });
  // Check allowance is enough for Permit2 to spend sellToken
  if (sellAmount > (await weth.allowance(takerAddress, permit2Address))) {
    console.log("aproving");
    try {
      // If not, write approval
      const hash = await weth.approve(permit2Address, sellAmount);
      console.log("Approved Permit2 to spend WETH.");
    } catch (error) {
      console.log("Error approving Permit2:", error);
    }
  } else {
    console.log("WETH already approved for Permit2");
  }
  try {
    // Get pre-swap balances for comparison
    const wethBalanceBefore = await weth.balanceOf(takerAddress);
    const usdcBalanceBefore = await usdc.balanceOf(takerAddress);

    console.log("Before Swap:");
    console.log(`WETH: ${wethBalanceBefore.toString()}`);
    console.log(`USDC: ${usdcBalanceBefore.toString()}`);
  } catch (error) {
    console.error("Error fetching pre-swap balances:", error);
    return;
  }

  let signature;

  if (quote.permit2?.eip712) {
    try {
      const { domain, types, message } = quote.permit2.eip712;

      // Remove EIP712Domain if present in types
      const cleanedTypes = { ...types };
      delete cleanedTypes.EIP712Domain;

      // Sign with ethers v6 signer
      signature = await signer.signTypedData(domain, cleanedTypes, message);
      console.log("Signed permit2 message from quote response");
    } catch (error) {
      console.error("Error signing permit2 message:", error);
    }

    if (signature && quote?.transaction?.data) {
      const sigBytes = ethers.getBytes(signature);
      const sigLengthHex = ethers.zeroPadValue(
        ethers.toBeHex(sigBytes.length),
        32
      );
      const transactionData = ethers.getBytes(quote.transaction.data);
      const finalData = ethers.hexlify(
        ethers.concat([transactionData, sigLengthHex, sigBytes])
      );

      quote.transaction.data = finalData;
    } else {
      throw new Error("Failed to obtain signature or transaction data");
    }
  }

  // 6. Send the swap transaction

  try {
    const txResponse = await signer.sendTransaction({
      to: quote.transaction.to,
      data: quote.transaction.data,
      value: BigInt(quote.transaction.value || 0),
      gasPrice: BigInt(quote.transaction.gasPrice),
      gasLimit: BigInt(quote.transaction.gas),
    });

    // Wait for transaction to confirm
    const txReceipt = await txResponse.wait();
    console.log("Transaction receipt:", txReceipt);

    // Get post-swap balances for comparison

    const wethBalanceAfter = await weth.balanceOf(takerAddress);
    const usdcBalanceAfter = await usdc.balanceOf(takerAddress);

    console.log("After Swap:");
    console.log(`WETH:  -> ${wethBalanceAfter.toString()}`);
    console.log(`USDC:   -> ${usdcBalanceAfter.toString()}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
    return;
  }
};

main();
