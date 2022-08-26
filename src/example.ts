import { Account } from "@eversdk/appkit"
import { TonClient, signerKeys } from "@eversdk/core"
import { libNode } from "@eversdk/lib-node"

import { Wallet, WalletTypes } from "./index"

TonClient.useBinaryLibrary(libNode)

async function main() {
    const client = new TonClient({
        network: {
            endpoints: [process.env.TON_NETWORK_ADDRESS ?? "http://localhost"],
        },
    })

    /* Generate random keypair */
    const keyPair = await client.crypto.generate_random_sign_keys()
    console.log("Save keys:", keyPair)

    /* Create Signer instance */
    const signer = signerKeys(keyPair)

    console.log("Create Surf wallet instance")

    const surfWallet = Wallet.create(WalletTypes.Surf, { signer, client })

    const address = await surfWallet.getAddress()
    console.log("Your wallet will be deployed to address:" + address)
    /*
     * Before any contract can be deployed on the network,
     * its address must have some positive balance, so send some tokens to
     * this address before deploying the contract.
     * In this example, we are deploying a wallet to EverosSE,
     * so we use ability of AppKit to use its giver for EverosSE.
     */

    const giver = await Account.getGiverForClient(client)
    await giver.sendTo(address, 1e9)

    console.log("Account balance was topped-up")

    /*
     * Let's pretend we want have two owners. Create key pairs for them.
     */
    const firstOwnerKeys = await client.crypto.generate_random_sign_keys()
    const secondOwnerKeys = await client.crypto.generate_random_sign_keys()
    /*
     * Wallet deploy parameters:
     *
     * @param owners: string[] - an array of custodian public keys of custodians.
     * Make sure all public keys are enclosed in quotes and start with 0x.
     *
     * @param reqConfirms: number - number of signatures needed to confirm a transaction
     */
    await surfWallet.deploy({
        owners: ["0x" + firstOwnerKeys.public, "0x" + secondOwnerKeys.public],
        reqConfirms: 1,
    })
    const { balance } = await surfWallet.getAccount()
    console.log(`Wallet is deployed! Its balance is ${balance}`)

    client.close()
}

main().catch(err => {
    console.log(err)
    process.exit(1)
})
