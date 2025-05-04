// 3. Fetch a Firm Quote
(async () => {
  const qs = require("qs");

  const params = {
    sellToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    buyToken: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    sellAmount: 100,
    taker: "0x4B1F6EF2a7cFD447E7Ba058F068A79Be8137c159",
    chainId: 42161,
  };

  const headers = {
    "0x-api-key": "4aafad8f-90f5-45a5-8bf2-6408cc7727db", // Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
    "0x-version": "v2", // Add the version header
  };

  const response = await fetch(
    `https://api.0x.org/swap/permit2/quote?${qs.stringify(params)}`,
    { headers }
  );
  const result = await response.json();
  console.log(result);
  console.log(result.route);
})();

// example response

// {
//     fills: [
//       {
//         from: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
//         to: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
//         source: 'DODO_V2',
//         proportionBps: '10000'
//       },
//       {
//         from: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
//         to: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
//         source: 'Camelot_V2',
//         proportionBps: '10000'
//       },
//       {
//         from: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
//         to: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
//         source: 'DODO_V2',
//         proportionBps: '10000'
//       },
//       {
//         from: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
//         to: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
//         source: 'Uniswap_V4',
//         proportionBps: '10000'
//       }
//     ],
//     tokens: [
//       {
//         address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
//         symbol: 'WETH'
//       },
//       {
//         address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
//         symbol: 'USD₮0'
//       },
//       {
//         address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
//         symbol: 'USDC'
//       },
//       {
//         address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
//         symbol: 'USDC'
//       },
//       {
//         address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
//         symbol: 'DAI'
//       }
//     ]
