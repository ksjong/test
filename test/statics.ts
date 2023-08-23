import { expect } from "chai";
import { Contract, getRandomNonce, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Account } from "everscale-standalone-client";

let sample: Contract<FactorySource["Fibonacci"]>;
let signer: Signer;
let signer1: Signer;
let user: Account;
describe("Statics", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    signer1 = (await locklift.keystore.getSigner("1"))!;
  });
  describe("Contracts", async function () {
    it("Deploy contract", async function () {
      const { contract: bobContract } = await locklift.tracing.trace(
        locklift.factory.deployContract({
          contract: "Bob",
          value: toNano(2),
          publicKey: signer.publicKey,
          initParams: {
            name: "BOB",
            age: 18,
          },
          constructorParams: {},
        }),
      );
      const { code: bobCode } = locklift.factory.getContractArtifacts("Bob");
      const { contract: aliceContract } = await locklift.tracing.trace(
        locklift.factory.deployContract({
          contract: "Alice",
          value: toNano(2),
          publicKey: signer.publicKey,
          initParams: {
            city: "Moscow",
            bobContractCode: bobCode,
          },
          constructorParams: {
            _bobPubkey: `0x${signer.publicKey}`,
          },
        }),
      );
      console.log(await aliceContract.methods.city().call());

      const { traceTree } = await locklift.tracing.trace(
        bobContract.methods
          .callAlice({
            _alice: aliceContract.address,
            _newAliceCity: "Saint-Petersburg",
          })
          .sendExternal({
            publicKey: signer.publicKey,
          }),
      );
      await traceTree?.beautyPrint();
    });
  });
});
