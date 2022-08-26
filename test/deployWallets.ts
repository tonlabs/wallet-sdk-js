import { Account } from "@eversdk/appkit"
import { TonClient, signerKeys } from "@eversdk/core"
import { libNode } from "@eversdk/lib-node"

import { Wallet, WalletTypes } from "../src"

beforeAll(() => {
    jest.setTimeout(100000)
    TonClient.useBinaryLibrary(libNode)
    TonClient.defaultConfig = {
        network: {
            endpoints: ["http://localhost"],
        },
    }
})

test.each([
    WalletTypes.SafeMultisig,
    WalletTypes.SetcodeMultisig,
    WalletTypes.Surf,
])("Deploy the %s wallet", async (wtype: WalletTypes) => {
    const client = TonClient.default

    const wallet = Wallet.create(wtype, {
        signer: signerKeys(await client.crypto.generate_random_sign_keys()),
        client,
    })

    const address = await wallet.getAddress()
    expect(address.substring(0, 2)).toEqual("0:")

    const giver = await Account.getGiverForClient(client)
    await giver.sendTo(address, 1e9)

    await wallet.deploy({
        owners: [
            "0x8868adbf012ebc349ced852fdcf5b9d55d1873a68250fae1be609286dd962582",
            "0xa0e16ccff0c7bf4f29422b33ec1c9187200e9bd949bb2dd4c78415009d50778a",
        ],
        reqConfirms: 1,
    })
    const balance: string = (await wallet.getAccount()).balance
    expect(Number.parseInt(balance)).toBeGreaterThan(500_000_000)
})

afterAll(() => TonClient.default.close())
