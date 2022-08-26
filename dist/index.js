"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.WalletTypes = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const appkit_1 = require("@eversdk/appkit");
var WalletTypes;
(function (WalletTypes) {
    WalletTypes["SafeMultisig"] = "SafeMultisigWallet";
    WalletTypes["SetcodeMultisig"] = "SetcodeMultisigWallet";
    WalletTypes["Surf"] = "SurfMultisigWallet";
})(WalletTypes = exports.WalletTypes || (exports.WalletTypes = {}));
class Wallet {
    constructor(opts) {
        this.account = new appkit_1.Account(Wallet.contractPackage, opts);
    }
    static create(wallet, options) {
        if (!Wallet.contractPackage) {
            Wallet.contractPackage = Wallet.loadContract(`./assets/${wallet}`);
        }
        return new Wallet(options);
    }
    static loadContract(name) {
        function load(suffix) {
            return fs.readFileSync(path.resolve(__dirname, `${name}${suffix}`));
        }
        return {
            abi: JSON.parse(load(".abi.json").toString()),
            tvc: load(".tvc").toString("base64"),
        };
    }
    deploy(params) {
        const opts = {
            initFunctionName: "constructor",
            initInput: {
                owners: params.owners,
                reqConfirms: params.reqConfirms,
            },
        };
        return this.account.deploy(opts);
    }
    getAccount() {
        return this.account.getAccount();
    }
    getAddress() {
        return this.account.getAddress();
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=index.js.map