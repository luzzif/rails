# Loopring Pay UI

A new, shiny UI for the Loopring Pay protocol.

## (Incomplete) list of features

- Full authentication flow: login and registration
- Supports multiple web3 providers through the usage of [web3Modal](https://github.com/web3modal/web3modal)
- Popup notifications on error
- Full list of past transactions (both pending and completed) with the ability to apply filters by type (deposits, withdrawals or transfers), search via a specific text query, and refresh in case new transactions have happened
- Dedicated expended transaction summary page
- Choose between all the assets supported by the Loopring Pay protocol (LRC, ETH, DAI, USDT and many many more)
- Fully functional send flow (supporting both raw addresses receivers and ENS names)
- Fully functional deposit flow with on-chain balance check and in tokens' case, asking for allowance beforehand (one-time operation that can be undone at any time by the user, which retains full power)
- Fully functional withdraw flow
- Possibility to choose between a dark and a light color scheme for improved UX
- Possibility to choose between any of the fiats supported by Loopring in order to show countervalues (EUR, USD, JPY etc etc)
- Fully responsive and designed with a mobile-first strategy
- Internationalization-ready