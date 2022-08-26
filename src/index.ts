import * as fs from "fs"
import * as path from "path"
import { Account, ContractPackage } from "@eversdk/appkit"
import { ResultOfProcessMessage, Signer, TonClient } from "@eversdk/core"

export enum WalletTypes {
    SafeMultisig = "SafeMultisigWallet",
    SetcodeMultisig = "SetcodeMultisigWallet",
    Surf = "SurfMultisigWallet",
}

export type CreateOptions = { signer: Signer; client: TonClient }

export type DeployMultisigOpts = {
    owners: string[]
    reqConfirms: number
}
/*
 * At the moment we can deploy Multisig wallets only
 */
export type DeployOpts = DeployMultisigOpts

export class Wallet {
    static contractPackage: ContractPackage
    account: Account
    private constructor(opts: CreateOptions) {
        this.account = new Account(Wallet.contractPackage, opts)
    }

    static create(wallet: WalletTypes, options: CreateOptions) {
        if (!Wallet.contractPackage) {
            Wallet.contractPackage = Wallet.loadContract(`./assets/${wallet}`)
        }
        return new Wallet(options)
    }
    static loadContract(name: string): ContractPackage {
        function load(suffix: string) {
            return fs.readFileSync(path.resolve(__dirname, `${name}${suffix}`))
        }
        return {
            abi: JSON.parse(load(".abi.json").toString()),
            tvc: load(".tvc").toString("base64"),
        }
    }

    deploy(params: DeployOpts): Promise<ResultOfProcessMessage> {
        const opts = {
            initFunctionName: "constructor",
            initInput: {
                owners: params.owners,
                reqConfirms: params.reqConfirms,
            },
        }
        return this.account.deploy(opts)
    }
    getAccount() {
        return this.account.getAccount()
    }
    getAddress() {
        return this.account.getAddress()
    }
}
