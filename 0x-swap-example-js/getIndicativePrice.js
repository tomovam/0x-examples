(async () => {
  // 1. Get an Indicative Price
  const priceParams = new URLSearchParams({
    chainId: chainId, // / Ethereum mainnet. See the 0x Cheat Sheet for all supported endpoints: https://0x.org/docs/introduction/0x-cheat-sheet
    sellToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", //WETH
    buyToken: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", //DAI Stable coin
    sellAmount: "000000000000000000100", // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    taker: walletAddress, //Address that will make the trade
  });

  const headers = {
    "0x-api-key": apiKey, // Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
    "0x-version": "v2",
  };

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
    { headers }
  );
  const response = await priceResponse.json();
  console.log({ response });
  console.log(response.route); // !route can involve more than 2 tokens
})();
