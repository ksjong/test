import { Contract, fromNano, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";

let Company: Contract<FactorySource["Company"]>;
let Company2: Contract<FactorySource["Company"]>;
let Worker: Contract<FactorySource["Worker"]>;
let Worker2: Contract<FactorySource["Worker"]>;
let Worker3: Contract<FactorySource["Worker"]>;
let Worker4: Contract<FactorySource["Worker"]>;

let Owner: Signer;
let Owner2: Signer;
let user: Signer;
let user2: Signer;
let user3: Signer;
let user4: Signer;

describe("Company Worker Test", async function () {
  before(async () => {
    Owner = (await locklift.keystore.getSigner("0"))!;
    Owner2 = (await locklift.keystore.getSigner("1"))!;
    user = (await locklift.keystore.getSigner("2"))!;
    user2 = (await locklift.keystore.getSigner("3"))!;
    user3 = (await locklift.keystore.getSigner("4"))!;
    user4 = (await locklift.keystore.getSigner("5"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Company and Worker", async function () {
      const { code: workerCode } = locklift.factory.getContractArtifacts("Worker");
      // const { code: worker2Code } = locklift.factory.getContractArtifacts("Worker2");
      Company = await locklift.factory
        .deployContract({
          contract: "Company",
          initParams: {
            workerContractCode: workerCode,
          },
          constructorParams: {
            _owner: `0x${Owner.publicKey}`,
            _salary: 100,
          },
          value: toNano(10),
          publicKey: Owner.publicKey,
        })
        .then(res => res.contract);
      Company2 = await locklift.factory
        .deployContract({
          contract: "Company",
          initParams: {
            workerContractCode: workerCode,
          },
          constructorParams: {
            _owner: `0x${Owner2.publicKey}`,
            _salary: 100,
          },
          value: toNano(10),
          publicKey: Owner2.publicKey,
        })
        .then(res => res.contract);
      Worker = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            worker_pubkey: `0x${user.publicKey}`,
            company_address: Company.address,
            // comp_name: "Company",
          },
          constructorParams: {
            // _company: Company.address,
          },
          value: toNano(10),
          publicKey: user.publicKey,
        })
        .then(res => res.contract);

      Worker2 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            worker_pubkey: `0x${user2.publicKey}`,
            company_address: Company2.address,
            // comp_name: "Company",
          },
          constructorParams: {},
          value: toNano(10),
          publicKey: user2.publicKey,
        })
        .then(res => res.contract);

      Worker3 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            worker_pubkey: `0x${user3.publicKey}`,
            company_address: Company2.address,
            // comp_name: "Company2",
          },
          constructorParams: {
            // _company: Company2.address,
          },
          value: toNano(10),
          publicKey: user3.publicKey,
        })
        .then(res => res.contract);

      Worker4 = await locklift.factory
        .deployContract({
          contract: "Worker",
          initParams: {
            worker_pubkey: `0x${user4.publicKey}`,
            company_address: Company2.address,
            // comp_name: "Company2",
          },
          constructorParams: {
            // _company: Company2.address,
          },
          value: toNano(10),
          publicKey: user4.publicKey,
        })
        .then(res => res.contract);
    });

    it("Bad worker", async function () {
      const { traceTree } = await locklift.tracing.trace(
        Worker4.methods.badWork({ company: Company.address }).sendExternal({ publicKey: user4.publicKey }),
      );
    });

    it("Interact with contract", async function () {
      const { traceTree: compWork1Register } = await locklift.tracing.trace(
        Company.methods.registerWorker({ _worker: Worker.address }).sendExternal({
          publicKey: Owner.publicKey,
        }),
      );
      await compWork1Register?.beautyPrint();
      const { traceTree: compWork2Register } = await locklift.tracing.trace(
        Company.methods.registerWorker({ _worker: Worker2.address }).sendExternal({
          publicKey: Owner.publicKey,
        }),
      );
      await compWork2Register?.beautyPrint();
      const { traceTree: comp2Work3Register } = await locklift.tracing.trace(
        Company2.methods.registerWorker({ _worker: Worker3.address }).sendExternal({
          publicKey: Owner2.publicKey,
        }),
      );
      await comp2Work3Register?.beautyPrint();
      const { traceTree: comp2Work4Register } = await locklift.tracing.trace(
        Company2.methods.registerWorker({ _worker: Worker4.address }).sendExternal({
          publicKey: Owner2.publicKey,
        }),
      );

      await comp2Work4Register?.beautyPrint();

      const { traceTree: UserWorking } = await locklift.tracing.trace(
        Worker.methods.working({ _comp_name: "Company" }).sendExternal({
          publicKey: user.publicKey,
        }),
      );
      await UserWorking?.beautyPrint();
      const { traceTree: UserWorking2 } = await locklift.tracing.trace(
        Worker2.methods.working({ _comp_name: "Company" }).sendExternal({
          publicKey: user2.publicKey,
        }),
      );
      await UserWorking2?.beautyPrint();

      const { traceTree: UserWorking3 } = await locklift.tracing.trace(
        Worker3.methods.working({ _comp_name: "Company2" }).sendExternal({
          publicKey: user3.publicKey,
        }),
      );
      await UserWorking3?.beautyPrint();
      const { traceTree: UserWorking4 } = await locklift.tracing.trace(
        Worker4.methods.working({ _comp_name: "Company2" }).sendExternal({
          publicKey: user4.publicKey,
        }),
      );
      await UserWorking4?.beautyPrint();
    });
  });
});
