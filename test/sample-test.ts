import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["Fibonacci"]>;
let signer: Signer;
let user: Account;
describe("Test Sample contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy contract", async function () {
      const INIT_STATE = 0;
      const { contract } = await locklift.factory.deployContract({
        contract: "Fibonacci",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: locklift.utils.getRandomNonce(),
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
      const NEW_STATE = 1;
      const nextNumber = await sample.methods
        .calculateNextNumber()
        .call()
        .then(res => res._nextNumber);
      const a = await sample.methods
        .setNumber({ _newNumber: nextNumber })
        .sendExternal({ publicKey: signer.publicKey });

      const response = await sample.methods.getDetails({}).call();
      console.log(response);
    });
  });
});
