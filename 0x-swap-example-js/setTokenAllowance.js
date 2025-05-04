// 2. Set a Token Allowance
import { erc20Abi, getContract } from "viem";

import {
  chainId,
  permit2Address,
  privateKey,
  RPC_URL,
  sellToken,
  usdcAddress,
  sellAmount,
} from "./constants";
import { usdcAbi } from "./abi/usdc-abi";
import { permit2Abi } from "./abi/permit2-abi";

// setup wallet client
const client = createWalletClient({
  account: privateKey,
  chain: chainId,
  transport: http(RPC_URL),
}).extend(publicActions);

const [address] = await client.getAddresses();

const weth = getContract({
  address: sellToken,
  abi: erc20Abi,
  client,
});

const usdc = getContract({
  address: usdcAddress,
  abi: usdcAbi,
  client,
});

// Set up contracts. Note abi and client setup not show in this snippet
const Permit2 = getContract({
  address: permit2Address,
  abi: permit2Abi,
  client,
});

// Check allowance is enough for Permit2 to spend sellToken
if (
  sellAmount >
  (await usdc.read.allowance([client.account.address, Permit2.address]))
)
  try {
    const { request } = await usdc.simulate.approve([
      Permit2.address,
      maxUint256,
    ]);
    console.log("Approving Permit2 to spend USDC...", request);
    // If not, write approval
    const hash = await usdc.write.approve(request.args);
    console.log(
      "Approved Permit2 to spend USDC.",
      await client.waitForTransactionReceipt({ hash })
    );
  } catch (error) {
    console.log("Error approving Permit2:", error);
  }
else {
  console.log("USDC already approved for Permit2");
}
