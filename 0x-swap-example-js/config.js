import "dotenv/config";
import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json" with { type: "json" }

export const INFURA_URL = process.env.INFURA_URL;
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const WALLET_SECRET = process.env.WALLET_SECRET;

export const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export const token0Address = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI
export const token1Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
// https://docs.uniswap.org/contracts/v3/reference/periphery/NonfungiblePositionManager
// the address is the same on main and testnets
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const poolFee = FeeAmount.LOW;
export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// short version of INONFUNGIBLE_POSITION_MANAGER
export const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  "function balanceOf(address _owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string memory)",

  "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
];

export const wallet = new ethers.Wallet(WALLET_SECRET, provider);
export const connectedWallet = wallet.connect(provider);

export const chainId = 1; // Mainnet
// The maximum token amounts we want to provide.
// BigIntish accepts number, string or JSBI
export const amount0 = "1000"; // type BigIntish
export const amount1 = "1000"; // type BigIntish
// @TDDO check these values are appropriate
export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

export const poolAddress = "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168"; // DAI/USDC on Mainnet 0x6B175474E89094C44Da98b954EedeAC495271d0F/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

// modifying liquidity
export const FRACTION_TO_REMOVE = 1;
export const FRACTION_TO_ADD = 0.5;
export const USDC_TOKEN = new Token(
  chainId,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  6,
  "USDC",
  "USD//C"
);
export const DAI_TOKEN = new Token(
  chainId,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  18,
  "DAI",
  "Dai Stablecoin"
);

export const nfpmContract = new ethers.Contract(
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  INONFUNGIBLE_POSITION_MANAGER.abi,
  provider
);


