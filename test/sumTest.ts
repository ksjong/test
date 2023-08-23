import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["NumSequence"]>;
let signer: Signer;

let user: Account;
describe("NumSequence", async function () {
    before(async () => {
        signer = (await locklift.keystore.getSigner("0"))!;
    });
    describe("Contracts", async function () {
        it("Deploy contract", async function () {

            const { contract } = await locklift.factory.deployContract({
                contract: "NumSequence",
                publicKey: signer.publicKey,
                initParams: {
                },
                constructorParams: {
                    length : 5
                },
                value: locklift.utils.toNano(2),
            });
            sample = contract;
            user = await locklift.factory.accounts
                .addNewAccount({
                    type: WalletTypes.EverWallet,
                    value: toNano(10),
                    publicKey: signer.publicKey,
                })
                .then(res => res.account);
            expect(await locklift.provider.getBalance(sample.address).then(balance => Number(balance))).to.be.above(0);
        });

        it("Interact with contract", async function () {
            const {arrayInt} = await sample.methods.arrayInt().call()

            const sumArray = arrayInt.map(Number).reduce((a,b) => a+b,  0);
            await sample.methods.sum({inputNum : 10}).sendExternal({publicKey:signer.publicKey});
            const response = await sample.methods.getSum({}).call();
            expect(parseInt(response.sum)).to.be.equal(sumArray);
            console.log(response);
        });
    });
});