import { Account, ContractPackage } from "@eversdk/appkit"
import { ResultOfProcessMessage, Signer, TonClient } from "@eversdk/core"
export declare enum WalletTypes {
    SafeMultisig = "SafeMultisigWallet",
    SetcodeMultisig = "SetcodeMultisigWallet",
    Surf = "SurfMultisigWallet",
}
export type CreateOptions = {
    signer: Signer
    client: TonClient
}
export type DeployMultisigOpts = {
    owners: string[]
    reqConfirms: number
}
export type DeployOpts = DeployMultisigOpts
export declare class Wallet {
    static contractPackage: ContractPackage
    account: Account
    private constructor()
    static create(wallet: WalletTypes, options: CreateOptions): Wallet
    static loadContract(name: string): ContractPackage
    deploy(params: DeployOpts): Promise<ResultOfProcessMessage>
    getAccount(): Promise<any>
    getAddress(): Promise<string>
}
