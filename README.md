# What is 0x?

0x allows builders to embed swaps in their onchain apps. Tap into aggregated liquidity from 130+ sources, across 15+ EVM chains with the most efficient trade execution. Our suite of APIs has processed over 60M+ million transactions and $154B+ in volume from more than 9+ million users trading on apps like Matcha.xyz, Coinbase Wallet, Robinhood Wallet, Phantom, Metamask, Zerion, Zapper, and more.

# Why use 0x?

At 0x, we believe all forms of value will eventually be tokenized and settle on-chain. But as more value becomes tokenized, liquidity becomes increasingly fragmented — across chains, across liquidity sources, and across protocols.

0x offers powerful APIs to simplify access to this fragmented liquidity:

    Swap API - The most efficient liquidity aggregator for ERC20 tokens through a single API.
    Gasless API - Never lose a user trade because of gas. Easily build frictionless apps with end-to-end gasless infra.
    Trade Analytics API - Programatically access historical trades initiated through your apps via 0x Swap and Gasless APIs.

# Makers and Takers

Within the 0x Ecosystem, there are two sides to a trade - Makers and Takers:

## Supply Side (Makers)

This is the entity who creates 0x orders and provides liquidity into the system for the Demand side (Takers) to consume. 0x aggregates liquidity from multiple sources including:

    On-chain liquidity - DEXs, AMMs (e.g. Uniswap, Curve, Bancor)
    Off-chain liquidity - Professional Market Makers, 0x's Open Orderbook network

Relevant Docs:

    Market Makers - Professional Market Making With Limit Orders

Demand Side (Takers)

## Takers consume token liquidity from Makers. They are applications or agents that initiate trades using the 0x protocol. This includes:

    Wallets
    Portfolio trackers
    SocialFi platforms
    AI agents
    Token screeners
    And more

Relevant Docs:

    Swap API - The most efficient liquidity aggregator for ERC20 tokens through a single API.
    Gasless API - enable developers to build frictionless apps with end-to-end gasless infrastructure

# How does 0x work?

    Order Creation: A Maker creates a 0x order, a JSON object that follows a standard format.
    Maker Signature: The Maker signs the order to cryptographically commit to it.
    Order Sharing: The order is shared with potential Takers:
        Directly (e.g., via an app)
        Or through the Open Orderbook if no counterparty is known
    Aggregation: 0x API aggregates liquidity across all supply sources and surfaces the best price.
        This is done using off-chain relay, on-chain settlement, saving gas and improving flexibility.
    Order Submissions: A Taker fills the order onchain by signing it and submitting it along with the fill amount.
    Order Settlement: The 0x Settler verifies the signature, checks trade conditions, and atomically swaps assets between Maker and Taker.

# What can I build on 0x?

0x powers a wide variety of web3 applications. Whether you're building a product where trading is central — like an exchange — or adding seamless token swaps to an app where trading is just one feature, 0x makes it easy to plug in liquidity.

    🔗 For more inspiration, check out this blog post and our case studies.

## Demand-Side Use Cases (Takers)

- Exchanges & Marketplaces

  Decentralized exchange for a specific asset or vertical
  eBay-style marketplace for digital goods
  Over-the-counter (OTC) trading desk

- Wallets & Interfaces

  Crypto wallets that support in-app token swaps
  Portfolio management dashboards
  Token screeners with built-in trade execution

- DeFi Protocols

  Options, lending, and derivatives platforms needing deep liquidity
  Investment strategies like DeFi index funds or DCA (dollar-cost averaging) tools
  Prediction markets

- Social & Consumer Apps

  SocialFi platforms with embedded token swaps
  Games with in-game currencies or tradable items
  NFT marketplaces

- Data & Analytics

  Multi-chain analytics dashboards
  Real-time trade panels

- Agents & Automation

  AI agents or bots that interact with DeFi
  On-chain automation or smart contract wallets

## Supply-Side Integrations (Makers)

- Liquidity Sources

  On-chain order books
  Automated market makers (AMMs)
  Proprietary market-making or arbitrage bots

# 0x Examples

A collection of 0x API code examples

## v2 (Latest)

### Swap API

- [Swap API v2 Demo App (Permit2) using Next.js App Router](https://github.com/0xProject/0x-examples/tree/main/swap-v2-next-app)
- [Swap API v2 (Permit2) Headless Example](https://github.com/0xProject/0x-examples/tree/main/swap-v2-headless-example)
- [Swap API v2 (AllowanceHolder) Headless Example](https://github.com/0xProject/0x-examples/tree/main/swap-v2-allowance-holder-headless-example)
- [Use Swap API v2 in Your Smart Contract with Foundry](https://github.com/0xProject/0x-examples/tree/main/swap-v2-with-foundry)

### Gasless API

- [Gasless API v2 Headless Example](https://github.com/0xProject/0x-examples/blob/main/gasless-v2-headless-example/README.md)
- [Gasless API v2 Trading Bot](https://github.com/0xProject/0x-examples/tree/main/gasless-v2-trading-bot)

## v1 (Deprecated)

> [!WARNING]
> 0x API v1 was sunset on April 11, 2025. Please migrate to v2. For details, see the [migration guide](https://0x.org/docs/upgrading).

### Swap API

- [Swap API v1 Demo App using Next.js App Router](https://github.com/0xProject/0x-examples/tree/main/swap-next-app)
- [Swap API v1 Demo App using Next.js Pages Router](https://github.com/0xProject/0x-nextjs-demo-app/tree/main)
- [Swap API v1 Demo App using HTML/CSS/JavaScript](https://github.com/0xProject/swap-demo-tutorial)
- [Swap API v1 Headless Example](https://github.com/0xProject/0x-examples/tree/main/swap-headless-example)

### Gasless API

- [Gasless API v1 Demo App using Next.js App Router](https://github.com/0xProject/0x-examples/tree/main/gasless-next-app)

## Contribution Guidelines

1. **Fork the Repository:** Start by forking the repository and creating a new branch for your contributions.

2. **Set Up Environment:** Follow the setup guide in the README to ensure your environment matches the development requirements.

3. **Code Standards:** Adhere to the ESLint rules provided in the project

4. **Documentation:** Include or update relevant documentation for new features or changes.

5. **Pull Request:**

- Provide a clear description of the changes and the issue(s) addressed
- Tag at least one maintainer for review
- Include screenshots or logs for UI changes or CLI commands

## Code of Conduct

1. **Be Respectful:** Treat others with respect and kindness in all interactions.

2. **Constructive Feedback:** Provide feedback that is thoughtful, helpful, and actionable.

3. **No Harassment:** Harassment, abusive language, or any form of discrimination will not be tolerated.

4. **Collaborative Environment:** Support an open and welcoming space for contributors from all backgrounds.

## Licenses

Copyright 2025 ZeroEx Labs

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [LICENSE](http://www.apache.org/licenses/LICENSE-2.0) for details.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Support

### GitHub Issues

For bugs, feature requests, and other inquiries related to this example, please open an issue on the GitHub repository.

### Developer Support

The 0x developer support team is available to quickly answer your technical questions. Contact the [support team](https://0x.org/docs/introduction/community#contact-support) either through the "Intercom messenger" in the bottom right corner throughout the [0x.org](https://0x.org/).
