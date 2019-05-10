import { publicUrlPathPrefix } from "./constants";
import { Toast } from "toaster-js";

export function getPathForRouter (path, params = {}) {
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

export function getEtherscanLinkToAddress (address, networkName) {
    return `https://${ networkName === "homestead" || !networkName ? "" : (networkName + ".") }etherscan.io/address/${ address }`;
}

function fallbackCopyTextToClipboard (text) {

    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let e;
    try {
        e = !document.execCommand("copy");
    } catch (err) {
        e = err;
    }

    if (e) {
        new Toast("Unable to copy text for some reason...", Toast.TYPE_ERROR);
    }

    document.body.removeChild(textArea);

}

export async function copyTextToClipboard (text) {
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    }
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        new Toast(`Unable to copy text: ${ e }`, Toast.TYPE_ERROR);
    }
}