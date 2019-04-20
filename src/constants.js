export const createAgreementPagePath = "/create-new-agreement";
export const loadingPagePath = "/loading";
export const confirmAgreementPagePath = "/confirm-new-agreement";
export const agreementPagePath = "/view-agreement/:agreementId";
export const indexPagePath = "/";
export const publicUrlPathPrefix = window.location.host.indexOf("github.io") !== -1
    ? "/trickle-dapp-frontend"
    : "";

export const durationOptions = [
    { value: 60 * 60 * 24, label: "Days" },
    { value: 60 * 60 * 24 * 7, label: "Weeks" },
    { value: Math.round(60 * 60 * 24 * 30.436849141666666), label: "Months" },
    { value: Math.round(60 * 60 * 24 * 365.2421897), label: "Years" }
];
export const defaultDurationOption = durationOptions[2];
export const defaultDurationCounter = 3;