import { Contract, fromNano, Signer, toNano, WalletTypes } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";
import { Account } from "everscale-standalone-client";

let ping: Contract<FactorySource["Ping(fee)"]>;
let pong: Contract<FactorySource["Pong(fee)"]>;
let user: Account;
let signer1: Signer;

describe("PingPong", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy ping and pong", async function () {
      await locklift.factory.accounts
        .addNewAccount({
          type: WalletTypes.EverWallet,
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => (user = res.account));
      ping = await locklift.factory
        .deployContract({
          contract: "Ping(fee)",
          initParams: {},
          constructorParams: {},
          value: toNano(1),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      pong = await locklift.factory
        .deployContract({
          contract: "Pong(fee)",
          initParams: {},
          constructorParams: {},
          value: toNano(1),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);
    });

    it("Interact with contract", async function () {
      const { traceTree } = await locklift.tracing.trace(
        ping.methods
          .ping({
            _message: "Hello, world!",
            _pong: pong.address,
          })
          .send({
            from: user.address,
            amount: toNano(1),
          }),
      );
      await traceTree?.beautyPrint();

      expect(
        await pong.methods
          .countOfCalls()
          .call()
          .then(res => res.countOfCalls),
      ).to.be.equal("1");
    });
  });
});
