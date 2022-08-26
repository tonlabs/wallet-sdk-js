"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const appkit_1 = require("@eversdk/appkit");
const core_1 = require("@eversdk/core");
const lib_node_1 = require("@eversdk/lib-node");
const index_1 = require("./index");
core_1.TonClient.useBinaryLibrary(lib_node_1.libNode);
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const client = new core_1.TonClient({
            network: {
                endpoints: [(_a = process.env.TON_NETWORK_ADDRESS) !== null && _a !== void 0 ? _a : "http://localhost"],
            },
        });
        /* Generate random keypair */
        const keyPair = yield client.crypto.generate_random_sign_keys();
        console.log("Save keys:", keyPair);
        /* Create Signer instance */
        const signer = (0, core_1.signerKeys)(keyPair);
        console.log("Create Surf wallet instance");
        const surfWallet = index_1.Wallet.create(index_1.WalletTypes.Surf, { signer, client });
        const address = yield surfWallet.getAddress();
        console.log("Your wallet will be deployed to address:" + address);
        /*
         * Before any contract can be deployed on the network,
         * its address must have some positive balance, so send some tokens to
         * this address before deploying the contract.
         * In this example, we are deploying a wallet to EverosSE,
         * so we use ability of AppKit to use its giver for EverosSE.
         */
        const giver = yield appkit_1.Account.getGiverForClient(client);
        yield giver.sendTo(address, 1e9);
        console.log("Account balance was topped-up");
        /*
         * Let's pretend we want have two owners. Create key pairs for them.
         */
        const firstOwnerKeys = yield client.crypto.generate_random_sign_keys();
        const secondOwnerKeys = yield client.crypto.generate_random_sign_keys();
        /*
         * Wallet deploy parameters:
         *
         * @param owners: string[] - an array of custodian public keys of custodians.
         * Make sure all public keys are enclosed in quotes and start with 0x.
         *
         * @param reqConfirms: number - number of signatures needed to confirm a transaction
         */
        yield surfWallet.deploy({
            owners: ["0x" + firstOwnerKeys.public, "0x" + secondOwnerKeys.public],
            reqConfirms: 1,
        });
        const { balance } = yield surfWallet.getAccount();
        console.log(`Wallet is deployed! Its balance is ${balance}`);
        client.close();
    });
}
main().catch(err => {
    console.log(err);
    process.exit(1);
});
//# sourceMappingURL=example.js.map