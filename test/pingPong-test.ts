import { Contract, fromNano, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";

let ping: Contract<FactorySource["Ping"]>;
let pong: Contract<FactorySource["Pong"]>;

let signer1: Signer;

describe("PingPong", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy ping and pong", async function () {
      ping = await locklift.factory
        .deployContract({
          contract: "Ping",
          initParams: {},
          constructorParams: {},
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      pong = await locklift.factory
        .deployContract({
          contract: "Pong",
          initParams: {},
          constructorParams: {},
          value: toNano(10),
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
          .sendExternal({
            publicKey: signer1.publicKey,
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
