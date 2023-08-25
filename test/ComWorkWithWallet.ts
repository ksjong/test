import {Contract, fromNano, Signer, toNano, WalletTypes} from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";
import {Account} from "everscale-standalone-client";

let Company: Contract<FactorySource["Company"]>;
let Company2: Contract<FactorySource["Company"]>;
let Worker: Contract<FactorySource["Worker"]>;
let Worker2: Contract<FactorySource["Worker"]>;
let Worker3: Contract<FactorySource["Worker"]>;
let Worker4: Contract<FactorySource["Worker"]>;

let companyAccount: Account;
let companyAccount2: Account;
let workerAccount: Account;
let workerAccount2: Account;
let workerAccount3: Account;
let workerAccount4: Account;


let signer1: Signer;
let signer2: Signer;
let signer3: Signer;
let signer4: Signer;
let signer5: Signer;
let signer6: Signer;

describe("Company Worker Test", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
    signer2 = (await locklift.keystore.getSigner("1"))!;
    signer3 = (await locklift.keystore.getSigner("2"))!;
    signer4 = (await locklift.keystore.getSigner("3"))!;
    signer5 = (await locklift.keystore.getSigner("4"))!;
    signer6 = (await locklift.keystore.getSigner("5"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Company and Worker", async function () {
      const { code: workerCode } = locklift.factory.getContractArtifacts("Worker");
      const signers = [signer3, signer4, signer5, signer6]
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer1.publicKey,

            })
            .then(res => (companyAccount = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer2.publicKey,

            })
            .then(res => (companyAccount2 = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer3.publicKey,

            })
            .then(res => (workerAccount = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer4.publicKey,

            })
            .then(res => (workerAccount2 = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer5.publicKey,

            })
            .then(res => (workerAccount3 = res.account));
        await locklift.factory.accounts
            .addNewAccount({
                type: WalletTypes.EverWallet,
                value: toNano(10),
                publicKey: signer6.publicKey,

            })
            .then(res => (workerAccount4 = res.account));
      Company = await locklift.factory
        .deployContract({
          contract: "Company",
          initParams: {
            workerContractCode: workerCode,
          },
          constructorParams: {
            _salary: 100,
            _owner : companyAccount.address
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);
      Company2 = await locklift.factory
        .deployContract({
          contract: "Company",
          initParams: {
            workerContractCode: workerCode,
          },
          constructorParams: {
            _salary: 100,
            _owner: companyAccount2.address
          },
          value: toNano(10),
          publicKey: signer2.publicKey,
        })
        .then(res => res.contract);
      Worker = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            workerPubkey: `0x${signer3.publicKey}`,
            companyAddress: Company.address,
          },
          constructorParams: {},
          value: toNano(10),
          publicKey: signer3.publicKey,
        })
        .then(res => res.contract);

      Worker2 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            workerPubkey: `0x${signer4.publicKey}`,
            companyAddress: Company.address,
            // comp_name: "Company",
          },
          constructorParams: {},
          value: toNano(10),
          publicKey: signer4.publicKey,
        })
        .then(res => res.contract);

      Worker3 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            workerPubkey: `0x${signer5.publicKey}`,
            companyAddress: Company2.address,
            // comp_name: "Company2",
          },
          constructorParams: {},
          value: toNano(10),
          publicKey: signer5.publicKey,
        })
        .then(res => res.contract);

      Worker4 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            workerPubkey: `0x${signer6.publicKey}`,
            companyAddress: Company2.address,
            // comp_name: "Company2",
          },
          constructorParams: {},
          value: toNano(10),
          publicKey: signer6.publicKey,
        })
        .then(res => res.contract);
    });

    // it("Bad worker", async function () {
    //   const { traceTree } = await locklift.tracing.trace(
    //     Worker4.methods.
    //     badWork({
    //         company: Company.address
    //     }).send({
    //         from: Worker4.address,
    //         amount: toNano(1),
    //     }),
    //   );
    // });

    it("Interact with contract", async function () {
      const { traceTree: compWork1Register } = await locklift.tracing.trace(
        Company.methods.
        registerWorker({
            _worker: Worker.address
        }).send({
          from: companyAccount.address,
          amount: toNano(1),
        }),
      );
      await compWork1Register?.beautyPrint();

      const { traceTree: compWork2Register } = await locklift.tracing.trace(
        Company.methods.
        registerWorker({
            _worker: Worker2.address
        }).send({
          from: companyAccount.address,
          amount: toNano(1),
        }),
      );
      await compWork2Register?.beautyPrint();
      const { traceTree: comp2Work3Register } = await locklift.tracing.trace(
        Company2.methods.
        registerWorker({
            _worker: Worker3.address
        }).send({
          from: companyAccount2.address,
          amount: toNano(1),
        }),
      );
      await comp2Work3Register?.beautyPrint();
      const { traceTree: comp2Work4Register } = await locklift.tracing.trace(
        Company2.methods.
        registerWorker({
            _worker: Worker4.address
        }).send({
          from: companyAccount2.address,
          amount: toNano(1),
        }),
      );

      await comp2Work4Register?.beautyPrint();

      const { traceTree: UserWorking } = await locklift.tracing.trace(
        Worker.methods.
        working({}).
        send({
            from: workerAccount.address,
            amount: toNano(1),
        }),
      );
      await UserWorking?.beautyPrint();

      const { traceTree: UserWorking2 } = await locklift.tracing.trace(
        Worker2.methods.
        working({}).
        send({
          from: workerAccount2.address,
          amount: toNano(1),
        }),
      );
      await UserWorking2?.beautyPrint();

      const { traceTree: UserWorking3 } = await locklift.tracing.trace(
        Worker3.methods.
        working({}).
        send({
          from: workerAccount3.address,
          amount: toNano(1),
        }),
      );
      await UserWorking3?.beautyPrint();

      const { traceTree: UserWorking4 } = await locklift.tracing.trace(
        Worker4.methods.
        working({}).
        send({
          from: workerAccount4.address,
          amount: toNano(1),
        }),
      );
      await UserWorking4?.beautyPrint();
    });
  });
});
