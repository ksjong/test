import {Contract, Signer, toNano, WalletTypes} from "locklift";
import {FactorySource} from "../build/factorySource";
import {Account} from "everscale-standalone-client";

let bank: Contract<FactorySource["Bank"]>;
let bankAccount : Contract<FactorySource["BankAccount"]>;

let userAccount: Account;
let bankWallet: Account;
let signer1: Signer;

describe("BankUserTest", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Bank and User Contract", async function () {
      await locklift.factory.accounts
        .addNewAccount({
          type: WalletTypes.EverWallet,
          value: toNano(10),
          publicKey: signer1.publicKey,

        })
        .then(res => (userAccount = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer1.publicKey,

            })
            .then(res => (bankWallet = res.account));
        const { code: userCode } = locklift.factory.getContractArtifacts("BankAccount");
      bank = await locklift.factory
        .deployContract({
          contract: "Bank",
          initParams: {
            userContractCode: userCode,
          },
          constructorParams: {
            _interestRate: 5,
            // _owner: `0x${signer1.publicKey}`,
              _owner: bankWallet.address
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      bankAccount = await locklift.factory
        .deployContract({
          contract: "BankAccount",
          initParams: {
                bankAddress: bank.address
          },
          constructorParams: {
            _initialBalance: 222,
              _userAddress: userAccount.address
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);
    });

    it("Interact with contract", async function () {
      const { traceTree } = await locklift.tracing.trace(
        bankAccount.methods
          .borrowMoney({
            _amount: 1000,
          })
          .send({
            from: userAccount.address,
            amount: toNano(1),
          }),
      );
      await traceTree?.beautyPrint();
      const totalrepayAmount = await bank.methods.calculating().call();
      // \

      const { traceTree: repaid } = await locklift.tracing.trace(
        bankAccount.methods.
        repayLoan({
            _repayAmount: Number(totalrepayAmount.value0)
        }).send({
          from: userAccount.address,
          amount: toNano(1),
        }),
      );
      await repaid?.beautyPrint();

      const response = await bank.methods.getProfit({}).call();
      console.log(response);
      const response2 = await bankAccount.methods.getMoney().call();
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
