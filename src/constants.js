export const createAgreementPagePath = "/create-new-agreement";
export const loadingPagePath = "/loading";
export const confirmAgreementPagePath = "/confirm-new-agreement";
export const agreementPagePath = "/view-agreement/:agreementId";
export const myAgreementsPagePath = "/my-agreements";
export const infoPagePath = "/info";
export const indexPagePath = "/";
export const publicUrlPathPrefix = window.location.host.indexOf("github.io") !== -1
    ? "/trickle-dapp-frontend"
    : "";

export const durationOptions = [
    { value: 60, label: "Minutes" },
    { value: 60 * 60 * 24, label: "Days" },
    { value: 60 * 60 * 24 * 7, label: "Weeks" },
    { value: Math.round(60 * 60 * 24 * 30.436849141666666), label: "Months" },
    { value: Math.round(60 * 60 * 24 * 365.2421897), label: "Years" }
];
export const defaultDurationOption = durationOptions[3];
export const defaultDurationCounter = 3;

export const contractsByNetwork = {
    "homestead": {address: "trickle.ethglobal.eth", block: 7607998}, // 0x635c36d72dcd6fbe72f84dff2f2d1b3d8bef47d2
    "ropsten": {address: "0x19631910d87516db1f1fc2047c1393db0eb8b32e", block: 5444958}
};

export const confirmationsToWait = 1;

export const demoTokens = [
    "USD",
    "DAI",
    "DREAM",
    "BAT"
];

export const ethNetworksByChainId = {
    1: {
        chainId: 1,
        ensAddress: "0x314159265dd8dbb310642f98f50c066173c1259b",
        name: "homestead"
    },
    3: {
        chainId: 3,
        ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
        name: "ropsten"
    },
    2: {
        chainId: 2,
        name: "morden"
    },
    4: {
        chainId: 4,
        ensAddress: "0xe7410170f87102DF0055eB195163A03B7F2Bff4A",
        name: "rinkeby"
    },
    5: {
        chainId: 5,
        ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
        name: "goerli"
    },
    42: {
        chainId: 42,
        name: "kovan"
    },
    61: {
        chainId: 61,
        name: "classic"
    },
    62: {
        chainId: 62,
        name: "classicTestnet"
    }
};