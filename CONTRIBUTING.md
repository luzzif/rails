# Contributing

Contains information about how to locally run, build and test the application.
In order to perform the actions described here, you will need the locally cloned repo with dependencies installed (run `yarn install` to install them).

## Firing up a local instance

You can fire up a local instance by simply running `yarn start`. Before doing that though, you'll need to set up environment variables (which are locally loaded using `dotenv`, so simply create a `.env` file in the root of the project and put the required variables there).

-   `REACT_APP_INFURA_ID`: an Infura project id to be used by `web3Modal` to give support for WalletConnect and MewWallet Ethereum account connection methods.

## Bundling the applcation

In order to get a production-ready application in your `build` folder, simply run `ENV_VARIABLE=... yarn build` (environment variables are passed inline to avoid setting them up on your local machine). It is paramount to pass environment variables so that the bundler (webpack) can write them to the resulting artifact.

## Testing the bundled application

To locally test the produced bundles, simply run `yarn test:build`.
