import { publicUrlPathPrefix } from "./constants";

export function getPathForRouter (path, params = {}) {
    console.log(params);
    return `${ publicUrlPathPrefix }${ path.replace(/\:([^\/]+)/g, (_, paramName) => {
        return params[paramName] || "UNDEFINED_GOOSE";
    }) }`;
}

export function shortenEthereumAddress (address) {
    if (typeof(address) !== "string") {
        return address;
    }
    return address.substr(0, 6) + ".." + address.substr(-4);
}