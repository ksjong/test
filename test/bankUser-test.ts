import { Contract, fromNano, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";

let bank: Contract<FactorySource["bank"]>;
let user: Contract<FactorySource["user"]>;

let signer1: Signer;

let signer2: Signer;

describe("BankUserTest", async function () {
  before(async () => {
      signer1 = (await locklift.keystore.getSigner("0"))!;
      signer2 = (await locklift.keystore.getSigner("1"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Bank and User Contract", async function () {
      const { code: userCode } = locklift.factory.getContractArtifacts("user");
      bank = await locklift.factory
        .deployContract({
          contract: "bank",
          initParams: {
            userContractCode: userCode,
          },
          constructorParams: {
            _interestRate: 5,
            _owner: `0x${signer1.publicKey}`,
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      user = await locklift.factory
        .deployContract({
          contract: "user",
          initParams: {
            userName: "KIM",
            password: "1234",
          },
          constructorParams: {
            _bank: bank.address,
            _initialBalance: 222,
          },
          value: toNano(10),
          publicKey: signer2.publicKey,
        })
        .then(res => res.contract);
    });

    it("Interact with contract", async function () {
      const { traceTree } = await locklift.tracing.trace(
        user.methods
          .borrowMoney({
            _amount: 1000,
          })
          .sendExternal({
            publicKey: signer1.publicKey,
          }),
      );
      await traceTree?.beautyPrint();
      const totalrepayAmount = await bank.methods.calulating().call();
      // Number(totalrepayAmount.value0
      {
        const { traceTree } = await locklift.tracing.trace(
          user.methods.repayLoan({ _repayAmount: 1030 }).sendExternal({
            publicKey: signer1.publicKey,
          }),
        );
        await traceTree?.beautyPrint();
      }
        const {traceTree:change rate} = await locklift.tracing.trace(
            user.m
        )
      const response = await bank.methods.getProfit({}).call();
      console.log(response);
      const response2 = await user.methods.getMoney().call();
      console.log(response2);
      // const { traceTree: SecondLoan } = await locklift.tracing.trace(
      //   user.methods
      //     .borrowMoney({
      //       _amount: 100000,
      //     })
      //     .sendExternal({
      //       publicKey: signer1.publicKey,
      //     }),
      // );
      // await SecondLoan?.beautyPrint();
      // const { traceTree: SecondRepaid } = await locklift.tracing.trace(
      //   user.methods.repayLoan({}).sendExternal({
      //     publicKey: signer1.publicKey,
      //   }),
      // );
      // await SecondRepaid?.beautyPrint();
      // const response2 = await bank.methods.getProfit({}).call();
      // console.log(response2);
    });
  });
});
