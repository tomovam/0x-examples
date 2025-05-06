# Swap API handles three key tasks:

- Queries ERC20 prices from decentralized exchanges and market makers
- Aggregates liquidity for the best possible price
- Returns a trade format executable via your preferred web3 library

# browser code example

https://replit.com/@0xproject/0x-Swap-v2-Headless-Example

## note about this example

current example will be compared to `swap-v2-headless-example`
appropriate notes will be taken and then translated to python to be able to perform comparissons to Uniswap

## note about the response

https://0x.org/docs/introduction/getting-started#33-make-your-first-0x-api-call

# Swap Token in 6 Steps

1. Get a 0x API key
2. Get an indicative price
3. (If needed) Set token allowance
4. Fetch a firm quote
5. Sign the Permit2 EIP-712 message
6. Append signature length and signature data to calldata
7. .emvSubmit the transaction with Permit2 signature

# Steps to setup local development environment

## MacOS

- Install foundryup by following these steps
  https://docs.uniswap.org/sdk/v3/guides/local-development#using-foundry-and-anvil
- Then use this command (after replacing the API key and an up-to-date block number)

```shell
anvil --fork-url https://arbitrum-mainnet.infura.io/v3/c616a0840d4b4a8ebc088f29d56fefe1 --fork-block-number 333567604 --fork-chain-id 42161 --chain-id 42161
```

# 0x working on testnest - utilise for comparison

https://0x.org/docs/1.0/0x-swap-api/guides/working-in-the-testnet

# limit and other orders

https://0x.org/docs/1.0/0x-swap-api/guides/working-in-the-testnet

https://docs.0xprotocol.org/en/latest/basics/orders.html

# swap params

https://0x.org/docs/0x-swap-api/guides/troubleshooting-swap-api
