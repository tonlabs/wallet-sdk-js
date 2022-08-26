# Everscale WalletKit

This library is a part of Everscale SDK for JavaScript.

WalletKit is built over the [@eversdk/appkit](https://github.com/tonlabs/ever-appkit-js) package and purposed to simplify work with wallets on Everscale.

WalletKit works with the following types of wallets:

-   Safe multisig wallet
-   Set code multisig wallet
-   Surf wallet

**Have a question? Get quick help in our channel:**

[![Chat on Telegram](https://img.shields.io/badge/chat-on%20telegram-9cf.svg)](https://t.me/ton_sdk)

## Table of Contents

-   [Useful links](#useful-links)
-   [Before You Start](#before-you-start)
-   [Installation](#installation)
-   [Setup Client Library](#setup-client-library)
    -   [NodeJs:](#nodejs)
    -   [Web:](#web)
    -   [React Native:](#react-native)
-   [Create Client Instance](#create-client-instance)
-   [Use Wallet Object](#use-wallet-object)
-   [API Reaference](#api-reference)
-   [Sample source code](#sample-source-code)
-   [Run test or example](#run-test-or-example)

## Useful links

-   [SDK guides](https://docs.everos.dev/ever-sdk/quick_start) - to get a deeper understanding dive into our sdk guides where you can find extensive explanations and descriptions of each step of DApp development on Everscale.

-   [@eversdk/appkit](https://github.com/tonlabs/ever-appkit-js) - a package that greatly simplifies writing applications on Everscale.

## Before You Start

## Installation

```shell
# Install core package
npm i --save @eversdk/core

# Install lib-node bridge if you write node js application
npm i --save @eversdk/lib-node

# Or install lib-web bridge if you write web/browser application
npm i --save @eversdk/lib-web

# Or install lib-react-native if you write react-native mobile application
npm i --save @eversdk/lib-react-native

# And finally install walletkit itself
npm i --save @eversdk/walletkit
```

## Setup Client Library

### NodeJs:

```javascript
const { TonClient } = require("@eversdk/core")
const { libNode } = require("@eversdk/lib-node")

TonClient.useBinaryLibrary(libNode)
```

### Web:

```javascript
import { TonClient } from "@eversdk/core"
import { libWeb } from "@eversdk/lib-web"

TonClient.useBinaryLibrary(libWeb)
```

By default, the library loads wasm module from relative URL `/tonclient.wasm`.

You can specify alternative URL if you want to place (or rename) wasm module.

```javascript
import { TonClient } from "@eversdk/core"
import { libWeb, libWebSetup } from "@eversdk/lib-web"

// You have to setup libWeb if the `tonclient.wasm`
// isn't located at root of your web site.
// Otherwise you havn't to call `libWebSetup`.
libWebSetup({
    binaryURL: "/assets/tonclient_1_2_3.wasm",
})

TonClient.useBinaryLibrary(libWeb)
```

### React Native:

```javascript
import { TonClient } from "@eversdk/core"
import { libReactNative } from "@eversdk/lib-react-native"

TonClient.useBinaryLibrary(libReactNative)
```

## Create Client Instance

You have to create an instance of `TonClient` to use it later with WalletKit objects.

```javascript
const client = new TonClient({
    network: { endpoints: ["http://localhost"] },
})
```

In this sample we create a client instance configured to use local blockchain [Evernode SE](https://github.com/tonlabs/evernode-se) instance.

If you want to work with Developer Network or Everscale main network,
please use the [list of endpoints, listed here](https://docs.everos.dev/ever-sdk/reference/ever-os-api/networks).\
**Attention**: You must specify all the endpoints as an array in `endpoints` parameter,
because each endpoint does not guarantee its availability, but we guarantee that at least one endpoint is operational at the moment.

## Use Wallet Object

This snippet illustrates how to deploy "Surf" wallet to [Evernode SE](https://github.com/tonlabs/evernode-se)
.\
We suppose that we are using lib-node bridge (NodeJs) to write examples.\

```javascript
const { TonClient } = require("@eversdk/core")
const { libNode } = require("@eversdk/lib-node")
const { Account } = require("@eversdk/walletkit")

TonClient.useBinaryLibrary(libNode)
;(async () => {
    const endpoint = process.env.TON_NETWORK_ADDRESS || "http://localhost"
    const client = new TonClient({ network: { endpoints: [endpoint] } })
    try {
        await main(client)
    } catch (err) {
        console.error(err)
    } finally {
        client.close()
    }
})()

async function main(client) {
    // Generate new keys pair for new wallet
    const keys = await client.crypto.generate_random_sign_keys()

    // Create owner (signer) instance for new account.
    const signer = signerKeys(keys)

    // Create an instance of `WalletTypes.Surf`
    //
    // Note that this account is not deployed in the blockchain yet.
    // We just create an object to deal with this account.
    const wallet = Wallet.create(WalletTypes.Surf, { signer, client })

    // We can determine the future addres of the account
    // and print it to the user before deploying.
    console.log(`New account future address: ${await wallet.getAddress()}`)
    /*
     * Before any contract can be deployed on the network,
     * its address must have some positive balance, so send some tokens to
     * this address before deploying the contract.
     * In this example, we are deploying a wallet to EverosSE,
     * so we use ability of AppKit to use its giver for EverosSE.
     */
    const giver = await Account.getGiverForClient(client)
    await giver.sendTo(address, 1e9)

    // Now we deploy a wallet with ONE custodian to the blockchain.
    await wallet.deploy({
        owners: ["0x" + keys.public],
        reqConfirms: 1,
    })
}
```

## API reference

At the moment, the Wallet class has these methods:

-   `Wallet.create( walletType: WalletTypes, {signer: Signer, client: TonClient} )` - static factory method for wallet instantiation

    -   walletType - is a value from WalletTypes enum (SafeMultisig, SetcodeMultisig, Surf)

-   `async deploy({owners: string[], reqConfirms: number})` - deploys wallet contract into blockchain.

    -   owners - an array of custodian public keys of custodians.
        Make sure all public keys are enclosed in quotes and start with 0x.

    -   reqConfirms - number of signatures needed to confirm a transaction

-   `async getAddress()` - Returns account address.

-   `async getAccount()` - Returns parsed data of the account.
 
## Sample source code

Find the sample that demonstrates WalletKit usage source code here: [src/example.ts](./src/example.ts)

## Run test or example

To run test or example you have to run EverOS SE

```bash
everdev se start

# if you want to run test
npm test

# if you want to run example
npm run build
node dist/example.js
``
```
