import * as fs from "fs"
import * as path from "path"
import { Account, AccountGiver, ContractPackage } from "@eversdk/appkit"
import { ResultOfProcessMessage, Signer, TonClient } from "@eversdk/core"

export enum WalletTypes {
    SafeMultisig = "SafeMultisigWallet",
    SetcodeMultisig = "SetcodeMultisigWallet",
    Surf = "SurfMultisigWallet",
}

export type CreateOptions = { signer: Signer; client: TonClient }

export type InstallOptions = {
    owners: string[]
    reqConfirms: number
    useGiver?: true | AccountGiver
}

export class Wallet extends Account {
    static contractPackage: ContractPackage

    private constructor(options: CreateOptions) {
        super(Wallet.contractPackage, options)
    }

    static create(wallet: WalletTypes, options: CreateOptions) {
        if (!Wallet.contractPackage) {
            Wallet.contractPackage = Wallet.loadContract(`../assets/${wallet}`)
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

    install(params: InstallOptions): Promise<ResultOfProcessMessage> {
        const opts = {
            initFunctionName: "constructor",
            initInput: {
                owners: params.owners,
                reqConfirms: params.reqConfirms,
            },
            useGiver: params?.useGiver,
        }
        return super.deploy(opts)
    }
}
