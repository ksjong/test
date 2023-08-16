const fibonacciAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[],"outputs":[]},{"name":"setNumber","inputs":[{"name":"_newNumber","type":"uint256"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"_firstNumber","type":"uint256"},{"name":"_secondNumber","type":"uint256"}]},{"name":"calculateNextNumber","inputs":[],"outputs":[{"name":"_nextNumber","type":"uint256"}]}],"data":[{"key":1,"name":"_nonce","type":"uint32"}],"events":[{"name":"StateChange","inputs":[{"name":"firstNumber","type":"uint256"},{"name":"secondNumber","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint32"},{"name":"firstNumber","type":"uint256"},{"name":"secondNumber","type":"uint256"}]} as const
const simpleWalletAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_pubKey","type":"uint256"}],"outputs":[]},{"name":"sendToMyFriend","inputs":[{"name":"dest","type":"address"},{"name":"value","type":"uint128"}],"outputs":[]},{"name":"pubKey","inputs":[],"outputs":[{"name":"pubKey","type":"uint256"}]},{"name":"balance","inputs":[],"outputs":[{"name":"balance","type":"uint128"}]}],"data":[],"events":[{"name":"BalanceChanged","inputs":[{"name":"oldBalance","type":"uint128"},{"name":"newBalance","type":"uint128"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"pubKey","type":"uint256"},{"name":"balance","type":"uint128"}]} as const

export const factorySource = {
    Fibonacci: fibonacciAbi,
    SimpleWallet: simpleWalletAbi
} as const

export type FactorySource = typeof factorySource
export type FibonacciAbi = typeof fibonacciAbi
export type SimpleWalletAbi = typeof simpleWalletAbi
