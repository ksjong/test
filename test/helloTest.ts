import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["helloTest"]>;
let signer: Signer;

let user: Account;
describe("helloTest", async function () {
    before(async () => {
        signer = (await locklift.keystore.getSigner("0"))!;
    });
    describe("Contracts", async function () {
        it("Deploy contract", async function () {

            const { contract } = await locklift.factory.deployContract({
                contract: "helloTest",
                publicKey: signer.publicKey,
                initParams: {
                },
                constructorParams: {},
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
            await sample.methods.setName({p_Name: 'kim'}).sendExternal({publicKey:signer.publicKey});
            const response = await sample.methods.getDetails({}).call();
            expect(response.p_Name).to.be.equal("??");
            console.log(response);
        });
    });
});